# scripts/make_all_destinations.py
import json

# We will define helper function to ensure standard schema
def create_destination(
    id, name, state, country, region, category, types,
    lat, lng, aliases, keywords, attractions, intents,
    price, budget, comfort, luxury, rating, reviews,
    season, recommended_months, peak_season, avoid_months,
    days, airport, railway, description, image_url,
    popular=False, altitude=None, hostels=None, transport_notes="",
    group=None, is_ut=False, permit=None, bus_hub=None
):
    if hostels is None:
        hostels = [
            {"name": f"Zostel {name.split('&')[0].strip()}", "pricePerNight": 499, "type": "Backpacker Dorm", "rating": 4.8, "perks": ["High Speed Wi-Fi", "Café Lounge", "Community Events"]},
            {"name": f"The Hosteller {name.split('&')[0].strip()}", "pricePerNight": 420, "type": "Traveler Dorm", "rating": 4.7, "perks": ["Rooftop View", "Work Desk", "Bonfire"]}
        ]
    
    tags = [a["name"] for a in attractions[:3]] + types[:2]

    dest = {
        "id": id,
        "name": name,
        "state": state,
        "isUnionTerritory": is_ut,
        "country": country,
        "region": region,
        "category": category,
        "types": types,
        "latitude": lat,
        "longitude": lng,
        "coordinates": {"lat": lat, "lng": lng},
        "aliases": aliases,
        "keywords": keywords,
        "attractions": attractions,
        "intents": intents,
        "startingPrice": price,
        "dailyCostBudget": budget,
        "dailyCostComfort": comfort,
        "dailyCostLuxury": luxury,
        "rating": rating,
        "reviewsCount": reviews,
        "bestSeason": season,
        "recommendedMonths": recommended_months,
        "peakSeason": peak_season,
        "avoidMonths": avoid_months,
        "avgVisitDays": days,
        "nearestAirport": airport,
        "nearestRailway": railway,
        "description": description,
        "imageUrl": image_url,
        "isPopular": popular,
        "viewpoints": attractions,
        "hostels": hostels,
        "transport": {
            "trainAdvanceDays": 60,
            "flightAdvanceDays": {"min": 14, "max": 45},
            "notes": transport_notes
        },
        "tags": tags
    }
    if group:
        dest["destinationGroup"] = group
    if altitude:
        dest["altitude"] = altitude
    if bus_hub:
        dest["transport"]["majorBusHub"] = bus_hub
    if permit:
        dest["travelRequirements"] = permit

    return dest

print("Helper defined.")
