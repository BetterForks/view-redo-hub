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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, Plus, CheckCircle, FileCode, Code, Target, Activity, FileCheck } from "lucide-react";

interface CreatePolicyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreatePolicy?: (policy: NewPolicy) => void;
  policyGroups?: { windows: any[], linux: any[] };
}

interface NewPolicy {
  name: string;
  description: string;
  category: string;
  policyGroup: string;
  platform: 'windows' | 'linux';
  priority: 'low' | 'medium' | 'high' | 'critical';
  implementation: string;
  validation: string;
  effect?: 'audit' | 'deny' | 'deployIfNotExists' | 'modify' | 'disabled';
  complianceFrequency?: 'realtime' | 'hourly' | 'daily' | 'weekly';
  policyRule?: string;
  remediationAction?: 'manual' | 'automatic' | 'scripted' | 'workflow';
  severity?: 'critical' | 'high' | 'medium' | 'low' | 'informational';
  targets?: string[];
  testMode?: boolean;
  dryRun?: boolean;
  notifyOnViolation?: boolean;
  weeklyReport?: boolean;
}

const policyCategories = {
  windows: [
    "Account Policies",
    "Local Policies", 
    "Security Options",
    "System Services",
    "Registry Settings",
    "File System"
  ],
  linux: [
    "Network Security",
    "Access Control",
    "Mandatory Access Control", 
    "Logging & Monitoring",
    "File System Security",
    "System Maintenance"
  ]
};

export function CreatePolicyDialog({ open, onOpenChange, onCreatePolicy, policyGroups }: CreatePolicyDialogProps) {
  // Use provided policy groups or default ones
  const defaultPolicyGroups = {
    windows: [
      { name: "Baseline Windows Policy", id: "BWP-001" },
      { name: "Custom Windows Security Policy", id: "CWS-001" },
      { name: "Windows Compliance Framework", id: "WCF-001" },
      { name: "Windows Hardening Standards", id: "WHS-001" }
    ],
    linux: [
      { name: "Baseline Linux Policy", id: "BLP-001" },
      { name: "Custom Linux Security Policy", id: "CLS-001" },
      { name: "Linux Compliance Framework", id: "LCF-001" },
      { name: "Linux Hardening Standards", id: "LHS-001" }
    ]
  };
  
  const groups = policyGroups || defaultPolicyGroups;
  const [newPolicy, setNewPolicy] = useState<NewPolicy>({
    name: '',
    description: '',
    category: '',
    policyGroup: '',
    platform: 'windows',
    priority: 'medium',
    implementation: '',
    validation: '',
    effect: 'audit',
    complianceFrequency: 'daily',
    severity: 'medium',
    remediationAction: 'manual',
    targets: [],
    testMode: false,
    dryRun: false,
    notifyOnViolation: true,
    weeklyReport: false
  });

  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleCreate = () => {
    if (onCreatePolicy) {
      onCreatePolicy(newPolicy);
    }
    onOpenChange(false);
    // Reset form
    setNewPolicy({
      name: '',
      description: '',
      category: '',
      policyGroup: '',
      platform: 'windows',
      priority: 'medium',
      implementation: '',
      validation: ''
    });
    setStep(1);
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return newPolicy.name.trim() && newPolicy.description.trim() && newPolicy.policyGroup;
      case 2:
        return newPolicy.category && newPolicy.priority;
      case 3:
        // Step 3 has sensible defaults, so it's always valid
        return true;
      default:
        return false;
    }
  };

  const getNextStepTitle = () => {
    switch (step) {
      case 1: return "Continue to Configuration";
      case 2: return "Continue to Implementation";
      case 3: return "Create Policy";
      default: return "Next";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Create New Policy
          </DialogTitle>
          <DialogDescription>
            Step {step} of {totalSteps}: Create a new security policy within a policy group
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  stepNum < step ? 'bg-primary text-primary-foreground' :
                  stepNum === step ? 'bg-primary/20 text-primary border-2 border-primary' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {stepNum < step ? <CheckCircle className="h-4 w-4" /> : stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={`w-8 h-1 ${stepNum < step ? 'bg-primary' : 'bg-muted'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="min-h-[600px]">
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="platform">Platform</Label>
                      <Select
                        value={newPolicy.platform}
                        onValueChange={(value: 'windows' | 'linux') => {
                          setNewPolicy(prev => ({ 
                            ...prev, 
                            platform: value,
                            category: '', // Reset category when platform changes
                            policyGroup: '' // Reset policy group when platform changes
                          }));
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="windows">Windows</SelectItem>
                          <SelectItem value="linux">Linux</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="policyGroup">Policy Group *</Label>
                      <Select
                        value={newPolicy.policyGroup}
                        onValueChange={(value) => setNewPolicy(prev => ({ ...prev, policyGroup: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select policy group" />
                        </SelectTrigger>
                        <SelectContent>
                          {groups[newPolicy.platform].map((group) => (
                            <SelectItem key={group.id || group.name || group} value={group.name || group}>
                              {group.name || group}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="name">Policy Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Enforce Strong Password Policy"
                      value={newPolicy.name}
                      onChange={(e) => setNewPolicy(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what this policy enforces and why it's important..."
                      value={newPolicy.description}
                      onChange={(e) => setNewPolicy(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Policy Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={newPolicy.category}
                        onValueChange={(value) => setNewPolicy(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {policyCategories[newPolicy.platform].map((category) => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="priority">Priority *</Label>
                      <Select
                        value={newPolicy.priority}
                        onValueChange={(value: 'low' | 'medium' | 'high' | 'critical') => 
                          setNewPolicy(prev => ({ ...prev, priority: value }))
                        }
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

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Policy Group: {newPolicy.policyGroup}</h4>
                    <p className="text-sm text-muted-foreground">
                      This policy will be added to the selected policy group and inherit its deployment settings and compliance requirements.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileCode className="h-5 w-5" />
                      Policy Definition & Rules
                    </CardTitle>
                    <CardDescription>
                      Define the technical implementation and compliance rules for this policy
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="effect">Policy Effect</Label>
                        <Select
                          value={newPolicy.effect || 'audit'}
                          onValueChange={(value: 'audit' | 'deny' | 'deployIfNotExists' | 'modify' | 'disabled') => setNewPolicy(prev => ({ ...prev, effect: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="audit">Audit (Monitor Only)</SelectItem>
                            <SelectItem value="deny">Deny (Block Non-Compliant)</SelectItem>
                            <SelectItem value="deployIfNotExists">Deploy If Not Exists</SelectItem>
                            <SelectItem value="modify">Modify (Auto-Remediate)</SelectItem>
                            <SelectItem value="disabled">Disabled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="complianceCheck">Compliance Check Frequency</Label>
                        <Select
                          value={newPolicy.complianceFrequency || 'daily'}
                          onValueChange={(value: 'realtime' | 'hourly' | 'daily' | 'weekly') => setNewPolicy(prev => ({ ...prev, complianceFrequency: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="realtime">Real-time</SelectItem>
                            <SelectItem value="hourly">Every Hour</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="policyRule">Policy Rule Definition</Label>
                      <div className="border rounded-lg">
                        <div className="flex items-center justify-between p-3 border-b bg-muted/50">
                          <div className="flex items-center gap-2">
                            <Code className="h-4 w-4" />
                            <span className="text-sm font-medium">JSON Policy Definition</span>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">Validate</Button>
                            <Button variant="ghost" size="sm">Format</Button>
                          </div>
                        </div>
                        <Textarea
                          id="policyRule"
                          className="border-0 font-mono text-sm resize-none"
                          placeholder={newPolicy.platform === 'windows' 
                            ? `{
  "if": {
    "field": "type",
    "equals": "Microsoft.Compute/virtualMachines"
  },
  "then": {
    "effect": "${newPolicy.effect || 'audit'}",
    "details": {
      "type": "Microsoft.GuestConfiguration/guestConfigurationAssignments",
      "name": "${newPolicy.name?.replace(/\s+/g, '')}",
      "properties": {
        "guestConfiguration": {
          "name": "${newPolicy.name?.replace(/\s+/g, '')}",
          "contentUri": "https://policies.contoso.com/${newPolicy.category?.toLowerCase()}/${newPolicy.name?.replace(/\s+/g, '')}.zip",
          "contentHash": "SHA256:PLACEHOLDER"
        }
      }
    }
  }
}`
                            : `{
  "if": {
    "allOf": [
      {
        "field": "type",
        "equals": "Microsoft.Compute/virtualMachines"
      },
      {
        "field": "Microsoft.Compute/virtualMachines/storageProfile.osDisk.osType",
        "equals": "Linux"
      }
    ]
  },
  "then": {
    "effect": "${newPolicy.effect || 'audit'}",
    "details": {
      "type": "Microsoft.GuestConfiguration/guestConfigurationAssignments",
      "name": "${newPolicy.name?.replace(/\s+/g, '')}",
      "properties": {
        "guestConfiguration": {
          "name": "${newPolicy.name?.replace(/\s+/g, '')}",
          "version": "1.0.0"
        }
      }
    }
  }
}`
                          }
                          value={newPolicy.policyRule || ''}
                          onChange={(e) => setNewPolicy(prev => ({ ...prev, policyRule: e.target.value }))}
                          rows={12}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Compliance & Remediation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="remediationTask">Remediation Action</Label>
                        <Select
                          value={newPolicy.remediationAction || 'manual'}
                          onValueChange={(value: 'manual' | 'automatic' | 'scripted' | 'workflow') => setNewPolicy(prev => ({ ...prev, remediationAction: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="manual">Manual Remediation</SelectItem>
                            <SelectItem value="automatic">Automatic Remediation</SelectItem>
                            <SelectItem value="scripted">Script-based Remediation</SelectItem>
                            <SelectItem value="workflow">Workflow Approval Required</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="severity">Non-Compliance Severity</Label>
                        <Select
                          value={newPolicy.severity || 'medium'}
                          onValueChange={(value: 'critical' | 'high' | 'medium' | 'low' | 'informational') => setNewPolicy(prev => ({ ...prev, severity: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="critical">Critical</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="informational">Informational</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="complianceTargets">Compliance Targets & Scope</Label>
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {["Production Systems", "Development Environment", "Test Environment", "DMZ Network", "Domain Controllers"].map((target) => (
                            <div key={target} className="flex items-center space-x-2">
                              <Checkbox 
                                id={target} 
                                checked={newPolicy.targets?.includes(target) || false}
                                onCheckedChange={(checked) => {
                                  const currentTargets = newPolicy.targets || [];
                                  if (checked) {
                                    setNewPolicy(prev => ({ 
                                      ...prev, 
                                      targets: [...currentTargets, target] 
                                    }));
                                  } else {
                                    setNewPolicy(prev => ({ 
                                      ...prev, 
                                      targets: currentTargets.filter(t => t !== target) 
                                    }));
                                  }
                                }}
                              />
                              <Label htmlFor={target} className="text-sm">{target}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Testing & Validation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Policy Testing</Label>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="testMode" 
                              checked={newPolicy.testMode || false}
                              onCheckedChange={(checked) => setNewPolicy(prev => ({ ...prev, testMode: checked === true }))}
                            />
                            <Label htmlFor="testMode" className="text-sm">Enable Test Mode (What-If Analysis)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="dryRun" 
                              checked={newPolicy.dryRun || false}
                              onCheckedChange={(checked) => setNewPolicy(prev => ({ ...prev, dryRun: checked === true }))}
                            />
                            <Label htmlFor="dryRun" className="text-sm">Dry Run Before Implementation</Label>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label>Notification Settings</Label>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="notifyOnViolation" 
                              checked={newPolicy.notifyOnViolation || false}
                              onCheckedChange={(checked) => setNewPolicy(prev => ({ ...prev, notifyOnViolation: checked === true }))}
                            />
                            <Label htmlFor="notifyOnViolation" className="text-sm">Notify on Policy Violation</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="weeklyReport" 
                              checked={newPolicy.weeklyReport || false}
                              onCheckedChange={(checked) => setNewPolicy(prev => ({ ...prev, weeklyReport: checked === true }))}
                            />
                            <Label htmlFor="weeklyReport" className="text-sm">Weekly Compliance Report</Label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                        <FileCheck className="h-4 w-4" />
                        Policy Configuration Summary
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-blue-700">Policy Name:</span>
                            <span className="font-medium text-blue-900">{newPolicy.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-700">Platform:</span>
                            <span className="font-medium text-blue-900">{newPolicy.platform?.charAt(0).toUpperCase() + newPolicy.platform?.slice(1)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-700">Effect:</span>
                            <Badge variant={newPolicy.effect === 'deny' ? 'destructive' : newPolicy.effect === 'audit' ? 'secondary' : 'default'}>
                              {newPolicy.effect || 'audit'}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-700">Severity:</span>
                            <Badge variant={newPolicy.severity === 'critical' || newPolicy.severity === 'high' ? 'destructive' : 'secondary'}>
                              {newPolicy.severity || 'medium'}
                            </Badge>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-blue-700">Category:</span>
                            <span className="font-medium text-blue-900">{newPolicy.category}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-700">Group:</span>
                            <span className="font-medium text-blue-900">{newPolicy.policyGroup}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-700">Check Frequency:</span>
                            <span className="font-medium text-blue-900">{newPolicy.complianceFrequency || 'daily'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-700">Targets:</span>
                            <span className="font-medium text-blue-900">{newPolicy.targets?.length || 0} selected</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <div className="flex items-center gap-2">
            {step > 1 && (
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={step === totalSteps ? handleCreate : handleNext}
            >
              {step === totalSteps ? (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Policy
                </>
              ) : (
                getNextStepTitle()
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}