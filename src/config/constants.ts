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

export const GET_CRITIQUE_FEEDBACK_BY_ID_FUNCTION = `${
  import.meta.env.VITE_SUPABASE_URL
}/functions/v1/get-critique-feedback-by-id`;

export const UPDATE_CRITIQUE_FEEDBACK_FUNCTION = `${
  import.meta.env.VITE_SUPABASE_URL
}/functions/v1/update-critique-feedback`;

export const SAVE_CRITIQUE_FEEDBACK_FUNCTION = `${
  import.meta.env.VITE_SUPABASE_URL
}/functions/v1/save-critiuqe-feedback`;

export const TRANSCRIBE_AUDIO_FUNCTION = `${
  import.meta.env.VITE_SUPABASE_URL
}/functions/v1/transcribe-audio`;

export const GENERATE_DANCE_EXERCISES_FUNCTION = `${
  import.meta.env.VITE_SUPABASE_URL
}/functions/v1/generate-exercises`;

export const GENERATE_DANCE_SUGGESTIONS_FUNCTION = `${
  import.meta.env.VITE_SUPABASE_URL
}/functions/v1/generate-suggestions`;
