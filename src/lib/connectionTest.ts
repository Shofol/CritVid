import { supabase } from '@/lib/supabase';

export interface ConnectionTestResult {
  service: string;
  status: 'connected' | 'error' | 'testing';
  message: string;
  details?: any;
}

export async function testDatabaseConnection(): Promise<ConnectionTestResult> {
  try {
    // Test basic database connectivity
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      return {
        service: 'database',
        status: 'error',
        message: `Database error: ${error.message}`,
        details: error
      };
    }
    
    return {
      service: 'database',
      status: 'connected',
      message: 'Database connection successful'
    };
  } catch (error) {
    return {
      service: 'database',
      status: 'error',
      message: `Database connection failed: ${error}`,
      details: error
    };
  }
}

export async function testStorageConnection(): Promise<ConnectionTestResult> {
  try {
    const { data, error } = await supabase.storage.listBuckets();
    
    if (error) {
      return {
        service: 'storage',
        status: 'error',
        message: `Storage error: ${error.message}`,
        details: error
      };
    }
    
    return {
      service: 'storage',
      status: 'connected',
      message: `Storage connected - Found ${data.length} buckets`,
      details: data.map(bucket => bucket.name)
    };
  } catch (error) {
    return {
      service: 'storage',
      status: 'error',
      message: `Storage connection failed: ${error}`,
      details: error
    };
  }
}

export async function testAuthConnection(): Promise<ConnectionTestResult> {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      return {
        service: 'auth',
        status: 'error',
        message: `Auth error: ${error.message}`,
        details: error
      };
    }
    
    return {
      service: 'auth',
      status: 'connected',
      message: session ? 'User authenticated' : 'Auth service ready',
      details: { hasSession: !!session }
    };
  } catch (error) {
    return {
      service: 'auth',
      status: 'error',
      message: `Auth connection failed: ${error}`,
      details: error
    };
  }
}

export async function testFunctionsConnection(): Promise<ConnectionTestResult> {
  try {
    // Test with a known function endpoint
    const response = await fetch(
      'https://tasowytszirhdvdiwuia.supabase.co/functions/v1/233f6b37-658c-4c8c-bf8f-210cbec2dc06',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabase.supabaseKey}`
        },
        body: JSON.stringify({ test: true })
      }
    );
    
    if (!response.ok) {
      return {
        service: 'functions',
        status: 'error',
        message: `Functions HTTP ${response.status}: ${response.statusText}`,
        details: { status: response.status, statusText: response.statusText }
      };
    }
    
    return {
      service: 'functions',
      status: 'connected',
      message: 'Edge functions accessible',
      details: { status: response.status }
    };
  } catch (error) {
    return {
      service: 'functions',
      status: 'error',
      message: `Functions connection failed: ${error}`,
      details: error
    };
  }
}

export async function runFullConnectionTest(): Promise<ConnectionTestResult[]> {
  const tests = [
    testDatabaseConnection(),
    testStorageConnection(),
    testAuthConnection(),
    testFunctionsConnection()
  ];
  
  return Promise.all(tests);
}