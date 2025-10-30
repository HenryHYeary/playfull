import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { createSpotifyPlaylist } from "@/lib/spotify";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
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
      session.accessToken as string,
      session.userId as string,
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
