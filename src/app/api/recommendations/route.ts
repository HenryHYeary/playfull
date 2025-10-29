import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';

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

    const where: Prisma.TrackWhereInput = {};

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
      where.valence = {};
      if (minValence !== undefined) where.valence.gte = minValence;
      if (maxValence !== undefined) where.valence.lte = maxValence;
    }

    if (minTempo !== undefined || maxTempo !== undefined) {
      where.tempo = {};
      if (minTempo !== undefined) where.tempo.gte = minTempo;
      if (maxTempo !== undefined) where.tempo.lte = maxTempo;
    }

    if (minAcousticness !== undefined || maxAcousticness !== undefined) {
      where.acousticness = {};
      if (minAcousticness !== undefined) where.acousticness.gte = minAcousticness;
      if (maxAcousticness !== undefined) where.acousticness.lte = maxAcousticness;
    }

    if (minInstrumentalness !== undefined || maxInstrumentalness !== undefined) {
      where.instrumentalness = {};
      if (minInstrumentalness !== undefined) where.instrumentalness.gte = minInstrumentalness;
      if (maxInstrumentalness !== undefined) where.instrumentalness.lte = maxInstrumentalness;
    }

    if (minSpeechiness !== undefined || maxSpeechiness !== undefined) {
      where.speechiness = {};
      if (minSpeechiness !== undefined) where.speechiness.gte = minSpeechiness;
      if (maxSpeechiness !== undefined) where.speechiness.lte = maxSpeechiness;
    }

    if (minLiveness !== undefined || maxLiveness !== undefined) {
      where.liveness = {};
      if (minLiveness !== undefined) where.liveness.gte = minLiveness;
      if (maxLiveness !== undefined) where.liveness.lte = maxLiveness;
    }

    const totalCount = await prisma.track.count({ where });

    const matchingTracks = await prisma.track.findMany({
      where,
      select: { id: true },
    });

    const shuffled = [...matchingTracks].sort(() => Math.random() - 0.5);
    const selectedIds = shuffled.slice(0, limit).map(t => t.id);

    const tracks = await prisma.track.findMany({
      where: {
        id: { in: selectedIds }
      },
      select: {
        spotifyId: true,
        trackName: true,
        artistName: true,
        danceability: true,
        energy: true,
        valence: true,
        tempo: true,
        acousticness: true,
        instrumentalness: true,
        speechiness: true,
        liveness: true,
      }
    });

    return NextResponse.json({
      success: true,
      tracks,
      count: tracks.length,
      totalMatches: totalCount,
    });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
}