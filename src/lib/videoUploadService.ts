import { supabase } from './supabase';

/**
 * Interface for video upload data
 */
export interface VideoUploadData {
  title: string;
  danceStyle: string;
  feedback?: string;
  videoFile: File;
}

/**
 * Service for handling video uploads to Supabase
 */
export const videoUploadService = {
  /**
   * Upload a video file to Supabase storage
   * @param data The video upload data including file and metadata
   * @returns The uploaded video ID
   */
  uploadVideo: async (data: VideoUploadData): Promise<string> => {
    try {
      // Get the current user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      
      if (userError || !userId) {
        // If no authenticated user, use a demo user ID for testing
        console.warn('No authenticated user found, using demo mode');
        
        // Get or create a demo user ID
        let demoUserId = localStorage.getItem('demoUserId');
        if (!demoUserId) {
          demoUserId = 'demo-user-' + Math.random().toString(36).substring(2, 9);
          localStorage.setItem('demoUserId', demoUserId);
        }
        
        // Generate a unique filename
        const timestamp = new Date().getTime();
        const fileExt = data.videoFile.name.split('.').pop();
        const fileName = `${timestamp}-${data.videoFile.name.substring(0, 20)}.${fileExt}`;
        
        // Call the demo upload function
        const response = await fetch(
          'https://tasowytszirhdvdiwuia.supabase.co/functions/v1/fd799b3a-8619-400a-b5d4-a79ef866f3bb',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              title: data.title,
              danceStyle: data.danceStyle,
              feedback_request: data.feedback,
              fileName,
              demoUserId
            })
          }
        );
        
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to create video record');
        }
        
        // Upload the actual file using the signed URL
        if (result.uploadUrl) {
          const uploadResponse = await fetch(result.uploadUrl, {
            method: 'PUT',
            headers: {
              'Content-Type': data.videoFile.type,
            },
            body: data.videoFile
          });
  
          if (!uploadResponse.ok) {
            throw new Error('Failed to upload video file');
          }
        }
  
        return result.videoId;
      }

      // For authenticated users, use the edge function approach
      const timestamp = new Date().getTime();
      const fileExt = data.videoFile.name.split('.').pop();
      const fileName = `${timestamp}-${data.videoFile.name.substring(0, 20)}.${fileExt}`;

      const response = await fetch(
        'https://tasowytszirhdvdiwuia.supabase.co/functions/v1/46c14dfc-95e9-4821-8c9f-34043a4eb1ec',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
          },
          body: JSON.stringify({
            title: data.title,
            danceStyle: data.danceStyle,
            feedback_request: data.feedback,
            fileName,
            userId
          })
        }
      );

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create video record');
      }

      if (result.uploadUrl) {
        const uploadResponse = await fetch(result.uploadUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': data.videoFile.type,
          },
          body: data.videoFile
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload video file');
        }
      }

      return result.videoId;
    } catch (error) {
      console.error('Error uploading video:', error);
      throw error;
    }
  },

  /**
   * Get a list of videos for the current user
   * @returns Array of user videos
   */
  getUserVideos: async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      
      if (!userId) {
        console.warn('No authenticated user found, checking for demo videos');
        const demoUserId = localStorage.getItem('demoUserId');
        
        if (demoUserId) {
          const { data, error } = await supabase
            .from('videos')
            .select('*')
            .eq('user_id', demoUserId)
            .order('created_at', { ascending: false });
            
          if (error) throw error;
          return Array.isArray(data) ? data : [];
        }
        
        return [];
      }
      
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching user videos:', error);
      return [];
    }
  }
};