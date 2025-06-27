export const CREATE_ADJUDICATOR_PROFILE_FUNCTION = `${
  import.meta.env.VITE_SUPABASE_URL
}/functions/v1/create-adjudicator-profile`;

export const GET_ADJUDICATORS_FUNCTION = `${
  import.meta.env.VITE_SUPABASE_URL
}/functions/v1/get-approved-adjudicators`;

export const ASSIGN_CRITIQUE_FUNCTION = `${
  import.meta.env.VITE_SUPABASE_URL
}/functions/v1/assign-critique`;

export const GET_CRITIQUES_FUNCTION = `${
  import.meta.env.VITE_SUPABASE_URL
}/functions/v1/get-critiques`;

export const GET_CRITIQUE_BY_ID_FUNCTION = `${
  import.meta.env.VITE_SUPABASE_URL
}/functions/v1/get-critique-by-id`;

export const SAVE_CRITIQUE_FEEDBACK_FUNCTION = `${
  import.meta.env.VITE_SUPABASE_URL
}/functions/v1/save-critiuqe-feedback`;
