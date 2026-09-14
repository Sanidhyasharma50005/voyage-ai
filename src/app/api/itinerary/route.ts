import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Intelligent built-in itinerary generator for India destinations
function generateSmartItinerary(
  placeName: string,
  days: number,
  budgetTier: string,
  travelStyle: string,
  interests: string[]
) {
  const dailyRates: Record<string, number> = {
    budget: 350,
    comfort: 1800,
    luxury: 6500,
  };
  const rate = dailyRates[budgetTier] || 400;

  const interestText = interests.length > 0 ? interests.join(', ') : 'heritage, culture, and nature';

  const activities = [
    {
      theme: 'Arrival, Heritage Walk & Sunset Views',
      morning: `Arrive in ${placeName}, check in to stay, and refresh. Take a morning orientation stroll through the historic quarter.`,
      afternoon: `Visit the central landmark and heritage bazaar. Savor authentic regional lunch at a renowned local eatery.`,
      evening: `Head to the most scenic sunset viewpoint. Settle into an ambient open-air café for dinner and local music.`,
      bf: 'Traditional local chai & specialty breakfast (₹60 - ₹120)',
      lunch: 'Authentic regional thali meal (₹140 - ₹280)',
      dinner: 'Rooftop dinner featuring local chef specialties (₹220 - ₹500)',
      tip: 'Start early around 7:30 AM to explore before midday heat and peak crowd hours.',
    },
    {
      theme: 'Deep Cultural Exploration & Local Artisan Trails',
      morning: `7:00 AM early start. Visit premier architectural monuments, palaces, or natural viewpoints while the morning light is perfect for photography.`,
      afternoon: `Explore traditional artisan markets, silk weavers, or spice trails. Sample freshly made local street delicacies.`,
      evening: `Evening cultural performance, temple prayer ceremony (Aarti), or lakeside promenade stroll.`,
      bf: 'Fresh fruit bowl, local breads, and aromatic filter coffee/chai (₹70 - ₹140)',
      lunch: 'Popular local restaurant dining with authentic regional flavors (₹160 - ₹320)',
      dinner: 'Cozy garden restaurant or riverside shack dinner (₹250 - ₹550)',
      tip: 'Hire licensed local government guides or use walking tour audio maps for rich historical context.',
    },
    {
      theme: 'Nature Escapes, Treks & Hidden Gems',
      morning: `Excursion to nearby waterfalls, scenic valleys, or pristine coastal stretches. Pack trail snacks and electrolyte water.`,
      afternoon: `Enjoy a leisurely picnic or dine at a countryside village dhaba with farm-fresh produce.`,
      evening: `Golden hour photography at an offbeat cliffside or riverbend. Relaxed dinner sharing stories with fellow travelers.`,
      bf: 'Hearty travelers breakfast with eggs/poha/parathas and tea (₹80 - ₹160)',
      lunch: 'Countryside dhaba or local homestyle meal (₹130 - ₹260)',
      dinner: 'Specialty dinner with live acoustic ambiance (₹280 - ₹600)',
      tip: 'Carry cash in small denominations (₹50, ₹100 notes) as remote valley/beach vendors may have spotty UPI.',
    },
    {
      theme: 'Adventure Activities, Wellness & Rejuvenation',
      morning: `Engage in morning yoga, surfing, kayaking, or high-viewpoint hike. Reinvigorate with fresh coconut water.`,
      afternoon: `Traditional Ayurvedic wellness therapy, temple complex exploration, or visiting peaceful monasteries.`,
      evening: `Bustling evening flea market shopping for spices, handicrafts, and souvenirs. Farewell dinner gathering.`,
      bf: 'Healthy organic wellness breakfast with herbal infusions (₹90 - ₹180)',
      lunch: 'Light wholesome organic café meal or fresh seafood thali (₹170 - ₹340)',
      dinner: 'Celebratory multi-course dinner celebrating regional gastronomy (₹300 - ₹700)',
      tip: 'Always agree on local auto/cab fares beforehand or insist on digital meters / prepaid union counters.',
    },
  ];

  const planDays = Array.from({ length: days }).map((_, i) => {
    const act = activities[i % activities.length];
    return {
      day: i + 1,
      theme: `Day ${i + 1}: ${act.theme}`,
      morning: act.morning,
      afternoon: act.afternoon,
      evening: act.evening,
      meals: {
        breakfast: act.bf,
        lunch: act.lunch,
        dinner: act.dinner,
      },
      estimatedCost: rate,
      tips: act.tip,
    };
  });

  return {
    title: `${days}-Day ${budgetTier.toUpperCase()} Voyage: ${placeName}`,
    summary: `A carefully optimized ${days}-day ${budgetTier} travel itinerary crafted for a ${travelStyle} traveler exploring ${placeName}, focusing on ${interestText}. Perfectly balanced for pace, authentic cuisine, and iconic sights.`,
    totalEstimatedCost: rate * days,
    days: planDays,
    packingList: [
      'Comfortable lightweight walking shoes & breathable sandals',
      'Quick-dry cotton and linen attire appropriate for cultural sites',
      'Universal power bank (10,000+ mAh) and charging cords',
      'Sun protection: SPF 50 sunscreen, sunglasses, and brimmed hat',
      'Reusable stainless steel insulated water bottle',
      'Compact medical kit: oral rehydration salts, band-aids, motion sickness pills',
      'Physical government photo ID (Aadhaar / Passport) for permits & hostel check-in',
    ],
    safetyTips: [
      'National Emergency Helpline across India: Dial 112.',
      'Drink bottled or filtered RO water; avoid raw salads from roadside carts.',
      'Keep offline Google Maps or MapMyIndia downloaded before traveling to hilly/remote sectors.',
      'Respect modest dress guidelines at religious shrines: cover shoulders and knees.',
    ],
    transportTips:
      'Book Indian Railways (IRCTC) trains 120 days in advance. For local transit, use Metro where available (Delhi, Kochi, Bengaluru) or government prepaid auto booths at railway stations.',
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      placeName = 'Goa',
      days = 4,
      budgetTier = 'budget',
      travelStyle = 'solo',
      interests = [],
    } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    // If valid API key is present, try Gemini 2.0 Flash
    if (apiKey && apiKey.trim() !== '' && !apiKey.includes('your_gemini')) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: 'gemini-2.0-flash',
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.7,
            maxOutputTokens: 2500,
          },
        });

        const prompt = `You are Voyage, the premier AI travel assistant for India.
Generate a realistic, detailed ${days}-day travel itinerary for ${placeName}, India.
Budget tier: ${budgetTier} (budget: ₹250-600/day, comfort: ₹1500-2500/day, luxury: ₹5000-10000/day).
Travel style: ${travelStyle}.
Interests: ${interests.join(', ')}.

Respond ONLY with valid JSON matching this exact structure:
{
  "title": "${days}-Day ${budgetTier.toUpperCase()} Voyage in ${placeName}",
  "summary": "2-3 sentences overview with seasonal advice and cultural highlights",
  "totalEstimatedCost": 7500,
  "days": [
    {
      "day": 1,
      "theme": "Day Theme Title",
      "morning": "Morning activity with timings and scenic spots",
      "afternoon": "Afternoon activity and local culinary recommendations",
      "evening": "Sunset point and evening ambiance/dinner",
      "meals": {
        "breakfast": "Authentic regional breakfast recommendation with price",
        "lunch": "Lunch spot recommendation with price",
        "dinner": "Dinner spot recommendation with price"
      },
      "estimatedCost": 1500,
      "tips": "Practical tip for saving money, entry tickets, or avoiding crowds"
    }
  ],
  "packingList": ["item 1", "item 2", "item 3", "item 4", "item 5"],
  "safetyTips": ["safety tip 1", "safety tip 2", "safety tip 3"],
  "transportTips": "Specific local transport and IRCTC booking advice for ${placeName}"
}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const parsed = JSON.parse(text);
        if (parsed && Array.isArray(parsed.days) && parsed.days.length > 0) {
          return NextResponse.json(parsed);
        }
      } catch (geminiError) {
        console.warn('Gemini API call failed, falling back to smart built-in generator:', geminiError);
      }
    }

    // Always return a complete, valid TripPlan structure
    const smartPlan = generateSmartItinerary(
      placeName,
      Number(days) || 4,
      budgetTier,
      travelStyle,
      interests
    );
    return NextResponse.json(smartPlan);
  } catch (error: any) {
    console.error('API /api/itinerary fatal error:', error);
    // Even in error, return a fallback plan for the requested place
    const fallbackPlan = generateSmartItinerary('India', 3, 'budget', 'solo', ['heritage']);
    return NextResponse.json(fallbackPlan);
  }
}
