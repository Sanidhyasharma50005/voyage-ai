# scripts/data/helper.py

def create_dest(
    id, name, state, country, region, category, types,
    lat, lng, aliases, keywords, attractions, intents,
    price, budget, comfort, luxury, rating, reviews,
    season, recommended_months, peak_season, avoid_months,
    days, airport, railway, description, image_url,
    popular=False, altitude=None, hostels=None, transport_notes="",
    group=None, is_ut=False, permit=None, bus_hub=None, special_offer=False, discount=None
):
    base_name = name.split('&')[0].split('(')[0].strip()
    if hostels is None:
        hostels = [
            {
                "name": f"Zostel {base_name}",
                "pricePerNight": 490,
                "type": "Backpacker Dorm",
                "rating": 4.8,
                "perks": ["High Speed Wi-Fi", "Café Lounge", "Community Events"]
            },
            {
                "name": f"The Hosteller {base_name}",
                "pricePerNight": 420,
                "type": "Traveler Dorm",
                "rating": 4.7,
                "perks": ["Rooftop View", "Work Desk", "Bonfire"]
            }
        ]
    
    tags = [a["name"] for a in attractions[:2]] + types[:2]

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
            "trainAdvanceDays": 120 if "Express" in transport_notes or "IRCTC" in transport_notes else 60,
            "flightAdvanceDays": {"min": 14, "max": 45},
            "notes": transport_notes or f"Regular state transport and private buses connect {base_name} with nearest transit hubs."
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
    if special_offer:
        dest["isSpecialOffer"] = True
        dest["discountPercent"] = discount or 20

    return dest
