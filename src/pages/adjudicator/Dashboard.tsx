import AppLayout from "@/components/AppLayout";
import PendingPayments from "@/components/adjudicator/PendingPayments";
import ProfileEditorLink from "@/components/adjudicator/ProfileEditorLink";
import ProfileStatusCard from "@/components/adjudicator/ProfileStatusCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useApp } from "@/contexts/AppContext";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdjudicatorCritiqueFeedbacks } from "../../lib/critiqueService";
import { getAdjudicatorByUserId } from "../../services/adjudicatorService";
import { Adjudicator } from "../../types/adjudicator";
import { CritiqueFeedback } from "../../types/critiqueTypes";

const AdjudicatorDashboard: React.FC = () => {
  const [profileData, setProfileData] = useState<Adjudicator>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { setUserRole, user } = useApp();
  const [critiques, setCritiques] = useState<CritiqueFeedback[]>([]);
  const [pendingCritiques, setPendingCritiques] = useState<CritiqueFeedback[]>(
    []
  );
  const [completedCritiques, setCompletedCritiques] = useState<
    CritiqueFeedback[]
  >([]);

  useEffect(() => {
    // Set the role to adjudicator for this dashboard
    setUserRole("adjudicator");

    const fetchProfile = async () => {
      try {
        const result = await getAdjudicatorByUserId(user.id);
        setProfileData(result);
        fetchCritiques(result.id);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load your profile data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchCritiques = async (adjudicatorId: string) => {
      try {
        setLoading(true);

        if (adjudicatorId) {
          // Fetch both completed and approving critiques
          const critiques = await getAdjudicatorCritiqueFeedbacks(
            adjudicatorId,
            null,
            null
          );

          setCritiques(critiques);

          const completedData = critiques.filter(
            (critique) => critique.status !== "pending"
          );
          const pendingData = critiques.filter(
            (critique) => critique.status === "pending"
          );

          setCompletedCritiques(completedData);
          setPendingCritiques(pendingData);
        }
      } catch (error) {
        console.error("Error fetching critiques:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user.id) {
      fetchProfile();
    }
  }, [toast, setUserRole, user]);

  const handleStatusChange = (newStatus: boolean) => {
    setProfileData({ ...profileData, is_active: newStatus });
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="container mx-auto py-4">
          <div className="flex items-center justify-center h-32">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-600">Loading dashboard...</span>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto py-4 px-4">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage your critiques and account
            </p>
          </div>
          <ProfileEditorLink />
        </div>

        {/* Account Status Card */}
        <div className="mb-6">
          <ProfileStatusCard
            isActive={profileData?.is_active ?? true}
            adjudicatorId={profileData?.id}
            onStatusChange={handleStatusChange}
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="Total Critiques"
            value={critiques.length.toString()}
            icon="📊"
            color="blue"
          />
          <StatsCard
            title="Average Rating"
            value="4.8"
            icon="⭐"
            color="yellow"
          />
          <StatsCard
            title="Total Earnings"
            value="$2,450"
            icon="💰"
            color="green"
          />
          <StatsCard
            title="Pending Critiques"
            value={pendingCritiques.length.toString()}
            icon="⏳"
            color="orange"
          />
        </div>

        {/* Main Content Tabs */}
        <Card className="shadow-sm border-gray-200">
          <Tabs defaultValue="pending" className="w-full">
            <div className="border-b border-gray-200">
              <TabsList className="bg-transparent border-b-0 rounded-none h-12">
                <TabsTrigger
                  value="pending"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none"
                >
                  Pending Critiques ({pendingCritiques.length})
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none"
                >
                  Completed Critiques ({completedCritiques.length})
                </TabsTrigger>
                <TabsTrigger
                  value="payments"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none"
                >
                  Payments
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="pending" className="mt-0">
                {pendingCritiques.length > 0 ? (
                  <div className="space-y-3">
                    {pendingCritiques.map((critiqueFeedback) => (
                      <PendingCritiqueCard
                        key={critiqueFeedback.id}
                        critiqueFeedback={critiqueFeedback}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-2">📭</div>
                    <p className="text-gray-600 font-medium">
                      No pending critiques
                    </p>
                    <p className="text-sm text-gray-500">
                      You're all caught up!
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="completed" className="mt-0">
                {completedCritiques.length > 0 ? (
                  <div className="space-y-3">
                    {completedCritiques.map((critiqueFeedback) => (
                      <CompletedCritiqueCard
                        key={critiqueFeedback.id}
                        critiqueFeedback={critiqueFeedback}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-2">📋</div>
                    <p className="text-gray-600 font-medium">
                      No completed critiques yet
                    </p>
                    <p className="text-sm text-gray-500">
                      Start reviewing to see your completed work here
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="payments" className="mt-0">
                <PendingPayments />
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </div>
    </AppLayout>
  );
};

interface StatsCardProps {
  title: string;
  value: string;
  icon: string;
  color: "blue" | "green" | "yellow" | "orange" | "purple";
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    green: "bg-green-50 border-green-200 text-green-700",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-700",
    orange: "bg-orange-50 border-orange-200 text-orange-700",
    purple: "bg-purple-50 border-purple-200 text-purple-700",
  };

  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              {title}
            </p>
            <p className="text-xl font-bold text-gray-900 mt-1">{value}</p>
          </div>
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            <span className="text-lg">{icon}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface PendingCritiqueCardProps {
  critiqueFeedback: CritiqueFeedback;
}

const PendingCritiqueCard: React.FC<PendingCritiqueCardProps> = ({
  critiqueFeedback,
}) => {
  const navigate = useNavigate();
  const handleStartCritique = (critiqueFeedback: CritiqueFeedback) => {
    console.log(critiqueFeedback);
    navigate(`/video-editor?critiqueId=${critiqueFeedback.critique.id}`);
  };

  return (
    <Card className="border border-gray-200 hover:border-gray-300 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="font-semibold text-gray-900">
                {critiqueFeedback.client_video.title}
              </h3>
              <Badge variant="secondary" className="text-xs">
                {critiqueFeedback.client_video.dance_style.name}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-1">
              Dancer: {critiqueFeedback.user.full_name}
            </p>
            <p className="text-xs text-gray-500">
              Submitted:{" "}
              {new Date(
                critiqueFeedback.critique.created_at
              ).toLocaleDateString()}
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => handleStartCritique(critiqueFeedback)}
            className="ml-4"
          >
            Start Critique
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

interface CompletedCritiqueCardProps {
  critiqueFeedback: CritiqueFeedback;
}

const CompletedCritiqueCard: React.FC<CompletedCritiqueCardProps> = ({
  critiqueFeedback,
}) => {
  return (
    <Card className="border border-gray-200 hover:border-gray-300 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="font-semibold text-gray-900">
                {critiqueFeedback.client_video.title}
              </h3>
              <Badge variant="secondary" className="text-xs">
                {critiqueFeedback.client_video.dance_style.name}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-1">
              Dancer: {critiqueFeedback.user.full_name}
            </p>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>Completed: {new Date().toLocaleDateString()}</span>
              <span className="flex items-center">
                Rating: {critiqueFeedback?.review?.rating || "N/A"} ⭐
              </span>
            </div>
          </div>
          <Button size="sm" variant="outline" className="ml-4">
            View Critique
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdjudicatorDashboard;
