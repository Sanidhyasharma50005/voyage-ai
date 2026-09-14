import re

path = r"c:\Users\Acer\Documents\antigravity\peaceful-volta\travel-assistant\src\data\destinations.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

seasons_map = {
    "kerala": "Sep – Mar (Cool Houseboat Cruises) & Jun – Aug (Ayurvedic Monsoon)",
    "kashmir": "Apr – Oct (Tulips, Meadows & Lakes) & Dec – Feb (Gulmarg Snow Skiing)",
    "goa": "Nov – Feb (Peak Beach & Nightlife; 28°C) | Oct & Mar (Budget Shoulder)",
    "manali": "Mar – Jun (Pleasant Summers & Paragliding) & Dec – Feb (Snowfall & Solang Skiing)",
    "rishikesh": "Sep – Nov & Mar – May (Peak River Rafting & Yoga Season)",
    "jaipur": "Nov – Feb (Pleasant 10–25°C Fort Exploration & Literature Fest)",
    "ladakh": "May – Sep (All Mountain Passes Open, Azure Lakes, 15–25°C)",
    "varanasi": "Nov – Feb (Crisp Morning Boat Rides & Dev Deepawali Festival)",
    "andaman": "Nov – Apr (Calm Waters, Scuba Diving & Sea Turtle Nesting)",
    "shimla": "Mar – Jun (Pleasant Summer) & Dec – Jan (Himalayan Snowfall)",
    "darjeeling": "Mar – May (Rhododendron Blooms) & Oct – Dec (Clear Kanchenjunga Vistas)",
    "ooty": "Mar – Jun (Summer Flower Show) & Oct – Jan (Misty Green Tea Hills)",
    "kodaikanal": "Oct – Mar (Crisp Mountain Mist & Waterfalls) & Apr – Jun (Summer Boating)",
    "mount-abu": "Nov – Feb (Pleasant Oasis Climate, 12–22°C)",
    "mussoorie": "Apr – Jun (Pleasant Summer Escapes) & Dec – Jan (Rare Winterline & Snow)",
    "nainital": "Mar – Jun (Lake Boating & Trekking) & Dec – Jan (Winter Snowscapes)",
    "coorg": "Oct – Mar (Coffee Harvest & Abbey Falls) & Jun – Sep (Lush Monsoon Treks)",
    "gangtok": "Mar – May (Orchid Blooms) & Oct – Dec (Crystal Clear Peak Views)",
    "auli": "Dec – Mar (National Ski Championships & Powder Snow) & May – Oct (Alpine Meadows)",
    "shillong": "Oct – Apr (Clear Waterfalls, Living Root Bridges & Crystal Dawki River)",
    "tawang": "Mar – Jun (Buddhism Festivals & Spring Blooms) & Sep – Nov (Golden Valleys)",
    "munnar": "Sep – Mar (Aromatic Misty Tea Valleys & Neelakurinji Hills)",
    "dharamshala": "Mar – Jun (Tibetan Cultural Retreats) & Sep – Dec (Clear Dhauladhar Treks)",
    "pondicherry": "Nov – Feb (Pleasant 24°C French Colony Strolls & Surf Season)",
    "kovalam": "Nov – Feb (Calm Arabian Sea, Coastal Sunsets & Surfing)",
    "gokarna": "Oct – Mar (Beach Treks, Half Moon Bay Sunsets & Beach Camping)",
    "diu": "Nov – Feb (Pleasant Coastal Weather & Festa De Diu Beach Culture)",
    "lakshadweep": "Oct – Apr (Crystal Clear Coral Lagoons, Diving & Kayaking)",
    "alibag": "Nov – Mar (Quick Coastal Getaways, Water Sports & Kolaba Fort)",
    "tarkarli": "Oct – Mar (Pristine Malvan Scuba Diving & Dolphin Spotting)",
    "varkala": "Nov – Mar (Cliffside Sea Breezes, Yoga & World-Class Surfing)",
    "udaipur": "Oct – Mar (Romantic Lake Cruises, Royal Palaces & Mild 15–26°C)",
    "jodhpur": "Nov – Feb (Cool Desert Days, RIFF Folk Festival & Zip-lining)",
    "hampi": "Nov – Feb (Comfortable 18–30°C for Bouldering & Temple Ruins)",
    "mysore": "Sep – Feb (Grand Dasara Illumination & Pleasant Palace Touring)",
    "khajuraho": "Oct – Mar (Khajuraho Dance Festival in Feb & Comfortable Temple Walks)",
    "agra": "Oct – Mar (Cool Morning Fog & Clear Taj Mahal Sunrises)",
    "amritsar": "Nov – Mar (Gurpurab Festivities, Kulcha Food Trails & 10–22°C)",
    "orchha": "Oct – Mar (Scenic Betwa River Rafting & Chhatri Sunset Views)",
    "mahabalipuram": "Nov – Feb (Shore Temple Dance Festival & Pleasant Sea Breezes)",
    "ajanta-ellora": "Nov – Mar (Cool Weather for Exploring Ancient Caves 16 & 29)",
    "konark": "Nov – Feb (Annual Konark Sun Dance Festival & Chandrabhaga Beach)",
    "ranthambore": "Oct – Jun (Park Open; Peak Tiger Sightings in Mar – May)",
    "jim-corbett": "Nov – Jun (Dhikala Zone Open Nov 15 – Jun 15; Best Wildlife Safaris)",
    "kaziranga": "Nov – Apr (Park Open for Elephant & Jeep Safaris; Rhino Spotting)",
    "periyar": "Sep – Apr (Lake Boat Safaris & Elephant Herd Spotting)",
    "sundarbans": "Nov – Feb (Cool River Houseboat Safaris & Royal Bengal Tiger Trails)",
    "bandipur": "Oct – May (Prime Elephant & Leopard Sightings in Dry Deciduous Forests)",
    "haridwar": "Oct – Apr (Comfortable Holy Dips & Grand Ganga Aarti at Har Ki Pauri)",
    "bodh-gaya": "Nov – Feb (Global Buddhist Monks Chanting & Kalachakra Teachings)",
    "tirupati": "Sep – Feb (Mild Hilltop Temperatures & Brahmotsavam Festivities)",
    "madurai": "Oct – Mar (Pleasant Temple Corridors & Chithirai Festival)",
    "puri": "Nov – Feb (Pleasant Golden Beach Breezes) & Jun – Jul (Ratha Yatra)",
    "dwarka": "Oct – Mar (Janmashtami Celebrations & Comfortable Beyt Dwarka Ferries)",
    "kumarakom": "Sep – Mar (Migratory Bird Sanctuary Season & Serene Lagoons)",
    "bali": "Apr – Oct (Dry Season, Sunny Surf Breaks & Mount Batur Sunrises)",
    "dubai": "Nov – Mar (Pleasant 20–26°C Desert Safaris & Global Village Events)",
    "maldives": "Nov – Apr (Dry Northeast Monsoon, Turquoise Lagoon Clarity & Manta Rays)",
}

def replacer(match):
    full_block = match.group(0)
    d_id = match.group(1)
    old_season = match.group(2)
    if d_id in seasons_map:
        new_season = seasons_map[d_id]
        return full_block.replace(f"bestSeason: '{old_season}'", f"bestSeason: '{new_season}'")
    return full_block

# Match destination block from id to bestSeason
pattern = re.compile(r"id:\s*'([^']+)',.*?(bestSeason:\s*'([^']+)')", re.DOTALL)
# More precise substitution:
updated_content = content
for d_id, new_season in seasons_map.items():
    # Regex to find id: 'd_id', then up to bestSeason: '...'
    sub_pattern = rf"(id:\s*'{d_id}',.*?bestSeason:\s*')[^']+(\')"
    updated_content = re.sub(sub_pattern, rf"\g<1>{new_season}\g<2>", updated_content, flags=re.DOTALL)

with open(path, "w", encoding="utf-8") as f:
    f.write(updated_content)

print(f"Successfully updated seasons for {len(seasons_map)} destinations.")
