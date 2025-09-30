import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Play, RefreshCw, Calendar, Clock } from "lucide-react";

const scanHistory = [
  { id: "SCN-001", target: "Production Servers", status: "Completed", findings: 47, critical: 5, high: 12, medium: 18, low: 12, timestamp: "2025-09-30 14:23:15", duration: "12m 34s" },
  { id: "SCN-002", target: "Development Environment", status: "Completed", findings: 23, critical: 1, high: 7, medium: 10, low: 5, timestamp: "2025-09-30 10:15:42", duration: "8m 17s" },
  { id: "SCN-003", target: "Database Servers", status: "In Progress", findings: 0, critical: 0, high: 0, medium: 0, low: 0, timestamp: "2025-09-30 15:00:00", duration: "Running" },
  { id: "SCN-004", target: "Web Servers", status: "Completed", findings: 31, critical: 3, high: 9, medium: 12, low: 7, timestamp: "2025-09-30 08:45:22", duration: "15m 09s" },
];

const scheduledScans = [
  { name: "Daily Full Scan", schedule: "Every day at 02:00 AM", lastRun: "2025-09-30 02:00", nextRun: "2025-10-01 02:00", enabled: true },
  { name: "Weekly Compliance Check", schedule: "Every Monday at 06:00 AM", lastRun: "2025-09-27 06:00", nextRun: "2025-10-04 06:00", enabled: true },
  { name: "Monthly Deep Scan", schedule: "1st of every month at 00:00 AM", lastRun: "2025-09-01 00:00", nextRun: "2025-10-01 00:00", enabled: true },
];

export default function Scans() {
  return (
    <AppLayout title="Security Scans" breadcrumbs={["Aegis Guardian", "Scans"]}>
      <div className="space-y-6">
        {/* Quick Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button>
              <Play className="h-4 w-4 mr-2" />
              Start New Scan
            </Button>
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Status
            </Button>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Last scan: 3 mins ago</span>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Scans Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">2 in progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Systems Scanned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">387</div>
              <p className="text-xs text-muted-foreground">95% coverage</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Findings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-critical">9</div>
              <p className="text-xs text-muted-foreground">Requires immediate action</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Scan Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">11m 40s</div>
              <p className="text-xs text-muted-foreground">-2m from last week</p>
            </CardContent>
          </Card>
        </div>

        {/* Scan History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Scan History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Scan ID</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Critical</TableHead>
                  <TableHead className="text-center">High</TableHead>
                  <TableHead className="text-center">Medium</TableHead>
                  <TableHead className="text-center">Low</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scanHistory.map((scan) => (
                  <TableRow key={scan.id}>
                    <TableCell className="font-medium">{scan.id}</TableCell>
                    <TableCell>{scan.target}</TableCell>
                    <TableCell>
                      <Badge variant={scan.status === "Completed" ? "secondary" : "default"}>
                        {scan.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {scan.critical > 0 ? (
                        <span className="font-semibold text-critical">{scan.critical}</span>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {scan.high > 0 ? (
                        <span className="font-semibold text-high">{scan.high}</span>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {scan.medium > 0 ? (
                        <span className="font-semibold text-medium">{scan.medium}</span>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {scan.low > 0 ? (
                        <span className="font-semibold text-low">{scan.low}</span>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </TableCell>
                    <TableCell>{scan.duration}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{scan.timestamp}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Scheduled Scans */}
        <Card>
          <CardHeader>
            <CardTitle>Scheduled Scans</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Scan Name</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Last Run</TableHead>
                  <TableHead>Next Run</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scheduledScans.map((scan, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{scan.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {scan.schedule}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{scan.lastRun}</TableCell>
                    <TableCell className="text-sm">{scan.nextRun}</TableCell>
                    <TableCell>
                      <Badge variant={scan.enabled ? "secondary" : "outline"}>
                        {scan.enabled ? "Enabled" : "Disabled"}
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
      </div>
    </AppLayout>
  );
}
