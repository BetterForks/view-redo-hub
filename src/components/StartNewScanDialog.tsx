import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Building2, 
  Server, 
  Monitor, 
  Database, 
  Globe, 
  Shield, 
  MapPin,
  Users,
  Clock,
  Target,
  CheckCircle,
  AlertTriangle,
  XCircle
} from "lucide-react";

interface System {
  id: string;
  name: string;
  type: string;
  status: 'compliant' | 'warning' | 'critical';
  ip: string;
  os: string;
  location?: string;
  owner?: string;
  environment?: string;
  lastScan?: string;
}

interface Location {
  name: string;
  region: string;
  systems: System[];
}

interface StartNewScanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locations?: Record<string, Location>;
  onStartScan?: (config: ScanConfig) => void;
}

interface ScanConfig {
  name: string;
  scanType: string;
  priority: string;
  schedule: string;
  selectedSystems: string[];
  selectedLocations: string[];
  scanProfile: string;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'compliant':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case 'critical':
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return <Shield className="h-4 w-4 text-gray-500" />;
  }
};

const getSystemTypeIcon = (type: string) => {
  switch (type) {
    case 'web-server':
      return <Globe className="h-4 w-4" />;
    case 'database':
      return <Database className="h-4 w-4" />;
    case 'application':
      return <Server className="h-4 w-4" />;
    case 'workstation':
      return <Monitor className="h-4 w-4" />;
    case 'load-balancer':
      return <Server className="h-4 w-4" />;
    default:
      return <Server className="h-4 w-4" />;
  }
};

export function StartNewScanDialog({ open, onOpenChange, locations = {}, onStartScan }: StartNewScanDialogProps) {
  const [scanConfig, setScanConfig] = useState<ScanConfig>({
    name: '',
    scanType: 'compliance',
    priority: 'medium',
    schedule: 'immediate',
    selectedSystems: [],
    selectedLocations: [],
    scanProfile: 'full'
  });

  const [activeTab, setActiveTab] = useState('targets');

  const handleSystemToggle = (systemId: string, checked: boolean) => {
    setScanConfig(prev => ({
      ...prev,
      selectedSystems: checked 
        ? [...prev.selectedSystems, systemId]
        : prev.selectedSystems.filter(id => id !== systemId)
    }));
  };

  const handleLocationToggle = (locationKey: string, checked: boolean) => {
    setScanConfig(prev => {
      if (checked) {
        // Add location and all its systems
        const locationSystems = locations[locationKey]?.systems.map(s => s.id) || [];
        const newSystems = [...new Set([...prev.selectedSystems, ...locationSystems])];
        return {
          ...prev,
          selectedLocations: [...prev.selectedLocations, locationKey],
          selectedSystems: newSystems
        };
      } else {
        // Remove location and its systems
        const locationSystems = locations[locationKey]?.systems.map(s => s.id) || [];
        return {
          ...prev,
          selectedLocations: prev.selectedLocations.filter(loc => loc !== locationKey),
          selectedSystems: prev.selectedSystems.filter(id => !locationSystems.includes(id))
        };
      }
    });
  };

  const handleStartScan = () => {
    if (onStartScan) {
      onStartScan(scanConfig);
    }
    onOpenChange(false);
    // Reset form
    setScanConfig({
      name: '',
      scanType: 'compliance',
      priority: 'medium',
      schedule: 'immediate',
      selectedSystems: [],
      selectedLocations: [],
      scanProfile: 'full'
    });
  };

  const getTotalSystemsCount = () => {
    return Object.values(locations).reduce((total, location) => total + location.systems.length, 0);
  };

  const getSelectedSystemsInfo = () => {
    const systems = Object.values(locations).flatMap(loc => loc.systems);
    const selected = systems.filter(sys => scanConfig.selectedSystems.includes(sys.id));
    
    const statusCounts = selected.reduce((acc, sys) => {
      acc[sys.status] = (acc[sys.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { count: selected.length, statusCounts };
  };

  const selectedInfo = getSelectedSystemsInfo();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Start New Compliance Scan
          </DialogTitle>
          <DialogDescription>
            Configure and launch a new compliance scan across your infrastructure nodes and systems.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="targets">Select Targets</TabsTrigger>
            <TabsTrigger value="config">Scan Configuration</TabsTrigger>
            <TabsTrigger value="review">Review & Launch</TabsTrigger>
          </TabsList>

          <TabsContent value="targets" className="space-y-4">
            <div className="grid grid-cols-2 gap-4 h-[400px]">
              {/* Locations Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Locations ({Object.keys(locations).length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-3">
                      {Object.entries(locations).map(([key, location]) => (
                        <div key={key} className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`location-${key}`}
                              checked={scanConfig.selectedLocations.includes(key)}
                              onCheckedChange={(checked) => handleLocationToggle(key, checked as boolean)}
                            />
                            <Label htmlFor={`location-${key}`} className="flex items-center gap-2 cursor-pointer">
                              <MapPin className="h-4 w-4" />
                              <div>
                                <div className="font-medium">{location.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {location.systems.length} systems • {location.region}
                                </div>
                              </div>
                            </Label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Systems Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Server className="h-4 w-4" />
                    Systems ({getTotalSystemsCount()})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-3">
                      {Object.entries(locations).map(([locationKey, location]) => (
                        <div key={locationKey} className="space-y-2">
                          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            {location.name}
                          </div>
                          {location.systems.map((system) => (
                            <div key={system.id} className="flex items-center space-x-2 pl-4">
                              <Checkbox
                                id={`system-${system.id}`}
                                checked={scanConfig.selectedSystems.includes(system.id)}
                                onCheckedChange={(checked) => handleSystemToggle(system.id, checked as boolean)}
                              />
                              <Label htmlFor={`system-${system.id}`} className="flex items-center gap-2 cursor-pointer flex-1">
                                {getSystemTypeIcon(system.type)}
                                <div className="flex-1">
                                  <div className="font-medium text-sm">{system.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {system.ip} • {system.os}
                                  </div>
                                </div>
                                {getStatusIcon(system.status)}
                              </Label>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="config" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="scan-name">Scan Name</Label>
                  <Input
                    id="scan-name"
                    placeholder="e.g., Weekly Compliance Check"
                    value={scanConfig.name}
                    onChange={(e) => setScanConfig(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="scan-type">Scan Type</Label>
                  <Select
                    value={scanConfig.scanType}
                    onValueChange={(value) => setScanConfig(prev => ({ ...prev, scanType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compliance">Compliance Scan</SelectItem>
                      <SelectItem value="vulnerability">Vulnerability Assessment</SelectItem>
                      <SelectItem value="configuration">Configuration Audit</SelectItem>
                      <SelectItem value="security">Security Baseline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={scanConfig.priority}
                    onValueChange={(value) => setScanConfig(prev => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="schedule">Schedule</Label>
                  <Select
                    value={scanConfig.schedule}
                    onValueChange={(value) => setScanConfig(prev => ({ ...prev, schedule: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Start Immediately</SelectItem>
                      <SelectItem value="scheduled">Schedule for Later</SelectItem>
                      <SelectItem value="recurring">Recurring Scan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="profile">Scan Profile</Label>
                  <Select
                    value={scanConfig.scanProfile}
                    onValueChange={(value) => setScanConfig(prev => ({ ...prev, scanProfile: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quick">Quick Scan (5-10 mins)</SelectItem>
                      <SelectItem value="standard">Standard Scan (15-30 mins)</SelectItem>
                      <SelectItem value="full">Full Scan (30-60 mins)</SelectItem>
                      <SelectItem value="deep">Deep Scan (1-2 hours)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="review" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Scan Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Name:</span>
                    <span className="text-sm font-medium">{scanConfig.name || 'Untitled Scan'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Type:</span>
                    <span className="text-sm font-medium capitalize">{scanConfig.scanType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Priority:</span>
                    <Badge variant={scanConfig.priority === 'critical' ? 'destructive' : 'secondary'}>
                      {scanConfig.priority}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Schedule:</span>
                    <span className="text-sm font-medium capitalize">{scanConfig.schedule}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Profile:</span>
                    <span className="text-sm font-medium capitalize">{scanConfig.scanProfile}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Selected Targets</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Locations:</span>
                    <span className="text-sm font-medium">{scanConfig.selectedLocations.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Systems:</span>
                    <span className="text-sm font-medium">{selectedInfo.count}</span>
                  </div>
                  <div className="pt-2 space-y-1">
                    <div className="text-xs text-muted-foreground">System Status:</div>
                    <div className="flex gap-2 text-xs">
                      {selectedInfo.statusCounts.compliant && (
                        <Badge variant="secondary" className="text-green-600">
                          {selectedInfo.statusCounts.compliant} Compliant
                        </Badge>
                      )}
                      {selectedInfo.statusCounts.warning && (
                        <Badge variant="secondary" className="text-yellow-600">
                          {selectedInfo.statusCounts.warning} Warning
                        </Badge>
                      )}
                      {selectedInfo.statusCounts.critical && (
                        <Badge variant="destructive">
                          {selectedInfo.statusCounts.critical} Critical
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Estimated Scan Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">{selectedInfo.count}</div>
                    <div className="text-xs text-muted-foreground">Target Systems</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {scanConfig.scanProfile === 'quick' ? '5-10' : 
                       scanConfig.scanProfile === 'standard' ? '15-30' :
                       scanConfig.scanProfile === 'full' ? '30-60' : '60-120'}
                    </div>
                    <div className="text-xs text-muted-foreground">Minutes (Est.)</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-xs text-muted-foreground">Start Time</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{selectedInfo.count} systems selected</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleStartScan}
              disabled={selectedInfo.count === 0 || !scanConfig.name.trim()}
            >
              Start Scan
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}