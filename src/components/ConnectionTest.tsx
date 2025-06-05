import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { runFullConnectionTest, ConnectionTestResult } from '@/lib/connectionTest';

export function ConnectionTest() {
  const [results, setResults] = useState<ConnectionTestResult[]>([]);
  const [testing, setTesting] = useState(false);
  const [lastTest, setLastTest] = useState<Date | null>(null);

  const runTest = async () => {
    setTesting(true);
    try {
      const testResults = await runFullConnectionTest();
      setResults(testResults);
      setLastTest(new Date());
    } catch (error) {
      console.error('Connection test failed:', error);
    } finally {
      setTesting(false);
    }
  };

  useEffect(() => {
    runTest();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'testing': return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      default: return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variant = status === 'connected' ? 'default' : status === 'error' ? 'destructive' : 'secondary';
    return <Badge variant={variant} className="capitalize">{status}</Badge>;
  };

  const overallStatus = results.length > 0 ? 
    results.every(r => r.status === 'connected') ? 'All Connected' :
    results.some(r => r.status === 'connected') ? 'Partial Connection' :
    'Connection Issues' : 'Testing...';

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            Supabase Connection Status
            <Badge variant={overallStatus === 'All Connected' ? 'default' : 'destructive'}>
              {overallStatus}
            </Badge>
          </div>
          <Button onClick={runTest} disabled={testing} size="sm" variant="outline">
            {testing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            {testing ? 'Testing...' : 'Retest'}
          </Button>
        </CardTitle>
        {lastTest && (
          <p className="text-sm text-gray-500">
            Last tested: {lastTest.toLocaleTimeString()}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map((result) => (
            <div key={result.service} className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(result.status)}
                  <span className="capitalize font-medium">{result.service}</span>
                </div>
                {getStatusBadge(result.status)}
              </div>
              <p className="text-sm text-gray-600">{result.message}</p>
              {result.details && (
                <details className="text-xs">
                  <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
                    View details
                  </summary>
                  <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-auto">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Connection Information:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <strong>Project URL:</strong><br />
              https://tasowytszirhdvdiwuia.supabase.co
            </div>
            <div>
              <strong>Services:</strong><br />
              Database, Storage, Auth, Edge Functions
            </div>
            <div>
              <strong>Status:</strong><br />
              Account restored and active
            </div>
            <div>
              <strong>Last Update:</strong><br />
              {lastTest ? lastTest.toLocaleString() : 'Not tested yet'}
            </div>
          </div>
        </div>
        
        {results.some(r => r.status === 'error') && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-900 mb-2">Troubleshooting:</h3>
            <ul className="text-sm text-red-800 space-y-1">
              <li>• Check if your Supabase project is active and not paused</li>
              <li>• Verify API keys and project URL are correct</li>
              <li>• Ensure network connectivity to Supabase services</li>
              <li>• Check browser console for detailed error messages</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}