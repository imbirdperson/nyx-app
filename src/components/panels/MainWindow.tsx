import React, { ReactNode } from "react";
type LeftPanelProps = {
    children: ReactNode;
}

const MainWindow: React.FC<LeftPanelProps> = ({children}) => {
    return (
        <div className="main-window-wrapper">
            {children}
        </div>
    )
}

export default MainWindow;