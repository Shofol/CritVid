import { supabase } from "./supabase";

export interface StripeAccount {
  id: string;
  object: string;
  business_profile: {
    url: string;
    mcc: string;
  };
  capabilities: {
    card_payments: string;
    transfers: string;
  };
  charges_enabled: boolean;
  country: string;
  created: number;
  default_currency: string;
  details_submitted: boolean;
  email: string;
  payouts_enabled: boolean;
  requirements: {
    currently_due: string[];
    eventually_due: string[];
    past_due: string[];
  };
  settings: Record<string, unknown>;
  type: string;
}

export interface StripeConnectResponse {
  account_id?: string;
  status?: string;
  url?: string;
  error?: string;
  account?: StripeAccount;
  message?: string;
  user_id?: string;
}

class StripeConnectService {
  private async callStripeFunction(
    method: string,
    data: Record<string, unknown> = {}
  ): Promise<StripeConnectResponse> {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-connect`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          method,
          ...data,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to call Stripe function");
    }

    return await response.json();
  }

  async createAccount(
    email?: string,
    country: string = "US",
    businessType: string = "individual"
  ): Promise<StripeConnectResponse> {
    return this.callStripeFunction("create_account", {
      email,
      country,
      business_type: businessType,
    });
  }

  async getAccount(): Promise<StripeConnectResponse> {
    return this.callStripeFunction("get_account");
  }

  async createOnboardingLink(
    returnUrl: string
  ): Promise<StripeConnectResponse> {
    return this.callStripeFunction("create_onboarding_link", {
      return_url: returnUrl,
    });
  }

  async checkAccountStatus(): Promise<{
    hasAccount: boolean;
    isComplete: boolean;
    accountId?: string;
  }> {
    try {
      const response = await this.getAccount();
      if (response.account) {
        return {
          hasAccount: true,
          isComplete:
            response.account.details_submitted &&
            response.account.charges_enabled,
          accountId: response.account.id,
        };
      }
      return { hasAccount: false, isComplete: false };
    } catch (error) {
      return { hasAccount: false, isComplete: false };
    }
  }

  // Temporary method to test the edge function
  async testConnection(): Promise<StripeConnectResponse> {
    return this.callStripeFunction("test");
  }
}

export const stripeConnectService = new StripeConnectService();
