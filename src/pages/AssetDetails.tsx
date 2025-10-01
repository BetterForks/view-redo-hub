import React from 'react';
import { useParams } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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

  if (!asset) {
    return (
      <AppLayout title="Asset Not Found" breadcrumbs={["Aegis Guardian", "Assets", "Not Found"]}>
        <div className="text-center">Asset not found.</div>
      </AppLayout>
    );
  }

  const policiesByLayer = asset.policies.reduce((acc, policy) => {
    const { layer } = policy;
    if (!acc[layer]) {
      acc[layer] = [];
    }
    acc[layer].push(policy);
    return acc;
  }, {} as Record<string, any[]>);

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

        <Card>
          <CardHeader>
            <CardTitle>Applied Policies</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible defaultValue="custom">
              <AccordionItem value="external">
                <AccordionTrigger>External Changes</AccordionTrigger>
                <AccordionContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead>Subcategory</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Rollback</TableHead>
                        <TableHead>Diff</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {policiesByLayer['External']?.map((policy, index) => (
                        <TableRow key={index}>
                          <TableCell>{policy.category}</TableCell>
                          <TableCell>{policy.subcategory}</TableCell>
                          <TableCell><Badge variant={policy.status === 'successfully applied' ? 'secondary' : 'destructive'}>{policy.status}</Badge></TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">Rollback</Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem>Rollback to Snapshot</DropdownMenuItem>
                                <DropdownMenuItem>Rollback to Baseline</DropdownMenuItem>
                                <DropdownMenuItem>Rollback to Diff</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">View Diff</Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Diff for {policy.name}</DialogTitle>
                                </DialogHeader>
                                <DiffView oldPolicy={policy.oldConfig} newPolicy={policy.newConfig} />
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="custom">
                <AccordionTrigger>Custom Policies</AccordionTrigger>
                <AccordionContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead>Subcategory</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Rollback</TableHead>
                        <TableHead>Diff</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {policiesByLayer['Custom']?.map((policy, index) => (
                        <TableRow key={index}>
                          <TableCell>{policy.category}</TableCell>
                          <TableCell>{policy.subcategory}</TableCell>
                          <TableCell><Badge variant={policy.status === 'successfully applied' ? 'secondary' : 'destructive'}>{policy.status}</Badge></TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">Rollback</Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem>Rollback to Snapshot</DropdownMenuItem>
                                <DropdownMenuItem>Rollback to Baseline</DropdownMenuItem>
                                <DropdownMenuItem>Rollback to Diff</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">View Diff</Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Diff for {policy.name}</DialogTitle>
                                </DialogHeader>
                                <DiffView oldPolicy={policy.oldConfig} newPolicy={policy.newConfig} />
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="baseline">
                <AccordionTrigger>Baseline Policy</AccordionTrigger>
                <AccordionContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead>Subcategory</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Rollback</TableHead>
                        <TableHead>Diff</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {policiesByLayer['Baseline']?.map((policy, index) => (
                        <TableRow key={index}>
                          <TableCell>{policy.category}</TableCell>
                          <TableCell>{policy.subcategory}</TableCell>
                          <TableCell><Badge variant={policy.status === 'successfully applied' ? 'secondary' : 'destructive'}>{policy.status}</Badge></TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">Rollback</Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem>Rollback to Snapshot</DropdownMenuItem>
                                <DropdownMenuItem>Rollback to Baseline</DropdownMenuItem>
                                <DropdownMenuItem>Rollback to Diff</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">View Diff</Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Diff for {policy.name}</DialogTitle>
                                </DialogHeader>
                                <DiffView oldPolicy={policy.oldConfig} newPolicy={policy.newConfig} />
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
