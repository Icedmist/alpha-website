'use client';

import dynamic from 'next/dynamic';

// Mount the SPA client-side only to bypass SSR for react-router-dom
const App = dynamic(() => import('../../App'), { ssr: false });

export default function SPAEntry() {
  return <App />;
}
