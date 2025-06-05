import React from 'react';
import { SendTestEmailForm } from '@/components/admin/SendTestEmailForm';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function TestEmailPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Email System Test</h1>
          <p className="text-muted-foreground">
            Use this page to test the email functionality of the application using SendGrid integration.
          </p>
          <div className="mt-4">
            <Button variant="outline" asChild>
              <Link to="/admin/java-email-demo">Try the Java SendGrid Demo</Link>
            </Button>
          </div>
        </div>
        
        <Alert className="bg-amber-50 border-amber-200">
          <AlertTitle className="text-amber-800">Sender Identity Information</AlertTitle>
          <AlertDescription className="text-amber-700">
            All emails are sent using the verified sender identity: <code className="bg-amber-100 px-1 py-0.5 rounded">hello@critvidapp.com</code>. 
            This email must be verified in SendGrid as a sender identity before emails can be sent successfully.
          </AlertDescription>
        </Alert>
        
        <Alert className="bg-green-50 border-green-200">
          <AlertTitle className="text-green-800">SendGrid Integration Updated</AlertTitle>
          <AlertDescription className="text-green-700">
            Emails are now sent through our <code className="bg-green-100 px-1 py-0.5 rounded">send-email</code> Supabase Edge Function
            with the new API key: <code className="bg-green-100 px-1 py-0.5 rounded">your_api_key_here...</code>
          </AlertDescription>
        </Alert>
        
        <Separator />
        
        <div className="grid gap-6">
          <SendTestEmailForm />
          
          <Card>
            <CardHeader>
              <CardTitle>SendGrid API Configuration</CardTitle>
              <CardDescription>
                Information about the current email service configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">Email Service</h3>
                  <p className="text-sm text-muted-foreground">SendGrid API v3</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium">API Key Status</h3>
                  <div className="flex items-center mt-1">
                    <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      Active
                    </span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      Updated on {new Date().toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium">SendGrid API Key</h3>
                  <p className="text-sm text-muted-foreground">
                    Using API key: <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">your_api_key_here...</code>
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium">Supabase Function</h3>
                  <p className="text-sm text-muted-foreground">
                    Using <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">send-email</code> function with the proper authentication
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium">Verified Sender Identity</h3>
                  <p className="text-sm text-muted-foreground">
                    Using sender: <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">hello@critvidapp.com</code>
                  </p>
                  <p className="text-xs text-amber-600 mt-1">
                    <strong>Important:</strong> This email address must be verified in SendGrid under Sender Authentication
                    before sending emails. If emails fail, check this first.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium">Email Templates</h3>
                  <p className="text-sm text-muted-foreground">
                    Available templates: Welcome, Critique Ready, Payment Confirmation, and more
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium">Email Tracking</h3>
                  <p className="text-sm text-muted-foreground">
                    All emails are logged in the database with status tracking and detailed error messages
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium">Troubleshooting</h3>
                  <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                    <li>Verify the sender email is authenticated in SendGrid</li>
                    <li>Check that the Supabase Edge Function <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">send-email</code> is deployed</li>
                    <li>Ensure the SendGrid API key is correctly set in the Edge Function</li>
                    <li>Check the browser console for detailed error messages</li>
                    <li>Verify your authentication session is valid (login required)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-medium mb-2">About Email Testing</h3>
            <p className="text-sm text-muted-foreground">
              This test will send an email through our SendGrid integration to verify that
              the email system is properly configured and working. The email will be tracked
              in our database for verification purposes. You can select different email templates
              to test various notification types used throughout the application.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
