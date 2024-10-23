import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react';
import { useEffect, useRef } from 'react';
import * as fabric from 'fabric';

function MainEditor() {
  const { editor, onReady } = useFabricJSEditor();
  const isPanning = useRef<boolean>(false);
  const lastPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const imageScale = useRef<{ scaleX: number; scaleY: number }>({ scaleX: 1, scaleY: 1 });

  const onAddText = () => {
    const textBox = new fabric.Textbox('Double-click to edit', {
      left: 100,
      top: 100,
      width: 200,
      fontSize: 20,
      editable: true,
    });
    editor?.canvas.add(textBox);
  };

  const handleZoom = (event: WheelEvent) => {
    event.preventDefault();
    const zoomAmount = 0.01;
    const canvas = editor?.canvas;

    if (canvas) {
      if (event.deltaY < 0) {
        canvas.setZoom(canvas.getZoom() + zoomAmount);
      } else {
        canvas.setZoom(canvas.getZoom() - zoomAmount);
      }
    }
  };

  const handleDragandDrop = (event: DragEvent) => {
    event.preventDefault();
    const files = event.dataTransfer?.files;

    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = editor?.canvas;

          if (canvas) {
            const canvasWidth = canvas.getWidth();
            const canvasHeight = canvas.getHeight();
            const scale = Math.min(canvasWidth / img.width, canvasHeight / img.height);
            const scaledWidth = img.width * scale;
            const scaledHeight = img.height * scale;

            // Save the scaling factors
            imageScale.current = { scaleX: scale, scaleY: scale };

            const image = new fabric.Image(img, {
              left: (canvasWidth - scaledWidth) / 2,
              top: (canvasHeight - scaledHeight) / 2,
              selectable: true,
            });

            canvas.clear();
            canvas.add(image);
            canvas.renderAll();
          }
        };
      };

      reader.readAsDataURL(file);
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

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
  };

  const handleMouseUp = () => {
    isPanning.current = false;
  };

  const logPositions = () => {
    const canvas = editor?.canvas;
    if (canvas) {
      const image = canvas.getObjects().find(obj => obj.type === 'image');
      const textBoxes = canvas.getObjects().filter(obj => obj.type === 'textbox');

      if (image) {
        const scaledWidth = image.width * image.scaleX * imageScale.current.scaleX;
        const scaledHeight = image.height * image.scaleY * imageScale.current.scaleY;

        console.log(`Image Scaled Pixel Count: Width: ${scaledWidth}, Height: ${scaledHeight}`);

        textBoxes.forEach((textBox, index) => {
          const textBoxPos = { left: textBox.left, top: textBox.top };
          const boundingRect = textBox.getBoundingRect();

          const relativePos = {
            left: textBoxPos.left - image.left,
            top: textBoxPos.top - image.top,
          };

          const textWidthRelative = (boundingRect.width / scaledWidth) * 100; 
          const textHeightRelative = (boundingRect.height / scaledHeight) * 100; 

          console.log(`Text Box ${index + 1} Relative Position to Image: X: ${relativePos.left}, Y: ${relativePos.top}`);
          console.log(`Text Box ${index + 1} Size: Width: ${boundingRect.width}, Height: ${boundingRect.height}`);
          console.log(`Text Box ${index + 1} Size Relative to Image: Width: ${textWidthRelative}%, Height: ${textHeightRelative}%`);
        });
      }
    }
  };

  useEffect(() => {
    const canvasElement = document.querySelector('.sample-canvas');

    if (canvasElement) {
      canvasElement.addEventListener('wheel', handleZoom as EventListener);
      canvasElement.addEventListener('mousedown', handleMouseDown as EventListener);
      canvasElement.addEventListener('mousemove', handleMouseMove as EventListener);
      canvasElement.addEventListener('mouseup', handleMouseUp as EventListener);
      canvasElement.addEventListener('mouseleave', handleMouseUp as EventListener);
      canvasElement.addEventListener('drop', handleDragandDrop as EventListener);
      canvasElement.addEventListener('dragover', handleDragOver as EventListener);
    }

    const positionLogger = setInterval(logPositions, 1000);

    return () => {
      if (canvasElement) {
        canvasElement.removeEventListener('wheel', handleZoom as EventListener);
        canvasElement.removeEventListener('mousedown', handleMouseDown as EventListener);
        canvasElement.removeEventListener('mousemove', handleMouseMove as EventListener);
        canvasElement.removeEventListener('mouseup', handleMouseUp as EventListener);
        canvasElement.removeEventListener('mouseleave', handleMouseUp as EventListener);
        canvasElement.removeEventListener('drop', handleDragandDrop as EventListener);
        canvasElement.removeEventListener('dragover', handleDragOver as EventListener);
      }

      clearInterval(positionLogger);
    };
  }, [editor]);

  return (
    <div className="flex flex-col bg-gray-100 text-black p-4 h-full w-full">
      <div className="flex space-x-4 mb-4">
        <button
          className="px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
          onClick={onAddText}
        >
          Add Text
        </button>
      </div>
      <div className="flex-1">
        <FabricJSCanvas className="w-full h-full sample-canvas" onReady={onReady} />
      </div>
    </div>
  );
}

export default MainEditor;
