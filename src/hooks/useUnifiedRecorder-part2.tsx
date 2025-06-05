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