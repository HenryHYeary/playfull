import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { createSpotifyPlaylist } from "@/lib/spotify";

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    })

    if (!token?.accessToken || !token?.userId) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { playlistName, trackIds } = body;

    if (!playlistName || !trackIds || trackIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await createSpotifyPlaylist(
      token.accessToken as string,
      token.userId as string,
      playlistName,
      trackIds
    )

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Error creating playlist: ', error);
    return NextResponse.json(
      { success: false, error: "Failed to create playlist" },
      { status: 500 }
    )
  }
}
