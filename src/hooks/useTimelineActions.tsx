import { useState, useCallback } from 'react';
import { safeArrayAccess } from '@/lib/utils';

interface TimelineEvent {
  type: 'pause' | 'resume' | 'seek' | 'play';
  timestamp: number;
  time: number;
  fromTime?: number;
  toTime?: number;
  duration?: number;
  pauseStartTime?: number;
  id?: string;
}

export function useTimelineActions() {
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [pauseStartTime, setPauseStartTime] = useState<number | null>(null);

  const addTimelineEvent = useCallback((event: TimelineEvent) => {
    if (!event || typeof event !== 'object') {
      console.warn('Invalid timeline event:', event);
      return;
    }
    
    // Enhanced pause duration tracking with proper ID generation
    let enhancedEvent = { 
      ...event,
      id: event.id || `${event.type}_${event.time}_${Date.now()}`
    };
    
    if (event.type === 'pause') {
      setPauseStartTime(event.time);
      enhancedEvent.pauseStartTime = event.time;
      // Set default pause duration if not provided
      enhancedEvent.duration = event.duration || 2; // Default 2 seconds
      console.log(`⏸️ Pause started at ${event.time.toFixed(2)}s for ${enhancedEvent.duration}s`);
    } else if (event.type === 'play' || event.type === 'resume') {
      if (pauseStartTime !== null) {
        const pauseDuration = event.time - pauseStartTime;
        enhancedEvent.duration = pauseDuration;
        console.log(`▶️ Resume after ${pauseDuration.toFixed(2)}s pause`);
        setPauseStartTime(null);
        
        // Update the previous pause event with actual duration
        setTimelineEvents(prev => {
          const safeEvents = safeArrayAccess(prev);
          return safeEvents.map(evt => {
            if (evt.type === 'pause' && evt.pauseStartTime === pauseStartTime) {
              return { ...evt, duration: pauseDuration };
            }
            return evt;
          });
        });
      }
    }
    
    console.log('⏰ Adding enhanced timeline event:', enhancedEvent);
    setTimelineEvents(prev => {
      const safeEvents = safeArrayAccess(prev);
      return [...safeEvents, enhancedEvent];
    });
  }, [pauseStartTime]);

  const clearTimelineEvents = useCallback(() => {
    console.log('🧹 Clearing timeline events');
    setTimelineEvents([]);
    setPauseStartTime(null);
  }, []);

  return {
    timelineEvents: safeArrayAccess(timelineEvents),
    addTimelineEvent,
    clearTimelineEvents
  };
}