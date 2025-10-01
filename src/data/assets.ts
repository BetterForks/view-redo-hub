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
      {
        name: 'External Firewall Rule',
        layer: 'External',
        status: 'compliant',
      },
      {
        name: 'Custom Security Policy',
        layer: 'Custom',
        category: 'Policy Firewall Rules',
        subcategory: 'Ingress',
        status: 'compliant',
        oldConfig: 'port 80 = allow',
        newConfig: 'port 80 = deny\nport 443 = allow',
      },
      {
        name: 'Service Policy',
        layer: 'Custom',
        category: 'Service Policy',
        subcategory: 'SSH',
        status: 'non-compliant',
        oldConfig: 'PermitRootLogin yes',
        newConfig: 'PermitRootLogin no',
      },
      {
        name: 'CIS Benchmark',
        layer: 'Baseline',
        status: 'compliant',
      },
    ],
    policyChanges: [
      { id: 'pc1', policyName: 'Service Policy', timestamp: '2024-10-26 10:00:00', authorized: true, oldPolicy: 'PermitRootLogin yes', newPolicy: 'PermitRootLogin no', changedBy: 'admin', changeType: 'modified' },
      { id: 'pc2', policyName: 'External Firewall Rule', timestamp: '2024-10-26 09:00:00', authorized: false, oldPolicy: 'port 80 = allow', newPolicy: 'port 80 = deny\nport 443 = allow', changedBy: 'system', changeType: 'added' },
    ],
    location: "Mumbai"
  },
  // ... other assets are kept the same for now
];