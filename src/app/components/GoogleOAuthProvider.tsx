'use client';

import { GoogleOAuthProvider as Provider } from '@react-oauth/google';

export default function GoogleOAuthProvider({ children }: { children: React.ReactNode }) {
  // Replace this with your actual Google Client ID
  // Get it from: https://console.cloud.google.com/apis/credentials
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';

  return (
    <Provider clientId={clientId}>
      {children}
    </Provider>
  );
}
