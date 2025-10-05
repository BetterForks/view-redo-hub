import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GenerateReportDialog } from "@/components/GenerateReportDialog";
import { FileText, Download, Calendar, Clock } from "lucide-react";

const initialReports = [
  { name: "Monthly Compliance Report", type: "Compliance", generated: "2025-09-30 08:00", size: "2.4 MB", format: "PDF", status: "Ready" },
  { name: "Asset Inventory Report", type: "Asset", generated: "2025-09-29 10:15", size: "3.1 MB", format: "PDF", status: "Ready" },
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

// Mock location data from visualization
const mockLocations = {
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

export default function Reports() {
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reports, setReports] = useState(initialReports);

  const handleGenerateReport = (reportConfig: any) => {
    // Mock report generation
    const newReport = {
      name: reportConfig.name || `${reportConfig.reportType} Report`,
      type: reportConfig.reportType.charAt(0).toUpperCase() + reportConfig.reportType.slice(1),
      generated: new Date().toISOString().replace('T', ' ').slice(0, 19),
      size: `${(Math.random() * 3 + 0.5).toFixed(1)} MB`,
      format: reportConfig.format.toUpperCase(),
      status: "Ready"
    };

    setReports(prev => [newReport, ...prev]);
    console.log("Generating report with config:", reportConfig);
  };

  return (
    <AppLayout title="Reports & Compliance" breadcrumbs={["Reports"]}>
      <div className="space-y-6">
        {/* Quick Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button onClick={() => setShowReportDialog(true)}>
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
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reports Generated</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">This month</p>
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

      {/* Generate Report Dialog */}
      <GenerateReportDialog
        open={showReportDialog}
        onOpenChange={setShowReportDialog}
        locations={mockLocations}
        onGenerateReport={handleGenerateReport}
      />
    </AppLayout>
  );
}
