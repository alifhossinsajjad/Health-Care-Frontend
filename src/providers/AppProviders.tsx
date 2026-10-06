'use client';

import { ReduxProvider } from './ReduxProvider';
import { ReactQueryProvider } from './ReactQueryProvider';
import { Toaster } from 'sonner';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <ReactQueryProvider>
        {children}
        <Toaster position="top-center" richColors />
      </ReactQueryProvider>
    </ReduxProvider>
  );
}
