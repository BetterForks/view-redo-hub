import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { assets } from '../data/assets';

const DiffView = ({ oldPolicy, newPolicy }: { oldPolicy: string, newPolicy: string }) => {
  const oldLines = oldPolicy.split('\n');
  const newLines = newPolicy.split('\n');
  const maxLines = Math.max(oldLines.length, newLines.length);
  const lines = [];

  for (let i = 0; i < maxLines; i++) {
    const oldLine = oldLines[i];
    const newLine = newLines[i];

    if (oldLine !== newLine) {
      if (oldLine) {
        lines.push({ type: 'deletion', content: oldLine });
      }
      if (newLine) {
        lines.push({ type: 'addition', content: newLine });
      }
    } else if (oldLine !== undefined) {
      lines.push({ type: 'common', content: oldLine });
    }
  }

  return (
    <pre className="text-sm bg-muted/50 p-4 rounded-md overflow-x-auto">
      {lines.map((line, index) => (
        <div
          key={index}
          className={
            line.type === 'addition' ? 'bg-green-500/20' :
            line.type === 'deletion' ? 'bg-red-500/20' :
            ''
          }
        >
          <span className={`mr-4 ${line.type === 'addition' ? 'text-green-800' : line.type === 'deletion' ? 'text-red-800' : ''}`}>{line.type === 'addition' ? '+' : line.type === 'deletion' ? '-' : ' '}
          </span>
          {line.content}
        </div>
      ))}
    </pre>
  );
};

export default function AssetDetails() {
  const { hostname } = useParams<{ hostname: string }>();
  const asset = assets.find(a => a.hostname === hostname);
  const [selectedChange, setSelectedChange] = useState<any>(null);

  if (!asset) {
    return (
      <AppLayout title="Asset Not Found" breadcrumbs={["Aegis Guardian", "Assets", "Not Found"]}>
        <div className="text-center">Asset not found.</div>
      </AppLayout>
    );
  }

  const sortedChanges = [...asset.policyChanges].sort((a, b) => {
    if (!a.authorized && b.authorized) return -1;
    if (a.authorized && !b.authorized) return 1;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  return (
    <AppLayout title={`Asset: ${asset.hostname}`} breadcrumbs={["Aegis Guardian", "Assets", asset.hostname]}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Asset Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div><strong>IP Address:</strong> {asset.ip}</div>
              <div><strong>OS:</strong> {asset.os}</div>
              <div><strong>Type:</strong> <Badge variant="outline">{asset.type}</Badge></div>
              <div><strong>Location:</strong> {asset.location}</div>
              <div><strong>Compliance Status:</strong> <Badge variant={asset.status === "Compliant" ? "secondary" : asset.status === "Warning" ? "default" : "destructive"} className={asset.status === "Compliant" ? "bg-green-100 text-green-800" : asset.status === "Warning" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}>{asset.status}</Badge></div>
              <div><strong>Guardian Agent:</strong> <Badge variant="secondary" className="bg-blue-100 text-blue-800">{asset.guardian}</Badge></div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Applied Policies</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {asset.policies.map((policy, index) => (
                    <li key={index} className="flex justify-between items-center">
                      <span>{policy.name}</span>
                      <Badge>{policy.type}</Badge>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          <div className="col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Policy Change History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1 border-r pr-4">
                    <ul className="space-y-2">
                      {sortedChanges.map((change) => (
                        <li
                          key={change.id}
                          onClick={() => setSelectedChange(change)}
                          className={`p-2 rounded-md cursor-pointer ${!change.authorized ? 'border-l-4 border-red-500' : ''} ${selectedChange?.id === change.id ? 'bg-muted' : 'hover:bg-muted/50'}`}>
                          <div className="font-semibold">{change.policyName}</div>
                          <div className="text-xs text-muted-foreground">{change.timestamp} by {change.changedBy}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="col-span-2">
                    {selectedChange ? (
                      <DiffView oldPolicy={selectedChange.oldPolicy} newPolicy={selectedChange.newPolicy} />
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        Select a change to see the diff.
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
