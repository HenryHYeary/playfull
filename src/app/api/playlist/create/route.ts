import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { createSpotifyPlaylist, addTracksToPlaylist } from "@/lib/spotify";

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.accessToken || !token?.userId) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { playlistName, trackIds, playlistId } = body;

    if (!trackIds || !Array.isArray(trackIds) || trackIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "Missing required field: trackIds" },
        { status: 400 }
      );
    }

    if (playlistId) {
      const result = await addTracksToPlaylist(
        token.accessToken as string,
        playlistId,
        trackIds
      );
      return NextResponse.json({
        ...result,
      });
    }

    const result = await createSpotifyPlaylist(
      token.accessToken as string,
      token.userId as string,
      playlistName,
      trackIds
    );

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Error creating/adding to playlist: ", error);
    return NextResponse.json(
      { success: false, error: "Failed to create or update playlist" },
      { status: 500 }
    );
  }
}
