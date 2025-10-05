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
  FileText,
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
}

interface Location {
  name: string;
  region: string;
  systems: System[];
}

interface GenerateReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locations?: Record<string, Location>;
  onGenerateReport?: (config: ReportConfig) => void;
}

interface ReportConfig {
  name: string;
  reportType: string;
  format: string;
  selectedSystems: string[];
  selectedLocations: string[];
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

export function GenerateReportDialog({ open, onOpenChange, locations = {}, onGenerateReport }: GenerateReportDialogProps) {
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    name: '',
    reportType: 'compliance',
    format: 'pdf',
    selectedSystems: [],
    selectedLocations: [],
  });

  const [activeTab, setActiveTab] = useState('targets');

  const handleSystemToggle = (systemId: string, checked: boolean) => {
    setReportConfig(prev => ({
      ...prev,
      selectedSystems: checked 
        ? [...prev.selectedSystems, systemId]
        : prev.selectedSystems.filter(id => id !== systemId)
    }));
  };

  const handleLocationToggle = (locationKey: string, checked: boolean) => {
    setReportConfig(prev => {
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

  const handleGenerateReport = () => {
    if (onGenerateReport) {
      onGenerateReport(reportConfig);
    }
    onOpenChange(false);
    // Reset form
    setReportConfig({
      name: '',
      reportType: 'compliance',
      format: 'pdf',
      selectedSystems: [],
      selectedLocations: [],
    });
  };

  const getTotalSystemsCount = () => {
    return Object.values(locations).reduce((total, location) => total + location.systems.length, 0);
  };

  const getSelectedSystemsInfo = () => {
    const systems = Object.values(locations).flatMap(loc => loc.systems);
    const selected = systems.filter(sys => reportConfig.selectedSystems.includes(sys.id));
    
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
            <FileText className="h-5 w-5" />
            Generate Report
          </DialogTitle>
          <DialogDescription>
            Select target systems and configure report settings to generate a compliance report.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="targets">Select Targets</TabsTrigger>
            <TabsTrigger value="config">Report Configuration</TabsTrigger>
            <TabsTrigger value="review">Review & Generate</TabsTrigger>
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
                              checked={reportConfig.selectedLocations.includes(key)}
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
                          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                            {location.name}
                          </div>
                          {location.systems.map((system) => (
                            <div key={system.id} className="flex items-center space-x-2 ml-4">
                              <Checkbox
                                id={`system-${system.id}`}
                                checked={reportConfig.selectedSystems.includes(system.id)}
                                onCheckedChange={(checked) => handleSystemToggle(system.id, checked as boolean)}
                              />
                              <Label htmlFor={`system-${system.id}`} className="flex items-center gap-2 cursor-pointer flex-1">
                                {getSystemTypeIcon(system.type)}
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-sm">{system.name}</span>
                                    {getStatusIcon(system.status)}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {system.ip} • {system.os}
                                  </div>
                                </div>
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

            {/* Selection Summary */}
            {reportConfig.selectedSystems.length > 0 && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-sm">Selected: {selectedInfo.count} systems</span>
                    </div>
                    <div className="flex gap-3 text-xs">
                      {selectedInfo.statusCounts.compliant && (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span>{selectedInfo.statusCounts.compliant} Compliant</span>
                        </div>
                      )}
                      {selectedInfo.statusCounts.warning && (
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3 text-yellow-500" />
                          <span>{selectedInfo.statusCounts.warning} Warning</span>
                        </div>
                      )}
                      {selectedInfo.statusCounts.critical && (
                        <div className="flex items-center gap-1">
                          <XCircle className="h-3 w-3 text-red-500" />
                          <span>{selectedInfo.statusCounts.critical} Critical</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="config" className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="report-name">Report Name</Label>
                <Input
                  id="report-name"
                  placeholder="e.g., Monthly Compliance Report"
                  value={reportConfig.name}
                  onChange={(e) => setReportConfig(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="report-type">Report Type</Label>
                <Select value={reportConfig.reportType} onValueChange={(value) => setReportConfig(prev => ({ ...prev, reportType: value }))}>
                  <SelectTrigger id="report-type">
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compliance">Compliance Report</SelectItem>
                    <SelectItem value="vulnerability">Vulnerability Assessment</SelectItem>
                    <SelectItem value="policy">Policy Enforcement</SelectItem>
                    <SelectItem value="asset">Asset Inventory</SelectItem>
                    <SelectItem value="scan">Scan Results</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="format">Output Format</Label>
                <Select value={reportConfig.format} onValueChange={(value) => setReportConfig(prev => ({ ...prev, format: value }))}>
                  <SelectTrigger id="format">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel (XLSX)</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="html">HTML</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="review" className="space-y-4">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Report Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Report Name</div>
                      <div className="font-medium">{reportConfig.name || 'Untitled Report'}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Report Type</div>
                      <div className="font-medium capitalize">{reportConfig.reportType}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Output Format</div>
                      <div className="font-medium uppercase">{reportConfig.format}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Target Systems</div>
                      <div className="font-medium">{reportConfig.selectedSystems.length} systems</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Selected Systems</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-2">
                      {Object.entries(locations).map(([locationKey, location]) => {
                        const selectedLocationSystems = location.systems.filter(sys => 
                          reportConfig.selectedSystems.includes(sys.id)
                        );
                        
                        if (selectedLocationSystems.length === 0) return null;
                        
                        return (
                          <div key={locationKey} className="space-y-1">
                            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                              {location.name}
                            </div>
                            {selectedLocationSystems.map((system) => (
                              <div key={system.id} className="flex items-center gap-2 ml-4 text-sm">
                                {getSystemTypeIcon(system.type)}
                                <span>{system.name}</span>
                                <span className="text-muted-foreground text-xs">({system.ip})</span>
                                {getStatusIcon(system.status)}
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {activeTab === 'targets' && `${reportConfig.selectedSystems.length} systems selected`}
            {activeTab === 'config' && 'Configure report settings'}
            {activeTab === 'review' && 'Review and generate report'}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            {activeTab === 'targets' && (
              <Button onClick={() => setActiveTab('config')} disabled={reportConfig.selectedSystems.length === 0}>
                Next: Configuration
              </Button>
            )}
            {activeTab === 'config' && (
              <Button onClick={() => setActiveTab('review')}>
                Next: Review
              </Button>
            )}
            {activeTab === 'review' && (
              <Button onClick={handleGenerateReport} disabled={reportConfig.selectedSystems.length === 0}>
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
