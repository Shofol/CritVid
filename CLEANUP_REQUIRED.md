# MANUAL CLEANUP REQUIRED

The following files need to be manually deleted from the filesystem as they are legacy/unused:

## Components to DELETE:
- src/components/video-editor/ (entire directory)
- src/components/critique-studio/ (entire directory) 
- src/components/critique/ (entire directory)

## Pages to DELETE:
- src/pages/VideoEditor.tsx
- src/pages/VideoEditorIndex.tsx
- src/pages/VideoCritique.tsx
- src/pages/CritiqueStudio.tsx
- src/pages/AdvancedVideoEditorPage.tsx
- src/pages/adjudicator/CritiqueEditor.tsx

## Hooks to DELETE:
- src/hooks/useCritiqueStudio*.tsx (all variants)
- src/hooks/useUnifiedRecorder*.tsx (all variants)
- src/hooks/useAudioRecorder*.tsx
- src/hooks/useDrawingCanvas.tsx
- src/hooks/useDualAudioRecorder.tsx
- src/hooks/useVideoPlayer*.tsx

## KEEP ONLY:
- PlaybackTracker.tsx
- PlaybackPreviewPlayer.tsx
- PlaybackTrackerPage.tsx
- useUnifiedCritique.tsx
- useTimelineActions.tsx
- useVideoActions.tsx

I cannot delete files through this interface - only read/write them.