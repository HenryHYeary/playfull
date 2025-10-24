import { PrismaClient } from "@prisma/client";
import Papa from "papaparse";
import fs from "fs";
import path from "path";

interface Row {
  spotifyId: number,
  trackName: string,
  artistName: string,
  danceability: number | null,
  energy: number | null,
  speechiness:  number | null,
  acousticness: number | null,
  instrumentalness: number | null,
  liveness: number | null,
  valence: number | null,
  tempo: number | null,
  loudness: number | null,
  durationMs: number | null,
  popularity: number | null,
}

const prisma = new PrismaClient();

async function loadDataset() {
  const csvPath = path.join(process.cwd(), "data", "spotify_tracks.csv");
  
  console.log("Reading CSV file...");
  const csvFile = fs.readFileSync(csvPath, 'utf-8');

  const results = Papa.parse(csvFile, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  });

  console.log(`Found ${results.data.length} tracks`);

  const batchSize = 1000;
  let processed = 0;
  
  for (let i = 0; i < results.data.length; i += batchSize) {
    const batch = results.data.slice(i, i + batchSize);
   
    const trackData = batch.map((row: any): Row => {
      return {
        spotifyId: row.id || row.track_id || row.spotify_id,
        trackName: row.name || row.track_name,
        artistName: row.artists || row.artist_name || row.artist,
        danceability: parseFloat(row.danceability) || null,
        energy: parseFloat(row.energy) || null,
        speechiness: parseFloat(row.speechiness) || null,
        acousticness: parseFloat(row.acousticness) || null,
        instrumentalness: parseFloat(row.instrumentalness) || null,
        liveness: parseFloat(row.liveness) || null,
        valence: parseFloat(row.valence) || null,
        tempo: parseFloat(row.tempo) || null,
        loudness: parseFloat(row.loudness) || null,
        durationMs: parseInt(row.duration_ms) || null,
        popularity: parseInt(row.popularity) || 0,
      }
    }).filter(track => track.spotifyId);

    await prisma.track.createMany({
      data: trackData,
      skipDuplicates: true,
    });

    processed += batch.length;
    console.log(`Processed ${processed}/${results.data.length} tracks`);
  }

  console.log("Dataset loaded successfully.");
  await prisma.$disconnect();
}

loadDataset().catch((error) => {
  console.error("Error loading dataset: ", error);
  process.exit(1);
});
