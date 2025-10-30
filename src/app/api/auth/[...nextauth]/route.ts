import NextAuth from "next-auth";
import { type NextAuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

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
            "user-read-email user-top-read playlist-read-private playlist-modify-private playlist-modify-public",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
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

    if (Date.now() < (token as any).accessTokenExpires) {
      return token;
    }

    return await refreshAccessToken(token);
  },
    async session({ session, token }) {
      return {
        ...session,
        accessToken: (token as any).accessToken,
        refreshToken: (token as any).refreshToken,
        userId: (token as any).userId,
        accessTokenExpires: (token as any).accessTokenExpires,
        error: (token as any).error,
      };
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }
