// src/data/stationClusters.ts
/**
 * City-Cluster / Gateway / Alternate-Station Mapping
 * Curated data-driven mapping of stations to passenger-relevant alternate gateway stations.
 * Every alternate station must be explicitly labeled with human-readable notes and distance,
 * never presented as the exact requested station without clear demarcation.
 */

export interface AlternateStationMapping {
  stationCode: string;
  stationName: string;
  distanceKm: number;
  directionOrRole: string; // e.g., 'Major railhead ~53 km south of Udhampur on Jammu-Srinagar highway'
}

export interface StationCluster {
  primaryCode: string;
  clusterName: string;
  alternates: AlternateStationMapping[];
}

export const STATION_CLUSTERS: Record<string, StationCluster> = {
  // Kashmir / Udhampur Gateway Cluster
  UHP: {
    primaryCode: 'UHP',
    clusterName: 'Udhampur / Kashmir Gateway Hub',
    alternates: [
      {
        stationCode: 'JAT',
        stationName: 'Jammu Tawi',
        distanceKm: 53,
        directionOrRole: 'Major terminal ~53 km south of Udhampur with frequent onward buses/taxis to Srinagar',
      },
      {
        stationCode: 'SVDK',
        stationName: 'Shri Mata Vaishno Devi Katra',
        distanceKm: 25,
        directionOrRole: 'Northern railhead ~25 km from Udhampur towards Reasi / Chenab Bridge',
      },
    ],
  },
  JAT: {
    primaryCode: 'JAT',
    clusterName: 'Jammu Tawi Hub',
    alternates: [
      {
        stationCode: 'UHP',
        stationName: 'MCTM Udhampur',
        distanceKm: 53,
        directionOrRole: 'Northern extension towards Kashmir valley',
      },
      {
        stationCode: 'SVDK',
        stationName: 'Shri Mata Vaishno Devi Katra',
        distanceKm: 78,
        directionOrRole: 'Vaishno Devi terminal railhead',
      },
    ],
  },

  // Gwalior Suburban Cluster
  GWL: {
    primaryCode: 'GWL',
    clusterName: 'Gwalior Rail Cluster',
    alternates: [
      {
        stationCode: 'BLNR',
        stationName: 'Birlanagar Junction',
        distanceKm: 4,
        directionOrRole: 'Northern suburban station in Gwalior industrial area',
      },
    ],
  },
  BLNR: {
    primaryCode: 'BLNR',
    clusterName: 'Birlanagar Rail Cluster',
    alternates: [
      {
        stationCode: 'GWL',
        stationName: 'Gwalior Junction',
        distanceKm: 4,
        directionOrRole: 'Central divisional junction with all major express halts',
      },
    ],
  },

  // Delhi NCR Cluster
  NDLS: {
    primaryCode: 'NDLS',
    clusterName: 'Delhi NCR Hub',
    alternates: [
      {
        stationCode: 'NZM',
        stationName: 'Hazrat Nizamuddin',
        distanceKm: 7,
        directionOrRole: 'South Delhi terminal for Rajdhani and South/Central bound express trains',
      },
      {
        stationCode: 'DLI',
        stationName: 'Old Delhi Junction',
        distanceKm: 4,
        directionOrRole: 'Historic central terminal for Rajasthan & Punjab routes',
      },
      {
        stationCode: 'ANVT',
        stationName: 'Anand Vihar Terminal',
        distanceKm: 12,
        directionOrRole: 'East Delhi mega-terminal for UP & Bihar bound trains',
      },
    ],
  },

  // Agra Cluster
  AGC: {
    primaryCode: 'AGC',
    clusterName: 'Agra Rail Cluster',
    alternates: [
      {
        stationCode: 'AF',
        stationName: 'Agra Fort',
        distanceKm: 4,
        directionOrRole: 'Historic central station serving East/Rajasthan line',
      },
      {
        stationCode: 'RKM',
        stationName: 'Raja Ki Mandi',
        distanceKm: 4,
        directionOrRole: 'City center station near Civil Lines',
      },
    ],
  },

  // Varanasi Cluster
  BSB: {
    primaryCode: 'BSB',
    clusterName: 'Varanasi Cluster',
    alternates: [
      {
        stationCode: 'BSBS',
        stationName: 'Banaras',
        distanceKm: 4,
        directionOrRole: 'Modernized terminal station in western Varanasi',
      },
      {
        stationCode: 'DDU',
        stationName: 'Pt. Deen Dayal Upadhyaya Junction',
        distanceKm: 16,
        directionOrRole: 'Major eastern trunk route junction (Mughalsarai) with high frequency',
      },
    ],
  },

  // Goa Cluster
  MAO: {
    primaryCode: 'MAO',
    clusterName: 'Goa Konkan Railway Cluster',
    alternates: [
      {
        stationCode: 'KRMI',
        stationName: 'Karmali',
        distanceKm: 33,
        directionOrRole: 'Gateway for Panaji (12 km) and Old Goa',
      },
      {
        stationCode: 'THVM',
        stationName: 'Thivim',
        distanceKm: 50,
        directionOrRole: 'Gateway for North Goa beach belt (Calangute, Baga, Anjuna)',
      },
    ],
  },
};

/**
 * Get alternate station candidates for a given primary station code.
 */
export function getAlternateStations(stationCode: string): AlternateStationMapping[] {
  const cluster = STATION_CLUSTERS[stationCode.toUpperCase()];
  return cluster ? cluster.alternates : [];
}
