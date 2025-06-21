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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VideoSelectionModal } from "@/components/video-library/VideoSelectionModal";
// import { mockData } from "@/data/mockData";
import { getAdjudicators } from "@/services/adjudicatorService";
import { Adjudicator } from "@/types/adjudicator";
import {
  Award,
  Eye,
  Loader2,
  MapPin,
  Search,
  Send,
  Star,
  X,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
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

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDanceStyle, setSelectedDanceStyle] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const videoId = searchParams.get("video");

  // Get unique dance styles, locations for filter options
  const danceStyles = useMemo(() => {
    const styles = new Set<string>();
    adjudicators.forEach((adjudicator) => {
      adjudicator.dance_styles.forEach((style) => styles.add(style.name));
    });
    return Array.from(styles).sort();
  }, [adjudicators]);

  const locations = useMemo(() => {
    const locs = new Set<string>();
    adjudicators.forEach((adjudicator) => {
      locs.add(adjudicator.location);
    });
    return Array.from(locs).sort();
  }, [adjudicators]);

  // Filter adjudicators based on search and filter criteria
  const filteredAdjudicators = useMemo(() => {
    return adjudicators.filter((adjudicator) => {
      // Name search
      if (
        searchTerm &&
        !adjudicator.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Dance style filter
      if (
        selectedDanceStyle !== "all" &&
        !adjudicator.dance_styles.some(
          (style) => style.name === selectedDanceStyle
        )
      ) {
        return false;
      }

      // Rating filter
      if (selectedRating !== "all") {
        const minRating = parseFloat(selectedRating);
        if (adjudicator.rating < minRating) {
          return false;
        }
      }

      // Location filter
      if (
        selectedLocation !== "all" &&
        adjudicator.location !== selectedLocation
      ) {
        return false;
      }

      return true;
    });
  }, [
    adjudicators,
    searchTerm,
    selectedDanceStyle,
    selectedRating,
    selectedLocation,
  ]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedDanceStyle("all");
    setSelectedRating("all");
    setSelectedLocation("all");
  };

  const hasActiveFilters =
    searchTerm ||
    selectedDanceStyle !== "all" ||
    selectedRating !== "all" ||
    selectedLocation !== "all";

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

        {/* Search and Filter Section */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search adjudicators by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4"
            />
          </div>

          {/* Filter Toggle and Active Filters */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <span>Filters</span>
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-1">
                  {
                    [
                      searchTerm,
                      selectedDanceStyle !== "all" ? selectedDanceStyle : null,
                      selectedRating !== "all" ? selectedRating : null,
                      selectedLocation !== "all" ? selectedLocation : null,
                    ].filter(Boolean).length
                  }
                </Badge>
              )}
            </Button>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4 mr-1" />
                Clear all
              </Button>
            )}
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Name: {searchTerm}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => setSearchTerm("")}
                  />
                </Badge>
              )}
              {selectedDanceStyle !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Style: {selectedDanceStyle}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => setSelectedDanceStyle("all")}
                  />
                </Badge>
              )}
              {selectedRating !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Rating: {selectedRating}+
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => setSelectedRating("all")}
                  />
                </Badge>
              )}
              {selectedLocation !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Location: {selectedLocation}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => setSelectedLocation("all")}
                  />
                </Badge>
              )}
            </div>
          )}

          {/* Filter Options */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="dance-style">Dance Style</Label>
                <Select
                  value={selectedDanceStyle}
                  onValueChange={setSelectedDanceStyle}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All styles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All styles</SelectItem>
                    {danceStyles.map((style) => (
                      <SelectItem key={style} value={style}>
                        {style}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rating">Minimum Rating</Label>
                <Select
                  value={selectedRating}
                  onValueChange={setSelectedRating}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any rating</SelectItem>
                    <SelectItem value="4.5">4.5+ stars</SelectItem>
                    <SelectItem value="4.0">4.0+ stars</SelectItem>
                    <SelectItem value="3.5">3.5+ stars</SelectItem>
                    <SelectItem value="3.0">3.0+ stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select
                  value={selectedLocation}
                  onValueChange={setSelectedLocation}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All locations</SelectItem>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="text-sm text-gray-600">
            Showing {filteredAdjudicators.length} of {adjudicators.length}{" "}
            adjudicators
          </div>
        </div>

        {filteredAdjudicators.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              {hasActiveFilters
                ? "No adjudicators match your search criteria. Try adjusting your filters."
                : "No adjudicators available at the moment."}
            </p>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters}>
                Clear all filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAdjudicators.map((adjudicator) => (
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
            // videos={mockData.videos}
            selectedAdjudicator={selectedAdjudicator}
          />
        )}
      </div>
    </AppLayout>
  );
};

export default FindAdjudicator;
