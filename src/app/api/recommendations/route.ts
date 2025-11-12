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

    // Technically safer

    // const where: Prisma.TrackWhereInput = {};

    // if (language) {
    //   where.language = language;
    // }

    // if (minDanceability !== undefined || maxDanceability !== undefined) {
    //   where.danceability = {};
    //   if (minDanceability !== undefined) where.danceability.gte = minDanceability;
    //   if (maxDanceability !== undefined) where.danceability.lte = maxDanceability;
    // }
    // if (minEnergy !== undefined || maxEnergy !== undefined) {
    //   where.energy = {};
    //   if (minEnergy !== undefined) where.energy.gte = minEnergy;
    //   if (maxEnergy !== undefined) where.energy.lte = maxEnergy;
    // }
    // if (minValence !== undefined || maxValence !== undefined) {
    //   where.valence = {};
    //   if (minValence !== undefined) where.valence.gte = minValence;
    //   if (maxValence !== undefined) where.valence.lte = maxValence;
    // }
    // if (minTempo !== undefined || maxTempo !== undefined) {
    //   where.tempo = {};
    //   if (minTempo !== undefined) where.tempo.gte = minTempo;
    //   if (maxTempo !== undefined) where.tempo.lte = maxTempo;
    // }
    // if (minAcousticness !== undefined || maxAcousticness !== undefined) {
    //   where.acousticness = {};
    //   if (minAcousticness !== undefined) where.acousticness.gte = minAcousticness;
    //   if (maxAcousticness !== undefined) where.acousticness.lte = maxAcousticness;
    // }
    // if (minInstrumentalness !== undefined || maxInstrumentalness !== undefined) {
    //   where.instrumentalness = {};
    //   if (minInstrumentalness !== undefined) where.instrumentalness.gte = minInstrumentalness;
    //   if (maxInstrumentalness !== undefined) where.instrumentalness.lte = maxInstrumentalness;
    // }
    // if (minSpeechiness !== undefined || maxSpeechiness !== undefined) {
    //   where.speechiness = {};
    //   if (minSpeechiness !== undefined) where.speechiness.gte = minSpeechiness;
    //   if (maxSpeechiness !== undefined) where.speechiness.lte = maxSpeechiness;
    // }
    // if (minLiveness !== undefined || maxLiveness !== undefined) {
    //   where.liveness = {};
    //   if (minLiveness !== undefined) where.liveness.gte = minLiveness;
    //   if (maxLiveness !== undefined) where.liveness.lte = maxLiveness;
    // }

    // const totalCount = await prisma.track.count({ where });

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