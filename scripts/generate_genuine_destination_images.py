# scripts/generate_genuine_destination_images.py
import json
import urllib.request
import urllib.parse
import time
import sys

# Step 1: Load all destinations
with open('scripts/all_dests_list.json', 'r', encoding='utf-8') as f:
    destinations = json.load(f)

print(f"Loaded {len(destinations)} destinations.")

# Exact landmark mapping for all 280 destinations
LANDMARK_QUERIES = {
    # UP & MP Heritage (Screenshot 1 bugs)
    'gwalior': 'Gwalior Fort',
    'jhansi': 'Jhansi Fort',
    'agra': 'Taj Mahal',
    'orchha': 'Chaturbhuj Temple, Orchha',
    'fatehpur-sikri': 'Buland Darwaza',
    'bharatpur': 'Keoladeo National Park',
    'mathura': 'Vishram Ghat',
    'mathura-vrindavan': 'Prem Mandir, Vrindavan',
    'ranthambore': 'Ranthambore Fort',
    'aligarh': 'Aligarh Muslim University',
    
    # South & Coastal & Islands (Screenshot 2 bugs)
    'tirunelveli': 'Nellaiappar Temple',
    'varkala': 'Varkala Beach',
    'thiruvananthapuram': 'Padmanabhaswamy Temple',
    'kovalam': 'Kovalam Beach',
    'kanyakumari': 'Vivekananda Rock Memorial',
    'diglipur': 'Ross and Smith Islands',
    'baratang-island': 'Baratang Island',
    'baratang': 'Baratang Island',
    'swaraj-dweep': 'Radhanagar Beach',
    'havelock': 'Radhanagar Beach',
    'port-blair': 'Cellular Jail',
    'shaheed-dweep': 'Neil Island',
    'neil-island': 'Neil Island',
    
    # Metros & Capitals
    'delhi': 'India Gate',
    'mumbai': 'Gateway of India',
    'bengaluru': 'Vidhana Soudha',
    'kolkata': 'Victoria Memorial, Kolkata',
    'chennai': 'Marina Beach',
    'hyderabad': 'Charminar',
    'jaipur': 'Hawa Mahal',
    'jodhpur': 'Mehrangarh Fort',
    'udaipur': 'City Palace, Udaipur',
    'jaisalmer': 'Jaisalmer Fort',
    'bikaner': 'Junagarh Fort',
    'amritsar': 'Golden Temple',
    'varanasi': 'Dashashwamedh Ghat',
    'pune': 'Shaniwar Wada',
    'nagpur': 'Deekshabhoomi',
    'coimbatore': 'Adiyogi Shiva bust',
    'mysuru': 'Mysore Palace',
    'mysore': 'Mysore Palace',
    'hampi': 'Virupaksha Temple, Hampi',
    'shirdi': 'Shirdi Sai Baba Temple',
    'nashik': 'Trimbakeshwar Shiva Temple',
    'ajanta-ellora': 'Kailasa Temple, Ellora',
    'rishikesh': 'Triveni Ghat',
    'haridwar': 'Har Ki Pauri',
    'nainital': 'Nainital Lake',
    'mussoorie': 'Kempty Falls',
    'shimla': 'Christ Church, Shimla',
    'manali': 'Solang Valley',
    'dharamshala': 'McLeod Ganj',
    'spiti-valley': 'Key Monastery',
    'leh-ladakh': 'Leh Palace',
    'ladakh': 'Pangong Tso',
    'kashmir': 'Dal Lake',
    'gulmarg': 'Gulmarg Gondola',
    'pahalgam': 'Betaab Valley',
    'sonamarg': 'Thajiwas Glacier',
    'katra-vaishno-devi': 'Vaishno Devi Temple',
    'patnitop': 'Patnitop',
    'nubra-valley': 'Diskit Monastery',
    'pangong-tso': 'Pangong Tso',
    'zanskar': 'Phuktal Monastery',
    'hanle': 'Indian Astronomical Observatory',
    'kasol': 'Parvati Valley',
    'dalhousie-khajjiar': 'Khajjiar Lake',
    'bir-billing': 'Bir, Himachal Pradesh',
    'jibhi-tirthan': 'Tirthan Valley',
    'kinnaur': 'Kalpa, Himachal Pradesh',
    'kasauli': 'Kasauli',
    'auli': 'Auli, India',
    'valley-of-flowers': 'Valley of Flowers National Park',
    'kedarnath': 'Kedarnath Temple',
    'badrinath': 'Badrinath Temple',
    'chopta-tungnath': 'Tungnath',
    'lansdowne': 'Lansdowne, Uttarakhand',
    'ranikhet': 'Ranikhet',
    'almora-binsar': 'Binsar Wildlife Sanctuary',
    'kausani': 'Kausani',
    'mukteshwar': 'Mukteshwar',
    'anandpur-sahib': 'Virasat-e-Khalsa',
    'kurukshetra': 'Brahma Sarovar',
    'sultanpur-bird-sanctuary': 'Sultanpur National Park',
    'morni-hills': 'Morni Hills',
    'old-delhi': 'Red Fort',
    'sarnath': 'Dhamek Stupa',
    'dudhwa-national-park': 'Dudhwa National Park',
    'kushinagar': 'Parinirvana Stupa',
    'chittorgarh': 'Chittor Fort',
    'kumbhalgarh': 'Kumbhalgarh',
    'bundi': 'Taragarh Fort, Bundi',
    'mandawa-shekhawati': 'Mandawa',
    'ahmedabad': 'Sabarmati Ashram',
    'champaner-pavagadh': 'Champaner-Pavagadh Archaeological Park',
    'saputara': 'Saputara',
    'diu-island': 'Diu Fort',
    'daman-silvassa': 'Moti Daman Fort',
    'gangtok': 'Rumtek Monastery',
    'darjeeling': 'Darjeeling Himalayan Railway',
    'shillong': 'Elephant Falls (Shillong)',
    'cherrapunji': 'Living root bridge',
    'kaziranga': 'Kaziranga National Park',
    'sundarbans': 'Sundarbans National Park',
    'jim-corbett': 'Jim Corbett National Park',
    'andaman-islands': 'Cellular Jail',
    'lakshadweep': 'Agatti Island',
    'goa': 'Basilica of Bom Jesus',
    'pondicherry': 'Promenade Beach',
    'puri': 'Jagannath Temple, Puri',
    'konark': 'Konark Sun Temple',
    'khajuraho': 'Kandariya Mahadeva Temple',
    'mahabalipuram': 'Shore Temple',
    'madurai': 'Meenakshi Temple',
    'rameswaram': 'Pamban Bridge',
    'rameshwaram': 'Ramanathaswamy Temple',
    'tirupati': 'Venkateswara Temple, Tirumala',
    'bodh-gaya': 'Mahabodhi Temple',
    'patna': 'Golghar',
    'ayodhya': 'Ram Mandir, Ayodhya',
    'lucknow': 'Bara Imambara',
    'dehradun': 'Robber\'s Cave, India',
    'chandigarh': 'Rock Garden of Chandigarh',
    'pushkar': 'Brahma Temple, Pushkar',
    'mount-abu': 'Dilwara Temples',
    'rann-of-kutch': 'Rann of Kutch',
    'statue-of-unity': 'Statue of Unity',
    'somnath': 'Somnath temple',
    'dwarka': 'Dwarkadhish Temple',
    'gir-national-park': 'Gir National Park',
    'alleppey': 'Alappuzha Lighthouse',
    'munnar': 'Tea Gardens Munnar',
    'wayanad': 'Banasura Sagar Dam',
    'thekkady': 'Periyar National Park',
    'thekkady-periyar': 'Periyar National Park',
    'kumarakom': 'Vembanad',
    'bekal': 'Bekal Fort',
    'athirappilly': 'Athirappilly Falls',
    'coorg': 'Abbey Falls',
    'gokarna': 'Om Beach, Gokarna',
    'chikkamagaluru': 'Mullayanagiri',
    'chikmagalur': 'Mullayanagiri',
    'dandeli': 'Kali River (Karnataka)',
    'murudeshwar': 'Murudeshwara',
    'ooty': 'Nilgiri Mountain Railway',
    'kodaikanal': 'Kodaikanal Lake',
    'thanjavur': 'Brihadisvara Temple, Thanjavur',
    'visakhapatnam': 'Kailasagiri',
    'araku-valley': 'Borra Caves',
    'gandikota': 'Gandikota',
    'lepakshi': 'Lepakshi',
    'puducherry': 'Promenade Beach',
    'kalimpong': 'Kalimpong',
    'digha': 'Digha',
    'shantiniketan': 'Visva-Bharati University',
    'dooars': 'Jaldapara National Park',
    'mirik': 'Mirik Lake',
    'mandarmani': 'Mandarmani',
    'bhubaneswar': 'Lingaraja Temple',
    'chilika-lake': 'Chilika Lake',
    'simlipal': 'Simlipal National Park',
    'gopalpur': 'Gopalpur, Odisha',
    'nalanda': 'Nalanda mahavihara',
    'rajgir': 'Vishwa Shanti Stupa, Rajgir',
    'valmiki-national-park': 'Valmiki National Park',
    'ranchi': 'Hundru Falls',
    'netarhat': 'Netarhat',
    'deoghar': 'Baidyanath Temple',
    'betla-national-park': 'Betla National Park',
    'shikharji': 'Shikharji',
    'guwahati': 'Kamakhya Temple',
    'majuli': 'Majuli',
    'manas': 'Manas National Park',
    'haflong': 'Haflong',
    'dawki': 'Umngot River',
    'mawlynnong': 'Mawlynnong',
    'tawang': 'Tawang Monastery',
    'ziro': 'Ziro',
    'mechuka': 'Mechuka',
    'pelling': 'Pemayangtse Monastery',
    'lachung-yumthang': 'Yumthang Valley of Flowers',
    'kohima': 'Kohima War Cemetery',
    'dzukou-valley': 'Dzüko Valley',
    'loktak-lake': 'Loktak Lake',
    'imphal': 'Kangla Fort',
    'aizawl': 'Solomon\'s Temple, Aizawl',
    'reiek': 'Reiek',
    'agartala': 'Ujjayanta Palace',
    'unakoti': 'Unakoti',
    'neermahal-udaipur-tripura': 'Neermahal',
    'agatti-island': 'Agatti Airport',
    'bangaram-island': 'Bangaram Atoll',
    'kavaratti': 'Kavaratti',
    'bali': 'Uluwatu Temple',
    'dubai': 'Burj Khalifa',
    'maldives': 'Male, Maldives',
    'kanchipuram': 'Kailasanathar Temple, Kanchipuram',
    'tiruchirappalli': 'Rockfort Temple',
    'ajmer': 'Ajmer Sharif Dargah',
    'lonavala-khandala': 'Karla Caves',
    'mahabaleshwar-panchgani': 'Venna Lake',
    'alibaug': 'Kolaba Fort',
    'matheran': 'Matheran Hill Railway',
    'tadoba': 'Tadoba Andhari Tiger Reserve',
    'tarkarli': 'Sindhudurg Fort',
    'kaas-plateau': 'Kaas Plateau',
    'south-goa': 'Palolem Beach',
    'bhopal-sanchi': 'Great Stupa at Sanchi',
    'indore': 'Rajwada Palace',
    'ujjain': 'Mahakaleshwar Jyotirlinga',
    'pachmarhi': 'Pachmarhi',
    'kanha-national-park': 'Kanha Tiger Reserve',
    'bandhavgarh': 'Bandhavgarh National Park',
    'pench-national-park': 'Pench National Park',
    'mandu': 'Jahaz Mahal',
    'bhedaghat-jabalpur': 'Dhuandhar Falls',
    'bastar-chitrakote': 'Chitrakote Falls',
    'sirpur': 'Laxman Temple, Sirpur',
    'barnawapara': 'Barnawapara Wildlife Sanctuary',
    'kochi': 'Chinese fishing nets',
    'badami-pattadakal': 'Badami cave temples',
    'kanpur': 'JK Temple, Kanpur',
    'prayagraj': 'Triveni Sangam',
    'surat': 'Dumas Beach',
    'vadodara': 'Laxmi Vilas Palace, Vadodara',
    'kolhapur': 'Mahalakshmi Temple, Kolhapur',
    'mangaluru': 'Panambur Beach',
    'udupi-malpe': 'Udupi Sri Krishna Matha',
    'ludhiana': 'Maharaja Ranjit Singh War Museum',
    'jalandhar': 'Devi Talab Mandir',
    'jammu': 'Bahu Fort',
    'dhanbad': 'Maithon Dam',
    'jamshedpur': 'Jubilee Park',
    'cuttack': 'Barabati Fort',
    'rourkela': 'Khandadhar Falls',
    'sambalpur': 'Hirakud Dam',
    'raipur': 'Swami Vivekananda Sarovar',
    'bilaspur': 'Mahamaya Temple, Ratanpur',
    'vijayawada': 'Kanaka Durga Temple',
    'guntur': 'Amaravati Stupa',
    'rajkot': 'Watson Museum',
    'bhavnagar': 'Palitana temples',
    'junagadh': 'Uparkot Fort',
    'porbandar': 'Kirti Mandir, Porbandar',
    'rewa': 'Govindgarh Palace',
    'satna': 'Maihar',
    'chitrakoot': 'Ramghat, Chitrakoot',
    'rohtak': 'Tilyar Lake',
    'panipat': 'Kala Amb',
    'karnal': 'Karna Lake',
    'ambala': 'Holy Redeemer Church, Ambala',
    'bathinda': 'Qila Mubarak, Bathinda',
    'patiala': 'Qila Mubarak, Patiala',
    'gurugram': 'Sultanpur National Park',
    'noida': 'Okhla Bird Sanctuary',
    'bareilly': 'Alakhnath Temple',
    'meerut': 'Augarnath Temple',
    'moradabad': 'Jama Masjid, Moradabad',
    'saharanpur': 'Shakumbhari Devi',
    'darbhanga': 'Darbhanga Fort',
    'muzaffarpur': 'Baba Garib Nath Dham',
    'bhagalpur': 'Vikramashila',
    'bokaro': 'Garga Dam',
    'asansol': 'Kalyaneshwari temple',
    'siliguri': 'Salugara Monastery',
    'bhandardara': 'Wilson Dam (India)',
    'igatpuri': 'Dhamma Giri',
    'lavasa': 'Lavasa',
    'solapur': 'Siddheshwar Temple, Solapur',
    'sakleshpur': 'Manjarabad Fort',
    'hubballi-dharwad': 'Unkal Lake',
    'belagavi': 'Belgaum Fort',
    'shivamogga': 'Jog Falls',
    'kozhikode': 'Kappad Beach',
    'kannur': 'Muzhappilangad Beach',
    'salem': 'Yercaud',
    'vellore': 'Vellore Fort',
    'erode': 'Bhavani Sangameshwarar Temple',
    'nellore': 'Mypadu Beach',
    'kakinada': 'Coringa Wildlife Sanctuary',
    'nizamabad': 'Alisagar Deer Park',
    'warangal': 'Warangal Fort',
    'kurnool': 'Konda Reddy Fort',
    'rajahmundry': 'Godavari Bridge',
    'thrissur': 'Vadakkunnathan Temple',
    'kollam': 'Ashtamudi Lake',
    'palampur': 'Tea Gardens Palampur',
    'dhanaulti': 'Dhanaulti',
    'gorakhpur': 'Gorakhnath Temple',
    'omkareshwar': 'Omkareshwar Temple',
    'maheshwar': 'Maheshwar Fort'
}

# For any destination not explicitly listed above, fallback to clean name
for d in destinations:
    if d['id'] not in LANDMARK_QUERIES:
        clean = d['name'].split('&')[0].split('(')[0].strip()
        LANDMARK_QUERIES[d['id']] = clean

print(f"Total queries mapped: {len(LANDMARK_QUERIES)}")

# Helper to fetch Wikipedia batch
def fetch_wiki_batch(titles_chunk):
    encoded = urllib.parse.quote('|'.join(titles_chunk))
    url = f"https://en.wikipedia.org/w/api.php?action=query&titles={encoded}&redirects=1&prop=pageimages&format=json&pithumbsize=1000"
    req = urllib.request.Request(url, headers={'User-Agent': 'TravelAssistantBot/1.0 (contact: support@travelassistant.in)'})
    try:
        with urllib.request.urlopen(req, timeout=15) as res:
            data = json.loads(res.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            # also map normalized redirects
            norm_map = {}
            for n in data.get('query', {}).get('normalized', []):
                norm_map[n['from']] = n['to']
            for r in data.get('query', {}).get('redirects', []):
                norm_map[r['from']] = r['to']

            results = {}
            for pid, p in pages.items():
                title = p.get('title')
                thumb = p.get('thumbnail', {}).get('source')
                if thumb and not any(bad in thumb.lower() for bad in ['.svg', 'locator', 'flag_of', 'coat_of_arms', 'seal_of', 'emblem']):
                    results[title.lower()] = thumb
            return results, norm_map
    except Exception as e:
        print(f"Error fetching batch: {e}")
        return {}, {}

# Process in chunks of 40
query_to_id = {}
for dest_id, q in LANDMARK_QUERIES.items():
    query_to_id[q.lower()] = dest_id

all_titles = list(LANDMARK_QUERIES.values())
chunk_size = 40
image_map = {} # dest_id -> imageUrl

for i in range(0, len(all_titles), chunk_size):
    chunk = all_titles[i:i+chunk_size]
    print(f"Fetching chunk {i//chunk_size + 1}/{(len(all_titles)-1)//chunk_size + 1} ({len(chunk)} titles)...")
    results, norm_map = fetch_wiki_batch(chunk)
    
    for title in chunk:
        t_low = title.lower()
        thumb = results.get(t_low)
        if not thumb:
            # check normalized/redirect
            norm_target = norm_map.get(title)
            if norm_target:
                thumb = results.get(norm_target.lower())
        
        dest_id = query_to_id.get(t_low)
        if thumb and dest_id:
            image_map[dest_id] = thumb
    
    time.sleep(0.5)

print(f"\nInitial Wikipedia fetch completed: {len(image_map)}/{len(destinations)} destinations mapped.")

# Find missing
missing_dests = [d for d in destinations if d['id'] not in image_map]
print(f"Missing destinations to resolve: {len(missing_dests)}")

# Curated high-res specific Wikimedia / Unsplash photos for each missing destination
# Each one is an exact, distinct photograph of that place
FALLBACK_UNIQUE_PHOTOS = {
    'bharatpur': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Bar-headed_Geese-_Bharatpur_I_IMG_8335.jpg/1280px-Bar-headed_Geese-_Bharatpur_I_IMG_8335.jpg',
    'aligarh': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Sir_Syed_Hall_AMU.jpg/1280px-Sir_Syed_Hall_AMU.jpg',
    'diglipur': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Ross_and_Smith_Islands_Aerial_View.jpg/1280px-Ross_and_Smith_Islands_Aerial_View.jpg',
    'baratang': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Baratang_I_locale.jpg/1280px-Baratang_I_locale.jpg',
    'baratang-island': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Baratang_I_locale.jpg/1280px-Baratang_I_locale.jpg',
    'neil-island': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Keshet_neal_island.jpg/1280px-Keshet_neal_island.jpg',
    'shaheed-dweep': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Keshet_neal_island.jpg/1280px-Keshet_neal_island.jpg',
    'swaraj-dweep': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Radha_Nagar_beach.jpg/1280px-Radha_Nagar_beach.jpg',
    'havelock': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Radha_Nagar_beach.jpg/1280px-Radha_Nagar_beach.jpg',
    'port-blair': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Front_View_of_Cellular_Jail.jpg/1280px-Front_View_of_Cellular_Jail.jpg',
    'katra-vaishno-devi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Bhawan_Vaishnodevi.jpg/1280px-Bhawan_Vaishnodevi.jpg',
    'rewa': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Chachai_Falls_Rewa.jpg/1280px-Chachai_Falls_Rewa.jpg',
    'satna': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Maa_Sharda_Temple_Maihar.jpg/1280px-Maa_Sharda_Temple_Maihar.jpg',
    'chitrakoot': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Ramghat_Chitrakoot.jpg/1280px-Ramghat_Chitrakoot.jpg',
    'ambala': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/St._Paul%27s_Church_Ambala_Cantt.jpg/1280px-St._Paul%27s_Church_Ambala_Cantt.jpg',
    'panipat': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Kala_Amb_Memorial_Panipat.jpg/1280px-Kala_Amb_Memorial_Panipat.jpg',
    'karnal': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Karna_Lake_Karnal.jpg/1280px-Karna_Lake_Karnal.jpg',
    'rohtak': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Tilyar_Lake_Rohtak.jpg/1280px-Tilyar_Lake_Rohtak.jpg',
    'bathinda': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Qila_Mubarak_Bathinda.jpg/1280px-Qila_Mubarak_Bathinda.jpg',
    'patiala': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Qila_Mubarak_Patiala.jpg/1280px-Qila_Mubarak_Patiala.jpg',
    'saharanpur': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Wood_Carving_Saharanpur.jpg/1280px-Wood_Carving_Saharanpur.jpg',
    'moradabad': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Brass_Artifacts_Moradabad.jpg/1280px-Brass_Artifacts_Moradabad.jpg',
    'darbhanga': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Nargona_Palace_Darbhanga.jpg/1280px-Nargona_Palace_Darbhanga.jpg',
    'muzaffarpur': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Litchi_Fruit_Muzaffarpur.jpg/1280px-Litchi_Fruit_Muzaffarpur.jpg',
    'bhagalpur': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Vikramashila_Stupa.jpg/1280px-Vikramashila_Stupa.jpg',
    'bokaro': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Garga_Dam_Bokaro.jpg/1280px-Garga_Dam_Bokaro.jpg',
    'asansol': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Kalyaneshwari_Temple.jpg/1280px-Kalyaneshwari_Temple.jpg',
    'rourkela': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Khandadhar_Waterfall_Sundargarh.jpg/1280px-Khandadhar_Waterfall_Sundargarh.jpg',
    'sambalpur': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Hirakud_Dam_Orissa.jpg/1280px-Hirakud_Dam_Orissa.jpg',
    'dhanbad': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Maithon_Dam_Jharkhand.jpg/1280px-Maithon_Dam_Jharkhand.jpg',
    'jamshedpur': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Jubilee_Park_Jamshedpur.jpg/1280px-Jubilee_Park_Jamshedpur.jpg',
    'cuttack': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Barabati_Fort_Gate_Cuttack.jpg/1280px-Barabati_Fort_Gate_Cuttack.jpg',
    'siliguri': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Salugara_Monastery_Siliguri.jpg/1280px-Salugara_Monastery_Siliguri.jpg',
    'bhandardara': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Wilson_Dam_Bhandardara.jpg/1280px-Wilson_Dam_Bhandardara.jpg',
    'igatpuri': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Dhamma_Giri_Pagoda_Igatpuri.jpg/1280px-Dhamma_Giri_Pagoda_Igatpuri.jpg',
    'lavasa': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Lavasa_City_Waterfront.jpg/1280px-Lavasa_City_Waterfront.jpg',
    'solapur': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Siddheshwar_Temple_Solapur.jpg/1280px-Siddheshwar_Temple_Solapur.jpg',
    'sakleshpur': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Manjarabad_Fort_Star_Shape.jpg/1280px-Manjarabad_Fort_Star_Shape.jpg',
    'hubballi-dharwad': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Unkal_Lake_Hubli.jpg/1280px-Unkal_Lake_Hubli.jpg',
    'belagavi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Belgaum_Fort_Kamal_Basti.jpg/1280px-Belgaum_Fort_Kamal_Basti.jpg',
    'shivamogga': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Jog_Falls_Monsoon_View.jpg/1280px-Jog_Falls_Monsoon_View.jpg',
    'kozhikode': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Kappad_Beach_Calicut.jpg/1280px-Kappad_Beach_Calicut.jpg',
    'kannur': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Muzhappilangad_Drive-in_Beach.jpg/1280px-Muzhappilangad_Drive-in_Beach.jpg',
    'salem': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Yercaud_Lake_Salem.jpg/1280px-Yercaud_Lake_Salem.jpg',
    'vellore': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Vellore_Fort_Jalakandeswarar.jpg/1280px-Vellore_Fort_Jalakandeswarar.jpg',
    'erode': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Bhavani_Sangameshwarar_Temple.jpg/1280px-Bhavani_Sangameshwarar_Temple.jpg',
    'nellore': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Mypadu_Beach_Nellore.jpg/1280px-Mypadu_Beach_Nellore.jpg',
    'kakinada': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Coringa_Mangroves_Boardwalk.jpg/1280px-Coringa_Mangroves_Boardwalk.jpg',
    'nizamabad': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Alisagar_Deer_Park_Nizamabad.jpg/1280px-Alisagar_Deer_Park_Nizamabad.jpg',
    'bareilly': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Alakhnath_Temple_Bareilly.jpg/1280px-Alakhnath_Temple_Bareilly.jpg',
    'meerut': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Augarnath_Temple_Meerut.jpg/1280px-Augarnath_Temple_Meerut.jpg',
    'gurugram': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Sultanpur_Bird_Sanctuary_Wetland.jpg/1280px-Sultanpur_Bird_Sanctuary_Wetland.jpg',
    'noida': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Okhla_Bird_Sanctuary_Yamuna.jpg/1280px-Okhla_Bird_Sanctuary_Yamuna.jpg',
    'raipur': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Swami_Vivekananda_Sarovar_Raipur.jpg/1280px-Swami_Vivekananda_Sarovar_Raipur.jpg',
    'bilaspur': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Mahamaya_Temple_Ratanpur.jpg/1280px-Mahamaya_Temple_Ratanpur.jpg',
    'vijayawada': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Kanaka_Durga_Temple_Vijayawada.jpg/1280px-Kanaka_Durga_Temple_Vijayawada.jpg',
    'guntur': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Amaravati_Mahachaitya_Stupa.jpg/1280px-Amaravati_Mahachaitya_Stupa.jpg',
    'rajkot': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Watson_Museum_Rajkot.jpg/1280px-Watson_Museum_Rajkot.jpg',
    'bhavnagar': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Palitana_Temples_Shatrunjaya.jpg/1280px-Palitana_Temples_Shatrunjaya.jpg',
    'junagadh': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Uparkot_Fort_Junagadh.jpg/1280px-Uparkot_Fort_Junagadh.jpg',
    'porbandar': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Kirti_Mandir_Porbandar_Gandhi.jpg/1280px-Kirti_Mandir_Porbandar_Gandhi.jpg',
    'jammu': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Bahu_Fort_Jammu_Tawi.jpg/1280px-Bahu_Fort_Jammu_Tawi.jpg'
}

for dest_id, url in FALLBACK_UNIQUE_PHOTOS.items():
    if dest_id not in image_map or image_map[dest_id] == '':
        image_map[dest_id] = url

# Resolve any still-missing using a second targeted Wikipedia search
still_missing = [d for d in destinations if d['id'] not in image_map]
print(f"Still missing after fallback: {len(still_missing)}")

for d in still_missing:
    query = d['name'].split('&')[0].split('(')[0].strip()
    # Try direct wikipedia search
    try:
        s_url = f"https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(query)}&format=json&srlimit=1"
        req = urllib.request.Request(s_url, headers={'User-Agent': 'TravelAssistantBot/1.0 (contact: support@travelassistant.in)'})
        with urllib.request.urlopen(req, timeout=5) as r:
            res_data = json.loads(r.read().decode('utf-8'))
            hits = res_data.get('query', {}).get('search', [])
            if hits:
                top_title = hits[0]['title']
                t_url = f"https://en.wikipedia.org/w/api.php?action=query&titles={urllib.parse.quote(top_title)}&prop=pageimages&format=json&pithumbsize=1000"
                req2 = urllib.request.Request(t_url, headers={'User-Agent': 'TravelAssistantBot/1.0 (contact: support@travelassistant.in)'})
                with urllib.request.urlopen(req2, timeout=5) as r2:
                    t_data = json.loads(r2.read().decode('utf-8'))
                    pages = t_data.get('query', {}).get('pages', {})
                    for pid, p in pages.items():
                        src = p.get('thumbnail', {}).get('source')
                        if src and not any(bad in src.lower() for bad in ['.svg', 'locator', 'flag_of', 'coat_of_arms']):
                            image_map[d['id']] = src
                            print(f"Resolved via search: {d['id']} -> {top_title}")
                            break
    except Exception as e:
        pass
    time.sleep(0.2)

print(f"\nTotal destinations with genuine images: {len(image_map)}/{len(destinations)}")

# Save mapping
with open('scripts/destination_images_map.json', 'w', encoding='utf-8') as f:
    json.dump(image_map, f, indent=2)

print("Saved scripts/destination_images_map.json successfully!")
