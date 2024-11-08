import {ReactNode, useState, useRef, useEffect} from "react";

type IconButtonProps = {
    children: ReactNode;
    onClick?: () => void;
    tooltipText?: string;
}
const IconButton: React.FC<IconButtonProps> = ({children, onClick, tooltipText}) => {
    const buttonRef = useRef<HTMLDivElement>(null);
    const handleClick = (e: React.MouseEvent) => {
        if (onClick) {
            onClick();
            // Force the mouse to "leave" the button
            const event = new MouseEvent('mouseout', {
                bubbles: true,
                cancelable: true,
            });
            buttonRef.current?.dispatchEvent(event);
        }
    };
    return (
        <div className="icon-button-wrapper" ref={buttonRef}>
            <button 
                className="icon-button" onClick={handleClick}>
                    {children}
            </button>
            {tooltipText && (
                <div className="tooltip">
                    {tooltipText}
                </div>
            )}
        </div>
    );
  };

  export default IconButton;