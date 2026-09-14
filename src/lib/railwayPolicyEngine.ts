import {
  BookingPhase,
  TrainBookingTimeline,
  TrainClassCode,
  QuotaCode,
  RailwayPolicyInfo,
} from '@/types/trainAdvisor';

export const OFFICIAL_RAILWAY_POLICY: RailwayPolicyInfo = {
  arpDays: 60, // Revised from 120 days w.e.f. 01.11.2024
  arpForeignTouristDays: 365,
  generalOpeningTimeIST: '08:00:00',
  acTatkalOpeningTimeIST: '10:00:00',
  nonAcTatkalOpeningTimeIST: '11:00:00',
  firstChartWindowHours: 4,
  finalChartWindowMinutes: 30,
  circularReference: 'Ministry of Railways (Railway Board) Notification, Effective Nov 1, 2024 (60-Day ARP)',
  circularDate: 'Effective November 1, 2024',
  officialSource: 'Ministry of Railways, Government of India & IRCTC Official Regulations',
};

// Helper: Convert UTC date to IST date object (+5:30)
export function getNowIST(): Date {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + 3600000 * 5.5);
}

// Parse YYYY-MM-DD travel date into an IST Date at 00:00:00
export function parseTravelDateIST(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  // Months are 0-indexed in JS
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0) - 3600000 * 5.5);
}

// Format IST Date to readable string
export function formatISTString(date: Date): string {
  return date.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short',
  }) + ' IST';
}

export function isAcClass(classCode: TrainClassCode): boolean {
  return ['1A', '2A', '3A', '3E', 'CC', 'EC'].includes(classCode);
}

export function computeBookingTimeline(
  travelDateStr: string,
  classCode: TrainClassCode = '3A',
  quotaCode: QuotaCode = 'GN',
  originDepartureTime: string = '16:00' // Default departure 4:00 PM if train schedule omitted
): TrainBookingTimeline {
  const nowIST = getNowIST();
  const [depYear, depMonth, depDay] = travelDateStr.split('-').map(Number);
  const [depHour, depMinute] = originDepartureTime.split(':').map(Number);

  // Exact departure in IST
  // Travel date is day 0
  const departureDateIST = new Date(Date.UTC(depYear, depMonth - 1, depDay, depHour, depMinute, 0) - 3600000 * 5.5);

  // 1. General ARP opens: Exactly 60 days before travel date at 08:00:00 IST
  // In Indian Railways, the journey date is excluded.
  const generalArpDate = new Date(Date.UTC(depYear, depMonth - 1, depDay - OFFICIAL_RAILWAY_POLICY.arpDays, 8, 0, 0) - 3600000 * 5.5);

  // 2. Tatkal opens: Exactly 1 day prior to departure from origin station
  // AC classes open at 10:00:00 IST; Non-AC at 11:00:00 IST
  const isAc = isAcClass(classCode);
  const tatkalHour = isAc ? 10 : 11;
  const tatkalDate = new Date(Date.UTC(depYear, depMonth - 1, depDay - 1, tatkalHour, 0, 0) - 3600000 * 5.5);

  const acTatkalDate = new Date(Date.UTC(depYear, depMonth - 1, depDay - 1, 10, 0, 0) - 3600000 * 5.5);
  const nonAcTatkalDate = new Date(Date.UTC(depYear, depMonth - 1, depDay - 1, 11, 0, 0) - 3600000 * 5.5);

  // 3. First Chart: ~4 hours prior to origin departure
  const chartDate = new Date(departureDateIST.getTime() - OFFICIAL_RAILWAY_POLICY.firstChartWindowHours * 3600000);

  // Countdown seconds
  const secondsUntilGeneralArp = Math.floor((generalArpDate.getTime() - nowIST.getTime()) / 1000);
  const secondsUntilTatkal = Math.floor((tatkalDate.getTime() - nowIST.getTime()) / 1000);
  const secondsUntilChart = Math.floor((chartDate.getTime() - nowIST.getTime()) / 1000);
  const secondsUntilDeparture = Math.floor((departureDateIST.getTime() - nowIST.getTime()) / 1000);

  // Determine current booking phase
  let currentPhase: BookingPhase = 'GENERAL_ARP_ACTIVE';
  let phaseDescription = '';
  let isBookableNow = false;

  if (secondsUntilDeparture <= 0) {
    currentPhase = 'DEPARTED';
    phaseDescription = 'This train has already completed its journey.';
    isBookableNow = false;
  } else if (secondsUntilChart <= 0) {
    currentPhase = 'CHARTING_PHASE';
    phaseDescription = 'First reservation chart prepared. Current booking open for vacant berths at station counters/IRCTC.';
    isBookableNow = true;
  } else if (secondsUntilTatkal <= 0 && quotaCode === 'TQ') {
    currentPhase = 'TATKAL_WINDOW_ACTIVE';
    phaseDescription = `Tatkal booking window is currently ACTIVE (Opened at ${isAc ? '10:00 AM' : '11:00 AM'} IST).`;
    isBookableNow = true;
  } else if (secondsUntilGeneralArp > 0) {
    currentPhase = 'FUTURE_NOT_OPEN';
    phaseDescription = `Bookings have NOT opened yet. Under the 60-day ARP rule, this date unlocks on ${formatISTString(generalArpDate)}.`;
    isBookableNow = false;
  } else {
    currentPhase = 'GENERAL_ARP_ACTIVE';
    phaseDescription = `General quota is ACTIVE. You are currently within the 60-day reservation window.`;
    isBookableNow = true;
  }

  // Official Waitlist Priority Hierarchy
  const waitlistRules = getWaitlistRules(quotaCode);

  return {
    travelDate: travelDateStr,
    classCode,
    quotaCode,
    currentPhase,
    phaseDescription,
    isBookableNow,
    generalArpOpensAt: formatISTString(generalArpDate),
    generalArpDaysBefore: OFFICIAL_RAILWAY_POLICY.arpDays,
    acTatkalOpensAt: formatISTString(acTatkalDate),
    nonAcTatkalOpensAt: formatISTString(nonAcTatkalDate),
    chartPreparationEstimate: formatISTString(chartDate),
    secondsUntilGeneralArp,
    secondsUntilTatkal,
    policyCitations: {
      arpRule: `Advance Reservation Period is 60 days (excluding date of journey) at 08:00 AM IST.`,
      arpCircularRef: OFFICIAL_RAILWAY_POLICY.circularReference,
      effectiveDate: OFFICIAL_RAILWAY_POLICY.circularDate,
      tatkalTimingAc: `AC Classes (1A, 2A, 3A, 3E, CC, EC) open at 10:00 AM IST exactly 1 day prior to origin departure.`,
      tatkalTimingNonAc: `Non-AC Classes (SL, 2S) open at 11:00 AM IST exactly 1 day prior to origin departure.`,
      tatkalOriginRule: `Tatkal window is locked to the train's departure date from its ORIGINATING station, not boarding station.`,
    },
    waitlistRules,
  };
}

// Official IRCTC Waitlist mechanics
export function getWaitlistRules(quotaCode: QuotaCode) {
  switch (quotaCode) {
    case 'GN':
      return {
        quotaName: 'GNWL (General Waitlist)',
        priorityRank: 1,
        description:
          'Highest clearance priority in Indian Railways. Berths are confirmed as cancellations occur from the origin-to-destination quota.',
        cancellationRule:
          'Full refund minus clerkage fee (₹60) if cancelled before chart preparation, or auto-refunded if remains WL on final chart.',
      };
    case 'TQ':
      return {
        quotaName: 'TQWL (Tatkal Waitlist)',
        priorityRank: 4,
        description:
          'Direct waitlist under Tatkal quota. Does NOT convert to RAC; seats only confirm if Tatkal confirmed tickets are cancelled.',
        cancellationRule:
          'Zero refund if confirmed Tatkal ticket is cancelled. Full refund minus clerkage if ticket remains waitlisted after final charting.',
      };
    case 'PT':
      return {
        quotaName: 'PT (Premium Tatkal Quota)',
        priorityRank: 0,
        description:
          'Dynamic fare quota. No waitlist exists in Premium Tatkal; tickets are either immediately confirmed or unavailable.',
        cancellationRule: 'Strictly zero refund on cancellation of Premium Tatkal tickets.',
      };
    default:
      return {
        quotaName: 'RLWL / PQWL (Remote / Pooled Quota)',
        priorityRank: 3,
        description:
          'Lower clearance priority than GNWL. Handled from isolated station quotas; rarely clears if train is full from origin.',
        cancellationRule: 'Standard Indian Railways refund rules apply.',
      };
  }
}
