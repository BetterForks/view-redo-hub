import { AppLayout } from "@/components/AppLayout";
import { CreatePolicyDialog } from "@/components/CreatePolicyDialog";
import { CreatePolicyGroupDialog } from "@/components/CreatePolicyGroupDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Shield, ChevronDown, ChevronRight, FolderPlus } from "lucide-react";
import { useState } from "react";

// Baseline Windows Policy (containing all 115 policies)
const baselineWindowsPolicy = {
  id: "BWP-001",
  name: "Baseline Windows Policy", 
  totalPolicies: 115,
  compliant: 108,
  warnings: 5,
  nonCompliant: 2,
  categories: [
    { name: "Account Policies", policies: 24, compliant: 23, warnings: 1, nonCompliant: 0 },
    { name: "Local Policies", policies: 18, compliant: 17, warnings: 1, nonCompliant: 0 },
    { name: "Security Options", policies: 32, compliant: 30, warnings: 1, nonCompliant: 1 },
    { name: "System Services", policies: 22, compliant: 21, warnings: 1, nonCompliant: 0 },
    { name: "Registry Settings", policies: 12, compliant: 11, warnings: 1, nonCompliant: 0 },
    { name: "File System", policies: 7, compliant: 6, warnings: 0, nonCompliant: 1 }
  ],
  samplePolicies: [
    { id: "WIN-001", name: "Enforce Password Complexity", category: "Account Policies", status: "Enforced", compliant: 18, total: 18 },
    { id: "WIN-002", name: "Disable Guest Account", category: "Account Policies", status: "Enforced", compliant: 18, total: 18 },
    { id: "WIN-003", name: "Configure Audit Policy", category: "Local Policies", status: "Enforced", compliant: 17, total: 18 },
    { id: "WIN-004", name: "Windows Firewall Enabled", category: "Security Options", status: "Enforced", compliant: 18, total: 18 },
    { id: "WIN-005", name: "Restrict Anonymous Access", category: "Security Options", status: "Warning", compliant: 16, total: 18 },
    { id: "WIN-006", name: "Disable Unnecessary Services", category: "System Services", status: "Enforced", compliant: 17, total: 18 },
    { id: "WIN-007", name: "Registry Access Control", category: "Registry Settings", status: "Warning", compliant: 16, total: 18 },
    { id: "WIN-008", name: "File Permissions", category: "File System", status: "Enforced", compliant: 18, total: 18 }
  ]
};

// Baseline Linux Policy (containing all 261 policies)  
const baselineLinuxPolicy = {
  id: "BLP-001",
  name: "Baseline Linux Policy",
  totalPolicies: 261,
  compliant: 248,
  warnings: 10,
  nonCompliant: 3,
  categories: [
    { name: "Network Security", policies: 48, compliant: 46, warnings: 2, nonCompliant: 0 },
    { name: "Access Control", policies: 52, compliant: 50, warnings: 1, nonCompliant: 1 },
    { name: "Mandatory Access Control", policies: 35, compliant: 33, warnings: 2, nonCompliant: 0 },
    { name: "Logging & Monitoring", policies: 41, compliant: 38, warnings: 2, nonCompliant: 1 },
    { name: "File System Security", policies: 54, compliant: 51, warnings: 2, nonCompliant: 1 },
    { name: "System Maintenance", policies: 31, compliant: 30, warnings: 1, nonCompliant: 0 }
  ],
  samplePolicies: [
    { id: "LNX-001", name: "SSH Protocol 2 Only", category: "Network Security", status: "Enforced", compliant: 18, total: 18 },
    { id: "LNX-002", name: "Disable Root Login", category: "Access Control", status: "Enforced", compliant: 18, total: 18 },
    { id: "LNX-003", name: "Enable SELinux/AppArmor", category: "Mandatory Access Control", status: "Enforced", compliant: 17, total: 18 },
    { id: "LNX-004", name: "Password Expiration Policy", category: "Access Control", status: "Enforced", compliant: 18, total: 18 },
    { id: "LNX-005", name: "Configure Auditd", category: "Logging & Monitoring", status: "Warning", compliant: 16, total: 18 },
    { id: "LNX-006", name: "File Permission Hardening", category: "File System Security", status: "Enforced", compliant: 18, total: 18 },
    { id: "LNX-007", name: "Kernel Parameter Tuning", category: "System Maintenance", status: "Warning", compliant: 17, total: 18 },
    { id: "LNX-008", name: "Network Parameter Security", category: "Network Security", status: "Enforced", compliant: 18, total: 18 }
  ]
};

export default function Policies() {
  const [expandedWindows, setExpandedWindows] = useState(false);
  const [expandedLinux, setExpandedLinux] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showCreateGroupDialog, setShowCreateGroupDialog] = useState(false);
  const [policies, setPolicies] = useState({ windows: baselineWindowsPolicy, linux: baselineLinuxPolicy });
  const [policyGroups, setPolicyGroups] = useState({
    windows: [baselineWindowsPolicy],
    linux: [baselineLinuxPolicy]
  });

  const handleCreateGroup = (newGroup: any) => {
    // Add to the appropriate platform's groups
    setPolicyGroups(prev => ({
      ...prev,
      [newGroup.platform]: [...prev[newGroup.platform], newGroup]
    }));

    // Show success message
    alert(`Policy group "${newGroup.name}" has been successfully created!\n\nPlatform: ${newGroup.platform}\nType: ${newGroup.type}\nDescription: ${newGroup.description}`);
  };

  const handleCreatePolicy = (newPolicy: any) => {
    // Generate new policy ID
    const prefix = newPolicy.platform === 'windows' ? 'WIN' : 'LNX';
    const existingIds = policies[newPolicy.platform].samplePolicies.map(p => p.id);
    const nextId = existingIds.length + 1;
    const policyId = `${prefix}-${String(nextId).padStart(3, '0')}`;

    const policy = {
      id: policyId,
      name: newPolicy.name,
      category: newPolicy.category,
      status: 'Enforced',
      compliant: 0, // New policy starts with 0 compliance
      total: newPolicy.platform === 'windows' ? 387 : 156
    };

    // Add to the appropriate platform's policies
    setPolicies(prev => ({
      ...prev,
      [newPolicy.platform]: {
        ...prev[newPolicy.platform],
        samplePolicies: [policy, ...prev[newPolicy.platform].samplePolicies],
        totalPolicies: prev[newPolicy.platform].totalPolicies + 1
      }
    }));

    // Show success message
    alert(`Policy "${newPolicy.name}" has been successfully created and added to ${newPolicy.policyGroup}!\n\nPolicy ID: ${policyId}\nPlatform: ${newPolicy.platform}\nCategory: ${newPolicy.category}\nGroup: ${newPolicy.policyGroup}`);
  };

  return (
    <AppLayout title="Security Policies" breadcrumbs={["Policies"]}>
      <div className="space-y-6">
        {/* Search and Actions */}
        <div className="flex items-center justify-between">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search policies..." className="pl-10" />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setShowCreateGroupDialog(true)}>
              <FolderPlus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
            <Button variant="outline">Import Policy Group</Button>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Shield className="h-4 w-4 mr-2" />
              Create Policy
            </Button>
          </div>
        </div>

        {/* Baseline Policies */}
        <div className="space-y-4">
          {/* Baseline Windows Policy */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setExpandedWindows(!expandedWindows)}
                    className="flex items-center gap-2 hover:bg-muted p-2 rounded-md transition-colors"
                  >
                    {expandedWindows ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    <Shield className="h-5 w-5 text-blue-600" />
                    <div>
                      <CardTitle className="text-left">{policies.windows.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{policies.windows.totalPolicies} policies total</p>
                    </div>
                  </button>
                </div>
              </div>
            </CardHeader>
            {expandedWindows && (
              <CardContent>
                <div className="space-y-4">
                  {/* Sample Policies Table */}
                  <div>
                    <h4 className="font-medium mb-3">Policies (showing 8 of {policies.windows.totalPolicies})</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Policy ID</TableHead>
                          <TableHead>Policy Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {policies.windows.samplePolicies.slice(0, 8).map((policy, index) => {
                          const hasDetails = index < 4; // First 4 policies have functional details
                          return (
                            <TableRow key={policy.id}>
                              <TableCell className="font-mono text-sm">{policy.id}</TableCell>
                              <TableCell className="font-medium">{policy.name}</TableCell>
                              <TableCell>{policy.category}</TableCell>
                              <TableCell className="text-right">
                                {hasDetails ? (
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => alert(`Policy Details for ${policy.name}:\n\nID: ${policy.id}\nCategory: ${policy.category}\nDescription: This policy ensures ${policy.name.toLowerCase()} across all Windows systems in the organization.\n\nImplementation: Applied through Group Policy Objects (GPO)\nScope: All domain-joined Windows computers\nValidation: Automated compliance checks every 24 hours`)}
                                  >
                                    Details
                                  </Button>
                                ) : (
                                  <Button variant="ghost" size="sm" disabled>
                                    Details
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Baseline Linux Policy */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setExpandedLinux(!expandedLinux)}
                    className="flex items-center gap-2 hover:bg-muted p-2 rounded-md transition-colors"
                  >
                    {expandedLinux ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    <Shield className="h-5 w-5 text-orange-600" />
                    <div>
                      <CardTitle className="text-left">{policies.linux.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{policies.linux.totalPolicies} policies total</p>
                    </div>
                  </button>
                </div>
              </div>
            </CardHeader>
            {expandedLinux && (
              <CardContent>
                <div className="space-y-4">
                  {/* Sample Policies Table */}
                  <div>
                    <h4 className="font-medium mb-3">Policies (showing 8 of {policies.linux.totalPolicies})</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Policy ID</TableHead>
                          <TableHead>Policy Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {policies.linux.samplePolicies.slice(0, 8).map((policy, index) => {
                          const hasDetails = index < 4; // First 4 policies have functional details
                          return (
                            <TableRow key={policy.id}>
                              <TableCell className="font-mono text-sm">{policy.id}</TableCell>
                              <TableCell className="font-medium">{policy.name}</TableCell>
                              <TableCell>{policy.category}</TableCell>
                              <TableCell className="text-right">
                                {hasDetails ? (
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => alert(`Policy Details for ${policy.name}:\n\nID: ${policy.id}\nCategory: ${policy.category}\nDescription: This policy ensures ${policy.name.toLowerCase()} across all Linux systems in the organization.\n\nImplementation: Applied through configuration management tools (Ansible/Puppet)\nScope: All managed Linux servers and workstations\nValidation: Automated compliance checks via system auditing`)}
                                  >
                                    Details
                                  </Button>
                                ) : (
                                  <Button variant="ghost" size="sm" disabled>
                                    Details
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>

      {/* Create Policy Dialog */}
      <CreatePolicyDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onCreatePolicy={handleCreatePolicy}
        policyGroups={policyGroups}
      />

      {/* Create Policy Group Dialog */}
      <CreatePolicyGroupDialog
        open={showCreateGroupDialog}
        onOpenChange={setShowCreateGroupDialog}
        onCreateGroup={handleCreateGroup}
      />
    </AppLayout>
  );
}
