export type DestinationCategory =
  | 'all'
  | 'hills'
  | 'beaches'
  | 'heritage'
  | 'wildlife'
  | 'backwaters'
  | 'spiritual';

export type IndianRegion =
  | 'North'
  | 'South'
  | 'West'
  | 'East'
  | 'Central'
  | 'North-East'
  | 'Northeast'
  | 'Islands'
  | 'International';

export type SemanticIntent =
  | 'snow'
  | 'skiing'
  | 'beach'
  | 'water_sports'
  | 'watersports'
  | 'scuba'
  | 'wildlife'
  | 'safari'
  | 'spiritual'
  | 'temple'
  | 'heritage'
  | 'architecture'
  | 'trekking'
  | 'adventure'
  | 'backwaters'
  | 'desert'
  | 'tea_plantations'
  | 'honeymoon'
  | 'romantic'
  | 'cultural'
  | 'scenic'
  | 'nature'
  | 'peaceful'
  | 'mountains'
  | 'waterfalls'
  | 'boating'
  | 'luxury'
  | 'budget'
  | 'family'
  | 'city'
  | 'offbeat'
  | 'historical'
  | 'history'
  | 'eco'
  | 'palace'
  | 'archaeology'
  | 'camping'
  | 'roadtrip'
  | 'pilgrimage'
  | 'artistic'
  | 'educational'
  | string;

export interface Viewpoint {
  name: string;
  description: string;
  entryFee: number | null; // null = free
  visitTime?: string;
}

export interface DormHostel {
  name: string;
  pricePerNight: number;
  type: string;
  rating: number;
  perks: string[];
}

export interface TransportRule {
  trainAdvanceDays: number; // e.g. 120 days IRCTC
  flightAdvanceDays: { min: number; max: number };
  notes: string;
  majorBusHub?: string;
}

export interface Destination {
  id: string;
  name: string;
  state: string;
  isUnionTerritory?: boolean;
  country: string;
  region?: IndianRegion;
  destinationGroup?: string;
  category: DestinationCategory;
  types?: string[];
  latitude: number;
  longitude: number;
  coordinates?: { lat: number; lng: number };
  aliases?: string[];
  keywords?: string[];
  attractions?: Viewpoint[];
  intents?: SemanticIntent[];
  recommendedMonths?: string[];
  peakSeason?: string | string[];
  avoidMonths?: string[];
  startingPrice: number;
  dailyCostBudget: number;
  dailyCostComfort: number;
  dailyCostLuxury: number;
  rating: number;
  reviewsCount: number;
  bestSeason: string;
  avgVisitDays: number;
  altitude?: number; // in meters
  nearestAirport: string;
  nearestRailway: string;
  description: string;
  imageUrl: string;
  isPopular: boolean;
  isEasyVisa?: boolean;
  isSpecialOffer?: boolean;
  discountPercent?: number;
  viewpoints: Viewpoint[];
  hostels: DormHostel[];
  transport: TransportRule;
  travelRequirements?: {
    permitRequired?: boolean;
    required?: boolean;
    permitType?: string;
    type?: string;
    processingDays?: number;
    notes?: string;
  };
  tags: string[];
}

export interface ItineraryDay {
  day: number;
  theme: string;
  morning: string;
  afternoon: string;
  evening: string;
  meals: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
  estimatedCost: number;
  tips: string;
}

export interface TripPlan {
  title: string;
  summary: string;
  days: ItineraryDay[];
  totalEstimatedCost: number;
  packingList: string[];
  safetyTips: string[];
  transportTips: string;
}

export interface SavedBooking {
  id: string;
  destination: string;
  dates: string;
  year: string;
  status: 'Upcoming' | 'Confirmed' | 'Completed';
  imageUrl: string;
}

export interface SavedTrip {
  id: string;
  destinationId?: string;
  destinationName: string;
  title: string;
  daysCount: number;
  budgetTier: 'budget' | 'comfort' | 'luxury';
  travelStyle: string;
  totalCost: number;
  createdAt: string;
  dates: string;
  imageUrl: string;
  plan: TripPlan;
}

export interface UserProfile {
  name: string;
  role: string;
  email: string;
  location: string;
  bio: string;
  avatarUrl: string;
  tripsCount: number;
  statesExplored: number;
  distanceKm: number;
  level: string;
  badges: string[];
}

export interface RecentBooking {
  id: string;
  userName: string;
  userCity: string;
  destinationName: string;
  nights: number;
  guestCount: number;
  bookedAtAgo: string;
  avatar: string;
}

export interface PromoOffer {
  id: string;
  code: string;
  headline: string;
  subline: string;
  badge: string;
  accentColor: string;
  terms: string;
  applicableCategories: DestinationCategory[];
}

