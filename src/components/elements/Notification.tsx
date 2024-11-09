import React from 'react';
import { useNotificationStore } from '../../store/NotificationStore';
import { X } from '@geist-ui/icons';

const NotificationContainer: React.FC = () => {
    const { notifications, removeNotification } = useNotificationStore();

    return (
        <div className="notification-container">
            {notifications.map((notification) => (
                <div 
                    key={notification.id} 
                    className={`notification-item ${notification.type}`}
                >
                    <span className="notification-message">{notification.message}</span>
                    <button 
                        className="notification-close"
                        onClick={() => removeNotification(notification.id)}
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default NotificationContainer;