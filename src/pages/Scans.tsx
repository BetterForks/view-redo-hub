import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StartNewScanDialog } from "@/components/StartNewScanDialog";
import { Play, RefreshCw, Calendar, Clock } from "lucide-react";

const initialScanHistory = [
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

export default function Scans() {
  const [showScanDialog, setShowScanDialog] = useState(false);
  const [scanHistory, setScanHistory] = useState(initialScanHistory);

  const handleStartScan = (scanConfig: any) => {
    // Mock scan creation
    const newScan = {
      id: `SCN-${String(Date.now()).slice(-3)}`,
      target: scanConfig.selectedLocations.length > 0 
        ? `${scanConfig.selectedLocations.map((loc: string) => mockLocations[loc as keyof typeof mockLocations]?.name).join(", ")}`
        : `${scanConfig.selectedSystems.length} Selected Systems`,
      status: "In Progress",
      findings: 0,
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      duration: "Starting..."
    };

    setScanHistory(prev => [newScan, ...prev]);

    // Simulate scan completion after 5 seconds
    setTimeout(() => {
      setScanHistory(prev => prev.map(scan => 
        scan.id === newScan.id 
          ? { 
              ...scan, 
              status: "Completed", 
              findings: Math.floor(Math.random() * 50) + 10,
              critical: Math.floor(Math.random() * 5),
              high: Math.floor(Math.random() * 10) + 2,
              medium: Math.floor(Math.random() * 15) + 5,
              low: Math.floor(Math.random() * 20) + 3,
              duration: `${Math.floor(Math.random() * 15) + 5}m ${Math.floor(Math.random() * 60)}s`
            }
          : scan
      ));
    }, 5000);

    console.log("Starting scan with config:", scanConfig);
  };
  return (
    <AppLayout title="Security Scans" breadcrumbs={["Aegis Guardian", "Scans"]}>
      <div className="space-y-6">
        {/* Quick Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button onClick={() => setShowScanDialog(true)}>
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

      {/* Start New Scan Dialog */}
      <StartNewScanDialog
        open={showScanDialog}
        onOpenChange={setShowScanDialog}
        locations={mockLocations}
        onStartScan={handleStartScan}
      />
    </AppLayout>
  );
}
