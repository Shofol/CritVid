import AppLayout from "@/components/AppLayout";
import PendingPayments from "@/components/adjudicator/PendingPayments";
import ProfileEditorLink from "@/components/adjudicator/ProfileEditorLink";
import ProfileStatusCard from "@/components/adjudicator/ProfileStatusCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
        <div className="container mx-auto py-6">
          <h1 className="text-3xl font-bold mb-6">Loading...</h1>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Adjudicator Dashboard</h1>
          <ProfileEditorLink />
        </div>

        {/* Account Status Card */}
        <div className="mb-8">
          <ProfileStatusCard
            isActive={profileData?.is_active ?? true}
            adjudicatorId={profileData?.id}
            onStatusChange={handleStatusChange}
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Critiques"
            value={critiques.length.toString()}
          />
          <StatsCard title="Average Rating" value={` ⭐`} />
          <StatsCard title="Total Earnings" value={``} />
          <StatsCard
            title="Pending Critiques"
            value={pendingCritiques.length.toString()}
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="pending">
          <TabsList className="mb-4">
            <TabsTrigger value="pending">Pending Critiques</TabsTrigger>
            <TabsTrigger value="completed">Completed Critiques</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <h2 className="text-xl font-semibold mb-4">Pending Critiques</h2>
            {pendingCritiques.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {pendingCritiques.map((critiqueFeedback) => (
                  <PendingCritiqueCard
                    key={critiqueFeedback.id}
                    critiqueFeedback={critiqueFeedback}
                  />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                No pending critiques at this time.
              </p>
            )}
          </TabsContent>

          <TabsContent value="completed">
            <h2 className="text-xl font-semibold mb-4">Completed Critiques</h2>
            {completedCritiques.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {completedCritiques.map((critiqueFeedback) => (
                  <CompletedCritiqueCard
                    key={critiqueFeedback.id}
                    critiqueFeedback={critiqueFeedback}
                  />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                No completed critiques yet.
              </p>
            )}
          </TabsContent>

          <TabsContent value="payments">
            <PendingPayments />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

interface StatsCardProps {
  title: string;
  value: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-sm text-muted-foreground">{title}</p>
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
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{critiqueFeedback.client_video.title}</CardTitle>
            <CardDescription>
              Dancer: {critiqueFeedback.user.full_name}
            </CardDescription>
          </div>
          <Badge>{critiqueFeedback.client_video.dance_style.name}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm">
            <p>Submitted: {critiqueFeedback.critique.created_at}</p>
            <p className="font-medium">Due: </p>
          </div>
          <Button onClick={() => handleStartCritique(critiqueFeedback)}>
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
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{critiqueFeedback.client_video.title}</CardTitle>
            <CardDescription>
              Dancer: {critiqueFeedback.user.full_name}
            </CardDescription>
          </div>
          <Badge>{critiqueFeedback.client_video.dance_style.name}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="text-sm">
            <p>Completed: </p>
            <p>Rating: {critiqueFeedback?.review?.rating} ⭐</p>
          </div>
          <Button variant="outline">View Critique</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdjudicatorDashboard;
