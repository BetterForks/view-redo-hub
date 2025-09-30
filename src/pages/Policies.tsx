import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Shield, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const windowsPolicies = [
  { id: "WIN-001", name: "Enforce Password Complexity", category: "Account Policies", status: "Enforced", compliant: 387, total: 387, baseline: "CIS Windows Server 2022" },
  { id: "WIN-002", name: "Disable Guest Account", category: "Account Policies", status: "Enforced", compliant: 387, total: 387, baseline: "CIS Windows Server 2022" },
  { id: "WIN-003", name: "Configure Audit Policy", category: "Local Policies", status: "Enforced", compliant: 385, total: 387, baseline: "CIS Windows Server 2022" },
  { id: "WIN-004", name: "Windows Firewall Enabled", category: "Security Options", status: "Enforced", compliant: 387, total: 387, baseline: "CIS Windows Server 2022" },
  { id: "WIN-005", name: "Restrict Anonymous Access", category: "Security Options", status: "Warning", compliant: 380, total: 387, baseline: "CIS Windows Server 2022" },
];

const linuxPolicies = [
  { id: "LNX-001", name: "SSH Protocol 2 Only", category: "Network Security", status: "Enforced", compliant: 156, total: 156, baseline: "CIS Ubuntu 22.04" },
  { id: "LNX-002", name: "Disable Root Login", category: "Access Control", status: "Enforced", compliant: 156, total: 156, baseline: "CIS Ubuntu 22.04" },
  { id: "LNX-003", name: "Enable SELinux/AppArmor", category: "Mandatory Access Control", status: "Enforced", compliant: 154, total: 156, baseline: "CIS Ubuntu 22.04" },
  { id: "LNX-004", name: "Password Expiration Policy", category: "Account Policies", status: "Enforced", compliant: 156, total: 156, baseline: "CIS Ubuntu 22.04" },
  { id: "LNX-005", name: "Configure Auditd", category: "Logging & Monitoring", status: "Warning", compliant: 150, total: 156, baseline: "CIS Ubuntu 22.04" },
];

export default function Policies() {
  return (
    <AppLayout title="Security Policies" breadcrumbs={["Aegis Guardian", "Policies"]}>
      <div className="space-y-6">
        {/* Search and Actions */}
        <div className="flex items-center justify-between">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search policies..." className="pl-10" />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">Import Baseline</Button>
            <Button>
              <Shield className="h-4 w-4 mr-2" />
              Create Policy
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Policies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">387</div>
              <p className="text-xs text-muted-foreground">Windows + Linux baselines</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fully Compliant</CardTitle>
              <CheckCircle className="h-4 w-4 text-low" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-low">368</div>
              <p className="text-xs text-muted-foreground">95% compliance rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Warnings</CardTitle>
              <AlertCircle className="h-4 w-4 text-medium" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-medium">15</div>
              <p className="text-xs text-muted-foreground">Partial compliance</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Non-Compliant</CardTitle>
              <XCircle className="h-4 w-4 text-critical" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-critical">4</div>
              <p className="text-xs text-muted-foreground">Requires remediation</p>
            </CardContent>
          </Card>
        </div>

        {/* Policy Tables */}
        <Card>
          <CardHeader>
            <CardTitle>Security Policy Enforcement</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="windows">
              <TabsList>
                <TabsTrigger value="windows">Windows Policies (231)</TabsTrigger>
                <TabsTrigger value="linux">Linux Policies (156)</TabsTrigger>
                <TabsTrigger value="custom">Custom Policies (0)</TabsTrigger>
              </TabsList>
              
              <TabsContent value="windows" className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Policy ID</TableHead>
                      <TableHead>Policy Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Baseline</TableHead>
                      <TableHead className="text-center">Compliance</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {windowsPolicies.map((policy) => {
                      const complianceRate = ((policy.compliant / policy.total) * 100).toFixed(0);
                      return (
                        <TableRow key={policy.id}>
                          <TableCell className="font-mono text-sm">{policy.id}</TableCell>
                          <TableCell className="font-medium">{policy.name}</TableCell>
                          <TableCell>{policy.category}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{policy.baseline}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex flex-col items-center gap-1">
                              <span className="font-semibold">{complianceRate}%</span>
                              <span className="text-xs text-muted-foreground">
                                {policy.compliant}/{policy.total}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="secondary"
                              className={
                                policy.status === "Enforced" ? "bg-low/20 text-low" :
                                policy.status === "Warning" ? "bg-medium/20 text-medium" :
                                "bg-critical/20 text-critical"
                              }
                            >
                              {policy.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">Details</Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="linux" className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Policy ID</TableHead>
                      <TableHead>Policy Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Baseline</TableHead>
                      <TableHead className="text-center">Compliance</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {linuxPolicies.map((policy) => {
                      const complianceRate = ((policy.compliant / policy.total) * 100).toFixed(0);
                      return (
                        <TableRow key={policy.id}>
                          <TableCell className="font-mono text-sm">{policy.id}</TableCell>
                          <TableCell className="font-medium">{policy.name}</TableCell>
                          <TableCell>{policy.category}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{policy.baseline}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex flex-col items-center gap-1">
                              <span className="font-semibold">{complianceRate}%</span>
                              <span className="text-xs text-muted-foreground">
                                {policy.compliant}/{policy.total}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="secondary"
                              className={
                                policy.status === "Enforced" ? "bg-low/20 text-low" :
                                policy.status === "Warning" ? "bg-medium/20 text-medium" :
                                "bg-critical/20 text-critical"
                              }
                            >
                              {policy.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">Details</Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="custom">
                <div className="text-center py-12">
                  <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Custom Policies</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create custom policies to extend baseline security requirements
                  </p>
                  <Button>Create Custom Policy</Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
