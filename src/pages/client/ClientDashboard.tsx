import { AppLayout } from "@/components/AppLayout";
import MyCritiques from "@/components/client/MyCritiques";
import MyOriginalVideos from "@/components/client/MyOriginalVideos";
import PendingApprovals from "@/components/client/PendingApprovals";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const ClientDashboard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabParam || "videos");

  useEffect(() => {
    if (tabParam && (tabParam === "videos" || tabParam === "critiques")) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Client Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Takes up 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pending Approvals */}
            <PendingApprovals />

            {/* Tabbed Video Sections */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="videos" className="flex items-center gap-2">
                  📁 My Videos
                </TabsTrigger>
                <TabsTrigger
                  value="critiques"
                  className="flex items-center gap-2"
                >
                  🎥 My Critiques
                </TabsTrigger>
              </TabsList>
              <TabsContent value="videos" className="mt-6">
                <MyOriginalVideos />
              </TabsContent>
              <TabsContent value="critiques" className="mt-6">
                <MyCritiques />
              </TabsContent>
            </Tabs>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="space-y-6">
            <div className="rounded-lg border bg-card text-card-foreground shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Upload Video</h2>
              <p className="text-muted-foreground mb-4">
                Upload a new dance video for critique
              </p>
              <Button asChild className="w-full">
                <Link to="/upload-video">Upload Now</Link>
              </Button>
            </div>

            <div className="rounded-lg border bg-card text-card-foreground shadow p-6">
              <h2 className="text-xl font-semibold mb-4">
                Find an Adjudicator
              </h2>
              <p className="text-muted-foreground mb-4">
                Browse our professional adjudicators
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/find-adjudicator">Browse Adjudicators</Link>
              </Button>
            </div>

            <div className="rounded-lg border bg-card text-card-foreground shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Account</h2>
              <p className="text-muted-foreground mb-4">
                Manage your profile and billing
              </p>
              <div className="space-y-2">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Link to="/profile">Edit Profile</Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Link to="/client/billing">Billing</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ClientDashboard;
