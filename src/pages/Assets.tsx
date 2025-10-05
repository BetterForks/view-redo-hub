import React from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Server, Monitor, Database, Globe, Shield } from "lucide-react";
import { assets } from "../data/assets";

const assetTypes = [
  { name: "Web Servers", count: 3, icon: Globe, compliant: 2 },
  { name: "Database Servers", count: 3, icon: Database, compliant: 2 },
  { name: "Application Servers", count: 2, icon: Server, compliant: 2 },
  { name: "Workstations", count: 9, icon: Monitor, compliant: 6 },
  { name: "Cache/Load Balancers", count: 2, icon: Server, compliant: 1 }
];

export default function Assets() {
  return (
    <AppLayout title="Asset Management" breadcrumbs={["Assets"]}>
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
                    <TableCell className="font-medium">
                      {idx === 0 ? (
                        <Link to={`/assets/${asset.hostname}`} className="cursor-pointer hover:underline">
                          {asset.hostname}
                        </Link>
                      ) : (
                        asset.hostname
                      )}
                    </TableCell>
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
                    <TableCell>{asset.policies.length}</TableCell>
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
