import React, { ReactNode, useEffect, useState} from "react";
import { Sidebar, Plus, Home, RefreshCcw } from '@geist-ui/icons';
import { useLeftPanelStore } from "../../store/LeftPanelStore";
import IconButton from "../elements/IconButton";
import { ICON_BUTTON_SIZE } from "../Constants";
import { invoke  } from "@tauri-apps/api/core";
import {readFile, readDir } from '@tauri-apps/plugin-fs';
import { useRootStore } from "../../store/RootStore";
import CreateRootDialog from "../elements/DialogWindow";



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

    const [imagePath, setImagePath] = useState<string>("");
    const [imageUrl, setImageUrl] = useState<string>("");

    const handleGetImagePath = async () => {
        try {
            const path = await invoke("image_path") as string;
            setImagePath(path);
            
            // Read the image file as binary data
            const imageData = await readFile(path);
            
            // Create a blob from the Uint8Array
            const blob = new Blob([imageData], { type: 'image/jpeg' }); // Adjust mime type if needed
            
            // Create object URL
            const url = URL.createObjectURL(blob);
            console.log(url);
            setImageUrl(url);
        } catch (err) {
            console.error('Error loading image:', err);
        }
    }

    useEffect(() => {
        return () => {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, [imageUrl]);
   

    return (
        <div className={`left-panel-wrapper`}
        style={{ width: leftPanelWidth ? `${leftPanelWidth}px` : '0'}}>
            <div className="left-panel-content">
                <LeftPanelFnButton/>
{/* 
                <ListItemsMain 
                    items={[
                        { id: '1', icon: <Home color="#fff"/>, label: 'Home' },
                        { id: '2', icon: <Home color="#fff"/>, label: 'Settings' },
                        { id: '3', icon: <Home color="#fff"/>, label: 'Profile' },
                    ]}
                    onItemSelect={(id) => console.log('Selected:', id)}
                /> */}

                
                {children}
                {/* {imageUrl && 
                    <>
                    <img className="thumbnail" src={imageUrl} alt="thumbnail" />
                    <img className="thumbnail" src={imageUrl} alt="thumbnail" />
                    <img className="thumbnail" src={imageUrl} alt="thumbnail" />
                    <img className="thumbnail" src={imageUrl} alt="thumbnail" />
                    <img className="thumbnail" src={imageUrl} alt="thumbnail" />
                    <img className="thumbnail" src={imageUrl} alt="thumbnail" />
                    <img className="thumbnail" src={imageUrl} alt="thumbnail" />
                    <img className="thumbnail" src={imageUrl} alt="thumbnail" />
                    <img className="thumbnail" src={imageUrl} alt="thumbnail" />
                    </>
                }
                <button onClick={handleGetImagePath}>Get Image Path</button> */}
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

    let [basePath, setBasePath] = useState<string>("");
    const [files, setFiles] = useState<{ name: string; path: string }[]>([]);
    const {loadRoots} = useRootStore();

    const handleLoadRoots = () => {
        loadRoots();
    }

    // Open dialog to create root
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleCreateRootDialog = () => {
        setIsDialogOpen(true);
    }

    // const handleCreateFolder = () => {
    //     console.log("Creating folder");
    //     invoke("create_folder")
    //         .then((msg) => console.log(msg))
    //         .catch((err) => console.error(err));
        

    useEffect(() => {
        const loadFiles = async () => {
            try {
                // First check if basePath is not empty
                if (!basePath) {
                    console.log("Base path is empty, waiting...");
                    return;
                }

                // Try to read directory
                const contents = await readDir(basePath);
                console.log("Successfully read directory:", basePath);
                console.log("Contents:", contents);
            } catch (err) {
                console.error("Error reading directory:", {
                    path: basePath,
                    error: err
                });
            }
        };
        
        loadFiles();
    }, [basePath]);

    return (
        <div className="panel-fn-buttons-wrapper">
            <div className="left">
                <div className="heading">
                    Roots
                </div>
            </div>
            <div className="right">
                <IconButton tooltipText="Add Root" onClick={handleCreateRootDialog}><Plus color="#fff" size={ICON_BUTTON_SIZE}/></IconButton>
                <IconButton tooltipText="Refresh" onClick={handleLoadRoots}><RefreshCcw color="#fff" size={ICON_BUTTON_SIZE}/></IconButton>
                <IconButton tooltipText="Home"><Home color="#fff" size={ICON_BUTTON_SIZE}/></IconButton>
                <LeftPanelToggleButton/>
            </div>
            <CreateRootDialog 
                isOpen={isDialogOpen} 
                onClose={() => setIsDialogOpen(false)} 
            />
        </div>
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
        <IconButton tooltipText={"Sidebar"} onClick={handleClick}>
            <Sidebar color="#fff" size={ICON_BUTTON_SIZE}/>
        </IconButton>
    );
  };

