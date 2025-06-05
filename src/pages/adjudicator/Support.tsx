import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AppLayout } from '@/components/AppLayout';

const Support = () => {
  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Adjudicator Support</h1>
        
        <Tabs defaultValue="help">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="help">Help Center</TabsTrigger>
            <TabsTrigger value="tickets">My Tickets</TabsTrigger>
            <TabsTrigger value="contact">Contact Support</TabsTrigger>
          </TabsList>
          
          <TabsContent value="help" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>Find answers to common questions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-b pb-4">
                  <h3 className="font-medium mb-2">How do I submit a critique?</h3>
                  <p className="text-gray-600">Navigate to your Pending Critiques page, select a video, and use the critique editor to record your feedback.</p>
                </div>
                <div className="border-b pb-4">
                  <h3 className="font-medium mb-2">When will I receive payment for my critiques?</h3>
                  <div className="text-gray-600 space-y-2">
                    <p>You'll receive payment once the student has received and approved your critique. Students have up to 7 days to review their critique. If they haven't opened it within that time, the payment will be automatically approved.</p>
                    <p>If the student is unhappy with the critique and requests a review, payment will be paused until it is assessed by management. If the critique meets our standards and has been uploaded correctly, payment will be manually approved. If not, the critique will be returned to you for revision, and payment will be processed once the revised version is approved.</p>
                  </div>
                </div>
                <div className="border-b pb-4">
                  <h3 className="font-medium mb-2">How do I update my profile information?</h3>
                  <p className="text-gray-600">Go to your Profile page from the sidebar menu to update your personal information, credentials, and payment details.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tickets" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Support Tickets</CardTitle>
                <CardDescription>Track your support requests</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-gray-500">You don't have any active support tickets.</p>
                <div className="flex justify-center">
                  <Button>Create New Ticket</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contact Support Team</CardTitle>
                <CardDescription>We typically respond within 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="subject" className="block text-sm font-medium">Subject</label>
                    <Input id="subject" placeholder="Brief description of your issue" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="category" className="block text-sm font-medium">Category</label>
                    <select className="w-full p-2 border rounded-md" id="category">
                      <option>Technical Issue</option>
                      <option>Payment Question</option>
                      <option>Account Management</option>
                      <option>Feature Request</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-sm font-medium">Message</label>
                    <Textarea id="message" placeholder="Please describe your issue in detail" rows={5} />
                  </div>
                  <Button type="submit" className="w-full">Submit Support Request</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Support;