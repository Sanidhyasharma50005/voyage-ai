export type BookingPhase =
  | 'FUTURE_NOT_OPEN'       // > 60 days before travel (date locked)
  | 'GENERAL_ARP_ACTIVE'     // Within 60-day window, general quota bookable
  | 'TATKAL_WINDOW_ACTIVE'   // 1 day prior, Tatkal quota open
  | 'CHARTING_PHASE'         // < 4 hours before departure (first chart prepared)
  | 'DEPARTED';              // Train has already departed

export type TrainClassCode = '1A' | '2A' | '3A' | '3E' | 'SL' | 'CC' | 'EC' | '2S';
export type QuotaCode = 'GN' | 'TQ' | 'PT' | 'LD' | 'SS';

export interface TrainBookingTimeline {
  travelDate: string; // YYYY-MM-DD
  classCode: TrainClassCode;
  quotaCode: QuotaCode;
  currentPhase: BookingPhase;
  phaseDescription: string;
  isBookableNow: boolean;

  // Exact dates & times in IST
  generalArpOpensAt: string; // ISO or formatted IST string (e.g. 2026-08-15 08:00:00 IST)
  generalArpDaysBefore: number; // 60 days
  acTatkalOpensAt: string;    // (Departure date - 1 day) at 10:00:00 IST
  nonAcTatkalOpensAt: string; // (Departure date - 1 day) at 11:00:00 IST
  chartPreparationEstimate: string; // ~4 hours prior to origin departure

  // Countdown calculations
  secondsUntilGeneralArp: number; // <= 0 if already opened
  secondsUntilTatkal: number;     // <= 0 if already opened

  // Official Policy Citations
  policyCitations: {
    arpRule: string;
    arpCircularRef: string;
    effectiveDate: string;
    tatkalTimingAc: string;
    tatkalTimingNonAc: string;
    tatkalOriginRule: string;
  };

  // Waitlist priority information
  waitlistRules: {
    quotaName: string;
    priorityRank: number; // 1 = Highest (GNWL)
    description: string;
    cancellationRule: string;
  };
}

export interface RailwayPolicyInfo {
  arpDays: number;
  arpForeignTouristDays: number;
  generalOpeningTimeIST: string;
  acTatkalOpeningTimeIST: string;
  nonAcTatkalOpeningTimeIST: string;
  firstChartWindowHours: number;
  finalChartWindowMinutes: number;
  circularReference: string;
  circularDate: string;
  officialSource: string;
}
