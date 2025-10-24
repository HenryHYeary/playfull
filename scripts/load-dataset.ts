import { PrismaClient } from "@prisma/client";
import Papa from "papaparse";
import fs from "fs";
import path from "path";

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
  
}
