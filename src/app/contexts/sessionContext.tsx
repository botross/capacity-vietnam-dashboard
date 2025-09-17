'use client';
import { UserEntity, UsersApi } from '@/Api';
import { AXIOS_CONFIG } from '@/Api/wrapper';
import { useMutation } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect } from 'react';
import { useAuth } from './useAuth';

type contextType = {
  isLoggedIn: boolean
  userData: UserEntity | undefined
  getMyInfo: () => Promise<void>;
}
export const AuthContextProvider = createContext<contextType>({
  isLoggedIn: false,
  userData: undefined,
  getMyInfo: async () => { },
})

type Props = {
  children: React.ReactNode
};

export const useAuthContext = () => {
  return useContext(AuthContextProvider);
};

export function SessionProvider({ children }: Props) {

  const currentPathname = usePathname()
  const { push } = useRouter()
  const { isLoggedIn, clearCookies } = useAuth()


  useEffect(() => {
    console.log(isLoggedIn,'isLoggedIn')
    if (isLoggedIn && (currentPathname === '/' || currentPathname.includes('/login'))) {
      push('/dashboard')
    }
    if (!isLoggedIn && currentPathname.includes('/dashboard')) {
      push('/')
    }
  }, [isLoggedIn, currentPathname])


  const { data: userData, mutate: getMyInfo } = useMutation({
    mutationKey: ['user'],
    mutationFn: async () => {
      const res = await new UsersApi(AXIOS_CONFIG).getMyProfile()
      return res.data
    },
    onError: () => {
      clearCookies()
    }
  })

  React.useEffect(() => {
    if (isLoggedIn) {
      getMyInfo()
    }
  }, [])





  return (
    <AuthContextProvider.Provider
      value={{
        isLoggedIn,
        userData,
        getMyInfo: async () => {
          await getMyInfo();
        },
      }}>
      {children}
    </AuthContextProvider.Provider>
  );
}

