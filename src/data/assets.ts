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
      // External Policies
      { name: 'External Firewall Rule 1', layer: 'External', category: 'Firewall', subcategory: 'Ingress', status: 'successfully applied', oldConfig: 'port 22 = allow', newConfig: 'port 22 = deny' },
      { name: 'External Firewall Rule 2', layer: 'External', category: 'Firewall', subcategory: 'Egress', status: 'successfully applied', oldConfig: 'any', newConfig: 'specific IPs' },
      { name: 'Load Balancer Config', layer: 'External', category: 'Networking', subcategory: 'Load Balancer', status: 'failed', oldConfig: 'timeout = 30', newConfig: 'timeout = 60' },
      { name: 'CDN Policy', layer: 'External', category: 'Networking', subcategory: 'CDN', status: 'successfully applied', oldConfig: 'cache = off', newConfig: 'cache = on' },
      { name: 'DDoS Protection', layer: 'External', category: 'Security', subcategory: 'DDoS', status: 'successfully applied', oldConfig: 'rate_limit = 100/s', newConfig: 'rate_limit = 1000/s' },
      { name: 'WAF Rule', layer: 'External', category: 'Security', subcategory: 'WAF', status: 'successfully applied', oldConfig: 'mode = detection', newConfig: 'mode = prevention' },
      { name: 'DNS Config', layer: 'External', category: 'Networking', subcategory: 'DNS', status: 'failed', oldConfig: 'TTL = 3600', newConfig: 'TTL = 300' },
      { name: 'SSL/TLS Certificate', layer: 'External', category: 'Security', subcategory: 'SSL', status: 'successfully applied', oldConfig: 'TLSv1.2', newConfig: 'TLSv1.3' },
      { name: 'IAM Role', layer: 'External', category: 'IAM', subcategory: 'EC2 Role', status: 'successfully applied', oldConfig: 'role = read_only', newConfig: 'role = read_write' },
      { name: 'VPC Peering', layer: 'External', category: 'Networking', subcategory: 'VPC', status: 'successfully applied', oldConfig: 'disabled', newConfig: 'enabled' },

      // Custom Policies
      { name: 'Custom Security Policy', layer: 'Custom', category: 'Policy Firewall Rules', subcategory: 'Ingress', status: 'successfully applied', oldConfig: 'port 80 = allow', newConfig: 'port 80 = deny\nport 443 = allow' },
      { name: 'Service Policy', layer: 'Custom', category: 'Service Policy', subcategory: 'SSH', status: 'failed', oldConfig: 'PermitRootLogin yes', newConfig: 'PermitRootLogin no' },
      { name: 'User Access Control', layer: 'Custom', category: 'Access Control', subcategory: 'Sudoers', status: 'successfully applied', oldConfig: 'user ALL=(ALL) ALL', newConfig: 'user ALL=(ALL) /usr/bin/specific' },
      { name: 'File Integrity Monitoring', layer: 'Custom', category: 'Monitoring', subcategory: 'FIM', status: 'successfully applied', oldConfig: '/etc/passwd', newConfig: '/etc/passwd\n/etc/shadow' },
      { name: 'Logging Policy', layer: 'Custom', category: 'Logging', subcategory: 'Syslog', status: 'failed', oldConfig: 'log_level = info', newConfig: 'log_level = debug' },
      { name: 'NTP Configuration', layer: 'Custom', category: 'System', subcategory: 'NTP', status: 'successfully applied', oldConfig: 'server time.google.com', newConfig: 'server time.nist.gov' },
      { name: 'Kernel Parameter Tuning', layer: 'Custom', category: 'System', subcategory: 'Kernel', status: 'successfully applied', oldConfig: 'net.ipv4.tcp_syncookies = 0', newConfig: 'net.ipv4.tcp_syncookies = 1' },
      { name: 'Password Policy', layer: 'Custom', category: 'Access Control', subcategory: 'Password', status: 'successfully applied', oldConfig: 'min_length = 8', newConfig: 'min_length = 12' },
      { name: 'Auditd Rules', layer: 'Custom', category: 'Monitoring', subcategory: 'Auditd', status: 'failed', oldConfig: '-w /etc/hosts -p wa -k hosts_file', newConfig: '-w /etc/hosts -p war -k hosts_file' },
      { name: 'SELinux/AppArmor', layer: 'Custom', category: 'Security', subcategory: 'Mandatory Access Control', status: 'successfully applied', oldConfig: 'enforcing', newConfig: 'enforcing' },

      // Baseline Policies
      { name: 'CIS Benchmark', layer: 'Baseline', status: 'successfully applied' },
    ],
    policyChanges: [
      { id: 'pc1', policyName: 'Service Policy', timestamp: '2024-10-26 10:00:00', authorized: true, oldPolicy: 'PermitRootLogin yes', newPolicy: 'PermitRootLogin no', changedBy: 'admin', changeType: 'modified' },
      { id: 'pc2', policyName: 'External Firewall Rule', timestamp: '2024-10-26 09:00:00', authorized: false, oldPolicy: 'port 80 = allow', newPolicy: 'port 80 = deny\nport 443 = allow', changedBy: 'system', changeType: 'added' },
    ],
    location: "Mumbai"
  },
  // ... other assets are kept the same for now
];
