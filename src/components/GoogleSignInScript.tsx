'use client';

import Script from 'next/script';

export default function GoogleSignInScript() {
  return (
    <Script
      src="https://apis.google.com/js/platform.js"
      strategy="beforeInteractive"
      onLoad={() => {
        console.log('Google Sign-In script loaded');
      }}
      onError={(e) => {
        console.error('Error loading Google Sign-In script:', e);
      }}
    />
  );
} 