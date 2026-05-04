import { medicationsData } from "./medications.js";
import fs from 'fs';    // Node.js file system module

const lines = medicationsData.trim().split('\n')
const regex = /^(\d+)\s+(.+?)\s+([\d,.]+)\s+([\d,.]+)\s+([\d,.]+)$/

const medications = lines.map((line) => {
    const match = line.match(regex);
    if (!match) return null;
    return {
        id: parseInt(match[1]),
        drug_name: match[2],
        prices: {
          lowest: parseFloat(match[3]),
          median: parseFloat(match[4]),
          highest: parseFloat(match[5])
        }
      };
}).filter(item => item !== null); // Skip lines that return null

const jsonOutput = JSON.stringify(medications, null, 2);
fs.writeFileSync('./medications.json', jsonOutput);

console.log("Success! Your React app can now import this JSON.");
