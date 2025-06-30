import AppLayout from "@/components/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Eye, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../contexts/AppContext";
import { getAdjudicatorCritiqueFeedbacks } from "../../lib/critiqueService";
import { getAdjudicatorByUserId } from "../../services/adjudicatorService";
import { CritiqueFeedback } from "../../types/critiqueTypes";

const CompletedCritiques: React.FC = () => {
  const [completedCritiques, setCompletedCritiques] = useState<
    CritiqueFeedback[]
  >([]);
  const [approvingCritiques, setApprovingCritiques] = useState<
    CritiqueFeedback[]
  >([]);
  const [loading, setLoading] = useState(true);
  const { user } = useApp();

  useEffect(() => {
    const fetchCritiques = async () => {
      try {
        setLoading(true);
        const adjudicator = await getAdjudicatorByUserId(user.id);

        if (adjudicator) {
          // Fetch both completed and approving critiques
          const [completedData, approvingData] = await Promise.all([
            getAdjudicatorCritiqueFeedbacks(adjudicator.id, null, "completed"),
            getAdjudicatorCritiqueFeedbacks(adjudicator.id, null, "approving"),
          ]);

          setCompletedCritiques(completedData);
          setApprovingCritiques(approvingData);
        }
      } catch (error) {
        console.error("Error fetching critiques:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCritiques();
  }, [user.id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const CritiqueCard: React.FC<{ critiqueFeedback: CritiqueFeedback }> = ({
    critiqueFeedback,
  }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg">
              {critiqueFeedback.client_video.title || "Untitled Video"}
            </CardTitle>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>
                  {critiqueFeedback.user?.full_name || "Unknown Student"}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>
                  Completed:{" "}
                  {formatDate(
                    critiqueFeedback.completion_date ||
                      critiqueFeedback.created_at
                  )}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="default" className="text-xs">
              {critiqueFeedback.client_video?.dance_style.name ||
                "Unknown Style"}
            </Badge>
            {critiqueFeedback.critique.price && (
              <Badge variant="outline" className="text-xs">
                ${critiqueFeedback.critique.price}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {/* {critiqueFeedback.video?.feedback_requested && (
              <p className="mb-2">
                <strong>Requested:</strong> {critiqueFeedback.video.feedback_requested}
              </p>
            )} */}
            {critiqueFeedback.review && (
              <div className="flex items-center space-x-2">
                <span>Rating: {critiqueFeedback.review.rating} ⭐</span>
                {critiqueFeedback.review.review && (
                  <span className="text-gray-500">
                    • "{critiqueFeedback.review.review.substring(0, 50)}..."
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" asChild>
              <Link
                to={`/adjudicator/view-critique-feedback/${critiqueFeedback.id}`}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Feedback
              </Link>
            </Button>
            {critiqueFeedback.review && critiqueFeedback.review.id && (
              <Button variant="outline" size="sm" asChild>
                <Link
                  to={`/adjudicator/review-critique/${critiqueFeedback.review.id}`}
                >
                  Edit Feedback
                </Link>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const EmptyState: React.FC<{ title: string; description: string }> = ({
    title,
    description,
  }) => (
    <Card>
      <CardContent className="text-center py-12">
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <Calendar className="h-8 w-8 text-gray-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {title}
            </h3>
            <p className="text-gray-600 mb-4">{description}</p>
            <Button asChild>
              <Link to="/adjudicator/pending-critiques">
                View Pending Critiques
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <AppLayout>
        <div className="container mx-auto py-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Critique Feedback</h1>
            <p className="text-gray-600 mt-1">
              View your completed critiques and feedback awaiting approval
            </p>
          </div>
        </div>

        <Tabs defaultValue="completed" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger
              value="completed"
              className="flex items-center space-x-2"
            >
              <span>Completed</span>
              <Badge variant="secondary" className="text-xs">
                {completedCritiques.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="approving"
              className="flex items-center space-x-2"
            >
              <span>Approving</span>
              <Badge variant="secondary" className="text-xs">
                {approvingCritiques.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="completed" className="space-y-4">
            {completedCritiques.length > 0 ? (
              completedCritiques.map((critique) => (
                <CritiqueCard key={critique.id} critiqueFeedback={critique} />
              ))
            ) : (
              <EmptyState
                title="No Completed Critiques Yet"
                description="You haven't completed any critiques yet. Start by reviewing pending critiques."
              />
            )}
          </TabsContent>

          <TabsContent value="approving" className="space-y-4">
            {approvingCritiques.length > 0 ? (
              approvingCritiques.map((critique) => (
                <CritiqueCard key={critique.id} critiqueFeedback={critique} />
              ))
            ) : (
              <EmptyState
                title="No Critiques Awaiting Approval"
                description="You don't have any critiques currently awaiting approval."
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default CompletedCritiques;
