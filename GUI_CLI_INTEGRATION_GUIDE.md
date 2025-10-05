# Guardian CLI and GUI Data Integration Guide

## Overview
This guide explains how the Guardian CLI `scan` command integrates data from the Visualize.tsx GUI component to generate comprehensive security compliance reports.

---

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Visualize.tsx (GUI)                      │
│  - System Information (Mumbai-web-01)                       │
│  - Category Data (Filesystem, Services, Network, etc.)      │
│  - Detailed Security Checks (189 controls)                  │
│  - Vulnerability Metrics                                    │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Data Structure
                       ▼
┌─────────────────────────────────────────────────────────────┐
│               system_info.py (Data Parser)                  │
│  - Parses Visualize.tsx                                     │
│  - Extracts system details                                  │
│  - Fallback to comprehensive mock data                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ System Info
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                 guardian.py (CLI Core)                      │
│  - scan() command                                           │
│  - Category-wise scanning (5 categories)                    │
│  - Progress tracking with Rich library                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Report Generation
                       ▼
┌─────────────────────────────────────────────────────────────┐
│          generate_pdf_report() (ReportLab)                  │
│  - Professional PDF formatting                              │
│  - System information table                                 │
│  - Compliance overview by category                          │
│  - Detailed findings (compliant & non-compliant)            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Output
                       ▼
┌─────────────────────────────────────────────────────────────┐
│     Guardian-Report-MUM-WEB-01-20251005.pdf (31KB)         │
│  - Complete audit trail                                     │
│  - Remediation recommendations                              │
│  - Compliance metrics                                       │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Mapping: GUI to CLI

### 1. System Information

#### From Visualize.tsx:
```javascript
"mumbai-web-01": {
  name: "MUM-WEB-01",
  ip: "192.168.1.10",
  role: "Production Web Server",
  status: "warning",
  location: "Mumbai Office",
  rack: "Rack-A-07",
  serialNumber: "MWS-2023-001",
  vendor: "Dell Technologies",
  model: "PowerEdge R750",
  // ... more details
}
```

#### To CLI Report (system_info.py):
```python
{
    "name": "MUM-WEB-01",
    "ip": "192.168.1.10",
    "role": "Production Web Server",
    "location": "Mumbai Office",
    "rack": "Rack-A-07",
    "vendor": "Dell Technologies",
    "model": "PowerEdge R750",
    "hardware": {
        "cpu": "Intel Xeon E5-2686 v4 (8 cores)",
        "memory": "32GB DDR4",
        "storage": "500GB SSD"
    },
    // ... more details
}
```

#### In PDF Report:
| Property | Value |
|----------|-------|
| Hostname | MUM-WEB-01 |
| Operating System | Ubuntu 20.04 LTS |
| IP Address | 192.168.1.10 |
| Hardware | Intel Xeon E5-2686 v4 (8 cores) |
| Memory | 32GB DDR4 |
| Storage | 500GB SSD |
| Vendor/Model | Dell Technologies PowerEdge R750 |

---

### 2. Security Categories

#### From Visualize.tsx:
```javascript
{ 
  id: "filesystem", 
  type: "category", 
  name: "Filesystem Security", 
  details: {
    description: "File system integrity and access controls",
    totalChecks: 36,
    passedChecks: 22,
    failedChecks: 14,
    lastAudit: "2024-01-10"
  }
}
```

#### To CLI Scan (guardian.py):
```python
system_categories = [
    {"name": "Filesystem Security", "total": 36, "passed": 22, "failed": 14},
    # ... more categories
]
```

#### In Terminal Output:
```
┏━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━┳━━━━━━━━┳━━━━━━━━━━━━━━┓
┃ Category            ┃ Total Checks ┃ Passed ┃ Failed ┃ Compliance % ┃
┡━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━━━━━┩
│ Filesystem Security │      36      │   22   │   14   │    61.1%     │
```

---

### 3. Detailed Security Checks

#### From Visualize.tsx:
```javascript
{ 
  id: "F-LNX-103", 
  type: "feature", 
  name: "hfs module disabled", 
  status: "critical", 
  parent: "fs-kernel", 
  description: "Ensure hfs kernel module is not available", 
  annexure: "1.a.iii",
  details: {
    checkType: "Kernel Module",
    expectedValue: "disabled",
    actualValue: "loaded and accessible",
    riskLevel: "High",
    remediation: "URGENT: Disable hfs module - potential security exposure"
  }
}
```

#### To CLI/PDF Report:
```
Non-Compliant Items (Remediation Required)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Parameter / Rule                          Status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
F-LNX-103: hfs module disabled            FAILED

Details: Security check failed: hfs module disabled 
does not meet compliance requirements
```

---

### 4. Vulnerability Metrics

#### From Visualize.tsx:
```javascript
vulnerabilities: { 
  critical: 2, 
  high: 5, 
  medium: 12, 
  low: 8 
}
```

#### Available in system_info.py:
```python
"vulnerabilities": {
    "critical": 2,
    "high": 5,
    "medium": 12,
    "low": 8
}
```

#### Can be added to PDF report (future enhancement)

---

## CLI Commands for Report Generation

### 1. Full Compliance Scan
```bash
python3 -m guardian_cli.guardian scan
```
**Output**: 
- Terminal: Category breakdown with progress bars
- File: `Guardian-Report-MUM-WEB-01-YYYYMMDD.pdf`

### 2. View System Information Only
```bash
python3 -m guardian_cli.guardian info
```
**Output**: Terminal table with system details from Visualize.tsx

### 3. List All Security Categories
```bash
python3 -m guardian_cli.guardian groups --os-type Linux
```
**Output**: All available policy groups with counts

### 4. View Specific Category Details
```bash
python3 -m guardian_cli.guardian group-details "Filesystem Security" --os-type Linux
```
**Output**: Detailed policy list for the category

---

## Report Components

### 1. Terminal Output

The CLI provides rich terminal output using the `rich` library:

```
Starting security scan on MUM-WEB-01...

Scanning Security Categories:

Filesystem Security ━━━━━━━━━━━━━━━━ 100% 0:00:01
System Services     ━━━━━━━━━━━━━━━━ 100% 0:00:02
Network Security    ━━━━━━━━━━━━━━━━ 100% 0:00:02
Access Control      ━━━━━━━━━━━━━━━━ 100% 0:00:01
Logging & Auditing  ━━━━━━━━━━━━━━━━ 100% 0:00:01

Scan Complete!
```

**Features**:
- ✅ Color-coded output (green=pass, red=fail, yellow=warning)
- ✅ Progress bars for each category
- ✅ Real-time status updates
- ✅ Summary tables with compliance percentages

### 2. PDF Report Structure

The generated PDF report includes:

1. **Header Section**
   - Guardian logo (aegis.png)
   - Report title and subtitle
   - System name and OS
   - Report date

2. **System Information**
   - 13 key system properties
   - Hardware specifications
   - Business context (criticality, impact)

3. **Compliance Overview by Category**
   - Table with all 5 categories
   - Total/Compliant/Non-Compliant counts
   - Visual summary with totals

4. **Detailed Findings**
   - **Non-Compliant Items**: Red-highlighted boxes
     - Feature ID and parameter name
     - Failed status
     - Remediation details
   - **Compliant Items**: Green-highlighted boxes (sample)
     - Feature ID and parameter name
     - Passed status
     - Verification details

5. **Footer**
   - Page numbers
   - Report metadata

---

## Category Breakdown

### All 5 Security Categories from Visualize.tsx:

| # | Category | GUI ID | Total Checks | Description |
|---|----------|--------|--------------|-------------|
| 1 | **Filesystem Security** | `filesystem` | 36 | File system integrity and access controls |
| 2 | **System Services** | `services` | 45 | Running services and daemon configurations |
| 3 | **Network Security** | `network` | 42 | Network configuration and firewall rules |
| 4 | **Access Control** | `access-control` | 38 | User authentication and authorization |
| 5 | **Logging & Auditing** | `logging` | 28 | System logging and audit trail management |

**Total**: 189 security controls

---

## Subcategories Mapped from Visualize.tsx

### Filesystem Security (36 checks)
- Filesystem Kernel Modules (`fs-kernel`)
- Partition Configuration (`fs-partitions`)

### System Services (45 checks)
- Server Services (`svc-server`)
- Time Services (`svc-time`)
- Bootloader Configuration (`pkg-bootloader`)
- Process Hardening (`pkg-hardening`)
- Dangerous Server Services (`svc-dangerous`)
- Insecure Client Services (`svc-client`)
- Job Schedulers (`svc-jobs`)

### Network Security (42 checks)
- Network Interfaces (`net-devices`)
- Host-Based Firewall (`net-firewall`)
- Network Kernel Modules (`net-kernel`)
- Network Kernel Parameters (`net-parameters`)
- Wireless & Bluetooth (`net-wireless`)

### Access Control (38 checks)
- SSH Configuration (`ac-ssh`)
- Privilege Escalation (`ac-sudo`)
- Login Warning Banners (`pkg-banners`)
- PAM Configuration (`ac-pam`)
- Password Management (`ac-passwords`)
- User Account Management (`ac-users`)

### Logging & Auditing (28 checks)
- System Logging (`log-journald`)
- Audit Daemon (`log-auditd`)

---

## Example: Feature Check Flow

### GUI → CLI → Report Flow for Feature F-LNX-103

**Step 1: Visualize.tsx Definition**
```javascript
{ 
  id: "F-LNX-103", 
  type: "feature", 
  name: "hfs module disabled", 
  status: "critical",
  parent: "fs-kernel",
  annexure: "1.a.iii"
}
```

**Step 2: CLI Scan Detection**
```python
# In guardian.py scan() command
# Categorized under: Filesystem Security
# Total checks: 36
# This check: FAILED (critical)
```

**Step 3: Terminal Output**
```
Filesystem Security ━━━━━━━━━━━━━━━━ 100% 0:00:01
                    
Filesystem Security │  36  │  22  │  14  │  61.1%
```

**Step 4: PDF Report Entry**
```
┌─────────────────────────────────────────────────┐
│ Non-Compliant Items (Remediation Required)     │
├─────────────────────────────────────────────────┤
│ Parameter / Rule              │ Status          │
├───────────────────────────────┼─────────────────┤
│ F-LNX-103: hfs module        │ FAILED          │
│ disabled                      │                 │
│                              │                 │
│ Details: Security check failed: hfs module     │
│ disabled does not meet compliance requirements │
└─────────────────────────────────────────────────┘
```

---

## Compliance Calculation

### Formula
```
Compliance % = (Passed Checks / Total Checks) × 100
```

### Example: Filesystem Security
```
Total Checks: 36
Passed: 22
Failed: 14

Compliance = (22 / 36) × 100 = 61.1%
```

### Overall System Compliance
```
Total: 189 checks
Passed: 129
Failed: 60

Overall Compliance = (129 / 189) × 100 = 68.3%
```

---

## Status Color Coding

### In Terminal (Rich Library)
- 🟢 **Green**: Compliant/Passed (>80%)
- 🟡 **Yellow**: Warning (50-80%)
- 🔴 **Red**: Critical/Failed (<50%)

### In PDF (ReportLab)
- ✅ **Green background**: Compliant items
- ⚠️ **Red background**: Non-compliant items
- 📊 **Gray background**: Headers and totals

---

## Key Files

### Source Files
| File | Purpose | Lines |
|------|---------|-------|
| `src/pages/Visualize.tsx` | GUI data source | 3,774 |
| `guardian_cli/guardian.py` | CLI main logic | 1,236 |
| `guardian_cli/system_info.py` | Data parser | 100 |
| `guardian_cli/policies.py` | Policy definitions | ~500 |
| `feature_map.csv` | Policy mapping | 261 rows |

### Output Files
| File | Type | Size |
|------|------|------|
| `Guardian-Report-MUM-WEB-01-YYYYMMDD.pdf` | PDF Report | ~31KB |
| `SCAN_REPORT_SUMMARY.md` | Summary Doc | ~15KB |

---

## Future Enhancements

### Planned Features
1. ✨ **Real-time GUI Integration**
   - Live sync between CLI and web interface
   - WebSocket-based updates

2. 📊 **Enhanced Vulnerability Reporting**
   - CVE tracking
   - CVSS scoring
   - Patch recommendations

3. 🔄 **Automated Remediation**
   - One-click fixes for common issues
   - Rollback capabilities

4. 📈 **Trend Analysis**
   - Compliance over time
   - Historical comparisons
   - Predictive analytics

5. 🌐 **Multi-System Support**
   - Scan all Mumbai office systems
   - Cross-location comparisons
   - Fleet-wide reporting

---

## Troubleshooting

### Common Issues

**Issue**: Report generation fails
```bash
# Solution: Install dependencies
pip install click rich reportlab tqdm
```

**Issue**: No data from Visualize.tsx
```bash
# Solution: Check file path
ls -la src/pages/Visualize.tsx
```

**Issue**: Python version mismatch
```bash
# Solution: Use Python 3
python3 --version  # Should be 3.6+
```

---

## Conclusion

The Guardian CLI successfully integrates comprehensive security data from the Visualize.tsx GUI component to generate professional compliance reports. The integration ensures:

✅ **Data Consistency**: Same source data across CLI and GUI  
✅ **Comprehensive Coverage**: All 189 security controls  
✅ **Professional Output**: High-quality PDF reports  
✅ **Rich Terminal Experience**: Color-coded, interactive scanning  
✅ **Category Organization**: Logical grouping of security checks  

**Generated Report**: `Guardian-Report-MUM-WEB-01-20251005.pdf` (31KB)  
**Compliance Status**: 68.3% (Warning)  
**Scan Duration**: ~8 seconds  
**Next Steps**: Review and remediate 60 non-compliant items
