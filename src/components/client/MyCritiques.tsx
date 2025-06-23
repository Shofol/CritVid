import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Eye, Star, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../contexts/AppContext";
import { getUserCritiques } from "../../lib/critiqueService";
import { Critique } from "../../types/critiqueTypes";

const MyCritiques: React.FC = () => {
  const [critiques, setCritiques] = useState<Critique[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useApp();

  useEffect(() => {
    const fetchCritiques = async () => {
      try {
        const data = await getUserCritiques(user.id);
        setCritiques(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch critiques:", error);
        setCritiques([]);
        setLoading(false);
      }
    };

    fetchCritiques();
  }, [user]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="default">Completed</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "awaiting_approval":
        return <Badge variant="outline">Awaiting Approval</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">🎥 My Critiques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">🎥 My Critiques</CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Final critique videos with overlays, audio feedback, and drawings from
          adjudicators.
        </p>
      </CardHeader>
      <CardContent>
        {critiques.length > 0 ? (
          <div className="space-y-4">
            {critiques.map((critique) => (
              <div
                key={critique.id}
                className="border rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium">
                      {critique.video?.title || critique.title || "Untitled"}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {critique.adjudicator?.name || "Unknown Adjudicator"}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {critique.created_at
                          ? new Date(critique.created_at).toLocaleDateString()
                          : "Unknown Date"}
                      </span>
                      {critique.review?.rating && (
                        <span className="flex items-center">
                          <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                          {critique.review.rating}/5
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(critique.status || "unknown")}
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-3">
                  {critique.status !== "pending" && (
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/client/view-critique/${critique.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Critique
                      </Link>
                    </Button>
                  )}
                  {critique.status === "completed" && !critique.review && (
                    <Button size="sm">
                      <Star className="h-4 w-4 mr-2" />
                      Approve and Rate
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No critiques received yet.</p>
            <Button className="mt-4" asChild>
              <Link to="/find-adjudicator">Request Your First Critique</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MyCritiques;
