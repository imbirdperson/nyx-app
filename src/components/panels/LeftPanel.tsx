import React, { ReactNode} from "react";
import { Sidebar } from '@geist-ui/icons';
import { useLeftPanelStore } from "../../store/LeftPanelStore";


type LeftPanelProps = {
    children: ReactNode;
}

const LeftPanel: React.FC<LeftPanelProps> = ({children}) => {
    const {
        leftPanelWidth,
        isDragging,
        setLeftPanelWidth,
        setIsDragging,
      } = useLeftPanelStore();



    const handleMouseDown = () => {
        setIsDragging(true);
        document.body.classList.add('no-select'); // Disable text selection
        document.body.classList.add("resizing");
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (isDragging) {
            const newWidth = Math.max(0, e.clientX); // Ensure the width does not go below 0
        if (newWidth < 120) {
            setLeftPanelWidth(0); // Hide the side panel if the width is less than 150px
        } else {
            setLeftPanelWidth(newWidth); // Otherwise, set the new width
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
        style={{ width: leftPanelWidth ? `${leftPanelWidth}px` : '0'}}>
            <div className="left-pannel-content">
                <LeftPanelToggleButton/>
                {children}
            </div>

        <div className="drag-handle" onMouseDown={handleMouseDown}>
            <div className="drag-handle-visible"/>
        </div>
        </div>
    )
}

export default LeftPanel;


interface LeftPanelFnButtonsProps{

}

const LeftPanelFnButton: React.FC<LeftPanelFnButtonsProps> = () => {
    return (
        <></>
    );
};


interface LeftPanelToggleProps {
}

const LeftPanelToggleButton: React.FC<LeftPanelToggleProps> = () => {

    const {
        toggleLeftPanel,
      } = useLeftPanelStore();

    const handleClick = () => {
        console.log("Sidebar toggle clicked!");
        toggleLeftPanel();
    };

    return (
      <div className="sidebar">
        <button className="icon-button" onClick={handleClick}>
            <Sidebar color="#fff" size={17}/>
        </button>
      </div>
    );
  };