import { Route, Switch } from 'react-router-dom';
import {
  IonApp,
  IonToast,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Tab1 from './pages/Home';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import React, { useEffect } from 'react';
import Login from './pages/Login';
import ProtectedRoute from './ProtectedRoute';
import { CapacitorPush } from 'capacitor-push';

setupIonicReact();

const App: React.FC = () => {

  const [toastMessage, setToastMessage] = React.useState('');
  const [isToastOpen, setIsToastOpen] = React.useState(false);
  const [toastColor, setToastColor] = React.useState<'success' | 'warning' | 'danger' | 'primary'>('primary');

  const showToast = (message: string, color: 'success' | 'warning' | 'danger' | 'primary' = 'primary') => {
    setToastMessage(message);
    setToastColor(color);
    setIsToastOpen(true);
  };

    useEffect(() => {
    // Push Notification Action Performed Listener
    CapacitorPush.addListener(
      'pushNotificationActionPerformed',
      (notification) => {
        console.log('Push notification action performed:', notification);
        showToast(`Notification from : ${notification.id}`, 'primary');
      }
    );

    // Push Notification Received Listener
    CapacitorPush.addListener(
      'pushNotificationReceived',
      (notification) => {
        console.log('Push notification received:', notification);
        showToast(`New notification: ${notification.title || 'Notification received'}`, 'primary');
      }
    );
    CapacitorPush.addListener(
     'voipCallAccepted',
      (notification) => {
        console.log('Incoming Call Accepted:', notification);
        showToast('Call accepted successfully', 'success');
      }
    );

     CapacitorPush.addListener(
     'voipCallRejected',
      (notification) => {
        console.log('Incoming Call Rejected:', notification);
        showToast('Call was rejected', 'warning');
      }
    );
    // Cleanup function
    return () => {
      CapacitorPush.removeAllListeners();
    };
  }, []);


  return (
  <IonApp>
    <IonReactRouter>
      <Switch>
        <Route path="/login" component={Login} exact />
        {/* Protect all tabs with ProtectedRoute */}
        <ProtectedRoute path="/" component={Tab1} />
      </Switch>
    </IonReactRouter>
     {/* Global Toast */}
      <IonToast
        isOpen={isToastOpen}
        message={toastMessage}
        duration={3000}
        color={toastColor}
        positionAnchor="middle"
        onDidDismiss={() => setIsToastOpen(false)}
        buttons={[
          {
            text: 'Dismiss',
            role: 'cancel',
          },
        ]}
      />
  </IonApp>
)
};

export default App;

