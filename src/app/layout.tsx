import React from 'react';
import '../index.css';

export const metadata = {
  title: 'Alpha Spark',
  description: 'Empowering individuals and institutions with practical digital capabilities.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '64x64' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-brand-navy text-white antialiased">
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
