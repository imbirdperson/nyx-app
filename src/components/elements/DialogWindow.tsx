import React, { useState } from 'react';
import { useRootStore } from '../../store/RootStore';
import { open } from '@tauri-apps/plugin-dialog';
import { useNotificationStore } from '../../store/NotificationStore';


interface CreateRootDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateRootDialog: React.FC<CreateRootDialogProps> = ({ isOpen, onClose }) => {
    const { addNotification } = useNotificationStore();
    const [name, setName] = useState('');
    const [selectedPath, setSelectedPath] = useState('');
    const { createRoot, loadRoots } = useRootStore();
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createRoot({ name, path: selectedPath });

            await loadRoots();
            addNotification('Root created successfully!', 'success');
            onClose();
            setName('');
            setSelectedPath('');
        } catch (error) {
            addNotification(
                error instanceof Error ? error.message : 'Failed to create root',
                'error'
            );
        }
    };


    const handleSelectPath = async () => {
        const selected = await open({
            directory: true,
            multiple: false,
            title: 'Select Root Directory'
        });
        
        if (selected && typeof selected === 'string') {
            setSelectedPath(selected);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="dialog-overlay">
            <div className="dialog-content">
                <h2>Create New Root</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Root Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter root name"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Root Path</label>
                        <div className="path-selector">
                            <input
                                type="text"
                                value={selectedPath}
                                readOnly
                                placeholder="Select a directory"
                            />
                            <button type="button" onClick={handleSelectPath}>
                                Browse
                            </button>
                        </div>
                    </div>
                    <div className="dialog-actions">
                        <button type="button" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" disabled={!name || !selectedPath}>
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateRootDialog;