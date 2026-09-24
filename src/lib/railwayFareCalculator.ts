// src/lib/railwayFareCalculator.ts
/**
 * Distance-based Official Indian Railways Passenger Fare Estimator
 * Computes telescopic base fare, reservation charge, superfast surcharge, and GST.
 * Strictly labeled as an estimate; never represented as live IRCTC dynamic pricing.
 */

import {
  OFFICIAL_CLASS_TARIFFS,
  FARE_SLAB_VERSION,
} from '../data/railwayFareSlabs.ts';
import type { ClassTariff } from '../data/railwayFareSlabs.ts';

export interface EstimatedFareResult {
  classCode: string;
  className: string;
  baseFare: number;
  reservationFee: number;
  superfastSurcharge: number;
  gstAmount: number;
  totalEstimatedFare: number;
  distanceKm: number;
  slabVersion: string;
  disclaimer: string;
}

/**
 * Calculates estimated passenger fare for a given distance and class.
 *
 * @param classCode Travel class (SL, 3A, 2A, 1A, 3E, CC, EC, 2S)
 * @param distanceKm Actual railway track distance in km between boarding and alighting stops
 * @param isSuperfast Whether the train is classified as Superfast/Mail (applies superfast charge)
 */
export function calculateEstimatedFare(
  classCode: string,
  distanceKm: number,
  isSuperfast: boolean = true
): EstimatedFareResult {
  const tariff: ClassTariff = OFFICIAL_CLASS_TARIFFS[classCode] || OFFICIAL_CLASS_TARIFFS['SL'];
  const dist = Math.max(10, distanceKm);

  // Telescopic scaling: slightly tapering rate for long distances > 600 km and > 1200 km
  let effectiveRate = tariff.baseRatePerKm;
  if (dist > 1200) {
    effectiveRate *= 0.88;
  } else if (dist > 600) {
    effectiveRate *= 0.94;
  }

  const rawBase = Math.round(dist * effectiveRate);
  const baseFare = Math.max(tariff.minBaseFare, rawBase);

  const reservationFee = tariff.reservationFee;
  // Superfast surcharge applies above minimum distance
  const superfastSurcharge = isSuperfast && dist >= 100 ? tariff.superfastSurcharge : 0;

  const subtotal = baseFare + reservationFee + superfastSurcharge;
  const gstAmount = tariff.gstPercent > 0 ? Math.round((subtotal * tariff.gstPercent) / 100) : 0;

  // Indian Railways rounds total ticket fares to nearest multiple of 5
  const rawTotal = subtotal + gstAmount;
  const totalEstimatedFare = Math.ceil(rawTotal / 5) * 5;

  return {
    classCode: tariff.classCode,
    className: tariff.className,
    baseFare,
    reservationFee,
    superfastSurcharge,
    gstAmount,
    totalEstimatedFare,
    distanceKm: dist,
    slabVersion: FARE_SLAB_VERSION,
    disclaimer: 'Estimated fare based on standard distance slabs; excludes Tatkal / dynamic fare surcharges.',
  };
}
