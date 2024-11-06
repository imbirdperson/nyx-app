import React, { ReactNode, useState } from "react";
import { Sidebar } from '@geist-ui/icons';
type LeftPanelProps = {
    children: ReactNode;
}

const LeftPanel: React.FC<LeftPanelProps> = ({children}) => {
    const [sidePanelWidth, setSidePanelWidth] = useState<number>(250);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [isVisible, setIsVisible] = useState(true);


    const handleClick = () => {
        console.log("Sidebar toggle clicked!");
        setSidePanelWidth(0);
        setIsVisible(!isVisible);
        // Add additional logic to handle the sidebar visibility here
    };

    const handleMouseDown = () => {
        setIsDragging(true);
        document.body.classList.add('no-select'); // Disable text selection
        document.body.classList.add("resizing");
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (isDragging) {
            const newWidth = Math.max(0, e.clientX); // Ensure the width does not go below 0
        if (newWidth < 120) {
            setSidePanelWidth(0); // Hide the side panel if the width is less than 150px
        } else {
            setSidePanelWidth(newWidth); // Otherwise, set the new width
        }
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        document.body.classList.remove('no-select'); // Re-enable text selection
        document.body.classList.remove("resizing");
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
        <div className={`left-pannel-wrapper`}
        style={{ width: sidePanelWidth ? `${sidePanelWidth}px` : '0'}}
        >
            <div className="left-pannel-content">

                <SideBarToggle onClick={handleClick}/>
                {children}
            </div>
        <div className="drag-handle" onMouseDown={handleMouseDown}>
            <div className="drag-handle-visible"/>
        </div>
        </div>
    )
}

export default LeftPanel;

interface SideBarToggleProps {
    onClick?: () => void; // Define the type for the click prop
  }

const SideBarToggle: React.FC<SideBarToggleProps> = ({onClick}) => {
    return (
      <div className="sidebar">
        <button className="icon-button" onClick={onClick}>
            <Sidebar color="#fff" size={17}/>
        </button>
      </div>
    );
  };