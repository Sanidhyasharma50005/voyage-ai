import stationsData from './railwayStations.json';

export interface RailwayStation {
  c: string; // IRCTC Station Code (e.g., NDLS, MMCT)
  n: string; // Station Name (e.g., NEW DELHI, MUMBAI CENTRAL)
  s: string; // State (e.g., Delhi, Maharashtra)
  lat: number | null;
  lng: number | null;
}

export const ALL_RAILWAY_STATIONS = stationsData as RailwayStation[];

// Popular major railway junctions for quick 1-click access
export const POPULAR_STATION_CODES = [
  'NDLS', // New Delhi
  'MMCT', // Mumbai Central
  'CSMT', // Mumbai CSMT
  'HWH',  // Howrah (Kolkata)
  'SBC',  // KSR Bengaluru
  'MAS',  // Chennai Central
  'SC',   // Secunderabad (Hyderabad)
  'GWL',  // Gwalior Junction
  'AGC',  // Agra Cantt
  'ADI',  // Ahmedabad
  'PUNE', // Pune
  'JP',   // Jaipur
  'LKO',  // Lucknow
  'PNBE', // Patna
  'GKP',  // Gorakhpur
  'BPL',  // Bhopal
  'CDG',  // Chandigarh
  'GHY',  // Guwahati
  'ERS',  // Ernakulam (Kochi)
  'BSB',  // Varanasi
  'CNB',  // Kanpur Central
  'ASR',  // Amritsar
];

export const POPULAR_STATIONS: RailwayStation[] = POPULAR_STATION_CODES
  .map(code => ALL_RAILWAY_STATIONS.find(s => s.c === code))
  .filter((s): s is RailwayStation => Boolean(s));

// Haversine distance in kilometers
export function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export interface NearbyStationItem {
  station: RailwayStation;
  distanceKm: number;
  isMajorHub: boolean;
}

// Find top nearby stations (e.g. within 25 km), prioritizing major junctions (e.g., Gwalior Jn alongside Birlanagar)
export function findNearbyStations(lat: number, lng: number, limit: number = 4): NearbyStationItem[] {
  const candidates: NearbyStationItem[] = [];

  for (const st of ALL_RAILWAY_STATIONS) {
    if (st.lat !== null && st.lng !== null) {
      const d = getDistanceKm(lat, lng, st.lat, st.lng);
      if (d <= 30) {
        const nameUpper = st.n.toUpperCase();
        const isMajor =
          POPULAR_STATION_CODES.includes(st.c) ||
          nameUpper.includes(' JN') ||
          nameUpper.includes(' JUNCTION') ||
          nameUpper.includes(' CANT') ||
          nameUpper.includes(' CENTRAL') ||
          nameUpper.includes(' TERMINUS');
        candidates.push({ station: st, distanceKm: d, isMajorHub: isMajor });
      }
    }
  }

  // Sort: prioritize major hubs if within 10 km, then by distance
  candidates.sort((a, b) => {
    if (a.isMajorHub && !b.isMajorHub && a.distanceKm <= 10 && b.distanceKm <= 5) return -1;
    if (b.isMajorHub && !a.isMajorHub && b.distanceKm <= 10 && a.distanceKm <= 5) return 1;
    return a.distanceKm - b.distanceKm;
  });

  if (candidates.length === 0) {
    const singleClosest = findNearestStation(lat, lng);
    if (singleClosest) {
      return [{ ...singleClosest, isMajorHub: true }];
    }
    return [];
  }

  return candidates.slice(0, limit);
}

// Find single nearest station to given GPS coordinates
export function findNearestStation(lat: number, lng: number): { station: RailwayStation; distanceKm: number } | null {
  let closest: RailwayStation | null = null;
  let minDistance = Infinity;

  for (const st of ALL_RAILWAY_STATIONS) {
    if (st.lat !== null && st.lng !== null) {
      const d = getDistanceKm(lat, lng, st.lat, st.lng);
      if (d < minDistance) {
        minDistance = d;
        closest = st;
      }
    }
  }

  if (!closest) return null;
  return { station: closest, distanceKm: minDistance };
}

// Fast station search matching code, name, or state
export function searchStations(query: string, limit: number = 25): RailwayStation[] {
  const q = query.trim().toUpperCase();
  if (!q) return POPULAR_STATIONS.slice(0, limit);

  const exactCode: RailwayStation[] = [];
  const startsWithCode: RailwayStation[] = [];
  const startsWithName: RailwayStation[] = [];
  const containsCodeOrName: RailwayStation[] = [];

  for (const s of ALL_RAILWAY_STATIONS) {
    const codeUpper = s.c.toUpperCase();
    const nameUpper = s.n.toUpperCase();

    if (codeUpper === q) {
      exactCode.push(s);
    } else if (codeUpper.startsWith(q)) {
      startsWithCode.push(s);
    } else if (nameUpper.startsWith(q)) {
      startsWithName.push(s);
    } else if (nameUpper.includes(q) || (s.s && s.s.toUpperCase().includes(q))) {
      containsCodeOrName.push(s);
    }

    if (exactCode.length + startsWithCode.length + startsWithName.length + containsCodeOrName.length >= limit * 2) {
      break;
    }
  }

  return [...exactCode, ...startsWithCode, ...startsWithName, ...containsCodeOrName].slice(0, limit);
}
