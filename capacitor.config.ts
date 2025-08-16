import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ionic_app.demo',
  appName: 'CapacitorPushDemo',
  webDir: 'dist',
  "plugins": {
		"CapacitorPush": {
			"presentationOptions": [
				"badge",
				"sound",
				"alert"
			]
		},
	},
};

export default config;
