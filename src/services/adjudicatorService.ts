import { supabase } from "@/lib/supabase";
import { AdjudicatorsResponse } from "@/types/adjudicator";
import { GET_ADJUDICATORS_FUNCTION } from "../config/constants";

export const getAdjudicators = async (): Promise<AdjudicatorsResponse> => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new Error("No active session");
    }

    const response = await fetch(`${GET_ADJUDICATORS_FUNCTION}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching adjudicators:", error);
    throw error;
  }
};
