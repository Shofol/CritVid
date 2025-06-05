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
  }, [isDrawingActive, isDrawing, lastPos, currentColor, lineWidth]);

  const handleDurationChange = useCallback((newDuration: number) => {
    setDrawingDuration(newDuration);
  }, []);

  const colorOptions = [
    '#ff0000', // Red
    '#00ff00', // Green
    '#0000ff', // Blue
    '#ffff00', // Yellow
    '#ffffff', // White
  ];

  return (
    <>
      <canvas
        ref={canvasRef}
        className={`absolute top-0 left-0 w-full h-full ${isDrawing ? 'cursor-crosshair' : 'pointer-events-none'}`}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseLeave={endDrawing}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={endDrawing}
        data-testid="drawing-canvas"
      />
      {isDrawing && (
        <div className="absolute top-2 right-2 flex flex-col gap-2 bg-black bg-opacity-70 p-2 rounded z-30">
          <div className="flex gap-1">
            {colorOptions.map(color => (
              <button
                key={color}
                onClick={() => setCurrentColor(color)}
                className={`w-5 h-5 rounded-full ${currentColor === color ? 'ring-2 ring-white' : ''}`}
                style={{ backgroundColor: color }}
                title={`Color: ${color}`}
                type="button"
              />
            ))}
          </div>
          
          <div className="mt-2 w-48">
            <DrawingDurationControl 
              duration={drawingDuration}
              onDurationChange={handleDurationChange}
            />
          </div>
          
          <button
            onClick={clearCanvas}
            className="bg-white bg-opacity-70 text-black px-2 py-1 rounded text-sm mt-2"
            data-testid="clear-canvas-button"
            type="button"
          >
            Clear All
          </button>
        </div>
      )}
    </>
  );
};

export default DrawingCanvas;