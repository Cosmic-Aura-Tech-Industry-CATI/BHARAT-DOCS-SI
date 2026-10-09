'use client';

import { Toaster } from 'sonner';

export function SonnerProvider() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      theme="light"
      toastOptions={{
        style: {
          borderRadius: '10px',
          fontFamily: 'inherit',
        },
      }}
    />
  );
}
