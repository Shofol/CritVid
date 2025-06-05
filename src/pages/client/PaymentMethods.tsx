import React from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, CreditCard, Trash2 } from 'lucide-react';

interface PaymentMethod {
  id: string;
  type: 'card';
  last4: string;
  brand: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'pm_1',
    type: 'card',
    last4: '4242',
    brand: 'Visa',
    expMonth: 12,
    expYear: 2024,
    isDefault: true
  },
  {
    id: 'pm_2',
    type: 'card',
    last4: '5555',
    brand: 'Mastercard',
    expMonth: 8,
    expYear: 2025,
    isDefault: false
  }
];

const PaymentMethods = () => {
  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Payment Methods</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Your Payment Methods</CardTitle>
            <CardDescription>Manage your saved payment methods</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockPaymentMethods.map((method) => (
                <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <CreditCard className="h-6 w-6 text-gray-500" />
                    <div>
                      <p className="font-medium">{method.brand} •••• {method.last4}</p>
                      <p className="text-sm text-gray-500">Expires {method.expMonth}/{method.expYear}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {method.isDefault && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Default</span>
                    )}
                    {!method.isDefault && (
                      <Button variant="outline" size="sm">Set as Default</Button>
                    )}
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <Button className="mt-6" variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Payment Method
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default PaymentMethods;
