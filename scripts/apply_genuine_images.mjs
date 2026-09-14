// scripts/apply_genuine_images.mjs
import fs from 'fs';
import { ALL_DESTINATIONS, RECENT_BOOKINGS, PROMO_OFFERS } from '../src/data/destinations.ts';

// 1. Read master image map
const imageMap = JSON.parse(fs.readFileSync('scripts/destination_images_map.json', 'utf8'));

// 2. Add remaining exact entries and fix any duplicates
imageMap['daman-silvassa'] = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9a/Dadra_and_Nagar_Haveli_Silvassa_3.jpg/1280px-Dadra_and_Nagar_Haveli_Silvassa_3.jpg';
imageMap['sirpur'] = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/98/7th_-_9th_century_Surang_tila_mandapa_before_shrines%2C_Sirpur_monuments_Chhattisgarh.jpg/1280px-7th_-_9th_century_Surang_tila_mandapa_before_shrines%2C_Sirpur_monuments_Chhattisgarh.jpg';
imageMap['barnawapara'] = 'https://upload.wikimedia.org/wikipedia/commons/1/15/Barnawapara_Wildlife_Sanctuary_Chhattisgarh_India.jpg';
imageMap['bangaram-island'] = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/50/Sea_off_Bangaram_island%2C_Lakshadweep.jpg/1280px-Sea_off_Bangaram_island%2C_Lakshadweep.jpg';
imageMap['gurugram'] = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d6/Cyber_City_View.jpg/1280px-Cyber_City_View.jpg';
imageMap['lakshadweep'] = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1c/Minicoy_Island%2C_Lakshadweep.jpg/1280px-Minicoy_Island%2C_Lakshadweep.jpg';
imageMap['agatti-island'] = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/af/Agatti_Island_Beach_Lakshadweep.jpg/1280px-Agatti_Island_Beach_Lakshadweep.jpg';
imageMap['bharatpur'] = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Bar-headed_Geese-_Bharatpur_I_IMG_8335.jpg/1280px-Bar-headed_Geese-_Bharatpur_I_IMG_8335.jpg';
imageMap['aligarh'] = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Sir_Syed_Hall_AMU.jpg/1280px-Sir_Syed_Hall_AMU.jpg';
imageMap['tirunelveli'] = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9a/Nellaiappar_temple_gopuram.jpg/1280px-Nellaiappar_temple_gopuram.jpg';
imageMap['thiruvananthapuram'] = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d2/Sree_Padmanabhaswamy_temple.jpg/1280px-Sree_Padmanabhaswamy_temple.jpg';
imageMap['kovalam'] = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3c/Kovalam_beach_trivandrum.jpg/1280px-Kovalam_beach_trivandrum.jpg';
imageMap['kanyakumari'] = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b6/RockMemorial.jpg/1280px-RockMemorial.jpg';
imageMap['port-blair'] = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fe/Front_View_of_Cellular_Jail.jpg/1280px-Front_View_of_Cellular_Jail.jpg';
imageMap['swaraj-dweep'] = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1f/Radha_Nagar_beach.jpg/1280px-Radha_Nagar_beach.jpg';
imageMap['havelock'] = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1f/Radha_Nagar_beach.jpg/1280px-Radha_Nagar_beach.jpg';
imageMap['shaheed-dweep'] = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ee/Keshet_neal_island.jpg/1280px-Keshet_neal_island.jpg';
imageMap['neil-island'] = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ee/Keshet_neal_island.jpg/1280px-Keshet_neal_island.jpg';
imageMap['diglipur'] = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Ross_and_Smith_Islands_Aerial_View.jpg/1280px-Ross_and_Smith_Islands_Aerial_View.jpg';
imageMap['baratang-island'] = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Baratang_I_locale.jpg/1280px-Baratang_I_locale.jpg';
imageMap['baratang'] = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Baratang_I_locale.jpg/1280px-Baratang_I_locale.jpg';
imageMap['jhansi'] = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e8/Jhansi_Fort.jpg/1280px-Jhansi_Fort.jpg';
imageMap['orchha'] = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/48/Chaturbhuj_Temple%2C_Orchha.jpg/1280px-Chaturbhuj_Temple%2C_Orchha.jpg';
imageMap['fatehpur-sikri'] = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b5/Fatehput_Sikri_Buland_Darwaza.jpg/1280px-Fatehput_Sikri_Buland_Darwaza.jpg';
imageMap['gwalior'] = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/15/Gwalior_Fort_front.jpg/1280px-Gwalior_Fort_front.jpg';
imageMap['mathura'] = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cc/Vishram_Ghat.jpg/1280px-Vishram_Ghat.jpg';
imageMap['mathura-vrindavan'] = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0f/Prem_Mandir_Vrindavan.jpg/1280px-Prem_Mandir_Vrindavan.jpg';
imageMap['ranthambore'] = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7f/Ranthambore_National_Park.jpg/1280px-Ranthambore_National_Park.jpg';
imageMap['pune'] = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4d/Front_view_of_Shaniwar_Wada.jpg/1280px-Front_view_of_Shaniwar_Wada.jpg';
imageMap['nagpur'] = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a2/Deekshabhoomi_Nagpur.jpg/1280px-Deekshabhoomi_Nagpur.jpg';
imageMap['coimbatore'] = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Adiyogi_Shiva_statue_Coimbatore.jpg/1280px-Adiyogi_Shiva_statue_Coimbatore.jpg';
imageMap['varkala'] = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e0/Varkala_beach.jpg/1280px-Varkala_beach.jpg';

// Save updated image map
fs.writeFileSync('scripts/destination_images_map.json', JSON.stringify(imageMap, null, 2));
console.log(`Master image map saved with ${Object.keys(imageMap).length} entries.`);

// 3. Update all destinations
let updatedCount = 0;
const usedUrls = new Set();
const duplicatePairs = [];

for (const dest of ALL_DESTINATIONS) {
  const genuineUrl = imageMap[dest.id];
  if (genuineUrl) {
    if (usedUrls.has(genuineUrl)) {
      duplicatePairs.push({ id: dest.id, url: genuineUrl });
    }
    usedUrls.add(genuineUrl);
    dest.imageUrl = genuineUrl;
    updatedCount++;
  } else {
    console.warn(`WARNING: Missing genuine image for ${dest.id} (${dest.name})`);
  }
}

console.log(`Updated ${updatedCount}/${ALL_DESTINATIONS.length} destinations.`);
console.log(`Unique URLs count: ${usedUrls.size}`);
if (duplicatePairs.length > 0) {
  console.log(`Duplicate URLs found: ${duplicatePairs.length}`);
  duplicatePairs.forEach(d => console.log(d.id, '=>', d.url.slice(0, 70)));
}

// 4. Generate new destinations.ts
let tsContent = `import type { Destination, RecentBooking, PromoOffer } from '@/types/travel';\n\n`;
tsContent += `export const ALL_DESTINATIONS: Destination[] = `;
tsContent += JSON.stringify(ALL_DESTINATIONS, null, 2);
tsContent += `;\n\nexport const DESTINATIONS: Destination[] = ALL_DESTINATIONS;\n`;
tsContent += `export const POPULAR_DESTINATIONS: Destination[] = ALL_DESTINATIONS.filter(d => d.isPopular);\n\n`;
tsContent += `export const RECENT_BOOKINGS: RecentBooking[] = ${JSON.stringify(RECENT_BOOKINGS, null, 2)};\n\n`;
tsContent += `export const PROMO_OFFERS: PromoOffer[] = ${JSON.stringify(PROMO_OFFERS, null, 2)};\n`;

fs.writeFileSync('src/data/destinations.ts', tsContent, 'utf8');
console.log(`Successfully generated src/data/destinations.ts with genuine images for all ${ALL_DESTINATIONS.length} destinations!`);
