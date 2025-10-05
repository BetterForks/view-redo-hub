import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Search, 
  Shield, 
  Play, 
  Pause, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Users, 
  Monitor, 
  Server, 
  Settings,
  Target,
  AlertCircle,
  Download,
  Upload,
  Calendar,
  BarChart3
} from "lucide-react";

// Mock data for policy groups
const policyGroups = [
  {
    id: "BWP-001",
    name: "Baseline Windows Policy",
    platform: "windows",
    policies: 231,
    description: "Standard Windows security baseline configuration",
    lastUpdated: "2024-10-01",
    status: "active"
  },
  {
    id: "BLP-001", 
    name: "Baseline Linux Policy",
    platform: "linux",
    policies: 156,
    description: "Standard Linux security baseline configuration",
    lastUpdated: "2024-10-01",
    status: "active"
  },
  {
    id: "CWS-001",
    name: "Custom Windows Security",
    platform: "windows", 
    policies: 45,
    description: "Enhanced Windows security policies for high-risk environments",
    lastUpdated: "2024-09-28",
    status: "active"
  },
  {
    id: "SOX-001",
    name: "SOX Compliance Framework",
    platform: "windows",
    policies: 78,
    description: "Sarbanes-Oxley compliance policies for financial systems",
    lastUpdated: "2024-09-25",
    status: "active"
  }
];

// Mock data for systems/assets
const systems = [
  { id: "SYS-001", hostname: "prod-web-01", ip: "10.0.1.15", platform: "linux", department: "Web Team", status: "online", lastSeen: "2024-10-05 09:30" },
  { id: "SYS-002", hostname: "MUM-DB-01", ip: "192.168.1.20", platform: "linux", department: "Database Team", status: "online", lastSeen: "2024-10-05 09:28" },
  { id: "SYS-003", hostname: "MUM-APP-01", ip: "192.168.1.30", platform: "linux", department: "DevOps Team", status: "online", lastSeen: "2024-10-05 09:25" },
  { id: "SYS-004", hostname: "MUM-PROXY-01", ip: "192.168.1.40", platform: "linux", department: "Network Team", status: "online", lastSeen: "2024-10-05 09:15" },
  { id: "SYS-005", hostname: "MUM-WS-01", ip: "192.168.1.101", platform: "windows", department: "Finance Team", status: "online", lastSeen: "2024-10-05 09:10" },
  { id: "SYS-006", hostname: "MUM-WS-02", ip: "192.168.1.102", platform: "windows", department: "HR Team", status: "offline", lastSeen: "2024-10-04 17:30" },
  { id: "SYS-007", hostname: "MUM-WS-03", ip: "192.168.1.103", platform: "windows", department: "IT Security Team", status: "online", lastSeen: "2024-10-05 09:32" },
  { id: "SYS-008", hostname: "DEL-WEB-01", ip: "192.168.2.10", platform: "linux", department: "Web Team", status: "online", lastSeen: "2024-10-05 09:20" },
  { id: "SYS-009", hostname: "DEL-DB-01", ip: "192.168.2.20", platform: "linux", department: "Database Team", status: "online", lastSeen: "2024-10-05 09:18" },
  { id: "SYS-010", hostname: "DEL-APP-01", ip: "192.168.2.30", platform: "linux", department: "DevOps Team", status: "online", lastSeen: "2024-10-05 09:16" },
  { id: "SYS-011", hostname: "DEL-WS-01", ip: "192.168.2.101", platform: "windows", department: "Sales Team", status: "online", lastSeen: "2024-10-05 09:14" },
  { id: "SYS-012", hostname: "DEL-WS-02", ip: "192.168.2.102", platform: "windows", department: "Marketing Team", status: "online", lastSeen: "2024-10-05 09:12" },
  { id: "SYS-013", hostname: "BLR-WEB-01", ip: "192.168.3.10", platform: "linux", department: "Web Team", status: "online", lastSeen: "2024-10-05 09:10" },
  { id: "SYS-014", hostname: "BLR-DB-01", ip: "192.168.3.20", platform: "linux", department: "Database Team", status: "online", lastSeen: "2024-10-05 09:08" },
  { id: "SYS-015", hostname: "BLR-CACHE-01", ip: "192.168.3.50", platform: "linux", department: "Platform Team", status: "online", lastSeen: "2024-10-05 09:06" },
  { id: "SYS-016", hostname: "BLR-WS-01", ip: "192.168.3.101", platform: "windows", department: "IT Team", status: "online", lastSeen: "2024-10-05 09:04" },
  { id: "SYS-017", hostname: "BLR-WS-02", ip: "192.168.3.102", platform: "windows", department: "Development Team", status: "online", lastSeen: "2024-10-05 09:02" },
  { id: "SYS-018", hostname: "BLR-WS-03", ip: "192.168.3.103", platform: "windows", department: "Support Team", status: "online", lastSeen: "2024-10-05 09:00" }
];

// Mock data for deployment history
const deploymentHistory = [
  {
    id: "DEP-001",
    policyGroup: "Baseline Windows Policy",
    targetSystems: ["MUM-WS-01", "MUM-WS-02", "DEL-WS-01"],
    status: "completed",
    startTime: "2024-10-01 14:30",
    endTime: "2024-10-01 15:45",
    success: 3,
    failed: 0,
    initiatedBy: "admin@company.com"
  },
  {
    id: "DEP-002", 
    policyGroup: "Baseline Linux Policy",
    targetSystems: ["prod-web-01", "MUM-DB-01", "DEL-DB-01"],
    status: "in-progress",
    startTime: "2024-10-05 09:00",
    endTime: null,
    success: 2,
    failed: 0,
    initiatedBy: "admin@company.com"
  },
  {
    id: "DEP-003",
    policyGroup: "SOX Compliance Framework", 
    targetSystems: ["BLR-DB-01", "MUM-DB-01"],
    status: "failed",
    startTime: "2024-10-03 16:00",
    endTime: "2024-10-03 16:30",
    success: 1,
    failed: 1,
    initiatedBy: "compliance@company.com"
  }
];

export default function Compliance() {
  const [selectedPolicyGroup, setSelectedPolicyGroup] = useState<string>("");
  const [selectedSystems, setSelectedSystems] = useState<string[]>([]);
  const [filterPlatform, setFilterPlatform] = useState<string>("all");
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeployDialog, setShowDeployDialog] = useState(false);
  const [deploymentNotes, setDeploymentNotes] = useState("");
  const [scheduleDeployment, setScheduleDeployment] = useState(false);
  const [scheduledTime, setScheduledTime] = useState("");

  const filteredSystems = systems.filter(system => {
    const matchesSearch = system.hostname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         system.ip.includes(searchTerm) ||
                         system.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = filterPlatform === "all" || system.platform === filterPlatform;
    const matchesDepartment = filterDepartment === "all" || system.department === filterDepartment;
    
    return matchesSearch && matchesPlatform && matchesDepartment;
  });

  const selectedPolicyGroupData = policyGroups.find(pg => pg.id === selectedPolicyGroup);
  const selectedSystemsData = systems.filter(sys => selectedSystems.includes(sys.id));

  const handleSystemSelection = (systemId: string, checked: boolean) => {
    if (checked) {
      setSelectedSystems([...selectedSystems, systemId]);
    } else {
      setSelectedSystems(selectedSystems.filter(id => id !== systemId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSystems(filteredSystems.map(sys => sys.id));
    } else {
      setSelectedSystems([]);
    }
  };

  const handleDeploy = () => {
    // Mock deployment logic
    console.log("Deploying policy group:", selectedPolicyGroupData?.name);
    console.log("To systems:", selectedSystemsData.map(sys => sys.hostname));
    console.log("Scheduled:", scheduleDeployment);
    console.log("Notes:", deploymentNotes);
    
    // Reset form
    setShowDeployDialog(false);
    setDeploymentNotes("");
    setScheduleDeployment(false);
    setScheduledTime("");
    setSelectedSystems([]);
    setSelectedPolicyGroup("");
    
    // Show success message
    alert(`Policy deployment initiated!\n\nPolicy: ${selectedPolicyGroupData?.name}\nTargets: ${selectedSystemsData.length} systems\nScheduled: ${scheduleDeployment ? scheduledTime : 'Immediate'}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800"><Clock className="h-3 w-3 mr-1" />In Progress</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Failed</Badge>;
      case "scheduled":
        return <Badge className="bg-yellow-100 text-yellow-800"><Calendar className="h-3 w-3 mr-1" />Scheduled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const departments = [...new Set(systems.map(sys => sys.department))];

  return (
    <AppLayout title="Compliance Management" breadcrumbs={["Aegis Guardian", "Compliance"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Compliance Management</h1>
            <p className="text-muted-foreground">
              Apply and manage policy group deployments across your infrastructure
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Policy Groups</p>
                  <p className="text-2xl font-bold">4</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Monitor className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Managed Systems</p>
                  <p className="text-2xl font-bold">18</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-emerald-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Active Deployments</p>
                  <p className="text-2xl font-bold">{deploymentHistory.filter(d => d.status === 'in-progress').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Compliance Rate</p>
                  <p className="text-2xl font-bold">94%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="deploy" className="space-y-4">
          <TabsList>
            <TabsTrigger value="deploy">Policy Deployment</TabsTrigger>
            <TabsTrigger value="history">Deployment History</TabsTrigger>
            <TabsTrigger value="monitoring">Compliance Monitoring</TabsTrigger>
          </TabsList>

          {/* Policy Deployment Tab */}
          <TabsContent value="deploy" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Policy Group Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Select Policy Group
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {policyGroups.map((group) => (
                      <div
                        key={group.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedPolicyGroup === group.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedPolicyGroup(group.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{group.name}</h4>
                            <p className="text-sm text-muted-foreground">{group.description}</p>
                            <div className="flex gap-2 mt-2">
                              <Badge variant="outline">
                                {group.platform === "windows" ? <Monitor className="h-3 w-3 mr-1" /> : <Server className="h-3 w-3 mr-1" />}
                                {group.platform}
                              </Badge>
                              <Badge variant="outline">{group.policies} policies</Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Updated</p>
                            <p className="text-sm font-medium">{group.lastUpdated}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* System Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Select Target Systems
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Filters */}
                  <div className="grid grid-cols-2 gap-2">
                    <Select value={filterPlatform} onValueChange={setFilterPlatform}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Platforms</SelectItem>
                        <SelectItem value="windows">Windows</SelectItem>
                        <SelectItem value="linux">Linux</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        {departments.map(dept => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search systems..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* Select All */}
                  <div className="flex items-center space-x-2 p-2 border rounded">
                    <Checkbox
                      id="select-all"
                      checked={selectedSystems.length === filteredSystems.length && filteredSystems.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                    <Label htmlFor="select-all" className="text-sm font-medium">
                      Select All ({filteredSystems.length} systems)
                    </Label>
                  </div>

                  {/* Systems List */}
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {filteredSystems.map((system) => (
                      <div key={system.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                        <Checkbox
                          id={system.id}
                          checked={selectedSystems.includes(system.id)}
                          onCheckedChange={(checked) => handleSystemSelection(system.id, checked as boolean)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Label htmlFor={system.id} className="font-medium">{system.hostname}</Label>
                            <Badge variant={system.status === "online" ? "default" : "secondary"} className="text-xs">
                              {system.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{system.ip} • {system.department}</p>
                        </div>
                        {system.platform === "windows" ? <Monitor className="h-4 w-4" /> : <Server className="h-4 w-4" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Deployment Summary & Action */}
            {selectedPolicyGroup && selectedSystems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Deployment Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Policy Group</h4>
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                        <p className="font-medium">{selectedPolicyGroupData?.name}</p>
                        <p className="text-sm text-muted-foreground">{selectedPolicyGroupData?.policies} policies</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Target Systems ({selectedSystems.length})</h4>
                      <div className="p-3 bg-green-50 border border-green-200 rounded max-h-24 overflow-y-auto">
                        {selectedSystemsData.map(sys => (
                          <p key={sys.id} className="text-sm">{sys.hostname} ({sys.ip})</p>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Dialog open={showDeployDialog} onOpenChange={setShowDeployDialog}>
                      <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          <Play className="h-4 w-4 mr-2" />
                          Deploy Policy Group
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Confirm Policy Deployment</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                              This will apply {selectedPolicyGroupData?.policies} policies to {selectedSystems.length} systems.
                              This action cannot be undone.
                            </AlertDescription>
                          </Alert>
                          
                          <div className="space-y-2">
                            <Label htmlFor="notes">Deployment Notes (Optional)</Label>
                            <Textarea
                              id="notes"
                              placeholder="Add notes about this deployment..."
                              value={deploymentNotes}
                              onChange={(e) => setDeploymentNotes(e.target.value)}
                            />
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="schedule"
                              checked={scheduleDeployment}
                              onCheckedChange={(checked) => setScheduleDeployment(checked as boolean)}
                            />
                            <Label htmlFor="schedule">Schedule deployment</Label>
                          </div>

                          {scheduleDeployment && (
                            <div className="space-y-2">
                              <Label htmlFor="scheduled-time">Scheduled Time</Label>
                              <Input
                                id="scheduled-time"
                                type="datetime-local"
                                value={scheduledTime}
                                onChange={(e) => setScheduledTime(e.target.value)}
                              />
                            </div>
                          )}

                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setShowDeployDialog(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleDeploy} className="bg-blue-600 hover:bg-blue-700">
                              {scheduleDeployment ? "Schedule Deployment" : "Deploy Now"}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Deployment History Tab */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Deployment History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Deployment ID</TableHead>
                      <TableHead>Policy Group</TableHead>
                      <TableHead>Target Systems</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Start Time</TableHead>
                      <TableHead>Success/Failed</TableHead>
                      <TableHead>Initiated By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deploymentHistory.map((deployment) => (
                      <TableRow key={deployment.id}>
                        <TableCell className="font-medium">{deployment.id}</TableCell>
                        <TableCell>{deployment.policyGroup}</TableCell>
                        <TableCell>{deployment.targetSystems.length} systems</TableCell>
                        <TableCell>{getStatusBadge(deployment.status)}</TableCell>
                        <TableCell>{deployment.startTime}</TableCell>
                        <TableCell>
                          <span className="text-green-600">{deployment.success}</span>
                          {deployment.failed > 0 && (
                            <>
                              {" / "}
                              <span className="text-red-600">{deployment.failed}</span>
                            </>
                          )}
                        </TableCell>
                        <TableCell>{deployment.initiatedBy}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compliance Monitoring Tab */}
          <TabsContent value="monitoring">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Overall Compliance Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Windows Systems</span>
                        <span>92%</span>
                      </div>
                      <Progress value={92} className="mt-1" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Linux Systems</span>
                        <span>97%</span>
                      </div>
                      <Progress value={97} className="mt-1" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Overall Compliance</span>
                        <span>94%</span>
                      </div>
                      <Progress value={94} className="mt-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Compliance Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {systems.map((system) => (
                      <div key={system.id} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <p className="font-medium">{system.hostname}</p>
                          <p className="text-sm text-muted-foreground">{system.department}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={Math.random() > 0.2 ? "default" : "destructive"}>
                            {Math.random() > 0.2 ? "Compliant" : "Non-compliant"}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {Math.floor(Math.random() * 20 + 80)}% compliant
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}