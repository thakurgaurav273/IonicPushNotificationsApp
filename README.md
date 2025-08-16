# CapacitorPushDemo App

CapacitorPush is a Capacitor plugin that provides seamless integration of Push Notifications, VoIP Pushes, and CallKit call management for iOS apps built with Capacitor. It enables native push and VoIP token management, incoming call handling, and call control without requiring users to handle native AppDelegate registration callbacks manually.

---

## Features

- Register for remote push notifications and VoIP pushes  
- Automatically handle APNS and VoIP push tokens  
- Support for CallKit incoming calls with video/audio option  
- Call management: answer, end, hold, mute calls programmatically  
- Notification and CallKit event listeners in JavaScript  
- Handles app readiness and queues notifications when WebView is not ready  
- No manual AppDelegate code required for remote token registration (via method swizzling)

---

## Installation

1. Install the plugin package in your Capacitor project:

```bash
npm install capacitor-push@latest
npx cap sync
```

2. Open your iOS project in Xcode:

```bash
npx cap open ios
```

3. In your Xcode project, enable **Push Notifications** and **Background Modes** capabilities, especially **Voice over IP** for VoIP Pushes.

---

## Usage

### Register for Push Notifications

```typescript
import { CapacitorPush } from 'capacitor-push';

// Register for push notifications
await CapacitorPush.registerForPushNotifications();
```

### Register for VoIP Push Notifications

```typescript
// Register for VoIP push notifications
await CapacitorPush.registerForVoIPPushes();
```

### Get Push Tokens

```typescript
// Get APNS token
const { token } = await CapacitorPush.getPushToken();
console.log('Push Token:', token);

// Get VoIP token
const { voipToken } = await CapacitorPush.getVoIPToken();
console.log('VoIP Token:', voipToken);
```
### Event Listeners

```typescript
// Listen for push token registration
CapacitorPush.addListener('registration', (data) => {
  console.log('Push token received:', data.token);
});

// Listen for VoIP token registration
CapacitorPush.addListener('voipRegistration', (data) => {
  console.log('VoIP token received:', data.token);
});

// Listen for incoming call events
CapacitorPush.addListener('voipCallAccepted', (data) => {
    console.log('Incoming Call Accepted:', data);
});

// Listen for call ended events
CapacitorPush.addListener('voipCallRejected', (data) => {
  console.log('Incoming Call Rejected:', notification);
});
```

---

## API Reference

### Methods

#### `register()`

Registers the app for remote push notifications.

**Returns:** `Promise<void>`

#### `getPushToken()`

Gets the current APNS push token.

**Returns:** `Promise<{ token: string }>`

#### `getVoIPToken()`

Gets the current VoIP push token.

**Returns:** `Promise<{ voipToken: string }>`

### Events

#### `registration`

Fired when a push token (FCM/iOS) is received.

**Data:** `{ token: string }`

#### `voipTokenReceived`

Fired when a VoIP token is received.

**Data:** `{ token: string }`

#### `pushNotificationReceived`

Fired when a notification is received.

**Data:** `{data: PushNotificationSchema}`
---

## Requirements

- iOS 10.0+
- Capacitor 4.0+
- Xcode 12.0+

---

## Troubleshooting

### Push notifications not working

1. Ensure you have enabled Push Notifications capability in Xcode
2. Verify your provisioning profile includes push notifications
3. Check that your APNS certificates are valid

### VoIP calls not appearing

1. Enable Background Modes > Voice over IP in Xcode capabilities
2. Ensure your app has proper CallKit permissions
3. Verify VoIP certificates are configured correctly

### Tokens not received

1. Test on a physical device (push notifications don't work in simulator)
2. Check device network connectivity
3. Verify app is properly signed with valid certificates

---

## License

MIT License