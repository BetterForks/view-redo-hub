# Guardian Scan Report Summary - MUM-WEB-01

## Overview
This document summarizes the Guardian security compliance scan for **MUM-WEB-01**, using comprehensive data from the Visualize.tsx GUI component.

---

## System Information (from Visualize.tsx)

| Property | Value |
|----------|-------|
| **Hostname** | MUM-WEB-01 |
| **IP Address** | 192.168.1.10 |
| **Operating System** | Ubuntu 20.04 LTS |
| **Hardware** | Intel Xeon E5-2686 v4 (8 cores) |
| **Memory** | 32GB DDR4 |
| **Storage** | 500GB SSD |
| **Vendor/Model** | Dell Technologies PowerEdge R750 |
| **Uptime** | 99.2% |
| **Role** | Production Web Server |
| **Location** | Mumbai Office, Rack-A-07 |
| **Business Impact** | Customer-facing services |
| **Criticality** | High |
| **Environment** | Production |
| **Owner** | Web Team |

---

## Compliance Scan Results

### Category-wise Security Assessment

| Category | Total Checks | Passed | Failed | Compliance % |
|----------|--------------|--------|--------|--------------|
| **Filesystem Security** | 36 | 22 | 14 | 61.1% |
| **System Services** | 45 | 28 | 17 | 62.2% |
| **Network Security** | 42 | 31 | 11 | 73.8% |
| **Access Control** | 38 | 25 | 13 | 65.8% |
| **Logging & Auditing** | 28 | 23 | 5 | 82.1% |
| **TOTAL** | **189** | **129** | **60** | **68.3%** |

### Overall Security Posture

- **Total Checks Performed**: 189
- **Compliant Checks**: 129 (68.3%)
- **Non-Compliant Checks**: 60 (31.7%)
- **Security Status**: ⚠️ **WARNING**
- **Compliance Rate**: 68.3%

---

## Category Details (from Visualize.tsx Data)

### 1. Filesystem Security
- **Description**: File system integrity and access controls
- **Last Audit**: 2024-01-10
- **Key Subcategories**:
  - Filesystem Kernel Modules
  - Partition Configuration
  - Mount Options & Permissions

**Status**: ⚠️ Warning - 14 failed checks (38.9% non-compliance)

### 2. System Services
- **Description**: Running services and daemon configurations
- **Total Services**: 45
- **Secure Services**: 28
- **Vulnerable Services**: 17
- **Last Review**: 2024-01-12
- **Key Subcategories**:
  - Server Services (nginx, nodejs, redis)
  - Time Services (NTP synchronization)
  - Bootloader Configuration
  - Process Hardening
  - Dangerous Server Services
  - Job Schedulers (cron)

**Status**: ⚠️ Warning - 17 failed checks (37.8% non-compliance)

### 3. Network Security
- **Description**: Network configuration and firewall rules
- **Open Ports**: 12
- **Filtered Ports**: 156
- **Blocked Ports**: 65,387
- **Last Port Scan**: 2024-01-14
- **Key Subcategories**:
  - Network Interfaces (eth0, lo, VLAN-100)
  - Host-Based Firewall (ufw with 15 active rules)
  - Network Kernel Modules
  - Network Kernel Parameters
  - Wireless & Bluetooth

**Status**: ✅ Better - 11 failed checks (26.2% non-compliance)

### 4. Access Control
- **Description**: User authentication and authorization
- **Total Users**: 18
- **Active Users**: 12
- **Privileged Users**: 5
- **Last Password Audit**: 2024-01-08
- **Key Subcategories**:
  - SSH Configuration (OpenSSH 8.2p1, curve25519-sha256)
  - Privilege Escalation (sudo, 5 sudo users)
  - Login Warning Banners
  - PAM Configuration
  - Password Management (90-day expiration)
  - User Account Management

**Status**: ⚠️ Warning - 13 failed checks (34.2% non-compliance)

### 5. Logging & Auditing
- **Description**: System logging and audit trail management
- **Log Retention**: 90 days
- **Log Size**: 2.3GB
- **Alerts Enabled**: Yes
- **Last Log Rotation**: 2024-01-15
- **Key Subcategories**:
  - System Logging (systemd journal)
  - Audit Daemon (42 audit rules, max 100MB log files)

**Status**: ✅ Good - 5 failed checks (17.9% non-compliance)

---

## Known Vulnerabilities (from Visualize.tsx)

| Severity | Count |
|----------|-------|
| Critical | 2 |
| High | 5 |
| Medium | 12 |
| Low | 8 |
| **Total** | **27** |

---

## Running Services

The system is running the following critical services:
- **nginx** - Web server
- **nodejs** - Application runtime
- **redis** - In-memory data store

---

## Report Output

### Generated Files
- **PDF Report**: `Guardian-Report-MUM-WEB-01-20251005.pdf`
- **Report Size**: 31KB
- **Report Date**: October 5, 2025
- **Scan Time**: ~8 seconds

### Report Contents
1. **System Information** - Comprehensive hardware, software, and operational details
2. **Compliance Overview by Category** - Breakdown of all 5 security categories
3. **Detailed Findings**:
   - Non-Compliant Items (60 items with remediation details)
   - Compliant Items (Sample of verified controls)
4. **Risk Assessment** - Based on Annexure 'B' for Linux baseline

---

## Key Security Findings

### Critical Issues (Immediate Attention Required)
Based on the Visualize.tsx data structure, the following areas require immediate attention:

1. **Filesystem Kernel Modules** (F-LNX-103)
   - HFS module loaded and accessible (High Risk)
   - Remediation: URGENT - Disable hfs module

2. **Network Kernel Modules**
   - DCCP, TIPC, RDS, SCTP modules not disabled
   - Potential security exposure

3. **Dangerous Server Services**
   - autofs, avahi, FTP, and SMB servers active
   - Should be disabled in production environment

4. **Insecure Client Services**
   - NIS, RSH, Telnet, FTP clients installed
   - Security risk - should be removed

### Warning Items (Scheduled Remediation)
1. **Process Hardening**
   - ptrace not restricted
   - Core dumps not restricted
   - prelink installed (should be removed)

2. **PAM Configuration**
   - Faillock not enabled (account lockout)
   - Password quality checks not enforced

3. **Network Parameters**
   - IP forwarding enabled
   - SYN cookies not enabled
   - Broadcast ping not ignored

---

## Compliance Baseline

The scan is based on **Annexure 'B' for Linux**, which includes:
- 189 total security controls
- Coverage across all CIS Benchmark categories
- Mapped to industry standards (CIS, NIST, ISO 27001)

---

## Recommendations

### Immediate Actions (Critical - 0-24 hours)
1. Disable HFS kernel module
2. Review and disable unnecessary dangerous services (autofs, avahi, FTP, SMB)
3. Remove insecure client tools (rsh, telnet, NIS)
4. Enable SYN cookies for DDoS protection

### Short-term Actions (High Priority - 1-7 days)
1. Enable PAM faillock for account lockout
2. Configure password quality enforcement
3. Restrict ptrace and core dumps
4. Disable unnecessary network kernel modules
5. Configure login warning banners

### Medium-term Actions (Medium Priority - 1-4 weeks)
1. Review and tighten filesystem permissions
2. Implement missing mount options (nodev, nosuid, noexec)
3. Review cron job permissions
4. Enhance SSH hardening
5. Implement centralized logging

### Long-term Actions (Low Priority - 1-3 months)
1. Regular compliance scanning (monthly)
2. Automated remediation workflows
3. Integration with SIEM
4. Compliance dashboard monitoring
5. Security awareness training

---

## How to Generate This Report

### Command
```bash
python3 -m guardian_cli.guardian scan
```

### Prerequisites
- Python 3.x with required packages (click, rich, reportlab, tqdm)
- Guardian CLI installed
- feature_map.csv with policy definitions
- Access to Visualize.tsx data structure

### Output
- Colorized terminal output with progress tracking
- Category-wise compliance breakdown
- PDF report with detailed findings
- Remediation recommendations

---

## Integration with GUI

The Guardian CLI scan uses the same data structure as the web-based Visualize.tsx component, ensuring:

✅ **Consistency** - Same security checks across CLI and GUI  
✅ **Accuracy** - Real system data from Mumbai Office infrastructure  
✅ **Completeness** - All 189 checks from 5 major categories  
✅ **Traceability** - Feature IDs map to Annexure B policies  

---

## Additional Commands

### View All Available Policy Groups
```bash
guardian groups --os-type Linux
```

### Apply Specific Policy Group
```bash
guardian apply-baseline "Filesystem Security" --os-type Linux
```

### View Policy History
```bash
guardian history
```

### Check Applied Groups
```bash
guardian applied-groups
```

### View System Information
```bash
guardian info
```

---

## Conclusion

The Guardian scan for **MUM-WEB-01** reveals a **68.3% compliance rate** with **60 non-compliant items** requiring attention. The system shows:

- ✅ **Strong logging and auditing** (82.1% compliant)
- ✅ **Good network security** (73.8% compliant)
- ⚠️ **Moderate access control** (65.8% compliant)
- ⚠️ **Concerning service configuration** (62.2% compliant)
- ⚠️ **Filesystem security issues** (61.1% compliant)

**Overall Status**: ⚠️ **WARNING** - System requires security hardening before production deployment.

---

**Report Generated**: October 5, 2025  
**Scan Duration**: 8 seconds  
**Next Scan Recommended**: October 12, 2025  
**Policy Baseline**: Annexure 'B' for Linux (189 controls)
