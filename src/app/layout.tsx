import React from 'react';
import '../index.css';

export const metadata = {
  title: 'Alpha Spark',
  description: 'Empowering individuals and institutions with practical digital capabilities.',
  icons: {
    icon: '/assets/logo.png',
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
