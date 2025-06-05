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