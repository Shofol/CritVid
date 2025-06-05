import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppLayout } from '@/components/AppLayout';

const EmailsPage = () => {
  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Email Management</h1>
          <Button>Create New Template</Button>
        </div>

        <Tabs defaultValue="templates">
          <TabsList className="mb-6">
            <TabsTrigger value="templates">Email Templates</TabsTrigger>
            <TabsTrigger value="logs">Email Logs</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="templates">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { id: 1, name: 'Welcome Email', lastEdited: '2023-10-15' },
                { id: 2, name: 'Password Reset', lastEdited: '2023-11-02' },
                { id: 3, name: 'Account Verification', lastEdited: '2023-09-28' },
                { id: 4, name: 'Critique Ready', lastEdited: '2023-10-30' },
                { id: 5, name: 'Payment Receipt', lastEdited: '2023-11-10' },
              ].map((template) => (
                <Card key={template.id}>
                  <CardHeader>
                    <CardTitle>{template.name}</CardTitle>
                    <CardDescription>Last edited: {template.lastEdited}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">Preview</Button>
                      <Button variant="outline" size="sm">Test Send</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>Email Logs</CardTitle>
                <CardDescription>History of all emails sent through the system</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Email logs will be displayed here. Feature under development.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Email Settings</CardTitle>
                <CardDescription>Configure email delivery settings</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Email configuration settings will be displayed here. Feature under development.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default EmailsPage;