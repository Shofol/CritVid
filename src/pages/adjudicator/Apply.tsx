import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AppLayout from '@/components/AppLayout';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import FullExaminerAgreement from '@/components/adjudicator/FullExaminerAgreement';
import HeadshotUploader from '@/components/adjudicator/HeadshotUploader';

const formSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  credentials: z.string().min(50, { message: 'Please provide detailed credentials (min 50 characters).' }),
  danceStyles: z.string().min(2, { message: 'Please enter at least one dance style.' }),
  certifications: z.string().optional(),
  yearsOfExperience: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 1, {
    message: 'Please enter valid years of experience (minimum 1 year).'
  }),
  socialMediaLinks: z.string().optional(),
  price: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 50, {
    message: 'Price must be at least $50.'
  }),
  expectedTurnaround: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 1 && Number(val) <= 21, {
    message: 'Expected turnaround must be between 1 and 21 days.'
  }),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the examiner agreement to proceed.' }),
  }),
  headshot: z.string().optional(),
});

const AdjudicatorApply: React.FC = () => {
  const navigate = useNavigate();
  const [agreementDialogOpen, setAgreementDialogOpen] = useState(false);
  const [agreementSigned, setAgreementSigned] = useState(false);
  const [headshotUrl, setHeadshotUrl] = useState<string>('');
  
  const form = useForm<z.infer<typeof formSchema>>({  
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      credentials: '',
      danceStyles: '',
      certifications: '',
      yearsOfExperience: '',
      socialMediaLinks: '',
      price: '',
      expectedTurnaround: '',
      termsAccepted: false,
      headshot: '',
    },
  });

  const handleAgreementAccept = (data: { fullName: string; agreed: boolean; date: string }) => {
    if (data.agreed) {
      setAgreementSigned(true);
      form.setValue('termsAccepted', true);
      setAgreementDialogOpen(false);
      
      // If name field is empty, populate it with the name from the agreement
      if (!form.getValues('fullName') && data.fullName) {
        form.setValue('fullName', data.fullName);
      }
      
      toast({
        title: "Agreement Accepted",
        description: "You have successfully accepted the examiner agreement."
      });
    }
  };

  const handleHeadshotUpload = (url: string) => {
    setHeadshotUrl(url);
    form.setValue('headshot', url);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // In a real app, this would use the authenticated user's ID
      const mockUserId = 'mock-user-id';
      
      const { error } = await supabase
        .from('adjudicator_applications')
        .insert({
          user_id: mockUserId,
          full_name: values.fullName,
          email: values.email,
          credentials: values.credentials,
          dance_styles: values.danceStyles.split(',').map(style => style.trim()),
          certifications: values.certifications,
          years_of_experience: parseInt(values.yearsOfExperience),
          social_media_links: values.socialMediaLinks,
          price: parseFloat(values.price),
          expected_turnaround: parseInt(values.expectedTurnaround),
          terms_accepted: values.termsAccepted,
          agreement_signed_date: new Date().toISOString(),
          headshot_url: headshotUrl,
        });

      if (error) throw error;

      toast({
        title: 'Application Submitted',
        description: 'Your application to become an adjudicator has been submitted. We will review it shortly.',
      });

      navigate('/adjudicator/application-status');
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: 'Submission Failed',
        description: 'There was an error submitting your application. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Apply to become an Adjudicator</CardTitle>
            <CardDescription>
              Share your expertise and earn by providing valuable critiques to dancers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-4">Profile Photo</h3>
                  <HeadshotUploader onUploadComplete={handleHeadshotUpload} />
                  <p className="text-sm text-muted-foreground mt-2">
                    Your headshot will be visible to dancers looking for adjudicators.
                  </p>
                </div>
                
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Jane Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="jane.doe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="credentials"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Credentials & Experience</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your dance background, teaching experience, certifications, etc." 
                          {...field} 
                          className="min-h-[120px]"
                        />
                      </FormControl>
                      <FormDescription>
                        Please provide detailed information about your qualifications and experience.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="danceStyles"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dance Styles</FormLabel>
                      <FormControl>
                        <Input placeholder="Ballet, Contemporary, Jazz" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter dance styles separated by commas.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="certifications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Certifications</FormLabel>
                      <FormControl>
                        <Input placeholder="RAD, ISTD, BBO, etc." {...field} />
                      </FormControl>
                      <FormDescription>
                        List any dance or teaching certifications you hold.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="yearsOfExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="socialMediaLinks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Social Media or Portfolio Links</FormLabel>
                      <FormControl>
                        <Input placeholder="Instagram, YouTube, personal website, etc." {...field} />
                      </FormControl>
                      <FormDescription>
                        Share links where we can see your work or professional presence.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price per Critique ($)</FormLabel>
                        <FormControl>
                          <Input type="number" min="50" {...field} />
                        </FormControl>
                        <FormDescription>
                          Minimum $50 per critique
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="expectedTurnaround"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expected Turnaround (days)</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" max="21" {...field} />
                        </FormControl>
                        <FormDescription>
                          1-21 days to complete a critique
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="termsAccepted"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={!agreementSigned}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I accept the{" "}
                          <Button 
                            variant="link" 
                            className="p-0 h-auto font-normal" 
                            onClick={(e) => {
                              e.preventDefault();
                              setAgreementDialogOpen(true);
                            }}
                          >
                            VidCrit Examiner Agreement
                          </Button>
                          {agreementSigned && " (Signed)"}
                        </FormLabel>
                        <FormDescription>
                          You must review and sign the full agreement before submitting your application
                        </FormDescription>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={!agreementSigned}
                  >
                    Submit Application
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-muted-foreground">
            <p>ID verification will be required if your application is approved</p>
          </CardFooter>
        </Card>
      </div>

      <Dialog open={agreementDialogOpen} onOpenChange={setAgreementDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>VidCrit Examiner Agreement</DialogTitle>
          </DialogHeader>
          <div className="px-6 pb-6">
            <FullExaminerAgreement 
              onAccept={handleAgreementAccept} 
              onCancel={() => setAgreementDialogOpen(false)} 
            />
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default AdjudicatorApply;