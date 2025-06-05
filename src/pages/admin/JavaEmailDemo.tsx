import React from 'react';
import SendGridJavaDemo from './SendGridJavaDemo';

const JavaEmailDemo: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-8">SendGrid Java Integration</h1>
      
      <div className="bg-muted p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Setup Instructions</h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            <strong>Create environment variable:</strong>
            <pre className="bg-background p-2 rounded-md mt-1 overflow-auto text-xs">
              {`echo "export SENDGRID_API_KEY='your_sendgrid_api_key_here'" > sendgrid.env
source ./sendgrid.env`}
            </pre>
          </li>
          <li>
            <strong>Add to .gitignore:</strong>
            <pre className="bg-background p-2 rounded-md mt-1 overflow-auto text-xs">
              # SendGrid API key
              sendgrid.env
            </pre>
          </li>
          <li>
            <strong>Add package (for Java projects):</strong>
            <pre className="bg-background p-2 rounded-md mt-1 overflow-auto text-xs">
              {`// In build.gradle
dependencies {
  compile "com.sendgrid:sendgrid-java:4.10.1"
}

repositories {
  mavenCentral()
}

// Or using Maven: mvn install`}
            </pre>
          </li>
          <li>
            <strong>Implementation Notes:</strong>
            <p className="mt-1">
              The demo below uses a Supabase Edge Function that mimics the SendGrid Java SDK approach.
              The API key has been stored as a Supabase secret for the Edge Function.
            </p>
          </li>
        </ol>
      </div>
      
      <SendGridJavaDemo />
    </div>
  );
};

export default JavaEmailDemo;
