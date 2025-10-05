import { AppLayout } from "@/components/AppLayout";
import { StartNewScanDialog } from "@/components/StartNewScanDialog";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronRight, Building2, Server, MapPin, Database, Globe, Shield, HardDrive, Cpu, Network, Lock, Target, Eye } from "lucide-react";

export default function Visualize() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<any | null>(null); // For info panel
  const [expandedLocations, setExpandedLocations] = useState<Set<string>>(new Set());
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [currentView, setCurrentView] = useState<'location-systems' | 'system-details'>('location-systems');
  const [isInfrastructureCollapsed, setIsInfrastructureCollapsed] = useState(true); // Start collapsed for more space
  const [showScanDialog, setShowScanDialog] = useState(false);
  const [metrics, setMetrics] = useState({
    compliant: 67,
    warning: 12,
    critical: 8,
    total: 87
  });

  // Mock location data for scan dialog
  const mockLocationsForScan = {
    "mumbai": {
      name: "Mumbai Office",
      region: "West India",
      systems: [
        { id: "mumbai-web-01", name: "MUM-WEB-01", type: "web-server", status: "warning" as const, ip: "192.168.1.10", os: "Ubuntu 20.04 LTS", owner: "Web Team", environment: "production" },
        { id: "mumbai-db-01", name: "MUM-DB-01", type: "database", status: "critical" as const, ip: "192.168.1.20", os: "CentOS 8", owner: "Database Team", environment: "production" },
        { id: "mumbai-app-01", name: "MUM-APP-01", type: "application", status: "warning" as const, ip: "192.168.1.30", os: "RHEL 8.5", owner: "DevOps Team", environment: "production" },
        { id: "mumbai-proxy-01", name: "MUM-PROXY-01", type: "load-balancer", status: "critical" as const, ip: "192.168.1.40", os: "Ubuntu 22.04 LTS", owner: "Network Team", environment: "production" },
        { id: "mumbai-ws-01", name: "MUM-WS-01", type: "workstation", status: "warning" as const, ip: "192.168.1.101", os: "Windows 11 Pro 22H2", owner: "Finance Team", environment: "production" },
        { id: "mumbai-ws-02", name: "MUM-WS-02", type: "workstation", status: "critical" as const, ip: "192.168.1.102", os: "Windows 10 Pro 21H2", owner: "HR Team", environment: "production" },
        { id: "mumbai-ws-03", name: "MUM-WS-03", type: "workstation", status: "compliant" as const, ip: "192.168.1.103", os: "Windows 11 Pro 23H2", owner: "IT Security Team", environment: "production" }
      ]
    },
    "delhi": {
      name: "Delhi Office", 
      region: "North India",
      systems: [
        { id: "delhi-web-01", name: "DEL-WEB-01", type: "web-server", status: "warning" as const, ip: "192.168.2.10", os: "Ubuntu 22.04 LTS", owner: "Web Team", environment: "production" },
        { id: "delhi-db-01", name: "DEL-DB-01", type: "database", status: "compliant" as const, ip: "192.168.2.20", os: "PostgreSQL 14", owner: "Database Team", environment: "production" },
        { id: "delhi-app-01", name: "DEL-APP-01", type: "application", status: "warning" as const, ip: "192.168.2.30", os: "Ubuntu 20.04 LTS", owner: "DevOps Team", environment: "production" },
        { id: "delhi-ws-01", name: "DEL-WS-01", type: "workstation", status: "compliant" as const, ip: "192.168.2.101", os: "Windows 11 Pro 23H2", owner: "Sales Team", environment: "production" },
        { id: "delhi-ws-02", name: "DEL-WS-02", type: "workstation", status: "warning" as const, ip: "192.168.2.102", os: "Windows 10 Pro 22H2", owner: "Marketing Team", environment: "production" }
      ]
    }
  };

  const handleStartScan = (scanConfig: any) => {
    console.log("Starting scan from visualization with config:", scanConfig);
    // This could redirect to scans page or show a toast notification
  };

  // Helper function to render node information
  const renderNodeInfo = (node: any) => {
    if (!node) return null;

    if (node.type === "system" && currentView === 'location-systems') {
      const system = node.details;
      return (
        <div className="space-y-3">
          <div className="border-b pb-2">
            <h3 className="font-semibold text-lg text-blue-600">{node.name}</h3>
            <p className="text-sm text-muted-foreground">System Overview</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="font-medium">Type:</span> {system.type}</div>
            <div><span className="font-medium">Status:</span> <span className={`px-2 py-1 rounded text-xs ${
              system.status === 'compliant' ? 'bg-green-100 text-green-800' :
              system.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>{system.status.toUpperCase()}</span></div>
            <div><span className="font-medium">IP:</span> {system.ip}</div>
            <div><span className="font-medium">Uptime:</span> {system.uptime}</div>
            <div className="col-span-2"><span className="font-medium">OS:</span> {system.os}</div>
            <div className="col-span-2"><span className="font-medium">CPU:</span> {system.cpu}</div>
            <div><span className="font-medium">Memory:</span> {system.memory}</div>
            <div><span className="font-medium">Storage:</span> {system.storage}</div>
          </div>
          <div className="border-t pt-2">
            <div className="text-sm font-medium mb-2">Vulnerabilities</div>
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div className="bg-red-100 text-red-800 p-2 rounded text-center">
                <div className="font-bold">{system.vulnerabilities.critical}</div>
                <div>Critical</div>
              </div>
              <div className="bg-orange-100 text-orange-800 p-2 rounded text-center">
                <div className="font-bold">{system.vulnerabilities.high}</div>
                <div>High</div>
              </div>
              <div className="bg-yellow-100 text-yellow-800 p-2 rounded text-center">
                <div className="font-bold">{system.vulnerabilities.medium}</div>
                <div>Medium</div>
              </div>
              <div className="bg-blue-100 text-blue-800 p-2 rounded text-center">
                <div className="font-bold">{system.vulnerabilities.low}</div>
                <div>Low</div>
              </div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground italic bg-blue-50 p-2 rounded">
            💡 Click to drill down into security details
          </div>
        </div>
      );
    } else if (node.type === "system") {
      // System details view (from systemsData)
      return (
        <div className="space-y-3">
          <div className="border-b pb-2">
            <h3 className="font-semibold text-lg text-blue-600">{node.name}</h3>
            <p className="text-sm text-muted-foreground">Security Configuration</p>
          </div>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div><span className="font-medium">Role:</span> {node.role || 'N/A'}</div>
            <div><span className="font-medium">IP Address:</span> {node.ip || 'N/A'}</div>
            <div><span className="font-medium">Hardware:</span> {node.vendor || 'N/A'} {node.model || ''}</div>
            <div><span className="font-medium">Serial:</span> <span className="font-mono text-xs">{node.serialNumber || 'N/A'}</span></div>
          </div>
          <div className="text-xs text-muted-foreground italic bg-purple-50 p-2 rounded">
            💡 Click to expand/collapse security categories
          </div>
        </div>
      );
    } else if (node.type === "category") {
      return (
        <div className="space-y-3">
          <div className="border-b pb-2">
            <h3 className="font-semibold text-lg text-purple-600">{node.name}</h3>
            <p className="text-sm text-muted-foreground">Security Category</p>
          </div>
          <div className="space-y-2 text-sm">
            <div><span className="font-medium">Description:</span> {node.details?.description || 'N/A'}</div>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <div className="bg-green-100 text-green-800 p-2 rounded text-center">
                <div className="font-bold">{node.details?.passedChecks || 0}</div>
                <div className="text-xs">Passed</div>
              </div>
              <div className="bg-red-100 text-red-800 p-2 rounded text-center">
                <div className="font-bold">{node.details?.failedChecks || 0}</div>
                <div className="text-xs">Failed</div>
              </div>
              <div className="bg-blue-100 text-blue-800 p-2 rounded text-center">
                <div className="font-bold">{node.details?.totalChecks || 0}</div>
                <div className="text-xs">Total</div>
              </div>
            </div>
            <div><span className="font-medium">Last Audit:</span> {node.details?.lastAudit || 'N/A'}</div>
          </div>
          <div className="text-xs text-muted-foreground italic bg-purple-50 p-2 rounded">
            💡 Click to expand/collapse subcategories
          </div>
        </div>
      );
    } else if (node.type === "subcategory") {
      return (
        <div className="space-y-3">
          <div className="border-b pb-2">
            <h3 className="font-semibold text-lg text-teal-600">{node.name}</h3>
            <p className="text-sm text-muted-foreground">Security Sub-Category</p>
          </div>
          <div className="text-sm">
            <div><span className="font-medium">Description:</span> {node.details?.description || 'N/A'}</div>
          </div>
          <div className="text-xs text-muted-foreground italic bg-teal-50 p-2 rounded">
            💡 Click to expand/collapse security features
          </div>
        </div>
      );
    } else if (node.type === "feature") {
      return (
        <div className="space-y-3">
          <div className="border-b pb-2">
            <h3 className="font-semibold text-lg text-orange-600">{node.name}</h3>
            <p className="text-sm text-muted-foreground">Security Feature</p>
          </div>
          <div className="space-y-2 text-sm">
            <div className="bg-gray-100 p-2 rounded">
              <span className="font-medium">ID:</span> <span className="font-mono text-xs">{node.id}</span>
            </div>
            <div><span className="font-medium">Status:</span> <span className={`px-2 py-1 rounded text-xs ${
              node.status === 'compliant' ? 'bg-green-100 text-green-800' :
              node.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>{node.status.toUpperCase()}</span></div>
            <div><span className="font-medium">Risk Level:</span> {node.details?.riskLevel || 'N/A'}</div>
            <div><span className="font-medium">Check Type:</span> {node.details?.checkType || 'N/A'}</div>
            <div><span className="font-medium">Expected:</span> <span className="font-mono text-xs">{node.details?.expectedValue || 'N/A'}</span></div>
            <div><span className="font-medium">Actual:</span> <span className="font-mono text-xs">{node.details?.actualValue || 'N/A'}</span></div>
            <div><span className="font-medium">Annexure:</span> {node.annexure || 'N/A'}</div>
            <div className="border-t pt-2"><span className="font-medium">Description:</span> {node.description || 'N/A'}</div>
            <div className="bg-blue-50 p-2 rounded"><span className="font-medium">Remediation:</span> {node.details?.remediation || 'N/A'}</div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <div className="border-b pb-2">
          <h3 className="font-semibold text-lg">{node.name || 'Unknown Node'}</h3>
          <p className="text-sm text-muted-foreground">Type: {node.type || 'Unknown'}</p>
        </div>
        <p className="text-sm text-muted-foreground">Click on a node to view detailed information.</p>
      </div>
    );
  };

  useEffect(() => {
    // Add D3.js script if not already loaded
    if (!(window as any).d3) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js';
      script.onload = () => initVisualization();
      document.head.appendChild(script);
    } else {
      initVisualization();
    }
  }, [selectedLocation, selectedSystem, selectedNode, expandedNodes, currentView]);

  const initVisualization = () => {
    if (!svgRef.current || !(window as any).d3) return;

    const d3 = (window as any).d3;
    
    // Enhanced location-based infrastructure data with comprehensive mock data
    const locationsData = {
      "mumbai": {
        name: "Mumbai Office",
        region: "West India",
        address: "Bandra Kurla Complex, Mumbai 400051",
        datacenter: "DC-MUM-01",
        established: "2018",
        capacity: "500 employees",
        systems: [
          { 
            id: "mumbai-web-01", 
            name: "MUM-WEB-01", 
            type: "web-server", 
            status: "warning", 
            ip: "192.168.1.10",
            os: "Ubuntu 20.04 LTS",
            cpu: "Intel Xeon E5-2686 v4 (8 cores)",
            memory: "32GB DDR4",
            storage: "500GB SSD",
            uptime: "99.2%",
            lastScan: "2024-01-15 14:30:00",
            vulnerabilities: { critical: 2, high: 5, medium: 12, low: 8 },
            services: ["nginx", "nodejs", "redis"],
            owner: "Web Team",
            environment: "production"
          },
          { 
            id: "mumbai-db-01", 
            name: "MUM-DB-01", 
            type: "database", 
            status: "critical", 
            ip: "192.168.1.20",
            os: "CentOS 8",
            cpu: "Intel Xeon Gold 6242 (16 cores)",
            memory: "128GB DDR4",
            storage: "2TB NVMe SSD RAID-1",
            uptime: "98.7%",
            lastScan: "2024-01-15 09:15:00",
            vulnerabilities: { critical: 7, high: 3, medium: 8, low: 2 },
            services: ["postgresql", "pgbouncer", "pg_stat_monitor"],
            owner: "Database Team",
            environment: "production"
          },
          { 
            id: "mumbai-app-01", 
            name: "MUM-APP-01", 
            type: "application", 
            status: "warning", 
            ip: "192.168.1.30",
            os: "RHEL 8.5",
            cpu: "AMD EPYC 7542 (12 cores)",
            memory: "64GB DDR4",
            storage: "1TB SSD",
            uptime: "99.8%",
            lastScan: "2024-01-15 16:45:00",
            vulnerabilities: { critical: 3, high: 8, medium: 15, low: 12 },
            services: ["docker", "kubernetes", "prometheus"],
            owner: "DevOps Team",
            environment: "production"
          },
          { 
            id: "mumbai-proxy-01", 
            name: "MUM-PROXY-01", 
            type: "load-balancer", 
            status: "critical", 
            ip: "192.168.1.40",
            os: "Ubuntu 22.04 LTS",
            cpu: "Intel Core i7-10700K (8 cores)",
            memory: "16GB DDR4",
            storage: "256GB SSD",
            uptime: "99.5%",
            lastScan: "2024-01-15 12:20:00",
            vulnerabilities: { critical: 5, high: 4, medium: 6, low: 5 },
            services: ["haproxy", "keepalived", "rsyslog"],
            owner: "Network Team",
            environment: "production"
          },
          // Employee Workstations - Mumbai Office
          { 
            id: "mumbai-ws-01", 
            name: "MUM-WS-01", 
            type: "workstation", 
            status: "warning", 
            ip: "192.168.1.101",
            os: "Windows 11 Pro 22H2",
            cpu: "Intel Core i7-12700 (12 cores)",
            memory: "32GB DDR4",
            storage: "1TB NVMe SSD",
            uptime: "99.1%",
            lastScan: "2024-01-15 09:15:00",
            vulnerabilities: { critical: 8, high: 12, medium: 25, low: 18 },
            services: ["Windows Update", "Defender", "BitLocker"],
            owner: "Finance Team",
            environment: "production",
            user: "john.smith@guardian.com"
          },
          { 
            id: "mumbai-ws-02", 
            name: "MUM-WS-02", 
            type: "workstation", 
            status: "critical", 
            ip: "192.168.1.102",
            os: "Windows 10 Pro 21H2",
            cpu: "Intel Core i5-10400 (6 cores)",
            memory: "16GB DDR4",
            storage: "512GB SSD",
            uptime: "97.8%",
            lastScan: "2024-01-15 09:20:00",
            vulnerabilities: { critical: 15, high: 8, medium: 12, low: 6 },
            services: ["Windows Update", "Defender", "Office 365"],
            owner: "HR Team",
            environment: "production",
            user: "sarah.jones@guardian.com"
          },
          { 
            id: "mumbai-ws-03", 
            name: "MUM-WS-03", 
            type: "workstation", 
            status: "compliant", 
            ip: "192.168.1.103",
            os: "Windows 11 Pro 23H2",
            cpu: "Intel Core i7-13700 (16 cores)",
            memory: "32GB DDR5",
            storage: "1TB NVMe SSD",
            uptime: "99.8%",
            lastScan: "2024-01-15 09:25:00",
            vulnerabilities: { critical: 0, high: 2, medium: 5, low: 8 },
            services: ["Windows Update", "Defender", "BitLocker", "LAPS"],
            owner: "IT Security Team",
            environment: "production",
            user: "mike.wilson@guardian.com"
          }
        ]
      },
      "delhi": {
        name: "Delhi Office",
        region: "North India",
        address: "Connaught Place, New Delhi 110001",
        datacenter: "DC-DEL-01",
        established: "2019",
        capacity: "300 employees",
        systems: [
          { 
            id: "delhi-web-01", 
            name: "DEL-WEB-01", 
            type: "web-server", 
            status: "warning", 
            ip: "192.168.2.10",
            os: "Ubuntu 22.04 LTS",
            cpu: "Intel Xeon E5-2676 v3 (6 cores)",
            memory: "24GB DDR4",
            storage: "512GB SSD",
            uptime: "99.9%",
            lastScan: "2024-01-15 11:30:00",
            vulnerabilities: { critical: 2, high: 6, medium: 8, low: 15 },
            services: ["apache2", "php-fpm", "memcached"],
            owner: "Web Team",
            environment: "production"
          },
          { 
            id: "delhi-db-01", 
            name: "DEL-DB-01", 
            type: "database", 
            status: "critical", 
            ip: "192.168.2.20",
            os: "CentOS 8",
            cpu: "Intel Xeon Silver 4214 (12 cores)",
            memory: "96GB DDR4",
            storage: "1.5TB SSD RAID-1",
            uptime: "99.1%",
            lastScan: "2024-01-15 08:45:00",
            vulnerabilities: { critical: 12, high: 6, medium: 10, low: 7 },
            services: ["mysql", "mysqldump", "percona-toolkit"],
            owner: "Database Team",
            environment: "production"
          },
          { 
            id: "delhi-app-01", 
            name: "DEL-APP-01", 
            type: "application", 
            status: "compliant", 
            ip: "192.168.2.30",
            os: "RHEL 9.1",
            cpu: "AMD EPYC 7302P (8 cores)",
            memory: "48GB DDR4",
            storage: "800GB SSD",
            uptime: "99.6%",
            lastScan: "2024-01-15 15:10:00",
            vulnerabilities: { critical: 0, high: 2, medium: 5, low: 9 },
            services: ["tomcat", "elasticsearch", "logstash"],
            owner: "Application Team",
            environment: "production"
          },
          // Employee Workstations - Delhi Office
          { 
            id: "delhi-ws-01", 
            name: "DEL-WS-01", 
            type: "workstation", 
            status: "critical", 
            ip: "192.168.2.101",
            os: "Windows 10 Pro 20H2",
            cpu: "Intel Core i5-9400 (6 cores)",
            memory: "16GB DDR4",
            storage: "256GB SSD",
            uptime: "96.2%",
            lastScan: "2024-01-15 10:30:00",
            vulnerabilities: { critical: 22, high: 15, medium: 18, low: 12 },
            services: ["Windows Update", "Defender"],
            owner: "Marketing Team",
            environment: "production",
            user: "priya.sharma@guardian.com"
          },
          { 
            id: "delhi-ws-02", 
            name: "DEL-WS-02", 
            type: "workstation", 
            status: "warning", 
            ip: "192.168.2.102",
            os: "Windows 11 Pro 22H2",
            cpu: "Intel Core i7-11700 (8 cores)",
            memory: "32GB DDR4",
            storage: "512GB NVMe SSD",
            uptime: "98.5%",
            lastScan: "2024-01-15 10:35:00",
            vulnerabilities: { critical: 6, high: 9, medium: 14, low: 11 },
            services: ["Windows Update", "Defender", "Office 365"],
            owner: "Sales Team",
            environment: "production",
            user: "raj.kumar@guardian.com"
          },
          { 
            id: "delhi-ws-03", 
            name: "DEL-WS-03", 
            type: "workstation", 
            status: "warning", 
            ip: "192.168.2.103",
            os: "Windows 10 Pro 22H2",
            cpu: "Intel Core i5-10400 (6 cores)",
            memory: "16GB DDR4",
            storage: "512GB SSD",
            uptime: "97.1%",
            lastScan: "2024-01-15 10:40:00",
            vulnerabilities: { critical: 4, high: 12, medium: 20, low: 15 },
            services: ["Windows Update", "Defender", "BitLocker"],
            owner: "Operations Team",
            environment: "production",
            user: "neha.gupta@guardian.com"
          }
        ]
      },
      "bangalore": {
        name: "Bangalore Office",
        region: "South India",
        address: "Electronic City, Bangalore 560100",
        datacenter: "DC-BLR-01",
        established: "2020",
        capacity: "750 employees",
        systems: [
          { 
            id: "blr-web-01", 
            name: "BLR-WEB-01", 
            type: "web-server", 
            status: "warning", 
            ip: "192.168.3.10",
            os: "Ubuntu 20.04 LTS",
            cpu: "Intel Xeon Platinum 8259CL (12 cores)",
            memory: "48GB DDR4",
            storage: "1TB NVMe SSD",
            uptime: "99.7%",
            lastScan: "2024-01-15 13:20:00",
            vulnerabilities: { critical: 1, high: 4, medium: 8, low: 18 },
            services: ["nginx", "gunicorn", "celery"],
            owner: "Platform Team",
            environment: "production"
          },
          { 
            id: "blr-db-01", 
            name: "BLR-DB-01", 
            type: "database", 
            status: "critical", 
            ip: "192.168.3.20",
            os: "PostgreSQL on Ubuntu 18.04",
            cpu: "Intel Xeon Gold 6248 (20 cores)",
            memory: "256GB DDR4",
            storage: "4TB SSD RAID-10",
            uptime: "97.8%",
            lastScan: "2024-01-15 07:30:00",
            vulnerabilities: { critical: 18, high: 12, medium: 15, low: 5 },
            services: ["postgresql", "pg_repack", "barman"],
            owner: "Database Team",
            environment: "production"
          },
          { 
            id: "blr-cache-01", 
            name: "BLR-CACHE-01", 
            type: "cache", 
            status: "warning", 
            ip: "192.168.3.50",
            os: "Redis on Alpine Linux",
            cpu: "Intel Core i5-10400F (6 cores)",
            memory: "32GB DDR4",
            storage: "512GB SSD",
            uptime: "99.9%",
            lastScan: "2024-01-15 14:00:00",
            vulnerabilities: { critical: 2, high: 3, medium: 8, low: 6 },
            services: ["redis", "redis-sentinel", "stunnel"],
            owner: "Platform Team",
            environment: "production"
          },
          // Employee Workstations - Bangalore Office
          { 
            id: "blr-ws-01", 
            name: "BLR-WS-01", 
            type: "workstation", 
            status: "compliant", 
            ip: "192.168.3.101",
            os: "Windows 11 Pro 23H2",
            cpu: "Intel Core i7-12700K (12 cores)",
            memory: "32GB DDR4",
            storage: "1TB NVMe SSD",
            uptime: "99.5%",
            lastScan: "2024-01-15 11:45:00",
            vulnerabilities: { critical: 0, high: 1, medium: 3, low: 5 },
            services: ["Windows Update", "Defender", "BitLocker", "LAPS"],
            owner: "IT Team",
            environment: "production",
            user: "david.chen@guardian.com"
          },
          { 
            id: "blr-ws-02", 
            name: "BLR-WS-02", 
            type: "workstation", 
            status: "warning", 
            ip: "192.168.3.102",
            os: "Windows 10 Pro 21H2",
            cpu: "AMD Ryzen 7 5700X (8 cores)",
            memory: "32GB DDR4",
            storage: "512GB SSD",
            uptime: "98.2%",
            lastScan: "2024-01-15 11:50:00",
            vulnerabilities: { critical: 3, high: 8, medium: 16, low: 12 },
            services: ["Windows Update", "Defender", "Office 365"],
            owner: "Development Team",
            environment: "production",
            user: "anita.patel@guardian.com"
          },
          { 
            id: "blr-ws-03", 
            name: "BLR-WS-03", 
            type: "workstation", 
            status: "critical", 
            ip: "192.168.3.103",
            os: "Windows 10 Pro 19H2",
            cpu: "Intel Core i5-8400 (6 cores)",
            memory: "16GB DDR4",
            storage: "256GB SSD",
            uptime: "95.8%",
            lastScan: "2024-01-15 11:55:00",
            vulnerabilities: { critical: 28, high: 16, medium: 22, low: 8 },
            services: ["Windows Update", "Defender"],
            owner: "Support Team",
            environment: "production",
            user: "kumar.reddy@guardian.com"
          },
          { 
            id: "blr-ws-04", 
            name: "BLR-WS-04", 
            type: "workstation", 
            status: "warning", 
            ip: "192.168.3.104",
            os: "Windows 11 Pro 22H2",
            cpu: "Intel Core i7-11800H (8 cores)",
            memory: "32GB DDR4",
            storage: "1TB SSD",
            uptime: "97.9%",
            lastScan: "2024-01-15 12:00:00",
            vulnerabilities: { critical: 2, high: 6, medium: 18, low: 14 },
            services: ["Windows Update", "Defender", "BitLocker", "VPN"],
            owner: "Security Team",
            environment: "production",
            user: "lisa.fernandez@guardian.com"
          }
        ]
      }
    };

    // Enhanced system detail data with comprehensive security features from CSV
    const systemsData = {
      "mumbai-web-01": {
        name: "MUM-WEB-01",
        ip: "192.168.1.10",
        role: "Production Web Server",
        status: "warning",
        location: "Mumbai Office",
        rack: "Rack-A-07",
        serialNumber: "MWS-2023-001",
        purchaseDate: "2023-03-15",
        warranty: "3 years",
        vendor: "Dell Technologies",
        model: "PowerEdge R750",
        nodes: [
          { 
            id: "mumbai-web-01", 
            type: "system", 
            name: "MUM-WEB-01", 
            status: "system", 
            level: 0,
            details: {
              description: "Primary web server handling client requests",
              criticality: "High",
              businessImpact: "Customer-facing services",
              maintenanceWindow: "Sundays 2:00-4:00 AM IST"
            }
          },
          
          // Main Categories with enhanced details
          { 
            id: "filesystem", 
            type: "category", 
            name: "Filesystem Security", 
            status: "category", 
            level: 1,
            details: {
              description: "File system integrity and access controls",
              totalChecks: 36,
              passedChecks: 22,
              failedChecks: 14,
              lastAudit: "2024-01-10"
            }
          },
          { 
            id: "services", 
            type: "category", 
            name: "System Services", 
            status: "category", 
            level: 1,
            details: {
              description: "Running services and daemon configurations",
              totalServices: 45,
              secureServices: 28,
              vulnerableServices: 17,
              lastReview: "2024-01-12"
            }
          },
          { 
            id: "network", 
            type: "category", 
            name: "Network Security", 
            status: "category", 
            level: 1,
            details: {
              description: "Network configuration and firewall rules",
              openPorts: 12,
              filteredPorts: 156,
              blockedPorts: 65387,
              lastPortScan: "2024-01-14"
            }
          },
          { 
            id: "access-control", 
            type: "category", 
            name: "Access Control", 
            status: "category", 
            level: 1,
            details: {
              description: "User authentication and authorization",
              totalUsers: 18,
              activeUsers: 12,
              privilegedUsers: 5,
              lastPasswordAudit: "2024-01-08"
            }
          },
          { 
            id: "logging", 
            type: "category", 
            name: "Logging & Auditing", 
            status: "category", 
            level: 1,
            details: {
              description: "System logging and audit trail management",
              logRetention: "90 days",
              logSize: "2.3GB",
              alertsEnabled: true,
              lastLogRotation: "2024-01-15"
            }
          },
          
          // Sub-Categories with detailed information
          { 
            id: "fs-kernel", 
            type: "subcategory", 
            name: "Filesystem Kernel Modules", 
            status: "subcategory", 
            level: 2, 
            parent: "filesystem",
            details: {
              description: "Kernel module security configurations",
              moduleCount: 10,
              disabledModules: 6,
              requiredModules: 4,
              complianceRate: "60%"
            }
          },
          { 
            id: "fs-partitions", 
            type: "subcategory", 
            name: "Partition Configuration", 
            status: "subcategory", 
            level: 2, 
            parent: "filesystem",
            details: {
              description: "Disk partition security settings",
              totalPartitions: 8,
              encryptedPartitions: 3,
              separatePartitions: 4,
              mountOptions: "nodev,nosuid,noexec"
            }
          },
          { 
            id: "svc-server", 
            type: "subcategory", 
            name: "Server Services", 
            status: "subcategory", 
            level: 2, 
            parent: "services",
            details: {
              description: "Web and application server configurations",
              webServer: "nginx 1.20.2",
              appServer: "nodejs 16.14.0",
              proxyServer: "enabled",
              sslEnabled: true
            }
          },
          { 
            id: "svc-time", 
            type: "subcategory", 
            name: "Time Services", 
            status: "subcategory", 
            level: 2, 
            parent: "services",
            details: {
              description: "Time synchronization services",
              ntpServers: ["0.ubuntu.pool.ntp.org", "1.ubuntu.pool.ntp.org"],
              syncStatus: "synchronized",
              clockAccuracy: "±2ms",
              lastSync: "2024-01-15 16:30:15"
            }
          },
          { 
            id: "net-devices", 
            type: "subcategory", 
            name: "Network Interfaces", 
            status: "subcategory", 
            level: 2, 
            parent: "network",
            details: {
              description: "Network device configurations",
              interfaces: ["eth0", "lo"],
              bandwidth: "1Gbps",
              vlan: "VLAN-100",
              bondingMode: "active-backup"
            }
          },
          { 
            id: "net-firewall", 
            type: "subcategory", 
            name: "Host Based Firewall", 
            status: "subcategory", 
            level: 2, 
            parent: "network",
            details: {
              description: "Host-based firewall configuration",
              firewallType: "ufw",
              activeRules: 15,
              deniedConnections: 1247,
              allowedPorts: "22,80,443"
            }
          },
          { 
            id: "ac-ssh", 
            type: "subcategory", 
            name: "SSH Configuration", 
            status: "subcategory", 
            level: 2, 
            parent: "access-control",
            details: {
              description: "SSH server security settings",
              sshVersion: "OpenSSH 8.2p1",
              keyExchange: "curve25519-sha256",
              encryption: "aes256-gcm",
              maxAuthTries: 3
            }
          },
          { 
            id: "ac-sudo", 
            type: "subcategory", 
            name: "Privilege Escalation", 
            status: "subcategory", 
            level: 2, 
            parent: "access-control",
            details: {
              description: "Privilege escalation controls",
              sudoUsers: 5,
              passwordRequired: true,
              sessionTimeout: "15 minutes",
              logCommands: true
            }
          },
          { 
            id: "log-journald", 
            type: "subcategory", 
            name: "System Logging", 
            status: "subcategory", 
            level: 2, 
            parent: "logging",
            details: {
              description: "systemd journal configuration",
              maxRetentionSec: "7776000",
              maxFileSec: "2629746",
              compress: true,
              seal: false
            }
          },
          { 
            id: "log-auditd", 
            type: "subcategory", 
            name: "Audit Daemon", 
            status: "subcategory", 
            level: 2, 
            parent: "logging",
            details: {
              description: "Linux audit framework configuration",
              auditRules: 42,
              maxLogFile: "100MB",
              numLogs: 5,
              diskFullAction: "suspend"
            }
          },
          
          // NEW MAJOR MISSING SUBCATEGORIES FROM CSV
          
          // Package Management subcategories (critical security gaps)
          { 
            id: "pkg-bootloader", 
            type: "subcategory", 
            name: "Bootloader Configuration", 
            status: "subcategory", 
            level: 2, 
            parent: "services",
            details: {
              description: "Bootloader security and password protection",
              bootloaderType: "GRUB2",
              passwordProtected: false,
              configPermissions: "644",
              secureBootEnabled: false
            }
          },
          { 
            id: "pkg-hardening", 
            type: "subcategory", 
            name: "Process Hardening", 
            status: "subcategory", 
            level: 2, 
            parent: "services",
            details: {
              description: "System process hardening configurations",
              aslrEnabled: true,
              ptraceRestricted: false,
              coreDumpsRestricted: false,
              prelinkInstalled: true
            }
          },
          { 
            id: "pkg-banners", 
            type: "subcategory", 
            name: "Login Warning Banners", 
            status: "subcategory", 
            level: 2, 
            parent: "access-control",
            details: {
              description: "Login warning banner configurations",
              localBannerConfigured: false,
              remoteBannerConfigured: false,
              motdConfigured: false,
              issuePermissions: "644"
            }
          },
          
          // Network subcategories (major security gaps)
          { 
            id: "net-kernel", 
            type: "subcategory", 
            name: "Network Kernel Modules", 
            status: "subcategory", 
            level: 2, 
            parent: "network",
            details: {
              description: "Network-related kernel module security",
              dccpModuleDisabled: false,
              tipcModuleDisabled: false,
              rdsModuleDisabled: false,
              sctpModuleDisabled: false
            }
          },
          { 
            id: "net-parameters", 
            type: "subcategory", 
            name: "Network Kernel Parameters", 
            status: "subcategory", 
            level: 2, 
            parent: "network",
            details: {
              description: "Network kernel parameter configurations",
              ipForwardingDisabled: false,
              redirectsSendingDisabled: false,
              broadcastPingIgnored: false,
              synCookiesEnabled: false
            }
          },
          { 
            id: "net-wireless", 
            type: "subcategory", 
            name: "Wireless & Bluetooth", 
            status: "subcategory", 
            level: 2, 
            parent: "network",
            details: {
              description: "Wireless and Bluetooth security settings",
              wirelessDisabled: false,
              bluetoothDisabled: false,
              ipv6Status: "enabled",
              wirelessInterfaces: 1
            }
          },
          
          // Service Management subcategories (critical issues)
          { 
            id: "svc-dangerous", 
            type: "subcategory", 
            name: "Dangerous Server Services", 
            status: "subcategory", 
            level: 2, 
            parent: "services",
            details: {
              description: "Potentially dangerous services that should be disabled",
              autofsActive: true,
              avahiActive: true,
              dhcpServerActive: false,
              ftpServerActive: true,
              smbServerActive: true
            }
          },
          { 
            id: "svc-client", 
            type: "subcategory", 
            name: "Insecure Client Services", 
            status: "subcategory", 
            level: 2, 
            parent: "services",
            details: {
              description: "Insecure client services and protocols",
              nisClientInstalled: true,
              rshClientInstalled: true,
              talkClientInstalled: false,
              telnetClientInstalled: true,
              ftpClientInstalled: true
            }
          },
          { 
            id: "svc-jobs", 
            type: "subcategory", 
            name: "Job Schedulers", 
            status: "subcategory", 
            level: 2, 
            parent: "services",
            details: {
              description: "Cron and job scheduler security",
              cronDaemonEnabled: true,
              crontabPermissions: "644",
              cronDirectoryPermissions: "755",
              cronRestrictedUsers: false
            }
          },
          
          // Access Control subcategories (PAM and User Management)
          { 
            id: "ac-pam", 
            type: "subcategory", 
            name: "PAM Configuration", 
            status: "subcategory", 
            level: 2, 
            parent: "access-control",
            details: {
              description: "Pluggable Authentication Modules configuration",
              pamUnixEnabled: true,
              pamFaillockEnabled: false,
              pamPwqualityEnabled: false,
              pamPwhistoryEnabled: false
            }
          },
          { 
            id: "ac-passwords", 
            type: "subcategory", 
            name: "Password Management", 
            status: "subcategory", 
            level: 2, 
            parent: "access-control",
            details: {
              description: "System password policy and management",
              passwordExpiration: "90 days",
              minPasswordDays: "1",
              passwordWarning: "7 days",
              passwordHistory: "5",
              lockoutEnabled: false
            }
          },
          { 
            id: "ac-users", 
            type: "subcategory", 
            name: "User Account Management", 
            status: "subcategory", 
            level: 2, 
            parent: "access-control",
            details: {
              description: "User account security and management",
              rootOnlyUID0: true,
              systemAccountsLocked: false,
              shellTimeoutConfigured: false,
              defaultUmaskConfigured: false,
              nologinInShells: true
            }
          },
          
          // Individual Features with comprehensive mock data from CSV
          // Filesystem Kernel Modules (F-LNX-101 to F-LNX-110)
          { 
            id: "F-LNX-101", 
            type: "feature", 
            name: "cramfs module disabled", 
            status: "compliant", 
            level: 3, 
            parent: "fs-kernel", 
            description: "Ensure cramfs kernel module is not available", 
            annexure: "1.a.i",
            details: {
              checkType: "Kernel Module",
              expectedValue: "disabled",
              actualValue: "disabled",
              riskLevel: "Medium",
              remediation: "Module properly disabled via modprobe blacklist",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-102", 
            type: "feature", 
            name: "freevxfs module disabled", 
            status: "warning", 
            level: 3, 
            parent: "fs-kernel", 
            description: "Ensure freevxfs kernel module is not available", 
            annexure: "1.a.ii",
            details: {
              checkType: "Kernel Module",
              expectedValue: "disabled",
              actualValue: "loaded",
              riskLevel: "Medium",
              remediation: "Add freevxfs to blacklist in /etc/modprobe.d/blacklist.conf",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-103", 
            type: "feature", 
            name: "hfs module disabled", 
            status: "critical", 
            level: 3, 
            parent: "fs-kernel", 
            description: "Ensure hfs kernel module is not available", 
            annexure: "1.a.iii",
            details: {
              checkType: "Kernel Module",
              expectedValue: "disabled",
              actualValue: "loaded and accessible",
              riskLevel: "High",
              remediation: "URGENT: Disable hfs module - potential security exposure",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-104", 
            type: "feature", 
            name: "hfsplus module disabled", 
            status: "compliant", 
            level: 3, 
            parent: "fs-kernel", 
            description: "Ensure hfsplus kernel module is not available", 
            annexure: "1.a.iv",
            details: {
              checkType: "Kernel Module",
              expectedValue: "disabled",
              actualValue: "disabled",
              riskLevel: "Medium",
              remediation: "Module properly blacklisted",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-105", 
            type: "feature", 
            name: "jffs2 module disabled", 
            status: "compliant", 
            level: 3, 
            parent: "fs-kernel", 
            description: "Ensure jffs2 kernel module is not available", 
            annexure: "1.a.v",
            details: {
              checkType: "Kernel Module",
              expectedValue: "disabled",
              actualValue: "disabled",
              riskLevel: "Medium",
              remediation: "Module blacklisted in /etc/modprobe.d/blacklist.conf",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-106", 
            type: "feature", 
            name: "overlayfs module disabled", 
            status: "warning", 
            level: 3, 
            parent: "fs-kernel", 
            description: "Ensure overlayfs kernel module is not available", 
            annexure: "1.a.vi",
            details: {
              checkType: "Kernel Module",
              expectedValue: "disabled",
              actualValue: "enabled for docker",
              riskLevel: "Medium",
              remediation: "Review if overlayfs is needed for container operations",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-107", 
            type: "feature", 
            name: "squashfs module disabled", 
            status: "compliant", 
            level: 3, 
            parent: "fs-kernel", 
            description: "Ensure squashfs kernel module is not available", 
            annexure: "1.a.vii",
            details: {
              checkType: "Kernel Module",
              expectedValue: "disabled",
              actualValue: "disabled",
              riskLevel: "Low",
              remediation: "Module properly disabled",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: true
            }
          },
          { 
            id: "F-LNX-108", 
            type: "feature", 
            name: "udf module disabled", 
            status: "critical", 
            level: 3, 
            parent: "fs-kernel", 
            description: "Ensure udf kernel module is not available", 
            annexure: "1.a.viii",
            details: {
              checkType: "Kernel Module",
              expectedValue: "disabled",
              actualValue: "loaded",
              riskLevel: "High",
              remediation: "URGENT: UDF module poses security risk for web server",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-109", 
            type: "feature", 
            name: "usb-storage module disabled", 
            status: "warning", 
            level: 3, 
            parent: "fs-kernel", 
            description: "Ensure usb-storage kernel module is not available", 
            annexure: "1.a.ix",
            details: {
              checkType: "Kernel Module",
              expectedValue: "disabled",
              actualValue: "available",
              riskLevel: "Medium",
              remediation: "Disable USB storage to prevent data exfiltration",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          
          // Partition Configuration (F-LNX-111 to F-LNX-136)
          { 
            id: "F-LNX-111", 
            type: "feature", 
            name: "/tmp separate partition", 
            status: "warning", 
            level: 3, 
            parent: "fs-partitions", 
            description: "Ensure /tmp is a separate partition", 
            annexure: "1.b.i",
            details: {
              checkType: "Partition Configuration",
              expectedValue: "separate partition",
              actualValue: "shared with root",
              riskLevel: "High",
              remediation: "Create dedicated /tmp partition during next maintenance window",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-112", 
            type: "feature", 
            name: "/tmp nodev option", 
            status: "critical", 
            level: 3, 
            parent: "fs-partitions", 
            description: "Ensure nodev option set on /tmp partition", 
            annexure: "1.b.ii",
            details: {
              checkType: "Mount Options",
              expectedValue: "nodev",
              actualValue: "missing",
              riskLevel: "High",
              remediation: "URGENT: Add nodev option to /tmp mount to prevent device file attacks",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-113", 
            type: "feature", 
            name: "/tmp nosuid option", 
            status: "critical", 
            level: 3, 
            parent: "fs-partitions", 
            description: "Ensure nosuid option set on /tmp partition", 
            annexure: "1.b.iii",
            details: {
              checkType: "Mount Options",
              expectedValue: "nosuid",
              actualValue: "missing",
              riskLevel: "High",
              remediation: "URGENT: Add nosuid to prevent setuid privilege escalation from /tmp",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-114", 
            type: "feature", 
            name: "/tmp noexec option", 
            status: "warning", 
            level: 3, 
            parent: "fs-partitions", 
            description: "Ensure noexec option set on /tmp partition", 
            annexure: "1.b.iv",
            details: {
              checkType: "Mount Options",
              expectedValue: "noexec",
              actualValue: "missing",
              riskLevel: "Medium",
              remediation: "Add noexec option to prevent execution from /tmp",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-115", 
            type: "feature", 
            name: "/dev/shm separate partition", 
            status: "critical", 
            level: 3, 
            parent: "fs-partitions", 
            description: "Ensure /dev/shm is a separate partition", 
            annexure: "1.c.i",
            details: {
              checkType: "Partition Configuration",
              expectedValue: "separate partition",
              actualValue: "tmpfs default",
              riskLevel: "High",
              remediation: "URGENT: Configure dedicated /dev/shm partition with security options",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-119", 
            type: "feature", 
            name: "/home separate partition", 
            status: "warning", 
            level: 3, 
            parent: "fs-partitions", 
            description: "Ensure separate partition exists for /home", 
            annexure: "1.d.i",
            details: {
              checkType: "Partition Configuration",
              expectedValue: "separate partition",
              actualValue: "shared with root",
              riskLevel: "Medium",
              remediation: "Plan to separate /home partition during disk expansion",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-122", 
            type: "feature", 
            name: "/var separate partition", 
            status: "critical", 
            level: 3, 
            parent: "fs-partitions", 
            description: "Ensure separate partition exists for /var", 
            annexure: "1.e.i",
            details: {
              checkType: "Partition Configuration",
              expectedValue: "separate partition",
              actualValue: "shared with root",
              riskLevel: "High",
              remediation: "URGENT: /var shared with root can cause system instability",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          
          // Server Services Features (Critical issues)
          { 
            id: "F-LNX-201", 
            type: "feature", 
            name: "xinetd service disabled", 
            status: "critical", 
            level: 3, 
            parent: "svc-server", 
            description: "Ensure xinetd is not installed or disabled", 
            annexure: "2.a.i",
            details: {
              checkType: "Service Status",
              expectedValue: "disabled/not installed",
              actualValue: "running",
              riskLevel: "Critical",
              remediation: "URGENT: xinetd service exposes multiple attack vectors",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-202", 
            type: "feature", 
            name: "openbsd-inetd disabled", 
            status: "warning", 
            level: 3, 
            parent: "svc-server", 
            description: "Ensure openbsd-inetd is not installed", 
            annexure: "2.a.ii",
            details: {
              checkType: "Service Status",
              expectedValue: "not installed",
              actualValue: "installed but disabled",
              riskLevel: "Medium",
              remediation: "Remove openbsd-inetd package completely",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-203", 
            type: "feature", 
            name: "rsync service disabled", 
            status: "critical", 
            level: 3, 
            parent: "svc-server", 
            description: "Ensure rsync service is either not installed or masked", 
            annexure: "2.a.iii",
            details: {
              checkType: "Service Status",
              expectedValue: "masked",
              actualValue: "active",
              riskLevel: "High",
              remediation: "URGENT: Disable rsync service - potential data exfiltration risk",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          
          // Time Services Features
          { 
            id: "F-LNX-301", 
            type: "feature", 
            name: "chrony configured", 
            status: "warning", 
            level: 3, 
            parent: "svc-time", 
            description: "Ensure chrony is configured with authorized timeservers", 
            annexure: "2.b.i",
            details: {
              checkType: "Service Configuration",
              expectedValue: "configured with authorized servers",
              actualValue: "using public pool servers",
              riskLevel: "Medium",
              remediation: "Configure enterprise NTP servers instead of public pool",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-302", 
            type: "feature", 
            name: "systemd-timesyncd configured", 
            status: "critical", 
            level: 3, 
            parent: "svc-time", 
            description: "Ensure systemd-timesyncd configured with authorized timeservers", 
            annexure: "2.b.ii",
            details: {
              checkType: "Service Configuration",
              expectedValue: "enterprise time servers",
              actualValue: "no time servers configured",
              riskLevel: "High",
              remediation: "URGENT: No time synchronization configured - logging integrity at risk",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          
          // Network Security Features (More critical issues)
          { 
            id: "F-LNX-401", 
            type: "feature", 
            name: "packet redirect sending disabled", 
            status: "critical", 
            level: 3, 
            parent: "net-devices", 
            description: "Ensure packet redirect sending is disabled", 
            annexure: "3.a.i",
            details: {
              checkType: "Kernel Parameter",
              expectedValue: "0",
              actualValue: "1",
              riskLevel: "High",
              remediation: "URGENT: Set net.ipv4.conf.all.send_redirects=0 in sysctl",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-402", 
            type: "feature", 
            name: "IP forwarding disabled", 
            status: "critical", 
            level: 3, 
            parent: "net-devices", 
            description: "Ensure IP forwarding is disabled", 
            annexure: "3.a.ii",
            details: {
              checkType: "Kernel Parameter",
              expectedValue: "0",
              actualValue: "1",
              riskLevel: "Critical",
              remediation: "URGENT: IP forwarding enabled - server acting as router",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-501", 
            type: "feature", 
            name: "UFW firewall installed", 
            status: "critical", 
            level: 3, 
            parent: "net-firewall", 
            description: "Ensure ufw is installed", 
            annexure: "5.a.i",
            details: {
              checkType: "Package Installation",
              expectedValue: "installed and active",
              actualValue: "not installed",
              riskLevel: "Critical",
              remediation: "URGENT: No host firewall detected - immediate security risk",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-502", 
            type: "feature", 
            name: "UFW service enabled", 
            status: "critical", 
            level: 3, 
            parent: "net-firewall", 
            description: "Ensure ufw service is enabled", 
            annexure: "5.a.ii",
            details: {
              checkType: "Service Status",
              expectedValue: "enabled and active",
              actualValue: "inactive",
              riskLevel: "Critical",
              remediation: "URGENT: Enable UFW firewall immediately",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          
          // SSH Configuration Features (Multiple non-compliant items)
          { 
            id: "F-LNX-601", 
            type: "feature", 
            name: "SSH access limited", 
            status: "critical", 
            level: 3, 
            parent: "ac-ssh", 
            description: "Ensure permissions on /etc/ssh/sshd_config are configured", 
            annexure: "4.a.i",
            details: {
              checkType: "File Permissions",
              expectedValue: "600 root:root",
              actualValue: "644 root:root",
              riskLevel: "High",
              remediation: "URGENT: SSH config readable by all users",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-602", 
            type: "feature", 
            name: "SSH Protocol 2", 
            status: "compliant", 
            level: 3, 
            parent: "ac-ssh", 
            description: "Ensure SSH Protocol is set to 2", 
            annexure: "4.a.ii",
            details: {
              checkType: "Configuration Value",
              expectedValue: "2",
              actualValue: "2",
              riskLevel: "Low",
              remediation: "SSH Protocol 2 correctly configured",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: true
            }
          },
          { 
            id: "F-LNX-603", 
            type: "feature", 
            name: "SSH LogLevel set", 
            status: "warning", 
            level: 3, 
            parent: "ac-ssh", 
            description: "Ensure SSH LogLevel is appropriate", 
            annexure: "4.a.iii",
            details: {
              checkType: "Configuration Value",
              expectedValue: "VERBOSE or INFO",
              actualValue: "ERROR",
              riskLevel: "Medium",
              remediation: "Increase SSH logging level for better audit trail",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-604", 
            type: "feature", 
            name: "SSH X11Forwarding disabled", 
            status: "critical", 
            level: 3, 
            parent: "ac-ssh", 
            description: "Ensure SSH X11 forwarding is disabled", 
            annexure: "4.a.iv",
            details: {
              checkType: "Configuration Value",
              expectedValue: "no",
              actualValue: "yes",
              riskLevel: "High",
              remediation: "URGENT: Disable X11 forwarding - security vulnerability",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-605", 
            type: "feature", 
            name: "SSH MaxAuthTries set", 
            status: "warning", 
            level: 3, 
            parent: "ac-ssh", 
            description: "Ensure SSH MaxAuthTries is set to 4 or less", 
            annexure: "4.a.v",
            details: {
              checkType: "Configuration Value",
              expectedValue: "4 or less",
              actualValue: "6",
              riskLevel: "Medium",
              remediation: "Reduce MaxAuthTries to prevent brute force attacks",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-606", 
            type: "feature", 
            name: "SSH IgnoreRhosts enabled", 
            status: "compliant", 
            level: 3, 
            parent: "ac-ssh", 
            description: "Ensure SSH IgnoreRhosts is enabled", 
            annexure: "4.a.vi",
            details: {
              checkType: "Configuration Value",
              expectedValue: "yes",
              actualValue: "yes",
              riskLevel: "Low",
              remediation: "IgnoreRhosts correctly configured",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: true
            }
          },
          { 
            id: "F-LNX-607", 
            type: "feature", 
            name: "SSH HostbasedAuthentication disabled", 
            status: "critical", 
            level: 3, 
            parent: "ac-ssh", 
            description: "Ensure SSH HostbasedAuthentication is disabled", 
            annexure: "4.a.vii",
            details: {
              checkType: "Configuration Value",
              expectedValue: "no",
              actualValue: "yes",
              riskLevel: "High",
              remediation: "URGENT: Disable host-based authentication",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-608", 
            type: "feature", 
            name: "SSH root login disabled", 
            status: "critical", 
            level: 3, 
            parent: "ac-ssh", 
            description: "Ensure SSH root login is disabled", 
            annexure: "4.a.viii",
            details: {
              checkType: "Configuration Value",
              expectedValue: "no",
              actualValue: "yes",
              riskLevel: "Critical",
              remediation: "URGENT: Root SSH access enabled - major security risk",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-609", 
            type: "feature", 
            name: "SSH PermitEmptyPasswords disabled", 
            status: "critical", 
            level: 3, 
            parent: "ac-ssh", 
            description: "Ensure SSH PermitEmptyPasswords is disabled", 
            annexure: "4.a.ix",
            details: {
              checkType: "Configuration Value",
              expectedValue: "no",
              actualValue: "yes",
              riskLevel: "Critical",
              remediation: "URGENT: Empty passwords allowed - immediate security threat",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          
          // Privilege Escalation Features
          { 
            id: "F-LNX-701", 
            type: "feature", 
            name: "sudo command use logged", 
            status: "warning", 
            level: 3, 
            parent: "ac-sudo", 
            description: "Ensure sudo command use is logged", 
            annexure: "4.b.i",
            details: {
              checkType: "Logging Configuration",
              expectedValue: "logged to syslog",
              actualValue: "not configured",
              riskLevel: "Medium",
              remediation: "Configure sudo logging in /etc/sudoers",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-702", 
            type: "feature", 
            name: "sudo log file configured", 
            status: "critical", 
            level: 3, 
            parent: "ac-sudo", 
            description: "Ensure sudo log file exists", 
            annexure: "4.b.ii",
            details: {
              checkType: "Log File Configuration",
              expectedValue: "dedicated log file",
              actualValue: "no log file",
              riskLevel: "High",
              remediation: "URGENT: No audit trail for privilege escalation activities",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          
          // System Logging Features (Multiple critical issues)
          { 
            id: "F-LNX-801", 
            type: "feature", 
            name: "journald service enabled", 
            status: "warning", 
            level: 3, 
            parent: "log-journald", 
            description: "Ensure journald service is enabled", 
            annexure: "5.b.i",
            details: {
              checkType: "Service Status",
              expectedValue: "enabled and active",
              actualValue: "active but not enabled",
              riskLevel: "Medium",
              remediation: "Enable journald service for persistent logging",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-802", 
            type: "feature", 
            name: "journald compress configured", 
            status: "compliant", 
            level: 3, 
            parent: "log-journald", 
            description: "Ensure journald is configured to compress large log files", 
            annexure: "5.b.ii",
            details: {
              checkType: "Configuration Value",
              expectedValue: "yes",
              actualValue: "yes",
              riskLevel: "Low",
              remediation: "Log compression properly configured",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: true
            }
          },
          { 
            id: "F-LNX-803", 
            type: "feature", 
            name: "journald persistent storage", 
            status: "critical", 
            level: 3, 
            parent: "log-journald", 
            description: "Ensure journald is configured to write logfiles to persistent disk", 
            annexure: "5.b.iii",
            details: {
              checkType: "Storage Configuration",
              expectedValue: "persistent",
              actualValue: "volatile",
              riskLevel: "High",
              remediation: "URGENT: Logs stored in memory only - lost on reboot",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          
          // Audit Daemon Features
          { 
            id: "F-LNX-901", 
            type: "feature", 
            name: "auditd service enabled", 
            status: "critical", 
            level: 3, 
            parent: "log-auditd", 
            description: "Ensure auditd is installed and enabled", 
            annexure: "5.c.i",
            details: {
              checkType: "Service Status",
              expectedValue: "installed and enabled",
              actualValue: "not installed",
              riskLevel: "Critical",
              remediation: "URGENT: No audit daemon - compliance violation",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-902", 
            type: "feature", 
            name: "audit log storage size configured", 
            status: "critical", 
            level: 3, 
            parent: "log-auditd", 
            description: "Ensure audit log storage size is configured", 
            annexure: "5.c.ii",
            details: {
              checkType: "Configuration Value",
              expectedValue: "appropriate size configured",
              actualValue: "default size insufficient",
              riskLevel: "High",
              remediation: "URGENT: Audit logs may be lost due to insufficient storage",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-903", 
            type: "feature", 
            name: "audit logs not deleted", 
            status: "warning", 
            level: 3, 
            parent: "log-auditd", 
            description: "Ensure audit logs are not automatically deleted", 
            annexure: "5.c.iii",
            details: {
              checkType: "Configuration Value",
              expectedValue: "keep_logs",
              actualValue: "rotate and delete",
              riskLevel: "Medium",
              remediation: "Configure audit log retention policy",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          
          // NEW CRITICAL NON-COMPLIANT FEATURES FROM CSV
          
          // Bootloader Configuration Features (F-LNX-201 to F-LNX-202) - CRITICAL
          { 
            id: "F-LNX-201", 
            type: "feature", 
            name: "bootloader password set", 
            status: "critical", 
            level: 3, 
            parent: "pkg-bootloader", 
            description: "Ensure bootloader password is set", 
            annexure: "2.a.i",
            details: {
              checkType: "Bootloader Configuration",
              expectedValue: "password protected",
              actualValue: "no password set",
              riskLevel: "Critical",
              remediation: "URGENT: Set GRUB2 password to prevent unauthorized boot parameter changes",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-202", 
            type: "feature", 
            name: "bootloader config access", 
            status: "critical", 
            level: 3, 
            parent: "pkg-bootloader", 
            description: "Ensure access to bootloader config is configured", 
            annexure: "2.a.ii",
            details: {
              checkType: "File Permissions",
              expectedValue: "600 root:root",
              actualValue: "644 root:root",
              riskLevel: "High",
              remediation: "URGENT: Secure bootloader config file permissions",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          
          // Process Hardening Features (F-LNX-203 to F-LNX-207) - CRITICAL SECURITY GAPS
          { 
            id: "F-LNX-203", 
            type: "feature", 
            name: "ASLR enabled", 
            status: "compliant", 
            level: 3, 
            parent: "pkg-hardening", 
            description: "Ensure address space layout randomization is enabled", 
            annexure: "2.b.i",
            details: {
              checkType: "Kernel Parameter",
              expectedValue: "2",
              actualValue: "2",
              riskLevel: "High",
              remediation: "ASLR properly enabled for exploit mitigation",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: true
            }
          },
          { 
            id: "F-LNX-204", 
            type: "feature", 
            name: "ptrace scope restricted", 
            status: "critical", 
            level: 3, 
            parent: "pkg-hardening", 
            description: "Ensure ptrace_scope is restricted", 
            annexure: "2.b.ii",
            details: {
              checkType: "Kernel Parameter",
              expectedValue: "1 or higher",
              actualValue: "0",
              riskLevel: "High",
              remediation: "URGENT: Set kernel.yama.ptrace_scope=1 to prevent process debugging attacks",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-205", 
            type: "feature", 
            name: "core dumps restricted", 
            status: "critical", 
            level: 3, 
            parent: "pkg-hardening", 
            description: "Ensure core dumps are restricted", 
            annexure: "2.b.iii",
            details: {
              checkType: "System Configuration",
              expectedValue: "core dumps disabled",
              actualValue: "core dumps enabled",
              riskLevel: "Medium",
              remediation: "URGENT: Disable core dumps to prevent memory content exposure",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-206", 
            type: "feature", 
            name: "prelink not installed", 
            status: "warning", 
            level: 3, 
            parent: "pkg-hardening", 
            description: "Ensure prelink is not installed", 
            annexure: "2.b.iv",
            details: {
              checkType: "Package Installation",
              expectedValue: "not installed",
              actualValue: "installed",
              riskLevel: "Medium",
              remediation: "Remove prelink package - conflicts with ASLR",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          
          // Login Banner Features (F-LNX-208 to F-LNX-212) - COMPLIANCE ISSUES
          { 
            id: "F-LNX-208", 
            type: "feature", 
            name: "local login banner configured", 
            status: "critical", 
            level: 3, 
            parent: "pkg-banners", 
            description: "Ensure local login warning banner is configured properly", 
            annexure: "2.c.i",
            details: {
              checkType: "File Configuration",
              expectedValue: "warning banner configured",
              actualValue: "no banner configured",
              riskLevel: "Low",
              remediation: "URGENT: Configure /etc/issue with legal warning banner",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-209", 
            type: "feature", 
            name: "remote login banner configured", 
            status: "critical", 
            level: 3, 
            parent: "pkg-banners", 
            description: "Ensure remote login warning banner is configured properly", 
            annexure: "2.c.ii",
            details: {
              checkType: "File Configuration",
              expectedValue: "warning banner configured",
              actualValue: "no banner configured",
              riskLevel: "Low",
              remediation: "URGENT: Configure /etc/issue.net with legal warning banner",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          
          // Network Kernel Module Features (F-LNX-404 to F-LNX-407) - CRITICAL EXPOSURE
          { 
            id: "F-LNX-404", 
            type: "feature", 
            name: "dccp module disabled", 
            status: "critical", 
            level: 3, 
            parent: "net-kernel", 
            description: "Ensure dccp kernel module is not available", 
            annexure: "4.b.i",
            details: {
              checkType: "Kernel Module",
              expectedValue: "disabled",
              actualValue: "loaded",
              riskLevel: "High",
              remediation: "URGENT: Disable DCCP module - known vulnerability vector",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-405", 
            type: "feature", 
            name: "tipc module disabled", 
            status: "critical", 
            level: 3, 
            parent: "net-kernel", 
            description: "Ensure tipc kernel module is not available", 
            annexure: "4.b.ii",
            details: {
              checkType: "Kernel Module",
              expectedValue: "disabled",
              actualValue: "loaded",
              riskLevel: "High",
              remediation: "URGENT: Disable TIPC module - unnecessary network protocol",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-406", 
            type: "feature", 
            name: "rds module disabled", 
            status: "warning", 
            level: 3, 
            parent: "net-kernel", 
            description: "Ensure rds kernel module is not available", 
            annexure: "4.b.iii",
            details: {
              checkType: "Kernel Module",
              expectedValue: "disabled",
              actualValue: "available",
              riskLevel: "Medium",
              remediation: "Disable RDS module - Oracle-specific protocol not needed",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-407", 
            type: "feature", 
            name: "sctp module disabled", 
            status: "critical", 
            level: 3, 
            parent: "net-kernel", 
            description: "Ensure sctp kernel module is not available", 
            annexure: "4.b.iv",
            details: {
              checkType: "Kernel Module",
              expectedValue: "disabled",
              actualValue: "loaded",
              riskLevel: "High",
              remediation: "URGENT: Disable SCTP module - potential attack vector",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          
          // Network Parameter Features (F-LNX-408 to F-LNX-418) - CRITICAL NETWORK SECURITY
          { 
            id: "F-LNX-411", 
            type: "feature", 
            name: "broadcast ICMP ignored", 
            status: "critical", 
            level: 3, 
            parent: "net-parameters", 
            description: "Ensure broadcast icmp requests are ignored", 
            annexure: "4.c.iv",
            details: {
              checkType: "Network Parameter",
              expectedValue: "1",
              actualValue: "0",
              riskLevel: "Medium",
              remediation: "URGENT: Set net.ipv4.icmp_echo_ignore_broadcasts=1",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-412", 
            type: "feature", 
            name: "ICMP redirects not accepted", 
            status: "critical", 
            level: 3, 
            parent: "net-parameters", 
            description: "Ensure icmp redirects are not accepted", 
            annexure: "4.c.v",
            details: {
              checkType: "Network Parameter",
              expectedValue: "0",
              actualValue: "1",
              riskLevel: "Medium",
              remediation: "URGENT: Set net.ipv4.conf.all.accept_redirects=0",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-417", 
            type: "feature", 
            name: "TCP SYN cookies enabled", 
            status: "warning", 
            level: 3, 
            parent: "net-parameters", 
            description: "Ensure tcp syn cookies is enabled", 
            annexure: "4.c.xv",
            details: {
              checkType: "Network Parameter",
              expectedValue: "1",
              actualValue: "0",
              riskLevel: "Medium",
              remediation: "Enable TCP SYN cookies for DoS protection",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          
          // Wireless & Bluetooth Features (F-LNX-402 to F-LNX-403) - ATTACK SURFACE
          { 
            id: "F-LNX-402", 
            type: "feature", 
            name: "wireless interfaces disabled", 
            status: "critical", 
            level: 3, 
            parent: "net-wireless", 
            description: "Ensure wireless interfaces are disabled", 
            annexure: "4.a.ii",
            details: {
              checkType: "Network Interface",
              expectedValue: "disabled",
              actualValue: "wlan0 active",
              riskLevel: "High",
              remediation: "URGENT: Disable wireless interfaces on server - attack surface",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-403", 
            type: "feature", 
            name: "bluetooth services disabled", 
            status: "warning", 
            level: 3, 
            parent: "net-wireless", 
            description: "Ensure bluetooth services are not in use", 
            annexure: "4.a.iii",
            details: {
              checkType: "Service Status",
              expectedValue: "disabled",
              actualValue: "bluetooth.service active",
              riskLevel: "Medium",
              remediation: "Disable bluetooth service on server system",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          
          // Dangerous Services Features (F-LNX-301 to F-LNX-322) - CRITICAL EXPOSURE
          { 
            id: "F-LNX-301", 
            type: "feature", 
            name: "autofs service disabled", 
            status: "warning", 
            level: 3, 
            parent: "svc-dangerous", 
            description: "Ensure autofs services are not in use", 
            annexure: "3.a.i",
            details: {
              checkType: "Service Status",
              expectedValue: "disabled",
              actualValue: "active",
              riskLevel: "Medium",
              remediation: "Disable autofs service - automatic filesystem mounting risk",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-302", 
            type: "feature", 
            name: "avahi daemon disabled", 
            status: "critical", 
            level: 3, 
            parent: "svc-dangerous", 
            description: "Ensure avahi daemon services are not in use", 
            annexure: "3.a.ii",
            details: {
              checkType: "Service Status",
              expectedValue: "disabled",
              actualValue: "active",
              riskLevel: "Medium",
              remediation: "URGENT: Disable avahi daemon - service discovery exposure",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-306", 
            type: "feature", 
            name: "FTP server disabled", 
            status: "critical", 
            level: 3, 
            parent: "svc-dangerous", 
            description: "Ensure ftp server services are not in use", 
            annexure: "3.a.vi",
            details: {
              checkType: "Service Status",
              expectedValue: "disabled",
              actualValue: "vsftpd active",
              riskLevel: "High",
              remediation: "URGENT: Disable FTP server - unencrypted protocol",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-314", 
            type: "feature", 
            name: "Samba server disabled", 
            status: "critical", 
            level: 3, 
            parent: "svc-dangerous", 
            description: "Ensure samba file server services are not in use", 
            annexure: "3.a.xiv",
            details: {
              checkType: "Service Status",
              expectedValue: "disabled",
              actualValue: "smbd active",
              riskLevel: "High",
              remediation: "URGENT: Disable Samba - unnecessary file sharing service",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-315", 
            type: "feature", 
            name: "SNMP service disabled", 
            status: "warning", 
            level: 3, 
            parent: "svc-dangerous", 
            description: "Ensure snmp services are not in use", 
            annexure: "3.a.xv",
            details: {
              checkType: "Service Status",
              expectedValue: "disabled",
              actualValue: "snmpd active",
              riskLevel: "Medium",
              remediation: "Disable SNMP service if not required for monitoring",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          
          // Insecure Client Services (F-LNX-323 to F-LNX-328) - LEGACY PROTOCOLS
          { 
            id: "F-LNX-323", 
            type: "feature", 
            name: "NIS client not installed", 
            status: "warning", 
            level: 3, 
            parent: "svc-client", 
            description: "Ensure NIS Client is not installed", 
            annexure: "3.b.i",
            details: {
              checkType: "Package Installation",
              expectedValue: "not installed",
              actualValue: "nis package installed",
              riskLevel: "Medium",
              remediation: "Remove NIS client - insecure authentication protocol",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-324", 
            type: "feature", 
            name: "rsh client not installed", 
            status: "critical", 
            level: 3, 
            parent: "svc-client", 
            description: "Ensure rsh client is not installed", 
            annexure: "3.b.ii",
            details: {
              checkType: "Package Installation",
              expectedValue: "not installed",
              actualValue: "rsh-client installed",
              riskLevel: "High",
              remediation: "URGENT: Remove rsh client - unencrypted remote shell",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-326", 
            type: "feature", 
            name: "telnet client not installed", 
            status: "critical", 
            level: 3, 
            parent: "svc-client", 
            description: "Ensure telnet client is not installed", 
            annexure: "3.b.iv",
            details: {
              checkType: "Package Installation",
              expectedValue: "not installed",
              actualValue: "telnet installed",
              riskLevel: "High",
              remediation: "URGENT: Remove telnet client - unencrypted protocol",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-328", 
            type: "feature", 
            name: "FTP client not installed", 
            status: "warning", 
            level: 3, 
            parent: "svc-client", 
            description: "Ensure ftp client is not installed", 
            annexure: "3.b.vi",
            details: {
              checkType: "Package Installation",
              expectedValue: "not installed",
              actualValue: "ftp client installed",
              riskLevel: "Medium",
              remediation: "Remove FTP client - prefer secure alternatives like sftp",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          
          // Job Scheduler Features (F-LNX-336 to F-LNX-343) - PERMISSION ISSUES
          { 
            id: "F-LNX-337", 
            type: "feature", 
            name: "crontab permissions configured", 
            status: "critical", 
            level: 3, 
            parent: "svc-jobs", 
            description: "Ensure permissions on /etc/crontab are configured", 
            annexure: "3.f.ii",
            details: {
              checkType: "File Permissions",
              expectedValue: "600 root:root",
              actualValue: "644 root:root",
              riskLevel: "Medium",
              remediation: "URGENT: Set /etc/crontab permissions to 600",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-343", 
            type: "feature", 
            name: "crontab user restriction", 
            status: "warning", 
            level: 3, 
            parent: "svc-jobs", 
            description: "Ensure crontab is restricted to authorized users", 
            annexure: "3.f.viii",
            details: {
              checkType: "Access Control",
              expectedValue: "cron.allow configured",
              actualValue: "no cron.allow file",
              riskLevel: "Medium",
              remediation: "Create /etc/cron.allow to restrict cron access",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          
          // PAM Configuration Features (F-LNX-630 to F-LNX-649) - AUTHENTICATION SECURITY
          { 
            id: "F-LNX-632", 
            type: "feature", 
            name: "libpam-pwquality installed", 
            status: "critical", 
            level: 3, 
            parent: "ac-pam", 
            description: "Ensure libpam-pwquality is installed", 
            annexure: "6.c.i.3",
            details: {
              checkType: "Package Installation",
              expectedValue: "installed",
              actualValue: "not installed",
              riskLevel: "High",
              remediation: "URGENT: Install libpam-pwquality for password quality enforcement",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-634", 
            type: "feature", 
            name: "pam_faillock enabled", 
            status: "critical", 
            level: 3, 
            parent: "ac-pam", 
            description: "pam_faillock module is enabled", 
            annexure: "6.c.ii.2",
            details: {
              checkType: "PAM Configuration",
              expectedValue: "enabled",
              actualValue: "not configured",
              riskLevel: "High",
              remediation: "URGENT: Enable pam_faillock to prevent brute force attacks",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-635", 
            type: "feature", 
            name: "pam_pwquality enabled", 
            status: "critical", 
            level: 3, 
            parent: "ac-pam", 
            description: "Ensure pam_pwquality module is enabled", 
            annexure: "6.c.ii.3",
            details: {
              checkType: "PAM Configuration",
              expectedValue: "enabled",
              actualValue: "not configured",
              riskLevel: "High",
              remediation: "URGENT: Enable pam_pwquality for password complexity",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-637", 
            type: "feature", 
            name: "password lockout configured", 
            status: "critical", 
            level: 3, 
            parent: "ac-pam", 
            description: "Ensure password failed attempts lockout is configured", 
            annexure: "6.c.iii.1",
            details: {
              checkType: "PAM Configuration",
              expectedValue: "lockout after 5 failed attempts",
              actualValue: "no lockout configured",
              riskLevel: "High",
              remediation: "URGENT: Configure account lockout after failed login attempts",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          
          // Password Management Features (F-LNX-701 to F-LNX-717) - CRITICAL ACCOUNT SECURITY
          { 
            id: "F-LNX-701", 
            type: "feature", 
            name: "password expiration configured", 
            status: "warning", 
            level: 3, 
            parent: "ac-passwords", 
            description: "Ensure password expiration is configured", 
            annexure: "7.a.i",
            details: {
              checkType: "Password Policy",
              expectedValue: "90 days maximum",
              actualValue: "99999 days",
              riskLevel: "Medium",
              remediation: "Set PASS_MAX_DAYS to 90 in /etc/login.defs",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-705", 
            type: "feature", 
            name: "inactive password lock configured", 
            status: "critical", 
            level: 3, 
            parent: "ac-passwords", 
            description: "Ensure inactive password lock is configured", 
            annexure: "7.a.v",
            details: {
              checkType: "Account Policy",
              expectedValue: "30 days inactive lock",
              actualValue: "no inactive lock",
              riskLevel: "Medium",
              remediation: "URGENT: Configure account deactivation after inactivity",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          
          // User Account Management Features (F-LNX-713 to F-LNX-717) - ACCOUNT SECURITY
          { 
            id: "F-LNX-713", 
            type: "feature", 
            name: "system accounts locked", 
            status: "critical", 
            level: 3, 
            parent: "ac-users", 
            description: "Ensure system accounts do not have a valid login shell", 
            annexure: "7.a.xiii",
            details: {
              checkType: "Account Security",
              expectedValue: "system accounts locked",
              actualValue: "5 system accounts with valid shells",
              riskLevel: "Medium",
              remediation: "URGENT: Lock system service accounts",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-716", 
            type: "feature", 
            name: "shell timeout configured", 
            status: "warning", 
            level: 3, 
            parent: "ac-users", 
            description: "Ensure default user shell timeout is configured", 
            annexure: "7.b.ii",
            details: {
              checkType: "Environment Configuration",
              expectedValue: "TMOUT=600",
              actualValue: "no timeout configured",
              riskLevel: "Low",
              remediation: "Configure shell timeout in /etc/bash.bashrc",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-717", 
            type: "feature", 
            name: "default umask configured", 
            status: "warning", 
            level: 3, 
            parent: "ac-users", 
            description: "Ensure default user umask is configured", 
            annexure: "7.b.iii",
            details: {
              checkType: "Environment Configuration",
              expectedValue: "umask 027",
              actualValue: "umask 022",
              riskLevel: "Low",
              remediation: "Set more restrictive default umask in /etc/login.defs",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-112", 
            type: "feature", 
            name: "nodev option on /tmp", 
            status: "critical", 
            level: 3, 
            parent: "fs-partitions", 
            description: "Ensure nodev option set on /tmp partition", 
            annexure: "1.b.ii",
            details: {
              checkType: "Mount Options",
              expectedValue: "nodev",
              actualValue: "dev allowed",
              riskLevel: "High",
              remediation: "URGENT: Add nodev to /tmp mount options",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-113", 
            type: "feature", 
            name: "nosuid option on /tmp", 
            status: "warning", 
            level: 3, 
            parent: "fs-partitions", 
            description: "Ensure nosuid option set on /tmp partition", 
            annexure: "1.b.iii",
            details: {
              checkType: "Mount Options",
              expectedValue: "nosuid",
              actualValue: "suid allowed",
              riskLevel: "Medium",
              remediation: "Add nosuid to /tmp mount options",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-119", 
            type: "feature", 
            name: "/home separate partition", 
            status: "critical", 
            level: 3, 
            parent: "fs-partitions", 
            description: "Ensure separate partition exists for /home", 
            annexure: "1.d.i",
            details: {
              checkType: "Partition Configuration",
              expectedValue: "separate partition",
              actualValue: "shared with root",
              riskLevel: "Critical",
              remediation: "URGENT: Create dedicated /home partition to prevent disk space attacks",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-122", 
            type: "feature", 
            name: "/var separate partition", 
            status: "warning", 
            level: 3, 
            parent: "fs-partitions", 
            description: "Ensure separate partition exists for /var", 
            annexure: "1.e.i",
            details: {
              checkType: "Partition Configuration",
              expectedValue: "separate partition",
              actualValue: "shared with root",
              riskLevel: "Medium",
              remediation: "Consider separate /var partition for log isolation",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          
          // Services (F-LNX-301 to F-LNX-343)
          { 
            id: "F-LNX-301", 
            type: "feature", 
            name: "autofs service disabled", 
            status: "compliant", 
            level: 3, 
            parent: "svc-server", 
            description: "Ensure autofs services are not in use", 
            annexure: "3.a.i",
            details: {
              checkType: "Service Status",
              expectedValue: "disabled/stopped",
              actualValue: "disabled",
              riskLevel: "Low",
              remediation: "Service properly disabled via systemctl",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: true
            }
          },
          { 
            id: "F-LNX-302", 
            type: "feature", 
            name: "avahi daemon disabled", 
            status: "warning", 
            level: 3, 
            parent: "svc-server", 
            description: "Ensure avahi daemon services are not in use", 
            annexure: "3.a.ii",
            details: {
              checkType: "Service Status",
              expectedValue: "disabled/stopped",
              actualValue: "running",
              riskLevel: "Medium",
              remediation: "Stop avahi-daemon service - unnecessary network exposure",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-304", 
            type: "feature", 
            name: "DNS server disabled", 
            status: "critical", 
            level: 3, 
            parent: "svc-server", 
            description: "Ensure dns server services are not in use", 
            annexure: "3.a.iv",
            details: {
              checkType: "Service Status",
              expectedValue: "disabled/stopped",
              actualValue: "running on port 53",
              riskLevel: "Critical",
              remediation: "URGENT: Stop bind9 service - unnecessary exposure",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-318", 
            type: "feature", 
            name: "web server services controlled", 
            status: "warning", 
            level: 3, 
            parent: "svc-server", 
            description: "Ensure web server services are not in use", 
            annexure: "3.a.xviii",
            details: {
              checkType: "Service Status",
              expectedValue: "controlled/minimal",
              actualValue: "multiple web services running",
              riskLevel: "Medium",
              remediation: "Review and minimize web server exposure",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-329", 
            type: "feature", 
            name: "NTP synchronization enabled", 
            status: "compliant", 
            level: 3, 
            parent: "svc-time", 
            description: "Ensure time synchronization is in use", 
            annexure: "3.c.i",
            details: {
              checkType: "Time Sync",
              expectedValue: "synchronized",
              actualValue: "synchronized",
              riskLevel: "Medium",
              remediation: "NTP properly configured with pool servers",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: true
            }
          },
          
          // Network Security (F-LNX-408 to F-LNX-418)
          { 
            id: "F-LNX-408", 
            type: "feature", 
            name: "IP forwarding disabled", 
            status: "compliant", 
            level: 3, 
            parent: "net-devices", 
            description: "Ensure ip forwarding is disabled", 
            annexure: "4.c.i",
            details: {
              checkType: "Network Configuration",
              expectedValue: "0",
              actualValue: "0",
              riskLevel: "High",
              remediation: "IP forwarding properly disabled in /proc/sys/net/ipv4/ip_forward",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: true
            }
          },
          { 
            id: "F-LNX-410", 
            type: "feature", 
            name: "bogus ICMP responses ignored", 
            status: "warning", 
            level: 3, 
            parent: "net-devices", 
            description: "Ensure bogus icmp responses are ignored", 
            annexure: "4.c.iii",
            details: {
              checkType: "Network Configuration",
              expectedValue: "1",
              actualValue: "0",
              riskLevel: "Medium",
              remediation: "Set net.ipv4.icmp_ignore_bogus_error_responses=1",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          
          // Firewall Configuration (F-LNX-501 to F-LNX-508)
          { 
            id: "F-LNX-501", 
            type: "feature", 
            name: "UFW firewall installed", 
            status: "critical", 
            level: 3, 
            parent: "net-firewall", 
            description: "Ensure ufw is installed", 
            annexure: "5.a.i",
            details: {
              checkType: "Package Installation",
              expectedValue: "installed",
              actualValue: "not installed",
              riskLevel: "Critical",
              remediation: "URGENT: Install ufw package for host-based firewall protection",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-503", 
            type: "feature", 
            name: "UFW service enabled", 
            status: "critical", 
            level: 3, 
            parent: "net-firewall", 
            description: "Ensure ufw service is enabled", 
            annexure: "5.a.iii",
            details: {
              checkType: "Service Status",
              expectedValue: "enabled",
              actualValue: "disabled",
              riskLevel: "Critical",
              remediation: "URGENT: Enable UFW service after installation",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-504", 
            type: "feature", 
            name: "UFW loopback configured", 
            status: "warning", 
            level: 3, 
            parent: "net-firewall", 
            description: "Ensure ufw loopback traffic is configured", 
            annexure: "5.a.iv",
            details: {
              checkType: "Firewall Rules",
              expectedValue: "loopback allowed",
              actualValue: "not configured",
              riskLevel: "Medium",
              remediation: "Configure UFW loopback rules after installation",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          
          // SSH Configuration (F-LNX-620 and others)
          { 
            id: "F-LNX-620", 
            type: "feature", 
            name: "SSH root login disabled", 
            status: "compliant", 
            level: 3, 
            parent: "ac-ssh", 
            description: "Ensure sshd PermitRootLogin is disabled", 
            annexure: "6.a.xx",
            details: {
              checkType: "SSH Configuration",
              expectedValue: "no",
              actualValue: "no",
              riskLevel: "Critical",
              remediation: "Root login properly disabled in /etc/ssh/sshd_config",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: true
            }
          },
          { 
            id: "F-LNX-615", 
            type: "feature", 
            name: "SSH MACs configured", 
            status: "warning", 
            level: 3, 
            parent: "ac-ssh", 
            description: "Ensure sshd MACs are configured", 
            annexure: "6.a.xv",
            details: {
              checkType: "SSH Configuration",
              expectedValue: "strong MACs only",
              actualValue: "weak MACs allowed",
              riskLevel: "Medium",
              remediation: "Configure strong MAC algorithms in sshd_config",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-616", 
            type: "feature", 
            name: "SSH MaxAuthTries configured", 
            status: "critical", 
            level: 3, 
            parent: "ac-ssh", 
            description: "Ensure sshd MaxAuthTries is configured", 
            annexure: "6.a.xvi",
            details: {
              checkType: "SSH Configuration",
              expectedValue: "4 or less",
              actualValue: "6",
              riskLevel: "High",
              remediation: "URGENT: Set MaxAuthTries to 4 or less in sshd_config",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          
          // Sudo Configuration (F-LNX-623 to F-LNX-629)
          { 
            id: "F-LNX-623", 
            type: "feature", 
            name: "sudo package installed", 
            status: "compliant", 
            level: 3, 
            parent: "ac-sudo", 
            description: "Ensure sudo is installed", 
            annexure: "6.b.i",
            details: {
              checkType: "Package Installation",
              expectedValue: "installed",
              actualValue: "installed (v1.8.31)",
              riskLevel: "High",
              remediation: "Sudo package properly installed and configured",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: true
            }
          },
          { 
            id: "F-LNX-625", 
            type: "feature", 
            name: "sudo log file exists", 
            status: "warning", 
            level: 3, 
            parent: "ac-sudo", 
            description: "Ensure sudo log file exists", 
            annexure: "6.b.iii",
            details: {
              checkType: "Logging Configuration",
              expectedValue: "log file configured",
              actualValue: "no dedicated log file",
              riskLevel: "Medium",
              remediation: "Configure sudo logging with Defaults logfile",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-627", 
            type: "feature", 
            name: "sudo re-authentication", 
            status: "warning", 
            level: 3, 
            parent: "ac-sudo", 
            description: "Ensure re-authentication for privilege escalation is not disabled globally", 
            annexure: "6.b.v",
            details: {
              checkType: "Sudo Configuration",
              expectedValue: "timestamp_timeout enabled",
              actualValue: "timestamp_timeout = -1",
              riskLevel: "Medium",
              remediation: "Configure reasonable timestamp_timeout in /etc/sudoers",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          
          // Logging Features (F-LNX-801 to F-LNX-855)
          { 
            id: "F-LNX-801", 
            type: "feature", 
            name: "journald service active", 
            status: "compliant", 
            level: 3, 
            parent: "log-journald", 
            description: "Ensure journald service is enabled and active", 
            annexure: "8.a.i.1",
            details: {
              checkType: "Service Status",
              expectedValue: "active",
              actualValue: "active (running)",
              riskLevel: "Medium",
              remediation: "Journald service properly running and logging system events",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: true
            }
          },
          { 
            id: "F-LNX-803", 
            type: "feature", 
            name: "journald log rotation", 
            status: "warning", 
            level: 3, 
            parent: "log-journald", 
            description: "Ensure journald log file rotation is configured", 
            annexure: "8.a.i.3",
            details: {
              checkType: "Log Configuration",
              expectedValue: "rotation configured",
              actualValue: "default rotation only",
              riskLevel: "Low",
              remediation: "Configure SystemMaxUse and SystemMaxFileSize in journald.conf",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-814", 
            type: "feature", 
            name: "auditd package installed", 
            status: "compliant", 
            level: 3, 
            parent: "log-auditd", 
            description: "Ensure auditd packages are installed", 
            annexure: "8.b.i.1",
            details: {
              checkType: "Package Installation",
              expectedValue: "installed",
              actualValue: "installed (v2.8.5)",
              riskLevel: "High",
              remediation: "Auditd package properly installed for security auditing",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: true
            }
          },
          { 
            id: "F-LNX-820", 
            type: "feature", 
            name: "audit logs not deleted", 
            status: "critical", 
            level: 3, 
            parent: "log-auditd", 
            description: "Ensure audit logs are not automatically deleted", 
            annexure: "8.c.ii",
            details: {
              checkType: "Audit Configuration",
              expectedValue: "max_log_file_action = keep_logs",
              actualValue: "max_log_file_action = rotate",
              riskLevel: "High",
              remediation: "URGENT: Set max_log_file_action to keep_logs in auditd.conf",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-822", 
            type: "feature", 
            name: "sudo command auditing", 
            status: "warning", 
            level: 3, 
            parent: "log-auditd", 
            description: "Ensure changes to system administration scope (sudoers) is collected", 
            annexure: "8.d.i",
            details: {
              checkType: "Audit Rules",
              expectedValue: "sudoers changes logged",
              actualValue: "rule not configured",
              riskLevel: "Medium",
              remediation: "Add audit rule: -w /etc/sudoers -p wa -k sudoers_changes",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-LNX-825", 
            type: "feature", 
            name: "date/time modification audited", 
            status: "critical", 
            level: 3, 
            parent: "log-auditd", 
            description: "Ensure events that modify date and time information are collected", 
            annexure: "8.d.iv",
            details: {
              checkType: "Audit Rules",
              expectedValue: "time change events logged",
              actualValue: "no time change auditing",
              riskLevel: "High",
              remediation: "URGENT: Add time change audit rules for adjtimex, settimeofday, clock_settime",
              lastChecked: "2024-01-15 14:30:00",
              autoRemediation: false
            }
          }
        ],
        links: [
          { source: "mumbai-web-01", target: "filesystem", relationship: "contains" },
          { source: "mumbai-web-01", target: "services", relationship: "contains" },
          { source: "mumbai-web-01", target: "network", relationship: "contains" },
          { source: "mumbai-web-01", target: "access-control", relationship: "contains" },
          { source: "mumbai-web-01", target: "logging", relationship: "contains" },
          { source: "filesystem", target: "fs-kernel", relationship: "contains" },
          { source: "filesystem", target: "fs-partitions", relationship: "contains" },
          { source: "services", target: "svc-server", relationship: "contains" },
          { source: "services", target: "svc-time", relationship: "contains" },
          { source: "network", target: "net-devices", relationship: "contains" },
          { source: "network", target: "net-firewall", relationship: "contains" },
          { source: "access-control", target: "ac-ssh", relationship: "contains" },
          { source: "access-control", target: "ac-sudo", relationship: "contains" },
          { source: "logging", target: "log-journald", relationship: "contains" },
          { source: "logging", target: "log-auditd", relationship: "contains" },
          
          // NEW SUBCATEGORY RELATIONSHIPS
          { source: "services", target: "pkg-bootloader", relationship: "contains" },
          { source: "services", target: "pkg-hardening", relationship: "contains" },
          { source: "services", target: "svc-dangerous", relationship: "contains" },
          { source: "services", target: "svc-client", relationship: "contains" },
          { source: "services", target: "svc-jobs", relationship: "contains" },
          { source: "network", target: "net-kernel", relationship: "contains" },
          { source: "network", target: "net-parameters", relationship: "contains" },
          { source: "network", target: "net-wireless", relationship: "contains" },
          { source: "access-control", target: "pkg-banners", relationship: "contains" },
          { source: "access-control", target: "ac-pam", relationship: "contains" },
          { source: "access-control", target: "ac-passwords", relationship: "contains" },
          { source: "access-control", target: "ac-users", relationship: "contains" },
          
          // Filesystem Kernel Module features
          { source: "fs-kernel", target: "F-LNX-101", relationship: "contains" },
          { source: "fs-kernel", target: "F-LNX-102", relationship: "contains" },
          { source: "fs-kernel", target: "F-LNX-103", relationship: "contains" },
          { source: "fs-kernel", target: "F-LNX-104", relationship: "contains" },
          { source: "fs-kernel", target: "F-LNX-105", relationship: "contains" },
          { source: "fs-kernel", target: "F-LNX-106", relationship: "contains" },
          { source: "fs-kernel", target: "F-LNX-107", relationship: "contains" },
          { source: "fs-kernel", target: "F-LNX-108", relationship: "contains" },
          { source: "fs-kernel", target: "F-LNX-109", relationship: "contains" },
          
          // Partition Configuration features
          { source: "fs-partitions", target: "F-LNX-111", relationship: "contains" },
          { source: "fs-partitions", target: "F-LNX-112", relationship: "contains" },
          { source: "fs-partitions", target: "F-LNX-113", relationship: "contains" },
          { source: "fs-partitions", target: "F-LNX-119", relationship: "contains" },
          { source: "fs-partitions", target: "F-LNX-122", relationship: "contains" },
          
          // Server Services features
          { source: "svc-server", target: "F-LNX-301", relationship: "contains" },
          { source: "svc-server", target: "F-LNX-302", relationship: "contains" },
          { source: "svc-server", target: "F-LNX-304", relationship: "contains" },
          { source: "svc-server", target: "F-LNX-318", relationship: "contains" },
          
          // Time Services features
          { source: "svc-time", target: "F-LNX-329", relationship: "contains" },
          
          // Network Device features
          { source: "net-devices", target: "F-LNX-408", relationship: "contains" },
          { source: "net-devices", target: "F-LNX-410", relationship: "contains" },
          
          // Firewall features
          { source: "net-firewall", target: "F-LNX-501", relationship: "contains" },
          { source: "net-firewall", target: "F-LNX-503", relationship: "contains" },
          { source: "net-firewall", target: "F-LNX-504", relationship: "contains" },
          
          // SSH features
          { source: "ac-ssh", target: "F-LNX-620", relationship: "contains" },
          { source: "ac-ssh", target: "F-LNX-615", relationship: "contains" },
          { source: "ac-ssh", target: "F-LNX-616", relationship: "contains" },
          
          // Sudo features
          { source: "ac-sudo", target: "F-LNX-623", relationship: "contains" },
          { source: "ac-sudo", target: "F-LNX-625", relationship: "contains" },
          { source: "ac-sudo", target: "F-LNX-627", relationship: "contains" },
          
          // Journald features
          { source: "log-journald", target: "F-LNX-801", relationship: "contains" },
          { source: "log-journald", target: "F-LNX-803", relationship: "contains" },
          
          // Auditd features
          { source: "log-auditd", target: "F-LNX-814", relationship: "contains" },
          { source: "log-auditd", target: "F-LNX-820", relationship: "contains" },
          { source: "log-auditd", target: "F-LNX-822", relationship: "contains" },
          { source: "log-auditd", target: "F-LNX-825", relationship: "contains" },
          
          // NEW FEATURE LINKS - CRITICAL SECURITY GAPS
          
          // Bootloader Configuration Features
          { source: "pkg-bootloader", target: "F-LNX-201", relationship: "contains" },
          { source: "pkg-bootloader", target: "F-LNX-202", relationship: "contains" },
          
          // Process Hardening Features
          { source: "pkg-hardening", target: "F-LNX-203", relationship: "contains" },
          { source: "pkg-hardening", target: "F-LNX-204", relationship: "contains" },
          { source: "pkg-hardening", target: "F-LNX-205", relationship: "contains" },
          { source: "pkg-hardening", target: "F-LNX-206", relationship: "contains" },
          
          // Login Banner Features
          { source: "pkg-banners", target: "F-LNX-208", relationship: "contains" },
          { source: "pkg-banners", target: "F-LNX-209", relationship: "contains" },
          
          // Network Kernel Module Features
          { source: "net-kernel", target: "F-LNX-404", relationship: "contains" },
          { source: "net-kernel", target: "F-LNX-405", relationship: "contains" },
          { source: "net-kernel", target: "F-LNX-406", relationship: "contains" },
          { source: "net-kernel", target: "F-LNX-407", relationship: "contains" },
          
          // Network Parameter Features
          { source: "net-parameters", target: "F-LNX-411", relationship: "contains" },
          { source: "net-parameters", target: "F-LNX-412", relationship: "contains" },
          { source: "net-parameters", target: "F-LNX-417", relationship: "contains" },
          
          // Wireless & Bluetooth Features
          { source: "net-wireless", target: "F-LNX-402", relationship: "contains" },
          { source: "net-wireless", target: "F-LNX-403", relationship: "contains" },
          
          // Dangerous Services Features
          { source: "svc-dangerous", target: "F-LNX-301", relationship: "contains" },
          { source: "svc-dangerous", target: "F-LNX-302", relationship: "contains" },
          { source: "svc-dangerous", target: "F-LNX-306", relationship: "contains" },
          { source: "svc-dangerous", target: "F-LNX-314", relationship: "contains" },
          { source: "svc-dangerous", target: "F-LNX-315", relationship: "contains" },
          
          // Insecure Client Services Features
          { source: "svc-client", target: "F-LNX-323", relationship: "contains" },
          { source: "svc-client", target: "F-LNX-324", relationship: "contains" },
          { source: "svc-client", target: "F-LNX-326", relationship: "contains" },
          { source: "svc-client", target: "F-LNX-328", relationship: "contains" },
          
          // Job Scheduler Features
          { source: "svc-jobs", target: "F-LNX-337", relationship: "contains" },
          { source: "svc-jobs", target: "F-LNX-343", relationship: "contains" },
          
          // PAM Configuration Features
          { source: "ac-pam", target: "F-LNX-632", relationship: "contains" },
          { source: "ac-pam", target: "F-LNX-634", relationship: "contains" },
          { source: "ac-pam", target: "F-LNX-635", relationship: "contains" },
          { source: "ac-pam", target: "F-LNX-637", relationship: "contains" },
          
          // Password Management Features
          { source: "ac-passwords", target: "F-LNX-701", relationship: "contains" },
          { source: "ac-passwords", target: "F-LNX-705", relationship: "contains" },
          
          // User Account Management Features
          { source: "ac-users", target: "F-LNX-713", relationship: "contains" },
          { source: "ac-users", target: "F-LNX-716", relationship: "contains" },
          { source: "ac-users", target: "F-LNX-717", relationship: "contains" },
          
          // Dependencies
          { source: "F-LNX-501", target: "F-LNX-503", relationship: "prerequisite" },
          { source: "F-LNX-503", target: "F-LNX-504", relationship: "prerequisite" },
          { source: "F-LNX-623", target: "F-LNX-625", relationship: "related" },
          { source: "F-LNX-625", target: "F-LNX-627", relationship: "related" },
          { source: "F-LNX-814", target: "F-LNX-820", relationship: "prerequisite" },
          { source: "F-LNX-820", target: "F-LNX-822", relationship: "prerequisite" },
          { source: "F-LNX-822", target: "F-LNX-825", relationship: "related" }
        ]
      },
      
      // WINDOWS WORKSTATION SECURITY DATA - Mumbai WS-01
      "mumbai-ws-01": {
        name: "MUM-WS-01",
        ip: "192.168.1.101",
        role: "Finance Team Workstation",
        status: "warning",
        location: "Mumbai Office",
        desk: "Finance-Floor-2-Desk-15",
        serialNumber: "WS-FIN-2023-001",
        purchaseDate: "2023-05-20",
        warranty: "3 years",
        vendor: "Dell Technologies",
        model: "OptiPlex 7090",
        user: "john.smith@guardian.com",
        nodes: [
          { 
            id: "mumbai-ws-01", 
            type: "system", 
            name: "MUM-WS-01", 
            status: "system", 
            level: 0,
            details: {
              description: "Finance team workstation for accounting operations",
              criticality: "Medium",
              businessImpact: "Financial data processing",
              maintenanceWindow: "Weekends 8:00 PM - 6:00 AM IST"
            }
          },
          
          // Windows Security Categories
          { 
            id: "win-accounts", 
            type: "category", 
            name: "Account Policies", 
            status: "category", 
            level: 1,
            details: {
              description: "Windows account and password policies",
              totalChecks: 18,
              passedChecks: 8,
              failedChecks: 10,
              lastAudit: "2024-01-12"
            }
          },
          { 
            id: "win-local", 
            type: "category", 
            name: "Local Policies", 
            status: "category", 
            level: 1,
            details: {
              description: "Windows local security policies and user rights",
              totalChecks: 35,
              passedChecks: 12,
              failedChecks: 23,
              lastAudit: "2024-01-11"
            }
          },
          { 
            id: "win-security", 
            type: "category", 
            name: "Security Options", 
            status: "category", 
            level: 1,
            details: {
              description: "Windows security configuration options",
              totalChecks: 42,
              passedChecks: 18,
              failedChecks: 24,
              lastAudit: "2024-01-10"
            }
          },
          { 
            id: "win-system", 
            type: "category", 
            name: "System Settings", 
            status: "category", 
            level: 1,
            details: {
              description: "Windows system configuration and services",
              totalChecks: 28,
              passedChecks: 15,
              failedChecks: 13,
              lastAudit: "2024-01-09"
            }
          },
          
          // Account Policy Subcategories
          { 
            id: "win-pwd-policy", 
            type: "subcategory", 
            name: "Password Policy", 
            status: "subcategory", 
            level: 2, 
            parent: "win-accounts",
            details: {
              description: "Windows password complexity and aging policies",
              passwordLength: "8 characters",
              complexityRequired: false,
              maxAge: "never expires",
              historyCount: "0"
            }
          },
          { 
            id: "win-lockout", 
            type: "subcategory", 
            name: "Account Lockout Policy", 
            status: "subcategory", 
            level: 2, 
            parent: "win-accounts",
            details: {
              description: "Account lockout configuration",
              lockoutThreshold: "never",
              lockoutDuration: "not configured",
              resetCounter: "not configured",
              adminLockout: false
            }
          },
          
          // Local Policy Subcategories
          { 
            id: "win-user-rights", 
            type: "subcategory", 
            name: "User Rights Assignment", 
            status: "subcategory", 
            level: 2, 
            parent: "win-local",
            details: {
              description: "User rights and privileges assignment",
              localLogon: "Everyone",
              networkAccess: "Everyone",
              backupPrivilege: "Everyone",
              shutdownPrivilege: "Everyone"
            }
          },
          
          // Security Options Subcategories
          { 
            id: "win-accounts-sec", 
            type: "subcategory", 
            name: "Account Security", 
            status: "subcategory", 
            level: 2, 
            parent: "win-security",
            details: {
              description: "Account security configuration options",
              guestAccountEnabled: true,
              adminAccountRenamed: false,
              microsoftAccountsBlocked: false,
              blankPasswordsAllowed: true
            }
          },
          { 
            id: "win-interactive", 
            type: "subcategory", 
            name: "Interactive Logon", 
            status: "subcategory", 
            level: 2, 
            parent: "win-security",
            details: {
              description: "Interactive logon security settings",
              ctrlAltDelRequired: false,
              lastUserDisplayed: true,
              inactivityLimit: "never",
              loginBanner: false
            }
          },
          { 
            id: "win-network-sec", 
            type: "subcategory", 
            name: "Network Security", 
            status: "subcategory", 
            level: 2, 
            parent: "win-security",
            details: {
              description: "Network security configuration",
              lanManagerHash: true,
              ntlmSecurity: "weak",
              kerberosEncryption: "weak",
              anonymousAccess: true
            }
          },
          
          // System Settings Subcategories
          { 
            id: "win-uac", 
            type: "subcategory", 
            name: "User Account Control", 
            status: "subcategory", 
            level: 2, 
            parent: "win-system",
            details: {
              description: "UAC configuration settings",
              adminApprovalMode: false,
              elevationPrompt: "no prompting",
              secureDesktop: false,
              applicationDetection: false
            }
          },
          { 
            id: "win-services", 
            type: "subcategory", 
            name: "System Services", 
            status: "subcategory", 
            level: 2, 
            parent: "win-system",
            details: {
              description: "Windows system services configuration",
              bluetoothEnabled: true,
              telnetEnabled: true,
              remoteRegistryEnabled: true,
              unnecessaryServices: 12
            }
          },
          
          // CRITICAL WINDOWS SECURITY FEATURES - NON-COMPLIANT
          
          // Password Policy Features (F-WIN-101 to F-WIN-106)
          { 
            id: "F-WIN-101", 
            type: "feature", 
            name: "password history enforced", 
            status: "critical", 
            level: 3, 
            parent: "win-pwd-policy", 
            description: "Ensure 'Enforce password history' is set to '24 or more password(s)'", 
            annexure: "1.a.i",
            details: {
              checkType: "Password Policy",
              expectedValue: "24 or more passwords",
              actualValue: "0 passwords remembered",
              riskLevel: "High",
              remediation: "URGENT: Configure password history to prevent password reuse",
              lastChecked: "2024-01-15 09:15:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-WIN-102", 
            type: "feature", 
            name: "maximum password age", 
            status: "critical", 
            level: 3, 
            parent: "win-pwd-policy", 
            description: "Ensure 'Maximum password age' is set to '90 days, but not 0'", 
            annexure: "1.a.ii",
            details: {
              checkType: "Password Policy",
              expectedValue: "90 days",
              actualValue: "never expires",
              riskLevel: "Critical",
              remediation: "URGENT: Set password expiration to 90 days maximum",
              lastChecked: "2024-01-15 09:15:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-WIN-104", 
            type: "feature", 
            name: "minimum password length", 
            status: "critical", 
            level: 3, 
            parent: "win-pwd-policy", 
            description: "Ensure 'Minimum password length' is set to '12 or more character(s)'", 
            annexure: "1.a.iv",
            details: {
              checkType: "Password Policy",
              expectedValue: "12 or more characters",
              actualValue: "8 characters",
              riskLevel: "High",
              remediation: "URGENT: Increase minimum password length to 12 characters",
              lastChecked: "2024-01-15 09:15:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-WIN-105", 
            type: "feature", 
            name: "password complexity required", 
            status: "critical", 
            level: 3, 
            parent: "win-pwd-policy", 
            description: "Ensure 'Password must meet complexity requirements' is set to 'Enabled'", 
            annexure: "1.a.v",
            details: {
              checkType: "Password Policy",
              expectedValue: "Enabled",
              actualValue: "Disabled",
              riskLevel: "Critical",
              remediation: "URGENT: Enable password complexity requirements",
              lastChecked: "2024-01-15 09:15:00",
              autoRemediation: false
            }
          },
          
          // Account Lockout Features (F-WIN-107 to F-WIN-109)
          { 
            id: "F-WIN-107", 
            type: "feature", 
            name: "account lockout duration", 
            status: "critical", 
            level: 3, 
            parent: "win-lockout", 
            description: "Ensure 'Account lockout duration' is set to '15 or more minute(s)'", 
            annexure: "1.b.i",
            details: {
              checkType: "Account Lockout Policy",
              expectedValue: "15 or more minutes",
              actualValue: "not configured",
              riskLevel: "High",
              remediation: "URGENT: Configure account lockout duration to 15 minutes",
              lastChecked: "2024-01-15 09:15:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-WIN-108", 
            type: "feature", 
            name: "account lockout threshold", 
            status: "critical", 
            level: 3, 
            parent: "win-lockout", 
            description: "Ensure 'Account lockout threshold' is set to '5 or fewer invalid logon attempt(s), but not 0'", 
            annexure: "1.b.ii",
            details: {
              checkType: "Account Lockout Policy",
              expectedValue: "5 or fewer attempts",
              actualValue: "never locks out",
              riskLevel: "Critical",
              remediation: "URGENT: Set account lockout threshold to 5 attempts",
              lastChecked: "2024-01-15 09:15:00",
              autoRemediation: false
            }
          },
          
          // User Rights Assignment Features (F-WIN-201 to F-WIN-207)
          { 
            id: "F-WIN-202", 
            type: "feature", 
            name: "network access restricted", 
            status: "critical", 
            level: 3, 
            parent: "win-user-rights", 
            description: "Ensure 'Access this computer from the network' is set to 'Administrators, Remote Desktop Users'", 
            annexure: "2.a.ii",
            details: {
              checkType: "User Rights Assignment",
              expectedValue: "Administrators, Remote Desktop Users only",
              actualValue: "Everyone",
              riskLevel: "Critical",
              remediation: "URGENT: Restrict network access to authorized users only",
              lastChecked: "2024-01-15 09:15:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-WIN-204", 
            type: "feature", 
            name: "local logon restricted", 
            status: "warning", 
            level: 3, 
            parent: "win-user-rights", 
            description: "Ensure 'Allow log on locally' is set to 'Administrators, Users'", 
            annexure: "2.a.iv",
            details: {
              checkType: "User Rights Assignment",
              expectedValue: "Administrators, Users only",
              actualValue: "Everyone",
              riskLevel: "Medium",
              remediation: "Restrict local logon rights to authorized users",
              lastChecked: "2024-01-15 09:15:00",
              autoRemediation: false
            }
          },
          
          // Account Security Features (F-WIN-301 to F-WIN-305)
          { 
            id: "F-WIN-301", 
            type: "feature", 
            name: "Microsoft accounts blocked", 
            status: "warning", 
            level: 3, 
            parent: "win-accounts-sec", 
            description: "Ensure 'Accounts: Block Microsoft accounts' is set to 'Users can't add or log on with Microsoft accounts'", 
            annexure: "3.a.i",
            details: {
              checkType: "Account Security",
              expectedValue: "Block Microsoft accounts",
              actualValue: "Microsoft accounts allowed",
              riskLevel: "Medium",
              remediation: "Block Microsoft accounts for corporate security",
              lastChecked: "2024-01-15 09:15:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-WIN-302", 
            type: "feature", 
            name: "guest account disabled", 
            status: "critical", 
            level: 3, 
            parent: "win-accounts-sec", 
            description: "Ensure 'Accounts: Guest account status' is set to 'Disabled'", 
            annexure: "3.a.ii",
            details: {
              checkType: "Account Security",
              expectedValue: "Disabled",
              actualValue: "Enabled",
              riskLevel: "High",
              remediation: "URGENT: Disable guest account - major security risk",
              lastChecked: "2024-01-15 09:15:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-WIN-303", 
            type: "feature", 
            name: "blank passwords restricted", 
            status: "critical", 
            level: 3, 
            parent: "win-accounts-sec", 
            description: "Ensure 'Accounts: Limit local account use of blank passwords to console logon only' is set to 'Enabled'", 
            annexure: "3.a.iii",
            details: {
              checkType: "Account Security",
              expectedValue: "Enabled",
              actualValue: "Disabled",
              riskLevel: "Critical",
              remediation: "URGENT: Restrict blank password usage - security vulnerability",
              lastChecked: "2024-01-15 09:15:00",
              autoRemediation: false
            }
          },
          
          // Interactive Logon Features (F-WIN-306 to F-WIN-312)
          { 
            id: "F-WIN-306", 
            type: "feature", 
            name: "CTRL+ALT+DEL required", 
            status: "warning", 
            level: 3, 
            parent: "win-interactive", 
            description: "Ensure 'Interactive logon: Do not require CTRL+ALT+DEL' is set to 'Disabled'", 
            annexure: "3.b.i",
            details: {
              checkType: "Interactive Logon",
              expectedValue: "CTRL+ALT+DEL required",
              actualValue: "not required",
              riskLevel: "Medium",
              remediation: "Require CTRL+ALT+DEL for secure logon",
              lastChecked: "2024-01-15 09:15:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-WIN-307", 
            type: "feature", 
            name: "last user not displayed", 
            status: "warning", 
            level: 3, 
            parent: "win-interactive", 
            description: "Ensure 'Interactive logon: Don't display last signed in' is set to 'Enabled'", 
            annexure: "3.b.ii",
            details: {
              checkType: "Interactive Logon",
              expectedValue: "Don't display last user",
              actualValue: "last user displayed",
              riskLevel: "Low",
              remediation: "Hide last signed-in user for privacy",
              lastChecked: "2024-01-15 09:15:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-WIN-309", 
            type: "feature", 
            name: "machine inactivity limit", 
            status: "critical", 
            level: 3, 
            parent: "win-interactive", 
            description: "Ensure 'Interactive logon: Machine inactivity limit' is set to '900 or fewer second(s), but not 0'", 
            annexure: "3.b.iv",
            details: {
              checkType: "Interactive Logon",
              expectedValue: "900 seconds or less",
              actualValue: "never times out",
              riskLevel: "Medium",
              remediation: "URGENT: Set screen lock timeout to 15 minutes maximum",
              lastChecked: "2024-01-15 09:15:00",
              autoRemediation: false
            }
          },
          
          // Network Security Features (F-WIN-320 to F-WIN-324)
          { 
            id: "F-WIN-321", 
            type: "feature", 
            name: "LAN Manager hash disabled", 
            status: "critical", 
            level: 3, 
            parent: "win-network-sec", 
            description: "Ensure 'Network security: Do not store LAN Manager hash value on next password change' is set to 'Enabled'", 
            annexure: "3.d.ii",
            details: {
              checkType: "Network Security",
              expectedValue: "Enabled",
              actualValue: "Disabled",
              riskLevel: "High",
              remediation: "URGENT: Disable LAN Manager hash storage - weak encryption",
              lastChecked: "2024-01-15 09:15:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-WIN-324", 
            type: "feature", 
            name: "NTLM session security", 
            status: "critical", 
            level: 3, 
            parent: "win-network-sec", 
            description: "Ensure 'Network security: Minimum session security for NTLM SSP based servers' is set to 'Require NTLMv2 session security, Require 128-bit encryption'", 
            annexure: "3.d.v",
            details: {
              checkType: "Network Security",
              expectedValue: "NTLMv2 + 128-bit encryption",
              actualValue: "weak NTLM security",
              riskLevel: "High",
              remediation: "URGENT: Enable strong NTLM session security",
              lastChecked: "2024-01-15 09:15:00",
              autoRemediation: false
            }
          },
          
          // UAC Features (F-WIN-401 to F-WIN-406)
          { 
            id: "F-WIN-401", 
            type: "feature", 
            name: "UAC admin approval mode", 
            status: "critical", 
            level: 3, 
            parent: "win-uac", 
            description: "Ensure 'User Account Control: Admin Approval Mode for the Built-in Administrator account' is set to 'Enabled'", 
            annexure: "4.a.i",
            details: {
              checkType: "User Account Control",
              expectedValue: "Enabled",
              actualValue: "Disabled",
              riskLevel: "High",
              remediation: "URGENT: Enable UAC for built-in administrator account",
              lastChecked: "2024-01-15 09:15:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-WIN-403", 
            type: "feature", 
            name: "UAC standard user elevation", 
            status: "critical", 
            level: 3, 
            parent: "win-uac", 
            description: "Ensure 'User Account Control: Behaviour of the elevation prompt for standard users' is set to 'Automatically deny elevation requests'", 
            annexure: "4.a.iii",
            details: {
              checkType: "User Account Control",
              expectedValue: "Automatically deny elevation",
              actualValue: "prompt for credentials",
              riskLevel: "Medium",
              remediation: "URGENT: Deny elevation requests for standard users",
              lastChecked: "2024-01-15 09:15:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-WIN-405", 
            type: "feature", 
            name: "UAC admin approval mode enabled", 
            status: "critical", 
            level: 3, 
            parent: "win-uac", 
            description: "Ensure 'User Account Control: Run all administrators in Admin Approval Mode' is set to 'Enabled'", 
            annexure: "4.a.v",
            details: {
              checkType: "User Account Control",
              expectedValue: "Enabled",
              actualValue: "Disabled",
              riskLevel: "High",
              remediation: "URGENT: Enable UAC Admin Approval Mode for all administrators",
              lastChecked: "2024-01-15 09:15:00",
              autoRemediation: false
            }
          },
          
          // System Services Features (F-WIN-407 to F-WIN-409)
          { 
            id: "F-WIN-407", 
            type: "feature", 
            name: "Bluetooth Audio Gateway disabled", 
            status: "warning", 
            level: 3, 
            parent: "win-services", 
            description: "Ensure 'Bluetooth Audio Gateway Service (BTAGService)' is set to 'Disabled'", 
            annexure: "4.b.i",
            details: {
              checkType: "System Services",
              expectedValue: "Disabled",
              actualValue: "Automatic",
              riskLevel: "Medium",
              remediation: "Disable Bluetooth Audio Gateway service on workstation",
              lastChecked: "2024-01-15 09:15:00",
              autoRemediation: false
            }
          },
          { 
            id: "F-WIN-408", 
            type: "feature", 
            name: "Bluetooth Support disabled", 
            status: "warning", 
            level: 3, 
            parent: "win-services", 
            description: "Ensure 'Bluetooth Support Service (bthserv)' is set to 'Disabled'", 
            annexure: "4.b.ii",
            details: {
              checkType: "System Services",
              expectedValue: "Disabled",
              actualValue: "Automatic",
              riskLevel: "Medium",
              remediation: "Disable Bluetooth support service on workstation",
              lastChecked: "2024-01-15 09:15:00",
              autoRemediation: false
            }
          }
        ],
        links: [
          { source: "mumbai-ws-01", target: "win-accounts", relationship: "contains" },
          { source: "mumbai-ws-01", target: "win-local", relationship: "contains" },
          { source: "mumbai-ws-01", target: "win-security", relationship: "contains" },
          { source: "mumbai-ws-01", target: "win-system", relationship: "contains" },
          
          // Account Policies
          { source: "win-accounts", target: "win-pwd-policy", relationship: "contains" },
          { source: "win-accounts", target: "win-lockout", relationship: "contains" },
          
          // Local Policies
          { source: "win-local", target: "win-user-rights", relationship: "contains" },
          
          // Security Options
          { source: "win-security", target: "win-accounts-sec", relationship: "contains" },
          { source: "win-security", target: "win-interactive", relationship: "contains" },
          { source: "win-security", target: "win-network-sec", relationship: "contains" },
          
          // System Settings
          { source: "win-system", target: "win-uac", relationship: "contains" },
          { source: "win-system", target: "win-services", relationship: "contains" },
          
          // Password Policy Features
          { source: "win-pwd-policy", target: "F-WIN-101", relationship: "contains" },
          { source: "win-pwd-policy", target: "F-WIN-102", relationship: "contains" },
          { source: "win-pwd-policy", target: "F-WIN-104", relationship: "contains" },
          { source: "win-pwd-policy", target: "F-WIN-105", relationship: "contains" },
          
          // Account Lockout Features
          { source: "win-lockout", target: "F-WIN-107", relationship: "contains" },
          { source: "win-lockout", target: "F-WIN-108", relationship: "contains" },
          
          // User Rights Features
          { source: "win-user-rights", target: "F-WIN-202", relationship: "contains" },
          { source: "win-user-rights", target: "F-WIN-204", relationship: "contains" },
          
          // Account Security Features
          { source: "win-accounts-sec", target: "F-WIN-301", relationship: "contains" },
          { source: "win-accounts-sec", target: "F-WIN-302", relationship: "contains" },
          { source: "win-accounts-sec", target: "F-WIN-303", relationship: "contains" },
          
          // Interactive Logon Features
          { source: "win-interactive", target: "F-WIN-306", relationship: "contains" },
          { source: "win-interactive", target: "F-WIN-307", relationship: "contains" },
          { source: "win-interactive", target: "F-WIN-309", relationship: "contains" },
          
          // Network Security Features
          { source: "win-network-sec", target: "F-WIN-321", relationship: "contains" },
          { source: "win-network-sec", target: "F-WIN-324", relationship: "contains" },
          
          // UAC Features
          { source: "win-uac", target: "F-WIN-401", relationship: "contains" },
          { source: "win-uac", target: "F-WIN-403", relationship: "contains" },
          { source: "win-uac", target: "F-WIN-405", relationship: "contains" },
          
          // System Services Features
          { source: "win-services", target: "F-WIN-407", relationship: "contains" },
          { source: "win-services", target: "F-WIN-408", relationship: "contains" }
        ]
      },
      "mumbai-db-01": {
        name: "MUM-DB-01",
        ip: "192.168.1.20",
        role: "Primary Database Server",
        status: "critical",
        location: "Mumbai Office",
        rack: "Rack-B-12",
        serialNumber: "MDB-2023-002",
        purchaseDate: "2023-02-10",
        warranty: "5 years",
        vendor: "HPE",
        model: "ProLiant DL380 Gen10",
        nodes: [
          { 
            id: "mumbai-db-01", 
            type: "system", 
            name: "MUM-DB-01", 
            status: "system", 
            level: 0,
            details: {
              description: "Critical database server for financial data",
              criticality: "Critical",
              businessImpact: "Core business operations",
              maintenanceWindow: "Saturdays 11:00 PM - 3:00 AM IST"
            }
          },
          
          // Database-specific categories
          { 
            id: "filesystem", 
            type: "category", 
            name: "Filesystem Security", 
            status: "category", 
            level: 1,
            details: {
              description: "Database file system security",
              totalChecks: 45,
              passedChecks: 18,
              failedChecks: 27,
              lastAudit: "2024-01-08"
            }
          },
          { 
            id: "services", 
            type: "category", 
            name: "Database Services", 
            status: "category", 
            level: 1,
            details: {
              description: "PostgreSQL and related services",
              totalServices: 12,
              secureServices: 5,
              vulnerableServices: 7,
              lastReview: "2024-01-09"
            }
          },
          { 
            id: "access-control", 
            type: "category", 
            name: "Database Access Control", 
            status: "category", 
            level: 1,
            details: {
              description: "User authentication and database permissions",
              totalUsers: 25,
              activeUsers: 18,
              privilegedUsers: 8,
              lastPasswordAudit: "2024-01-05"
            }
          },
          { 
            id: "logging", 
            type: "category", 
            name: "Database Auditing", 
            status: "category", 
            level: 1,
            details: {
              description: "Database transaction and access logging",
              logRetention: "180 days",
              logSize: "15.7GB",
              alertsEnabled: true,
              lastLogRotation: "2024-01-14"
            }
          },
          
          // Additional critical features for database
          { 
            id: "fs-kernel", 
            type: "subcategory", 
            name: "Filesystem Kernel Modules", 
            status: "subcategory", 
            level: 2, 
            parent: "filesystem",
            details: {
              description: "Critical kernel module security for database",
              moduleCount: 10,
              disabledModules: 3,
              requiredModules: 7,
              complianceRate: "30%"
            }
          }
          // ... (would continue with more features)
        ],
        links: [
          { source: "mumbai-db-01", target: "filesystem", relationship: "contains" },
          { source: "mumbai-db-01", target: "services", relationship: "contains" },
          { source: "mumbai-db-01", target: "access-control", relationship: "contains" },
          { source: "mumbai-db-01", target: "logging", relationship: "contains" },
          { source: "filesystem", target: "fs-kernel", relationship: "contains" }
        ]
      }
      // Additional systems would have similar comprehensive data structures
    };

    const width = window.innerWidth - (isInfrastructureCollapsed ? 80 : 400);
    const height = window.innerHeight - 200;

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    svg.selectAll("*").remove();

    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on("zoom", handleZoom);

    svg.call(zoom);

    const g = svg.append("g");

    let currentTransform = d3.zoomIdentity;

    function handleZoom(event) {
      currentTransform = event.transform;
      g.attr("transform", currentTransform);
    }

    function renderLocationSystemsView() {
      if (!selectedLocation || !locationsData[selectedLocation]) {
        g.selectAll("*").remove();
        return;
      }

      g.selectAll("*").remove();

      const locationData = locationsData[selectedLocation];
      const systems = locationData.systems;

      // Create nodes for systems
      const nodes = systems.map((system, index) => ({
        id: system.id,
        type: "system",
        name: system.name,
        status: system.status,
        systemType: system.type,
        details: system,
        x: (width / (systems.length + 1)) * (index + 1),
        y: height / 2,
        level: 0
      }));

      renderGraph({ nodes, links: [] });
    }

    function renderSystemDetailsView() {
      if (!selectedSystem || !systemsData[selectedSystem]) return;
      
      const data = systemsData[selectedSystem];
      let filteredNodes = [...data.nodes];
      let filteredLinks = [...data.links];

      // Filter nodes based on expansion state
      if (expandedNodes.size > 0) {
        const visibleNodes = new Set([selectedSystem]);
        
        // Add directly connected nodes from expanded nodes
        expandedNodes.forEach(expandedId => {
          data.links.forEach(link => {
            if (link.source === expandedId) {
              visibleNodes.add(link.target);
            }
            if (link.target === expandedId) {
              visibleNodes.add(link.source);
            }
          });
        });

        filteredNodes = data.nodes.filter(node => visibleNodes.has(node.id));
        filteredLinks = data.links.filter(link => 
          visibleNodes.has(link.source) && visibleNodes.has(link.target)
        );
      } else {
        // Show only system node initially
        filteredNodes = data.nodes.filter(node => node.type === "system");
        filteredLinks = [];
      }

      renderGraph({ nodes: filteredNodes, links: filteredLinks });
    }

    function renderGraph(data) {
      g.selectAll("*").remove();

      const simulation = d3.forceSimulation(data.nodes)
        .force("link", d3.forceLink(data.links).id(d => d.id).distance(d => {
          if (currentView === 'location-systems') return 200;
          return d.source.level === 0 ? 150 : d.source.level === 1 ? 120 : 80;
        }))
        .force("charge", d3.forceManyBody().strength(d => {
          if (currentView === 'location-systems') return -800;
          return d.type === "system" ? -800 : d.type === "category" ? -400 : -200;
        }))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide().radius(d => {
          if (currentView === 'location-systems') return 40;
          return d.type === "system" ? 35 : d.type === "category" ? 25 : 20;
        }))
        .velocityDecay(0.4)  // Slower animation - default is 0.4, lower = slower
        .alphaDecay(0.01)    // Slower convergence - default is 0.028, lower = slower
        .alpha(0.8);         // Lower starting energy for gentler movements

      // Create links
      const link = g.append("g")
        .selectAll("line")
        .data(data.links)
        .enter().append("line")
        .attr("class", "link")
        .style("stroke", "#a0aec0")
        .style("stroke-width", 1.5)
        .style("opacity", 0.6);

      // Create nodes
      const node = g.append("g")
        .selectAll("circle")
        .data(data.nodes)
        .enter().append("circle")
        .attr("class", d => `node node-${d.type}-${d.status}`)
        .attr("r", d => {
          if (currentView === 'location-systems') return 35;
          if (d.type === "system") return 30;
          if (d.type === "category") return 20;
          if (d.type === "subcategory") return 15;
          return 10;
        })
        .style("fill", d => {
          if (d.type === "system") return getSystemTypeColor(d.systemType || d.details?.type);
          if (d.type === "category") return "#805ad5";
          if (d.type === "subcategory") return "#38b2ac";
          if (d.status === "compliant") return "#48bb78";
          if (d.status === "warning") return "#ed8936";
          if (d.status === "critical") return "#f56565";
          return "#a0aec0";
        })
        .style("stroke", d => {
          if (d.type === "system") return getSystemTypeStroke(d.systemType || d.details?.type);
          if (d.type === "category") return "#553c9a";
          if (d.type === "subcategory") return "#2c7a7b";
          if (d.status === "compliant") return "#38a169";
          if (d.status === "warning") return "#dd6b20";
          if (d.status === "critical") return "#e53e3e";
          return "#718096";
        })
        .style("stroke-width", d => d.id === selectedNode?.id ? 4 : 2)
        .style("filter", d => d.id === selectedNode?.id ? "drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))" : "none")
        .style("cursor", "pointer")
        .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended))
        .on("click", handleNodeClick);

      // Add labels
      const labels = g.append("g")
        .selectAll("text")
        .data(data.nodes)
        .enter().append("text")
        .style("fill", "#2d3748")
        .style("font-size", d => {
          if (currentView === 'location-systems') return "13px";
          return d.type === "system" ? "13px" : d.type === "category" ? "12px" : "11px";
        })
        .style("font-weight", d => d.type === "system" || d.type === "category" ? "600" : "500")
        .style("text-anchor", "middle")
        .style("pointer-events", "none")
        .text(d => d.name)
        .attr("dy", d => {
          if (currentView === 'location-systems') return 50;
          if (d.type === "system") return 45;
          if (d.type === "category") return 30;
          if (d.type === "subcategory") return 25;
          return 20;
        });

      simulation.on("tick", () => {
        link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);

        node
          .attr("cx", d => d.x)
          .attr("cy", d => d.y);

        labels
          .attr("x", d => d.x)
          .attr("y", d => d.y);
      });

      (window as any).currentGraph = { node, link, labels, simulation };

      setTimeout(() => {
        fitToScreen();
      }, 1000);
    }

    function getSystemTypeColor(type) {
      switch (type) {
        case 'web-server': return "#3b82f6";
        case 'database': return "#059669";
        case 'application': return "#7c3aed";
        case 'load-balancer': return "#dc2626";
        case 'cache': return "#ea580c";
        default: return "#4299e1";
      }
    }

    function getSystemTypeStroke(type) {
      switch (type) {
        case 'web-server': return "#1d4ed8";
        case 'database': return "#047857";
        case 'application': return "#5b21b6";
        case 'load-balancer': return "#b91c1c";
        case 'cache': return "#c2410c";
        default: return "#2b77ad";
      }
    }

    function handleNodeClick(event, d) {
      // Always set selected node for info panel
      setSelectedNode(d);
      
      if (currentView === 'location-systems' && d.type === "system") {
        setSelectedSystem(d.id);
        setCurrentView('system-details');
        setExpandedNodes(new Set([d.id]));
      } else if (currentView === 'system-details') {
        // In system view, expand/collapse nodes
        const newExpanded = new Set(expandedNodes);
        if (newExpanded.has(d.id)) {
          newExpanded.delete(d.id);
        } else {
          newExpanded.add(d.id);
        }
        setExpandedNodes(newExpanded);
      }
    }

    function fitToScreen() {
      const bounds = g.node().getBBox();
      const fullWidth = width;
      const fullHeight = height;
      const widthScale = fullWidth / bounds.width;
      const heightScale = fullHeight / bounds.height;
      const scale = 0.85 * Math.min(widthScale, heightScale);
      const translate = [
        fullWidth / 2 - scale * (bounds.x + bounds.width / 2),
        fullHeight / 2 - scale * (bounds.y + bounds.height / 2)
      ];

      svg.transition().duration(750).call(
        zoom.transform,
        d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
      );
    }

    function dragstarted(event, d) {
      if (!event.active) (window as any).currentGraph.simulation.alphaTarget(0.1).restart(); // Reduced from 0.3 to 0.1
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) (window as any).currentGraph.simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Expose functions globally for toolbar
    (window as any).zoomIn = () => {
      svg.transition().duration(300).call(zoom.scaleBy, 1.5);
    };

    (window as any).zoomOut = () => {
      svg.transition().duration(300).call(zoom.scaleBy, 1 / 1.5);
    };

    (window as any).fitToScreen = fitToScreen;

    (window as any).resetView = () => {
      setSelectedLocation(null);
      setSelectedSystem(null);
      setSelectedNode(null);
      setExpandedNodes(new Set());
      setCurrentView('location-systems');
    };

    (window as any).goBackToLocationSystems = () => {
      setSelectedSystem(null);
      setSelectedNode(null);
      setExpandedNodes(new Set());
      setCurrentView('location-systems');
    };

    // Render appropriate view
    if (currentView === 'location-systems') {
      renderLocationSystemsView();
    } else {
      renderSystemDetailsView();
    }
  };

  const toggleLocationExpansion = (locationId: string) => {
    const newExpanded = new Set(expandedLocations);
    if (newExpanded.has(locationId)) {
      newExpanded.delete(locationId);
    } else {
      newExpanded.add(locationId);
    }
    setExpandedLocations(newExpanded);
  };

  const selectLocation = (locationId: string) => {
    setSelectedLocation(locationId);
    setCurrentView('location-systems');
    setSelectedSystem(null);
    setExpandedNodes(new Set());
  };

  const getSystemIcon = (type: string) => {
    switch (type) {
      case 'web-server': return <Globe className="h-3 w-3" />;
      case 'database': return <Database className="h-3 w-3" />;
      case 'application': return <Cpu className="h-3 w-3" />;
      case 'load-balancer': return <Network className="h-3 w-3" />;
      case 'cache': return <HardDrive className="h-3 w-3" />;
      default: return <Server className="h-3 w-3" />;
    }
  };

  const locations = [
    { 
      id: "mumbai", 
      name: "Mumbai Office", 
      region: "West India", 
      systemCount: 4, 
      status: "critical",
      address: "Bandra Kurla Complex, Mumbai 400051",
      datacenter: "DC-MUM-01"
    },
    { 
      id: "delhi", 
      name: "Delhi Office", 
      region: "North India", 
      systemCount: 3, 
      status: "warning",
      address: "Connaught Place, New Delhi 110001",
      datacenter: "DC-DEL-01"
    },
    { 
      id: "bangalore", 
      name: "Bangalore Office", 
      region: "South India", 
      systemCount: 3, 
      status: "warning",
      address: "Electronic City, Bangalore 560100",
      datacenter: "DC-BLR-01"
    }
  ];

  // Mock data for systems in selected location
  const getLocationSystems = (locationId: string) => {
    const locationsData = {
      "mumbai": [
        { id: "mumbai-web-01", name: "MUM-WEB-01", type: "web-server", status: "warning", ip: "192.168.1.10" },
        { id: "mumbai-db-01", name: "MUM-DB-01", type: "database", status: "critical", ip: "192.168.1.20" },
        { id: "mumbai-app-01", name: "MUM-APP-01", type: "application", status: "warning", ip: "192.168.1.30" },
        { id: "mumbai-proxy-01", name: "MUM-PROXY-01", type: "load-balancer", status: "critical", ip: "192.168.1.40" }
      ],
      "delhi": [
        { id: "delhi-web-01", name: "DEL-WEB-01", type: "web-server", status: "warning", ip: "192.168.2.10" },
        { id: "delhi-db-01", name: "DEL-DB-01", type: "database", status: "critical", ip: "192.168.2.20" },
        { id: "delhi-app-01", name: "DEL-APP-01", type: "application", status: "compliant", ip: "192.168.2.30" }
      ],
      "bangalore": [
        { id: "blr-web-01", name: "BLR-WEB-01", type: "web-server", status: "warning", ip: "192.168.3.10" },
        { id: "blr-db-01", name: "BLR-DB-01", type: "database", status: "critical", ip: "192.168.3.20" },
        { id: "blr-cache-01", name: "BLR-CACHE-01", type: "cache", status: "warning", ip: "192.168.3.50" }
      ]
    };
    return locationsData[locationId] || [];
  };

  return (
    <AppLayout title="Guardian CMDB Security Dashboard" breadcrumbs={["Visualize"]}>
      <div className="flex h-[calc(100vh-12rem)]">
        {/* Collapsible Sidebar */}
        {!isInfrastructureCollapsed && (
          <div className="w-80 bg-card border-r overflow-y-auto">
            {/* Infrastructure Section */}
            <div className="p-6 border-b">
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => setIsInfrastructureCollapsed(!isInfrastructureCollapsed)}
                >
                  <ChevronDown className="h-4 w-4" />
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Infrastructure</h3>
                </div>
                {currentView === 'system-details' && (
                  <button 
                    onClick={() => (window as any).goBackToLocationSystems?.()}
                    className="text-xs px-2 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90"
                  >
                    ← Systems
                  </button>
                )}
              </div>
              
              {currentView === 'location-systems' && selectedLocation ? (
                <div className="space-y-3">
                  <div className="text-sm font-medium text-blue-600">
                    {locations.find(l => l.id === selectedLocation)?.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {locations.find(l => l.id === selectedLocation)?.address}
                  </div>
                  <div className="space-y-2">
                    {getLocationSystems(selectedLocation).map((system) => (
                      <div 
                        key={system.id}
                        className="p-2 rounded border hover:bg-muted cursor-pointer flex items-center gap-2"
                        onClick={() => {
                          setSelectedSystem(system.id);
                          setCurrentView('system-details');
                          setExpandedNodes(new Set([system.id]));
                        }}
                      >
                        {getSystemIcon(system.type)}
                        <div className="flex-1">
                          <div className="text-xs font-medium">{system.name}</div>
                          <div className="text-xs text-muted-foreground">{system.ip}</div>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${
                          system.status === 'compliant' ? 'bg-green-500' :
                          system.status === 'warning' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`} />
                      </div>
                    ))}
                  </div>
                </div>
              ) : currentView === 'system-details' ? (
                <div className="space-y-2">
                  <div className="text-sm font-medium">{selectedSystem}</div>
                  <div className="text-xs text-muted-foreground">Security Configuration Details</div>
                  <div className="mt-4 space-y-1">
                    <div className="text-xs text-muted-foreground mb-2">Expanded Nodes:</div>
                    {Array.from(expandedNodes).map(nodeId => (
                      <div key={nodeId} className="text-xs px-2 py-1 bg-muted rounded flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        {nodeId}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {locations.map((location) => (
                    <div key={location.id}>
                      <div 
                        className={`p-3 rounded-lg cursor-pointer transition-all border flex items-center justify-between ${
                          selectedLocation === location.id 
                            ? 'bg-blue-50 border-blue-200 text-blue-700' 
                            : 'hover:bg-muted border-transparent'
                        }`}
                        onClick={() => toggleLocationExpansion(location.id)}
                      >
                        <div className="flex items-center gap-2">
                          {expandedLocations.has(location.id) ? 
                            <ChevronDown className="h-4 w-4" /> : 
                            <ChevronRight className="h-4 w-4" />
                          }
                          <Building2 className="h-4 w-4" />
                          <span className="font-medium text-sm">{location.name}</span>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${
                          location.status === 'compliant' ? 'bg-green-500' :
                          location.status === 'warning' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`} />
                      </div>
                      
                      {expandedLocations.has(location.id) && (
                        <div className="ml-6 mt-2 space-y-1">
                          <div className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                            <MapPin className="h-3 w-3" />
                            {location.region} • {location.systemCount} systems
                          </div>
                          <div className="text-xs text-muted-foreground mb-2">
                            {location.address}
                          </div>
                          <button 
                            onClick={() => selectLocation(location.id)}
                            className="w-full text-left px-3 py-2 text-xs bg-muted/50 hover:bg-muted rounded flex items-center gap-2"
                          >
                            <Server className="h-3 w-3" />
                            View Systems
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Compliance Metrics Section */}
            <div className="p-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Compliance Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">{metrics.compliant}</div>
                  <div className="text-xs text-muted-foreground uppercase">Compliant</div>
                </div>
                <div className="bg-muted p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-yellow-600">{metrics.warning}</div>
                  <div className="text-xs text-muted-foreground uppercase">Warning</div>
                </div>
                <div className="bg-muted p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-600">{metrics.critical}</div>
                  <div className="text-xs text-muted-foreground uppercase">Critical</div>
                </div>
                <div className="bg-muted p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-muted-foreground">{metrics.total}</div>
                  <div className="text-xs text-muted-foreground uppercase">Total Features</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Collapsed sidebar toggle */}
        {isInfrastructureCollapsed && (
          <div className="w-12 bg-card border-r flex flex-col items-center py-4">
            <button 
              onClick={() => setIsInfrastructureCollapsed(false)}
              className="p-2 hover:bg-muted rounded"
              title="Expand Infrastructure Panel"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="mt-4 space-y-2">
              {locations.map((location) => (
                <div key={location.id} className="w-2 h-2 rounded-full bg-muted" />
              ))}
            </div>
          </div>
        )}

        {/* Main Graph Area */}
        <div className="flex-1 relative bg-card">
          <svg ref={svgRef} className="w-full h-full" />
          
          {/* Controls */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <div className="flex gap-2">
              {isInfrastructureCollapsed && (
                <button 
                  className="px-4 py-2 bg-card border rounded-md text-sm font-medium hover:bg-muted transition-colors"
                  onClick={() => setIsInfrastructureCollapsed(false)}
                >
                  Show Panel
                </button>
              )}
              <button 
                className="px-4 py-2 bg-card border rounded-md text-sm font-medium hover:bg-muted transition-colors"
                onClick={() => (window as any).resetView?.()}
              >
                Reset View
              </button>
              {currentView === 'system-details' && (
                <button 
                  className="px-4 py-2 bg-card border rounded-md text-sm font-medium hover:bg-muted transition-colors"
                  onClick={() => (window as any).goBackToLocationSystems?.()}
                >
                  ← Back to Systems
                </button>
              )}
            </div>
            <div className="flex gap-1 bg-card border rounded-md p-1">
              <button 
                className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded text-sm font-bold"
                onClick={() => (window as any).zoomIn?.()}
                title="Zoom In"
              >
                +
              </button>
              <button 
                className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded text-sm font-bold"
                onClick={() => (window as any).zoomOut?.()}
                title="Zoom Out"
              >
                −
              </button>
              <button 
                className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded text-sm font-bold"
                onClick={() => (window as any).fitToScreen?.()}
                title="Fit to Screen"
              >
                ⌂
              </button>
            </div>
          </div>

          {/* Instructions Panel */}
          <div className="absolute top-4 right-4 bg-card border rounded-md px-4 py-2 text-sm">
            <div className="text-muted-foreground">
              {!selectedLocation 
                ? '📍 Click on location, then select systems to view'
                : currentView === 'location-systems' 
                  ? `🏢 ${locations.find(l => l.id === selectedLocation)?.name} → Click systems for details`
                  : `🔒 ${selectedSystem} → Click nodes for information`
              }
            </div>
            {selectedNode && (
              <div className="text-xs text-blue-600 mt-1">
                ℹ️ Selected: {selectedNode.name}
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-card border rounded-md p-4">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-3">Node Types</h4>
            <div className="space-y-2">
              {currentView === 'location-systems' ? (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full" />
                    <span className="text-xs">Web Server</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-600 rounded-full" />
                    <span className="text-xs">Database</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-600 rounded-full" />
                    <span className="text-xs">Application</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-600 rounded-full" />
                    <span className="text-xs">Load Balancer</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-600 rounded-full" />
                    <span className="text-xs">Cache</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full" />
                    <span className="text-xs">System</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-500 rounded-full" />
                    <span className="text-xs">Category</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-teal-500 rounded-full" />
                    <span className="text-xs">Sub-Category</span>
                  </div>
                </>
              )}
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500" />
                <span className="text-xs">Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500" />
                <span className="text-xs">Warning</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500" />
                <span className="text-xs">Critical</span>
              </div>
            </div>
          </div>
        </div>

        {/* Node Information Panel */}
        <div className="w-80 bg-card border-l overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Node Information
              </h3>
              {selectedNode && (
                <button 
                  onClick={() => setSelectedNode(null)}
                  className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded hover:bg-muted/80"
                  title="Clear Selection"
                >
                  ✕
                </button>
              )}
            </div>
            
            {selectedNode ? (
              renderNodeInfo(selectedNode)
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <div className="mb-4">
                  <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
                </div>
                <p className="text-sm">Click on any node to view detailed information</p>
                <p className="text-xs mt-2 opacity-70">
                  No more hovering needed - just click!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setShowScanDialog(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-3 rounded-full shadow-lg hover:bg-primary/90 transition-colors"
          title="Start New Scan"
        >
          <Target className="h-5 w-5" />
          <span className="hidden sm:inline">Start Scan</span>
        </button>
      </div>

      {/* Start New Scan Dialog */}
      <StartNewScanDialog
        open={showScanDialog}
        onOpenChange={setShowScanDialog}
        locations={mockLocationsForScan}
        onStartScan={handleStartScan}
      />
    </AppLayout>
  );
}