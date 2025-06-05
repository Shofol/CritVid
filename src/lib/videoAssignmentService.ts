import { supabase } from './supabase';

export interface VideoAssignmentRequest {
  videoId: string;
  adjudicatorId: string;
  clientId?: string;
}

export interface VideoAssignmentResponse {
  success: boolean;
  message: string;
  video?: any;
  error?: string;
}

export const assignAdjudicatorToVideo = async (request: VideoAssignmentRequest): Promise<VideoAssignmentResponse> => {
  try {
    const response = await fetch(
      'https://tasowytszirhdvdiwuia.supabase.co/functions/v1/876f2228-4a3a-4273-8e6f-9e5a77c1d4b4',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabase.supabaseKey}`
        },
        body: JSON.stringify(request)
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to assign adjudicator');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error assigning adjudicator to video:', error);
    return {
      success: false,
      message: 'Failed to assign adjudicator',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Check if video can be assigned (not already assigned)
export const checkVideoAssignmentStatus = async (videoId: string) => {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('status, adjudicator_id')
      .eq('id', videoId)
      .single();

    if (error) {
      console.error('Error checking video status:', error);
      return { canAssign: false, status: 'unknown' };
    }

    return {
      canAssign: data.status === 'pending' && !data.adjudicator_id,
      status: data.status,
      adjudicatorId: data.adjudicator_id
    };
  } catch (error) {
    console.error('Error checking video assignment status:', error);
    return { canAssign: false, status: 'error' };
  }
};