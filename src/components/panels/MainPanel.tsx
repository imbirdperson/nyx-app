import React, { ReactNode, useEffect, useState } from "react";
import { Sidebar } from '@geist-ui/icons';
import { useLeftPanelStore } from "../../store/LeftPanelStore";
import IconButton from "../elements/IconButton";
import { ICON_BUTTON_SIZE } from "../Constants";
import { useNodeStore } from "../../store/NodeStore";
import { useRootStore } from "../../store/RootStore";
import { useNotificationStore } from "../../store/NotificationStore";

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
            <NodeList/>
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


const NodeList: React.FC = () => {
    const [newNode, setNewNode] = useState(''); 
    const { createNode, loadNodes, nodes } = useNodeStore();
    const { selectedRootId } = useRootStore();
    const { addNotification } = useNotificationStore();

    const handleCreateNodeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('selectedRoot', selectedRootId);
        if (!selectedRootId) return; // Add early return if no root is selected

        try {
            await createNode({
                name: newNode,
                path: '/',
                root_id: selectedRootId,
                node_type: 'Node::Default' });
            setNewNode('')
            // load nodes after creating a new node
            await loadNodes(selectedRootId);
            addNotification('Node created successfully', 'success');

            console.log('Node created successfully');
        } catch (error) {
            console.error('Failed to create node:', error);
            addNotification(error, "error");
        } 
    }

    const handleLoadNodes = async () => {
        if (selectedRootId) {
            console.log('Loading nodes for root:', selectedRootId);
            await loadNodes(selectedRootId);
            console.log('Nodes:', nodes);
            console.log('Nodes loaded successfully');
        }else{
            addNotification('No root selected', 'warning');
        }
    }

    useEffect(() => {
        if (selectedRootId) {
            loadNodes(selectedRootId);
        }
    }, [selectedRootId, loadNodes]);



    return (
        <div>
            <form onSubmit={handleCreateNodeSubmit}>
                <input type="text"
                    value={newNode}
                    onChange={(e) => setNewNode(e.target.value)}
                 placeholder="New Node" />
                <button type="submit">Add</button>
            </form>
            <div>
                <button onClick={handleLoadNodes}>Load Nodes</button>
                <div>
                    {nodes.map(node => (
                        <div key={node.id.id.String}>{node.name}</div>
                    ))}
                </div>
            </div>
        </div>
    );
}