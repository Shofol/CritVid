import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import AppLayout from '@/components/AppLayout';

const ApplicationStatus: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="container mx-auto py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Application Submitted</CardTitle>
            <CardDescription>
              Thank you for applying to become an adjudicator
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p>
              Your application has been received and is currently under review. Our team will carefully evaluate your credentials and experience.
            </p>
            <p className="text-sm text-muted-foreground">
              This process typically takes 3-5 business days. You will receive an email notification once a decision has been made.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate('/')}
            >
              Return to Home
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              If you have any questions about your application, please contact support.
            </p>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ApplicationStatus;