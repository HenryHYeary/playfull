import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(request) {
    const { pathname, searchParams } = request.nextUrl;

    if (pathname.includes('/api/auth/callback/spotify')) {
    console.log('=== SPOTIFY CALLBACK RECEIVED ===');
    console.log('Full URL:', request.url);
    console.log('Code:', searchParams.get('code'));
    console.log('State:', searchParams.get('state'));
    console.log('Error:', searchParams.get('error'));
    console.log('Host:', request.headers.get('host'));
    console.log('Referer:', request.headers.get('referer'));
  }
  
  if (pathname.includes('/api/auth/signin/spotify')) {
    console.log('=== SPOTIFY SIGNIN INITIATED ===');
    console.log('Full URL:', request.url);
    console.log('Callback URL param:', searchParams.get('callbackUrl'));
  }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/((?!login|api/auth|_next|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp)).*)",
  ],
};
