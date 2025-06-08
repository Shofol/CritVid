import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabase";
import React, { ReactNode, useState } from "react";
import EmailSignInForm from "./EmailSignInForm";
import SocialLoginButton from "./SocialLoginButton";

interface AuthCardProps {
  isSignUp?: boolean;
  title?: string;
  description?: string;
  children?: ReactNode;
}

const AuthCard: React.FC<AuthCardProps> = ({
  isSignUp: initialIsSignUp = false,
  title,
  description,
  children,
}) => {
  const [isSignUp, setIsSignUp] = useState(initialIsSignUp);
  const [isLoading, setIsLoading] = useState(false);

  const handleSocialLogin = async (provider: "google") => {
    try {
      setIsLoading(true);
      await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
    } catch (error) {
      console.error("Social login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          {title || (isSignUp ? "Create an account" : "Welcome back")}
        </CardTitle>
        <CardDescription className="text-center">
          {description ||
            (isSignUp
              ? "Sign up to start receiving professional dance critiques"
              : "Sign in to your CritVid account")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {children ? (
          children
        ) : (
          <>
            <div className="space-y-3">
              <SocialLoginButton
                provider="google"
                onClick={() => handleSocialLogin("google")}
                isLoading={isLoading}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <EmailSignInForm
              isSignUp={isSignUp}
              onToggleMode={() => setIsSignUp(!isSignUp)}
            />
          </>
        )}
      </CardContent>
      <CardFooter className="text-xs text-center text-muted-foreground">
        By continuing, you agree to our{" "}
        <a
          href="/terms"
          className="underline underline-offset-4 hover:text-primary pr-1"
        >
          Terms of Service
        </a>
        {"  "}
        and{"  "}
        <a
          href="/privacy"
          className="underline underline-offset-4 hover:text-primary pl-1"
        >
          Privacy Policy
        </a>
        .
      </CardFooter>
    </Card>
  );
};

export { AuthCard };
export default AuthCard;
