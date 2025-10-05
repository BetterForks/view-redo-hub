import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Settings as SettingsIcon, Shield, Bell, Database, GitBranch, Users } from "lucide-react";

export default function Settings() {
  return (
    <AppLayout title="Settings" breadcrumbs={["Settings"]}>
      <div className="space-y-6">
        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="integration">Integration</TabsTrigger>
            <TabsTrigger value="rollback">Rollback</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure basic platform settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="platform-name">Platform Name</Label>
                  <Input id="platform-name" defaultValue="Aegis Guardian" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-name">Organization Name</Label>
                  <Input id="org-name" placeholder="Your organization" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Primary Contact Email</Label>
                  <Input id="contact-email" type="email" placeholder="security-team@company.com" />
                </div>
                <div className="flex items-center justify-between pt-4">
                  <div className="space-y-0.5">
                    <Label>Auto-Save Settings</Label>
                    <p className="text-sm text-muted-foreground">Automatically save configuration changes</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Guardian Version</span>
                  <span className="font-semibold">v2.5.1</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Policy Database Version</span>
                  <span className="font-semibold">2025.09.30</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Managed Systems</span>
                  <span className="font-semibold">387</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Active Policies</span>
                  <span className="font-semibold">387</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Configuration</CardTitle>
                <CardDescription>Manage security and authentication settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Require 2FA for admin access</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Session Timeout</Label>
                    <p className="text-sm text-muted-foreground">Auto-logout after inactivity</p>
                  </div>
                  <select className="px-3 py-2 border rounded-lg text-sm">
                    <option>15 minutes</option>
                    <option>30 minutes</option>
                    <option>1 hour</option>
                    <option>Never</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Audit Logging</Label>
                    <p className="text-sm text-muted-foreground">Log all administrative actions</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>API Key Rotation</Label>
                    <p className="text-sm text-muted-foreground">Automatically rotate API keys</p>
                  </div>
                  <Badge variant="secondary" className="bg-low/20 text-low">Enabled</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Password Policies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="min-length">Minimum Password Length</Label>
                  <Input id="min-length" type="number" defaultValue="12" />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Require Special Characters</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Password Expiration (days)</Label>
                  <Input type="number" defaultValue="90" className="w-24" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Configure alerts and notification channels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive email alerts for critical events</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SIEM Integration Alerts</Label>
                    <p className="text-sm text-muted-foreground">Forward events to SIEM platform</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Slack Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send alerts to Slack channel</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Critical Finding Alerts</Label>
                    <p className="text-sm text-muted-foreground">Immediate notification for critical vulnerabilities</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alert Thresholds</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Critical Vulnerability Threshold</Label>
                  <Input type="number" defaultValue="1" />
                  <p className="text-xs text-muted-foreground">Alert when critical count exceeds this value</p>
                </div>
                <div className="space-y-2">
                  <Label>Compliance Percentage Threshold</Label>
                  <Input type="number" defaultValue="95" />
                  <p className="text-xs text-muted-foreground">Alert when compliance falls below this percentage</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integration */}
          <TabsContent value="integration" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>CMDB Integration</CardTitle>
                <CardDescription>Configuration Management Database synchronization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-Discovery</Label>
                    <p className="text-sm text-muted-foreground">Automatically discover new assets</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cmdb-url">CMDB Endpoint URL</Label>
                  <Input id="cmdb-url" placeholder="https://cmdb.company.com/api" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sync-interval">Sync Interval (minutes)</Label>
                  <Input id="sync-interval" type="number" defaultValue="15" />
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-low/20 text-low">Connected</Badge>
                  <span className="text-sm text-muted-foreground">Last sync: 5 minutes ago</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SIEM Integration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siem-endpoint">SIEM Endpoint</Label>
                  <Input id="siem-endpoint" placeholder="https://siem.company.com/api/events" />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Forward Compliance Events</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Forward Vulnerability Events</Label>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ansible Deployment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="control-node">Control Node Address</Label>
                  <Input id="control-node" placeholder="ansible.company.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inventory-path">Inventory File Path</Label>
                  <Input id="inventory-path" defaultValue="/etc/ansible/hosts" />
                </div>
                <Button variant="outline">Test Connection</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rollback Settings */}
          <TabsContent value="rollback" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Multi-Layered Rollback System</CardTitle>
                <CardDescription>Configure the four-tier safety system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Layer 1: Git-Style Commits</Label>
                    <p className="text-sm text-muted-foreground">Precision rollback for specific rules</p>
                  </div>
                  <Badge variant="secondary" className="bg-low/20 text-low">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Layer 2: Direct File Backups</Label>
                    <p className="text-sm text-muted-foreground">Reliable backups before modifications</p>
                  </div>
                  <Badge variant="secondary" className="bg-low/20 text-low">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Layer 3: OS-Level Snapshots</Label>
                    <p className="text-sm text-muted-foreground">Full system restore capability</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Layer 4: Drift Detection</Label>
                    <p className="text-sm text-muted-foreground">Continuous compliance monitoring</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rollback Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="retention">Backup Retention Period (days)</Label>
                  <Input id="retention" type="number" defaultValue="30" />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Auto-Remediate Drift</Label>
                  <Switch />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="drift-check">Drift Check Interval (minutes)</Label>
                  <Input id="drift-check" type="number" defaultValue="60" />
                </div>
                <Button variant="outline">View Rollback History</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
