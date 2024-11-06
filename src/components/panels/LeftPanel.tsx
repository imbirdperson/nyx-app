import React, { ReactNode, useState } from "react";
type LeftPanelProps = {
    children: ReactNode;
}

const LeftPanel: React.FC<LeftPanelProps> = ({children}) => {
    const [sidePanelWidth, setSidePanelWidth] = useState<number>(250);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleMouseDown = () => {
    setIsDragging(true);
    document.body.classList.add('no-select'); // Disable text selection
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newWidth = Math.max(0, e.clientX); // Ensure the width does not go below 0
      if (newWidth < 150) {
        setSidePanelWidth(0); // Hide the side panel if the width is less than 150px
      } else {
        setSidePanelWidth(newWidth); // Otherwise, set the new width
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.body.classList.remove('no-select'); // Re-enable text selection
  };

  React.useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);
   

    return (
        <div className="left-pannel-wrapper"
        style={{ width: sidePanelWidth ? `${sidePanelWidth}px` : '0', overflow: sidePanelWidth ? 'auto' : 'hidden' }}
        >
            {children}
        <div className="drag-handle" onMouseDown={handleMouseDown}/>
        </div>
    )
}

export default LeftPanel;