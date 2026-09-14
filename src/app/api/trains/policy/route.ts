import { NextResponse } from 'next/server';
import { OFFICIAL_RAILWAY_POLICY, getNowIST, formatISTString } from '@/lib/railwayPolicyEngine';

export async function GET() {
  const nowIST = getNowIST();
  return NextResponse.json({
    currentTimeIST: formatISTString(nowIST),
    policy: OFFICIAL_RAILWAY_POLICY,
    rules: [
      {
        title: '60-Day Advance Reservation Period (ARP)',
        summary: 'Effective November 1, 2024, general train reservations open 60 days before travel (excluding journey date) at 08:00 AM IST.',
        citation: OFFICIAL_RAILWAY_POLICY.circularReference,
        effectiveDate: OFFICIAL_RAILWAY_POLICY.circularDate,
      },
      {
        title: 'AC Tatkal Window (10:00 AM IST)',
        summary: 'Reservations for 1A, 2A, 3A, 3E, CC, and EC open at 10:00 AM IST exactly 1 day prior to origin departure date.',
        citation: 'IRCTC / Indian Railways Tatkal Scheme Rules',
      },
      {
        title: 'Non-AC Tatkal Window (11:00 AM IST)',
        summary: 'Reservations for Sleeper (SL) and Second Sitting (2S) open at 11:00 AM IST exactly 1 day prior to origin departure date.',
        citation: 'IRCTC / Indian Railways Tatkal Scheme Rules',
      },
      {
        title: 'Waitlist Clearance Priority',
        summary: 'GNWL (General Waitlist) has highest priority, followed by RLWL (Remote Location), PQWL (Pooled Quota), and TQWL (Tatkal Waitlist).',
        citation: 'Indian Railways Commercial Code Volume II',
      },
    ],
  });
}
