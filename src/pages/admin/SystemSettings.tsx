import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/components/AppLayout';

const SystemSettings: React.FC = () => {
  // General settings
  const [siteName, setSiteName] = useState('CritVid');
  const [supportEmail, setSupportEmail] = useState('support@critvid.com');
  const [maxFileSize, setMaxFileSize] = useState('500');
  
  // Feature toggles
  const [aiSuggestionsEnabled, setAiSuggestionsEnabled] = useState(true);
  const [autoTranscriptionEnabled, setAutoTranscriptionEnabled] = useState(true);
  const [videoRecordingEnabled, setVideoRecordingEnabled] = useState(true);
  const [publicProfilesEnabled, setPublicProfilesEnabled] = useState(false);
  
  // Payment settings
  const [platformFeePercentage, setPlatformFeePercentage] = useState('15');
  const [minimumPayout, setMinimumPayout] = useState('50');
  const [payoutSchedule, setPayoutSchedule] = useState('biweekly');
  
  // Email settings
  const [welcomeEmailEnabled, setWelcomeEmailEnabled] = useState(true);
  const [critiqueDoneEmailEnabled, setCritiqueDoneEmailEnabled] = useState(true);
  const [weeklyDigestEnabled, setWeeklyDigestEnabled] = useState(false);

  const handleSaveGeneral = () => {
    console.log('Saving general settings...');
    // In a real app, this would send the data to your backend
  };

  const handleSaveFeatures = () => {
    console.log('Saving feature toggles...');
    // In a real app, this would send the data to your backend
  };

  const handleSavePayment = () => {
    console.log('Saving payment settings...');
    // In a real app, this would send the data to your backend
  };

  const handleSaveEmail = () => {
    console.log('Saving email settings...');
    // In a real app, this would send the data to your backend
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">System Settings</h1>
        
        <Tabs defaultValue="general">
          <TabsList className="mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
          </TabsList>
          
          {/* General Settings */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure basic platform settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="site-name">Site Name</Label>
                    <Input 
                      id="site-name" 
                      value={siteName} 
                      onChange={(e) => setSiteName(e.target.value)} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="support-email">Support Email</Label>
                    <Input 
                      id="support-email" 
                      type="email"
                      value={supportEmail} 
                      onChange={(e) => setSupportEmail(e.target.value)} 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="max-file-size">Maximum File Size (MB)</Label>
                  <Input 
                    id="max-file-size" 
                    type="number"
                    value={maxFileSize} 
                    onChange={(e) => setMaxFileSize(e.target.value)} 
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveGeneral}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Feature Toggles */}
          <TabsContent value="features">
            <Card>
              <CardHeader>
                <CardTitle>Feature Toggles</CardTitle>
                <CardDescription>
                  Enable or disable platform features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FeatureToggle 
                  label="AI Exercise Suggestions" 
                  description="Allow adjudicators to generate AI-powered exercise suggestions"
                  checked={aiSuggestionsEnabled}
                  onCheckedChange={setAiSuggestionsEnabled}
                />
                
                <Separator />
                
                <FeatureToggle 
                  label="Automatic Transcription" 
                  description="Automatically generate text transcripts of audio critiques"
                  checked={autoTranscriptionEnabled}
                  onCheckedChange={setAutoTranscriptionEnabled}
                />
                
                <Separator />
                
                <FeatureToggle 
                  label="In-App Video Recording" 
                  description="Allow users to record videos directly in the app"
                  checked={videoRecordingEnabled}
                  onCheckedChange={setVideoRecordingEnabled}
                />
                
                <Separator />
                
                <FeatureToggle 
                  label="Public Profiles" 
                  description="Allow adjudicators to have public profiles viewable by non-registered users"
                  checked={publicProfilesEnabled}
                  onCheckedChange={setPublicProfilesEnabled}
                />
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveFeatures}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Payment Settings */}
          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle>Payment Settings</CardTitle>
                <CardDescription>
                  Configure payment and payout options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="platform-fee">Platform Fee Percentage (%)</Label>
                  <Input 
                    id="platform-fee" 
                    type="number"
                    value={platformFeePercentage} 
                    onChange={(e) => setPlatformFeePercentage(e.target.value)} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="min-payout">Minimum Payout Amount ($)</Label>
                  <Input 
                    id="min-payout" 
                    type="number"
                    value={minimumPayout} 
                    onChange={(e) => setMinimumPayout(e.target.value)} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="payout-schedule">Payout Schedule</Label>
                  <select 
                    id="payout-schedule"
                    className="w-full p-2 rounded-md border border-input bg-background"
                    value={payoutSchedule}
                    onChange={(e) => setPayoutSchedule(e.target.value)}
                  >
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSavePayment}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Email Settings */}
          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>
                  Configure automated email notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FeatureToggle 
                  label="Welcome Email" 
                  description="Send welcome email to new users upon registration"
                  checked={welcomeEmailEnabled}
                  onCheckedChange={setWelcomeEmailEnabled}
                />
                
                <Separator />
                
                <FeatureToggle 
                  label="Critique Completion Notification" 
                  description="Notify users when their critique is completed"
                  checked={critiqueDoneEmailEnabled}
                  onCheckedChange={setCritiqueDoneEmailEnabled}
                />
                
                <Separator />
                
                <FeatureToggle 
                  label="Weekly Activity Digest" 
                  description="Send weekly summary of platform activity to users"
                  checked={weeklyDigestEnabled}
                  onCheckedChange={setWeeklyDigestEnabled}
                />
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveEmail}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

interface FeatureToggleProps {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const FeatureToggle: React.FC<FeatureToggleProps> = ({ 
  label, 
  description, 
  checked, 
  onCheckedChange 
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <div className="font-medium">{label}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
};

export default SystemSettings;
