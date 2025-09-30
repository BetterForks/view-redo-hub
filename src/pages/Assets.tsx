import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Server, Monitor, Database, Globe, Shield } from "lucide-react";

const assets = [
  { hostname: "prod-web-01", ip: "10.0.1.15", os: "Ubuntu 22.04 LTS", type: "Web Server", status: "Compliant", guardian: "Active", lastScan: "2 mins ago", policies: "387/387" },
  { hostname: "prod-db-01", ip: "10.0.2.20", os: "Windows Server 2022", type: "Database", status: "Non-Compliant", guardian: "Active", lastScan: "5 mins ago", policies: "381/387" },
  { hostname: "dev-app-03", ip: "10.0.3.42", os: "Ubuntu 20.04 LTS", type: "Application", status: "Compliant", guardian: "Active", lastScan: "10 mins ago", policies: "387/387" },
  { hostname: "prod-web-02", ip: "10.0.1.16", os: "Ubuntu 22.04 LTS", type: "Web Server", status: "Warning", guardian: "Active", lastScan: "3 mins ago", policies: "385/387" },
  { hostname: "backup-store-01", ip: "10.0.4.50", os: "CentOS 8", type: "Storage", status: "Compliant", guardian: "Active", lastScan: "8 mins ago", policies: "387/387" },
  { hostname: "prod-api-01", ip: "10.0.1.25", os: "Ubuntu 22.04 LTS", type: "API Server", status: "Compliant", guardian: "Active", lastScan: "1 min ago", policies: "387/387" },
];

const assetTypes = [
  { name: "Web Servers", count: 24, icon: Globe, compliant: 22 },
  { name: "Database Servers", count: 12, icon: Database, compliant: 10 },
  { name: "Application Servers", count: 31, icon: Server, compliant: 31 },
  { name: "Workstations", count: 156, icon: Monitor, compliant: 148 },
];

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
                    <TableCell>
                      <Badge 
                        variant={
                          asset.status === "Compliant" ? "secondary" : 
                          asset.status === "Warning" ? "default" : 
                          "destructive"
                        }
                        className={
                          asset.status === "Compliant" ? "bg-low/20 text-low" :
                          asset.status === "Warning" ? "bg-medium/20 text-medium" :
                          "bg-critical/20 text-critical"
                        }
                      >
                        {asset.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-info/20 text-info">
                        {asset.guardian}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{asset.policies}</TableCell>
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
                <Badge variant="secondary" className="bg-low/20 text-low">Connected</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
