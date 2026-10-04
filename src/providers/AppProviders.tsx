'use client';

import { ReduxProvider } from './ReduxProvider';
import { ReactQueryProvider } from './ReactQueryProvider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <ReactQueryProvider>
        {children}
      </ReactQueryProvider>
    </ReduxProvider>
  );
}
