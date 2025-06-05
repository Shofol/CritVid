import React, { useCallback } from 'react';
import { Point, DrawingPath } from '@/types/drawingTypes';

// This file contains the drawing functions extracted from DrawingCanvas.tsx
// These functions should be imported into the main DrawingCanvas component

export const useDrawingFunctions = (
  isDrawing: boolean,
  isDrawingActive: boolean,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  videoRef: React.RefObject<HTMLVideoElement>,
  lastPos: Point,
  currentPath: Point[],
  currentColor: string,
  lineWidth: number,
  drawingDuration: number,
  drawingData: { paths: DrawingPath[] },
  setIsDrawingActive: (active: boolean) => void,
  setLastPos: (pos: Point) => void,
  setCurrentPath: (updater: (prev: Point[]) => Point[]) => void,
  setDrawingData: (data: { paths: DrawingPath[] }) => void
) => {
  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    if (!rect || typeof e.clientX !== 'number' || typeof e.clientY !== 'number') return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDrawingActive(true);
    setLastPos({ x, y });
    setCurrentPath([{ x, y }]);
  }, [isDrawing, canvasRef, setIsDrawingActive, setLastPos, setCurrentPath]);

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingActive || !isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    if (!rect || typeof e.clientX !== 'number' || typeof e.clientY !== 'number') return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(x, y);
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    
    setLastPos({ x, y });
    setCurrentPath(prev => [...prev, { x, y }]);
  }, [isDrawingActive, isDrawing, canvasRef, lastPos, currentColor, lineWidth, setLastPos, setCurrentPath]);

  const endDrawing = useCallback(() => {
    if (isDrawingActive && currentPath.length > 0) {
      const video = videoRef.current;
      if (!video) return;
      
      // Get current video timestamp
      const currentTime = video.currentTime;
      
      // Save the current path with timestamp
      const newPath: DrawingPath = {
        points: currentPath,
        color: currentColor,
        width: lineWidth,
        timestamp: currentTime,
        duration: drawingDuration
      };
      
      const newPaths = [...drawingData.paths, newPath];
      const newDrawingData = { paths: newPaths };
      setDrawingData(newDrawingData);
      
      // Save to localStorage
      const videoElement = videoRef.current;
      if (videoElement) {
        const videoId = videoElement.src;
        try {
          localStorage.setItem(`drawing_${videoId}`, JSON.stringify(newDrawingData));
          
          // Also store with a more reliable key if possible
          const urlParts = videoId.split('/');
          const simpleVideoId = urlParts[urlParts.length - 1].split('.')[0];
          localStorage.setItem(`drawing_${simpleVideoId}`, JSON.stringify(newDrawingData));
        } catch (err) {
          console.error('Error saving drawing data:', err);
        }
      }
    }
    
    setIsDrawingActive(false);
    setCurrentPath([]);
  }, [isDrawingActive, currentPath, videoRef, currentColor, lineWidth, drawingDuration, drawingData, setIsDrawingActive, setCurrentPath, setDrawingData]);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Clear drawing data
    setDrawingData({ paths: [] });
    
    // Clear from localStorage
    const videoElement = videoRef.current;
    if (videoElement) {
      const videoId = videoElement.src;
      localStorage.removeItem(`drawing_${videoId}`);
      
      // Also remove with a more reliable key if possible
      const urlParts = videoId.split('/');
      const simpleVideoId = urlParts[urlParts.length - 1].split('.')[0];
      localStorage.removeItem(`drawing_${simpleVideoId}`);
    }
  }, [canvasRef, videoRef, setDrawingData]);

  // Touch event handlers for mobile support
  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    if (!rect || !e.touches[0]) return;
    
    const touch = e.touches[0];
    if (typeof touch.clientX !== 'number' || typeof touch.clientY !== 'number') return;
    
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    setIsDrawingActive(true);
    setLastPos({ x, y });
    setCurrentPath([{ x, y }]);
  }, [isDrawing, canvasRef, setIsDrawingActive, setLastPos, setCurrentPath]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingActive || !isDrawing) return;
    e.preventDefault();
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    if (!rect || !e.touches[0]) return;
    
    const touch = e.touches[0];
    if (typeof touch.clientX !== 'number' || typeof touch.clientY !== 'number') return;
    
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(x, y);
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    
    setLastPos({ x, y });
    setCurrentPath(prev => [...prev, { x, y }]);
  }, [isDrawingActive, isDrawing, canvasRef, lastPos, currentColor, lineWidth, setLastPos, setCurrentPath]);

  return {
    startDrawing,
    draw,
    endDrawing,
    clearCanvas,
    handleTouchStart,
    handleTouchMove
  };
};