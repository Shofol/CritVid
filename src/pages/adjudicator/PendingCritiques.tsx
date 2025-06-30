import AppLayout from "@/components/AppLayout";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../contexts/AppContext";
import { getAdjudicatorCritiques } from "../../lib/critiqueService";
import { getAdjudicatorByUserId } from "../../services/adjudicatorService";
import { Critique } from "../../types/critiqueTypes";

const PendingCritiques: React.FC = () => {
  const [pendingCritiques, setPendingCritiques] = useState<Critique[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useApp();

  useEffect(() => {
    const fetchPendingCritiques = async () => {
      const adjudicator = await getAdjudicatorByUserId(user.id);

      if (adjudicator) {
        try {
          setLoading(true);
          // Get the adjudicator ID from the user's profile or context
          // For now, we'll use the user ID as adjudicator ID
          const data = await getAdjudicatorCritiques(
            adjudicator.id,
            null,
            "pending"
          );
          setPendingCritiques(data);
        } catch (error) {
          console.error("Error fetching pending critiques:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchPendingCritiques();
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <div className="container mx-auto py-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Pending Critiques</h1>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">
              Videos Awaiting Your Feedback
            </h2>
            <p className="text-gray-600">
              These videos have been assigned to you for critique
            </p>
          </div>

          <div className="divide-y">
            {pendingCritiques.length > 0 ? (
              pendingCritiques.map((critique) => (
                <div
                  key={critique.id}
                  className="p-4 flex justify-between items-center hover:bg-gray-50"
                >
                  <div>
                    <h3 className="font-medium">
                      {critique.title || "Untitled Video"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Student:{" "}
                      {critique.student ||
                        critique.user?.full_name ||
                        "Unknown Student"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Dance Style:{" "}
                      {critique.video?.dance_style_name || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Requested:{" "}
                      {critique.requestedAt
                        ? new Date(critique.requestedAt).toLocaleDateString()
                        : "Unknown"}{" "}
                      • Due: {critique.dueDate || "No due date set"}
                    </p>
                    {critique.price && (
                      <p className="text-sm text-green-600 font-medium">
                        Price: ${critique.price}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      to={`/video-editor?critiqueId=${critique.id}`}
                      className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-primary/90"
                    >
                      Start Video Editor
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p>You don't have any pending critiques at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default PendingCritiques;
