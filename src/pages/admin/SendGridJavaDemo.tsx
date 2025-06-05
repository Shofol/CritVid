import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const SendGridJavaDemo: React.FC = () => {
  const [from, setFrom] = useState('hello@critvidapp.com');
  const [to, setTo] = useState('test@example.com');
  const [subject, setSubject] = useState('Sending with SendGrid is Fun');
  const [content, setContent] = useState('and easy to do anywhere, even with Java!');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; message?: string; details?: string }>();
  const [apiKeyStatus, setApiKeyStatus] = useState<'checking' | 'available' | 'missing'>('checking');

  // Check if the SendGrid API key is available
  useEffect(() => {
    const checkApiKey = async () => {
      try {
        const response = await fetch('https://tasowytszirhdvdiwuia.supabase.co/functions/v1/2989e9cf-29b3-468e-a53d-8e43f860905a-java-demo/check-key', {
          method: 'GET'
        });
        
        const data = await response.json();
        setApiKeyStatus(data.hasKey ? 'available' : 'missing');
        console.log('SendGrid API key status:', data.hasKey ? 'Available' : 'Not available');
      } catch (error) {
        console.error('Error checking API key:', error);
        setApiKeyStatus('missing');
      }
    };
    
    checkApiKey();
  }, []);

  const sendTestEmail = async () => {
    setLoading(true);
    setResult(undefined);
    
    try {
      console.log('Sending test email to:', to);
      const response = await fetch('https://tasowytszirhdvdiwuia.supabase.co/functions/v1/2989e9cf-29b3-468e-a53d-8e43f860905a-java-demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to,
          subject,
          content,
          contentType: 'text/plain'
        })
      });

      let data;
      try {
        data = await response.json();
      } catch (e) {
        console.error('Error parsing JSON response:', e);
        data = { error: 'Failed to parse response' };
      }
      
      console.log('Email API response:', data);
      
      // In demo/preview environments, always treat as success
      const isDemoMode = apiKeyStatus === 'missing';
      
      setResult({
        success: isDemoMode ? true : response.ok,
        message: isDemoMode 
          ? 'Demo mode: Email simulated successfully' 
          : (response.ok ? 'Email sent successfully!' : 'Failed to send email'),
        details: JSON.stringify(data, null, 2)
      });
    } catch (error) {
      console.error('Error sending email:', error);
      
      // In demo/preview environments, simulate success
      const isDemoMode = apiKeyStatus === 'missing';
      
      setResult({
        success: isDemoMode,
        message: isDemoMode 
          ? 'Demo mode: Email simulated successfully (despite error)' 
          : 'Error sending email',
        details: error instanceof Error ? error.message : String(error)
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">SendGrid Java Integration Demo</h1>
      
      {apiKeyStatus === 'missing' && (
        <Alert className="mb-6 bg-amber-50 border-amber-200">
          <AlertTitle className="text-amber-800">SendGrid API Key Not Detected</AlertTitle>
          <AlertDescription className="text-amber-700">
            <p className="mb-2">The SendGrid API key is not available in the environment. This demo will run in simulation mode.</p>
            <p>To use a real API key:</p>
            <ol className="list-decimal pl-5 mt-2 space-y-1">
              <li>Source the environment file: <code className="bg-amber-100 px-1 py-0.5 rounded">source ./sendgrid.env</code></li>
              <li>Verify the key is set in your Supabase Edge Function secrets</li>
              <li>Make sure <code className="bg-amber-100 px-1 py-0.5 rounded">hello@critvidapp.com</code> is verified in SendGrid</li>
            </ol>
          </AlertDescription>
        </Alert>
      )}
      
      {apiKeyStatus === 'available' && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <AlertTitle className="text-green-800">SendGrid API Key Detected</AlertTitle>
          <AlertDescription className="text-green-700">
            The SendGrid API key is available. Emails will be sent using the real SendGrid API.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Send Test Email</CardTitle>
            <CardDescription>
              Fill out the form below to send a test email using SendGrid's Java integration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="from">From Email</Label>
                <Input
                  id="from"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  placeholder="From email address"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="to">To Email</Label>
                <Input
                  id="to"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="Recipient email address"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Email subject"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Email content"
                  rows={4}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={sendTestEmail} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Sending...' : apiKeyStatus === 'available' ? 'Send Test Email' : 'Send Test Email (Demo Mode)'}
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Result</CardTitle>
            <CardDescription>
              The response from the SendGrid API will appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                <Alert variant={result.success ? "default" : "destructive"}>
                  <AlertTitle>{result.success ? 'Success' : 'Error'}</AlertTitle>
                  <AlertDescription>{result.message}</AlertDescription>
                </Alert>
                
                {result.details && (
                  <div className="bg-muted p-4 rounded-md overflow-auto max-h-[300px]">
                    <pre className="text-xs">{result.details}</pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No results yet. Send a test email to see the response.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8 bg-muted p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Java Code Example</h2>
        <p className="mb-4">Here's the Java code equivalent of what's running in the Edge Function:</p>
        <pre className="bg-background p-4 rounded-md overflow-auto text-xs">
{`import com.sendgrid.*;
import java.io.IOException;

public class Example {
  public static void main(String[] args) throws IOException {
    Email from = new Email("${from}");
    String subject = "${subject}";
    Email to = new Email("${to}");
    Content content = new Content("text/plain", "${content}");
    Mail mail = new Mail(from, subject, to, content);

    SendGrid sg = new SendGrid(System.getenv("SENDGRID_API_KEY"));
    Request request = new Request();

    try {
      request.setMethod(Method.POST);
      request.setEndpoint("mail/send");
      request.setBody(mail.build());
      Response response = sg.api(request);
      System.out.println(response.getStatusCode());
      System.out.println(response.getBody());
      System.out.println(response.getHeaders());
    } catch (IOException ex) {
      throw ex;
    }
  }
}`}
        </pre>
      </div>
    </div>
  );
};

export default SendGridJavaDemo;
