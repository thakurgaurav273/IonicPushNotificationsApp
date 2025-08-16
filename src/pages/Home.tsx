import React, { useState, useEffect } from 'react';
import { 
  IonButton, 
  IonButtons, 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar, 
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonBadge,
  IonCard,
  IonCardContent,
  IonRefresher,
  IonRefresherContent,
  IonFab,
  IonFabButton,
  useIonRouter, 
  IonFooter
} from '@ionic/react';
import { 
  trash,
  refresh,
  chatbox
} from 'ionicons/icons';
import './Home.css';
import { Preferences } from '@capacitor/preferences';
import { CometChatNotifications, CometChat } from '@cometchat/chat-sdk-ionic';
import { CapacitorPush, PushNotificationSchema } from 'capacitor-push';

interface PushNotification {
  id: string;
  title: string;
  body: string;
  type: 'push' | 'voip_accepted' | 'voip_rejected' | 'action_performed';
  timestamp: Date;
  data?: any;
  actionId?: string;
}

const Tab1: React.FC = () => {
  const history = useIonRouter();
  const [notifications, setNotifications] = useState<PushNotification[]>([]);

  const addNotification = (notification: PushNotification) => {
    setNotifications(prev => [notification, ...prev]);
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getNotificationIcon = () => {
    return chatbox;
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'voip_accepted':
        return 'success';
      case 'voip_rejected':
        return 'warning';
      case 'action_performed':
        return 'primary';
      default:
        return 'medium';
    }
  };

  useEffect(() => {
    // Push Notification Received Listener
    CapacitorPush.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        console.log('Push notification received in Tab1:', notification);
        addNotification({
          id: notification.id || Date.now().toString(),
          title: notification.title || 'New Notification',
          body: notification.body || 'No message content',
          type: 'push',
          timestamp: new Date(),
          data: notification.data
        });
      }
    );
    // Cleanup function
    return () => {
      CapacitorPush.removeAllListeners();
    };
  }, []);

  const handleRefresh = (event: CustomEvent) => {
    // Simulate refresh - in real app you might reload from storage
    setTimeout(() => {
      event.detail.complete();
    }, 1000);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Push Notifications</IonTitle>
          <IonButtons slot="end">
            <IonButton
              color="danger"
              onClick={async () => {
                await Preferences.remove({ key: 'user' });
                await CometChatNotifications.unregisterPushToken();
                await CometChat.logout().then(async() => {
                  console.log('User logged-out successfully');
                  history.push('/login');
                });
              }}
            >
              Logout
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        {notifications.length === 0 ? (
          <IonCard>
            <IonCardContent className="ion-text-center">
              <IonIcon 
                icon={chatbox} 
                size="large" 
                color="medium" 
                style={{ fontSize: '64px', marginBottom: '16px' }}
              />
              <h2>No Notifications</h2>
              <p>Push notifications will appear here in real-time</p>
            </IonCardContent>
          </IonCard>
        ) : (
          <>
            <div style={{ 
              padding: '16px', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              background: 'var(--ion-color-light)'
            }}>
              <span>
                <strong>{notifications.length}</strong> notification{notifications.length !== 1 ? 's' : ''}
              </span>
              <IonButton 
                fill="clear" 
                size="small" 
                onClick={clearAllNotifications}
                color="danger"
              >
                <IonIcon icon={trash} slot="start" />
                Clear All
              </IonButton>
            </div>

            <IonList>
              {notifications.map((notification) => (
                <IonItem key={`${notification.id}-${notification.timestamp.getTime()}`}>
                  <IonIcon 
                    icon={getNotificationIcon()} 
                    slot="start" 
                    color={getNotificationColor(notification.type)}
                  />
                  <IonLabel>
                    <h2>{notification.title}</h2>
                    <p>{notification.body}</p>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginTop: '8px'
                    }}>
                      <small style={{ color: 'var(--ion-color-medium)' }}>
                        {formatDate(notification.timestamp)} at {formatTime(notification.timestamp)}
                      </small>
                      <IonBadge color={getNotificationColor(notification.type)}>
                        {notification.type.replace('_', ' ').toUpperCase()}
                      </IonBadge>
                    </div>
                    {notification.actionId && (
                      <small style={{ color: 'var(--ion-color-primary)' }}>
                        Action: {notification.actionId}
                      </small>
                    )}
                    {notification.data && Object.keys(notification.data).length > 0 && (
                      <details style={{ marginTop: '8px' }}>
                        <summary style={{ 
                          fontSize: '12px', 
                          color: 'var(--ion-color-medium)', 
                          cursor: 'pointer' 
                        }}>
                          View Data
                        </summary>
                        <pre style={{ 
                          fontSize: '10px', 
                          background: 'var(--ion-color-light)', 
                          padding: '8px', 
                          borderRadius: '4px',
                          marginTop: '4px',
                          overflow: 'auto',
                          maxHeight: '100px'
                        }}>
                          {JSON.stringify(notification.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </IonLabel>
                </IonItem>
              ))}
            </IonList>
          </>
        )}

        {/* Floating Action Button for manual refresh */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed" style={{ bottom: '64px' }}>
          <IonFabButton color="primary" onClick={() => window.location.reload()}>
            <IonIcon icon={refresh} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;