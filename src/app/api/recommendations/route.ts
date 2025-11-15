import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      language,
      minDanceability,
      maxDanceability,
      minEnergy,
      maxEnergy,
      minValence,
      maxValence,
      minTempo,
      maxTempo,
      minAcousticness,
      maxAcousticness,
      minInstrumentalness,
      maxInstrumentalness,
      minSpeechiness,
      maxSpeechiness,
      minLiveness,
      maxLiveness,
      limit = 50,
    } = body;

    const safeLimit = Math.min(Math.max(1, parseInt(limit) || 50), 100);

    const conditions: Prisma.Sql[] = [];

    if (language) {
      conditions.push(Prisma.sql`language = ${language}`)
    }
    
    if (minDanceability !== undefined) {
      conditions.push(Prisma.sql`danceability >= ${minDanceability}`);
    }
    if (maxDanceability !== undefined) {
      conditions.push(Prisma.sql`danceability <= ${maxDanceability}`);
    }
    if (minEnergy !== undefined) {
      conditions.push(Prisma.sql`energy >= ${minEnergy}`);
    }
    if (maxEnergy !== undefined) {
      conditions.push(Prisma.sql`energy <= ${maxEnergy}`);
    }
    if (minValence !== undefined) {
      conditions.push(Prisma.sql`valence >= ${minValence}`);
    }
    if (maxValence !== undefined) {
      conditions.push(Prisma.sql`valence <= ${maxValence}`);
    }
    if (minTempo !== undefined) {
      conditions.push(Prisma.sql`tempo >= ${minTempo}`);
    }
    if (maxTempo !== undefined) {
      conditions.push(Prisma.sql`tempo <= ${maxTempo}`);
    }
    if (minAcousticness !== undefined) {
      conditions.push(Prisma.sql`acousticness >= ${minAcousticness}`);
    }
    if (maxAcousticness !== undefined) {
      conditions.push(Prisma.sql`acousticness <= ${maxAcousticness}`);
    }
    if (minInstrumentalness !== undefined) {
      conditions.push(Prisma.sql`instrumentalness >= ${minInstrumentalness}`);
    }
    if (maxInstrumentalness !== undefined) {
      conditions.push(Prisma.sql`instrumentalness <= ${maxInstrumentalness}`);
    }
    if (minSpeechiness !== undefined) {
      conditions.push(Prisma.sql`speechiness >= ${minSpeechiness}`);
    }
    if (maxSpeechiness !== undefined) {
      conditions.push(Prisma.sql`speechiness <= ${maxSpeechiness}`);
    }
    if (minLiveness !== undefined) {
      conditions.push(Prisma.sql`liveness >= ${minLiveness}`);
    }
    if (maxLiveness !== undefined) {
      conditions.push(Prisma.sql`liveness <= ${maxLiveness}`);
    }

    // Build the WHERE clause safely
    const whereClause = conditions.length > 0 
      ? Prisma.sql`WHERE ${Prisma.join(conditions, ' AND ')}`
      : Prisma.empty;

    // Fetch random tracks using safe parameterized query
    const tracks = await prisma.$queryRaw<any[]>`
      SELECT 
        "spotifyId",
        "trackName",
        "artistName",
        language,
        danceability,
        energy,
        valence,
        tempo,
        acousticness,
        instrumentalness,
        speechiness,
        liveness
      FROM "Track"
      ${whereClause}
      ORDER BY RANDOM()
      LIMIT ${safeLimit}
    `;

    return NextResponse.json({
      success: true,
      tracks,
      count: tracks.length,
      // Unnecessary property
      // totalMatches: totalCount,
    });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
}