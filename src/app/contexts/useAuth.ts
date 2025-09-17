import { useCookies } from 'next-client-cookies';

export function useAuth() {
    const cookies = useCookies();
    const token = cookies.get('capacity-vietnam-token')
    const isLoggedIn = cookies.get('capacity-vietnam-logged-in')

    const clearCookies = () => {
        cookies.remove('capacity-vietnam-token')
        cookies.remove('capacity-vietnam-logged-in')
    }

    return {
        token,
        isLoggedIn: isLoggedIn ? true : false,
        clearCookies
    }
}