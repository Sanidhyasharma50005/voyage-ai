// src/data/railwayFareSlabs.ts
/**
 * Versioned Indian Railways Passenger Tariff Structure
 * Reference: Ministry of Railways Passenger Fare Table (Circular TC-II/2910/2020/Fare)
 * All values are used strictly for transparent fare estimation with clear disclaimers.
 */

export const FARE_SLAB_VERSION = 'IR-TARIFF-2024-V2';

export interface ClassTariff {
  classCode: string;
  className: string;
  minDistanceKm: number;
  minBaseFare: number;
  baseRatePerKm: number; // Telescopic base slope
  reservationFee: number;
  superfastSurcharge: number;
  gstPercent: number; // 5% for AC classes, 0% for non-AC
}

export const OFFICIAL_CLASS_TARIFFS: Record<string, ClassTariff> = {
  SL: {
    classCode: 'SL',
    className: 'Sleeper Class',
    minDistanceKm: 200,
    minBaseFare: 140,
    baseRatePerKm: 0.44,
    reservationFee: 20,
    superfastSurcharge: 30,
    gstPercent: 0,
  },
  '3E': {
    classCode: '3E',
    className: 'AC 3 Economy',
    minDistanceKm: 300,
    minBaseFare: 440,
    baseRatePerKm: 1.05,
    reservationFee: 40,
    superfastSurcharge: 45,
    gstPercent: 5,
  },
  '3A': {
    classCode: '3A',
    className: 'AC 3 Tier',
    minDistanceKm: 300,
    minBaseFare: 490,
    baseRatePerKm: 1.15,
    reservationFee: 40,
    superfastSurcharge: 45,
    gstPercent: 5,
  },
  '2A': {
    classCode: '2A',
    className: 'AC 2 Tier',
    minDistanceKm: 300,
    minBaseFare: 720,
    baseRatePerKm: 1.68,
    reservationFee: 50,
    superfastSurcharge: 45,
    gstPercent: 5,
  },
  '1A': {
    classCode: '1A',
    className: 'AC First Class',
    minDistanceKm: 300,
    minBaseFare: 1200,
    baseRatePerKm: 2.85,
    reservationFee: 60,
    superfastSurcharge: 75,
    gstPercent: 5,
  },
  CC: {
    classCode: 'CC',
    className: 'AC Chair Car',
    minDistanceKm: 150,
    minBaseFare: 260,
    baseRatePerKm: 0.98,
    reservationFee: 40,
    superfastSurcharge: 45,
    gstPercent: 5,
  },
  EC: {
    classCode: 'EC',
    className: 'Exec. Chair Car',
    minDistanceKm: 150,
    minBaseFare: 650,
    baseRatePerKm: 2.15,
    reservationFee: 60,
    superfastSurcharge: 75,
    gstPercent: 5,
  },
  '2S': {
    classCode: '2S',
    className: 'Second Sitting',
    minDistanceKm: 50,
    minBaseFare: 45,
    baseRatePerKm: 0.22,
    reservationFee: 15,
    superfastSurcharge: 15,
    gstPercent: 0,
  },
};
