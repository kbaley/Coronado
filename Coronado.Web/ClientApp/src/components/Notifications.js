import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
 
import Notifications from 'react-notification-system-redux';
 
export default function NotificationsComponent() {
 
    const notifications = useSelector(state => state.notifications);
    
 
    //Optional styling
    const style = {
      NotificationItem: { // Override the notification item
        DefaultStyle: { // Applied to every notification, regardless of the notification level
          margin: '10px 5px 2px 1px'
        },
 
        success: { // Applied only to the success notification item
          color: 'red'
        }
      }
    };
 
    return (
      <Notifications
        notifications={notifications}
        style={style}
      />
    );
}
 
NotificationsComponent.contextTypes = {
  store: PropTypes.object
};
 
NotificationsComponent.propTypes = {
  notifications: PropTypes.array
};
 