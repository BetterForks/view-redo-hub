# Guardian Baseline Group Policy Guide

## Overview

The Guardian CLI supports applying baseline group policies, which allows you to apply multiple related security policies together based on categories defined in `feature_map.csv`.

**Note**: This is a demonstration and simulation tool for policy management workflows. It provides a realistic CLI interface and reporting capabilities without making actual modifications to your operating system. Use this tool for training, demonstrations, and workflow planning.

## Installation

### First-time setup

1. Install the Guardian CLI package in development mode:

```bash
cd /home/jidsv28/AegisGuard/view-redo-hub
pip install -e .
```

This will install the `guardian` command globally on your system.

### Verify Installation

```bash
guardian --help
```

You should see all available commands including `apply-baseline`.

## Usage

### Command Syntax

```bash
guardian apply-baseline <CATEGORY> [--os-type <Linux|Windows>]
```

### Parameters

- `<CATEGORY>` (required): The policy category from feature_map.csv (case-insensitive)
- `--os-type` (optional): Operating system type - `Linux` (default) or `Windows`

### Examples

#### Apply Linux Filesystem baseline policies:
```bash
guardian apply-baseline Filesystem
```

#### Apply Windows Account Policies baseline:
```bash
guardian apply-baseline "Account Policies" --os-type Windows
```

#### Apply Linux Access Management policies:
```bash
guardian apply-baseline "Access Management"
```

### Using the Bash Script (Alternative)

If you prefer using the bash script:

```bash
# Make it executable (first time only)
chmod +x apply_baseline_group.sh

# Apply baseline policies
./apply_baseline_group.sh "Filesystem"
./apply_baseline_group.sh "Account Policies" --os-type Windows
```

## Available Categories

### Linux Categories:
- Filesystem
- Access Management
- Services
- Network
- Authentication (SSH & PAM)
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

## Output

When you run the command, you'll see:

1. **Progress Bar**: Shows the application progress for all policies in the category
2. **Commit Hash**: A Git-style commit hash for tracking the changes (Layer 1)
3. **Policy Tree**: A visual tree structure showing:
   - Each policy applied (Feature ID and description)
   - The setting that was changed
   - The commit hash for each change

### Example Output:

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
│
└─ F-LNX-103: Ensure hfs kernel module is not available
    ├─ Changed setting for Ensure hfs kernel module is not available
    └─ Commit: 36c47f5f
```

## How It Works

1. The command reads `feature_map.csv` to identify all policies belonging to the specified category
2. Filters policies by the selected OS type (Linux or Windows)
3. Applies each policy sequentially with a progress indicator
4. Generates a single commit hash for the entire baseline application
5. Displays a comprehensive policy tree showing all applied policies

## Troubleshooting

### Command not found: guardian

**Solution**: Install the package in development mode:
```bash
cd /home/jidsv28/AegisGuard/view-redo-hub
pip install -e .
```

### Category not found

**Solution**: Check available categories by running with an invalid category:
```bash
guardian apply-baseline invalid_category
```

This will display all available categories.

### No policies found for OS type

**Solution**: Some categories may only have policies for specific OS types. Try:
- For Linux-specific categories, omit the `--os-type` parameter or use `--os-type Linux`
- For Windows-specific categories, use `--os-type Windows`

## Integration with Other Guardian Commands

You can combine baseline policies with individual policy application:

```bash
# Apply a baseline
guardian apply-baseline Filesystem

# Apply individual policies
guardian apply F-LNX-201

# Scan for compliance
guardian scan

# Check for drift
guardian drift detect
```

## Notes

- All baseline policy applications are tracked with Git-style commit hashes
- The policy tree is displayed both in the terminal and can be logged to `policy_tree.md`
- Each category application is atomic - all policies in the category are applied together
- Case-insensitive category matching is supported for convenience

## Important Disclaimer

**This is a simulation and demonstration tool.** The Guardian CLI provides a realistic interface for security policy management workflows but does not make actual changes to your operating system configuration. It is designed for:

- Training and education on security policy management
- Demonstrating compliance workflows
- Planning and documenting policy deployment strategies
- Generating sample compliance reports

No actual system modifications are performed when running Guardian CLI commands.
