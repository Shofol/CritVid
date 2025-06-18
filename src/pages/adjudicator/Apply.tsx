import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as z from "zod";

import FullExaminerAgreement from "@/components/adjudicator/FullExaminerAgreement";
import HeadshotUploader from "@/components/adjudicator/HeadshotUploader";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { CREATE_ADJUDICATOR_PROFILE_FUNCTION } from "../../config/constants";
import { useApp } from "../../contexts/AppContext";
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
  termsAccepted: z.boolean(),
  headshot: z.string().optional(),
  location: z.string().min(1, { message: "Location is required" }),
});

const AdjudicatorApply: React.FC = () => {
  const navigate = useNavigate();
  const [agreementDialogOpen, setAgreementDialogOpen] = useState(false);
  const [agreementSigned, setAgreementSigned] = useState(false);
  const [headshotUrl, setHeadshotUrl] = useState<string>("");
  const [headshotFile, setHeadshotFile] = useState<File | null>(null);
  const [certificates, setCertificates] = useState<
    Array<{ title: string; issuer: string; issue_date: string }>
  >([]);
  const [danceStyles, setDanceStyles] = useState<number[]>([]);
  const [allDanceStyles, setAllDanceStyles] = useState<DanceStyle[]>([]);
  const { user } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchDanceStyles = async () => {
      const { data, error } = await supabase.from("dance_styles").select("*");
      if (error) {
        console.error("Error fetching dance styles:", error);
      } else {
        setAllDanceStyles(data);
      }
    };
    fetchDanceStyles();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.user_metadata?.full_name || "",
      email: user?.email || "",
      experience: "",
      dance_styles: [],
      certificates: [],
      exp_years: "",
      ppc: "",
      turnaround_days: "",
      termsAccepted: false,
      headshot: "",
      location: "",
    },
  });

  const handleAgreementAccept = (data: {
    fullName: string;
    agreed: boolean;
    date: string;
  }) => {
    if (data.agreed) {
      setAgreementSigned(true);
      form.setValue("termsAccepted", true);
      setAgreementDialogOpen(false);

      if (!form.getValues("name") && data.fullName) {
        form.setValue("name", data.fullName);
      }

      toast({
        title: "Agreement Accepted",
        description: "You have successfully accepted the examiner agreement.",
      });
    }
  };

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

      const response = await fetch(CREATE_ADJUDICATOR_PROFILE_FUNCTION, {
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
        throw new Error(error.message || "Failed to submit application");
      }

      toast({
        title: "Application Submitted",
        description:
          "Your application to become an adjudicator has been submitted. We will review it shortly.",
      });

      navigate("/adjudicator/application-status");
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Submission Failed",
        description:
          error.message ||
          "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-8">
        <Card className=" mx-auto">
          <CardHeader>
            <CardTitle>Apply to become an Adjudicator</CardTitle>
            <CardDescription>
              Share your expertise and earn by providing valuable critiques to
              dancers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="mb-6 border border-dashed border-gray-300 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-4">Profile Photo</h3>
                  <HeadshotUploader onUploadComplete={handleHeadshotUpload} />
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
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="jane.doe@example.com"
                            {...field}
                          />
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
                          Your location will help dancers find adjudicators in
                          their area
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
                        <div
                          key={style.id}
                          className="flex items-center space-x-2"
                        >
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
                        <FormDescription>
                          Minimum $50 per critique
                        </FormDescription>
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
                            updateCertificate(
                              index,
                              "issue_date",
                              e.target.value
                            )
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
                          You must review and sign the full agreement before
                          submitting your application
                        </FormDescription>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2"
                    disabled={!agreementSigned}
                  >
                    {isSubmitting && (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    )}
                    <span> Submit Application</span>
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-muted-foreground">
            <p>
              ID verification will be required if your application is approved
            </p>
          </CardFooter>
        </Card>
      </div>

      <Dialog open={agreementDialogOpen} onOpenChange={setAgreementDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
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
