// scripts/update_destinations_with_local_images.mjs
import fs from 'fs';
import path from 'path';

const destinationsFilePath = path.resolve('./src/data/destinations.ts');
let content = fs.readFileSync(destinationsFilePath, 'utf8');

const imagesDir = path.resolve('./public/images/destinations');
const availableFiles = new Set(fs.readdirSync(imagesDir));

console.log(`Available local images: ${availableFiles.size}`);

// Replace imageUrl: '...' with imageUrl: '/images/destinations/<id>.jpg'
let updatedCount = 0;
let missingCount = 0;

// Match destination blocks
const destRegex = /{\s*id:\s*['"]([^'"]+)['"][\s\S]*?imageUrl:\s*['"]([^'"]+)['"]/g;

content = content.replace(destRegex, (match, id, oldUrl) => {
  const localFileName = `${id}.jpg`;
  if (availableFiles.has(localFileName)) {
    updatedCount++;
    return match.replace(`imageUrl: '${oldUrl}'`, `imageUrl: '/images/destinations/${id}.jpg'`)
                .replace(`imageUrl: "${oldUrl}"`, `imageUrl: '/images/destinations/${id}.jpg'`);
  } else {
    console.warn(`Missing local image for id: ${id}, keeping: ${oldUrl}`);
    missingCount++;
    return match;
  }
});

fs.writeFileSync(destinationsFilePath, content, 'utf8');
console.log(`Updated ${updatedCount} destination imageUrls to local paths.`);
console.log(`Missing local images: ${missingCount}`);
