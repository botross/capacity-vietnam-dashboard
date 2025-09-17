import { NextRequest, NextResponse } from 'next/server';
import { AuthApi } from '@/Api/apis/auth-api';
import { AXIOS_CONFIG } from '@/Api/wrapper';
import { LoginDto } from '@/Api/models';
import { getErrorResponse } from '@/app/hooks/helpers';

export async function POST(req: NextRequest) {
  try {
    const data = (await req.json()) as LoginDto;
    const result = await new AuthApi(AXIOS_CONFIG).dashboardLogin(data);
    const token = result.data.authToken;

    if (!token || !result.data.userData) {
      throw new Error('Token or user data not found');
    }

    const response = new NextResponse(
      JSON.stringify({
        status: 'success',
        data: result.data,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (!result.data.userData.adminStores?.[0]) {
      return getErrorResponse(500, 'Store not found');
    }

    // Set cookies with proper options for better reliability
    const cookieOptions = {
      httpOnly: false, // Allow client-side access
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    };

    await Promise.all([
      response.cookies.set({
        name: 'capacity-vietnam-token',
        value: token,
        ...cookieOptions,
      }),

      response.cookies.set({
        name: 'capacity-vietnam-logged-in',
        value: 'true',
        ...cookieOptions,
      }),
      response.cookies.set({
        name: 'x-store-key',
        value: result.data.userData.adminStores?.[0] || '',
        ...cookieOptions,
      }),
    ]);

    return response;
  } catch (error: any) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'An error occurred';
    const errorResponse = {
      status: 'error',
      message,
    };

    return new NextResponse(JSON.stringify(errorResponse), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
