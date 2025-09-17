'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AppProgressBar as ProgressBar, useRouter } from 'next-nprogress-bar';
import GeneralPurposesContext from '../contexts/SideBarContextContext';
import { Toaster } from 'react-hot-toast';
import { NextUIProvider } from '@nextui-org/react';
import { usePathname } from 'next/navigation';
import { SessionProvider } from '../contexts/sessionContext';

function Providers({ children }: React.PropsWithChildren) {
  const [client] = React.useState(
    new QueryClient({ defaultOptions: { queries: { staleTime: 5000 } } })
  );

  const router = useRouter();
  const pathName = usePathname();

  React.useEffect(() => {
    if (pathName === '/login' && document.cookie.includes('loggedIn=true')) {
      router.push('/dashboard');
    }
  });

  return (
    <QueryClientProvider client={client}>
      <NextUIProvider>
        <ProgressBar
          height="8px"
          color="#0000FF"
          options={{ showSpinner: true }}
          shallowRouting
        />
        <SessionProvider>
          <GeneralPurposesContext>
            <Toaster />
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
          </GeneralPurposesContext>
        </SessionProvider>
      </NextUIProvider>
    </QueryClientProvider>
  );
}

export default Providers;
