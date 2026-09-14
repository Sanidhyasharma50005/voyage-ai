import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ALL_DESTINATIONS, POPULAR_DESTINATIONS } from '../destinations.ts';

const INDIA_28_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

const INDIA_8_UNION_TERRITORIES = [
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry'
];

describe('Destinations Dataset - Scale and Coverage', () => {
  it('should have at least 160 destinations (expanded whole India)', () => {
    assert.ok(
      ALL_DESTINATIONS.length >= 160,
      `Expected >= 160 destinations, found ${ALL_DESTINATIONS.length}`
    );
  });

  it('should have unique IDs for all destinations without collisions', () => {
    const idSet = new Set<string>();
    const duplicates: string[] = [];

    for (const d of ALL_DESTINATIONS) {
      if (idSet.has(d.id)) {
        duplicates.push(d.id);
      }
      idSet.add(d.id);
    }

    assert.equal(
      duplicates.length,
      0,
      `Found duplicate destination IDs: ${duplicates.join(', ')}`
    );
  });

  it('should cover all 28 Indian States deterministically', () => {
    const representedStates = new Set(
      ALL_DESTINATIONS
        .filter((d) => d.country === 'India' && !d.isUnionTerritory)
        .map((d) => d.state)
    );

    const missingStates = INDIA_28_STATES.filter((s) => !representedStates.has(s));
    assert.equal(
      missingStates.length,
      0,
      `Missing states from 28 states list: ${missingStates.join(', ')}`
    );
  });

  it('should cover all 8 Indian Union Territories deterministically', () => {
    const representedUTs = new Set(
      ALL_DESTINATIONS
        .filter((d) => d.isUnionTerritory)
        .map((d) => d.state)
    );

    const missingUTs = INDIA_8_UNION_TERRITORIES.filter((u) => !representedUTs.has(u));
    assert.equal(
      missingUTs.length,
      0,
      `Missing Union Territories from 8 UTs list: ${missingUTs.join(', ')}`
    );
  });
});

describe('Destinations Dataset - Integrity & Schema Validation', () => {
  it('should have valid realistic latitude and longitude coordinates', () => {
    for (const d of ALL_DESTINATIONS) {
      assert.ok(
        typeof d.latitude === 'number' && !isNaN(d.latitude),
        `${d.id} has invalid latitude`
      );
      assert.ok(
        typeof d.longitude === 'number' && !isNaN(d.longitude),
        `${d.id} has invalid longitude`
      );

      // India coordinates boundary sanity check: Lat ~6 to 38, Long ~68 to 98
      if (d.country === 'India') {
        assert.ok(
          d.latitude >= 6 && d.latitude <= 38,
          `${d.id} latitude ${d.latitude} out of realistic India range`
        );
        assert.ok(
          d.longitude >= 68 && d.longitude <= 98,
          `${d.id} longitude ${d.longitude} out of realistic India range`
        );
      }
    }
  });

  it('should have required arrays: aliases, keywords, attractions, hostels', () => {
    for (const d of ALL_DESTINATIONS) {
      assert.ok(Array.isArray(d.aliases), `${d.id} missing aliases array`);
      assert.ok(Array.isArray(d.keywords), `${d.id} missing keywords array`);
      assert.ok(Array.isArray(d.attractions || d.viewpoints), `${d.id} missing attractions`);
      assert.ok(Array.isArray(d.hostels), `${d.id} missing hostels array`);
      assert.ok(d.hostels.length >= 1, `${d.id} should have at least 1 hostel`);
      assert.ok(d.startingPrice > 0, `${d.id} startingPrice must be > 0`);
      assert.ok(d.dailyCostBudget > 0, `${d.id} dailyCostBudget must be > 0`);
    }
  });

  it('should have destination grouping for island and regional clusters', () => {
    const andamanPlaces = ALL_DESTINATIONS.filter((d) => d.destinationGroup === 'Andaman');
    assert.ok(andamanPlaces.length >= 3, 'Andaman group should contain at least 3 islands');

    const lakshadweepPlaces = ALL_DESTINATIONS.filter((d) => d.destinationGroup === 'Lakshadweep');
    assert.ok(lakshadweepPlaces.length >= 2, 'Lakshadweep group should contain at least 2 islands');
  });
});
