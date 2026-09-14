# scripts/build_destinations.py
import json
import sys
from data.north import NORTH_DESTS
from data.west import WEST_DESTS
from data.central import CENTRAL_DESTS
from data.south import SOUTH_DESTS
from data.east import EAST_DESTINATIONS
from data.northeast import NORTHEAST_DESTINATIONS
from data.islands_intl import ISLANDS_INTL_DESTINATIONS
from data.cities_expansion import CITIES_EXPANSION_DESTS
from data.cities_expansion_2 import MORE_CITIES_DESTS
from data.cities_expansion_3 import EXPANSION_3_DESTS
from data.cities_expansion_4 import EXPANSION_4_DESTS

ALL_DESTINATIONS = (
    NORTH_DESTS
    + WEST_DESTS
    + CENTRAL_DESTS
    + SOUTH_DESTS
    + EAST_DESTINATIONS
    + NORTHEAST_DESTINATIONS
    + ISLANDS_INTL_DESTINATIONS
    + CITIES_EXPANSION_DESTS
    + MORE_CITIES_DESTS
    + EXPANSION_3_DESTS
    + EXPANSION_4_DESTS
)

INDIA_28_STATES = {
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal"
}

INDIA_8_UTS = {
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry"
}

print(f"Total destinations collected: {len(ALL_DESTINATIONS)}")

# Validation 1: Unique IDs
ids = [d["id"] for d in ALL_DESTINATIONS]
duplicate_ids = [item for item in ids if ids.count(item) > 1]
if duplicate_ids:
    print(f"ERROR: Duplicate IDs found: {set(duplicate_ids)}")
    sys.exit(1)

# Validation 2: Check 28 states
states_present = {d["state"] for d in ALL_DESTINATIONS if d["country"] == "India" and not d.get("isUnionTerritory", False)}
missing_states = INDIA_28_STATES - states_present
if missing_states:
    print(f"ERROR: Missing states from 28 states: {missing_states}")
    sys.exit(1)
print(f"All 28 Indian States present! ({len(states_present & INDIA_28_STATES)}/28)")

# Validation 3: Check 8 UTs
uts_present = {d["state"] for d in ALL_DESTINATIONS if d.get("isUnionTerritory", False)}
missing_uts = INDIA_8_UTS - uts_present
if missing_uts:
    print(f"ERROR: Missing UTs from 8 UTs: {missing_uts}")
    sys.exit(1)
print(f"All 8 Union Territories present! ({len(uts_present & INDIA_8_UTS)}/8)")

# Validation 4: Minimum count >= 160
if len(ALL_DESTINATIONS) < 160:
    print(f"ERROR: Less than 160 destinations ({len(ALL_DESTINATIONS)})")
    sys.exit(1)
print(f"Destination count check passed: {len(ALL_DESTINATIONS)} >= 160")

# Validation 5: Coordinates and Schema
for d in ALL_DESTINATIONS:
    if not isinstance(d["latitude"], (int, float)) or not isinstance(d["longitude"], (int, float)):
        print(f"ERROR: Invalid coordinates for {d['id']}")
        sys.exit(1)
    if not isinstance(d.get("aliases"), list) or not isinstance(d.get("keywords"), list):
        print(f"ERROR: Missing aliases or keywords for {d['id']}")
        sys.exit(1)

# Now, generate destinations.ts
ts_content = '''import type { Destination, RecentBooking, PromoOffer } from '@/types/travel';

export const ALL_DESTINATIONS: Destination[] = '''

ts_content += json.dumps(ALL_DESTINATIONS, indent=2, ensure_ascii=False)
ts_content += ''';

export const DESTINATIONS: Destination[] = ALL_DESTINATIONS;
export const POPULAR_DESTINATIONS: Destination[] = ALL_DESTINATIONS.filter(d => d.isPopular);

export const RECENT_BOOKINGS: RecentBooking[] = [
  {
    id: 'rb-1',
    userName: 'Aarav Sharma',
    userCity: 'Delhi',
    destinationName: 'Manali, Himachal Pradesh',
    nights: 4,
    guestCount: 2,
    bookedAtAgo: '2 minutes ago',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80'
  },
  {
    id: 'rb-2',
    userName: 'Priya Patel',
    userCity: 'Ahmedabad',
    destinationName: 'Goa Beaches',
    nights: 3,
    guestCount: 4,
    bookedAtAgo: '7 minutes ago',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80'
  },
  {
    id: 'rb-3',
    userName: 'Rohan Iyer',
    userCity: 'Bengaluru',
    destinationName: 'Munnar, Kerala',
    nights: 5,
    guestCount: 2,
    bookedAtAgo: '14 minutes ago',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&q=80'
  },
  {
    id: 'rb-4',
    userName: 'Ananya Roy',
    userCity: 'Kolkata',
    destinationName: 'Darjeeling, West Bengal',
    nights: 3,
    guestCount: 3,
    bookedAtAgo: '22 minutes ago',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80'
  },
  {
    id: 'rb-5',
    userName: 'Karan Malhotra',
    userCity: 'Chandigarh',
    destinationName: 'Leh Ladakh',
    nights: 6,
    guestCount: 2,
    bookedAtAgo: '35 minutes ago',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80'
  }
];

export const PROMO_OFFERS: PromoOffer[] = [
  {
    id: 'promo-1',
    code: 'EARLYBIRD',
    headline: 'Book 30+ days early & save up to 25%',
    subline: 'Applies to stays, rail, and flight combos across all destinations',
    badge: 'SAVE 25%',
    accentColor: '#10B981',
    terms: 'Valid on advance bookings made at least 30 days prior to travel date.',
    applicableCategories: ['hills', 'heritage', 'beaches']
  },
  {
    id: 'promo-2',
    code: 'WEEKENDER',
    headline: 'Weekend road-trips & hill escapes',
    subline: 'Flat ₹500 off on hostel dorms and homestays within 300 km of your city',
    badge: 'FLAT ₹500 OFF',
    accentColor: '#3B82F6',
    terms: 'Valid on Friday-Sunday check-ins for stays up to 3 nights.',
    applicableCategories: ['hills', 'heritage']
  },
  {
    id: 'promo-3',
    code: 'MONSOONMAGIC',
    headline: 'Experience waterfalls & Western Ghats',
    subline: 'Up to 35% off on offbeat homestays in Kerala, Goa, and Karnataka',
    badge: 'UP TO 35% OFF',
    accentColor: '#8B5CF6',
    terms: 'Subject to seasonal availability. Complimentary breakfast included.',
    applicableCategories: ['backwaters', 'hills', 'beaches']
  }
];
'''

with open("src/data/destinations.ts", "w", encoding="utf-8") as f:
    f.write(ts_content)

print(f"Successfully generated src/data/destinations.ts with {len(ALL_DESTINATIONS)} destinations!")
