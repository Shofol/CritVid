import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import HeadshotUploader from "@/components/adjudicator/HeadshotUploader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { SAVE_ADJUDICATOR_PROFILE_FUNCTION } from "../../config/constants";
import { DanceStyle } from "../../types/videoLibrary";

const certificateSchema = z.object({
  title: z.string().min(1, "Certificate title is required"),
  issuer: z.string().min(1, "Issuer is required"),
  issue_date: z.string().min(1, "Issue date is required"),
});

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  experience: z.string().min(50, {
    message: "Please provide detailed experience (min 50 characters).",
  }),
  dance_styles: z
    .array(z.number())
    .min(1, { message: "Please select at least one dance style." }),
  certificates: z.array(certificateSchema).optional(),
  exp_years: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 1, {
      message: "Please enter valid years of experience (minimum 1 year).",
    }),
  ppc: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 50, {
    message: "Price must be at least $50.",
  }),
  turnaround_days: z
    .string()
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) >= 1 && Number(val) <= 21,
      {
        message: "Expected turnaround must be between 1 and 21 days.",
      }
    ),
  headshot: z.string().optional(),
  location: z.string().min(1, { message: "Location is required" }),
});

interface AdjudicatorProfileUpdateFormProps {
  onSuccess?: () => void;
}

const AdjudicatorProfileUpdateForm: React.FC<
  AdjudicatorProfileUpdateFormProps
> = ({ onSuccess }) => {
  const [headshotUrl, setHeadshotUrl] = useState<string>("");
  const [headshotFile, setHeadshotFile] = useState<File | null>(null);
  const [certificates, setCertificates] = useState<
    Array<{ title: string; issuer: string; issue_date: string }>
  >([]);
  const [danceStyles, setDanceStyles] = useState<number[]>([]);
  const [allDanceStyles, setAllDanceStyles] = useState<DanceStyle[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      experience: "",
      dance_styles: [],
      certificates: [],
      exp_years: "",
      ppc: "",
      turnaround_days: "",
      headshot: "",
      location: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch dance styles
        const { data: danceStylesData, error: danceStylesError } =
          await supabase.from("dance_styles").select("*");
        if (danceStylesError) {
          console.error("Error fetching dance styles:", danceStylesError);
        } else {
          setAllDanceStyles(danceStylesData);
        }

        // Fetch current adjudicator profile
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const { data: profileData, error: profileError } = await supabase
            .from("adj_profiles")
            .select("*")
            .eq("user_id", user.id)
            .single();

          if (profileData && !profileError) {
            // Set form values
            form.setValue("name", profileData.name || "");
            form.setValue("email", profileData.email || "");
            form.setValue("experience", profileData.experience || "");
            form.setValue("exp_years", profileData.exp_years?.toString() || "");
            form.setValue("ppc", profileData.ppc?.toString() || "");
            form.setValue(
              "turnaround_days",
              profileData.turnaround_days?.toString() || ""
            );
            form.setValue("headshot", profileData.headshot || "");
            form.setValue("location", profileData.location || "");
            setHeadshotUrl(profileData.headshot || "");

            // Fetch dance styles for this adjudicator
            const { data: adjDanceStyles, error: adjDanceStylesError } =
              await supabase
                .from("adj_dance_styles")
                .select("dance_style")
                .eq("adjudicator_id", profileData.id);

            if (adjDanceStyles && !adjDanceStylesError) {
              const styleIds = adjDanceStyles.map((style) => style.dance_style);
              setDanceStyles(styleIds);
              form.setValue("dance_styles", styleIds);
            }

            // Fetch certificates for this adjudicator
            const { data: certData, error: certError } = await supabase
              .from("adjudicator_certificates")
              .select("*")
              .eq("adjudicator_id", profileData.id);

            if (certData && !certError) {
              const certs = certData.map((cert) => ({
                title: cert.title,
                issuer: cert.issuer,
                issue_date: cert.issue_date,
              }));
              setCertificates(certs);
              form.setValue("certificates", certs);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [form]);

  const handleHeadshotUpload = (url: string, file?: File) => {
    setHeadshotUrl(url);
    if (file) {
      setHeadshotFile(file);
    }
    form.setValue("headshot", url, {
      shouldValidate: false,
      shouldDirty: false,
      shouldTouch: false,
    });
  };

  const addCertificate = () => {
    setCertificates([
      ...certificates,
      { title: "", issuer: "", issue_date: "" },
    ]);
  };

  const updateCertificate = (index: number, field: string, value: string) => {
    const newCertificates = [...certificates];
    newCertificates[index] = { ...newCertificates[index], [field]: value };
    setCertificates(newCertificates);
    form.setValue("certificates", newCertificates);
  };

  const removeCertificate = (index: number) => {
    const newCertificates = certificates.filter((_, i) => i !== index);
    setCertificates(newCertificates);
    form.setValue("certificates", newCertificates);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Not authenticated");
      }

      // Convert the file to base64 if it exists
      let base64File = null;
      if (headshotFile) {
        const reader = new FileReader();
        base64File = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(headshotFile);
        });
      }

      const response = await fetch(SAVE_ADJUDICATOR_PROFILE_FUNCTION, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          profile: {
            name: values.name,
            email: values.email,
            experience: values.experience,
            exp_years: parseInt(values.exp_years),
            ppc: parseFloat(values.ppc),
            turnaround_days: parseInt(values.turnaround_days),
            headshot: values.headshot,
            certificates: values.certificates,
            dance_styles: values.dance_styles,
            location: values.location,
          },
          headshotFile: base64File,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update profile");
      }

      const result = await response.json();

      // Update the headshot URL if a new one was uploaded
      if (result.data && result.data.headshot) {
        setHeadshotUrl(result.data.headshot);
        form.setValue("headshot", result.data.headshot);
        // Clear the headshot file since it's been uploaded
        setHeadshotFile(null);
      }

      toast({
        title: "Profile Updated",
        description: "Your adjudicator profile has been updated successfully.",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update Failed",
        description:
          error.message ||
          "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading profile...</span>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Adjudicator Profile</CardTitle>
        <CardDescription>
          Update your adjudicator profile information and settings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="mb-6 border border-dashed border-gray-300 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">Profile Photo</h3>
              <HeadshotUploader
                currentUrl={headshotUrl}
                onUploadComplete={handleHeadshotUpload}
              />
              <p className="text-sm text-muted-foreground text-center mt-2">
                Your headshot will be visible to dancers looking for
                adjudicators.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
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
                disabled={true}
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="City, Country" {...field} />
                    </FormControl>
                    <FormDescription>
                      Your location will help dancers find adjudicators in their
                      area
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="exp_years"
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
            </div>

            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experience & Background</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your dance background, teaching experience, etc."
                      {...field}
                      className="min-h-[120px]"
                    />
                  </FormControl>
                  <FormDescription>
                    Please provide detailed information about your
                    qualifications and experience.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormLabel>Dance Styles</FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
                {allDanceStyles &&
                  allDanceStyles.length > 1 &&
                  allDanceStyles.map((style) => (
                    <div key={style.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${style.id}`}
                        checked={danceStyles.includes(style.id)}
                        onCheckedChange={(checked) => {
                          const newStyles = checked
                            ? [...danceStyles, style.id]
                            : danceStyles.filter((s) => s !== style.id);
                          setDanceStyles(newStyles);
                          form.setValue("dance_styles", newStyles);
                        }}
                      />
                      <label htmlFor={`${style.id}`}>{style.name}</label>
                    </div>
                  ))}
              </div>
              <FormMessage />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="ppc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price per Critique ($)</FormLabel>
                    <FormControl>
                      <Input type="number" min="50" {...field} />
                    </FormControl>
                    <FormDescription>Minimum $50 per critique</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="turnaround_days"
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

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <FormLabel>Certifications</FormLabel>
                  <FormDescription>
                    Add any certifications you have received.
                  </FormDescription>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addCertificate}
                >
                  Add Certificate
                </Button>
              </div>
              {certificates.map((cert, index) => (
                <div
                  key={index}
                  className="grid grid-cols-3 gap-2 p-4 border rounded-lg"
                >
                  <Input
                    placeholder="Certificate Title"
                    value={cert.title}
                    onChange={(e) =>
                      updateCertificate(index, "title", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Issuing Organization"
                    value={cert.issuer}
                    onChange={(e) =>
                      updateCertificate(index, "issuer", e.target.value)
                    }
                  />
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      value={cert.issue_date}
                      onChange={(e) =>
                        updateCertificate(index, "issue_date", e.target.value)
                      }
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => removeCertificate(index)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              <FormMessage />
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full flex items-center justify-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                )}
                <span>Update Profile</span>
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AdjudicatorProfileUpdateForm;
