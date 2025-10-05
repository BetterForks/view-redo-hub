import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Download, Calendar, Clock } from "lucide-react";

const reports = [
  { name: "Monthly Compliance Report", type: "Compliance", generated: "2025-09-30 08:00", size: "2.4 MB", format: "PDF", status: "Ready" },
  { name: "Vulnerability Assessment Q3", type: "Vulnerability", generated: "2025-09-25 14:30", size: "1.8 MB", format: "PDF", status: "Ready" },
  { name: "Policy Enforcement Summary", type: "Policy", generated: "2025-09-30 06:00", size: "892 KB", format: "PDF", status: "Ready" },
  { name: "Asset Inventory Report", type: "Asset", generated: "2025-09-29 10:15", size: "3.1 MB", format: "PDF", status: "Ready" },
  { name: "Scan Results - Production", type: "Scan", generated: "2025-09-30 14:23", size: "1.2 MB", format: "PDF", status: "Ready" },
];

const scheduledReports = [
  { name: "Daily Security Posture", schedule: "Daily at 06:00 AM", recipients: "security-team@company.com", enabled: true },
  { name: "Weekly Compliance Summary", schedule: "Every Monday at 08:00 AM", recipients: "ciso@company.com, compliance@company.com", enabled: true },
  { name: "Monthly Executive Dashboard", schedule: "1st of month at 09:00 AM", recipients: "executives@company.com", enabled: true },
];

const reportTemplates = [
  { name: "CIS Benchmark Compliance", description: "Full compliance report against CIS benchmarks", baseline: "CIS Windows Server 2022 / Ubuntu 22.04" },
  { name: "Compliance Management", description: "Comprehensive compliance assessment and remediation status", baseline: "Compliance Database" },
  { name: "Policy Audit Report", description: "Detailed audit of all enforced security policies", baseline: "Aegis Guardian Policies" },
  { name: "Asset Security Posture", description: "Per-asset security status and compliance ratings", baseline: "CMDB Integration" },
];

export default function Reports() {
  return (
    <AppLayout title="Reports & Compliance" breadcrumbs={["Aegis Guardian", "Reports"]}>
      <div className="space-y-6">
        {/* Quick Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
            <Button variant="outline">Schedule Report</Button>
          </div>
          <div className="text-sm text-muted-foreground">
            Last generated: 2 minutes ago
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reports Generated</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">247</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scheduled Reports</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Active schedules</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Report Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">Available templates</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Generation Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23s</div>
              <p className="text-xs text-muted-foreground">For PDF reports</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Reports</CardTitle>
              <Button variant="outline" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Generated</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{report.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{report.type}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{report.generated}</TableCell>
                    <TableCell className="text-sm">{report.size}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{report.format}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-low/20 text-low">
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Scheduled Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Scheduled Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report Name</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scheduledReports.map((report, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{report.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {report.schedule}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                      {report.recipients}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-info/20 text-info">
                        {report.enabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Report Templates */}
        <Card>
          <CardHeader>
            <CardTitle>Report Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {reportTemplates.map((template, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="text-base">{template.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                    <div className="flex items-center justify-between pt-2">
                      <Badge variant="outline" className="text-xs">{template.baseline}</Badge>
                      <Button size="sm">Use Template</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
