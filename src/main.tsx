import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { CometChat } from '@cometchat/chat-sdk-ionic';

const container = document.getElementById('root');
const root = createRoot(container!);

const appID = "YOUR_APP_ID_HERE";
const region = "YOUR_APP_REGION_HERE";

const appSetting = new CometChat.AppSettingsBuilder()
      .subscribePresenceForAllUsers()
      .setRegion(region)
      .autoEstablishSocketConnection(true)
      .build();
CometChat.init(appID, appSetting).then(() => {
    console.log("✅ CometChat initialized successfully");
    root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
  },
  (error:any) => console.error("❌ CometChat initialization failed:", error)
);
