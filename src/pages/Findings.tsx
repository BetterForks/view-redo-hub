import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, RefreshCw, MoreVertical, ChevronDown, X, RotateCw, CheckCircle } from "lucide-react";

const vulnerabilities = [
  { name: "water-plant-01", ip: "192.168...", severity: "High", plugin: "MS16-146: Security U...", vpr: "8.9", cvss: "8.8", state: "Active", aes: "630" },
  { name: "al-win10-fo", ip: "192.168...", severity: "High", plugin: "KB4565351: Windows...", vpr: "8.9", cvss: "8.8", state: "Active", aes: "619" },
  { name: "sharepoint2016", ip: "192.168...", severity: "Critical", plugin: "KB4598243: Windows...", vpr: "8.9", cvss: "9.8", state: "Active", aes: "831" },
  { name: "win2008", ip: "10.1.20.7", severity: "High", plugin: "MS11-038: Vulnerabili...", vpr: "8.9", cvss: "", state: "Active", aes: "704" },
  { name: "chris", ip: "192.168...", severity: "High", plugin: "MS16-099: Security U...", vpr: "8.9", cvss: "7.8", state: "Active", aes: "626" },
  { name: "labuser-cent7-...", ip: "192.168...", severity: "High", plugin: "CentOS 7 : kernel (R...", vpr: "8.9", cvss: "7.8", state: "Active", aes: "615" },
  { name: "seth", ip: "192.168...", severity: "High", plugin: "Security Updates for ...", vpr: "8.9", cvss: "7.8", state: "Resurf...", aes: "702" },
  { name: "windows2012", ip: "192.168...", severity: "High", plugin: "MS14-010: Cumulativ...", vpr: "8.9", cvss: "", state: "Active", aes: "891" },
];

export default function Findings() {
  return (
    <AppLayout title="Findings" breadcrumbs={["Findings"]}>
      <div className="space-y-6">
        <Tabs defaultValue="vulnerabilities" className="w-full">
          <TabsList>
            <TabsTrigger value="vulnerabilities">Vulnerabilities</TabsTrigger>
            <TabsTrigger value="cloud">Cloud Misconfigurations</TabsTrigger>
            <TabsTrigger value="host">Host Audits</TabsTrigger>
            <TabsTrigger value="web">Web Application Findings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="vulnerabilities" className="space-y-4">
            {/* Filter Bar */}
            <div className="bg-card rounded-lg border p-4 space-y-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">Advanced</Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Saved Filters <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Critical Vulnerabilities</DropdownMenuItem>
                    <DropdownMenuItem>High Priority</DropdownMenuItem>
                    <DropdownMenuItem>Active Assets</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <div className="flex-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="secondary" className="bg-low/20 text-low flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                  </Badge>
                  <span className="text-xs">VPR is less than or equal to 8.9 AND VPR is greater than or equal to 7 AND Risk Modified is not equal to Accepted AND Severity is not equal to Info AND State is equal to Active, Resurfaced, New</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button size="sm">Apply</Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <RotateCw className="h-4 w-4 mr-2" /> AI Inventory
                </Button>
                <span className="text-sm text-muted-foreground">Group By</span>
                <Button variant="outline" size="sm">None</Button>
                <Button variant="outline" size="sm">Asset</Button>
                <Button variant="outline" size="sm">Plugin</Button>
              </div>
            </div>
            
            {/* Table Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox />
                <span className="text-sm font-medium">6,424 Vulnerabilities</span>
                <Button variant="ghost" size="sm" className="text-primary">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Fetched At: 10:40 AM</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      Grid: Basic View <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Basic View</DropdownMenuItem>
                    <DropdownMenuItem>Detailed View</DropdownMenuItem>
                    <DropdownMenuItem>Compact View</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      Columns <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Show All</DropdownMenuItem>
                    <DropdownMenuItem>Hide Some</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <span>1 to 50 of 6424</span>
                <span>Page 1 of 129</span>
              </div>
            </div>
            
            {/* Data Table */}
            <div className="bg-card rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox />
                    </TableHead>
                    <TableHead>Asset Name</TableHead>
                    <TableHead>IPv4 Ad...</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Plugin Name</TableHead>
                    <TableHead>VPR ↓</TableHead>
                    <TableHead>CVSSV...</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>Scan...</TableHead>
                    <TableHead>Asset...</TableHead>
                    <TableHead>ACR</TableHead>
                    <TableHead>AES</TableHead>
                    <TableHead>Last S...</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vulnerabilities.map((vuln, index) => (
                    <TableRow key={index} className="hover:bg-muted/50">
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell className="font-medium">{vuln.name}</TableCell>
                      <TableCell className="text-muted-foreground">{vuln.ip}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={
                            vuln.severity === "Critical" 
                              ? "border-critical text-critical" 
                              : "border-high text-high"
                          }
                        >
                          {vuln.severity}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{vuln.plugin}</TableCell>
                      <TableCell>{vuln.vpr}</TableCell>
                      <TableCell>{vuln.cvss}</TableCell>
                      <TableCell>{vuln.state}</TableCell>
                      <TableCell className="text-muted-foreground">Tenabl...</TableCell>
                      <TableCell className="text-muted-foreground">M...</TableCell>
                      <TableCell>4</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-high text-high">
                          {vuln.aes}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">03/25/...</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Accept Risk</DropdownMenuItem>
                            <DropdownMenuItem>Create Ticket</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
