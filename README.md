# 🌴 Voyage — Smart India Travel Assistant & AI Planner

> Built with **Next.js 16 (React 19)**, **Tailwind CSS**, and **Google Gemini AI**.
> Designed with a fusion of **Voyage's fresh tropical identity** and **Fox Travels' premium dark luxury dashboard** with electric lime accents (`#d4f938`).
> Optimized for **100% Free Tier deployment on Vercel** with **zero cold starts**.

---

## 📸 Design Inspiration & Fusion

- **Image 1 (Voyage Travel App)**: Hand-lettered cursive brand logo with camper van, sunset sun, and palm trees; fresh cyan/teal gradients; floating heart bookmark buttons; curated destination photo cards.
- **Image 2 (Fox Travels Dark Dashboard)**: Deep obsidian navy theme (`#0a0e1a`, `#111827`); high-impact electric lime accents (`#d4f938`) on the active "Dashboard" pill, "Search" button, and price badges (`Starting at ₹19,600`, `₹ 248 / day`); interactive Travel Calendar widget with highlighted booking dates (14, 15, 16, 17); active bookings list; 50% discount promotional widget with mascot icon.

---

## ⚡ Key Features

1. **AI Trip Planner (Google Gemini 2.0 Flash)**:
   - Generate detailed day-by-day itineraries (Morning, Afternoon, Evening, Food suggestions).
   - Cost estimates, essential packing checklist, and local safety tips.
   - Works with live Gemini API or intelligent offline fallback.
2. **Easy Visa & Curated Highlights**:
   - Featured horizontal showcase for Bali, Dubai, Maldives, Kashmir, and Goa with instant price badges.
3. **Radar "Near Me" (Geolocation)**:
   - Real-time GPS distance calculation using the spherical Haversine formula to sort Indian destinations from nearest to farthest.
4. **Live Weather Widget (Open-Meteo)**:
   - Real-time temperature, wind speed, and weather condition fetching for any selected city.
5. **Interactive Travel Calendar**:
   - Monthly calendar widget with highlighted booking dates matching the design.
6. **IRCTC Advance Booking Reminder**:
   - 120-day IRCTC train quota reminder and 21–60 day flight sweet-spot countdown.
7. **Live Currency Converter**:
   - Real-time INR to USD, EUR, and GBP conversion.
8. **Dormitories & Backpacker Hostels**:
   - Curated list of verified hostels (Zostel, Gostops, Hosteller) with nightly rates and perks.
9. **Favourites / Bookmarks**:
   - LocalStorage-persisted bookmarks with heart toggle.

---

## 🚀 Getting Started

### 1. Run Locally

```bash
cd travel-assistant
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Configure Gemini API (100% Free)

Get a free Gemini API key from [Google AI Studio](https://aistudio.google.com) (1M tokens/day free, 15 RPM).
Create a `.env.local` file:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Deploy to Vercel (Free Tier, Zero Cold Starts)

1. Push your repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Select your repository and set the **Root Directory** to `travel-assistant`.
4. Add the `GEMINI_API_KEY` environment variable in Vercel settings.
5. Click **Deploy** — your app is live worldwide with edge caching!
