export const assets = [
  {
    hostname: "prod-web-01",
    ip: "10.0.1.15",
    os: "Ubuntu 22.04 LTS",
    type: "Web Server",
    status: "Compliant",
    guardian: "Active",
    lastScan: "2 mins ago",
    policies: [
      { name: 'Custom Security Policy', type: 'Custom', status: 'compliant' },
      { name: 'Standard Server Policy', type: 'Server', status: 'compliant' },
      { name: 'CIS Benchmark', type: 'Network', status: 'compliant' },
      { name: 'PCI DSS', type: 'Custom', status: 'compliant' },
      { name: 'Internal Audit', type: 'Server', status: 'compliant' },
      { name: 'Firewall Rules', type: 'Network', status: 'compliant' },
      { name: 'User Access', type: 'Custom', status: 'compliant' },
      { name: 'Another Policy', type: 'Server', status: 'compliant' },
      { name: 'Yet Another Policy', type: 'Network', status: 'compliant' },
      { name: 'Final Policy', type: 'Custom', status: 'compliant' },
    ],
    policyChanges: [
      { id: 'pc1', policyName: 'Server Policy', timestamp: '2024-10-26 10:00:00', authorized: true, oldPolicy: 'max_retries = 3', newPolicy: 'max_retries = 5', changedBy: 'admin', changeType: 'modified' },
      { id: 'pc2', policyName: 'Firewall Rules', timestamp: '2024-10-26 09:00:00', authorized: false, oldPolicy: 'port 80 = allow', newPolicy: 'port 80 = deny\nport 443 = allow', changedBy: 'system', changeType: 'added' },
    ],
    location: "Mumbai"
  },
  {
    hostname: "prod-db-01",
    ip: "10.0.2.20",
    os: "Windows Server 2022",
    type: "Database",
    status: "Non-Compliant",
    guardian: "Active",
    lastScan: "5 mins ago",
    policies: [
      { name: 'Custom DB Policy', type: 'Custom', status: 'non-compliant' },
      { name: 'CIS Benchmark', type: 'Server', status: 'non-compliant' },
      { name: 'GDPR', type: 'Custom', status: 'compliant' },
      { name: 'Database Security', type: 'Server', status: 'non-compliant' },
      { name: 'Backup Policy', type: 'Network', status: 'compliant' },
    ],
    policyChanges: [
      { id: 'pc3', policyName: 'Backup Policy', timestamp: '2024-10-25 14:00:00', authorized: true, oldPolicy: 'frequency = daily', newPolicy: 'frequency = hourly', changedBy: 'db_admin', changeType: 'modified' },
    ],
    location: "Delhi"
  },
  {
    hostname: "dev-app-03",
    ip: "10.0.3.42",
    os: "Ubuntu 20.04 LTS",
    type: "Application",
    status: "Compliant",
    guardian: "Active",
    lastScan: "10 mins ago",
    policies: [
      { name: 'Dev Standards', type: 'Custom', status: 'compliant' },
      { name: 'Dependency Check', type: 'Server', status: 'compliant' },
    ],
    policyChanges: [],
    location: "Bangalore"
  },
  {
    hostname: "prod-web-02",
    ip: "10.0.1.16",
    os: "Ubuntu 22.04 LTS",
    type: "Web Server",
    status: "Warning",
    guardian: "Active",
    lastScan: "3 mins ago",
    policies: [
      { name: 'CIS Benchmark', type: 'Network', status: 'compliant' },
      { name: 'PCI DSS', type: 'Custom', status: 'non-compliant' },
      { name: 'Internal Audit', type: 'Server', status: 'compliant' },
    ],
    policyChanges: [
        { id: 'pc4', policyName: 'PCI DSS', timestamp: '2024-10-24 11:00:00', authorized: true, oldPolicy: 'encryption = on', newPolicy: 'encryption = off', changedBy: 'dev_user', changeType: 'removed' },
    ],
    location: "Mumbai"
  },
  {
    hostname: "backup-store-01",
    ip: "10.0.4.50",
    os: "CentOS 8",
    type: "Storage",
    status: "Compliant",
    guardian: "Active",
    lastScan: "8 mins ago",
    policies: [
      { name: 'Storage Security', type: 'Server', status: 'compliant' },
      { name: 'Backup Policy', type: 'Network', status: 'compliant' },
    ],
    policyChanges: [],
    location: "Delhi"
  },
  {
    hostname: "prod-api-01",
    ip: "10.0.1.25",
    os: "Ubuntu 22.04 LTS",
    type: "API Server",
    status: "Compliant",
    guardian: "Active",
    lastScan: "1 min ago",
    policies: [
      { name: 'API Security', type: 'Custom', status: 'compliant' },
      { name: 'Server Policy', type: 'Server', status: 'compliant' },
      { name: 'Rate Limiting', type: 'Network', status: 'compliant' },
    ],
    policyChanges: [],
    location: "Bangalore"
  },
];
