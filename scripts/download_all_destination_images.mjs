// scripts/download_all_destination_images.mjs
import fs from 'fs';
import path from 'path';
import { DESTINATIONS } from '../src/data/destinations.ts';

const outDir = path.resolve('./public/images/destinations');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Known verified direct URLs for places that had 404s or typos
const CORRECTIONS = {
  'mathura-vrindavan': 'https://upload.wikimedia.org/wikipedia/commons/8/8e/PremMandirSideViewFromCanteen.jpg',
  'fatehpur-sikri': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b5/Fatehput_Sikiri_Buland_Darwaza_gate_2010.jpg/1280px-Fatehput_Sikiri_Buland_Darwaza_gate_2010.jpg',
  'bharatpur': 'https://upload.wikimedia.org/wikipedia/commons/9/95/Bar-headed_Geese-_Bharatpur_I_IMG_8335.jpg',
  'ranthambore': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/52/Ranthambhore_Fort.jpg/1280px-Ranthambhore_Fort.jpg',
  'aligarh': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1b/AMU_Jama_masjid.jpg/1280px-AMU_Jama_masjid.jpg',
  'kovalam': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3c/Kovalam_beach_trivandrum_kerala.jpg/1280px-Kovalam_beach_trivandrum_kerala.jpg',
  'varkala': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e0/Varkala_beach_from_above.jpg/1280px-Varkala_beach_from_above.jpg',
  'havelock': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/63/Havelock%2C_Andaman_%26_Nicobar_Islands.JPG/1280px-Havelock%2C_Andaman_%26_Nicobar_Islands.JPG',
  'swaraj-dweep': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/63/Havelock%2C_Andaman_%26_Nicobar_Islands.JPG/1280px-Havelock%2C_Andaman_%26_Nicobar_Islands.JPG',
  'neil-island': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ee/Keshet_neal_island_india.jpg/1280px-Keshet_neal_island_india.jpg',
  'shaheed-dweep': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ee/Keshet_neal_island_india.jpg/1280px-Keshet_neal_island_india.jpg',
  'port-blair': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fe/Front_View_of_Cellular_Jail%2C_Port_Blair.JPG/1280px-Front_View_of_Cellular_Jail%2C_Port_Blair.JPG',
  'agatti-island': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/af/Agatti_Airstrip.jpg/1280px-Agatti_Airstrip.jpg',
  'pune': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4d/Front_view_of_Shaniwar_Wada_illuminated.jpg/1280px-Front_view_of_Shaniwar_Wada_illuminated.jpg',
  'hubballi-dharwad': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/14/Hubliwiki.jpg/1280px-Hubliwiki.jpg',
  'nagpur': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c9/Dheekshabhoomi_in_Nagpur.jpg/1280px-Dheekshabhoomi_in_Nagpur.jpg',
  'tirunelveli': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9a/Nellaiappar_temple_tower.jpg/1280px-Nellaiappar_temple_tower.jpg',
  'thiruvananthapuram': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d2/Sree_Padmanabhaswamy_temple_01.jpg/1280px-Sree_Padmanabhaswamy_temple_01.jpg',
};

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

async function fetchWithRetry(url, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': USER_AGENT,
          'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        },
      });

      if (res.status === 429) {
        console.warn(`[429 Rate limited] Waiting ${attempt * 1000}ms before retry for ${url}`);
        await new Promise((r) => setTimeout(r, attempt * 1000));
        continue;
      }

      if (!res.ok) {
        return { ok: false, status: res.status };
      }

      const buffer = Buffer.from(await res.arrayBuffer());
      if (buffer.length < 2000) {
        return { ok: false, status: 200, error: 'File too small' };
      }

      return { ok: true, buffer };
    } catch (err) {
      if (attempt === maxRetries) return { ok: false, error: err.message };
      await new Promise((r) => setTimeout(r, 800));
    }
  }
  return { ok: false, error: 'Max retries exceeded' };
}

async function searchWikipediaImage(searchQuery) {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(searchQuery)}&redirects=1&prop=pageimages&format=json&pithumbsize=1000`;
    const res = await fetch(url, { headers: { 'User-Agent': 'TravelAssistant/2.0 (app@travelassistant.in)' } });
    const data = await res.json();
    const pages = Object.values(data.query?.pages || {});
    for (const p of pages) {
      if (p.thumbnail?.source) {
        return p.thumbnail.source;
      }
    }
  } catch (e) {
    console.error('Wiki search error:', e.message);
  }
  return null;
}

async function main() {
  console.log(`Starting download for all ${DESTINATIONS.length} destinations...`);
  let successCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  for (let i = 0; i < DESTINATIONS.length; i++) {
    const d = DESTINATIONS[i];
    const targetFile = path.join(outDir, `${d.id}.jpg`);

    if (fs.existsSync(targetFile)) {
      const stats = fs.statSync(targetFile);
      if (stats.size > 5000) {
        skippedCount++;
        continue;
      }
    }

    let url = CORRECTIONS[d.id] || d.imageUrl;
    let result = await fetchWithRetry(url);

    if (!result.ok) {
      const cleanName = d.name.split('&')[0].split('(')[0].trim();
      console.log(`[${d.id}] Initial download failed (${result.status || result.error}). Trying Wikipedia search for '${cleanName}'...`);
      const wikiUrl = await searchWikipediaImage(cleanName);
      if (wikiUrl) {
        result = await fetchWithRetry(wikiUrl);
      }
    }

    if (result.ok && result.buffer) {
      fs.writeFileSync(targetFile, result.buffer);
      successCount++;
      if ((successCount + skippedCount) % 10 === 0 || i === DESTINATIONS.length - 1) {
        console.log(`[${i + 1}/${DESTINATIONS.length}] Progress: Saved ${d.id}.jpg (${Math.round(result.buffer.length / 1024)} KB)`);
      }
    } else {
      console.error(`FAILED: ${d.id} (${d.name}) - ${result.status || result.error}`);
      failedCount++;
    }

    await new Promise((r) => setTimeout(r, 60));
  }

  console.log(`\n=== Download Summary ===`);
  console.log(`Already existed (skipped): ${skippedCount}`);
  console.log(`Newly downloaded: ${successCount}`);
  console.log(`Failed: ${failedCount}`);
  console.log(`Total on disk: ${fs.readdirSync(outDir).length}/${DESTINATIONS.length}`);
}

main().catch(console.error);
