'use client';
import React, { ReactNode, useEffect } from 'react';
import SideBar from '../../components/SideBar/SideBar';
import Header from '../../components/Header.tsx/Header';
import { NovuProvider } from '@novu/notification-center';
// import { useRouter } from 'next/navigation';

function Layout({ children }: { children: ReactNode }) {
  // const router = useRouter();

  // useEffect(() => {
  //   const loggedIn = localStorage.getItem('authToken');
  //   if (!loggedIn) router.push('/login');
  // }, [router]);

  return (
    <NovuProvider
      subscriberId={'65dec2278b742c7312e4490c'}
      applicationIdentifier={'D7QxJHaHU3sS'}
    >
      {/* <NovuProvider subscriberId={user.username} applicationIdentifier={process.env.NEXT_PUBLIC_NOVU_APP_ID!}> */}
      <div className="flex h-screen overflow-hidden bg-white">
        <SideBar />
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Header />
          <main className='w-full'>
            <div className="mx-auto z-[1]">{children}</div>
          </main>
        </div>
      </div>
    </NovuProvider>
  );
}

export default Layout;
