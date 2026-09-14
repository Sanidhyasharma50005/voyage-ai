import type { Destination, SemanticIntent } from '../types/travel';

export type MatchType =
  | 'exact_canonical'
  | 'exact_alias'
  | 'normalized_canonical'
  | 'normalized_alias'
  | 'prefix'
  | 'group'
  | 'token'
  | 'fuzzy_canonical'
  | 'fuzzy_alias'
  | 'state_region'
  | 'category_intent'
  | 'attraction_keyword';

export interface SearchResult {
  destination: Destination;
  score: number;
  matchType: MatchType;
  matchedField: string;
  matchedText: string;
  confidence: number; // 0.0 to 1.0
  isAutoCorrected: boolean;
  suggestedTerm?: string;
  explanation: string;
  distanceKm?: number | null;
}

export interface SearchOptions {
  userLocation?: { lat: number; lon?: number; lng?: number } | null;
  limit?: number;
  minScore?: number;
}

// ---------------------------------------------------------------------------
// 1. Text Normalization
// ---------------------------------------------------------------------------
export function normalizeText(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ') // replace all punctuation/symbols with space
    .replace(/\s+/g, ' ')
    .trim();
}

export function tokenize(str: string): string[] {
  const norm = normalizeText(str);
  if (!norm) return [];
  return norm.split(' ').filter(Boolean);
}

// ---------------------------------------------------------------------------
// 2. Adaptive Damerau-Levenshtein Edit Distance (Hard Cap of 2)
// ---------------------------------------------------------------------------
export function damerauLevenshteinDistance(a: string, b: string): number {
  const al = a.length;
  const bl = b.length;
  if (al === 0) return bl;
  if (bl === 0) return al;

  // Quick check
  if (Math.abs(al - bl) > 2) return 999;

  const matrix: number[][] = [];
  for (let i = 0; i <= al; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= bl; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= al; i++) {
    for (let j = 1; j <= bl; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let min = Math.min(
        matrix[i - 1][j] + 1,      // deletion
        matrix[i][j - 1] + 1,      // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );

      // Transposition
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        min = Math.min(min, matrix[i - 2][j - 2] + 1);
      }
      matrix[i][j] = min;
    }
  }

  return matrix[al][bl];
}

/**
 * Adaptive typo limit:
 * - Length <= 4: max 1 edit
 * - Length > 4: max 2 edits
 * - Hard cap: strictly rejects > 2 edits
 */
export function isFuzzyMatch(
  query: string,
  target: string
): { isMatch: boolean; distance: number; maxAllowed: number } {
  const qLen = query.length;
  if (qLen < 3) {
    return { isMatch: false, distance: 999, maxAllowed: 0 };
  }

  const maxAllowed = qLen <= 4 ? 1 : 2;
  const distance = damerauLevenshteinDistance(query, target);
  return {
    isMatch: distance <= maxAllowed,
    distance,
    maxAllowed,
  };
}

// ---------------------------------------------------------------------------
// 3. Spherical Distance Calculator (Haversine Formula)
// ---------------------------------------------------------------------------
export function calculateSphericalDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ---------------------------------------------------------------------------
// 4. Intent Vocabularies & Conflict Map
// ---------------------------------------------------------------------------
export const INTENT_VOCABULARY: Record<string, SemanticIntent> = {
  snow: 'snow',
  snowfall: 'snow',
  ski: 'skiing',
  skiing: 'skiing',
  snowboarding: 'skiing',
  beach: 'beach',
  beaches: 'beach',
  coast: 'beach',
  sea: 'beach',
  ocean: 'beach',
  scuba: 'scuba',
  diving: 'scuba',
  snorkeling: 'scuba',
  water_sports: 'water_sports',
  parasailing: 'water_sports',
  surfing: 'water_sports',
  wildlife: 'wildlife',
  safari: 'safari',
  tiger: 'safari',
  rhino: 'safari',
  elephant: 'wildlife',
  national_park: 'wildlife',
  temple: 'temple',
  temples: 'temple',
  spiritual: 'spiritual',
  pilgrimage: 'spiritual',
  jyotirlinga: 'spiritual',
  dham: 'spiritual',
  ghats: 'spiritual',
  aarti: 'spiritual',
  heritage: 'heritage',
  palace: 'heritage',
  fort: 'heritage',
  forts: 'heritage',
  monument: 'heritage',
  unesco: 'heritage',
  architecture: 'architecture',
  trek: 'trekking',
  trekking: 'trekking',
  hiking: 'trekking',
  mountain: 'adventure',
  adventure: 'adventure',
  rafting: 'adventure',
  paragliding: 'adventure',
  backwaters: 'backwaters',
  houseboat: 'backwaters',
  canal: 'backwaters',
  desert: 'desert',
  dunes: 'desert',
  sand: 'desert',
  camel: 'desert',
  tea: 'tea_plantations',
  plantation: 'tea_plantations',
  honeymoon: 'honeymoon',
  romantic: 'honeymoon',
};

// Intent conflicts: if a query matches 'snow', a destination with 'beach' intent receives a conflict penalty
export const CONFLICTING_INTENTS: Record<SemanticIntent, SemanticIntent[]> = {
  snow: ['beach', 'backwaters', 'desert'],
  skiing: ['beach', 'backwaters', 'desert'],
  beach: ['snow', 'skiing'],
  scuba: ['snow', 'skiing', 'desert'],
  desert: ['snow', 'skiing', 'backwaters'],
  backwaters: ['snow', 'skiing', 'desert'],
  water_sports: ['snow', 'desert'],
  wildlife: [],
  safari: [],
  spiritual: [],
  temple: [],
  heritage: [],
  architecture: [],
  trekking: [],
  adventure: [],
  tea_plantations: ['desert'],
  honeymoon: [],
};

// ---------------------------------------------------------------------------
// 5. Layered Matching Core Algorithm
// ---------------------------------------------------------------------------

// Score Bases for Hard Priority
const BASE_EXACT_CANONICAL = 10000;
const BASE_EXACT_ALIAS = 9000;
const BASE_NORM_CANONICAL = 8000;
const BASE_NORM_ALIAS = 7500;
const BASE_PREFIX = 6500;
const BASE_GROUP = 6000;
const BASE_TOKEN = 5000;
const BASE_FUZZY_CANONICAL = 4000;
const BASE_FUZZY_ALIAS = 3500;
const BASE_STATE_REGION = 2500;
const BASE_CATEGORY_INTENT = 1000;
const BASE_ATTRACTION_KEYWORD = 800;

export function evaluateDestinationMatch(
  destination: Destination,
  rawQuery: string
): {
  matched: boolean;
  score: number;
  matchType: MatchType;
  matchedField: string;
  matchedText: string;
  confidence: number;
  isAutoCorrected: boolean;
  suggestedTerm?: string;
  explanation: string;
} {
  const normQuery = normalizeText(rawQuery);
  if (!normQuery) {
    return {
      matched: false,
      score: 0,
      matchType: 'attraction_keyword',
      matchedField: '',
      matchedText: '',
      confidence: 0,
      isAutoCorrected: false,
      explanation: 'Empty query',
    };
  }

  const rawLower = rawQuery.toLowerCase().trim();
  const queryTokens = tokenize(normQuery);

  // Target texts
  const canonicalNameRaw = destination.name.toLowerCase().trim();
  const canonicalNameNorm = normalizeText(destination.name);
  const aliasesRaw = (destination.aliases || []).map((a) => a.toLowerCase().trim());
  const aliasesNorm = (destination.aliases || []).map(normalizeText);
  const stateNorm = normalizeText(destination.state);
  const regionNorm = destination.region ? normalizeText(destination.region) : '';
  const groupNorm = destination.destinationGroup ? normalizeText(destination.destinationGroup) : '';
  const categoryNorm = normalizeText(destination.category);
  const keywordsNorm = (destination.keywords || []).map(normalizeText);
  const attractionsNorm = (destination.attractions || destination.viewpoints || []).map((v) =>
    normalizeText(v.name)
  );
  const tagsNorm = (destination.tags || []).map(normalizeText);

  // -------------------------------------------------------------------------
  // Layer 1: Exact Canonical Name Match
  // -------------------------------------------------------------------------
  if (rawLower === canonicalNameRaw) {
    return {
      matched: true,
      score: BASE_EXACT_CANONICAL + 500,
      matchType: 'exact_canonical',
      matchedField: 'name',
      matchedText: destination.name,
      confidence: 1.0,
      isAutoCorrected: false,
      explanation: `Exact match on "${destination.name}"`,
    };
  }

  // -------------------------------------------------------------------------
  // Layer 2: Exact Alias Match
  // -------------------------------------------------------------------------
  const exactAliasIdx = aliasesRaw.findIndex((a) => a === rawLower);
  if (exactAliasIdx >= 0) {
    const matchedAlias = destination.aliases![exactAliasIdx];
    return {
      matched: true,
      score: BASE_EXACT_ALIAS + 500,
      matchType: 'exact_alias',
      matchedField: 'aliases',
      matchedText: matchedAlias,
      confidence: 0.98,
      isAutoCorrected: false,
      explanation: `Exact alias match for "${matchedAlias}"`,
    };
  }

  // -------------------------------------------------------------------------
  // Layer 3: Normalized Canonical Name Match
  // -------------------------------------------------------------------------
  if (normQuery === canonicalNameNorm) {
    return {
      matched: true,
      score: BASE_NORM_CANONICAL + 400,
      matchType: 'normalized_canonical',
      matchedField: 'name',
      matchedText: destination.name,
      confidence: 0.95,
      isAutoCorrected: false,
      explanation: `Normalized name match on "${destination.name}"`,
    };
  }

  // -------------------------------------------------------------------------
  // Layer 4: Normalized Alias Match
  // -------------------------------------------------------------------------
  const normAliasIdx = aliasesNorm.findIndex((a) => a === normQuery);
  if (normAliasIdx >= 0) {
    const matchedAlias = destination.aliases![normAliasIdx];
    return {
      matched: true,
      score: BASE_NORM_ALIAS + 400,
      matchType: 'normalized_alias',
      matchedField: 'aliases',
      matchedText: matchedAlias,
      confidence: 0.92,
      isAutoCorrected: false,
      explanation: `Normalized alias match on "${matchedAlias}"`,
    };
  }

  // -------------------------------------------------------------------------
  // Layer 4b: Natural Language Entity Extraction (Strips "city", "trip", "in", "near", etc.)
  // e.g. "pune city" -> "pune", "hotels in jaipur" -> "jaipur", "trip to goa" -> "goa", "pink city tour" -> "pink city"
  // -------------------------------------------------------------------------
  if (queryTokens.length > 1) {
    const cleanedQuery = normQuery
      .replace(/^(hotels?\s+(in|near|at)\s+|places?\s+(in|near|to|around)\s+|trips?\s+(to|in)\s+|tours?\s+(to|of|in)\s+)/g, '')
      .replace(/\s+(city|town|tour|trips?|tourism|visit|vacation|holidays?)$/g, '')
      .trim();

    const candidates = new Set<string>();
    if (cleanedQuery && cleanedQuery !== normQuery) {
      candidates.add(cleanedQuery);
    }
    const QUERY_STOPWORDS = new Set([
      'in', 'to', 'at', 'near', 'from', 'for', 'the', 'a', 'an', 'and', 'of',
      'best', 'top', 'city', 'town', 'tour', 'trip', 'place', 'places', 'travel',
      'visit', 'tourism', 'hotel', 'hotels', 'stay', 'stays'
    ]);
    const sigTokens = queryTokens.filter((t) => !QUERY_STOPWORDS.has(t));
    if (sigTokens.length > 0 && sigTokens.length < queryTokens.length) {
      candidates.add(sigTokens.join(' '));
    }

    for (const cand of candidates) {
      if (cand === canonicalNameNorm) {
        return {
          matched: true,
          score: BASE_NORM_CANONICAL + 200,
          matchType: 'normalized_canonical',
          matchedField: 'name',
          matchedText: destination.name,
          confidence: 0.90,
          isAutoCorrected: false,
          explanation: `Identified destination entity "${destination.name}" from query`,
        };
      }
      const sigAliasIdx = aliasesNorm.findIndex((a) => a === cand);
      if (sigAliasIdx >= 0) {
        const matchedAlias = destination.aliases![sigAliasIdx];
        return {
          matched: true,
          score: BASE_NORM_ALIAS + 200,
          matchType: 'normalized_alias',
          matchedField: 'aliases',
          matchedText: matchedAlias,
          confidence: 0.88,
          isAutoCorrected: false,
          explanation: `Identified alias entity "${matchedAlias}" from query`,
        };
      }
      if (groupNorm && groupNorm === cand) {
        return {
          matched: true,
          score: BASE_GROUP + 200,
          matchType: 'group',
          matchedField: 'destinationGroup',
          matchedText: destination.destinationGroup!,
          confidence: 0.85,
          isAutoCorrected: false,
          explanation: `Identified destination group "${destination.destinationGroup}" from query`,
        };
      }
    }
  }

  // -------------------------------------------------------------------------
  // Layer 5: Prefix Match (Canonical Name, Aliases, or Destination Group)
  // This ensures "anda" -> "Andaman & Nicobar" scores BASE_PREFIX (6500+)
  // and CANNOT be beaten by "Chandela" (Khajuraho) or "Nanda Devi" (Auli)
  // -------------------------------------------------------------------------
  let prefixMatchScore = 0;
  let prefixField = '';
  let prefixText = '';

  // Canonical name prefix
  if (canonicalNameNorm.startsWith(normQuery)) {
    const ratio = normQuery.length / Math.max(canonicalNameNorm.length, 1);
    prefixMatchScore = BASE_PREFIX + Math.round(ratio * 500);
    prefixField = 'name';
    prefixText = destination.name;
  }

  // Alias prefix
  if (!prefixMatchScore) {
    for (let i = 0; i < aliasesNorm.length; i++) {
      if (aliasesNorm[i].startsWith(normQuery)) {
        const ratio = normQuery.length / Math.max(aliasesNorm[i].length, 1);
        const score = BASE_PREFIX - 50 + Math.round(ratio * 400);
        if (score > prefixMatchScore) {
          prefixMatchScore = score;
          prefixField = 'aliases';
          prefixText = destination.aliases![i];
        }
      }
    }
  }

  // Destination group prefix or match (e.g. "andaman", "ladakh", "goa")
  if (groupNorm && (groupNorm === normQuery || groupNorm.startsWith(normQuery))) {
    const ratio = normQuery.length / Math.max(groupNorm.length, 1);
    const score = BASE_GROUP + Math.round(ratio * 400);
    if (score > prefixMatchScore) {
      prefixMatchScore = score;
      prefixField = 'destinationGroup';
      prefixText = destination.destinationGroup!;
    }
  }

  if (prefixMatchScore > 0) {
    return {
      matched: true,
      score: prefixMatchScore,
      matchType: prefixField === 'destinationGroup' ? 'group' : 'prefix',
      matchedField: prefixField,
      matchedText: prefixText,
      confidence: 0.88,
      isAutoCorrected: false,
      explanation: `Prefix match on ${prefixField} "${prefixText}"`,
    };
  }

  // -------------------------------------------------------------------------
  // Layer 6: Token Match (Words in Query match Name or Alias Tokens)
  // -------------------------------------------------------------------------
  const nameTokens = tokenize(destination.name);
  let matchedNameTokens = 0;
  for (const qt of queryTokens) {
    if (nameTokens.some((nt) => nt === qt || (nt.startsWith(qt) && qt.length >= 3))) {
      matchedNameTokens++;
    }
  }

  if (matchedNameTokens > 0 && matchedNameTokens === queryTokens.length) {
    const tokenScore = BASE_TOKEN + Math.round((matchedNameTokens / nameTokens.length) * 400);
    return {
      matched: true,
      score: tokenScore,
      matchType: 'token',
      matchedField: 'name',
      matchedText: destination.name,
      confidence: 0.80,
      isAutoCorrected: false,
      explanation: `Token match on "${destination.name}"`,
    };
  }

  // Check aliases for full token coverage
  for (let i = 0; i < aliasesNorm.length; i++) {
    const aTokens = tokenize(aliasesNorm[i]);
    let aMatched = 0;
    for (const qt of queryTokens) {
      if (aTokens.some((at) => at === qt || (at.startsWith(qt) && qt.length >= 3))) {
        aMatched++;
      }
    }
    if (aMatched > 0 && aMatched === queryTokens.length) {
      const tokenScore = BASE_TOKEN - 50 + Math.round((aMatched / aTokens.length) * 350);
      return {
        matched: true,
        score: tokenScore,
        matchType: 'token',
        matchedField: 'aliases',
        matchedText: destination.aliases![i],
        confidence: 0.78,
        isAutoCorrected: false,
        explanation: `Token match on alias "${destination.aliases![i]}"`,
      };
    }
  }

  // -------------------------------------------------------------------------
  // Layer 7: Fuzzy Canonical Name Match (Adaptive Damerau-Levenshtein, edits <= 2)
  // -------------------------------------------------------------------------
  // Check against the primary word or full canonical name
  const primaryNameWord = nameTokens[0] || '';
  const fuzzyPrimary = isFuzzyMatch(normQuery, primaryNameWord);
  if (fuzzyPrimary.isMatch) {
    const ratio = 1 - fuzzyPrimary.distance / Math.max(primaryNameWord.length, 1);
    const score = BASE_FUZZY_CANONICAL + Math.round(ratio * 500);
    return {
      matched: true,
      score,
      matchType: 'fuzzy_canonical',
      matchedField: 'name',
      matchedText: destination.name,
      confidence: fuzzyPrimary.distance === 1 ? 0.82 : 0.70,
      isAutoCorrected: true,
      suggestedTerm: destination.name,
      explanation: `Typo corrected (${fuzzyPrimary.distance} edit): "${destination.name}"`,
    };
  }

  // Check full canonical name fuzzy
  const fuzzyFullName = isFuzzyMatch(normQuery, canonicalNameNorm);
  if (fuzzyFullName.isMatch) {
    const ratio = 1 - fuzzyFullName.distance / Math.max(canonicalNameNorm.length, 1);
    const score = BASE_FUZZY_CANONICAL + Math.round(ratio * 400);
    return {
      matched: true,
      score,
      matchType: 'fuzzy_canonical',
      matchedField: 'name',
      matchedText: destination.name,
      confidence: fuzzyFullName.distance === 1 ? 0.80 : 0.68,
      isAutoCorrected: true,
      suggestedTerm: destination.name,
      explanation: `Typo corrected (${fuzzyFullName.distance} edit): "${destination.name}"`,
    };
  }

  // Check destination group fuzzy (e.g. "andman" -> group "andaman")
  if (groupNorm) {
    const fuzzyGroup = isFuzzyMatch(normQuery, groupNorm);
    if (fuzzyGroup.isMatch) {
      const ratio = 1 - fuzzyGroup.distance / Math.max(groupNorm.length, 1);
      const score = BASE_FUZZY_CANONICAL - 50 + Math.round(ratio * 400);
      return {
        matched: true,
        score,
        matchType: 'fuzzy_canonical',
        matchedField: 'destinationGroup',
        matchedText: destination.destinationGroup!,
        confidence: 0.75,
        isAutoCorrected: true,
        suggestedTerm: destination.destinationGroup!,
        explanation: `Typo corrected on group "${destination.destinationGroup}"`,
      };
    }
  }

  // -------------------------------------------------------------------------
  // Layer 8: Fuzzy Alias Match (Adaptive Damerau-Levenshtein, edits <= 2)
  // -------------------------------------------------------------------------
  for (let i = 0; i < aliasesNorm.length; i++) {
    const aliasNorm = aliasesNorm[i];
    const fuzzyAlias = isFuzzyMatch(normQuery, aliasNorm);
    if (fuzzyAlias.isMatch) {
      const ratio = 1 - fuzzyAlias.distance / Math.max(aliasNorm.length, 1);
      const score = BASE_FUZZY_ALIAS + Math.round(ratio * 400);
      return {
        matched: true,
        score,
        matchType: 'fuzzy_alias',
        matchedField: 'aliases',
        matchedText: destination.aliases![i],
        confidence: fuzzyAlias.distance === 1 ? 0.75 : 0.65,
        isAutoCorrected: true,
        suggestedTerm: destination.aliases![i],
        explanation: `Typo corrected on alias "${destination.aliases![i]}"`,
      };
    }
  }

  // -------------------------------------------------------------------------
  // Layer 9: State / Union Territory / Region Match
  // -------------------------------------------------------------------------
  if (stateNorm && (stateNorm === normQuery || stateNorm.includes(normQuery) || normQuery.includes(stateNorm))) {
    const ratio = Math.min(normQuery.length / Math.max(stateNorm.length, 1), 1.0);
    return {
      matched: true,
      score: BASE_STATE_REGION + Math.round(ratio * 400),
      matchType: 'state_region',
      matchedField: 'state',
      matchedText: destination.state,
      confidence: 0.72,
      isAutoCorrected: false,
      explanation: `State match on "${destination.state}"`,
    };
  }

  if (regionNorm && (regionNorm === normQuery || regionNorm.includes(normQuery))) {
    return {
      matched: true,
      score: BASE_STATE_REGION - 100,
      matchType: 'state_region',
      matchedField: 'region',
      matchedText: destination.region!,
      confidence: 0.65,
      isAutoCorrected: false,
      explanation: `Region match on "${destination.region}"`,
    };
  }

  // -------------------------------------------------------------------------
  // Layer 10: Category, Semantic Intent, Attraction & Keyword Matches
  // -------------------------------------------------------------------------
  // 10a. Category match
  if (categoryNorm && (categoryNorm === normQuery || categoryNorm.includes(normQuery))) {
    return {
      matched: true,
      score: BASE_CATEGORY_INTENT + 200,
      matchType: 'category_intent',
      matchedField: 'category',
      matchedText: destination.category,
      confidence: 0.60,
      isAutoCorrected: false,
      explanation: `Category match "${destination.category}"`,
    };
  }

  // 10b. Intent vocabulary match
  const detectedIntent = INTENT_VOCABULARY[normQuery];
  if (detectedIntent && destination.intents?.includes(detectedIntent)) {
    return {
      matched: true,
      score: BASE_CATEGORY_INTENT + 300,
      matchType: 'category_intent',
      matchedField: 'intents',
      matchedText: detectedIntent,
      confidence: 0.65,
      isAutoCorrected: false,
      explanation: `Matches travel intent "${detectedIntent}"`,
    };
  }

  // 10c. Attraction / Viewpoint match
  const matchedAttraction = attractionsNorm.find((a) => a.includes(normQuery));
  if (matchedAttraction) {
    return {
      matched: true,
      score: BASE_ATTRACTION_KEYWORD + 150,
      matchType: 'attraction_keyword',
      matchedField: 'attractions',
      matchedText: matchedAttraction,
      confidence: 0.55,
      isAutoCorrected: false,
      explanation: `Matched attraction "${matchedAttraction}"`,
    };
  }

  // 10d. Keywords & Tags match
  const matchedKeyword = keywordsNorm.find((k) => k.includes(normQuery));
  if (matchedKeyword) {
    return {
      matched: true,
      score: BASE_ATTRACTION_KEYWORD + 100,
      matchType: 'attraction_keyword',
      matchedField: 'keywords',
      matchedText: matchedKeyword,
      confidence: 0.50,
      isAutoCorrected: false,
      explanation: `Matched keyword "${matchedKeyword}"`,
    };
  }

  const matchedTag = tagsNorm.find((t) => t.includes(normQuery));
  if (matchedTag) {
    return {
      matched: true,
      score: BASE_ATTRACTION_KEYWORD + 50,
      matchType: 'attraction_keyword',
      matchedField: 'tags',
      matchedText: matchedTag,
      confidence: 0.45,
      isAutoCorrected: false,
      explanation: `Matched tag "${matchedTag}"`,
    };
  }

  return {
    matched: false,
    score: 0,
    matchType: 'attraction_keyword',
    matchedField: '',
    matchedText: '',
    confidence: 0,
    isAutoCorrected: false,
    explanation: 'No match',
  };
}

// ---------------------------------------------------------------------------
// 6. Public Search API
// ---------------------------------------------------------------------------
export function searchDestinations(
  destinations: Destination[],
  query: string,
  options: SearchOptions = {}
): SearchResult[] {
  const { userLocation, limit = 50, minScore = 0 } = options;
  const rawQuery = (query || '').trim();

  // Mode A: Empty Query (Browse / Near Me mode)
  if (!rawQuery) {
    const list = destinations.map((d) => {
      let dist: number | null = null;
      let score = 500;
      if (userLocation) {
        const userLon = userLocation.lon ?? userLocation.lng ?? 0;
        dist = calculateSphericalDistance(
          userLocation.lat,
          userLon,
          d.latitude,
          d.longitude
        );
        if (!isNaN(dist)) {
          // Inverse distance score: closer = higher score (500 max)
          score = Math.max(500 - dist * 0.1, 0);
        }
      }
      return {
        destination: d,
        score,
        matchType: 'exact_canonical' as MatchType,
        matchedField: 'all',
        matchedText: d.name,
        confidence: 1.0,
        isAutoCorrected: false,
        explanation: dist !== null ? `${Math.round(dist)} km away` : 'Catalog entry',
        distanceKm: dist,
      };
    });

    if (userLocation) {
      list.sort((a, b) => (a.distanceKm ?? 99999) - (b.distanceKm ?? 99999));
    }
    return list.slice(0, limit);
  }

  // Mode B: Active Search Query
  const normQuery = normalizeText(rawQuery);
  const detectedIntent = INTENT_VOCABULARY[normQuery];
  const results: SearchResult[] = [];

  for (const dest of destinations) {
    const evalResult = evaluateDestinationMatch(dest, rawQuery);
    if (!evalResult.matched || evalResult.score < minScore) {
      continue;
    }

    let finalScore = evalResult.score;

    // Intent Conflict Penalty
    if (detectedIntent) {
      const conflicts = CONFLICTING_INTENTS[detectedIntent] || [];
      const hasConflict = (dest.intents || []).some((di) => conflicts.includes(di));
      if (hasConflict) {
        finalScore -= 500;
      }
    }

    // Distance Calculation & Micro Tie-Breaker
    let dist: number | null = null;
    if (userLocation) {
      const userLon = userLocation.lon ?? userLocation.lng ?? 0;
      dist = calculateSphericalDistance(
        userLocation.lat,
        userLon,
        dest.latitude,
        dest.longitude
      );
      // Explicit search relevance is primary; distance adds up to 10 micro-points as a tie-breaker
      if (!isNaN(dist)) {
        const distanceBonus = Math.max(10 - (dist / 1000) * 2, 0);
        finalScore += distanceBonus;
      }
    }

    results.push({
      destination: dest,
      score: finalScore,
      matchType: evalResult.matchType,
      matchedField: evalResult.matchedField,
      matchedText: evalResult.matchedText,
      confidence: evalResult.confidence,
      isAutoCorrected: evalResult.isAutoCorrected,
      suggestedTerm: evalResult.suggestedTerm,
      explanation: evalResult.explanation,
      distanceKm: dist,
    });
  }

  // Sort strictly by finalScore descending
  results.sort((a, b) => b.score - a.score);

  return results.slice(0, limit);
}
