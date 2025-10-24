import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { success } from "zod/v4";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      minDanceability,
      maxDanceability,
      minEnergy,
      maxEnergy,
      minValence,
      maxValence,
      minTempo,
      maxTempo,
      limit = 50,
    } = body;

    const where: any = {};
    if (minDanceability !== undefined || maxDanceability !== undefined) {
      where.danceability = {};
      if (minDanceability !== undefined) where.danceability.gte = minDanceability;
      if (maxDanceability !== undefined) where.danceability.lte = maxDanceability;
    }
    if (minEnergy !== undefined || maxEnergy !== undefined) {
      where.energy = {};
      if (minEnergy !== undefined) where.energy.gte = minEnergy;
      if (maxEnergy !== undefined) where.energy.lte = maxEnergy;
    }
    if (minValence !== undefined || maxValence !== undefined) {
      where.valence= {};
      if (minValence !== undefined) where.valence.gte = minValence;
      if (maxValence !== undefined) where.valence.lte = maxValence;
    }
    if (minTempo !== undefined || maxTempo !== undefined) {
      where.tempo = {};
      if (minTempo !== undefined) where.tempo.gte = minTempo;
      if (maxTempo !== undefined) where.tempo.lte = maxTempo;
    }

    const totalCount = await prisma.track.count({ where });

    const tracks = await prisma.$queryRaw`
      SELECT
        "spotifyId" as "spotify_id",
        "trackName" as "track_name",
        "artistName" as "artist_name",
        danceability,
        energy,
        valence,
        tempo
      FROM "Track"
      WHERE
      ${minDanceability !== undefined ? prisma.$queryRaw`danceability >= ${minDanceability}` : prisma.$queryRaw`true`}
        AND ${maxDanceability !== undefined ? prisma.$queryRaw`danceability <= ${maxDanceability}` : prisma.$queryRaw`true`}
        AND ${minEnergy !== undefined ? prisma.$queryRaw`energy >= ${minEnergy}` : prisma.$queryRaw`true`}
        AND ${maxEnergy !== undefined ? prisma.$queryRaw`energy <= ${maxEnergy}` : prisma.$queryRaw`true`}
        AND ${minValence !== undefined ? prisma.$queryRaw`valence >= ${minValence}` : prisma.$queryRaw`true`}
        AND ${maxValence !== undefined ? prisma.$queryRaw`valence <= ${maxValence}` : prisma.$queryRaw`true`}
        AND ${minTempo !== undefined ? prisma.$queryRaw`tempo >= ${minTempo}` : prisma.$queryRaw`true`}
        AND ${maxTempo !== undefined ? prisma.$queryRaw`tempo <= ${maxTempo}` : prisma.$queryRaw`true`}
      ORDER BY RANDOM()
      LIMIT ${limit}
    `;

    return NextResponse.json({
      success: true,
      tracks,
      count: (tracks as any[]).length,
      totalMatches: totalCount,
    });
  } catch (error) {
    console.error("Error fetching recommendations: ", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch recommendations" },
      { status: 500 }
    );
  }
}
