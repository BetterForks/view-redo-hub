import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, MoreVertical, Info } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const severityData = [
  { name: "Exploited by Malware", value: 5700, color: "hsl(var(--chart-1))" },
  { name: "Remotely Exploitable (Low Complexity)", value: 5300, color: "hsl(var(--chart-2))" },
  { name: "Locally Exploitable (Low Complexity)", value: 2400, color: "hsl(var(--info))" },
  { name: "Exploited by Framework (Metasploit)", value: 2100, color: "hsl(var(--chart-4))" },
  { name: "Remotely Exploitable (High Complexity)", value: 600, color: "hsl(var(--high))" },
];

const scanHealthData = [
  { name: "Authentication Success", value: 70, color: "hsl(var(--chart-1))" },
  { name: "Success but Insufficient Access", value: 15, color: "hsl(var(--chart-2))" },
  { name: "Success but Intermittent Failure", value: 10, color: "hsl(var(--chart-2))" },
  { name: "No Credentials Provided", value: 5, color: "hsl(var(--chart-4))" },
];

export default function Overview() {
  return (
    <AppLayout title="Vulnerability Management Overview (Explore)" breadcrumbs={["Vulnerability Management Overview"]}>
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Cyber Exposure News Feed <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Latest Updates</DropdownMenuItem>
              <DropdownMenuItem>Critical Alerts</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Jump to Dashboard <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Main Dashboard</DropdownMenuItem>
                <DropdownMenuItem>Security Dashboard</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="outline">Dashboards</Button>
            <Button variant="outline">Export <ChevronDown className="ml-2 h-4 w-4" /></Button>
          </div>
        </div>
        
        {/* First Row */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">Severity Statistics by Source</CardTitle>
                <Info className="h-4 w-4 text-muted-foreground" />
              </div>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2 text-center">
                  <p className="text-sm text-muted-foreground">Discovered by Nessus</p>
                  <p className="text-sm font-medium">Severity</p>
                  <p className="text-5xl font-light text-muted-foreground mt-4">46.5K</p>
                  <p className="text-sm text-critical">7.9K Critical</p>
                  <p className="text-sm text-high">26K High</p>
                </div>
                
                <div className="space-y-2 text-center">
                  <p className="text-sm text-muted-foreground">Discovered by Tenable Agent</p>
                  <p className="text-sm font-medium">Severity</p>
                  <p className="text-5xl font-light text-muted-foreground mt-4">677</p>
                  <p className="text-sm text-critical">117 Critical</p>
                  <p className="text-sm text-high">370 High</p>
                </div>
                
                <div className="space-y-2 text-center">
                  <p className="text-sm text-muted-foreground">Continuous Assessment</p>
                  <p className="text-sm font-medium">Severity</p>
                  <p className="text-5xl font-light text-muted-foreground mt-4">0</p>
                  <p className="text-sm text-critical">0 Critical</p>
                  <p className="text-sm text-high">0 High</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">Tenable Research Advisory</CardTitle>
                <Info className="h-4 w-4 text-muted-foreground" />
              </div>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 h-[200px]">
                <div className="flex items-center justify-center border-2 border-dashed rounded-lg">
                  <div className="text-center space-y-2">
                    <p className="text-lg font-medium">Missing Patches</p>
                  </div>
                </div>
                <div className="flex items-center justify-center border-2 border-dashed rounded-lg">
                  <div className="text-center space-y-2">
                    <p className="text-lg font-medium">Applied Patches</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Second Row */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">Vulnerability Priority Rating (VPR)</CardTitle>
                <Info className="h-4 w-4 text-muted-foreground" />
              </div>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 text-sm">
                <span className="text-critical font-medium">Rating 9.0-10</span>
                <span className="text-high font-medium">Rating 7.0-8.9</span>
                <span className="text-medium font-medium">Rating 4.0-6.9</span>
                <span className="text-low font-medium">Rating 0-3.9</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">SLA Progress: Vulnerability Age</CardTitle>
                <Info className="h-4 w-4 text-muted-foreground" />
              </div>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2"></th>
                      <th className="bg-critical/20 text-center py-2 px-2">Not Meeting SLAs</th>
                      <th className="bg-low/20 text-center py-2 px-2">Meeting SLAs</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 font-medium">Critical</td>
                      <td className="bg-critical/20 text-center py-2">4.3K</td>
                      <td className="bg-low/20 text-center py-2">8</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Third Row */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">Critical and High Exploitable Vulnerabilities</CardTitle>
                <Info className="h-4 w-4 text-muted-foreground" />
              </div>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={severityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--chart-1))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">Future Threats: Not Yet Exploitable Vulnerabilities</CardTitle>
                <Info className="h-4 w-4 text-muted-foreground" />
              </div>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2"></th>
                      <th className="text-center py-2">Published 0-30 Days Ago</th>
                      <th className="text-center py-2">Published 31-90 Days Ago</th>
                      <th className="text-center py-2">Published 91-180 Days Ago</th>
                      <th className="text-center py-2">Published 180+ Days Ago</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 font-medium">Proof of Concept</td>
                      <td className="text-center py-2">0</td>
                      <td className="text-center py-2">2</td>
                      <td className="text-center py-2">6</td>
                      <td className="text-center py-2">13K</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium">Unproven Exploit</td>
                      <td className="text-center py-2">2</td>
                      <td className="text-center py-2">114</td>
                      <td className="text-center py-2">149</td>
                      <td className="text-center py-2">19.2K</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Fourth Row */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">Scan Health</CardTitle>
                <Info className="h-4 w-4 text-muted-foreground" />
              </div>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={scanHealthData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {scanHealthData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">Vulnerability Age: Managing SLAs</CardTitle>
                <Info className="h-4 w-4 text-muted-foreground" />
              </div>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2"></th>
                      <th className="text-center py-2">90+ Days</th>
                      <th className="text-center py-2">61-90 Days</th>
                      <th className="text-center py-2">31-60 Days</th>
                      <th className="text-center py-2">15-30 Days</th>
                      <th className="text-center py-2">8-14 Days</th>
                      <th className="text-center py-2">0-7 Days</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b bg-critical/10">
                      <td className="py-2 font-medium">Critical</td>
                      <td className="text-center py-2">8K</td>
                      <td className="text-center py-2">8</td>
                      <td className="text-center py-2">6</td>
                      <td className="text-center py-2">14</td>
                      <td className="text-center py-2">0</td>
                      <td className="text-center py-2">17</td>
                    </tr>
                    <tr className="border-b bg-high/10">
                      <td className="py-2 font-medium">High</td>
                      <td className="text-center py-2">26K</td>
                      <td className="text-center py-2">74</td>
                      <td className="text-center py-2">83</td>
                      <td className="text-center py-2">119</td>
                      <td className="text-center py-2">60</td>
                      <td className="text-center py-2">89</td>
                    </tr>
                    <tr className="border-b bg-medium/10">
                      <td className="py-2 font-medium">Medium</td>
                      <td className="text-center py-2">12.7K</td>
                      <td className="text-center py-2">33</td>
                      <td className="text-center py-2">24</td>
                      <td className="text-center py-2">51</td>
                      <td className="text-center py-2">0</td>
                      <td className="text-center py-2">20</td>
                    </tr>
                    <tr className="bg-low/10">
                      <td className="py-2 font-medium">Low</td>
                      <td className="text-center py-2">1.9K</td>
                      <td className="text-center py-2">9</td>
                      <td className="text-center py-2">4</td>
                      <td className="text-center py-2">7</td>
                      <td className="text-center py-2">0</td>
                      <td className="text-center py-2">3</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
