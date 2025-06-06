import { Route, Routes } from "react-router-dom";

// Pages
import AuthCallback from "@/pages/AuthCallback";
import Checkout from "@/pages/Checkout";
import ConnectionTestPage from "@/pages/ConnectionTest";
import Contact from "@/pages/Contact";
import CritiquePreview from "@/pages/CritiquePreview";
import Dashboard from "@/pages/Dashboard";
import DashboardSelector from "@/pages/DashboardSelector";
import EmailVerification from "@/pages/EmailVerification";
import FindAdjudicator from "@/pages/FindAdjudicator";
import ForgotPassword from "@/pages/ForgotPassword";
import Guidelines from "@/pages/Guidelines";
import Help from "@/pages/Help";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import PlaybackTrackerPageFixed from "@/pages/PlaybackTrackerPageFixed";
import Privacy from "@/pages/Privacy";
import PrivateCritique from "@/pages/PrivateCritique";
import Profile from "@/pages/Profile";
import ResetPassword from "@/pages/ResetPassword";
import Reviews from "@/pages/Reviews";
import RoleSelection from "@/pages/RoleSelection";
import Signup from "@/pages/Signup";
import Terms from "@/pages/Terms";
import ThankYou from "@/pages/ThankYou";
import UploadVideo from "@/pages/UploadVideo";
import UserDashboard from "@/pages/UserDashboard";
import VideoLibrary from "@/pages/VideoLibrary";
import VideoPlayer from "@/pages/VideoPlayer";

// Admin pages
import AdjudicatorAdmin from "@/pages/admin/AdjudicatorAdmin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AutomationPage from "@/pages/admin/AutomationPage";
import ClientManagementPage from "@/pages/admin/ClientManagementPage";
import EmailTemplatesPage from "@/pages/admin/EmailTemplatesPage";
import PaymentReports from "@/pages/admin/PaymentReports";
import ReviewManagementPage from "@/pages/admin/ReviewManagementPage";
import SettingsPage from "@/pages/admin/SettingsPage";
import StatsPage from "@/pages/admin/StatsPage";
import StorageManagement from "@/pages/admin/StorageManagement";
import StudioOwners from "@/pages/admin/StudioOwners";
import SystemSettings from "@/pages/admin/SystemSettings";
import TestEmailPage from "@/pages/admin/TestEmailPage";
import UserManagement from "@/pages/admin/UserManagement";
import VideoReviewPage from "@/pages/admin/VideoReviewPage";
import VideoReviewsPage from "@/pages/admin/VideoReviewsPage";

// Adjudicator pages
import ApplicationStatus from "@/pages/adjudicator/ApplicationStatus";
import Apply from "@/pages/adjudicator/Apply";
import CompletedCritiques from "@/pages/adjudicator/CompletedCritiques";
import AdjudicatorDashboard from "@/pages/adjudicator/Dashboard";
import AdjudicatorPayments from "@/pages/adjudicator/Payments";
import PendingCritiques from "@/pages/adjudicator/PendingCritiques";
import ProfileEditor from "@/pages/adjudicator/ProfileEditor";
import AdjudicatorSupport from "@/pages/adjudicator/Support";

// Studio pages
import StudioDashboard from "@/pages/studio/Dashboard";
import SavedCritiques from "@/pages/studio/SavedCritiques";
import TeamManagement from "@/pages/studio/TeamManagement";

// Client pages
import Billing from "@/pages/client/Billing";
import ClientDashboard from "@/pages/client/ClientDashboard";
import PaymentHistory from "@/pages/client/PaymentHistory";
import PaymentMethods from "@/pages/client/PaymentMethods";
import ViewCritique from "@/pages/client/ViewCritique";

// Demo pages
import EmailDemo from "@/pages/EmailDemo";
import MuxVideoDemo from "@/pages/MuxVideoDemo";

// Components
import AuthDebugger from "@/components/auth/AuthDebugger";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PublicRoute from "@/components/auth/PublicRoute";
import EmailVerificationPage from "@/pages/EmailVerification";

function App() {
  return (
    <Routes>
      {/* Temporary debug route */}
      <Route path="/debug" element={<AuthDebugger />} />

      {/* Public routes - accessible without authentication */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <Index />
          </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />
      <Route
        path="/auth/callback"
        element={
          <PublicRoute>
            <AuthCallback />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />
      <Route
        path="/reset-password"
        element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        }
      />
      <Route
        path="/help"
        element={
          <PublicRoute>
            <Help />
          </PublicRoute>
        }
      />
      <Route
        path="/email-verification"
        element={
          <PublicRoute>
            <EmailVerificationPage />
          </PublicRoute>
        }
      />
      <Route
        path="/reviews"
        element={
          <PublicRoute>
            <Reviews />
          </PublicRoute>
        }
      />
      <Route
        path="/contact"
        element={
          <PublicRoute>
            <Contact />
          </PublicRoute>
        }
      />
      <Route
        path="/guidelines"
        element={
          <PublicRoute>
            <Guidelines />
          </PublicRoute>
        }
      />
      <Route
        path="/privacy"
        element={
          <PublicRoute>
            <Privacy />
          </PublicRoute>
        }
      />
      <Route
        path="/terms"
        element={
          <PublicRoute>
            <Terms />
          </PublicRoute>
        }
      />
      <Route
        path="/verify-email"
        element={
          <PublicRoute>
            <EmailVerification />
          </PublicRoute>
        }
      />

      {/* Connection Test Route - public for testing */}
      <Route
        path="/connection-test"
        element={
          <PublicRoute>
            <ConnectionTestPage />
          </PublicRoute>
        }
      />

      {/* Demo routes - public */}
      <Route
        path="/mux-demo"
        element={
          <PublicRoute>
            <MuxVideoDemo />
          </PublicRoute>
        }
      />
      <Route
        path="/email-demo"
        element={
          <PublicRoute>
            <EmailDemo />
          </PublicRoute>
        }
      />

      {/* All other routes require authentication */}
      <Route
        path="/find-adjudicator"
        element={
          <ProtectedRoute>
            <FindAdjudicator />
          </ProtectedRoute>
        }
      />
      <Route
        path="/find-adjudicator/:id"
        element={
          <ProtectedRoute>
            <FindAdjudicator />
          </ProtectedRoute>
        }
      />

      {/* Checkout and Thank You routes */}
      <Route
        path="/checkout/:videoId/:adjudicatorId"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/thank-you"
        element={
          <ProtectedRoute>
            <ThankYou />
          </ProtectedRoute>
        }
      />

      {/* VIDEO ROUTES */}
      <Route
        path="/video/:id"
        element={
          <ProtectedRoute>
            <CritiquePreview />
          </ProtectedRoute>
        }
      />
      <Route
        path="/video-player/:id"
        element={
          <ProtectedRoute>
            <VideoPlayer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/critique/:id"
        element={
          <ProtectedRoute>
            <CritiquePreview />
          </ProtectedRoute>
        }
      />
      <Route
        path="/critique-editor/:videoId"
        element={
          <ProtectedRoute>
            <PlaybackTrackerPageFixed />
          </ProtectedRoute>
        }
      />
      <Route
        path="/critique-editor"
        element={
          <ProtectedRoute>
            <PlaybackTrackerPageFixed />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-video/:videoId"
        element={
          <ProtectedRoute>
            <PlaybackTrackerPageFixed />
          </ProtectedRoute>
        }
      />
      <Route
        path="/video-editor/:videoId"
        element={
          <ProtectedRoute>
            <PlaybackTrackerPageFixed />
          </ProtectedRoute>
        }
      />
      <Route
        path="/video-editor"
        element={
          <ProtectedRoute>
            <PlaybackTrackerPageFixed />
          </ProtectedRoute>
        }
      />
      <Route
        path="/playback-tracker/:videoId"
        element={
          <ProtectedRoute>
            <PlaybackTrackerPageFixed />
          </ProtectedRoute>
        }
      />
      <Route
        path="/playback-tracker"
        element={
          <ProtectedRoute>
            <PlaybackTrackerPageFixed />
          </ProtectedRoute>
        }
      />
      <Route
        path="/critique-preview/:videoId"
        element={
          <ProtectedRoute>
            <CritiquePreview />
          </ProtectedRoute>
        }
      />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user-dashboard"
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/video-library"
        element={
          <ProtectedRoute>
            <VideoLibrary />
          </ProtectedRoute>
        }
      />
      <Route
        path="/upload-video"
        element={
          <ProtectedRoute>
            <UploadVideo />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/role-selection"
        element={
          <ProtectedRoute>
            <RoleSelection />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard-selector"
        element={
          <ProtectedRoute>
            <DashboardSelector />
          </ProtectedRoute>
        }
      />
      <Route
        path="/private-critique"
        element={
          <ProtectedRoute>
            <PrivateCritique />
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute adminOnly>
            <UserManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/adjudicators"
        element={
          <ProtectedRoute adminOnly>
            <AdjudicatorAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reviews"
        element={
          <ProtectedRoute adminOnly>
            <ReviewManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/email-templates"
        element={
          <ProtectedRoute adminOnly>
            <EmailTemplatesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/test-email"
        element={
          <ProtectedRoute adminOnly>
            <TestEmailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/video-reviews"
        element={
          <ProtectedRoute adminOnly>
            <VideoReviewsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/video-review/:id"
        element={
          <ProtectedRoute adminOnly>
            <VideoReviewPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/stats"
        element={
          <ProtectedRoute adminOnly>
            <StatsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute adminOnly>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/clients"
        element={
          <ProtectedRoute adminOnly>
            <ClientManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/studio-owners"
        element={
          <ProtectedRoute adminOnly>
            <StudioOwners />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/system"
        element={
          <ProtectedRoute adminOnly>
            <SystemSettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/payments"
        element={
          <ProtectedRoute adminOnly>
            <PaymentReports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/automation"
        element={
          <ProtectedRoute adminOnly>
            <AutomationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/storage"
        element={
          <ProtectedRoute adminOnly>
            <StorageManagement />
          </ProtectedRoute>
        }
      />

      {/* Adjudicator routes */}
      <Route
        path="/adjudicator/dashboard"
        element={
          <ProtectedRoute>
            <AdjudicatorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/adjudicator/pending-critiques"
        element={
          <ProtectedRoute>
            <PendingCritiques />
          </ProtectedRoute>
        }
      />
      <Route
        path="/adjudicator/completed-critiques"
        element={
          <ProtectedRoute>
            <CompletedCritiques />
          </ProtectedRoute>
        }
      />
      <Route
        path="/adjudicator/payments"
        element={
          <ProtectedRoute>
            <AdjudicatorPayments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/adjudicator/critique-editor/:id"
        element={
          <ProtectedRoute>
            <PlaybackTrackerPageFixed />
          </ProtectedRoute>
        }
      />
      <Route
        path="/adjudicator/profile"
        element={
          <ProtectedRoute>
            <ProfileEditor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/adjudicator/application-status"
        element={
          <ProtectedRoute>
            <ApplicationStatus />
          </ProtectedRoute>
        }
      />
      <Route
        path="/adjudicator/apply"
        element={
          <ProtectedRoute>
            <Apply />
          </ProtectedRoute>
        }
      />
      <Route
        path="/adjudicator/support"
        element={
          <ProtectedRoute>
            <AdjudicatorSupport />
          </ProtectedRoute>
        }
      />

      {/* Studio routes */}
      <Route
        path="/studio/dashboard"
        element={
          <ProtectedRoute studioOnly>
            <StudioDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/studio/saved-critiques"
        element={
          <ProtectedRoute studioOnly>
            <SavedCritiques />
          </ProtectedRoute>
        }
      />
      <Route
        path="/studio/team"
        element={
          <ProtectedRoute studioOnly>
            <TeamManagement />
          </ProtectedRoute>
        }
      />

      {/* Client routes */}
      <Route
        path="/client/dashboard"
        element={
          <ProtectedRoute>
            <ClientDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/client/billing"
        element={
          <ProtectedRoute>
            <Billing />
          </ProtectedRoute>
        }
      />
      <Route
        path="/client/payment-history"
        element={
          <ProtectedRoute>
            <PaymentHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/client/payment-methods"
        element={
          <ProtectedRoute>
            <PaymentMethods />
          </ProtectedRoute>
        }
      />
      <Route
        path="/client/view-critique/:critiqueId"
        element={
          <ProtectedRoute>
            <ViewCritique />
          </ProtectedRoute>
        }
      />

      {/* 404 route */}
      <Route
        path="*"
        element={
          <PublicRoute>
            <NotFound />
          </PublicRoute>
        }
      />
    </Routes>
  );
}

export default App;
