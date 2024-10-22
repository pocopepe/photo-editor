import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react';
import { useEffect, useRef } from 'react';
import * as fabric from 'fabric'; 

function MainEditor() {
  const { editor, onReady } = useFabricJSEditor();
  const isPanning = useRef<boolean>(false);
  const lastPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const onAddCircle = () => {
    editor?.addCircle();
  };

  const onAddRectangle = () => {
    editor?.addRectangle();
  };

  const handleZoom = (event: WheelEvent) => {
    event.preventDefault(); 
    const zoomAmount = 0.1; 
    const canvas = editor?.canvas;

    if (canvas) {
      if (event.deltaY < 0) {
        canvas.setZoom(canvas.getZoom() + zoomAmount);
      } else {
        canvas.setZoom(canvas.getZoom() - zoomAmount);
      }
    }
  };

  const handleMouseDown = (event: MouseEvent) => {
    if (event.ctrlKey) {
      isPanning.current = true;
      lastPos.current = { x: event.clientX, y: event.clientY };
      editor?.canvas.set('selection', false); 
    }
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (isPanning.current) {
      const canvas = editor?.canvas;
      const deltaX = event.clientX - lastPos.current.x;
      const deltaY = event.clientY - lastPos.current.y;

      if (canvas) {
        canvas.relativePan(new fabric.Point(deltaX, deltaY));
      }

      lastPos.current = { x: event.clientX, y: event.clientY };
    }
  };

  const handleMouseUp = () => {
    isPanning.current = false; 
  };

  useEffect(() => {
    const canvasElement = document.querySelector('.sample-canvas');

    if (canvasElement) {
      canvasElement.addEventListener('wheel', handleZoom as EventListener);
      canvasElement.addEventListener('mousedown', handleMouseDown as EventListener);
      canvasElement.addEventListener('mousemove', handleMouseMove as EventListener);
      canvasElement.addEventListener('mouseup', handleMouseUp as EventListener);
      canvasElement.addEventListener('mouseleave', handleMouseUp as EventListener);
    }

    return () => {
      if (canvasElement) {
        canvasElement.removeEventListener('wheel', handleZoom as EventListener);
        canvasElement.removeEventListener('mousedown', handleMouseDown as EventListener);
        canvasElement.removeEventListener('mousemove', handleMouseMove as EventListener);
        canvasElement.removeEventListener('mouseup', handleMouseUp as EventListener);
        canvasElement.removeEventListener('mouseleave', handleMouseUp as EventListener);
      }
    };
  }, [editor]);

  return (
    <div className="flex flex-col bg-gray-100 text-black p-4 h-full w-full">
      <div className="flex space-x-4 mb-4">
        <button className="px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200" onClick={onAddCircle}>
          Add Circle
        </button>
        <button className="px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200" onClick={onAddRectangle}>
          Add Rectangle
        </button>
      </div>
      <div className="flex-1">
        <FabricJSCanvas className="w-full h-full sample-canvas" onReady={onReady} />
      </div>
    </div>
  );
}

export default MainEditor;
