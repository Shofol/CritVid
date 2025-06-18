import AppLayout from "@/components/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VideoSelectionModal } from "@/components/video-library/VideoSelectionModal";
import { mockData } from "@/data/mockData";
import { getAdjudicators } from "@/services/adjudicatorService";
import { Adjudicator } from "@/types/adjudicator";
import { Award, Eye, Loader2, MapPin, Send, Star } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const FindAdjudicator: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedAdjudicator, setSelectedAdjudicator] =
    useState<Adjudicator | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showVideoSelection, setShowVideoSelection] = useState(false);
  const [adjudicators, setAdjudicators] = useState<Adjudicator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const videoId = searchParams.get("video");

  useEffect(() => {
    const fetchAdjudicators = async () => {
      try {
        setLoading(true);
        const response = await getAdjudicators();
        setAdjudicators(response.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch adjudicators"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAdjudicators();
  }, []);

  const handleViewProfile = (adjudicator: Adjudicator) => {
    setSelectedAdjudicator(adjudicator);
    setShowProfile(true);
  };

  const handleSendVideo = (adjudicator: Adjudicator) => {
    setSelectedAdjudicator(adjudicator);
    if (videoId) {
      // If coming from a specific video, go directly to checkout
      navigate(`/checkout/${videoId}/${adjudicator.id}`);
    } else {
      // Show video selection modal
      setShowVideoSelection(true);
    }
  };

  const handleUploadNew = () => {
    navigate(`/upload-video?adjudicator=${selectedAdjudicator?.id}`);
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Loading adjudicators...</span>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="max-w-6xl mx-auto p-6">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Find an Adjudicator</h1>
          <p className="text-gray-600">
            Choose from our certified dance adjudicators
          </p>
          {videoId && (
            <div className="mt-2 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                Selecting adjudicator for your video
              </p>
            </div>
          )}
        </div>

        {adjudicators.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              No adjudicators available at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adjudicators.map((adjudicator) => (
              <Card
                key={adjudicator.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <img
                      src={adjudicator.headshot || "/default-avatar.png"}
                      alt={adjudicator.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <CardTitle className="text-lg">
                        {adjudicator.name}
                      </CardTitle>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{adjudicator.rating}</span>
                        <span>({adjudicator.review_count} reviews)</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{adjudicator.location}</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {adjudicator.dance_styles.slice(0, 3).map((style) => (
                      <Badge
                        key={style.id}
                        variant="secondary"
                        className="text-xs"
                      >
                        {style.name}
                      </Badge>
                    ))}
                    {adjudicator.dance_styles.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{adjudicator.dance_styles.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Award className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-600">
                      {adjudicator.exp_years} years experience
                    </span>
                  </div>

                  <div className="text-lg font-semibold text-green-600">
                    ${adjudicator.ppc}/critique
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleViewProfile(adjudicator)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Profile
                    </Button>
                    <Button
                      onClick={() => handleSendVideo(adjudicator)}
                      size="sm"
                      className="flex-1"
                    >
                      <Send className="w-4 h-4 mr-1" />
                      {videoId ? "Select" : "Send Video"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Profile Modal */}
        <Dialog open={showProfile} onOpenChange={setShowProfile}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Adjudicator Profile</DialogTitle>
            </DialogHeader>
            {selectedAdjudicator && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedAdjudicator.headshot || "/default-avatar.png"}
                    alt={selectedAdjudicator.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-bold">
                      {selectedAdjudicator.name}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>
                        {selectedAdjudicator.rating} (
                        {selectedAdjudicator.review_count} reviews)
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedAdjudicator.location}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Experience</h4>
                  <p className="text-gray-600">
                    {selectedAdjudicator.experience}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Dance Styles</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedAdjudicator.dance_styles.map((style) => (
                      <Badge key={style.id} variant="secondary">
                        {style.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                {selectedAdjudicator.certificates.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Certificates</h4>
                    <div className="space-y-2">
                      {selectedAdjudicator.certificates.map((cert) => (
                        <div
                          key={cert.id}
                          className="p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="font-medium">{cert.title}</div>
                          <div className="text-sm text-gray-600">
                            {cert.issuer} • {cert.issue_date}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-1">Experience</h4>
                    <p className="text-gray-600">
                      {selectedAdjudicator.exp_years} years
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Rate</h4>
                    <p className="text-green-600 font-semibold">
                      ${selectedAdjudicator.ppc}/critique
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Turnaround Time</h4>
                    <p className="text-gray-600">
                      {selectedAdjudicator.turnaround_days} days
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleSendVideo(selectedAdjudicator)}
                    className="flex-1"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Video for Critique
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Video Selection Modal */}
        {selectedAdjudicator && (
          <VideoSelectionModal
            isOpen={showVideoSelection}
            onClose={() => setShowVideoSelection(false)}
            videos={mockData.videos}
            selectedAdjudicator={selectedAdjudicator}
          />
        )}
      </div>
    </AppLayout>
  );
};

export default FindAdjudicator;
