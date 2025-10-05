import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, FolderPlus, Monitor, Server } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CreatePolicyGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateGroup: (group: any) => void;
}

export function CreatePolicyGroupDialog({ open, onOpenChange, onCreateGroup }: CreatePolicyGroupDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    platform: "",
    description: "",
    type: "baseline" // baseline, custom, regulatory
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Group name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Group name must be at least 3 characters";
    }
    
    if (!formData.platform) {
      newErrors.platform = "Platform selection is required";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const newGroup = {
      id: `${formData.platform}-${Date.now()}`,
      name: formData.name.trim(),
      platform: formData.platform,
      description: formData.description.trim(),
      type: formData.type,
      totalPolicies: 0,
      samplePolicies: [],
      createdAt: new Date().toISOString(),
      status: "active"
    };

    onCreateGroup(newGroup);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: "",
      platform: "",
      description: "",
      type: "baseline"
    });
    setErrors({});
    onOpenChange(false);
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderPlus className="h-5 w-5" />
            Create New Policy Group
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Alert Info */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Policy groups organize related compliance policies by platform and purpose. 
              All policies must belong to a group.
            </AlertDescription>
          </Alert>

          {/* Group Name */}
          <div className="space-y-2">
            <Label htmlFor="groupName">Group Name *</Label>
            <Input
              id="groupName"
              placeholder="e.g., Custom Security Baseline, SOX Compliance, GDPR Requirements"
              value={formData.name}
              onChange={(e) => updateFormData("name", e.target.value)}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Platform Selection */}
          <div className="space-y-2">
            <Label htmlFor="platform">Target Platform *</Label>
            <Select value={formData.platform} onValueChange={(value) => updateFormData("platform", value)}>
              <SelectTrigger className={errors.platform ? "border-red-500" : ""}>
                <SelectValue placeholder="Select target platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="windows">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    Windows
                  </div>
                </SelectItem>
                <SelectItem value="linux">
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4" />
                    Linux
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.platform && (
              <p className="text-sm text-red-500">{errors.platform}</p>
            )}
          </div>

          {/* Group Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Group Type</Label>
            <Select value={formData.type} onValueChange={(value) => updateFormData("type", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="baseline">Baseline Configuration</SelectItem>
                <SelectItem value="custom">Custom Requirements</SelectItem>
                <SelectItem value="regulatory">Regulatory Compliance</SelectItem>
                <SelectItem value="security">Security Hardening</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the purpose and scope of this policy group..."
              value={formData.description}
              onChange={(e) => updateFormData("description", e.target.value)}
              className={`min-h-[80px] ${errors.description ? "border-red-500" : ""}`}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
            <p className="text-sm text-muted-foreground">
              {formData.description.length}/500 characters
            </p>
          </div>

          {/* Preview */}
          {formData.name && formData.platform && (
            <div className="p-3 bg-muted rounded-lg space-y-2">
              <h4 className="font-medium text-sm">Preview:</h4>
              <div className="text-sm">
                <p><span className="font-medium">Name:</span> {formData.name}</p>
                <p><span className="font-medium">Platform:</span> {formData.platform.charAt(0).toUpperCase() + formData.platform.slice(1)}</p>
                <p><span className="font-medium">Type:</span> {formData.type.charAt(0).toUpperCase() + formData.type.slice(1)}</p>
                {formData.description && (
                  <p><span className="font-medium">Description:</span> {formData.description.slice(0, 50)}{formData.description.length > 50 ? "..." : ""}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!formData.name || !formData.platform || !formData.description}
          >
            <FolderPlus className="h-4 w-4 mr-2" />
            Create Group
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}