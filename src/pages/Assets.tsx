import React, { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, Server, Monitor, Database, Globe, Shield } from "lucide-react";

const assets = [
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
    location: "Bangalore" 
  },
];

const assetTypes = [
  { name: "Web Servers", count: 24, icon: Globe, compliant: 22 },
  { name: "Database Servers", count: 12, icon: Database, compliant: 10 },
  { name: "Application Servers", count: 31, icon: Server, compliant: 31 },
  { name: "Workstations", count: 156, icon: Monitor, compliant: 148 },
];

const getPolicyBadgeColor = (type: string) => {
  switch (type) {
    case 'Custom':
      return 'bg-info/20 text-info';
    case 'Server':
      return 'bg-secondary';
    case 'Network':
      return 'bg-accent/20 text-accent';
    default:
      return 'bg-gray-500';
  }
};

const PolicyCell = ({ policies }: { policies: { name: string; type: string; status: string }[] }) => {
  const [showAll, setShowAll] = useState(false);
  const compliantCount = policies.filter(p => p.status === 'compliant').length;
  const totalPolicies = policies.length;

  const sortedPolicies = [...policies].sort((a, b) => {
    if (a.type === 'Custom' && b.type !== 'Custom') return -1;
    if (a.type !== 'Custom' && b.type === 'Custom') return 1;
    return 0;
  });

  const visiblePolicies = showAll ? sortedPolicies : sortedPolicies.slice(0, 5);

  return (
    <DropdownMenu onOpenChange={() => setShowAll(false)}>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center -space-x-2 cursor-pointer">
          {sortedPolicies.slice(0, 3).map((policy, index) => (
            <Badge
              key={index}
              className={`${getPolicyBadgeColor(policy.type)} border-2 border-background rounded-full p-2`}
              style={{ zIndex: sortedPolicies.length - index }}
            />
          ))}
          {sortedPolicies.length > 3 && (
            <span className="pl-3 text-xs text-muted-foreground">+{sortedPolicies.length - 3}</span>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="p-2 text-sm font-medium text-muted-foreground border-b">
          {compliantCount}/{totalPolicies} Compliant
        </div>
        {visiblePolicies.map((policy, index) => (
          <DropdownMenuItem key={index} className="flex justify-between">
            <span>{policy.name}</span>
            <Badge className={`${getPolicyBadgeColor(policy.type)}`}>{policy.type}</Badge>
          </DropdownMenuItem>
        ))}
        {!showAll && sortedPolicies.length > 5 && (
          <>
            <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setShowAll(true); }}>
              Show More
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};


export default function Assets() {
  return (
    <AppLayout title="Asset Management" breadcrumbs={["Aegis Guardian", "Assets"]}>
      <div className="space-y-6">
        {/* Search and Actions */}
        <div className="flex items-center justify-between">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search assets by hostname, IP, or type..." className="pl-10" />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">Export CMDB</Button>
            <Button>
              <Shield className="h-4 w-4 mr-2" />
              Deploy Guardian
            </Button>
          </div>
        </div>

        {/* Asset Type Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          {assetTypes.map((type) => {
            const Icon = type.icon;
            const complianceRate = ((type.compliant / type.count) * 100).toFixed(0);
            return (
              <Card key={type.name}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{type.name}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{type.count}</div>
                  <p className="text-xs text-muted-foreground">
                    {complianceRate}% compliant ({type.compliant}/{type.count})
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Asset Inventory */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Asset Inventory</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">Filter</Button>
                <Button variant="outline" size="sm">Group By</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hostname</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Operating System</TableHead>
                  <TableHead>Asset Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Compliance Status</TableHead>
                  <TableHead>Guardian Agent</TableHead>
                  <TableHead>Policies Applied</TableHead>
                  <TableHead>Last Scan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assets.map((asset, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{asset.hostname}</TableCell>
                    <TableCell className="font-mono text-sm">{asset.ip}</TableCell>
                    <TableCell>{asset.os}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{asset.type}</Badge>
                    </TableCell>
                    <TableCell>{asset.location}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          asset.status === "Compliant" ? "secondary" : 
                          asset.status === "Warning" ? "default" : 
                          "destructive"
                        }
                        className={
                          asset.status === "Compliant" ? "bg-green-100 text-green-800" :
                          asset.status === "Warning" ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        }
                      >
                        {asset.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {asset.guardian}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <PolicyCell policies={asset.policies} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{asset.lastScan}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* CMDB Integration Status */}
        <Card>
          <CardHeader>
            <CardTitle>CMDB Integration Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Last Sync</div>
                <div className="text-lg font-semibold">5 minutes ago</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Assets Discovered</div>
                <div className="text-lg font-semibold">387 systems</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Sync Status</div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">Connected</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}