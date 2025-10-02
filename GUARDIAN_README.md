# Guardian - Security Policy Management CLI

A professional command-line interface for demonstrating security policy management, compliance scanning, and automated hardening workflows.

## ⚠️ Important Notice

**This is a simulation and demonstration tool.** Guardian CLI provides a realistic interface for security policy management workflows but **does not make any actual changes to your operating system**. It is designed for:

- Training and education on security policy management
- Demonstrating compliance workflows and reporting
- Planning and documenting policy deployment strategies
- Generating sample compliance reports and visualizations

**No actual system modifications are performed when running Guardian CLI commands.**

## Features

- **Individual Policy Application**: Apply specific security policies by Feature ID
- **Baseline Group Policies**: Apply multiple related policies together by category
- **Compliance Scanning**: Generate detailed PDF compliance reports
- **Policy Tree Visualization**: Track policy applications with Git-style commit tracking
- **Drift Detection**: Simulate configuration drift detection and self-healing
- **Rollback Capabilities**: Demonstrate policy reversion and snapshot management

## Quick Start

### Installation

```bash
cd /home/jidsv28/AegisGuard/view-redo-hub
pip install -e .
```

### Verify Installation

```bash
guardian --help
```

You should see output like:

```
Usage: guardian [OPTIONS] COMMAND [ARGS]...

  Guardian CLI - Security policy management and compliance scanning tool.

Commands:
  apply            Applies a specific security policy.
  apply-baseline   Applies a baseline group of policies based on...
  drift            Drift detection and self-healing.
  info             Displays system information for MUM-WEB-01.
  revert           Rollback commands.
  scan             Runs a security compliance scan and generates a...
```

### Basic Commands

```bash
# Display system information
guardian info

# Apply a specific policy
guardian apply F-LNX-201

# Apply baseline group policies (Linux)
guardian apply-baseline Filesystem

# Apply baseline group policies (Windows)
guardian apply-baseline "Account Policies" --os-type Windows

# Run compliance scan and generate report
guardian scan

# Detect configuration drift
guardian drift detect

# Enforce policies on drifted configurations
guardian drift enforce

# Revert a specific commit
guardian revert commit 36c47f5f

# Create a system snapshot
guardian revert snapshot create

# Revert to last snapshot
guardian revert snapshot to-last
```

## Using the Bash Script (Alternative Method)

```bash
# Make the script executable (first time only)
chmod +x apply_baseline_group.sh

# Apply baseline policies
./apply_baseline_group.sh "Filesystem"
./apply_baseline_group.sh "Account Policies" --os-type Windows
```

## Documentation

- **[Baseline Policy Guide](BASELINE_POLICY_GUIDE.md)** - Comprehensive guide for using baseline group policies
- **[Policy Tree](guardian_cli/policy_tree.md)** - Policy application tracking log

## Policy Categories

The tool supports the following policy categories from `feature_map.csv`:

### Linux Categories:
- Filesystem
- Access Management  
- Services
- Network
- User Accounts
- Logging & Auditing
- System Maintenance

### Windows Categories:
- Account Policies
- Local Policies
- Security Options
- System settings
- Windows Defender Firewall with Advanced Security
- Advanced Audit Policy Configuration
- AutoPlay Policies
- Microsoft Defender Application Guard

## Example Workflow

### 1. Check System Information
```bash
guardian info
```

### 2. Apply Baseline Policies
```bash
guardian apply-baseline Filesystem
```

**Output:**
```
Applying baseline group policy for category Filesystem to MUM-WEB-01...

Found 10 policies in category Filesystem

Applying 10 policies... ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 100% 0:00:01

Success! Policy baseline 'Filesystem' applied.
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Git-Style Commit (Layer 1)              ┃
┃ Commit Hash: 36c47f5f                   ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

═══════════════════════════════════════════════════════════════
Baseline Group Policy Applied: Filesystem
═══════════════════════════════════════════════════════════════

├─ F-LNX-101: Ensure cramfs kernel module is not available
│   ├─ Changed setting for Ensure cramfs kernel module is not available
│   └─ Commit: 36c47f5f
│
├─ F-LNX-102: Ensure freevxfs kernel module is not available
│   ├─ Changed setting for Ensure freevxfs kernel module is not available
│   └─ Commit: 36c47f5f
```

### 3. Run Compliance Scan
```bash
guardian scan
```

This generates a professional PDF report with:
- System information
- Compliance overview by category
- Detailed findings (compliant and non-compliant items)
- Compliance statistics

### 4. Detect and Fix Drift
```bash
guardian drift detect
guardian drift enforce
```

## Requirements

- Python 3.7+
- click >= 8.0.0
- rich >= 10.0.0
- tqdm >= 4.60.0
- reportlab >= 3.6.0

## File Structure

```
view-redo-hub/
├── guardian_cli/
│   ├── __init__.py
│   ├── guardian.py          # Main CLI application
│   ├── policies.py          # Policy definitions
│   ├── system_info.py       # System information module
│   └── policy_tree.md       # Policy tracking log
├── feature_map.csv          # Policy category mappings
├── apply_baseline_group.sh  # Bash wrapper script
├── setup.py                 # Package installation configuration
├── BASELINE_POLICY_GUIDE.md # Detailed usage guide
└── GUARDIAN_README.md       # This file
```

## Troubleshooting

### Command not found: guardian

**Solution**: Install the package in development mode:
```bash
cd /home/jidsv28/AegisGuard/view-redo-hub
pip install -e .
```

### Category not found

**Solution**: Check available categories:
```bash
guardian apply-baseline invalid_category
```

This will display all available categories.

### Import errors

**Solution**: Install dependencies:
```bash
pip install click rich tqdm reportlab
```

## Development

To modify or extend the Guardian CLI:

1. Edit files in `guardian_cli/` directory
2. Update `feature_map.csv` to add/modify policy categories
3. Changes take effect immediately (no reinstallation needed with `-e` flag)

## License

This is a demonstration tool for educational and training purposes.

---

**Remember**: This tool simulates security policy management workflows and does not modify your actual operating system configuration.
