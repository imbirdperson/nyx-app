import { create } from "zustand";

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface Notification {
    id: string;
    message: string;
    type: NotificationType;
}

interface NotificationStore {
    notifications: Notification[];
    addNotification: (message: unknown, type: NotificationType) => void;
    removeNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
    notifications: [],
    addNotification: (message, type) => {
        const id = Date.now().toString();

        const formattedMessage = message instanceof Error ? message.message : 
            typeof message === 'string' ? message : 'An error occurred';

        set((state) => ({
            notifications: [...state.notifications, { id, message: formattedMessage, type }],
        }
        ));
        
        // Auto remove after 2 seconds
        setTimeout(() => {
            set((state) => ({
                notifications: state.notifications.filter((n) => n.id !== id),
            }));
        }, 2000);
    },
    removeNotification: (id) => {
        set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
        }));
    },
}));