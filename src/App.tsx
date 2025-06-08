import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";

// Convert all page imports to dynamic imports using React.lazy()
const AuthCallback = React.lazy(() => import("@/pages/AuthCallback"));
const Checkout = React.lazy(() => import("@/pages/Checkout"));
const ConnectionTestPage = React.lazy(() => import("@/pages/ConnectionTest"));
const Contact = React.lazy(() => import("@/pages/Contact"));
const CritiquePreview = React.lazy(() => import("@/pages/CritiquePreview"));
const Dashboard = React.lazy(() => import("@/pages/Dashboard"));
const DashboardSelector = React.lazy(() => import("@/pages/DashboardSelector"));
const EmailVerification = React.lazy(() => import("@/pages/EmailVerification"));
const FindAdjudicator = React.lazy(() => import("@/pages/FindAdjudicator"));
const ForgotPassword = React.lazy(() => import("@/pages/ForgotPassword"));
const Guidelines = React.lazy(() => import("@/pages/Guidelines"));
const Help = React.lazy(() => import("@/pages/Help"));
const Index = React.lazy(() => import("@/pages/Index"));
const Login = React.lazy(() => import("@/pages/Login"));
const NotFound = React.lazy(() => import("@/pages/NotFound"));
const PlaybackTrackerPageFixed = React.lazy(
  () => import("@/pages/PlaybackTrackerPageFixed")
);
const Privacy = React.lazy(() => import("@/pages/Privacy"));
const PrivateCritique = React.lazy(() => import("@/pages/PrivateCritique"));
const Profile = React.lazy(() => import("@/pages/Profile"));
const ResetPassword = React.lazy(() => import("@/pages/ResetPassword"));
const Reviews = React.lazy(() => import("@/pages/Reviews"));
const RoleSelection = React.lazy(() => import("@/pages/RoleSelection"));
const Signup = React.lazy(() => import("@/pages/Signup"));
const Terms = React.lazy(() => import("@/pages/Terms"));
const ThankYou = React.lazy(() => import("@/pages/ThankYou"));
const UploadVideo = React.lazy(() => import("@/pages/UploadVideo"));
const UserDashboard = React.lazy(() => import("@/pages/UserDashboard"));
const VideoLibrary = React.lazy(() => import("@/pages/VideoLibrary"));
const VideoPlayer = React.lazy(() => import("@/pages/VideoPlayer"));

// Admin pages
const AdjudicatorAdmin = React.lazy(
  () => import("@/pages/admin/AdjudicatorAdmin")
);
const AdminDashboard = React.lazy(() => import("@/pages/admin/AdminDashboard"));
const AutomationPage = React.lazy(() => import("@/pages/admin/AutomationPage"));
const ClientManagementPage = React.lazy(
  () => import("@/pages/admin/ClientManagementPage")
);
const EmailTemplatesPage = React.lazy(
  () => import("@/pages/admin/EmailTemplatesPage")
);
const PaymentReports = React.lazy(() => import("@/pages/admin/PaymentReports"));
const ReviewManagementPage = React.lazy(
  () => import("@/pages/admin/ReviewManagementPage")
);
const SettingsPage = React.lazy(() => import("@/pages/admin/SettingsPage"));
const StatsPage = React.lazy(() => import("@/pages/admin/StatsPage"));
const StorageManagement = React.lazy(
  () => import("@/pages/admin/StorageManagement")
);
const StudioOwners = React.lazy(() => import("@/pages/admin/StudioOwners"));
const SystemSettings = React.lazy(() => import("@/pages/admin/SystemSettings"));
const TestEmailPage = React.lazy(() => import("@/pages/admin/TestEmailPage"));
const UserManagement = React.lazy(() => import("@/pages/admin/UserManagement"));
const VideoReviewPage = React.lazy(
  () => import("@/pages/admin/VideoReviewPage")
);
const VideoReviewsPage = React.lazy(
  () => import("@/pages/admin/VideoReviewsPage")
);

// Adjudicator pages
const ApplicationStatus = React.lazy(
  () => import("@/pages/adjudicator/ApplicationStatus")
);
const Apply = React.lazy(() => import("@/pages/adjudicator/Apply"));
const CompletedCritiques = React.lazy(
  () => import("@/pages/adjudicator/CompletedCritiques")
);
const AdjudicatorDashboard = React.lazy(
  () => import("@/pages/adjudicator/Dashboard")
);
const AdjudicatorPayments = React.lazy(
  () => import("@/pages/adjudicator/Payments")
);
const PendingCritiques = React.lazy(
  () => import("@/pages/adjudicator/PendingCritiques")
);
const ProfileEditor = React.lazy(
  () => import("@/pages/adjudicator/ProfileEditor")
);
const AdjudicatorSupport = React.lazy(
  () => import("@/pages/adjudicator/Support")
);

// Studio pages
const StudioDashboard = React.lazy(() => import("@/pages/studio/Dashboard"));
const SavedCritiques = React.lazy(
  () => import("@/pages/studio/SavedCritiques")
);
const TeamManagement = React.lazy(
  () => import("@/pages/studio/TeamManagement")
);

// Client pages
const Billing = React.lazy(() => import("@/pages/client/Billing"));
const ClientDashboard = React.lazy(
  () => import("@/pages/client/ClientDashboard")
);
const PaymentHistory = React.lazy(
  () => import("@/pages/client/PaymentHistory")
);
const PaymentMethods = React.lazy(
  () => import("@/pages/client/PaymentMethods")
);
const ViewCritique = React.lazy(() => import("@/pages/client/ViewCritique"));

// Demo pages
const EmailDemo = React.lazy(() => import("@/pages/EmailDemo"));
const MuxVideoDemo = React.lazy(() => import("@/pages/MuxVideoDemo"));
const ScreenRecordingDemo = React.lazy(
  () => import("@/pages/ScreenRecordingDemo")
);

// Components - Keep auth components as static imports since they're critical
import AuthDebugger from "@/components/auth/AuthDebugger";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PublicRoute from "@/components/auth/PublicRoute";

// Loading component for better UX
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-black text-white">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
      <p className="text-gray-300">Loading...</p>
    </div>
  </div>
);

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
            <Suspense fallback={<PageLoader />}>
              <Index />
            </Suspense>
          </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Suspense fallback={<PageLoader />}>
              <Login />
            </Suspense>
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Suspense fallback={<PageLoader />}>
              <Signup />
            </Suspense>
          </PublicRoute>
        }
      />
      <Route
        path="/auth/callback"
        element={
          <PublicRoute>
            <Suspense fallback={<PageLoader />}>
              <AuthCallback />
            </Suspense>
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <Suspense fallback={<PageLoader />}>
              <ForgotPassword />
            </Suspense>
          </PublicRoute>
        }
      />
      <Route
        path="/reset-password"
        element={
          <PublicRoute>
            <Suspense fallback={<PageLoader />}>
              <ResetPassword />
            </Suspense>
          </PublicRoute>
        }
      />
      <Route
        path="/help"
        element={
          <PublicRoute>
            <Suspense fallback={<PageLoader />}>
              <Help />
            </Suspense>
          </PublicRoute>
        }
      />
      <Route
        path="/email-verification"
        element={
          <PublicRoute>
            <Suspense fallback={<PageLoader />}>
              <EmailVerification />
            </Suspense>
          </PublicRoute>
        }
      />
      <Route
        path="/reviews"
        element={
          <PublicRoute>
            <Suspense fallback={<PageLoader />}>
              <Reviews />
            </Suspense>
          </PublicRoute>
        }
      />
      <Route
        path="/contact"
        element={
          <PublicRoute>
            <Suspense fallback={<PageLoader />}>
              <Contact />
            </Suspense>
          </PublicRoute>
        }
      />
      <Route
        path="/guidelines"
        element={
          <PublicRoute>
            <Suspense fallback={<PageLoader />}>
              <Guidelines />
            </Suspense>
          </PublicRoute>
        }
      />
      <Route
        path="/privacy"
        element={
          <PublicRoute>
            <Suspense fallback={<PageLoader />}>
              <Privacy />
            </Suspense>
          </PublicRoute>
        }
      />
      <Route
        path="/terms"
        element={
          <PublicRoute>
            <Suspense fallback={<PageLoader />}>
              <Terms />
            </Suspense>
          </PublicRoute>
        }
      />
      <Route
        path="/verify-email"
        element={
          <PublicRoute>
            <Suspense fallback={<PageLoader />}>
              <EmailVerification />
            </Suspense>
          </PublicRoute>
        }
      />

      {/* Connection Test Route - public for testing */}
      <Route
        path="/connection-test"
        element={
          <PublicRoute>
            <Suspense fallback={<PageLoader />}>
              <ConnectionTestPage />
            </Suspense>
          </PublicRoute>
        }
      />

      {/* Demo routes - public */}
      <Route
        path="/mux-demo"
        element={
          <PublicRoute>
            <Suspense fallback={<PageLoader />}>
              <MuxVideoDemo />
            </Suspense>
          </PublicRoute>
        }
      />
      <Route
        path="/email-demo"
        element={
          <PublicRoute>
            <Suspense fallback={<PageLoader />}>
              <EmailDemo />
            </Suspense>
          </PublicRoute>
        }
      />
      <Route
        path="/screen-recording-demo"
        element={
          <PublicRoute>
            <Suspense fallback={<PageLoader />}>
              <ScreenRecordingDemo />
            </Suspense>
          </PublicRoute>
        }
      />

      {/* All other routes require authentication */}
      <Route
        path="/find-adjudicator"
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <FindAdjudicator />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/find-adjudicator/:id"
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <FindAdjudicator />
            </Suspense>
          </ProtectedRoute>
        }
      />

      {/* Checkout and Thank You routes */}
      <Route
        path="/checkout/:videoId/:adjudicatorId"
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <Checkout />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/thank-you"
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <ThankYou />
            </Suspense>
          </ProtectedRoute>
        }
      />

      {/* VIDEO ROUTES */}
      <Route
        path="/video/:id"
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <CritiquePreview />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/video-player/:id"
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <VideoPlayer />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/critique/:id"
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <CritiquePreview />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/critique-editor/:videoId"
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <PlaybackTrackerPageFixed />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/critique-editor"
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <PlaybackTrackerPageFixed />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-video/:videoId"
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <PlaybackTrackerPageFixed />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/video-editor/:videoId"
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <PlaybackTrackerPageFixed />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/video-editor"
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <PlaybackTrackerPageFixed />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/playback-tracker/:videoId"
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <PlaybackTrackerPageFixed />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/playback-tracker"
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <PlaybackTrackerPageFixed />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/critique-preview/:videoId"
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <CritiquePreview />
            </Suspense>
          </ProtectedRoute>
        }
      />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <Dashboard />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/user-dashboard"
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <UserDashboard />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/video-library"
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <VideoLibrary />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/upload-video"
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <UploadVideo />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <Profile />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/role-selection"
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <RoleSelection />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard-selector"
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <DashboardSelector />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/private-critique"
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <PrivateCritique />
            </Suspense>
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute adminOnly>
            <Suspense fallback={<PageLoader />}>
              <AdminDashboard />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute adminOnly>
            <Suspense fallback={<PageLoader />}>
              <UserManagement />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/adjudicators"
        element={
          <ProtectedRoute adminOnly>
            <Suspense fallback={<PageLoader />}>
              <AdjudicatorAdmin />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reviews"
        element={
          <ProtectedRoute adminOnly>
            <Suspense fallback={<PageLoader />}>
              <ReviewManagementPage />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/email-templates"
        element={
          <ProtectedRoute adminOnly>
            <Suspense fallback={<PageLoader />}>
              <EmailTemplatesPage />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/test-email"
        element={
          <ProtectedRoute adminOnly>
            <Suspense fallback={<PageLoader />}>
              <TestEmailPage />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/video-reviews"
        element={
          <ProtectedRoute adminOnly>
            <Suspense fallback={<PageLoader />}>
              <VideoReviewsPage />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/video-review/:id"
        element={
          <ProtectedRoute adminOnly>
            <Suspense fallback={<PageLoader />}>
              <VideoReviewPage />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/stats"
        element={
          <ProtectedRoute adminOnly>
            <Suspense fallback={<PageLoader />}>
              <StatsPage />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute adminOnly>
            <Suspense fallback={<PageLoader />}>
              <SettingsPage />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/clients"
        element={
          <ProtectedRoute adminOnly>
            <Suspense fallback={<PageLoader />}>
              <ClientManagementPage />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/studio-owners"
        element={
          <ProtectedRoute adminOnly>
            <Suspense fallback={<PageLoader />}>
              <StudioOwners />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/system"
        element={
          <ProtectedRoute adminOnly>
            <Suspense fallback={<PageLoader />}>
              <SystemSettings />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/payments"
        element={
          <ProtectedRoute adminOnly>
            <Suspense fallback={<PageLoader />}>
              <PaymentReports />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/automation"
        element={
          <ProtectedRoute adminOnly>
            <Suspense fallback={<PageLoader />}>
              <AutomationPage />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/storage"
        element={
          <ProtectedRoute adminOnly>
            <Suspense fallback={<PageLoader />}>
              <StorageManagement />
            </Suspense>
          </ProtectedRoute>
        }
      />

      {/* Adjudicator routes */}
      <Route
        path="/adjudicator/dashboard"
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <AdjudicatorDashboard />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/adjudicator/pending-critiques"
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <PendingCritiques />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/adjudicator/completed-critiques"
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <CompletedCritiques />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/adjudicator/payments"
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <AdjudicatorPayments />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/adjudicator/critique-editor/:id"
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <PlaybackTrackerPageFixed />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/adjudicator/profile"
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <ProfileEditor />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/adjudicator/application-status"
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <ApplicationStatus />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/adjudicator/apply"
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <Apply />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/adjudicator/support"
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <AdjudicatorSupport />
            </Suspense>
          </ProtectedRoute>
        }
      />

      {/* Studio routes */}
      <Route
        path="/studio/dashboard"
        element={
          <ProtectedRoute studioOnly>
            <Suspense fallback={<PageLoader />}>
              <StudioDashboard />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/studio/saved-critiques"
        element={
          <ProtectedRoute studioOnly>
            <Suspense fallback={<PageLoader />}>
              <SavedCritiques />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/studio/team"
        element={
          <ProtectedRoute studioOnly>
            <Suspense fallback={<PageLoader />}>
              <TeamManagement />
            </Suspense>
          </ProtectedRoute>
        }
      />

      {/* Client routes */}
      <Route
        path="/client/dashboard"
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <ClientDashboard />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/client/billing"
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <Billing />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/client/payment-history"
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <PaymentHistory />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/client/payment-methods"
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <PaymentMethods />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/client/view-critique/:critiqueId"
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <ViewCritique />
            </Suspense>
          </ProtectedRoute>
        }
      />

      {/* 404 route */}
      <Route
        path="*"
        element={
          <PublicRoute>
            <Suspense fallback={<PageLoader />}>
              <NotFound />
            </Suspense>
          </PublicRoute>
        }
      />
    </Routes>
  );
}

export default App;
