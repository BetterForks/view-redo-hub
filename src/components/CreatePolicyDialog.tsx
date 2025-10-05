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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Plus, CheckCircle } from "lucide-react";

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
    validation: ''
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
        return newPolicy.implementation.trim() && newPolicy.validation.trim();
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
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
          <div className="min-h-[400px]">
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
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Implementation Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="implementation">Implementation Method *</Label>
                    <Textarea
                      id="implementation"
                      placeholder={newPolicy.platform === 'windows' 
                        ? "Describe how this policy will be implemented (e.g., Group Policy Objects, Registry settings, PowerShell scripts...)"
                        : "Describe how this policy will be implemented (e.g., Configuration files, System commands, Ansible playbooks...)"
                      }
                      value={newPolicy.implementation}
                      onChange={(e) => setNewPolicy(prev => ({ ...prev, implementation: e.target.value }))}
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="validation">Validation & Compliance Check *</Label>
                    <Textarea
                      id="validation"
                      placeholder="Describe how compliance with this policy will be validated and monitored..."
                      value={newPolicy.validation}
                      onChange={(e) => setNewPolicy(prev => ({ ...prev, validation: e.target.value }))}
                      rows={4}
                    />
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Policy Summary</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      <p><span className="font-medium">Name:</span> {newPolicy.name}</p>
                      <p><span className="font-medium">Group:</span> {newPolicy.policyGroup}</p>
                      <p><span className="font-medium">Platform:</span> {newPolicy.platform.charAt(0).toUpperCase() + newPolicy.platform.slice(1)}</p>
                      <p><span className="font-medium">Category:</span> {newPolicy.category}</p>
                      <p><span className="font-medium">Priority:</span> {newPolicy.priority.charAt(0).toUpperCase() + newPolicy.priority.slice(1)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
              disabled={!isStepValid()}
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