import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Video, AlertCircle, Volume2, VolumeX } from 'lucide-react';

interface BasicCritiquePlayerProps {
  videoUrl: string;
  audioUrl: string | null;
  videoId: string;
}

const BasicCritiquePlayer: React.FC<BasicCritiquePlayerProps> = ({
  videoUrl,
  audioUrl,
  videoId
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoStatus, setVideoStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [audioStatus, setAudioStatus] = useState<'loading' | 'ready' | 'error' | 'none'>(
    audioUrl ? 'loading' : 'none'
  );
  
  // Log props when they change
  useEffect(() => {
    console.log('BasicCritiquePlayer props:', { videoUrl, audioUrl, videoId });
  }, [videoUrl, audioUrl, videoId]);
  
  useEffect(() => {
    // Basic initialization when both video and audio are ready
    const video = videoRef.current;
    const audio = audioRef.current;
    
    if (!video) {
      console.error('Video element not found');
      setError('Video element not initialized');
      return;
    }
    
    // Check video URL
    if (!videoUrl) {
      console.error('No video URL provided');
      setError('No video source available');
      setVideoStatus('error');
      return;
    }
    
    // Set up event listeners for video
    const handleVideoError = (e: Event) => {
      console.error('Video error:', e);
      setError('Error loading video');
      setVideoStatus('error');
      
      // Try to use a fallback video source
      try {
        console.log('BasicCritiquePlayer: Attempting to load fallback video');
        video.src = '/sample-dance-video.mp4';
        video.load();
      } catch (err) {
        console.error('Failed to load fallback video:', err);
      }
    };
    
    const handleVideoReady = () => {
      console.log('Video ready state:', video.readyState);
      if (video.readyState >= 2) {
        setVideoStatus('ready');
        checkIfReady();
      }
    };
    
    // Set up event listeners for audio if available
    const handleAudioError = (e: Event) => {
      console.error('Audio error:', e);
      // Don't set main error for audio, just update status
      setAudioStatus('error');
    };
    
    const handleAudioReady = () => {
      if (!audio) return;
      console.log('Audio ready state:', audio.readyState);
      if (audio.readyState >= 2) {
        setAudioStatus('ready');
        checkIfReady();
      }
    };
    
    const checkIfReady = () => {
      const videoReady = video.readyState >= 2;
      const audioReady = !audioUrl || !audio || audio.readyState >= 2;
      
      if (videoReady && audioReady) {
        console.log('Both video and audio are ready');
        setIsReady(true);
      }
    };
    
    video.addEventListener('loadeddata', handleVideoReady);
    video.addEventListener('canplay', handleVideoReady);
    video.addEventListener('error', handleVideoError);
    
    if (audio && audioUrl) {
      audio.addEventListener('loadeddata', handleAudioReady);
      audio.addEventListener('canplay', handleAudioReady);
      audio.addEventListener('error', handleAudioError);
      
      // Set audio source
      try {
        audio.src = audioUrl;
        console.log('Set audio source:', audioUrl);
      } catch (err) {
        console.error('Error setting audio source:', err);
        setAudioStatus('error');
      }
    } else {
      // No audio, so just check if video is ready
      checkIfReady();
    }
    
    return () => {
      video.removeEventListener('loadeddata', handleVideoReady);
      video.removeEventListener('canplay', handleVideoReady);
      video.removeEventListener('error', handleVideoError);
      
      if (audio) {
        audio.removeEventListener('loadeddata', handleAudioReady);
        audio.removeEventListener('canplay', handleAudioReady);
        audio.removeEventListener('error', handleAudioError);
      }
    };
  }, [videoUrl, audioUrl]);
  
  const startPlayback = () => {
    if (!isReady || !videoRef.current) {
      console.error('Cannot start playback - not ready or video ref missing');
      return;
    }
    
    const video = videoRef.current;
    const audio = audioRef.current;
    
    // Simple synchronized playback
    if (audio && audioUrl) {
      try {
        audio.currentTime = video.currentTime;
        const audioPlayPromise = audio.play();
        
        if (audioPlayPromise !== undefined) {
          audioPlayPromise.catch(err => {
            console.error('Error playing audio:', err);
            setError(`Error playing audio: ${err.message}`);
          });
        }
      } catch (err) {
        console.error('Error in audio playback setup:', err);
      }
    }
    
    try {
      const videoPlayPromise = video.play();
      
      if (videoPlayPromise !== undefined) {
        videoPlayPromise.catch(err => {
          console.error('Error playing video:', err);
          setError(`Error playing video: ${err.message}`);
        });
      }
      
      setIsPlaying(true);
      console.log('Playback started');
    } catch (err) {
      console.error('Error in video playback setup:', err);
    }
  };
  
  const stopPlayback = () => {
    const video = videoRef.current;
    const audio = audioRef.current;
    
    if (video) video.pause();
    if (audio) audio.pause();
    
    setIsPlaying(false);
    console.log('Playback stopped');
  };
  
  const resetPlayback = () => {
    stopPlayback();
    if (videoRef.current) videoRef.current.currentTime = 0;
    if (audioRef.current) audioRef.current.currentTime = 0;
    console.log('Playback reset');
  };
  
  return (
    <Card className="w-full mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center">
          <Video className="w-4 h-4 mr-2" />
          Critique Playback
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Media Status Indicators */}
        <div className="flex justify-between mb-2">
          <div className="flex items-center">
            <Video className="w-4 h-4 mr-1" />
            <span className="text-xs">
              Video: 
              {videoStatus === 'loading' && <span className="text-yellow-500">Loading...</span>}
              {videoStatus === 'ready' && <span className="text-green-500">Ready</span>}
              {videoStatus === 'error' && <span className="text-red-500">Error</span>}
            </span>
          </div>
          
          <div className="flex items-center">
            {audioUrl ? (
              <>
                <Volume2 className="w-4 h-4 mr-1" />
                <span className="text-xs">
                  Audio: 
                  {audioStatus === 'loading' && <span className="text-yellow-500">Loading...</span>}
                  {audioStatus === 'ready' && <span className="text-green-500">Ready</span>}
                  {audioStatus === 'error' && <span className="text-red-500">Error</span>}
                </span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 mr-1" />
                <span className="text-xs text-gray-500">No Audio</span>
              </>
            )}
          </div>
        </div>
        
        <div className="relative aspect-video bg-slate-950 rounded-md overflow-hidden w-full">
          <video 
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-contain"
            poster="/placeholder.svg"
            controls={false}
            playsInline
            preload="auto"
            muted={false}
            crossOrigin="anonymous"
            onError={(e) => {
              console.error('Video error event fired', e);
              setVideoStatus('error');
            }}
          />
          
          {/* Hidden audio element for critique playback */}
          <audio 
            ref={audioRef} 
            className="hidden" 
            preload="auto"
            onError={() => {
              console.error('Audio error event fired');
              setAudioStatus('error');
            }}
          />
          
          {/* Error overlay */}
          {videoStatus === 'error' && (
            <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
              <div className="text-white text-center p-4">
                <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                <p>Video failed to load</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.src = '/sample-dance-video.mp4';
                      videoRef.current.load();
                      setVideoStatus('loading');
                      setError(null);
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
          {!isPlaying ? (
            <Button 
              onClick={startPlayback} 
              disabled={!isReady}
              className="flex items-center"
              type="button"
            >
              <Play className="w-4 h-4 mr-2" /> Play Critique
            </Button>
          ) : (
            <Button 
              onClick={stopPlayback}
              variant="destructive"
              className="flex items-center"
              type="button"
            >
              <Pause className="w-4 h-4 mr-2" /> Pause
            </Button>
          )}
          
          <Button 
            variant="outline" 
            onClick={resetPlayback}
            className="flex items-center"
            type="button"
          >
            <RotateCcw className="w-4 h-4 mr-2" /> Reset
          </Button>
        </div>
        
        {!audioUrl && (
          <div className="mt-2 p-2 bg-yellow-100 dark:bg-yellow-900 rounded-md">
            <p className="text-sm text-yellow-800 dark:text-yellow-200 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              No audio recording available for this critique.
            </p>
          </div>
        )}
        
        {audioStatus === 'error' && audioUrl && (
          <div className="mt-2 p-2 bg-yellow-100 dark:bg-yellow-900 rounded-md">
            <p className="text-sm text-yellow-800 dark:text-yellow-200 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              Audio failed to load. The critique will play without audio commentary.
            </p>
          </div>
        )}
        
        {error && (
          <div className="mt-2 p-2 bg-red-100 dark:bg-red-900 rounded-md">
            <p className="text-xs text-red-800 dark:text-red-200 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              {error}
            </p>
          </div>
        )}
        
        {isPlaying && audioStatus === 'ready' && (
          <div className="mt-2 p-2 bg-green-100 dark:bg-green-900 rounded-md">
            <p className="text-xs text-green-800 dark:text-green-200 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              Audio and video playing in basic sync mode
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BasicCritiquePlayer;
