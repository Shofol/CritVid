import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { loadVideoActions } from '@/lib/playbackSynchronizer';

interface EnhancedBasicCritiquePlayerProps {
  videoUrl: string;
  audioUrl: string | null;
  videoId: string;
}

const EnhancedBasicCritiquePlayer: React.FC<EnhancedBasicCritiquePlayerProps> = ({
  videoUrl,
  audioUrl,
  videoId,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  
  // Load video actions from localStorage
  const videoActions = loadVideoActions(videoId);
  
  useEffect(() => {
    // Initialize when video and audio are ready
    const video = videoRef.current;
    const audio = audioRef.current;
    
    if (!video) return;
    
    const handleVideoReady = () => {
      console.log('Video is ready');
      checkIfReady();
    };
    
    const handleAudioReady = () => {
      console.log('Audio is ready');
      checkIfReady();
    };
    
    const checkIfReady = () => {
      if (video.readyState >= 2) {
        if (audioUrl && audio) {
          if (audio.readyState >= 2) {
            setIsReady(true);
          }
        } else {
          setIsReady(true);
        }
      }
    };
    
    const handleVideoError = (e: Event) => {
      console.error('Video error in EnhancedBasicCritiquePlayer:', e);
      setLoadError('Failed to load video');
      
      // Try to use a fallback video source
      try {
        console.log('EnhancedBasicCritiquePlayer: Attempting to load fallback video');
        video.src = '/sample-dance-video.mp4';
        video.load();
      } catch (err) {
        console.error('Failed to load fallback video:', err);
      }
    };
    
    // Set up event listeners
    video.addEventListener('loadeddata', handleVideoReady);
    video.addEventListener('error', handleVideoError);
    
    // Set up audio if available
    if (audioUrl && audio) {
      audio.addEventListener('loadeddata', handleAudioReady);
      audio.addEventListener('error', () => setLoadError('Failed to load audio'));
      
      // Explicitly set the audio source and load it
      audio.src = audioUrl;
      audio.load();
    }
    
    // Explicitly load the video
    video.load();
    
    // Initial check in case elements are already loaded
    checkIfReady();
    
    return () => {
      video.removeEventListener('loadeddata', handleVideoReady);
      video.removeEventListener('error', handleVideoError);
      if (audio) {
        audio.removeEventListener('loadeddata', handleAudioReady);
        audio.removeEventListener('error', () => {});
      }
    };
  }, [videoUrl, audioUrl]);
  
  const togglePlayback = async () => {
    if (!isReady || !videoRef.current) return;
    
    try {
      const video = videoRef.current;
      const audio = audioRef.current;
      
      if (isPlaying) {
        // Pause both video and audio
        video.pause();
        if (audio) audio.pause();
        setIsPlaying(false);
      } else {
        // Ensure both elements are loaded before playing
        video.load();
        if (audio) audio.load();
        
        // Small delay to ensure everything is loaded
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // Play video first
        try {
          await video.play();
        } catch (err) {
          console.error('Error playing video:', err);
          setLoadError('Failed to play video. Please try again.');
          return;
        }
        
        // Then play audio if available
        if (audio && audioUrl) {
          try {
            // Ensure audio is at the same position as video
            audio.currentTime = video.currentTime;
            await audio.play().catch(err => {
              console.warn('Audio play was prevented:', err);
              // Continue without audio - we'll still play the video
            });
          } catch (err) {
            console.warn('Error playing audio:', err);
            // Continue without audio - we'll still play the video
          }
        }
        
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
      setLoadError('Playback error. Please try again.');
    }
  };
  
  const resetPlayback = () => {
    if (!videoRef.current) return;
    
    const video = videoRef.current;
    const audio = audioRef.current;
    
    // Pause both
    video.pause();
    if (audio) audio.pause();
    
    // Reset positions
    video.currentTime = 0;
    if (audio) audio.currentTime = 0;
    
    setIsPlaying(false);
  };
  
  const toggleMute = () => {
    if (!audioRef.current) return;
    
    const newMuteState = !isMuted;
    audioRef.current.muted = newMuteState;
    setIsMuted(newMuteState);
  };
  
  // Keep audio and video in sync during playback
  useEffect(() => {
    const video = videoRef.current;
    const audio = audioRef.current;
    
    if (!video || !audio || !isPlaying) return;
    
    const syncAudioToVideo = () => {
      // Only sync if the difference is significant (more than 0.1 seconds)
      if (Math.abs(audio.currentTime - video.currentTime) > 0.1) {
        audio.currentTime = video.currentTime;
      }
    };
    
    const handleVideoEnded = () => {
      setIsPlaying(false);
      if (audio) audio.pause();
    };
    
    const handleAudioEnded = () => {
      // If audio ends but video is still playing, just let video continue
      console.log('Audio ended');
    };
    
    // Set up event listeners
    video.addEventListener('timeupdate', syncAudioToVideo);
    video.addEventListener('ended', handleVideoEnded);
    audio.addEventListener('ended', handleAudioEnded);
    
    return () => {
      video.removeEventListener('timeupdate', syncAudioToVideo);
      video.removeEventListener('ended', handleVideoEnded);
      audio.removeEventListener('ended', handleAudioEnded);
    };
  }, [isPlaying]);
  
  return (
    <Card className="w-full mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Critique Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-video bg-slate-950 rounded-md overflow-hidden w-full">
          <video 
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-contain"
            poster="/placeholder.svg"
            controls={false}
            preload="auto"
            playsInline
            muted={false}
            crossOrigin="anonymous"
          />
          
          {/* Hidden audio element for critique playback */}
          {audioUrl && (
            <audio 
              ref={audioRef} 
              src={audioUrl}
              preload="auto"
              className="hidden" 
            />
          )}
          
          {loadError && (
            <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
              <div className="text-white text-center p-4">
                <p>{loadError}</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.src = '/sample-dance-video.mp4';
                      videoRef.current.load();
                      setLoadError(null);
                    }
                  }}
                  type="button"
                >
                  Try Sample Video
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button 
            onClick={togglePlayback} 
            disabled={!isReady}
            className="flex items-center"
            type="button"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 mr-2" /> Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" /> Play
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={resetPlayback}
            className="flex items-center"
            type="button"
          >
            <RotateCcw className="w-4 h-4 mr-2" /> Reset
          </Button>
          
          {audioUrl && (
            <Button
              variant="outline"
              onClick={toggleMute}
              className="flex items-center"
              type="button"
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-4 h-4 mr-2" /> Unmute
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 mr-2" /> Mute
                </>
              )}
            </Button>
          )}
        </div>
        
        {!audioUrl && (
          <p className="text-sm text-amber-500 mt-2">
            No audio recording available for this critique.
          </p>
        )}
        
        {videoActions.length > 0 && (
          <div className="mt-2 p-2 bg-muted rounded-md">
            <p className="text-xs text-muted-foreground">
              This critique contains {videoActions.length} timeline events, including 
              {videoActions.filter(a => a.type === 'pause').length} pauses. 
              Use the synchronized player for full playback with all actions.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedBasicCritiquePlayer;
