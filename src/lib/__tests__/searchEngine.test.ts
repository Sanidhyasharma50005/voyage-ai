import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeText,
  tokenize,
  damerauLevenshteinDistance,
  isFuzzyMatch,
  calculateSphericalDistance,
  evaluateDestinationMatch,
  searchDestinations,
} from '../searchEngine.ts';
import { ALL_DESTINATIONS } from '../../data/destinations.ts';

describe('Search Engine - Normalization & Tokenization', () => {
  it('should remove accents and diacritics', () => {
    assert.equal(normalizeText('Kashmir & Dal Lake!'), 'kashmir dal lake');
    assert.equal(normalizeText('Ménchukhā'), 'menchukha');
  });

  it('should remove punctuation and normalize spaces', () => {
    assert.equal(normalizeText('Goa, India... [Beaches]'), 'goa india beaches');
    assert.deepEqual(tokenize('  Pink   City, Jaipur! '), ['pink', 'city', 'jaipur']);
  });
});

describe('Search Engine - Damerau-Levenshtein Edit Distance', () => {
  it('should calculate distance 0 for identical strings', () => {
    assert.equal(damerauLevenshteinDistance('andaman', 'andaman'), 0);
  });

  it('should detect single substitution', () => {
    assert.equal(damerauLevenshteinDistance('manali', 'manlai'), 1); // transposition
    assert.equal(damerauLevenshteinDistance('jaipur', 'jaiput'), 1); // substitution
  });

  it('should detect deletion / omission', () => {
    assert.equal(damerauLevenshteinDistance('andman', 'andaman'), 1); // 'a' omitted
  });

  it('should enforce adaptive distance with max 2 edits', () => {
    assert.equal(isFuzzyMatch('andman', 'andaman').isMatch, true);
    assert.equal(isFuzzyMatch('kashmr', 'kashmir').isMatch, true);
    // 3+ edits should NOT match
    assert.equal(isFuzzyMatch('xyz', 'andaman').isMatch, false);
  });
});

describe('Search Engine - Crucial Regressions & Layered Hierarchy', () => {
  it('CRITICAL REGRESSION: "anda" must prioritize Andaman over tag matches', () => {
    const results = searchDestinations(ALL_DESTINATIONS, 'anda', {
      userLocation: { lat: 26.23, lng: 78.21 }, // user in Gwalior, North India
      limit: 10,
    });

    assert.ok(results.length > 0, 'Should find matching destinations for "anda"');

    // The top results MUST be Andaman destinations
    const topDest = results[0].destination;
    const isAndaman =
      topDest.destinationGroup === 'Andaman' ||
      topDest.name.toLowerCase().includes('andaman') ||
      topDest.aliases?.some((a) => a.toLowerCase().includes('andaman'));

    assert.ok(isAndaman, `Top result for "anda" must be Andaman, got ${topDest.name}`);

    // Prefix/group score (>= 6000) must beat tag/attraction matches (< 1200)
    assert.ok(results[0].score >= 6000, `Score for top match should be >= 6000, got ${results[0].score}`);

    // If Khajuraho (Chandela) or Auli (Nanda Devi) are present, they must be ranked below Andaman
    const khajurahoIndex = results.findIndex((r) => r.destination.id === 'khajuraho');
    if (khajurahoIndex !== -1) {
      assert.ok(khajurahoIndex >= 5, `Khajuraho must be ranked below Andaman prefix/group results`);
    }
  });

  it('CRITICAL: "andman" typo must match Andaman with fuzzy correction', () => {
    const results = searchDestinations(ALL_DESTINATIONS, 'andman', { limit: 5 });
    assert.ok(results.length > 0);
    const top = results[0];
    assert.ok(
      top.destination.destinationGroup === 'Andaman' ||
      top.destination.name.toLowerCase().includes('andaman') ||
      top.destination.aliases?.some((a) => a.toLowerCase().includes('andaman')),
      `Expected Andaman, got ${top.destination.name}`
    );
    assert.ok(top.isAutoCorrected, 'Should be flagged as auto-corrected');
  });

  it('CRITICAL: "banaras" must match Varanasi via exact alias', () => {
    const results = searchDestinations(ALL_DESTINATIONS, 'banaras', { limit: 3 });
    assert.ok(results.length > 0);
    assert.equal(results[0].destination.id, 'varanasi');
    assert.equal(results[0].matchType, 'exact_alias');
    assert.ok(results[0].score >= 9000);
  });

  it('CRITICAL: "pink city" must match Jaipur via exact alias', () => {
    const results = searchDestinations(ALL_DESTINATIONS, 'pink city', { limit: 3 });
    assert.ok(results.length > 0);
    assert.equal(results[0].destination.id, 'jaipur');
    assert.equal(results[0].matchType, 'exact_alias');
    assert.ok(results[0].score >= 9000);
  });

  it('Intent filtering: "snow" should return snow destinations', () => {
    const results = searchDestinations(ALL_DESTINATIONS, 'snow', { limit: 5 });
    assert.ok(results.length > 0);
    const topNames = results.slice(0, 5).map((r) => r.destination.name.toLowerCase());
    const snowKeywords = ['gulmarg', 'sonamarg', 'manali', 'auli', 'patnitop', 'leh', 'ladakh', 'tawang'];
    const hasSnowDest = topNames.some((n) => snowKeywords.some((sk) => n.includes(sk)));
    assert.ok(hasSnowDest, `Expected snow destinations, got: ${topNames.join(', ')}`);
  });

  it('Conflict penalty: "snow" query should penalize beach destinations', () => {
    const results = searchDestinations(ALL_DESTINATIONS, 'snow', { limit: 30 });
    const goaResult = results.find((r) => r.destination.id === 'goa');
    if (goaResult) {
      assert.ok(goaResult.score < 1000, 'Beach destinations should have conflict penalty on snow query');
    }
  });

  it('Near-Me logic: search relevance is primary, distance is micro tie-breaker', () => {
    // User in Delhi (28.61, 77.20) searching for "Munnar" (in Kerala, South India)
    const results = searchDestinations(ALL_DESTINATIONS, 'munnar', {
      userLocation: { lat: 28.61, lng: 77.20 },
      limit: 5,
    });
    assert.ok(results.length > 0);
    assert.equal(results[0].destination.id, 'munnar');
    // Even though Munnar is 2,000+ km away from Delhi, it MUST be ranked #1
    assert.ok(results[0].score >= 6500, `Munnar should have top score, got ${results[0].score}`);
  });

  it('CRITICAL: "pune", "pune city", "hotels in pune", and "poona" must match Pune at #1', () => {
    for (const q of ['pune', 'pune city', 'hotels in pune', 'poona']) {
      const results = searchDestinations(ALL_DESTINATIONS, q, { limit: 5 });
      assert.ok(results.length > 0, `Expected results for query: ${q}`);
      assert.equal(results[0].destination.id, 'pune', `Expected Pune to be #1 for query "${q}", got: ${results[0].destination.name}`);
      assert.ok(results[0].score >= 7500, `Expected high score for "${q}", got ${results[0].score}`);
    }
  });

  it('Tier-1 & Tier-2 cities: Nagpur, Mangalore, Coimbatore, Ludhiana return accurate top results', () => {
    const checks = [
      { q: 'nagpur', expectedId: 'nagpur' },
      { q: 'mangalore', expectedId: 'mangaluru' },
      { q: 'mangaluru', expectedId: 'mangaluru' },
      { q: 'coimbatore', expectedId: 'coimbatore' },
      { q: 'ludhiana', expectedId: 'ludhiana' },
      { q: 'thiruvananthapuram', expectedId: 'thiruvananthapuram' },
      { q: 'vijayawada', expectedId: 'vijayawada' },
      { q: 'rajkot', expectedId: 'rajkot' },
      { q: 'gurgaon', expectedId: 'gurugram' },
      { q: 'noida', expectedId: 'noida' }
    ];

    for (const { q, expectedId } of checks) {
      const results = searchDestinations(ALL_DESTINATIONS, q, { limit: 5 });
      assert.ok(results.length > 0, `Expected results for query: ${q}`);
      assert.equal(results[0].destination.id, expectedId, `Expected ${expectedId} for query "${q}", got: ${results[0].destination.name}`);
    }
  });
});
