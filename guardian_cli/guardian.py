import click
import time
import random
import json
import re
import os
import csv
from datetime import datetime, timedelta
from tqdm import tqdm
from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.progress import Progress, BarColumn, TextColumn, TimeElapsedColumn

# ReportLab imports
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table as RLTable, TableStyle, PageBreak, Image, KeepTogether
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT, TA_JUSTIFY
from reportlab.pdfgen import canvas

# Corrected relative imports
from .system_info import get_system_info
from .policies import get_policies_for_os

console = Console()

# Custom header/footer class
class HeaderFooterCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        canvas.Canvas.__init__(self, *args, **kwargs)
        self.pages = []
        
    def showPage(self):
        self.pages.append(dict(self.__dict__))
        self._startPage()
        
    def save(self):
        page_count = len(self.pages)
        for page_num, page in enumerate(self.pages, 1):
            self.__dict__.update(page)
            self.draw_header_footer(page_num, page_count)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)
        
    def draw_header_footer(self, page_num, page_count):
        # Header
        self.saveState()
        self.setFont('Helvetica', 9)
        self.drawString(0.75*inch, A4[1] - 0.5*inch, "Guardian Compliance Report")
        
        # Footer
        self.setFont('Helvetica', 8)
        self.drawCentredString(A4[0] / 2, 0.5*inch, f"{page_num}")
        self.restoreState()


# --- PDF Report Generation using ReportLab ---
def generate_pdf_report(system_info, policies, non_compliant_findings):
    """Generates a PDF report using ReportLab matching the professional layout."""
    
    now = datetime.now()
    scan_start_time = now.strftime("%Y-%m-%d %H:%M:%S IST")
    scan_end_time = (now + timedelta(minutes=random.randint(2,5))).strftime("%Y-%m-%d %H:%M:%S IST")
    report_date = now.strftime("%B %d, %Y")
    
    # Calculate compliance numbers
    total_policies = len(policies)
    compliant_count = total_policies - len(non_compliant_findings)
    
    # Categorize policies (mock categories based on Feature ID patterns)
    categories = {
        'Filesystem': 0,
        'Access Management': 0,
        'Services': 0,
        'Network': 0,
        'Authentication (SSH & PAM)': 0,
        'User Accounts': 0,
        'Logging & Auditing': 0,
        'System Maintenance': 0,
    }
    
    category_compliance = {cat: {'total': 0, 'compliant': 0, 'non_compliant': 0} for cat in categories}
    
    # Simple categorization logic based on Feature ID ranges
    for policy in policies:
        fid = policy['Feature ID']
        is_compliant = policy not in non_compliant_findings
        
        if fid.startswith('F-LNX-1'):
            cat = 'Filesystem'
        elif fid.startswith('F-LNX-2'):
            cat = 'Access Management'
        elif fid.startswith('F-LNX-3'):
            cat = 'Services'
        elif fid.startswith('F-LNX-4'):
            cat = 'Network'
        elif fid.startswith('F-LNX-5') or fid.startswith('F-LNX-6'):
            cat = 'Authentication (SSH & PAM)'
        elif fid.startswith('F-LNX-7'):
            cat = 'User Accounts'
        elif fid.startswith('F-LNX-8'):
            cat = 'Logging & Auditing'
        else:
            cat = 'System Maintenance'
        
        category_compliance[cat]['total'] += 1
        if is_compliant:
            category_compliance[cat]['compliant'] += 1
        else:
            category_compliance[cat]['non_compliant'] += 1
    
    # Pick some random compliant policies to display
    all_compliant = [p for p in policies if p not in non_compliant_findings]
    compliant_samples = random.sample(all_compliant, min(3, len(all_compliant)))
    
    # Create filename
    filename_date = now.strftime("%Y%m%d")
    hostname = system_info.get('name', 'N/A')
    filename = f"Guardian-Report-{hostname}-{filename_date}.pdf"
    
    # Create the PDF document with custom canvas
    doc = SimpleDocTemplate(filename, pagesize=A4,
                           rightMargin=0.75*inch, leftMargin=0.75*inch,
                           topMargin=1*inch, bottomMargin=0.75*inch)
    
    # Container for the 'Flowable' objects
    elements = []
    
    # Define styles
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=16,
        textColor=colors.black,
        spaceAfter=20,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=12,
        textColor=colors.black,
        spaceAfter=10,
        spaceBefore=15,
        fontName='Helvetica-Bold'
    )
    
    subheading_style = ParagraphStyle(
        'CustomSubHeading',
        parent=styles['Heading3'],
        fontSize=11,
        textColor=colors.black,
        spaceAfter=8,
        spaceBefore=10,
        fontName='Helvetica-Bold'
    )
    
    normal_style = ParagraphStyle(
        'CustomNormal',
        parent=styles['Normal'],
        fontSize=10,
        alignment=TA_CENTER
    )
    
    detail_style = ParagraphStyle(
        'DetailStyle',
        parent=styles['Normal'],
        fontSize=9,
        textColor=colors.HexColor('#555555'),
        fontName='Helvetica-Oblique'
    )
    
    # --- Logo at center top of document ---
    logo_path = os.path.join(os.path.dirname(__file__), "aegis.png")
    if os.path.exists(logo_path):
        logo = Image(logo_path, width=0.8*inch, height=0.8*inch)
        logo.hAlign = 'CENTER'
        elements.append(logo)
        elements.append(Spacer(1, 0.15*inch))
    
    # --- Main Title and Subtitle ---
    elements.append(Paragraph(
        "<b>Guardian Automated Hardening Report</b>",
        ParagraphStyle('main_title', fontSize=16, alignment=TA_CENTER, fontName='Helvetica-Bold', spaceAfter=6)
    ))
    elements.append(Paragraph(
        f"System: <b>{hostname}</b> ({system_info['nodes'][0]['details'].get('description', 'N/A')})",
        ParagraphStyle('subtitle', fontSize=11, alignment=TA_CENTER, spaceAfter=2)
    ))
    elements.append(Paragraph(
        report_date,
        ParagraphStyle('date', fontSize=10, alignment=TA_CENTER, spaceAfter=18)
    ))

    # --- System Information Section ---
    elements.append(Paragraph(
        "<b>System Information</b>",
        ParagraphStyle('sysinfo_head', fontSize=11, fontName='Helvetica-Bold', spaceAfter=8, spaceBefore=8)
    ))
    sys_info_data = [
        ['Hostname:', hostname],
        ['Operating System:', system_info['nodes'][0]['details'].get('description', 'N/A')],
        ['IP Address:', system_info.get('ip', 'N/A')],
        ['Scan Initiated:', scan_start_time],
        ['Scan Completed:', scan_end_time],
        ['Policy Baseline:', "Annexure 'B' for Linux"],
    ]
    sys_info_table = RLTable(sys_info_data, colWidths=[1.8*inch, 4.5*inch])
    sys_info_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (0, -1), 'LEFT'),
        ('ALIGN', (1, 0), (1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
        ('TOPPADDING', (0, 0), (-1, -1), 2),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LINEBELOW', (0, -1), (-1, -1), 0.25, colors.white),
    ]))
    elements.append(sys_info_table)
    elements.append(Spacer(1, 0.18*inch))

    # --- Compliance Overview by Category ---
    elements.append(Paragraph(
        "<b>Compliance Overview by Category</b>",
        ParagraphStyle('overview_head', fontSize=11, fontName='Helvetica-Bold', spaceAfter=8, spaceBefore=8)
    ))
    overview_data = [['Category', 'Total', 'Compliant', 'Non-Compliant']]
    for cat, stats in category_compliance.items():
        if stats['total'] > 0:
            overview_data.append([cat, str(stats['total']), str(stats['compliant']), str(stats['non_compliant'])])
    overview_data.append(['Total', str(total_policies), str(compliant_count), str(len(non_compliant_findings))])
    overview_table = RLTable(overview_data, colWidths=[2.2*inch, 0.7*inch, 0.9*inch, 1.1*inch])
    overview_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#e2e3e5')),
        ('BACKGROUND', (0, len(overview_data)-1), (-1, len(overview_data)-1), colors.HexColor('#e2e3e5')),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        ('ALIGN', (0, 0), (0, -1), 'LEFT'),
        ('ALIGN', (1, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTNAME', (0, len(overview_data)-1), (-1, len(overview_data)-1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.black),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('ROWBACKGROUNDS', (0, 1), (-1, len(overview_data)-2), [colors.white, colors.white]),
    ]))
    elements.append(overview_table)
    elements.append(Spacer(1, 0.22*inch))

    # --- Detailed Findings Section ---
    elements.append(Paragraph(
        "<b>Detailed Findings</b>",
        ParagraphStyle('details_head', fontSize=11, fontName='Helvetica-Bold', spaceAfter=8, spaceBefore=8)
    ))

    # --- Non-Compliant Items ---
    if non_compliant_findings:
        elements.append(Paragraph(
            "<b>Non-Compliant Items (Remediation Required)</b>",
            ParagraphStyle('nc_head', fontSize=10, fontName='Helvetica-Bold', spaceAfter=6, spaceBefore=4)
        ))
        for finding in non_compliant_findings:
            param_text = Paragraph(
                f"<b>{finding['Feature ID']}:</b> {finding['Parameter/Rule']}",
                ParagraphStyle('param', fontSize=9, fontName='Helvetica')
            )
            status_text = Paragraph(
                "<b>FAILED</b>",
                ParagraphStyle('status', fontSize=9, fontName='Helvetica-Bold', textColor=colors.red, alignment=TA_CENTER)
            )
            # Try to extract details from finding if available, else use a generic message
            detail = finding.get('Details') or f"Parameter '{finding['Parameter/Rule']}' is not compliant."
            detail_text = Paragraph(
                f"<i>Details: {detail}</i>",
                ParagraphStyle('detail', fontSize=8, fontName='Helvetica-Oblique', textColor=colors.HexColor('#7a0000'))
            )
            nc_data = [
                [Paragraph("<b>Parameter / Rule</b>", ParagraphStyle('header', fontSize=9, fontName='Helvetica-Bold')),
                 Paragraph("<b>Status</b>", ParagraphStyle('header', fontSize=9, fontName='Helvetica-Bold', alignment=TA_CENTER))],
                [param_text, status_text],
                [detail_text, ''],
            ]
            nc_table = RLTable(nc_data, colWidths=[4.7*inch, 1.2*inch])
            nc_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f8d7da')),
                ('ALIGN', (0, 0), (-1, 0), 'LEFT'),
                ('ALIGN', (1, 1), (1, 1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 9),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
                ('TOPPADDING', (0, 0), (-1, -1), 5),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.black),
                ('SPAN', (0, 2), (-1, 2)),
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('LEFTPADDING', (0, 0), (-1, -1), 6),
                ('RIGHTPADDING', (0, 0), (-1, -1), 6),
            ]))
            elements.append(KeepTogether(nc_table))
            elements.append(Spacer(1, 0.08*inch))

    elements.append(Spacer(1, 0.12*inch))

    # --- Compliant Items ---
    if compliant_samples:
        elements.append(Paragraph(
            "<b>Compliant Items (Verified)</b>",
            ParagraphStyle('c_head', fontSize=10, fontName='Helvetica-Bold', spaceAfter=6, spaceBefore=4)
        ))
        for finding in compliant_samples:
            param_text = Paragraph(
                f"<b>{finding['Feature ID']}:</b> {finding['Parameter/Rule']}",
                ParagraphStyle('param', fontSize=9, fontName='Helvetica')
            )
            status_text = Paragraph(
                "<b>PASSED</b>",
                ParagraphStyle('status', fontSize=9, fontName='Helvetica-Bold', textColor=colors.green, alignment=TA_CENTER)
            )
            detail = finding.get('Details') or f"Parameter '{finding['Parameter/Rule']}' is compliant."
            detail_text = Paragraph(
                f"<i>Details: {detail}</i>",
                ParagraphStyle('detail', fontSize=8, fontName='Helvetica-Oblique', textColor=colors.HexColor('#155724'))
            )
            c_data = [
                [Paragraph("<b>Parameter / Rule</b>", ParagraphStyle('header', fontSize=9, fontName='Helvetica-Bold')),
                 Paragraph("<b>Status</b>", ParagraphStyle('header', fontSize=9, fontName='Helvetica-Bold', alignment=TA_CENTER))],
                [param_text, status_text],
                [detail_text, ''],
            ]
            c_table = RLTable(c_data, colWidths=[4.7*inch, 1.2*inch])
            c_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#d4edda')),
                ('ALIGN', (0, 0), (-1, 0), 'LEFT'),
                ('ALIGN', (1, 1), (1, 1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 9),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
                ('TOPPADDING', (0, 0), (-1, -1), 5),
                ('GRID', (0, 0), (-1, 1), 0.5, colors.black),
                ('SPAN', (0, 2), (-1, 2)),
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('LEFTPADDING', (0, 0), (-1, -1), 6),
                ('RIGHTPADDING', (0, 0), (-1, -1), 6),
            ]))
            elements.append(KeepTogether(c_table))
            elements.append(Spacer(1, 0.08*inch))

    # Build PDF with custom canvas
    doc.build(elements, canvasmaker=HeaderFooterCanvas)
    
    return filename


def load_policy_stack():
    """Load the policy stack from file."""
    stack_file = "policy_stack.json"
    try:
        with open(stack_file, "r") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return []

def save_policy_stack(stack):
    """Save the policy stack to file."""
    stack_file = "policy_stack.json"
    with open(stack_file, "w") as f:
        json.dump(stack, f, indent=4)

def find_commit_index(stack, commit_hash):
    """Find the index of a commit in the stack. Returns -1 if not found."""
    for i, entry in enumerate(stack):
        if entry.get("commit_hash") == commit_hash:
            return i
    return -1

def get_unique_commit_hashes(stack, limit=None):
    """Get unique commit hashes from the stack."""
    seen_hashes = set()
    unique_hashes = []
    for entry in stack:
        hash_val = entry.get("commit_hash")
        if hash_val and hash_val not in seen_hashes:
            seen_hashes.add(hash_val)
            unique_hashes.append(hash_val)
            if limit and len(unique_hashes) >= limit:
                break
    return unique_hashes

def display_commit_summary(stack, commit_hash):
    """Display a summary of what will be affected by reverting to/from a commit."""
    commits_with_hash = [entry for entry in stack if entry.get("commit_hash") == commit_hash]
    
    if len(commits_with_hash) == 1:
        # Single policy
        policy_name = commits_with_hash[0].get("policy_name")
        if isinstance(policy_name, dict):
            policy_name = policy_name.get("Parameter/Rule", "Unknown Policy")
        return f"Policy: {policy_name}"
    else:
        # Baseline group
        return f"Baseline Group ({len(commits_with_hash)} policies)"

def append_policy_tree_markdown(policy, commit_hash, changes):
    """Append a new entry to the policy stack with commit details."""
    stack = load_policy_stack()

    # Create a new stack entry
    new_entry = {
        "commit_hash": commit_hash,
        "policy_name": policy,
        "applied_policies": changes[:5]  # Include a sublist of up to 5 policies
    }

    # Append the new entry to the stack
    stack.insert(0, new_entry)  # Newest entry first

    # Save the updated stack
    save_policy_stack(stack)

def print_full_commit_tree():
    """Print the full commit stack in a user-friendly format."""
    stack = load_policy_stack()
    
    if not stack:
        console.print("[bold red]No commit history found.[/bold red]")
        return

    # Display the stack
    table = Table(title="Policy Commit History (Newest to Oldest)", show_lines=True)
    table.add_column("Commit Hash", style="cyan", no_wrap=True)
    table.add_column("Policy Name", style="magenta")
    table.add_column("Applied Policies", style="green")
    table.add_column("Status", style="yellow", no_wrap=True)

    for i, entry in enumerate(stack):
        try:
            applied_policies = entry.get("applied_policies", [])
            if not isinstance(applied_policies, list):
                raise ValueError(f"'applied_policies' is not a list: {applied_policies}")
            applied_policies_str = "\n".join(f"- {policy}" for policy in applied_policies)

            # Extract policy name as a string
            policy_name = entry.get("policy_name")
            if isinstance(policy_name, dict):
                policy_name = policy_name.get("Parameter/Rule", "Unknown Policy")
            
            # Add status indicator
            status = "CURRENT" if i == 0 else f"#{i+1}"

            table.add_row(entry["commit_hash"], policy_name, applied_policies_str, status)
        except Exception as e:
            console.print(f"[bold red]Error processing entry: {entry}[/bold red]")
            console.print(f"[bold red]Exception: {e}[/bold red]")

    console.print(table)
    
    # Add summary info
    unique_commits = len(get_unique_commit_hashes(stack))
    total_policies = len(stack)
    console.print(f"\n[bold dim]Summary: {unique_commits} unique commits, {total_policies} total policy entries[/bold dim]")
def print_policy_tree_terminal(policy, commit_hash, changes):
    """
    Prints a group policy tree to the terminal.
    """
    console.print(f"\n[bold]- {policy['Feature ID']}[/bold]: {policy['Parameter/Rule']}")
    for change in changes:
        console.print(f"  [green]├─ {change}[/green]")
    console.print(f"    [yellow]└─ Commit: {commit_hash}[/yellow]\n")


def load_feature_map():
    """
    Load and parse the feature_map.csv file to group policies by category.
    """
    feature_map_path = os.path.join(os.path.dirname(__file__), "..", "feature_map.csv")
    categories = {}
    
    try:
        with open(feature_map_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                category = row['Category']
                os_type = row['OS']
                
                if category not in categories:
                    categories[category] = {'Windows': [], 'Linux': []}
                
                categories[category][os_type].append(row)
    except FileNotFoundError:
        console.print(f"[bold red]Error:[/bold red] feature_map.csv not found at {feature_map_path}")
        return {}
    
    return categories


def print_baseline_policy_tree(category, policies_applied, commit_hash):
    """
    Prints a baseline group policy tree to the terminal showing all applied policies.
    """
    console.print(f"\n[bold cyan]═══════════════════════════════════════════════════════════════[/bold cyan]")
    console.print(f"[bold white]Baseline Group Policy Applied: {category}[/bold white]")
    console.print(f"[bold cyan]═══════════════════════════════════════════════════════════════[/bold cyan]\n")
    
    for i, policy in enumerate(policies_applied, 1):
        is_last = (i == len(policies_applied))
        prefix = "└─" if is_last else "├─"
        
        console.print(f"[bold]{prefix} {policy['Feature ID']}[/bold]: {policy['Parameter/Rule']}")
        
        change_prefix = "   " if is_last else "│  "
        console.print(f"{change_prefix} [green]├─ Changed setting for {policy['Parameter/Rule']}[/green]")
        console.print(f"{change_prefix} [yellow]└─ Commit: {commit_hash}[/yellow]")
        
        if not is_last:
            console.print(f"[bold cyan]│[/bold cyan]")


@click.group()
def cli():
    """
    Guardian CLI - Security policy management and compliance scanning tool.
    """
    pass

@cli.command()
def info():
    """Displays system information for MUM-WEB-01."""
    console.print("Fetching system information for [bold cyan]MUM-WEB-01[/bold cyan]...")
    
    system_info = get_system_info("mumbai-web-01")
    
    if not system_info:
        console.print("[bold red]Error:[/bold red] Could not retrieve system information.")
        return

    table = Table(title="System Information: MUM-WEB-01", show_header=True, header_style="bold magenta")
    table.add_column("Property", style="dim", width=20)
    table.add_column("Value")

    table.add_row("Hostname", system_info.get('name', 'N/A'))
    table.add_row("IP Address", system_info.get('ip', 'N/A'))
    table.add_row("Role", system_info.get('role', 'N/A'))
    table.add_row("Status", f"[bold yellow]{system_info.get('status', 'N/A')}[/bold yellow]")
    table.add_row("Location", system_info.get('location', 'N/A'))
    table.add_row("OS", system_info['nodes'][0]['details'].get('description', 'N/A') if system_info.get('nodes') else 'N/A')

    console.print(table)

@cli.command()
@click.argument('policy_id')
def apply(policy_id):
    """Applies a specific security policy."""
    console.print(f"Applying policy [bold cyan]{policy_id}[/bold cyan] to [bold magenta]MUM-WEB-01[/bold magenta]...")
    
    policies = get_policies_for_os("Linux")
    policy = next((p for p in policies if p['Feature ID'] == policy_id), None)

    if not policy:
        console.print(f"[bold red]Error:[/bold red] Policy '{policy_id}' not found for Linux OS.")
        return

    with Progress(
        TextColumn("[progress.description]{task.description}"),
        BarColumn(),
        TimeElapsedColumn(),
        console=console,
        transient=True
    ) as progress:
        task = progress.add_task(f"[green]Applying {policy_id}", total=100)
        for i in range(100):
            time.sleep(random.uniform(0.01, 0.05))
            progress.update(task, advance=1)

    commit_hash = ''.join(random.choices('abcdef0123456789', k=8))
    console.print(f"[bold green]Success![/bold green] Policy '{policy['Parameter/Rule']}' applied.")
    console.print(Panel(f"Commit Hash: [bold yellow]{commit_hash}[/bold yellow]", title="Git-Style Commit (Layer 1)", style="green"))

    # --- Print policy tree in terminal ---
    changes = [f"Changed setting for {policy['Parameter/Rule']}"]
    append_policy_tree_markdown(policy, commit_hash, changes)



@cli.command(name='apply-baseline')
@click.argument('category')
@click.option('--os-type', default='Linux', type=click.Choice(['Linux', 'Windows'], case_sensitive=False), help='Operating system type')
def apply_baseline(category, os_type):
    """Applies a baseline group of policies based on category from feature_map.csv."""
    console.print(f"\nApplying baseline group policy for category [bold cyan]{category}[/bold cyan] to [bold magenta]MUM-WEB-01[/bold magenta]...\n")
    
    # Load feature map
    categories = load_feature_map()
    
    if not categories:
        return
    
    # Find matching category (case-insensitive)
    matching_category = None
    for cat_name in categories.keys():
        if cat_name.lower() == category.lower():
            matching_category = cat_name
            break
    
    if not matching_category:
        console.print(f"[bold red]Error:[/bold red] Category '{category}' not found in feature_map.csv")
        console.print(f"\n[bold yellow]Available categories:[/bold yellow]")
        for cat in sorted(categories.keys()):
            console.print(f"  - {cat}")
        return
    
    # Get policies for the selected OS
    policies_to_apply = categories[matching_category].get(os_type, [])
    
    if not policies_to_apply:
        console.print(f"[bold yellow]Warning:[/bold yellow] No {os_type} policies found for category '{matching_category}'")
        return
    
    console.print(f"Found [bold green]{len(policies_to_apply)}[/bold green] policies in category [bold cyan]{matching_category}[/bold cyan]\n")
    
    # Apply policies with progress bar
    with Progress(
        TextColumn("[progress.description]{task.description}"),
        BarColumn(),
        TextColumn("[progress.percentage]{task.percentage:>3.0f}%"),
        TimeElapsedColumn(),
        console=console
    ) as progress:
        task = progress.add_task(f"Applying {len(policies_to_apply)} policies...", total=len(policies_to_apply))
        for policy in policies_to_apply:
            time.sleep(0.1)  # Simulate policy application
            progress.update(task, advance=1)
    
    # Generate commit hash
    commit_hash = ''.join(random.choices('abcdef0123456789', k=7)) + 'f'
    
    console.print(f"\n[bold green]Success![/bold green] Policy baseline '{matching_category}' applied.")
    console.print(Panel(f"Commit Hash: [bold yellow]{commit_hash}[/bold yellow]", title="Git-Style Commit (Layer 1)", style="green"))
    
    # Print baseline policy tree
    for policy in policies_to_apply:
        changes = [f"Changed setting for {policy['Parameter/Rule']}"]
        append_policy_tree_markdown(policy, commit_hash, changes)



@cli.command()
def history():
    """Displays the policy commit history."""
    print_full_commit_tree()

@cli.command()
@click.option('--os-type', default='Linux', type=click.Choice(['Linux', 'Windows'], case_sensitive=False), help='Operating system type')
def groups(os_type):
    """Lists all available policy groups/categories."""
    console.print(f"Loading policy groups for [bold cyan]{os_type}[/bold cyan]...")
    
    # Load feature map
    categories = load_feature_map()
    
    if not categories:
        console.print("[bold red]Error:[/bold red] Could not load policy groups.")
        return
    
    # Create a summary table
    table = Table(title=f"Available Policy Groups - {os_type}", show_header=True, header_style="bold magenta")
    table.add_column("Category", style="cyan", width=25)
    table.add_column("Linux Policies", style="green", justify="center", width=15)
    table.add_column("Windows Policies", style="blue", justify="center", width=15)
    table.add_column("Description", style="dim")
    
    # Category descriptions (you can enhance these)
    descriptions = {
        'Filesystem': 'File system permissions, mount options, and directory security',
        'Access Management': 'User access controls, sudo configurations, and privilege management', 
        'Services': 'System service configurations and daemon management',
        'Network': 'Network security settings, firewall rules, and protocol configurations',
        'Authentication (SSH & PAM)': 'SSH hardening and PAM authentication module settings',
        'User Accounts': 'User account policies, password requirements, and session controls',
        'Logging & Auditing': 'System logging configuration and audit trail settings',
        'System Maintenance': 'System updates, maintenance tasks, and general hardening'
    }
    
    total_linux = 0
    total_windows = 0
    
    for category, policies in sorted(categories.items()):
        linux_count = len(policies.get('Linux', []))
        windows_count = len(policies.get('Windows', []))
        description = descriptions.get(category, 'Security policies and configurations')
        
        total_linux += linux_count
        total_windows += windows_count
        
        table.add_row(
            category,
            str(linux_count) if linux_count > 0 else "[dim]0[/dim]",
            str(windows_count) if windows_count > 0 else "[dim]0[/dim]", 
            description
        )
    
    # Add totals row
    table.add_row(
        "[bold]TOTAL[/bold]",
        f"[bold green]{total_linux}[/bold green]",
        f"[bold blue]{total_windows}[/bold blue]",
        "[bold]All available policies[/bold]"
    )
    
    console.print(table)
    
    console.print(f"\n[bold yellow]Usage Examples:[/bold yellow]")
    console.print(f"  guardian apply-baseline \"Filesystem\" --os-type {os_type}")
    console.print(f"  guardian group-details \"Network\" --os-type {os_type}")
    console.print(f"  guardian scan  # Check compliance for all policies")

@cli.command(name='group-details')
@click.argument('category')
@click.option('--os-type', default='Linux', type=click.Choice(['Linux', 'Windows'], case_sensitive=False), help='Operating system type')
@click.option('--limit', default=None, type=int, help='Limit number of policies to display')
def group_details(category, os_type, limit):
    """Shows detailed information about a specific policy group."""
    console.print(f"Loading details for policy group [bold cyan]{category}[/bold cyan] ({os_type})...")
    
    # Load feature map
    categories = load_feature_map()
    
    if not categories:
        console.print("[bold red]Error:[/bold red] Could not load policy groups.")
        return
    
    # Find matching category (case-insensitive)
    matching_category = None
    for cat_name in categories.keys():
        if cat_name.lower() == category.lower():
            matching_category = cat_name
            break
    
    if not matching_category:
        console.print(f"[bold red]Error:[/bold red] Category '{category}' not found.")
        console.print(f"\n[bold yellow]Available categories:[/bold yellow]")
        for cat in sorted(categories.keys()):
            console.print(f"  - {cat}")
        return
    
    # Get policies for the selected OS
    policies = categories[matching_category].get(os_type, [])
    
    if not policies:
        console.print(f"[bold yellow]Warning:[/bold yellow] No {os_type} policies found for category '{matching_category}'")
        return
    
    # Apply limit if specified
    if limit:
        policies = policies[:limit]
        suffix = f" (showing first {limit})" if len(categories[matching_category].get(os_type, [])) > limit else ""
    else:
        suffix = ""
    
    # Display detailed table
    table = Table(
        title=f"Policy Group: {matching_category} - {os_type}{suffix}", 
        show_header=True, 
        header_style="bold magenta",
        show_lines=True
    )
    table.add_column("Feature ID", style="cyan", no_wrap=True, width=12)
    table.add_column("Parameter/Rule", style="green", width=40)
    table.add_column("Priority", style="yellow", justify="center", width=8)
    table.add_column("Category", style="blue", width=15)
    
    for policy in policies:
        table.add_row(
            policy.get('Feature ID', 'N/A'),
            policy.get('Parameter/Rule', 'N/A'),
            policy.get('Priority', 'N/A'),
            policy.get('Category', 'N/A')
        )
    
    console.print(table)
    
    # Show summary
    total_in_category = len(categories[matching_category].get(os_type, []))
    console.print(f"\n[bold dim]Total policies in {matching_category} ({os_type}): {total_in_category}[/bold dim]")
    
    if limit and total_in_category > limit:
        console.print(f"[bold dim]Use --limit {total_in_category} to see all policies[/bold dim]")
    
    console.print(f"\n[bold yellow]Apply this group:[/bold yellow]")
    console.print(f"  guardian apply-baseline \"{matching_category}\" --os-type {os_type}")

@cli.command(name='applied-groups')
def applied_groups():
    """Shows which policy groups have been applied to the system."""
    stack = load_policy_stack()
    
    if not stack:
        console.print("[bold yellow]No policy groups have been applied yet.[/bold yellow]")
        console.print("\n[bold cyan]Available commands:[/bold cyan]")
        console.print("  guardian groups                    # List all available groups")
        console.print("  guardian apply-baseline <group>    # Apply a policy group")
        return
    
    # Analyze applied policies to determine groups
    applied_groups = {}
    individual_policies = []
    
    for entry in stack:
        commit_hash = entry.get("commit_hash")
        policy_name = entry.get("policy_name")
        
        # Count how many policies share this commit hash (indicates group application)
        same_commit_count = len([e for e in stack if e.get("commit_hash") == commit_hash])
        
        if same_commit_count > 1:
            # This is likely a group application
            if commit_hash not in applied_groups:
                applied_groups[commit_hash] = {
                    'count': same_commit_count,
                    'sample_policy': policy_name,
                    'entries': []
                }
            applied_groups[commit_hash]['entries'].append(entry)
        else:
            # Individual policy
            individual_policies.append(entry)
    
    # Display applied groups
    if applied_groups:
        console.print("[bold green]Applied Policy Groups:[/bold green]")
        
        group_table = Table(show_header=True, header_style="bold magenta")
        group_table.add_column("Commit Hash", style="cyan", no_wrap=True)
        group_table.add_column("Policies", style="green", justify="center")
        group_table.add_column("Group Type", style="yellow")
        group_table.add_column("Sample Policy", style="dim")
        
        for commit_hash, group_info in applied_groups.items():
            # Try to determine the group category from the policy names
            policies_in_group = group_info['entries']
            group_type = "Baseline Group"
            
            # Try to extract category from the first policy if it's a dict
            sample_policy = group_info['sample_policy']
            if isinstance(sample_policy, dict):
                sample_text = sample_policy.get('Parameter/Rule', 'Unknown Policy')
            else:
                sample_text = str(sample_policy)
            
            group_table.add_row(
                commit_hash,
                str(group_info['count']),
                group_type,
                sample_text[:50] + "..." if len(sample_text) > 50 else sample_text
            )
        
        console.print(group_table)
    
    # Display individual policies
    if individual_policies:
        console.print(f"\n[bold blue]Individual Applied Policies:[/bold blue]")
        
        individual_table = Table(show_header=True, header_style="bold magenta")
        individual_table.add_column("Commit Hash", style="cyan", no_wrap=True)
        individual_table.add_column("Policy", style="green")
        
        for entry in individual_policies[:10]:  # Show up to 10 individual policies
            policy_name = entry.get("policy_name")
            if isinstance(policy_name, dict):
                policy_text = policy_name.get('Parameter/Rule', 'Unknown Policy')
            else:
                policy_text = str(policy_name)
            
            individual_table.add_row(
                entry.get("commit_hash"),
                policy_text[:60] + "..." if len(policy_text) > 60 else policy_text
            )
        
        console.print(individual_table)
        
        if len(individual_policies) > 10:
            console.print(f"[bold dim]... and {len(individual_policies) - 10} more individual policies[/bold dim]")
    
    # Summary
    total_groups = len(applied_groups)
    total_individual = len(individual_policies)
    total_policy_entries = len(stack)
    
    console.print(f"\n[bold dim]Summary:[/bold dim]")
    console.print(f"  Policy Groups Applied: {total_groups}")
    console.print(f"  Individual Policies: {total_individual}")
    console.print(f"  Total Policy Entries: {total_policy_entries}")
    
    console.print(f"\n[bold yellow]Management Commands:[/bold yellow]")
    console.print(f"  guardian revert status           # Check current system state")
    console.print(f"  guardian history                 # View full commit history")
    console.print(f"  guardian revert to <commit>      # Revert to specific state")


@cli.command()
def scan():
    """Runs a security compliance scan and generates a PDF report."""
    console.print("Starting security scan on [bold magenta]MUM-WEB-01[/bold magenta]...")
    policies = get_policies_for_os("Linux")
    scan_duration = random.randint(10, 20)

    with Progress(
        TextColumn("[progress.description]{task.description}"),
        BarColumn(),
        TextColumn("[progress.percentage]{task.percentage:>3.0f}%"),
        TimeElapsedColumn(),
        console=console
    ) as progress:
        scan_task = progress.add_task("[cyan]Overall Progress", total=len(policies))
        
        for policy in policies:
            progress.update(scan_task, advance=1, description=f"[cyan]Checking: {policy['Feature ID']} - {policy['Parameter/Rule'][:30]}...")
            time.sleep(scan_duration / len(policies))

    console.print("\n[bold green]Scan Complete![/bold green]")
    
    # Simulate compliance findings
    num_non_compliant = random.randint(3, 6)
    non_compliant_findings = random.sample(policies, num_non_compliant)

    # Show a summary table in the console
    table = Table(title="Scan Summary")
    table.add_column("Metric", style="dim")
    table.add_column("Result")
    table.add_row("Policies Checked", str(len(policies)))
    table.add_row("Compliant", str(len(policies) - num_non_compliant))
    table.add_row("Non-Compliant", str(num_non_compliant))
    console.print(table)

    # Generate the PDF report
    console.print("\nGenerating PDF report...")
    system_info = get_system_info("mumbai-web-01")
    
    with console.status("Creating PDF...", spinner="dots") as status:
        pdf_filename = generate_pdf_report(system_info, policies, non_compliant_findings)
    
    console.print(f"[bold green]Success![/bold green] PDF report generated: [bold cyan]{pdf_filename}[/bold cyan]")


@click.group()
def revert():
    """Rollback commands."""
    pass

@revert.command()
@click.argument('commit_hash')
def commit(commit_hash):
    """Removes a specific policy commit from history (does not affect commits after it)."""
    stack = load_policy_stack()
    
    if not stack:
        console.print("[bold red]Error:[/bold red] No commit history found.")
        return
    
    # Find ALL commits with the same commit hash (for baseline policies)
    commits_to_revert = [entry for entry in stack if entry.get("commit_hash") == commit_hash]
    
    if not commits_to_revert:
        console.print(f"[bold red]Error:[/bold red] Commit '{commit_hash}' not found in history.")
        console.print("\n[bold yellow]Available commits:[/bold yellow]")
        unique_hashes = get_unique_commit_hashes(stack, limit=5)
        for hash_val in unique_hashes:
            console.print(f"  - {hash_val}")
        return
    
    console.print(f"[bold yellow]WARNING:[/bold yellow] This will remove commit [bold cyan]{commit_hash}[/bold cyan] from history.")
    console.print(f"Found [bold cyan]{len(commits_to_revert)}[/bold cyan] policy entries with this commit hash.\n")
    
    # Display what's being reverted
    summary = display_commit_summary(stack, commit_hash)
    console.print(f"[bold cyan]Removing:[/bold cyan] {summary}")
    
    if len(commits_to_revert) > 1:
        # Show details for baseline groups
        for i, commit_entry in enumerate(commits_to_revert[:10], 1):  # Show up to 10
            policy_name = commit_entry.get("policy_name")
            if isinstance(policy_name, dict):
                policy_name = policy_name.get("Parameter/Rule", "Unknown Policy")
            console.print(f"  {i}. {policy_name}")
        if len(commits_to_revert) > 10:
            console.print(f"  ... and {len(commits_to_revert) - 10} more")
    
    # Simulate revert process
    with Progress(console=console, transient=True) as progress:
        task = progress.add_task("[yellow]Removing commit...", total=100)
        for i in range(100):
            time.sleep(0.02)
            progress.update(task, advance=1)
    
    # Remove ALL commits with this hash from the stack
    updated_stack = [entry for entry in stack if entry.get("commit_hash") != commit_hash]
    
    # Save the updated stack
    save_policy_stack(updated_stack)
    
    console.print(f"\n[bold green]Success![/bold green] Commit '{commit_hash}' has been removed from history.")
    console.print(f"[bold green]Removed {len(commits_to_revert)} policy entries.[/bold green]")

@revert.command(name='to')
@click.argument('commit_hash')
@click.option('--force', '-f', is_flag=True, help='Skip confirmation prompt')
def revert_to(commit_hash, force):
    """Reverts system state to a specific commit by removing all commits after it."""
    stack = load_policy_stack()
    
    if not stack:
        console.print("[bold red]Error:[/bold red] No commit history found.")
        return
    
    # Find the target commit index
    target_index = find_commit_index(stack, commit_hash)
    
    if target_index == -1:
        console.print(f"[bold red]Error:[/bold red] Commit '{commit_hash}' not found in history.")
        console.print("\n[bold yellow]Available commits (newest to oldest):[/bold yellow]")
        unique_hashes = get_unique_commit_hashes(stack, limit=5)
        for hash_val in unique_hashes:
            console.print(f"  - {hash_val}")
        return
    
    # Calculate what will be removed
    commits_to_remove = stack[:target_index]  # Everything before target (newer commits)
    commits_to_keep = stack[target_index:]     # Target commit and everything after (older commits)
    
    if not commits_to_remove:
        console.print(f"[bold yellow]Info:[/bold yellow] Commit '{commit_hash}' is already the newest state. Nothing to revert.")
        return
    
    # Show what will be affected
    console.print(f"[bold yellow]WARNING:[/bold yellow] This will revert system state to commit [bold cyan]{commit_hash}[/bold cyan]")
    console.print(f"[bold red]This will remove {len(commits_to_remove)} newer commit(s) from history![/bold red]\n")
    
    # Group commits by hash for display
    commits_by_hash = {}
    for commit in commits_to_remove:
        hash_val = commit.get("commit_hash")
        if hash_val not in commits_by_hash:
            commits_by_hash[hash_val] = []
        commits_by_hash[hash_val].append(commit)
    
    console.print("[bold cyan]Commits that will be removed:[/bold cyan]")
    for i, (hash_val, commits) in enumerate(commits_by_hash.items(), 1):
        summary = display_commit_summary(commits, hash_val)
        console.print(f"  {i}. {hash_val} - {summary}")
    
    console.print(f"\n[bold green]Target state:[/bold green] {commit_hash} - {display_commit_summary(stack, commit_hash)}")
    
    # Confirmation prompt
    if not force:
        console.print("\n[bold yellow]Are you sure you want to proceed? This action cannot be undone.[/bold yellow]")
        confirmation = click.prompt("Type 'yes' to continue", type=str)
        if confirmation.lower() != 'yes':
            console.print("[bold blue]Operation cancelled.[/bold blue]")
            return
    
    # Simulate revert process
    with Progress(console=console, transient=True) as progress:
        task = progress.add_task("[yellow]Reverting system state...", total=100)
        for i in range(100):
            time.sleep(0.03)
            progress.update(task, advance=1)
    
    # Save the new stack (everything from target commit onwards)
    save_policy_stack(commits_to_keep)
    
    console.print(f"\n[bold green]Success![/bold green] System state reverted to commit '{commit_hash}'.")
    console.print(f"[bold green]Removed {len(commits_to_remove)} newer commit(s) from history.[/bold green]")
    console.print(f"[bold blue]Current state now matches commit {commit_hash}.[/bold blue]")

@revert.command()
def status():
    """Shows current system state and recent commit history."""
    stack = load_policy_stack()
    
    if not stack:
        console.print("[bold yellow]No commit history found. System is in initial state.[/bold yellow]")
        return
    
    # Show current state (most recent commit)
    current_commit = stack[0]
    current_hash = current_commit.get("commit_hash")
    
    console.print(f"[bold green]Current System State[/bold green]")
    console.print(f"Latest Commit: [bold cyan]{current_hash}[/bold cyan]")
    console.print(f"State: {display_commit_summary(stack, current_hash)}\n")
    
    # Show recent commit history
    console.print("[bold yellow]Recent Commit History (newest to oldest):[/bold yellow]")
    unique_hashes = get_unique_commit_hashes(stack, limit=10)
    
    for i, hash_val in enumerate(unique_hashes, 1):
        summary = display_commit_summary(stack, hash_val)
        status_indicator = "← CURRENT" if i == 1 else ""
        console.print(f"  {i}. [cyan]{hash_val}[/cyan] - {summary} [bold green]{status_indicator}[/bold green]")
    
    if len(unique_hashes) >= 10:
        console.print("     ... (use 'guardian history' to see full history)")
    
    total_commits = len(set(entry.get("commit_hash") for entry in stack))
    total_policies = len(stack)
    console.print(f"\n[bold dim]Total: {total_commits} commits, {total_policies} policy entries[/bold dim]")

@revert.group()
def snapshot():
    """Manage OS-level snapshots."""
    pass

@snapshot.command()
def create():
    """Creates a new OS-level snapshot."""
    console.print("Creating OS-level snapshot...")
    with Progress(console=console, transient=True) as progress:
        task = progress.add_task("[green]Snapshotting", total=100)
        for i in range(100):
            time.sleep(0.05)
            progress.update(task, advance=1)
    console.print("[bold green]Snapshot created successfully![/bold green]")

@snapshot.command()
def to_last():
    """Reverts to the last known good snapshot."""
    console.print("Reverting to the last known good snapshot...")
    with Progress(console=console, transient=True) as progress:
        task = progress.add_task("[yellow]Reverting", total=100)
        for i in range(100):
            time.sleep(0.08)
            progress.update(task, advance=1)
    console.print("[bold green]System reverted to the last snapshot.[/bold green]")


@click.group()
def drift():
    """Drift detection and self-healing."""
    pass

@drift.command()
def detect():
    """Detects configuration drift."""
    console.print("Running drift detection...")
    time.sleep(3)
    console.print("[bold yellow]Drift detected![/bold yellow] The following policies were modified:")
    policies = get_policies_for_os("Linux")
    drifted_policies = random.sample(policies, 3)

    table = Table(title="Drift Detection Report")
    table.add_column("Policy ID")
    table.add_column("Expected Value")
    table.add_column("Current Value")

    for p in drifted_policies:
        table.add_row(p['Feature ID'], "Enabled", "Disabled")

    console.print(table)


@drift.command()
def enforce():
    """Enforces the correct policy on drifted configurations."""
    console.print("Enforcing correct policies on drifted configurations...")
    time.sleep(2)
    console.print("[bold green]Self-healing complete.[/bold green] System is now compliant.")


cli.add_command(revert)
cli.add_command(drift)

if __name__ == '__main__':
    cli()