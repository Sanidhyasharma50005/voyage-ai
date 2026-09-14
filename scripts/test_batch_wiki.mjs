// scripts/test_batch_wiki.mjs
import { ALL_DESTINATIONS } from '../src/data/destinations.ts';

const BATCH_SIZE = 40;

function getSearchTitle(d) {
  // Curated landmark overrides for problematic titles
  const overrides = {
    'gwalior': 'Gwalior Fort',
    'jhansi': 'Jhansi Fort',
    'agra': 'Taj Mahal',
    'orchha': 'Chaturbhuj Temple, Orchha',
    'fatehpur-sikri': 'Buland Darwaza',
    'bharatpur': 'Keoladeo National Park',
    'mathura': 'Vishram Ghat',
    'mathura-vrindavan': 'Prem Mandir, Vrindavan',
    'ranthambore': 'Ranthambore Fort',
    'aligarh': 'Aligarh Fort',
    'tirunelveli': 'Nellaiappar Temple',
    'varkala': 'Varkala Beach',
    'thiruvananthapuram': 'Padmanabhaswamy Temple',
    'kovalam': 'Kovalam Beach',
    'kanyakumari': 'Vivekananda Rock Memorial',
    'diglipur': 'Ross and Smith Islands',
    'baratang-island': 'Baratang Island',
    'swaraj-dweep': 'Radhanagar Beach',
    'port-blair': 'Cellular Jail',
    'shaheed-dweep': 'Neil Island',
    'pune': 'Shaniwar Wada',
    'nagpur': 'Deekshabhoomi',
    'coimbatore': 'Adiyogi Shiva bust',
    'mangaluru': 'Panambur Beach',
    'udupi-malpe': 'Udupi Sri Krishna Matha',
    'delhi': 'India Gate',
    'mumbai': 'Gateway of India',
    'jaipur': 'Hawa Mahal',
    'jodhpur': 'Mehrangarh Fort',
    'udaipur': 'City Palace, Udaipur',
    'jaisalmer': 'Jaisalmer Fort',
    'amritsar': 'Golden Temple',
    'varanasi': 'Dashashwamedh Ghat',
    'kolkata': 'Victoria Memorial, Kolkata',
    'hyderabad': 'Charminar',
    'bengaluru': 'Vidhana Soudha',
    'mysuru': 'Mysore Palace',
    'hampi': 'Virupaksha Temple, Hampi'
  };

  if (overrides[d.id]) return overrides[d.id];
  if (d.attractions && d.attractions[0]?.name) {
    const attr = d.attractions[0].name.split('&')[0].split('(')[0].trim();
    if (attr.length > 3) return attr;
  }
  return d.name.split('&')[0].split('(')[0].trim();
}

async function testBatch() {
  const sample = ALL_DESTINATIONS.slice(0, 40);
  const titles = sample.map(d => getSearchTitle(d));
  console.log(`Fetching 40 titles...`);

  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(titles.join('|'))}&redirects=1&prop=pageimages&format=json&pithumbsize=1000`;
  const res = await fetch(url, { headers: { 'User-Agent': 'TravelAssistant/1.0 (contact: travel@example.com)' } });
  const data = await res.json();

  const pages = Object.values(data.query?.pages || {});
  console.log(`Received ${pages.length} pages from Wikipedia.`);
  let found = 0;
  pages.forEach(p => {
    if (p.thumbnail?.source) {
      found++;
      console.log(`✓ ${p.title} => ${p.thumbnail.source.slice(0, 80)}`);
    } else {
      console.log(`✗ ${p.title} => NO THUMB`);
    }
  });
  console.log(`Found ${found}/${pages.length} thumbnails.`);
}

testBatch().catch(console.error);
