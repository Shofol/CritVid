// Continuation of useCritiqueStudio.tsx

// Start recording
const startRecording = useCallback(async () => {
  try {
    setState(prev => ({ ...prev, error: null }));
    
    // First explicitly request microphone permission
    const permissionGranted = await requestMicrophonePermission();
    if (!permissionGranted) {
      return;
    }
    
    // Start audio recording
    await audioRecorder.startRecording();
    
    // Start tracking video actions
    actionsControls.startRecording();
    
    // Update state
    setState(prev => ({
      ...prev,
      isRecording: true,
      isPreviewMode: false,
      error: null
    }));
  } catch (error) {
    console.error('Error starting recording:', error);
    setState(prev => ({ 
      ...prev, 
      error: `Error starting recording: ${error instanceof Error ? error.message : String(error)}` 
    }));
    throw error; // Re-throw to allow handling in the component
  }
}, [audioRecorder, actionsControls, requestMicrophonePermission]);

// Stop recording
const stopRecording = useCallback(async () => {
  try {
    // Stop audio recording
    const audioBlob = await audioRecorder.stopRecording();
    
    // Stop tracking video actions
    actionsControls.stopRecording();
    
    // Update state
    setState(prev => ({
      ...prev,
      isRecording: false,
      error: null
    }));
    
    return audioBlob;
  } catch (error) {
    console.error('Error stopping recording:', error);
    setState(prev => ({ 
      ...prev, 
      error: `Error stopping recording: ${error instanceof Error ? error.message : String(error)}` 
    }));
    return null;
  }
}, [audioRecorder, actionsControls]);

// Save critique
const saveCritique = useCallback(async () => {
  if (!options.videoId) {
    console.error('Cannot save critique: No video ID provided');
    setState(prev => ({ ...prev, error: 'Cannot save critique: No video ID provided' }));
    return null;
  }
  
  try {
    // Create critique data object
    const critiqueData: CritiqueData = {
      videoId: options.videoId,
      audioBlob: audioRecorder.state.audioBlob,
      drawings: state.drawings,
      timelineActions: actionsState.actions as unknown as TimelineAction[],
      duration: audioRecorder.state.elapsedTime / 1000, // Convert ms to seconds
      createdAt: Date.now(),
    };
    
    // Save to backend
    const critiqueId = await saveCritiqueRecording(options.videoId, critiqueData);
    
    return critiqueId;
  } catch (error) {
    console.error('Error saving critique:', error);
    setState(prev => ({ 
      ...prev, 
      error: `Error saving critique: ${error instanceof Error ? error.message : String(error)}` 
    }));
    return null;
  }
}, [options.videoId, audioRecorder.state, state.drawings, actionsState.actions]);