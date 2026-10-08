'use client';

import { ReduxProvider } from './ReduxProvider';
import { ReactQueryProvider } from './ReactQueryProvider';
import { TooltipProvider } from '@/src/components/ui/tooltip';
import { Toaster } from 'sonner';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <ReactQueryProvider>
        <TooltipProvider>
          {children}
        </TooltipProvider>
        <Toaster position="top-center" richColors />
      </ReactQueryProvider>
    </ReduxProvider>
  );
}
