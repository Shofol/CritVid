import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useApp } from "@/contexts/AppContext";
import { createUserAfterVerification } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function EmailVerificationCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [error, setError] = useState<string | null>(null);
  const { setUserRole } = useApp();

  useEffect(() => {
    console.log("first");
    const handleEmailVerification = async () => {
      try {
        // Get the current session after email verification
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (!session?.user) {
          throw new Error("No user found in session");
        }

        // Create user record in the database
        const { success, error: createError } =
          await createUserAfterVerification(session.user);

        if (!success || createError) {
          throw createError || new Error("Failed to create user record");
        }

        setStatus("success");

        setUserRole(session.user.user_metadata.role);

        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } catch (err: unknown) {
        console.error("Email verification error:", err);
        setStatus("error");
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred during email verification"
        );
      }
    };

    handleEmailVerification();
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Verifying Your Email</CardTitle>
        <CardDescription>
          Please wait while we verify your email and set up your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {status === "loading" && (
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Verifying your email...</span>
          </div>
        )}

        {status === "success" && (
          <Alert className="bg-green-50 border-green-200">
            <AlertTitle className="text-green-800">Email Verified!</AlertTitle>
            <AlertDescription className="text-green-700">
              Your email has been verified successfully. You will be redirected
              to the dashboard shortly.
            </AlertDescription>
          </Alert>
        )}

        {status === "error" && (
          <Alert variant="destructive">
            <AlertTitle>Verification Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
