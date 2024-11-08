import React, { ReactNode } from "react";
import { Sidebar } from '@geist-ui/icons';
import { useLeftPanelStore } from "../../store/LeftPanelStore";
import IconButton from "../elements/IconButton";
import { ICON_BUTTON_SIZE } from "../Constants";

type MainPanelProps = {
    children: ReactNode;
}

const MainPanel: React.FC<MainPanelProps> = ({children}) => {

    const leftPanelWidth = useLeftPanelStore((state) => state.leftPanelWidth);
    const toggleLeftPanel = useLeftPanelStore((state) => state.toggleLeftPanel);

    return (
        <div className="main-window-wrapper">
            {leftPanelWidth === 0 && (
                <SideBarToggle onClick={toggleLeftPanel}/>
            )}
            {children}
        </div>
    )
}

export default MainPanel;

interface SideBarToggleProps {
    onClick?: () => void; // Define the type for the click prop
  }

const SideBarToggle: React.FC<SideBarToggleProps> = ({onClick}) => {
    return (
        <IconButton onClick={onClick} tooltipText="Sidebar">
            <Sidebar color="#fff" size={ICON_BUTTON_SIZE}/>
        </IconButton>
    );
  };