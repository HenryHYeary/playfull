import { type NextAuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

// Extend the JWT type
declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    userId?: string;
    accessTokenExpires?: number;
    error?: string;
  }
}

const refreshAccessToken = async (token: any) => {
  try {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
    const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    const url = "https://accounts.spotify.com/api/token";
    const params = new URLSearchParams();
    params.append("grant_type", "refresh_token");
    params.append("refresh_token", token.refreshToken);

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const refreshed = await res.json();
    if (!res.ok) {
      throw refreshed;
    }

    return {
      ...token,
      accessToken: refreshed.access_token,
      accessTokenExpires: Date.now() + (refreshed.expires_in ?? 3600) * 1000,
      refreshToken: refreshed.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
};

export const authOptions: NextAuthOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID || '',
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET || '',
      authorization: {
        params: {
          scope:
            "user-read-email user-read-private playlist-read-private playlist-modify-private playlist-modify-public",
          show_dialog: true,
        },
      },
      checks: ["pkce", "state"]
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  cookies: process.env.NODE_ENV === "production" ? {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: { httpOnly: true, sameSite: 'lax', path: '/', secure: true },
    },
    callbackUrl: {
      name: `__Secure-next-auth.callback-url`,
      options: { httpOnly: true, sameSite: 'lax', path: '/', secure: true },
    },
    csrfToken: {
      name: `__Host-next-auth.csrf-token`,
      options: { httpOnly: true, sameSite: 'lax', path: '/', secure: true },
    },
  } : undefined,
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          userId: account.providerAccountId,
          accessTokenExpires:
            Date.now() + (account.expires_in ? account.expires_in * 1000 : 3600 * 1000),
        };
      }

      if (Date.now() < (token.accessTokenExpires ?? 0)) {
        return token;
      }

      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      return {
        ...session,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        userId: token.userId,
        accessTokenExpires: token.accessTokenExpires,
        error: token.error,
      };
    },
        async redirect({ url, baseUrl }) {
      if (url.startsWith("http://") || url.startsWith("https://")) {
        const urlObj = new URL(url);
        const baseUrlObj = new URL(baseUrl);
        
        // If same origin, allow
        if (urlObj.origin === baseUrlObj.origin) {
          return url;
        }
        return baseUrl;
      }

      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      
      return baseUrl;
    }
  },
  pages: {
    signIn: '/login',  
    error: '/auth/error',
  },
  events: {
    async signOut({ token }) {
      console.log("User signed out");
    }
  },
  session: {
    strategy: "jwt",
  },
};