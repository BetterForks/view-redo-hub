import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, TrendingUp, Shield, Clock } from "lucide-react";

const vulnerabilities = [
  { cve: "CVE-2024-1234", title: "Remote Code Execution in Apache Struts", severity: "Critical", cvss: "9.8", affected: 5, status: "Open", age: "2 days", remediation: "Apply patch v2.5.33" },
  { cve: "CVE-2024-5678", title: "SQL Injection in MySQL Component", severity: "High", cvss: "8.1", affected: 12, status: "In Progress", age: "5 days", remediation: "Update to v8.0.35" },
  { cve: "CVE-2024-9012", title: "Privilege Escalation via Sudo", severity: "High", cvss: "7.8", affected: 23, status: "Open", age: "1 day", remediation: "Update sudo package" },
  { cve: "CVE-2024-3456", title: "Cross-Site Scripting in Web Framework", severity: "Medium", cvss: "6.1", affected: 8, status: "Open", age: "14 days", remediation: "Upgrade framework to v3.2.1" },
  { cve: "CVE-2024-7890", title: "Denial of Service in Network Stack", severity: "Medium", cvss: "5.3", affected: 31, status: "Resolved", age: "30 days", remediation: "Applied kernel update" },
];

const topAssets = [
  { hostname: "BLR-DB-01", vulnerabilities: 15, critical: 3, high: 7, medium: 5 },
  { hostname: "MUM-WS-02", vulnerabilities: 12, critical: 2, high: 5, medium: 5 },
  { hostname: "BLR-WS-03", vulnerabilities: 21, critical: 5, high: 10, medium: 6 },
  { hostname: "MUM-PROXY-01", vulnerabilities: 8, critical: 1, high: 3, medium: 4 },
];

export default function Vulnerabilities() {
  return (
    <AppLayout title="Compliance Management" breadcrumbs={["Aegis Guardian", "Vulnerabilities"]}>
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Vulnerabilities</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">101</div>
              <p className="text-xs text-muted-foreground">Across 387 systems</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-critical">9</div>
              <p className="text-xs text-muted-foreground">Requires immediate attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-high">28</div>
              <p className="text-xs text-muted-foreground">Remediate within 7 days</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Resolution Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.2 days</div>
              <p className="text-xs text-muted-foreground">-1.3 days from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button>
            <Shield className="h-4 w-4 mr-2" />
            Run Vulnerability Scan
          </Button>
          <Button variant="outline">Export Report</Button>
          <Button variant="outline">Bulk Remediate</Button>
        </div>

        {/* Vulnerability List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Active Vulnerabilities</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">Filter by Severity</Button>
                <Button variant="outline" size="sm">Sort</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CVE ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead className="text-center">CVSS Score</TableHead>
                  <TableHead className="text-center">Affected Assets</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Remediation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vulnerabilities.map((vuln, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-mono text-sm">{vuln.cve}</TableCell>
                    <TableCell className="font-medium max-w-xs">{vuln.title}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline"
                        className={
                          vuln.severity === "Critical" ? "border-critical text-critical" :
                          vuln.severity === "High" ? "border-high text-high" :
                          vuln.severity === "Medium" ? "border-medium text-medium" :
                          "border-low text-low"
                        }
                      >
                        {vuln.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center font-semibold">{vuln.cvss}</TableCell>
                    <TableCell className="text-center">{vuln.affected}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={vuln.status === "Resolved" ? "secondary" : "default"}
                        className={vuln.status === "Resolved" ? "bg-low/20 text-low" : ""}
                      >
                        {vuln.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{vuln.age}</TableCell>
                    <TableCell className="text-sm">{vuln.remediation}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top Vulnerable Assets */}
        <Card>
          <CardHeader>
            <CardTitle>Most Vulnerable Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hostname</TableHead>
                  <TableHead className="text-center">Total Vulnerabilities</TableHead>
                  <TableHead className="text-center">Critical</TableHead>
                  <TableHead className="text-center">High</TableHead>
                  <TableHead className="text-center">Medium</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topAssets.map((asset, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{asset.hostname}</TableCell>
                    <TableCell className="text-center font-semibold">{asset.vulnerabilities}</TableCell>
                    <TableCell className="text-center">
                      <span className="font-semibold text-critical">{asset.critical}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-semibold text-high">{asset.high}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-semibold text-medium">{asset.medium}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">View Details</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
