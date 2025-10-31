import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.accessToken) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const accessToken = session.accessToken as string;

    const response = await fetch(
      'https://api.spotify.com/v1/me/playlists?limit=5',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch playlists');
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      playlists: data.items.map((playlist: any) => ({
        id: playlist.id,
        name: playlist.name,
        url: playlist.external_urls.spotify,
        trackCount: playlist.tracks.total,
        image: playlist.images[0]?.url,
      })),
    });

  } catch (error) {
    console.error('Error fetching playlists:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch playlists' },
      { status: 500 }
    );
  }
}