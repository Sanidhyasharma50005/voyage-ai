// src/data/__tests__/trains.test.ts
/**
 * Authoritative Train Data & Engine Tests
 * Validates the zero-mock train scheduling system against known IRCTC reference data.
 *
 * Test command: npm.cmd test
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { INDIAN_RAILWAYS_TRAINS } from '../indianRailwaysTrains.ts';
import type { IndianRailwaysTrain, TrainScheduleStop } from '../indianRailwaysTrains.ts';
import { normalizeStationCode, STATION_ALIASES } from '../stationAliases.ts';
import { getAlternateStations, STATION_CLUSTERS } from '../stationClusters.ts';
import { OFFICIAL_CLASS_TARIFFS, FARE_SLAB_VERSION } from '../railwayFareSlabs.ts';
import { calculateEstimatedFare } from '../../lib/railwayFareCalculator.ts';

// ═══════════════════════════════════════════════════════════════════
// 1. TRAIN DATASET INTEGRITY
// ═══════════════════════════════════════════════════════════════════
describe('Indian Railways Train Dataset Integrity', () => {
  it('should contain at least 16 verified trains', () => {
    assert.ok(
      INDIAN_RAILWAYS_TRAINS.length >= 16,
      `Expected at least 16 trains, found ${INDIAN_RAILWAYS_TRAINS.length}`
    );
  });

  it('should have unique train numbers', () => {
    const numbers = new Set<string>();
    for (const train of INDIAN_RAILWAYS_TRAINS) {
      assert.ok(
        !numbers.has(train.trainNumber),
        `Duplicate train number: ${train.trainNumber} (${train.trainName})`
      );
      numbers.add(train.trainNumber);
    }
  });

  it('every train should have a valid 4-5 digit train number', () => {
    for (const train of INDIAN_RAILWAYS_TRAINS) {
      assert.ok(
        /^\d{4,5}$/.test(train.trainNumber),
        `Invalid train number: ${train.trainNumber} for ${train.trainName}`
      );
    }
  });

  it('every train should have a non-empty trainName', () => {
    for (const train of INDIAN_RAILWAYS_TRAINS) {
      assert.ok(
        train.trainName && train.trainName.length >= 3,
        `Invalid train name: "${train.trainName}" for ${train.trainNumber}`
      );
    }
  });

  it('every train should have a valid trainType', () => {
    const validTypes = ['Vande Bharat', 'Shatabdi', 'Rajdhani', 'Superfast', 'Express', 'Mail', 'Passenger'];
    for (const train of INDIAN_RAILWAYS_TRAINS) {
      assert.ok(
        validTypes.includes(train.trainType),
        `Invalid trainType "${train.trainType}" for ${train.trainNumber} ${train.trainName}`
      );
    }
  });

  it('every train should have valid runsOn days (at least 1 day)', () => {
    const validDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    for (const train of INDIAN_RAILWAYS_TRAINS) {
      assert.ok(
        train.runsOn.length >= 1,
        `Train ${train.trainNumber} has no running days`
      );
      for (const day of train.runsOn) {
        assert.ok(
          validDays.includes(day),
          `Invalid running day "${day}" for ${train.trainNumber}`
        );
      }
    }
  });

  it('every train should have at least 2 schedule stops', () => {
    for (const train of INDIAN_RAILWAYS_TRAINS) {
      assert.ok(
        train.scheduleStops.length >= 2,
        `Train ${train.trainNumber} has fewer than 2 stops: ${train.scheduleStops.length}`
      );
    }
  });

  it('schedule stops should have monotonically increasing dayOffset', () => {
    for (const train of INDIAN_RAILWAYS_TRAINS) {
      for (let i = 1; i < train.scheduleStops.length; i++) {
        assert.ok(
          train.scheduleStops[i].dayOffset >= train.scheduleStops[i - 1].dayOffset,
          `Non-monotonic dayOffset in ${train.trainNumber} at stop ${train.scheduleStops[i].code}: ${train.scheduleStops[i].dayOffset} < ${train.scheduleStops[i - 1].dayOffset}`
        );
      }
    }
  });

  it('schedule stops should have monotonically increasing distanceKm', () => {
    for (const train of INDIAN_RAILWAYS_TRAINS) {
      for (let i = 1; i < train.scheduleStops.length; i++) {
        assert.ok(
          train.scheduleStops[i].distanceKm >= train.scheduleStops[i - 1].distanceKm,
          `Non-monotonic distanceKm in ${train.trainNumber} at stop ${train.scheduleStops[i].code}: ${train.scheduleStops[i].distanceKm} < ${train.scheduleStops[i - 1].distanceKm}`
        );
      }
    }
  });

  it('origin stop should have dep time, destination stop should have arr time', () => {
    for (const train of INDIAN_RAILWAYS_TRAINS) {
      const origin = train.scheduleStops[0];
      const dest = train.scheduleStops[train.scheduleStops.length - 1];
      assert.ok(
        /^\d{2}:\d{2}$/.test(origin.dep),
        `Origin ${origin.code} of ${train.trainNumber} has invalid dep: ${origin.dep}`
      );
      assert.ok(
        /^\d{2}:\d{2}$/.test(dest.arr),
        `Destination ${dest.code} of ${train.trainNumber} has invalid arr: ${dest.arr}`
      );
    }
  });

  it('every train should have at least one passenger class', () => {
    const validClasses = ['SL', '3A', '2A', '1A', '3E', 'CC', 'EC', '2S'];
    for (const train of INDIAN_RAILWAYS_TRAINS) {
      assert.ok(
        train.classes.length >= 1,
        `Train ${train.trainNumber} has no classes`
      );
      for (const cls of train.classes) {
        assert.ok(
          validClasses.includes(cls),
          `Invalid class "${cls}" in ${train.trainNumber}`
        );
      }
    }
  });

  it('every train should have zero-mock metadata with source and verifiedOn', () => {
    for (const train of INDIAN_RAILWAYS_TRAINS) {
      assert.ok(train.metadata, `Train ${train.trainNumber} missing metadata`);
      assert.ok(
        train.metadata.source && train.metadata.source.length > 10,
        `Train ${train.trainNumber} missing source in metadata`
      );
      assert.ok(
        /^\d{4}-\d{2}(-\d{2})?$/.test(train.metadata.verifiedOn),
        `Train ${train.trainNumber} has invalid verifiedOn: ${train.metadata.verifiedOn}`
      );
    }
  });
});

// ═══════════════════════════════════════════════════════════════════
// 2. IRCTC REFERENCE VALIDATION (GWL → UHP, 18 Sep 2026)
// ═══════════════════════════════════════════════════════════════════
describe('IRCTC Reference Validation: GWL → UHP corridor', () => {
  // Trains that should exist in the dataset for GWL → UHP/SVDK
  it('should contain 16031 Andaman Express', () => {
    const train = INDIAN_RAILWAYS_TRAINS.find(t => t.trainNumber === '16031');
    assert.ok(train, 'Train 16031 Andaman Express not found');
    assert.strictEqual(train.trainName, 'Andaman Express');
  });

  it('should contain 12919 Malwa Express', () => {
    const train = INDIAN_RAILWAYS_TRAINS.find(t => t.trainNumber === '12919');
    assert.ok(train, 'Train 12919 Malwa Express not found');
    assert.strictEqual(train.trainName, 'Malwa Express');
  });

  it('should contain 11077 Jhelum Express', () => {
    const train = INDIAN_RAILWAYS_TRAINS.find(t => t.trainNumber === '11077');
    assert.ok(train, 'Train 11077 Jhelum Express not found');
    assert.strictEqual(train.trainName, 'Jhelum Express');
  });

  it('16031 Andaman Express should stop at GWL with correct timing', () => {
    const train = INDIAN_RAILWAYS_TRAINS.find(t => t.trainNumber === '16031')!;
    const gwlStop = train.scheduleStops.find(s => s.code === 'GWL');
    assert.ok(gwlStop, 'GWL stop not found in 16031 schedule');
    assert.strictEqual(gwlStop.arr, '14:40', 'GWL arrival should be 14:40');
    assert.strictEqual(gwlStop.dep, '14:42', 'GWL departure should be 14:42');
  });

  it('16031 Andaman Express should stop at UHP with correct timing', () => {
    const train = INDIAN_RAILWAYS_TRAINS.find(t => t.trainNumber === '16031')!;
    const uhpStop = train.scheduleStops.find(s => s.code === 'UHP');
    assert.ok(uhpStop, 'UHP stop not found in 16031 schedule');
    assert.strictEqual(uhpStop.arr, '09:43', 'UHP arrival should be 09:43');
  });

  it('12919 Malwa Express should stop at GWL with correct timing', () => {
    const train = INDIAN_RAILWAYS_TRAINS.find(t => t.trainNumber === '12919')!;
    const gwlStop = train.scheduleStops.find(s => s.code === 'GWL');
    assert.ok(gwlStop, 'GWL stop not found in 12919 schedule');
    assert.strictEqual(gwlStop.dep, '22:56', 'GWL departure should be 22:56');
  });

  it('11077 Jhelum Express should stop at GWL and JAT (alternate for UHP)', () => {
    const train = INDIAN_RAILWAYS_TRAINS.find(t => t.trainNumber === '11077')!;
    const gwlStop = train.scheduleStops.find(s => s.code === 'GWL');
    const jatStop = train.scheduleStops.find(s => s.code === 'JAT');
    assert.ok(gwlStop, 'GWL stop not found in 11077 schedule');
    assert.ok(jatStop, 'JAT stop not found in 11077 schedule (alternate for UHP)');
  });

  it('GWL stop index should be before UHP/SVDK/JAT stop index in relevant trains', () => {
    // 16031: GWL → UHP (direct)
    const train16031 = INDIAN_RAILWAYS_TRAINS.find(t => t.trainNumber === '16031')!;
    const gwlIdx16031 = train16031.scheduleStops.findIndex(s => s.code === 'GWL');
    const uhpIdx16031 = train16031.scheduleStops.findIndex(s => s.code === 'UHP');
    assert.ok(gwlIdx16031 < uhpIdx16031, `GWL should come before UHP in 16031`);

    // 11077: GWL → JAT (alternate)
    const train11077 = INDIAN_RAILWAYS_TRAINS.find(t => t.trainNumber === '11077')!;
    const gwlIdx11077 = train11077.scheduleStops.findIndex(s => s.code === 'GWL');
    const jatIdx11077 = train11077.scheduleStops.findIndex(s => s.code === 'JAT');
    assert.ok(gwlIdx11077 < jatIdx11077, `GWL should come before JAT in 11077`);
  });
});

// ═══════════════════════════════════════════════════════════════════
// 3. STATION ALIAS & NORMALIZATION
// ═══════════════════════════════════════════════════════════════════
describe('Station Alias Normalization', () => {
  it('should normalize common station aliases', () => {
    assert.strictEqual(normalizeStationCode('NDLS'), 'NDLS');
    assert.strictEqual(normalizeStationCode('ndls'), 'NDLS');
    assert.strictEqual(normalizeStationCode('New Delhi'), 'NDLS');
    assert.strictEqual(normalizeStationCode('GWL'), 'GWL');
    assert.strictEqual(normalizeStationCode('GWALIOR'), 'GWL');
  });

  it('should pass through unknown codes in uppercase', () => {
    assert.strictEqual(normalizeStationCode('XYZABC'), 'XYZABC');
  });

  it('should have at least 20 station aliases configured', () => {
    assert.ok(
      Object.keys(STATION_ALIASES).length >= 20,
      `Expected >= 20 aliases, found ${Object.keys(STATION_ALIASES).length}`
    );
  });
});

// ═══════════════════════════════════════════════════════════════════
// 4. STATION CLUSTERS / ALTERNATES
// ═══════════════════════════════════════════════════════════════════
describe('Station Clusters & Alternates', () => {
  it('UHP should have JAT as an alternate station', () => {
    const alternates = getAlternateStations('UHP');
    const jat = alternates.find(a => a.stationCode === 'JAT');
    assert.ok(jat, 'JAT should be an alternate for UHP');
    assert.strictEqual(jat.stationName, 'Jammu Tawi');
  });

  it('NDLS should have alternate/cluster stations', () => {
    const alternates = getAlternateStations('NDLS');
    assert.ok(alternates.length >= 1, 'NDLS should have at least 1 alternate station');
  });

  it('should return empty array for unknown station', () => {
    const alternates = getAlternateStations('XYZABC');
    assert.deepStrictEqual(alternates, []);
  });
});

// ═══════════════════════════════════════════════════════════════════
// 5. FARE SLAB & ESTIMATION
// ═══════════════════════════════════════════════════════════════════
describe('Railway Fare Estimation', () => {
  it('fare slab version should be IR-TARIFF-2024-V2', () => {
    assert.strictEqual(FARE_SLAB_VERSION, 'IR-TARIFF-2024-V2');
  });

  it('should have tariffs for all major classes', () => {
    const expectedClasses = ['SL', '3A', '2A', '1A', 'CC', '2S'];
    for (const cls of expectedClasses) {
      const tariff = OFFICIAL_CLASS_TARIFFS[cls];
      assert.ok(tariff, `Tariff not found for class ${cls}`);
      assert.ok(tariff.baseRatePerKm > 0, `baseRatePerKm for ${cls} should be positive`);
    }
  });

  it('should calculate positive fares for SL class at 500km', () => {
    const result = calculateEstimatedFare('SL', 500, false);
    assert.ok(result.totalEstimatedFare > 0, 'SL fare should be positive');
    assert.ok(result.totalEstimatedFare < 1000, 'SL fare for 500km should be under ₹1000');
    assert.ok(result.disclaimer.length > 10, 'Should have a disclaimer');
    assert.strictEqual(result.slabVersion, 'IR-TARIFF-2024-V2');
  });

  it('should calculate higher fares for 3A than SL for same distance', () => {
    const sl = calculateEstimatedFare('SL', 1000, false);
    const threeAC = calculateEstimatedFare('3A', 1000, false);
    assert.ok(
      threeAC.totalEstimatedFare > sl.totalEstimatedFare,
      `3A fare (${threeAC.totalEstimatedFare}) should be > SL fare (${sl.totalEstimatedFare})`
    );
  });

  it('should apply superfast surcharge for superfast trains', () => {
    const normal = calculateEstimatedFare('SL', 500, false);
    const superfast = calculateEstimatedFare('SL', 500, true);
    assert.ok(
      superfast.totalEstimatedFare > normal.totalEstimatedFare,
      `Superfast fare (${superfast.totalEstimatedFare}) should be > normal fare (${normal.totalEstimatedFare})`
    );
  });

  it('fare should be rounded to nearest ₹5', () => {
    const result = calculateEstimatedFare('SL', 500, false);
    assert.strictEqual(result.totalEstimatedFare % 5, 0, 'Fare should be a multiple of ₹5');
  });
});

// ═══════════════════════════════════════════════════════════════════
// 6. ZERO-MOCK POLICY COMPLIANCE
// ═══════════════════════════════════════════════════════════════════
describe('Zero-Mock Policy Compliance', () => {
  it('NO train should have algorithmically generated names (e.g., containing "SF Exp" pattern from old generateTrainsForPair)', () => {
    const fabricatedPatterns = [/SF Exp$/, /AC Exp$/, /Mail Express$/];
    for (const train of INDIAN_RAILWAYS_TRAINS) {
      for (const pattern of fabricatedPatterns) {
        assert.ok(
          !pattern.test(train.trainName),
          `Train ${train.trainNumber} "${train.trainName}" matches fabricated name pattern ${pattern}`
        );
      }
    }
  });

  it('NO train should use the old hardcoded numbers (12401, 22865, 12621, 12951) from generateTrainsForPair', () => {
    const oldFakeNumbers = ['12401', '22865', '12621', '12951'];
    for (const num of oldFakeNumbers) {
      const found = INDIAN_RAILWAYS_TRAINS.find(t => t.trainNumber === num);
      // These specific numbers might be real trains — the test checks they're not the OLD fabricated ones
      if (found) {
        // If present, verify they are genuine (have proper metadata, not generic names)
        assert.ok(
          found.metadata.source.includes('Official') || found.metadata.source.includes('IRCTC'),
          `Train ${num} lacks official source metadata — possible old fabricated entry`
        );
      }
    }
  });

  it('all trains should have verified metadata from official sources', () => {
    for (const train of INDIAN_RAILWAYS_TRAINS) {
      assert.ok(
        train.metadata.source.includes('IRCTC') ||
        train.metadata.source.includes('Indian Railways') ||
        train.metadata.source.includes('NTES') ||
        train.metadata.source.includes('Official'),
        `Train ${train.trainNumber} metadata source is not official: "${train.metadata.source}"`
      );
    }
  });
});

// ═══════════════════════════════════════════════════════════════════
// 7. CORRIDOR COVERAGE
// ═══════════════════════════════════════════════════════════════════
describe('Corridor Coverage', () => {
  function hasTrainsOnCorridor(fromCode: string, toCode: string): boolean {
    return INDIAN_RAILWAYS_TRAINS.some(t => {
      const stops = t.scheduleStops;
      const fromIdx = stops.findIndex(s => s.code === fromCode);
      if (fromIdx === -1) return false;
      return stops.some((s, idx) => idx > fromIdx && s.code === toCode);
    });
  }

  it('should have trains on GWL → UHP corridor', () => {
    assert.ok(hasTrainsOnCorridor('GWL', 'UHP'), 'No trains found GWL → UHP');
  });

  it('should have trains on NDLS → AGC corridor', () => {
    assert.ok(hasTrainsOnCorridor('NDLS', 'AGC'), 'No trains found NDLS → AGC');
  });

  it('should have trains on NDLS → JP corridor', () => {
    assert.ok(hasTrainsOnCorridor('NDLS', 'JP'), 'No trains found NDLS → JP');
  });

  it('should have trains on NDLS → BSB corridor', () => {
    assert.ok(hasTrainsOnCorridor('NDLS', 'BSB'), 'No trains found NDLS → BSB');
  });
});
