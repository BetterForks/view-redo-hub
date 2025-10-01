import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, LayoutGrid, List } from "lucide-react";
import { useState } from "react";

const templates = [
  {
    title: "Guardian Research Advisories: Urgent Action (Explore)",
    updated: "3/25/2025",
    tag: "NEW",
    preview: "Research advisory dashboard with missing and applied patches tracking"
  },
  {
    title: "Defending Against Ransomware (ACT) (Explore)",
    updated: "3/17/2025",
    tag: "NEW",
    preview: "Ransomware defense metrics and vulnerability tracking"
  },
  {
    title: "PCI Scan Monitoring (Explore)",
    updated: "3/17/2025",
    tag: "NEW",
    preview: "PCI compliance scan monitoring and reporting"
  },
  {
    title: "PCI Access Control (Explore)",
    updated: "3/17/2025",
    tag: "NEW",
    preview: "Access control metrics for PCI compliance"
  },
];

const groups = [
  { name: "All", count: null },
  { name: "New and Updated", count: 28 },
  { name: "Vulnerability Management", count: null },
  { name: "Web Application Scanning", count: null },
  { name: "Host Audit", count: null },
  { name: "Center for Internet Security", count: null },
  { name: "Compliance Framework", count: null },
  { name: "DISA STIG", count: null },
  { name: "Host Audit Plugin Type", count: null },
  { name: "Guardian Best Practice Audits", count: null },
  { name: "Vendor Based Audits", count: null },
];

export default function Templates() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  return (
    <AppLayout title="Template Library" breadcrumbs={["Dashboards", "Template Library"]}>
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <select className="px-3 py-2 border rounded-lg text-sm">
              <option>Latest</option>
              <option>Most Popular</option>
              <option>Recently Used</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Dashboard
            </Button>
            <Button variant="outline">Widget Library</Button>
          </div>
        </div>
        
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 space-y-2">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search Templates" className="pl-10" />
            </div>
            
            <div className="space-y-1">
              <h3 className="font-semibold mb-2">Groups</h3>
              {groups.map((group) => (
                <Button
                  key={group.name}
                  variant="ghost"
                  className="w-full justify-start text-sm"
                >
                  {group.name}
                  {group.count && (
                    <span className="ml-auto text-muted-foreground">({group.count})</span>
                  )}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">All</h2>
                <span className="text-muted-foreground">63 Templates</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  Grid
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  List
                </Button>
                <span className="text-sm text-muted-foreground ml-4">Page 1 of 4</span>
              </div>
            </div>
            
            <div className={viewMode === "grid" ? "grid gap-4 md:grid-cols-2" : "space-y-4"}>
              {templates.map((template, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base leading-tight">{template.title}</CardTitle>
                      {template.tag && (
                        <Badge variant="secondary" className="ml-2 bg-info/10 text-info">
                          {template.tag}
                        </Badge>
                      )}
                    </div>
                    <CardDescription>Updated {template.updated}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 p-4">
                        <div className="grid grid-cols-3 gap-2 h-full">
                          <div className="bg-critical/20 rounded flex items-center justify-center text-xs">
                            Missing Patches
                          </div>
                          <div className="bg-low/20 rounded flex items-center justify-center text-xs">
                            Applied Patches
                          </div>
                          <div className="bg-critical/20 rounded flex items-center justify-center text-xs">
                            Missing Patches
                          </div>
                          <div className="bg-high/20 rounded flex items-center justify-center text-xs col-span-2">
                            Data Table
                          </div>
                          <div className="bg-info/20 rounded flex items-center justify-center text-xs">
                            Chart
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{template.preview}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
