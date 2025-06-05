import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import AppLayout from '@/components/AppLayout';
import HeadshotUploader from '@/components/adjudicator/HeadshotUploader';
import SocialMediaLinks from '@/components/adjudicator/SocialMediaLinks';
import AccreditationsTags from '@/components/adjudicator/AccreditationsTags';
import { useAdjudicatorProfile } from '@/hooks/useAdjudicatorProfile';
import { LoadingButton } from '@/components/ui/loading-button';

const ProfileEditor: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const { profile, loading, error, updateProfile } = useAdjudicatorProfile(userId);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    credentials: '',
    biography: '',
    years_experience: '',
    accreditations: [] as string[],
    social_media: {} as Record<string, string>,
    headshot_url: ''
  });

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUserId(data.user.id);
      } else {
        // Handle not authenticated
        toast({
          title: 'Authentication required',
          description: 'Please sign in to edit your profile',
          variant: 'destructive'
        });
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate, toast]);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        credentials: profile.credentials || '',
        biography: profile.biography || '',
        years_experience: profile.years_experience || '',
        accreditations: profile.accreditations || [],
        social_media: profile.social_media || {},
        headshot_url: profile.headshot_url || ''
      });
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialMediaChange = (socialMedia: Record<string, string>) => {
    setFormData(prev => ({ ...prev, social_media: socialMedia }));
  };

  const handleAccreditationsChange = (accreditations: string[]) => {
    setFormData(prev => ({ ...prev, accreditations }));
  };

  const handleHeadshotUpload = (url: string) => {
    setFormData(prev => ({ ...prev, headshot_url: url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateProfile({
        full_name: formData.full_name,
        credentials: formData.credentials,
        biography: formData.biography,
        years_experience: formData.years_experience,
        accreditations: formData.accreditations,
        social_media: formData.social_media,
        headshot_url: formData.headshot_url
      });

      toast({
        title: 'Profile updated',
        description: 'Your changes have been saved successfully.'
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Update failed',
        description: error instanceof Error ? error.message : 'Failed to update profile',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="container mx-auto py-6">
          <h1 className="text-3xl font-bold mb-6">Loading profile...</h1>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="container mx-auto py-6">
          <h1 className="text-3xl font-bold mb-6">Error loading profile</h1>
          <p className="text-red-500">{error.message}</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Edit Adjudicator Profile</h1>
          <LoadingButton 
            onClick={() => navigate('/adjudicator/dashboard')} 
            variant="outline"
          >
            Back to Dashboard
          </LoadingButton>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Update your personal and professional information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="credentials">Credentials</Label>
                  <Input
                    id="credentials"
                    name="credentials"
                    value={formData.credentials}
                    onChange={handleInputChange}
                    placeholder="Your professional credentials"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="years_experience">Years of Experience</Label>
                  <Input
                    id="years_experience"
                    name="years_experience"
                    value={formData.years_experience}
                    onChange={handleInputChange}
                    placeholder="e.g., 15 years"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="biography">Biography</Label>
                <Textarea
                  id="biography"
                  name="biography"
                  value={formData.biography}
                  onChange={handleInputChange}
                  placeholder="Tell us about your background, experience, and approach to dance critiques"
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Headshot</CardTitle>
                <CardDescription>
                  Upload a professional photo for your profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <HeadshotUploader 
                  currentUrl={formData.headshot_url}
                  onUploadComplete={handleHeadshotUpload} 
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Accreditations</CardTitle>
                <CardDescription>
                  Add your dance certifications and accreditations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AccreditationsTags
                  accreditations={formData.accreditations}
                  onChange={handleAccreditationsChange}
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>
                Connect your social media profiles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SocialMediaLinks
                socialMedia={formData.social_media}
                onChange={handleSocialMediaChange}
              />
            </CardContent>
          </Card>

          <div className="flex justify-between items-center">
            <LoadingButton 
              type="submit" 
              isLoading={isSaving}
              loadingText="Saving..."
              className="w-full md:w-auto"
            >
              Save Profile
            </LoadingButton>
            {profile?.last_updated && (
              <p className="text-sm text-muted-foreground">
                Last updated: {new Date(profile.last_updated).toLocaleString()}
              </p>
            )}
          </div>
        </form>
      </div>
    </AppLayout>
  );
};

export default ProfileEditor;
