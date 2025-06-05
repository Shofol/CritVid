  // Initialize the stream before starting recording
  const initializeStream = async (): Promise<MediaStream | null> => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      return stream;
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setError('Could not access microphone. Please check your browser permissions.');
      return null;
    }
  };
  
  const startRecording = useCallback(async (): Promise<void> => {
    if (!videoRef.current) {
      setError('Video reference is not available');
      return;
    }
    
    try {
      setError(null);
      setVideoActions([]);
      
      // Ensure we have a stream before proceeding
      if (!streamRef.current) {
        const stream = await initializeStream();
        if (!stream) {
          throw new Error('Failed to access microphone');
        }
      }
      
      console.log("Stream:", streamRef.current);
      
      // Create media recorder with explicit checking for undefined
      if (!streamRef.current) {
        throw new Error('Media stream is undefined');
      }
      
      // Initialize recorder with specific codec for better compatibility
      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType: 'audio/webm;codecs=opus'
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        // Create blob from chunks
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        
        // Create URL for the audio blob
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        setIsRecording(false);
        console.log('Recording stopped, audio blob created:', audioBlob.size, 'bytes');
        console.log('Video actions recorded:', videoActions.length);
      };
      
      // Start recording with timeslice to get data more frequently
      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      
      // Start timer and set start time reference
      setRecordingTime(0);
      startTimeRef.current = Date.now();
      
      // Create and start interval timer immediately
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1;
          console.log(`Recording time: ${newTime}s`);
          return newTime;
        });
      }, 1000);
      
      // Start video playback and record initial play action
      try {
        await videoRef.current.play();
        // Record initial play action
        const initialAction: VideoAction = {
          type: 'play',
          timestamp: 0,
          videoTime: 0
        };
        setVideoActions([initialAction]);
        saveVideoAction('current-video', initialAction);
        
        // Extract videoId from src if possible and save there too
        if (videoRef.current.src) {
          const urlParts = videoRef.current.src.split('/');
          const filename = urlParts[urlParts.length - 1];
          const simpleVideoId = filename.split('.')[0];
          if (simpleVideoId) {
            saveVideoAction(simpleVideoId, initialAction);
            console.log(`Saved initial play action to ${simpleVideoId}`);
          }
        }
      } catch (playError) {
        console.error('Error playing video:', playError);
      }
      
      console.log('Recording started successfully');
    } catch (error) {
      console.error('Error starting recording:', error);
      setError('Could not access microphone. Please check your browser permissions.');
    }
  }, [videoRef, videoActions]);
  
  const stopRecording = useCallback((): void => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      // Stop the recorder
      mediaRecorderRef.current.stop();
      
      // Clear timer
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      console.log('Recording stopped');
    }
  }, []);
  
  const recordAction = useCallback((type: 'play' | 'pause' | 'seek', videoTime?: number): void => {
    if (!isRecording) return;
    
    const now = Date.now();
    const timestamp = now - startTimeRef.current;
    const currentVideoTime = videoTime !== undefined ? videoTime : 
                             (videoRef.current ? videoRef.current.currentTime : 0);
    
    const action: VideoAction = {
      type,
      timestamp,
      videoTime: currentVideoTime
    };
    
    setVideoActions(prev => [...prev, action]);
    console.log(`Recorded action: ${type} at ${timestamp}ms, video time: ${action.videoTime}s`);
    
    // Also save to localStorage immediately
    try {
      if (videoRef.current) {
        saveVideoAction('current-video', action);
        // Also save to the actual videoId if we can extract it from the src
        if (videoRef.current.src) {
          const urlParts = videoRef.current.src.split('/');
          const filename = urlParts[urlParts.length - 1];
          const simpleVideoId = filename.split('.')[0];
          if (simpleVideoId) {
            saveVideoAction(simpleVideoId, action);
          }
        }
      }
    } catch (e) {
      console.error('Failed to save video action:', e);
    }
  }, [isRecording, videoRef]);
  
  const saveRecordingData = useCallback((videoId: string): void => {
    if (!audioBlob) {
      console.warn('No audio blob available to save');
      return;
    }
    
    try {
      // Convert blob to base64 for storage
      const reader = new FileReader();
      reader.onloadend = () => {
        try {
          // Store audio data
          localStorage.setItem(`audio_data_${videoId}`, reader.result as string);
          
          // Store video actions
          localStorage.setItem(`video_actions_${videoId}`, JSON.stringify(videoActions));
          
          // Store timestamp
          localStorage.setItem(`last_saved_${videoId}`, new Date().toISOString());
          
          console.log(`Saved recording data for video ID: ${videoId}`);
          console.log(`- Audio blob size: ${audioBlob.size} bytes`);
          console.log(`- Video actions: ${videoActions.length} events`);
          
          // Debug: Log the first few actions
          if (videoActions.length > 0) {
            console.log('First 3 video actions:');
            videoActions.slice(0, 3).forEach((action, i) => {
              console.log(`${i+1}. ${action.type} at ${action.timestamp}ms, video time: ${action.videoTime}s`);
            });
          }
        } catch (storageError) {
          console.error('Error saving to localStorage:', storageError);
          setError('Failed to save recording data to storage');
        }
      };
      reader.readAsDataURL(audioBlob);
    } catch (error) {
      console.error('Error in saveRecordingData:', error);
      setError('Failed to process recording data');
    }
  }, [audioBlob, videoActions]);
  
  const clearRecording = useCallback((): void => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl(null);
    setVideoActions([]);
    setRecordingTime(0);
  }, [audioUrl]);
  
  return {
    isRecording,
    recordingTime,
    audioBlob,
    audioUrl,
    videoActions,
    startRecording,
    stopRecording,
    recordAction,
    saveRecordingData,
    clearRecording,
    error
  };
};