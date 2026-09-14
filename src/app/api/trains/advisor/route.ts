import { NextRequest, NextResponse } from 'next/server';
import {
  computeBookingTimeline,
  getNowIST,
  formatISTString,
} from '@/lib/railwayPolicyEngine';
import { TrainClassCode, QuotaCode } from '@/types/trainAdvisor';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      travelDate,
      classCode = '3A',
      quotaCode = 'GN',
      trainNumber = '',
      originDepartureTime = '16:00',
    } = body;

    if (!travelDate) {
      return NextResponse.json(
        { error: 'travelDate (YYYY-MM-DD) is required.' },
        { status: 400 }
      );
    }

    const nowIST = getNowIST();
    const timeline = computeBookingTimeline(
      travelDate,
      classCode as TrainClassCode,
      quotaCode as QuotaCode,
      originDepartureTime
    );

    return NextResponse.json({
      success: true,
      query: {
        trainNumber: trainNumber || 'General Route',
        travelDate,
        classCode,
        quotaCode,
      },
      currentTimeIST: formatISTString(nowIST),
      timeline,
      // Strict Zero-Mock Policy
      dataGovernance: {
        hasHistoricalPredictionData: false,
        notice:
          'Historical PNR confirmation percentage curves require multi-month verified tracking (Phase 0 in progress). In compliance with our strict data authenticity policy, synthetic or guessed confirmation odds are never shown.',
        isDeterministicPolicyDriven: true,
        arpRuleCertified: '60 Days @ 08:00 AM IST (Railway Board Circular No. 2024/TG-I/20/P/ARP)',
      },
    });
  } catch (error: any) {
    console.error('Error in /api/trains/advisor:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to compute booking timeline.' },
      { status: 500 }
    );
  }
}
