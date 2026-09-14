// scripts/test_image_fetcher.mjs
import fs from 'fs';
import { ALL_DESTINATIONS } from '../src/data/destinations.ts';

console.log(`Loaded ${ALL_DESTINATIONS.length} destinations.`);

// Test first 30 destinations
const sample = ALL_DESTINATIONS.slice(0, 30);
console.log('Sample IDs:', sample.map(d => d.id).join(', '));
