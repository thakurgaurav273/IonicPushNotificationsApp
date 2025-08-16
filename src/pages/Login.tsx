import { Preferences } from '@capacitor/preferences';
import { CometChat, CometChatNotifications } from '@cometchat/chat-sdk-ionic';
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonText,
  IonIcon
} from '@ionic/react';
import { CapacitorPush, PushNotificationSchema } from 'capacitor-push';
import { Capacitor } from '@capacitor/core';
import { personOutline, lockClosedOutline } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import './Login.css';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [registrationToken, setRegistrationToken] = useState('');
  const [voipToken, setVoipToken] = useState('');
  const [notification, setNotification] = useState<PushNotificationSchema | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const requestPushPermission = async () => {
    try {
      await CapacitorPush.requestPermissions();
    } catch (err) {
      console.error('Permission request error:', err);
      alert('Error requesting push notification permission.');
    }
  };

  const registerTokenWithCometChat = async (token: string, isVoip: boolean = false) => {
    try {
      const platform = Capacitor.getPlatform();
      let cometChatPlatform;

      if (platform === 'ios') {
        cometChatPlatform = isVoip 
          ? CometChatNotifications.PushPlatforms.APNS_IONIC_CORDOVA_VOIP
          : CometChatNotifications.PushPlatforms.APNS_IONIC_CORDOVA_DEVICE;
      } else {
        cometChatPlatform = CometChatNotifications.PushPlatforms.FCM_IONIC_CORDOVA_ANDROID;
      }

      console.log("isVoip, ", isVoip);
      await CometChatNotifications.registerPushToken(
        token,
        cometChatPlatform,
        platform === 'ios' ? 'apns-provider-1' : 'capacitor-push-1'
      );

      console.log(`${isVoip ? 'VoIP' : 'Push'} token registered to CometChat!`, token);
    } catch (error) {
      console.error('Error registering token with CometChat:', error);
    }
  };

  const handleLogin = async () => {
    if (!username.trim()) {
      setError("Username is required!");
      return;
    }
    setError("");
    setIsLoading(true);

    try {
      const user = await CometChat.login(username, "YOUR_AUTH_KEY_HERE");
      
      await Preferences.set({
        key: 'user',
        value: JSON.stringify(user)
      });

      const platform = Capacitor.getPlatform();

      // Register tokens based on platform
      if (platform === 'ios') {
        // For iOS: Register both APNS and VoIP tokens
        if (registrationToken) {
          await registerTokenWithCometChat(registrationToken, false); // APNS token
        }
        if (voipToken) {
          await registerTokenWithCometChat(voipToken, true); // VoIP token
        }
      } else if (platform === 'android') {
        // For Android: Register FCM token
        if (registrationToken) {
          await registerTokenWithCometChat(registrationToken, false);
        }
      }

      window.location.replace('/tab1');
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    requestPushPermission();
  }, []);

  useEffect(() => {
    CapacitorPush.register();

    // Regular push token registration (Android/iOS)
    CapacitorPush.addListener('registration', (token) => {
      setRegistrationToken(token.token);
      console.log('Push registration token:', token.token);
    });

    // VoIP token registration (iOS only)
    CapacitorPush.addListener('voipRegistration', (token) => {
      setVoipToken(token.token);
      console.log('VoIP token registered:', token.token);
    });

    // Push notification received
    CapacitorPush.addListener('pushNotificationReceived', (notification) => {
      setNotification(notification);
      console.log('Push Notification Received:', notification);
    });

    // Push notification action performed
    CapacitorPush.addListener('pushNotificationActionPerformed', (data) => {
      console.log('User tapped notification:', data);
    });

    // Cleanup listeners on unmount
    return () => {
      CapacitorPush.removeAllListeners();
    };
  }, []);

  return (
    <IonPage>
      <div className="login-container">
        <div className="login-wrapper">
          <div className="brand-section">
            <div className="brand-icon">
              <IonIcon icon={lockClosedOutline} />
            </div>
            <h1 className="brand-title">Welcome Back</h1>
            <p className="brand-subtitle">Sign in to continue to your account</p>
          </div>

          <IonCard className="login-card">
            <IonCardContent className="login-card-content">
              <div className="input-group">
                <div className="input-wrapper">
                  <IonIcon icon={personOutline} className="input-icon" />
                  <IonInput
                    className="login-input"
                    placeholder="Enter your username"
                    value={username}
                    onIonInput={(event: any) => setUsername(event.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {error && (
                <div className="error-container">
                  <IonText color="danger" className="error-text">{error}</IonText>
                </div>
              )}

              <IonButton 
                expand="block" 
                onClick={handleLogin} 
                className="login-button"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </IonButton>
            </IonCardContent>
          </IonCard>
        </div>
      </div>
    </IonPage>
  );
};

export default Login;