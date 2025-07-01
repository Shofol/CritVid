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
      <div className="container mx-auto py-4">
        <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Main Content - Takes up 3 columns */}
          <div className="lg:col-span-3 space-y-4">
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
                  📁 Videos
                </TabsTrigger>
                <TabsTrigger
                  value="critiques"
                  className="flex items-center gap-2"
                >
                  🎥 Critiques
                </TabsTrigger>
              </TabsList>
              <TabsContent value="videos" className="mt-4">
                <MyOriginalVideos />
              </TabsContent>
              <TabsContent value="critiques" className="mt-4">
                <MyCritiques />
              </TabsContent>
            </Tabs>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="space-y-3">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
              <h3 className="font-medium mb-2">Upload Video</h3>
              <Button asChild size="sm" className="w-full">
                <Link to="/upload-video">Upload</Link>
              </Button>
            </div>

            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
              <h3 className="font-medium mb-2">Find Adjudicator</h3>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link to="/find-adjudicator">Browse</Link>
              </Button>
            </div>

            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
              <h3 className="font-medium mb-2">Account</h3>
              <div className="space-y-1">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-8"
                >
                  <Link to="/profile">Profile</Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-8"
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
