import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.healthsurvey',
  appName: 'health-survey',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  }
};

export default config;
