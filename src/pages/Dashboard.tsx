import { AppLayout } from "@/components/AppLayout";
import { useApp } from "@/contexts/AppContext";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAdjudicatorByUserId } from "../services/adjudicatorService";

const Dashboard: React.FC = () => {
  const { user } = useApp();
  const { userRole, setIsAdjudicatorApproved } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdjudicatorProfile = async () => {
      const adjudicator = await getAdjudicatorByUserId(user.id);
      if (adjudicator && adjudicator.approved !== true) {
        setIsAdjudicatorApproved(false);
        navigate("/adjudicator/apply");
      } else {
        setIsAdjudicatorApproved(true);
      }
    };

    if (userRole === "adjudicator") {
      fetchAdjudicatorProfile();
    }
    // Redirect to the appropriate dashboard based on role
    switch (userRole) {
      case "admin":
        navigate("/admin/dashboard");
        break;
      case "adjudicator":
        navigate("/adjudicator/dashboard");
        break;
      case "studio_critique":
        navigate("/studio/dashboard");
        break;
      case "client":
        navigate("/client/dashboard");
        break;
      default:
        // If no specific role, show a basic layout with the role-based sidebar
        break;
    }
  }, [userRole, user, navigate]);

  // Show a loading state while redirecting
  return (
    <AppLayout>
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading your dashboard...</h1>
          <p>
            You will be redirected to the appropriate dashboard based on your
            role.
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
