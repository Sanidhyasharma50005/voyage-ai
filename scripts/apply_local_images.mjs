// scripts/apply_local_images.mjs
import fs from 'fs';
import path from 'path';

const filePath = path.resolve('./src/data/destinations.ts');
let content = fs.readFileSync(filePath, 'utf8');

const imagesDir = path.resolve('./public/images/destinations');
const availableFiles = new Set(fs.readdirSync(imagesDir));
console.log(`Found ${availableFiles.size} images in ${imagesDir}`);

let updatedCount = 0;
content = content.replace(/"id":\s*"([^"]+)"([\s\S]*?)"imageUrl":\s*"[^"]+"/g, (match, id, middle) => {
  const localFileName = `${id}.jpg`;
  if (availableFiles.has(localFileName)) {
    updatedCount++;
    return `"id": "${id}"${middle}"imageUrl": "/images/destinations/${id}.jpg"`;
  } else {
    console.warn(`Local file missing for: ${id}`);
    return match;
  }
});

fs.writeFileSync(filePath, content, 'utf8');
console.log(`Successfully updated ${updatedCount} destinations to use /images/destinations/[id].jpg!`);
