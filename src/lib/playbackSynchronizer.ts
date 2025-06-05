/**
 * Enhanced utility for synchronizing video playback with recorded actions
 * Includes proper pause duration handling and debounced action processing
 */
import { VideoAction, SynchronizedPlaybackOptions } from '@/types/timelineTypes';

export class PlaybackSynchronizer {
  private video: HTMLVideoElement;
  private audio?: HTMLAudioElement;
  private actions: VideoAction[];
  private startTime: number = 0;
  private isPlaying: boolean = false;
  private actionIndex: number = 0;
  private rafId: number | null = null;
  private onComplete?: () => void;
  private pauseTimeouts: Map<number, NodeJS.Timeout> = new Map();
  private currentPauseTimeout: NodeJS.Timeout | null = null;

  constructor(options: SynchronizedPlaybackOptions) {
    this.video = options.videoElement;
    this.audio = options.audioElement;
    
    // Process and sort actions by timestamp
    this.actions = [...options.actions].sort((a, b) => a.timestamp - b.timestamp);
    this.onComplete = options.onComplete;
    
    console.log('PlaybackSynchronizer initialized with', this.actions.length, 'actions');
    this.logActions();
  }

  // Log all actions for debugging
  private logActions(): void {
    if (this.actions.length === 0) {
      console.warn('No actions to synchronize');
      return;
    }
    
    console.group('Video Actions to Synchronize:');
    this.actions.forEach((action, index) => {
      const durationText = action.duration ? ` (duration: ${action.duration}ms)` : '';
      console.log(
        `${index + 1}. ${action.type.toUpperCase()} at ${action.timestamp}ms` + 
        (action.videoTime !== undefined ? `, video time: ${action.videoTime.toFixed(2)}s` : '') +
        durationText
      );
    });
    console.groupEnd();
  }

  public async start(): Promise<void> {
    // Reset state and clear any existing timeouts
    this.actionIndex = 0;
    this.startTime = Date.now();
    this.isPlaying = true;
    this.clearPauseTimeouts();
    
    try {
      // Load media elements
      this.video.load();
      
      if (this.audio) {
        this.audio.currentTime = 0;
        this.audio.load();
        await new Promise(resolve => setTimeout(resolve, 100));
        
        try {
          await this.audio.play().catch(err => {
            console.warn('Audio play was prevented:', err);
          });
        } catch (err) {
          console.warn('Audio play was prevented:', err);
        }
      }
      
      // Set initial video state
      if (this.actions.length > 0) {
        const firstAction = this.actions[0];
        if (firstAction.videoTime !== undefined) {
          this.video.currentTime = firstAction.videoTime;
        }
        
        if (firstAction.type === 'play') {
          await new Promise(resolve => setTimeout(resolve, 100));
          await this.video.play().catch(err => {
            console.error('Error playing video:', err);
            throw new Error('Video playback failed. Please try again.');
          });
        } else {
          this.video.pause();
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, 100));
        await this.video.play().catch(err => {
          console.error('Error playing video:', err);
          throw new Error('Video playback failed. Please try again.');
        });
      }
      
      // Start synchronization loop
      this.syncLoop();
    } catch (error) {
      console.error('Error in playback synchronizer start:', error);
      this.isPlaying = false;
      throw error;
    }
  }

  public stop(): void {
    this.isPlaying = false;
    this.clearPauseTimeouts();
    
    if (this.audio) {
      this.audio.pause();
    }
    this.video.pause();
    
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private clearPauseTimeouts(): void {
    this.pauseTimeouts.forEach(timeout => clearTimeout(timeout));
    this.pauseTimeouts.clear();
    
    if (this.currentPauseTimeout) {
      clearTimeout(this.currentPauseTimeout);
      this.currentPauseTimeout = null;
    }
  }

  private syncLoop(): void {
    if (!this.isPlaying) return;
    
    const currentTime = Date.now();
    const elapsed = currentTime - this.startTime;
    
    // Process actions that should have occurred by now
    while (
      this.actionIndex < this.actions.length && 
      this.actions[this.actionIndex].timestamp <= elapsed
    ) {
      const action = this.actions[this.actionIndex];
      this.executeAction(action);
      this.actionIndex++;
    }
    
    // Check completion
    if (this.actionIndex >= this.actions.length) {
      if (this.audio && !this.audio.ended && !this.audio.paused) {
        this.rafId = requestAnimationFrame(() => this.syncLoop());
      } else if (!this.video.ended && !this.video.paused) {
        this.rafId = requestAnimationFrame(() => this.syncLoop());
      } else {
        this.stop();
        if (this.onComplete) {
          this.onComplete();
        }
      }
    } else {
      this.rafId = requestAnimationFrame(() => this.syncLoop());
    }
  }

  public async executeAction(action: VideoAction): Promise<void> {
    const formatTimestamp = (ms: number): string => {
      const totalSeconds = Math.floor(ms / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };
    
    const formattedTime = formatTimestamp(action.timestamp);
    
    switch (action.type) {
      case 'play':
        console.log(`Playing at ${formattedTime}`);
        if (this.video.paused) {
          try {
            await this.video.play();
            if (this.audio && this.audio.paused) {
              await this.audio.play();
            }
          } catch (err) {
            console.warn('Play was prevented:', err);
          }
        }
        break;
      
      case 'pause':
        const duration = action.duration || 0;
        console.log(`Pausing at ${formattedTime}${duration ? ` for ${duration}ms` : ''}`);
        
        // Pause video and audio immediately
        if (!this.video.paused) {
          this.video.pause();
        }
        if (this.audio && !this.audio.paused) {
          this.audio.pause();
        }
        
        // If we have a duration, schedule resume
        if (duration > 0) {
          this.currentPauseTimeout = setTimeout(async () => {
            if (this.isPlaying) {
              console.log(`Resuming after ${duration}ms pause`);
              try {
                await this.video.play();
                if (this.audio) {
                  await this.audio.play();
                }
              } catch (err) {
                console.warn('Resume after pause was prevented:', err);
              }
            }
          }, duration);
        }
        break;
      
      case 'seek':
        if (action.videoTime !== undefined) {
          console.log(`Seeking to ${formatTimestamp(action.videoTime * 1000)}`);
          this.video.currentTime = action.videoTime;
          if (this.audio) {
            this.audio.currentTime = action.videoTime;
          }
        }
        break;
    }
  }
}

// Helper functions
export const loadVideoActions = (videoId: string): VideoAction[] => {
  try {
    const actionsData = localStorage.getItem(`video_actions_${videoId}`);
    if (actionsData) {
      const actions = JSON.parse(actionsData) as VideoAction[];
      console.log(`Loaded ${actions.length} video actions for ${videoId}`);
      return actions;
    }
  } catch (error) {
    console.error('Error loading video actions:', error);
  }
  return [];
};

export const saveVideoAction = (videoId: string, action: VideoAction): void => {
  try {
    const actions = loadVideoActions(videoId);
    actions.push(action);
    localStorage.setItem(`video_actions_${videoId}`, JSON.stringify(actions));
    console.log(`Saved ${action.type} action for video ${videoId}`);
  } catch (error) {
    console.error('Error saving video action:', error);
  }
};
