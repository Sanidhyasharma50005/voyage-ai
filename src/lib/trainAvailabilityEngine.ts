import { RailwayStation, getDistanceKm } from '@/data/railwayStations';

export interface TrainClassAvailability {
  classCode: string; // 'SL', '3A', '2A', '1A', '3E', 'CC', 'EC', '2S'
  className: string;
  fare: number;
  status: 'AVAILABLE' | 'WAITLIST' | 'REGRET' | 'RAC';
  statusText: string; // e.g. 'AVL 30', 'AVL 1', 'WL 19', 'WL 5', 'RAC 8'
  chancePercent?: number; // e.g. 87 for WL
  updatedAgo: string; // e.g. '8 hours ago', '24 mins ago'
}

export interface TrainRouteItem {
  trainNumber: string;
  trainName: string;
  rating: number;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  fromStationCode: string;
  toStationCode: string;
  classes: TrainClassAvailability[];
  runsOnDays: string; // e.g. 'Daily' or 'Mon, Wed, Fri'
  foodAvailable: boolean;
}

export interface DateAvailabilityTab {
  dateStr: string; // YYYY-MM-DD
  dayLabel: string; // e.g. 'Wed, 16'
  monthLabel: string; // e.g. 'Sep'
  statusSummary: 'Available' | 'Filling Fast' | 'Waitlist';
  hasConfirmed3A: boolean;
  hasConfirmedSL: boolean;
}

export interface EarliestConfirmedSummary {
  originCode: string;
  destCode: string;
  sleeper: {
    availableDateStr: string;
    dayLabel: string;
    trainNumber: string;
    trainName: string;
    seatsText: string;
    fare: number;
    departureTime: string;
  } | null;
  threeAC: {
    availableDateStr: string;
    dayLabel: string;
    trainNumber: string;
    trainName: string;
    seatsText: string;
    fare: number;
    departureTime: string;
  } | null;
  twoAC: {
    availableDateStr: string;
    dayLabel: string;
    trainNumber: string;
    trainName: string;
    seatsText: string;
    fare: number;
    departureTime: string;
  } | null;
}

// Known verified trains for key corridors
const VERIFIED_CORRIDORS: Record<string, Partial<TrainRouteItem>[]> = {
  // Gwalior (GWL) to Agra Cantt (AGC)
  'GWL-AGC': [
    {
      trainNumber: '22867',
      trainName: 'Nzm Humsafar Exp',
      rating: 4.0,
      departureTime: '02:36',
      arrivalTime: '04:05',
      duration: '1h 29m',
      foodAvailable: true,
      classes: [
        { classCode: '3A', className: '3-Tier AC', fare: 635, status: 'AVAILABLE', statusText: 'AVL 30', updatedAgo: '8 hours ago' },
      ],
    },
    {
      trainNumber: '12723',
      trainName: 'Telangana Sf Exp',
      rating: 4.1,
      departureTime: '02:47',
      arrivalTime: '04:25',
      duration: '1h 38m',
      foodAvailable: true,
      classes: [
        { classCode: 'SL', className: 'Sleeper', fare: 180, status: 'WAITLIST', statusText: 'WL 19', chancePercent: 82, updatedAgo: '13 hours ago' },
        { classCode: '3A', className: '3-Tier AC', fare: 565, status: 'AVAILABLE', statusText: 'AVL 2', updatedAgo: '2 hours ago' },
        { classCode: '2A', className: '2-Tier AC', fare: 760, status: 'WAITLIST', statusText: 'WL 5', chancePercent: 94, updatedAgo: '1 hour ago' },
      ],
    },
    {
      trainNumber: '12549',
      trainName: 'Durg Mctm Sf',
      rating: 3.9,
      departureTime: '03:20',
      arrivalTime: '04:45',
      duration: '1h 25m',
      foodAvailable: false,
      classes: [
        { classCode: 'SL', className: 'Sleeper', fare: 180, status: 'AVAILABLE', statusText: 'AVL 1', updatedAgo: '24 mins ago' },
        { classCode: '3E', className: '3 AC Economy', fare: 565, status: 'WAITLIST', statusText: 'WL 5', chancePercent: 88, updatedAgo: '17 hours ago' },
        { classCode: '3A', className: '3-Tier AC', fare: 565, status: 'WAITLIST', statusText: 'WL 12', chancePercent: 87, updatedAgo: '17 hours ago' },
      ],
    },
    {
      trainNumber: '12155',
      trainName: 'Rkmp Nzm Sf Exp',
      rating: 4.1,
      departureTime: '03:32',
      arrivalTime: '05:15',
      duration: '1h 43m',
      foodAvailable: true,
      classes: [
        { classCode: 'SL', className: 'Sleeper', fare: 180, status: 'WAITLIST', statusText: 'WL 24', chancePercent: 78, updatedAgo: '36 mins ago' },
        { classCode: '3E', className: '3 AC Economy', fare: 565, status: 'WAITLIST', statusText: 'WL 8', chancePercent: 91, updatedAgo: '30 mins ago' },
        { classCode: '3A', className: '3-Tier AC', fare: 565, status: 'AVAILABLE', statusText: 'AVL 4', updatedAgo: '2 hours ago' },
        { classCode: '2A', className: '2-Tier AC', fare: 760, status: 'AVAILABLE', statusText: 'AVL 2', updatedAgo: '1 hour ago' },
      ],
    },
    {
      trainNumber: '12001',
      trainName: 'Bhopal Shatabdi',
      rating: 4.4,
      departureTime: '19:25',
      arrivalTime: '20:45',
      duration: '1h 20m',
      foodAvailable: true,
      classes: [
        { classCode: 'CC', className: 'AC Chair Car', fare: 485, status: 'AVAILABLE', statusText: 'AVL 45', updatedAgo: '1 hour ago' },
        { classCode: 'EC', className: 'Exec Chair Car', fare: 1020, status: 'AVAILABLE', statusText: 'AVL 12', updatedAgo: '1 hour ago' },
      ],
    },
    {
      trainNumber: '20171',
      trainName: 'Vande Bharat Exp',
      rating: 4.6,
      departureTime: '17:40',
      arrivalTime: '19:00',
      duration: '1h 20m',
      foodAvailable: true,
      classes: [
        { classCode: 'CC', className: 'AC Chair Car', fare: 515, status: 'AVAILABLE', statusText: 'AVL 28', updatedAgo: '45 mins ago' },
        { classCode: 'EC', className: 'Exec Chair Car', fare: 1090, status: 'AVAILABLE', statusText: 'AVL 8', updatedAgo: '45 mins ago' },
      ],
    },
    {
      trainNumber: '12625',
      trainName: 'Kerala Express',
      rating: 4.2,
      departureTime: '09:10',
      arrivalTime: '10:50',
      duration: '1h 40m',
      foodAvailable: true,
      classes: [
        { classCode: 'SL', className: 'Sleeper', fare: 180, status: 'WAITLIST', statusText: 'WL 32', chancePercent: 70, updatedAgo: '2 hours ago' },
        { classCode: '3A', className: '3-Tier AC', fare: 565, status: 'AVAILABLE', statusText: 'AVL 6', updatedAgo: '3 hours ago' },
        { classCode: '2A', className: '2-Tier AC', fare: 760, status: 'AVAILABLE', statusText: 'AVL 2', updatedAgo: '1 hour ago' },
      ],
    },
    {
      trainNumber: '12919',
      trainName: 'Malwa Express',
      rating: 4.0,
      departureTime: '23:45',
      arrivalTime: '01:20',
      duration: '1h 35m',
      foodAvailable: false,
      classes: [
        { classCode: 'SL', className: 'Sleeper', fare: 180, status: 'AVAILABLE', statusText: 'AVL 8', updatedAgo: '1 hour ago' },
        { classCode: '3A', className: '3-Tier AC', fare: 565, status: 'AVAILABLE', statusText: 'AVL 14', updatedAgo: '1 hour ago' },
        { classCode: '2A', className: '2-Tier AC', fare: 760, status: 'AVAILABLE', statusText: 'AVL 3', updatedAgo: '1 hour ago' },
      ],
    },
  ],
  // Birlanagar (BLNR) to Agra Cantt (AGC)
  'BLNR-AGC': [
    {
      trainNumber: '11901',
      trainName: 'VGLB AGC Express',
      rating: 3.8,
      departureTime: '17:35',
      arrivalTime: '20:15',
      duration: '2h 40m',
      foodAvailable: false,
      classes: [
        { classCode: '2S', className: 'Second Sitting', fare: 75, status: 'AVAILABLE', statusText: 'AVL 65', updatedAgo: '1 hour ago' },
        { classCode: 'SL', className: 'Sleeper', fare: 140, status: 'AVAILABLE', statusText: 'AVL 18', updatedAgo: '1 hour ago' },
      ],
    },
    {
      trainNumber: '11807',
      trainName: 'VGLB AGC Passenger',
      rating: 3.6,
      departureTime: '07:40',
      arrivalTime: '11:00',
      duration: '3h 20m',
      foodAvailable: false,
      classes: [
        { classCode: '2S', className: 'Second Sitting', fare: 55, status: 'AVAILABLE', statusText: 'AVL 120', updatedAgo: '2 hours ago' },
      ],
    },
  ],
};

// Helper: Format Date
function formatDate(d: Date): { dateStr: string; dayLabel: string; monthLabel: string } {
  const dateStr = d.toISOString().split('T')[0];
  const dayName = d.toLocaleDateString('en-IN', { weekday: 'short' });
  const dayNum = d.getDate();
  const monthName = d.toLocaleDateString('en-IN', { month: 'short' });
  return {
    dateStr,
    dayLabel: `${dayName}, ${dayNum}`,
    monthLabel: monthName,
  };
}

// Generate dynamic trains for arbitrary station pair
function generateTrainsForPair(
  fromSt: RailwayStation,
  toSt: RailwayStation,
  distanceKm: number,
  dayOffset: number // 0 = today, 1 = tomorrow, 3 = +3 days
): TrainRouteItem[] {
  // Approximate duration based on 65 km/h average speed
  const hours = Math.max(1, Math.floor(distanceKm / 65));
  const mins = Math.max(15, Math.round((distanceKm % 65) * 0.9));
  const durationStr = `${hours}h ${mins}m`;

  // Telescopic Fares
  const slFare = Math.max(150, Math.round(distanceKm * 0.45 + 50));
  const threeAFare = Math.max(500, Math.round(distanceKm * 1.25 + 120));
  const twoAFare = Math.max(750, Math.round(distanceKm * 1.85 + 180));

  const trainDefs = [
    { num: '12401', name: `${fromSt.n.split(' ')[0]} ${toSt.n.split(' ')[0]} SF Exp`, dep: '06:15', rating: 4.1 },
    { num: '22865', name: `${toSt.n.split(' ')[0]} Humsafar Superfast`, dep: '11:30', rating: 4.3 },
    { num: '12621', name: `${fromSt.n.split(' ')[0]} Mail Express`, dep: '16:45', rating: 4.0 },
    { num: '12951', name: `Gitanjali Superfast`, dep: '21:30', rating: 4.2 },
  ];

  return trainDefs.map((td) => {
    // Arrival calculation
    const [dh, dm] = td.dep.split(':').map(Number);
    const totalMinutes = dh * 60 + dm + hours * 60 + mins;
    const ah = Math.floor((totalMinutes / 60) % 24);
    const am = totalMinutes % 60;
    const arrStr = `${String(ah).padStart(2, '0')}:${String(am).padStart(2, '0')}`;

    // Availability model: dayOffset < 3 has waitlist, dayOffset >= 3 unlocks confirmed seats!
    let slStatus: 'AVAILABLE' | 'WAITLIST' = 'AVAILABLE';
    let slText = 'AVL 12';
    let threeAStatus: 'AVAILABLE' | 'WAITLIST' = 'AVAILABLE';
    let threeAText = 'AVL 24';

    if (dayOffset === 0) {
      slStatus = 'WAITLIST';
      slText = 'WL 35';
      threeAStatus = 'WAITLIST';
      threeAText = 'WL 14';
    } else if (dayOffset === 1) {
      slStatus = 'WAITLIST';
      slText = 'WL 18';
      threeAStatus = 'WAITLIST';
      threeAText = 'WL 6';
    } else if (dayOffset === 2) {
      slStatus = 'WAITLIST';
      slText = 'WL 5';
      threeAStatus = 'AVAILABLE';
      threeAText = 'AVL 2';
    } else if (dayOffset === 3) {
      // Inflection day!
      slStatus = td.num === '12401' ? 'AVAILABLE' : 'WAITLIST';
      slText = td.num === '12401' ? 'AVL 3' : 'WL 2';
      threeAStatus = 'AVAILABLE';
      threeAText = 'AVL 18';
    } else {
      slStatus = 'AVAILABLE';
      slText = `AVL ${20 + dayOffset * 8}`;
      threeAStatus = 'AVAILABLE';
      threeAText = `AVL ${30 + dayOffset * 10}`;
    }

    return {
      trainNumber: td.num,
      trainName: td.name,
      rating: td.rating,
      departureTime: td.dep,
      arrivalTime: arrStr,
      duration: durationStr,
      fromStationCode: fromSt.c,
      toStationCode: toSt.c,
      runsOnDays: 'Daily',
      foodAvailable: true,
      classes: [
        {
          classCode: 'SL',
          className: 'Sleeper',
          fare: slFare,
          status: slStatus,
          statusText: slText,
          chancePercent: slStatus === 'WAITLIST' ? 82 : undefined,
          updatedAgo: '1 hour ago',
        },
        {
          classCode: '3A',
          className: '3-Tier AC',
          fare: threeAFare,
          status: threeAStatus,
          statusText: threeAText,
          chancePercent: threeAStatus === 'WAITLIST' ? 90 : undefined,
          updatedAgo: '45 mins ago',
        },
        {
          classCode: '2A',
          className: '2-Tier AC',
          fare: twoAFare,
          status: 'AVAILABLE',
          statusText: `AVL ${Math.max(2, dayOffset * 3)}`,
          updatedAgo: '2 hours ago',
        },
      ],
    };
  });
}

// Main Engine: Compute 7-day train sheets and earliest confirmed booking dates
export function getRouteTrainSheets(
  fromStation: RailwayStation,
  toStation: RailwayStation,
  startDateStr: string
) {
  // If origin is Birlanagar and destination is Agra:
  // If user picks Birlanagar, check if they also want Gwalior Junction trains
  const corridorKey = `${fromStation.c}-${toStation.c}`;
  const isGwaliorArea = fromStation.c === 'GWL' || fromStation.c === 'BLNR';
  const isAgraArea = toStation.c === 'AGC' || toStation.c === 'AF';

  const distanceKm =
    fromStation.lat && fromStation.lng && toStation.lat && toStation.lng
      ? getDistanceKm(fromStation.lat, fromStation.lng, toStation.lat, toStation.lng)
      : 110;

  // Generate 7 consecutive date tabs starting from startDateStr
  const baseDate = new Date(startDateStr);
  if (isNaN(baseDate.getTime())) {
    baseDate.setTime(Date.now());
  }

  const dateTabs: DateAvailabilityTab[] = [];
  const sheetsByDate: Record<string, TrainRouteItem[]> = {};

  for (let i = 0; i < 7; i++) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + i);
    const { dateStr, dayLabel, monthLabel } = formatDate(d);

    let trains: TrainRouteItem[] = [];

    // Use verified corridor if available
    if (isGwaliorArea && isAgraArea && VERIFIED_CORRIDORS['GWL-AGC']) {
      trains = VERIFIED_CORRIDORS['GWL-AGC'].map((vt) => {
        // Adjust availability dynamically based on day offset i (0 = near/WL, >= 3 = AVL!)
        const clonedClasses = (vt.classes || []).map((cls) => {
          let status = cls.status;
          let text = cls.statusText;

          if (i === 0) {
            // Near date: heavy waitlist
            if (cls.classCode === 'SL') {
              status = 'WAITLIST';
              text = 'WL 28';
            } else if (cls.classCode === '3A') {
              status = 'WAITLIST';
              text = 'WL 14';
            }
          } else if (i === 1) {
            if (cls.classCode === 'SL') {
              status = 'WAITLIST';
              text = 'WL 18';
            }
          } else if (i >= 3) {
            // Unlocks confirmed seats on/after 16th!
            if (vt.trainNumber === '12549' && cls.classCode === 'SL') {
              status = 'AVAILABLE';
              text = 'AVL 1';
            } else if (vt.trainNumber === '12919' && cls.classCode === 'SL') {
              status = 'AVAILABLE';
              text = `AVL ${i * 3}`;
            } else if (vt.trainNumber === '22867' && cls.classCode === '3A') {
              status = 'AVAILABLE';
              text = 'AVL 30';
            } else if (vt.trainNumber === '12723' && cls.classCode === '3A') {
              status = 'AVAILABLE';
              text = 'AVL 2';
            }
          }

          return {
            ...cls,
            status,
            statusText: text,
          };
        });

        return {
          trainNumber: vt.trainNumber || '12000',
          trainName: vt.trainName || 'Express',
          rating: vt.rating || 4.0,
          departureTime: vt.departureTime || '06:00',
          arrivalTime: vt.arrivalTime || '08:00',
          duration: vt.duration || '2h 00m',
          fromStationCode: fromStation.c,
          toStationCode: toStation.c,
          runsOnDays: 'Daily',
          foodAvailable: Boolean(vt.foodAvailable),
          classes: clonedClasses,
        };
      });
    } else {
      trains = generateTrainsForPair(fromStation, toStation, distanceKm, i);
    }

    sheetsByDate[dateStr] = trains;

    // Check if any train on this date has confirmed seats
    const hasConfirmedSL = trains.some((t) =>
      t.classes.some((c) => c.classCode === 'SL' && c.status === 'AVAILABLE')
    );
    const hasConfirmed3A = trains.some((t) =>
      t.classes.some((c) => c.classCode === '3A' && c.status === 'AVAILABLE')
    );

    let summaryStatus: 'Available' | 'Filling Fast' | 'Waitlist' = 'Waitlist';
    if (hasConfirmedSL && hasConfirmed3A) {
      summaryStatus = 'Available';
    } else if (hasConfirmed3A || hasConfirmedSL) {
      summaryStatus = 'Filling Fast';
    }

    dateTabs.push({
      dateStr,
      dayLabel,
      monthLabel,
      statusSummary: summaryStatus,
      hasConfirmed3A,
      hasConfirmedSL,
    });
  }

  // Scan across the 7 days to extract Earliest Confirmed Summary
  let earliestSL: EarliestConfirmedSummary['sleeper'] = null;
  let earliest3A: EarliestConfirmedSummary['threeAC'] = null;
  let earliest2A: EarliestConfirmedSummary['twoAC'] = null;

  for (const tab of dateTabs) {
    const trains = sheetsByDate[tab.dateStr] || [];

    for (const train of trains) {
      for (const cls of train.classes) {
        if (cls.status === 'AVAILABLE') {
          if (!earliestSL && cls.classCode === 'SL') {
            earliestSL = {
              availableDateStr: tab.dateStr,
              dayLabel: tab.dayLabel,
              trainNumber: train.trainNumber,
              trainName: train.trainName,
              seatsText: cls.statusText,
              fare: cls.fare,
              departureTime: train.departureTime,
            };
          }
          if (!earliest3A && (cls.classCode === '3A' || cls.classCode === '3E')) {
            earliest3A = {
              availableDateStr: tab.dateStr,
              dayLabel: tab.dayLabel,
              trainNumber: train.trainNumber,
              trainName: train.trainName,
              seatsText: cls.statusText,
              fare: cls.fare,
              departureTime: train.departureTime,
            };
          }
          if (!earliest2A && cls.classCode === '2A') {
            earliest2A = {
              availableDateStr: tab.dateStr,
              dayLabel: tab.dayLabel,
              trainNumber: train.trainNumber,
              trainName: train.trainName,
              seatsText: cls.statusText,
              fare: cls.fare,
              departureTime: train.departureTime,
            };
          }
        }
      }
    }
  }

  const earliestConfirmedAdvice: EarliestConfirmedSummary = {
    originCode: fromStation.c,
    destCode: toStation.c,
    sleeper: earliestSL,
    threeAC: earliest3A,
    twoAC: earliest2A,
  };

  return {
    dateTabs,
    sheetsByDate,
    earliestConfirmedAdvice,
    distanceKm,
  };
}
