import { AuthCard } from "@/components/auth/AuthCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { AlertCircle, CheckCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const handleAuthFlow = async () => {
      // First, check for OTP token in URL parameters (new approach)
      const token = searchParams.get("token");
      const email = searchParams.get("email");
      const type = searchParams.get("type");

      if (token && email && type === "recovery") {
        // For URL-based tokens, we'll verify the token during password update
        // The presence of token, email, and type=recovery indicates a valid reset attempt
        return;
      }

      // Parse hash parameters for error handling (fallback for old approach)
      const hash = window.location.hash;
      if (hash) {
        const hashParams = new URLSearchParams(hash.substring(1)); // Remove the # symbol
        const error = hashParams.get("error");
        const errorCode = hashParams.get("error_code");
        const errorDescription = hashParams.get("error_description");

        if (error) {
          let errorMessage = "An error occurred with the reset link.";

          if (errorCode === "otp_expired") {
            errorMessage =
              "The password reset link has expired. Please request a new password reset.";
          } else if (errorDescription) {
            errorMessage = decodeURIComponent(
              errorDescription.replace(/\+/g, " ")
            );
          }

          setError(errorMessage);
          return;
        }

        // Check for tokens in hash (old Supabase auth flow)
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");

        if (accessToken && refreshToken) {
          // Set the session with the tokens
          try {
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (error) {
              setError(
                "Failed to authenticate with the reset link. Please request a new password reset."
              );
            }
          } catch (sessionError) {
            setError(
              "Failed to authenticate with the reset link. Please request a new password reset."
            );
          }
          return;
        }
      }

      // If we reach here without tokens or OTP, show error
      setError(
        "Invalid or expired reset link. Please request a new password reset."
      );
    };

    handleAuthFlow();
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      // Check if we have URL-based token parameters
      const token = searchParams.get("token");
      const email = searchParams.get("email");
      const type = searchParams.get("type");

      let updateError;

      if (token && email && type === "recovery") {
        // Use verifyOtp to set the session and update password
        const { error } = await supabase.auth.verifyOtp({
          email: email,
          token: token,
          type: "recovery",
        });

        if (error) {
          throw error;
        }

        // After successful OTP verification, update the password
        const { error: passwordError } = await supabase.auth.updateUser({
          password: password,
        });

        updateError = passwordError;
      } else {
        // Fallback to regular password update (for session-based approach)
        const { error } = await supabase.auth.updateUser({
          password: password,
        });

        updateError = error;
      }

      if (updateError) throw updateError;

      setSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while updating your password";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <AuthCard
          title="Password Updated"
          description="Your password has been successfully updated."
        >
          <div className="space-y-4">
            <Alert variant="default" className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Success</AlertTitle>
              <AlertDescription className="text-green-700">
                Your password has been updated. You will be redirected to the
                login page in a few seconds.
              </AlertDescription>
            </Alert>

            <div className="text-center">
              <Button onClick={() => navigate("/login")} className="w-full">
                Go to Sign In
              </Button>
            </div>
          </div>
        </AuthCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <AuthCard
        title="Reset Password"
        description="Enter your new password below."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your new password"
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
              disabled={isLoading}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Password"}
          </Button>

          <div className="text-center">
            <Button
              variant="link"
              onClick={() => navigate("/login")}
              className="text-primary hover:underline"
            >
              Back to Sign In
            </Button>
          </div>
        </form>
      </AuthCard>
    </div>
  );
}
