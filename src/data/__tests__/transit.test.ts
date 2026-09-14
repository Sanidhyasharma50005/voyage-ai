import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  INDIAN_AIRPORTS,
  findNearestAirport,
  searchAirports
} from '../airports.ts';
import {
  INDIAN_BUS_TERMINALS,
  findNearestBusTerminal,
  searchBusTerminals
} from '../busTerminals.ts';

describe('Comprehensive Indian Airports Dataset', () => {
  it('should have extensive coverage of Indian airports (> 100 airports)', () => {
    assert.ok(
      INDIAN_AIRPORTS.length >= 100,
      `Expected at least 100 airports, found ${INDIAN_AIRPORTS.length}`
    );
  });

  it('should have unique IATA codes for every airport', () => {
    const codes = new Set<string>();
    for (const ap of INDIAN_AIRPORTS) {
      assert.ok(ap.c && ap.c.length >= 3, `Invalid airport code: ${ap.c}`);
      assert.ok(!codes.has(ap.c), `Duplicate airport code found: ${ap.c}`);
      codes.add(ap.c);
    }
  });

  it('should have valid coordinates within India bounding box (6°N to 38°N, 68°E to 98°E)', () => {
    for (const ap of INDIAN_AIRPORTS) {
      assert.ok(
        ap.lat >= 6 && ap.lat <= 38,
        `Airport ${ap.c} (${ap.city}) latitude out of bounds: ${ap.lat}`
      );
      assert.ok(
        ap.lng >= 68 && ap.lng <= 98,
        `Airport ${ap.c} (${ap.city}) longitude out of bounds: ${ap.lng}`
      );
      assert.ok(ap.n && ap.n.trim().length > 0, `Airport ${ap.c} has empty name`);
      assert.ok(ap.city && ap.city.trim().length > 0, `Airport ${ap.c} has empty city`);
      assert.ok(ap.state && ap.state.trim().length > 0, `Airport ${ap.c} has empty state`);
    }
  });

  it('should cover key regional and tourist gateway airports', () => {
    const keyCodes = [
      'DEL', 'BOM', 'BLR', 'MAA', 'CCU', 'HYD',
      'SXR', 'IXL', 'DHM', 'KUU', 'DED',
      'IXB', 'GAU', 'SHL', 'TEZ',
      'GOI', 'GOX', 'IXZ', 'AGX',
      'JAI', 'UDR', 'JDH', 'JSA', 'BKB',
      'VNS', 'AYJ', 'GWL', 'HJR', 'BHO', 'IDR',
      'CJB', 'IXM', 'COK', 'TRV', 'CNN'
    ];

    for (const code of keyCodes) {
      const found = INDIAN_AIRPORTS.find((a) => a.c === code);
      assert.ok(found, `Expected critical airport ${code} to be present in INDIAN_AIRPORTS`);
    }
  });

  it('searchAirports should correctly filter by IATA code, city, name, or state', () => {
    const byCode = searchAirports('SXR');
    assert.ok(byCode.some((a) => a.c === 'SXR' && a.city.includes('Srinagar')));

    const byCity = searchAirports('Gwalior');
    assert.ok(byCity.some((a) => a.c === 'GWL'));

    const byState = searchAirports('Himachal');
    assert.ok(byState.length >= 2, 'Should find Himachal airports like DHM, KUU, SLV');

    const empty = searchAirports('');
    assert.equal(empty.length, 25, 'Default search should return limit 25');
  });

  it('findNearestAirport should return closest airport by coordinates', () => {
    const { airport: gwlAp, distanceKm: gwlDist } = findNearestAirport(26.2183, 78.1828);
    assert.equal(gwlAp.c, 'GWL');
    assert.ok(gwlDist < 20, `Expected distance < 20km, got ${gwlDist}km`);

    const { airport: delAp, distanceKm: delDist } = findNearestAirport(28.6139, 77.2090);
    assert.equal(delAp.c, 'DEL');
    assert.ok(delDist < 30, `Expected distance < 30km, got ${delDist}km`);

    const { airport: sxrAp } = findNearestAirport(34.0837, 74.7973);
    assert.equal(sxrAp.c, 'SXR');
  });
});

describe('Comprehensive Indian Bus Terminals Dataset', () => {
  it('should have extensive coverage of Indian bus terminals (> 100 terminals)', () => {
    assert.ok(
      INDIAN_BUS_TERMINALS.length >= 100,
      `Expected at least 100 bus terminals, found ${INDIAN_BUS_TERMINALS.length}`
    );
  });

  it('should have unique IDs for every bus terminal', () => {
    const ids = new Set<string>();
    for (const bt of INDIAN_BUS_TERMINALS) {
      assert.ok(bt.id && bt.id.trim().length > 0, `Invalid bus terminal ID: ${bt.id}`);
      assert.ok(!ids.has(bt.id), `Duplicate bus terminal ID found: ${bt.id}`);
      ids.add(bt.id);
    }
  });

  it('should have valid coordinates within India bounding box and non-empty majorRoutes', () => {
    for (const bt of INDIAN_BUS_TERMINALS) {
      assert.ok(
        bt.lat >= 6 && bt.lat <= 38,
        `Terminal ${bt.id} (${bt.city}) latitude out of bounds: ${bt.lat}`
      );
      assert.ok(
        bt.lng >= 68 && bt.lng <= 98,
        `Terminal ${bt.id} (${bt.city}) longitude out of bounds: ${bt.lng}`
      );
      assert.ok(bt.name && bt.name.trim().length > 0, `Terminal ${bt.id} has empty name`);
      assert.ok(bt.city && bt.city.trim().length > 0, `Terminal ${bt.id} has empty city`);
      assert.ok(bt.state && bt.state.trim().length > 0, `Terminal ${bt.id} has empty state`);
      assert.ok(
        Array.isArray(bt.majorRoutes) && bt.majorRoutes.length > 0,
        `Terminal ${bt.id} has empty majorRoutes`
      );
    }
  });

  it('should cover key tourist hubs, hill stations, and pilgrimage bus stands', () => {
    const keyTerminals = [
      'del-kashmere', 'del-anand-vihar',
      'mnl-volvo', 'spiti-kaza', 'dhm-isbt', 'parvati-kasol', 'sml-isbt',
      'rsh-yatra', 'nni-tallital', 'mus-library', 'hdr-gmou', 'cor-ramnagar',
      'sxr-trc', 'leh-new',
      'jai-sindhi-camp', 'jsa-central', 'rnb-swm',
      'gwl-isbt', 'bho-isbt', 'khj-tourist', 'ujn-dewas',
      'mum-borivali', 'shr-sainagar', 'mhb-market', 'aur-central',
      'goa-panaji',
      'blr-majestic', 'hpt-ksrtc', 'gkr-ksrtc', 'cdk-coorg',
      'mnr-ksrtc', 'alp-boatjetty', 'vrk-temple',
      'maa-koyambedu', 'ooty-cbs', 'kod-cbs', 'mdu-mattuthavani',
      'vns-cantt', 'ayd-dham', 'mth-central', 'vrn-chhatikara'
    ];

    for (const termId of keyTerminals) {
      const found = INDIAN_BUS_TERMINALS.find((t) => t.id === termId);
      assert.ok(found, `Expected key terminal ${termId} to be present in INDIAN_BUS_TERMINALS`);
    }
  });

  it('searchBusTerminals should filter by city, terminal name, state, or route', () => {
    const byCity = searchBusTerminals('Manali');
    assert.ok(byCity.some((t) => t.id === 'mnl-volvo'));

    const byRoute = searchBusTerminals('Spiti');
    assert.ok(byRoute.length >= 1, 'Should find bus terminal connecting Spiti');

    const byState = searchBusTerminals('Kerala');
    assert.ok(byState.length >= 4, 'Should find major Kerala terminals');

    const empty = searchBusTerminals('');
    assert.equal(empty.length, 25, 'Default search should return limit 25');
  });

  it('findNearestBusTerminal should return nearest terminal to coordinate', () => {
    // Near Manali (32.2432, 77.1892)
    const { terminal: manaliTerm, distanceKm: manaliDist } = findNearestBusTerminal(32.2432, 77.1892);
    assert.equal(manaliTerm.id, 'mnl-volvo');
    assert.ok(manaliDist < 10, `Expected distance < 10km, got ${manaliDist}km`);

    // Near Ooty (11.4102, 76.6950)
    const { terminal: ootyTerm, distanceKm: ootyDist } = findNearestBusTerminal(11.4102, 76.6950);
    assert.equal(ootyTerm.id, 'ooty-cbs');
    assert.ok(ootyDist < 10, `Expected distance < 10km, got ${ootyDist}km`);

    // Near Varanasi (25.3176, 82.9739)
    const { terminal: vnsTerm } = findNearestBusTerminal(25.3176, 82.9739);
    assert.equal(vnsTerm.id, 'vns-cantt');
  });
});
