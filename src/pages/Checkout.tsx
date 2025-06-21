import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { CreditCard, Play, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { assignCritique } from "../lib/critiqueService";
import { fetchDanceStyles, fetchVideoById } from "../lib/videoService";
import { getAdjudicatorById } from "../services/adjudicatorService";
import { Adjudicator } from "../types/adjudicator";
import { DanceStyle, Video } from "../types/videoLibrary";

const Checkout: React.FC = () => {
  const { videoId, adjudicatorId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState("existing");
  const [isProcessing, setIsProcessing] = useState(false);
  const [video, setVideo] = useState<Video | null>(null);
  const [adjudicator, setAdjudicator] = useState<Adjudicator | null>(null);
  const [danceStyles, setDanceStyles] = useState<DanceStyle[]>([]);
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
  });

  useEffect(() => {
    const getVideo = async () => {
      const video = await fetchVideoById(videoId);
      setVideo(video);
    };

    const getAdjudicator = async () => {
      const adjudicator = await getAdjudicatorById(adjudicatorId);
      console.log(adjudicator);
      setAdjudicator(adjudicator);
    };

    const getDanceStyles = async () => {
      const danceStyles = await fetchDanceStyles();
      setDanceStyles(danceStyles);
    };

    getVideo();
    getAdjudicator();
    getDanceStyles();
  }, [videoId, adjudicatorId]);

  if (!video || !adjudicator) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">
            Video or Adjudicator Not Found
          </h1>
          <Button onClick={() => navigate("/find-adjudicator")}>
            Back to Find Adjudicator
          </Button>
        </div>
      </AppLayout>
    );
  }

  const handlePayment = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to complete your purchase.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Save critique record to database
      const result = await assignCritique(
        user.id,
        adjudicatorId!,
        videoId!,
        adjudicator!.ppc
      );

      if (!result.success) {
        throw new Error(result.error || "Failed to save critique");
      }

      toast({
        title: "Payment Successful",
        description: "Your video has been sent for critique.",
      });

      navigate(`/thank-you?video=${videoId}&adjudicator=${adjudicatorId}`);
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Please try again or use a different payment method.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Selected Video</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <div className="w-24 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <video src={video.video_path}></video>
                    <Play className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{video.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {
                        danceStyles.find(
                          (style) => style.id === video.dance_style
                        )?.name
                      }{" "}
                      • {new Date(video.created_at).toLocaleDateString()}
                    </p>
                    {/* <Badge variant="outline" className="mt-2">
                      {video.status}
                    </Badge> */}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Selected Adjudicator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <img
                    src={adjudicator.headshot}
                    alt={adjudicator.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{adjudicator.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {adjudicator.location}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {adjudicator.experience} years experience
                    </p>
                    {/* <div className="flex flex-wrap gap-1 mt-2">
                      {adjudicator.specialties
                        .slice(0, 3)
                        .map((specialty, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {specialty}
                          </Badge>
                        ))}
                    </div> */}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Critique Fee</span>
                  <span>${adjudicator.ppc}</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Fee</span>
                  <span>$2.50</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${(adjudicator.ppc + 2.5).toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="existing" id="existing" />
                    <Label
                      htmlFor="existing"
                      className="flex items-center gap-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      Use saved card ending in 4242
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="new" id="new" />
                    <Label htmlFor="new" className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Add new payment method
                    </Label>
                  </div>
                </RadioGroup>

                {paymentMethod === "new" && (
                  <div className="space-y-4 pt-4 border-t">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.number}
                        onChange={(e) =>
                          setCardDetails((prev) => ({
                            ...prev,
                            number: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/YY"
                          value={cardDetails.expiry}
                          onChange={(e) =>
                            setCardDetails((prev) => ({
                              ...prev,
                              expiry: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input
                          id="cvc"
                          placeholder="123"
                          value={cardDetails.cvc}
                          onChange={(e) =>
                            setCardDetails((prev) => ({
                              ...prev,
                              cvc: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Cardholder Name</Label>
                      <Input
                        id="cardName"
                        placeholder="John Doe"
                        value={cardDetails.name}
                        onChange={(e) =>
                          setCardDetails((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Button
              onClick={handlePayment}
              className="w-full"
              size="lg"
              disabled={isProcessing}
            >
              {isProcessing
                ? "Processing..."
                : `Confirm & Pay $${(adjudicator.ppc + 2.5).toFixed(2)}`}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              By confirming your payment, you agree to our Terms of Service and
              Privacy Policy. Your video will be sent to the adjudicator for
              critique.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Checkout;
