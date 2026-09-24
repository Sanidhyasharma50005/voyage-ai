// src/data/stationAliases.ts
/**
 * Station Alias & Normalization Layer
 * Resolves user input, city names, abbreviations, historical names, and formatting variations
 * to canonical Indian Railways station codes.
 */

export interface StationAliasEntry {
  canonicalCode: string;
  canonicalName: string;
  aliases: string[];
}

export const STATION_ALIASES: Record<string, StationAliasEntry> = {
  GWL: {
    canonicalCode: 'GWL',
    canonicalName: 'GWALIOR JN',
    aliases: ['gwalior', 'gwalior jn', 'gwalior junction', 'gwl', 'gwalior railway station'],
  },
  UHP: {
    canonicalCode: 'UHP',
    canonicalName: 'MCTM UDHAMPUR',
    aliases: [
      'udhampur',
      'mctm',
      'mctm udhampur',
      'uhp',
      'martyr captain tushar mahajan',
      'tushar mahajan',
      'udhampur railway station',
    ],
  },
  JAT: {
    canonicalCode: 'JAT',
    canonicalName: 'JAMMU TAWI',
    aliases: ['jammu', 'jammu tawi', 'jat', 'jammu city', 'jammu railway station'],
  },
  NDLS: {
    canonicalCode: 'NDLS',
    canonicalName: 'NEW DELHI',
    aliases: ['new delhi', 'delhi', 'ndls', 'delhi capital', 'dli', 'dilli'],
  },
  NZM: {
    canonicalCode: 'NZM',
    canonicalName: 'H NIZAMUDDIN',
    aliases: ['hazrat nizamuddin', 'nizamuddin', 'nzm', 'h nizamuddin'],
  },
  AGC: {
    canonicalCode: 'AGC',
    canonicalName: 'AGRA CANTT',
    aliases: ['agra', 'agra cantt', 'agc', 'agra cantonment', 'taj city'],
  },
  AF: {
    canonicalCode: 'AF',
    canonicalName: 'AGRA FORT',
    aliases: ['agra fort', 'af'],
  },
  BLNR: {
    canonicalCode: 'BLNR',
    canonicalName: 'BIRLANAGAR',
    aliases: ['birlanagar', 'birla nagar', 'blnr', 'gwalior birlanagar'],
  },
  BSB: {
    canonicalCode: 'BSB',
    canonicalName: 'VARANASI JN',
    aliases: ['varanasi', 'varanasi jn', 'bsb', 'banaras', 'kashi', 'benaras'],
  },
  CNB: {
    canonicalCode: 'CNB',
    canonicalName: 'KANPUR CENTRAL',
    aliases: ['kanpur', 'kanpur central', 'cnb', 'cawnpore'],
  },
  LKO: {
    canonicalCode: 'LKO',
    canonicalName: 'LUCKNOW NR',
    aliases: ['lucknow', 'lucknow nr', 'lko', 'lucknow charbagh', 'charbagh'],
  },
  AY: {
    canonicalCode: 'AY',
    canonicalName: 'AYODHYA DHAM',
    aliases: ['ayodhya', 'ayodhya dham', 'ay', 'ayodhya jn'],
  },
  AYC: {
    canonicalCode: 'AYC',
    canonicalName: 'AYODHYA CANTT',
    aliases: ['ayodhya cantt', 'ayc', 'faizabad', 'faizabad jn'],
  },
  JP: {
    canonicalCode: 'JP',
    canonicalName: 'JAIPUR',
    aliases: ['jaipur', 'jp', 'pink city', 'jaipur jn'],
  },
  BHO: {
    canonicalCode: 'BPL',
    canonicalName: 'BHOPAL JN',
    aliases: ['bhopal', 'bpl', 'bhopal jn'],
  },
  RKMP: {
    canonicalCode: 'RKMP',
    canonicalName: 'RANI KAMALAPATI',
    aliases: ['rani kamalapati', 'rkmp', 'habibganj', 'habibganj bhopal'],
  },
  INDB: {
    canonicalCode: 'INDB',
    canonicalName: 'INDORE JN',
    aliases: ['indore', 'indb', 'indore jn'],
  },
  MMCT: {
    canonicalCode: 'MMCT',
    canonicalName: 'MUMBAI CENTRAL',
    aliases: ['mumbai central', 'mmct', 'bct', 'bombay central'],
  },
  CSMT: {
    canonicalCode: 'CSMT',
    canonicalName: 'MUMBAI CSMT',
    aliases: ['csmt', 'mumbai csmt', 'cst', 'chhatrapati shivaji', 'vt', 'victoria terminus'],
  },
  PUNE: {
    canonicalCode: 'PUNE',
    canonicalName: 'PUNE JN',
    aliases: ['pune', 'poona', 'pune jn'],
  },
  MAO: {
    canonicalCode: 'MAO',
    canonicalName: 'MADGAON',
    aliases: ['madgaon', 'goa', 'margao', 'mao', 'madgaon jn', 'south goa'],
  },
  SBC: {
    canonicalCode: 'SBC',
    canonicalName: 'KSR BENGALURU',
    aliases: ['bangalore', 'bengaluru', 'sbc', 'ksr bengaluru', 'bangalore city'],
  },
  MAS: {
    canonicalCode: 'MAS',
    canonicalName: 'MGR CHENNAI CENTRAL',
    aliases: ['chennai', 'chennai central', 'mas', 'madras', 'mgr chennai central'],
  },
  HWH: {
    canonicalCode: 'HWH',
    canonicalName: 'HOWRAH JN',
    aliases: ['howrah', 'kolkata', 'hwh', 'calcutta', 'howrah jn'],
  },
  PURI: {
    canonicalCode: 'PURI',
    canonicalName: 'PURI',
    aliases: ['puri', 'jagannath puri'],
  },
  CDG: {
    canonicalCode: 'CDG',
    canonicalName: 'CHANDIGARH',
    aliases: ['chandigarh', 'cdg'],
  },
  ASR: {
    canonicalCode: 'ASR',
    canonicalName: 'AMRITSAR JN',
    aliases: ['amritsar', 'asr', 'golden temple'],
  },
  HW: {
    canonicalCode: 'HW',
    canonicalName: 'HARIDWAR',
    aliases: ['haridwar', 'hw', 'hardwar'],
  },
  DDN: {
    canonicalCode: 'DDN',
    canonicalName: 'DEHRADUN',
    aliases: ['dehradun', 'ddn'],
  },
  SVDK: {
    canonicalCode: 'SVDK',
    canonicalName: 'SMVD KATRA',
    aliases: ['katra', 'svdk', 'vaishno devi', 'shri mata vaishno devi katra'],
  },
};

/**
 * Normalizes any query string to a canonical Station Code.
 * Returns the canonical code if matched, or uppercase trimmed code if not.
 */
export function normalizeStationCode(query: string): string {
  if (!query) return '';
  const clean = query.trim().toLowerCase().replace(/[^a-z0-9 ]/g, '');

  for (const entry of Object.values(STATION_ALIASES)) {
    if (entry.canonicalCode.toLowerCase() === clean) {
      return entry.canonicalCode;
    }
    for (const alias of entry.aliases) {
      if (alias === clean || clean === alias.replace(/ /g, '')) {
        return entry.canonicalCode;
      }
    }
  }

  // Exact uppercase fallback
  return query.trim().toUpperCase();
}
