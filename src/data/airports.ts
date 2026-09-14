export interface Airport {
  c: string; // IATA code (e.g. GWL, DEL, BOM)
  n: string; // Official airport name
  city: string;
  state: string;
  lat: number;
  lng: number;
}

export const INDIAN_AIRPORTS: Airport[] = [
  {
    "c": "DEL",
    "n": "Indira Gandhi International Airport",
    "city": "New Delhi",
    "state": "Delhi",
    "lat": 28.5562,
    "lng": 77.1
  },
  {
    "c": "AGR",
    "n": "Agra Airport (Kheria Air Force Station)",
    "city": "Agra",
    "state": "Uttar Pradesh",
    "lat": 27.1558,
    "lng": 77.9609
  },
  {
    "c": "LKO",
    "n": "Chaudhary Charan Singh International Airport",
    "city": "Lucknow",
    "state": "Uttar Pradesh",
    "lat": 26.7606,
    "lng": 80.8893
  },
  {
    "c": "VNS",
    "n": "Lal Bahadur Shastri International Airport",
    "city": "Varanasi",
    "state": "Uttar Pradesh",
    "lat": 25.4524,
    "lng": 82.8593
  },
  {
    "c": "AYJ",
    "n": "Maharishi Valmiki International Airport",
    "city": "Ayodhya",
    "state": "Uttar Pradesh",
    "lat": 26.7461,
    "lng": 82.1558
  },
  {
    "c": "KNU",
    "n": "Kanpur Airport (Chakeri Civil Aerodrome)",
    "city": "Kanpur",
    "state": "Uttar Pradesh",
    "lat": 26.4025,
    "lng": 80.4128
  },
  {
    "c": "IXD",
    "n": "Prayagraj Airport (Bamrauli)",
    "city": "Prayagraj",
    "state": "Uttar Pradesh",
    "lat": 25.4402,
    "lng": 81.7339
  },
  {
    "c": "BEK",
    "n": "Bareilly Airport (Trishul Civil Enclave)",
    "city": "Bareilly",
    "state": "Uttar Pradesh",
    "lat": 28.4222,
    "lng": 79.4503
  },
  {
    "c": "GOP",
    "n": "Gorakhpur Airport (Mahayogi Gorakhnath Enclave)",
    "city": "Gorakhpur",
    "state": "Uttar Pradesh",
    "lat": 26.7397,
    "lng": 83.4497
  },
  {
    "c": "HDO",
    "n": "Hindon Airport (Ghaziabad / Delhi NCR)",
    "city": "Ghaziabad",
    "state": "Uttar Pradesh",
    "lat": 28.7061,
    "lng": 77.3592
  },
  {
    "c": "DXN",
    "n": "Noida International Airport (Jewar)",
    "city": "Noida / Greater Noida",
    "state": "Uttar Pradesh",
    "lat": 28.1883,
    "lng": 77.6256
  },
  {
    "c": "KBK",
    "n": "Kushinagar International Airport",
    "city": "Kushinagar",
    "state": "Uttar Pradesh",
    "lat": 26.7725,
    "lng": 83.9031
  },
  {
    "c": "MBD",
    "n": "Moradabad Airport",
    "city": "Moradabad",
    "state": "Uttar Pradesh",
    "lat": 28.8472,
    "lng": 78.7761
  },
  {
    "c": "HRH",
    "n": "Aligarh Airport (Dhanipur Airstrip)",
    "city": "Aligarh",
    "state": "Uttar Pradesh",
    "lat": 27.8864,
    "lng": 78.1408
  },
  {
    "c": "AZH",
    "n": "Azamgarh Airport (Manduri)",
    "city": "Azamgarh",
    "state": "Uttar Pradesh",
    "lat": 26.155,
    "lng": 83.175
  },
  {
    "c": "SHV",
    "n": "Shravasti Airport",
    "city": "Shravasti",
    "state": "Uttar Pradesh",
    "lat": 27.5028,
    "lng": 82.0469
  },
  {
    "c": "CKT",
    "n": "Chitrakoot Airport (Dewangana)",
    "city": "Chitrakoot",
    "state": "Uttar Pradesh",
    "lat": 25.1883,
    "lng": 80.8653
  },
  {
    "c": "GWL",
    "n": "Rajmata Vijaya Raje Scindia Airport",
    "city": "Gwalior",
    "state": "Madhya Pradesh",
    "lat": 26.2933,
    "lng": 78.2277
  },
  {
    "c": "BHO",
    "n": "Raja Bhoj Airport",
    "city": "Bhopal",
    "state": "Madhya Pradesh",
    "lat": 23.2875,
    "lng": 77.3378
  },
  {
    "c": "IDR",
    "n": "Devi Ahilyabai Holkar Airport",
    "city": "Indore",
    "state": "Madhya Pradesh",
    "lat": 22.7217,
    "lng": 75.8011
  },
  {
    "c": "JLR",
    "n": "Jabalpur Airport (Dumna)",
    "city": "Jabalpur",
    "state": "Madhya Pradesh",
    "lat": 23.1778,
    "lng": 80.0522
  },
  {
    "c": "HJR",
    "n": "Khajuraho Airport",
    "city": "Khajuraho",
    "state": "Madhya Pradesh",
    "lat": 24.8172,
    "lng": 79.9197
  },
  {
    "c": "REW",
    "n": "Rewa Airport (Chorhatta)",
    "city": "Rewa",
    "state": "Madhya Pradesh",
    "lat": 24.5361,
    "lng": 81.2269
  },
  {
    "c": "UJN",
    "n": "Ujjain Airstrip (Datana)",
    "city": "Ujjain",
    "state": "Madhya Pradesh",
    "lat": 23.1167,
    "lng": 75.8333
  },
  {
    "c": "BOM",
    "n": "Chhatrapati Shivaji Maharaj International Airport",
    "city": "Mumbai",
    "state": "Maharashtra",
    "lat": 19.0896,
    "lng": 72.8656
  },
  {
    "c": "NMI",
    "n": "Navi Mumbai International Airport",
    "city": "Navi Mumbai",
    "state": "Maharashtra",
    "lat": 18.9902,
    "lng": 73.0694
  },
  {
    "c": "PNQ",
    "n": "Pune International Airport (Lohegaon)",
    "city": "Pune",
    "state": "Maharashtra",
    "lat": 18.5822,
    "lng": 73.9197
  },
  {
    "c": "NAG",
    "n": "Dr. Babasaheb Ambedkar International Airport",
    "city": "Nagpur",
    "state": "Maharashtra",
    "lat": 21.0922,
    "lng": 79.0472
  },
  {
    "c": "IXU",
    "n": "Aurangabad Airport (Chhatrapati Sambhajinagar)",
    "city": "Aurangabad",
    "state": "Maharashtra",
    "lat": 19.8631,
    "lng": 75.3981
  },
  {
    "c": "SAG",
    "n": "Shirdi International Airport (Kakadi)",
    "city": "Shirdi",
    "state": "Maharashtra",
    "lat": 19.6897,
    "lng": 74.3789
  },
  {
    "c": "ISK",
    "n": "Nashik Airport (Ozar Civil Enclave)",
    "city": "Nashik",
    "state": "Maharashtra",
    "lat": 20.1192,
    "lng": 73.9136
  },
  {
    "c": "KLH",
    "n": "Kolhapur Airport (Chhatrapati Rajaram Maharaj)",
    "city": "Kolhapur",
    "state": "Maharashtra",
    "lat": 16.6644,
    "lng": 74.2817
  },
  {
    "c": "NDC",
    "n": "Shri Guru Gobind Singh Ji Airport",
    "city": "Nanded",
    "state": "Maharashtra",
    "lat": 19.1836,
    "lng": 77.3197
  },
  {
    "c": "JLG",
    "n": "Jalgaon Airport",
    "city": "Jalgaon",
    "state": "Maharashtra",
    "lat": 20.9639,
    "lng": 75.6322
  },
  {
    "c": "SDW",
    "n": "Sindhudurg Airport (Chipi / Tarkarli)",
    "city": "Sindhudurg / Malvan",
    "state": "Maharashtra",
    "lat": 15.9083,
    "lng": 73.5222
  },
  {
    "c": "GDB",
    "n": "Gondia Airport (Birsi)",
    "city": "Gondia",
    "state": "Maharashtra",
    "lat": 21.5283,
    "lng": 80.2892
  },
  {
    "c": "SSE",
    "n": "Solapur Airport (Boramani)",
    "city": "Solapur",
    "state": "Maharashtra",
    "lat": 17.6289,
    "lng": 75.9333
  },
  {
    "c": "JAI",
    "n": "Jaipur International Airport (Sanganer)",
    "city": "Jaipur",
    "state": "Rajasthan",
    "lat": 26.8242,
    "lng": 75.8122
  },
  {
    "c": "UDR",
    "n": "Maharana Pratap Airport (Dabok)",
    "city": "Udaipur",
    "state": "Rajasthan",
    "lat": 24.6177,
    "lng": 73.8961
  },
  {
    "c": "JDH",
    "n": "Jodhpur Airport (Civil Enclave)",
    "city": "Jodhpur",
    "state": "Rajasthan",
    "lat": 26.2511,
    "lng": 73.0489
  },
  {
    "c": "JSA",
    "n": "Jaisalmer Airport (Civil Enclave)",
    "city": "Jaisalmer",
    "state": "Rajasthan",
    "lat": 26.8894,
    "lng": 70.8653
  },
  {
    "c": "BKB",
    "n": "Bikaner Airport (Nal Civil Enclave)",
    "city": "Bikaner",
    "state": "Rajasthan",
    "lat": 28.0706,
    "lng": 73.2081
  },
  {
    "c": "KQH",
    "n": "Kishangarh Airport (Ajmer / Pushkar)",
    "city": "Ajmer / Pushkar",
    "state": "Rajasthan",
    "lat": 26.5983,
    "lng": 74.8156
  },
  {
    "c": "KTU",
    "n": "Kota Airport",
    "city": "Kota",
    "state": "Rajasthan",
    "lat": 25.1603,
    "lng": 75.8456
  },
  {
    "c": "GOI",
    "n": "Dabolim Airport",
    "city": "Goa (South)",
    "state": "Goa",
    "lat": 15.3808,
    "lng": 73.8313
  },
  {
    "c": "GOX",
    "n": "Manohar International Airport (Mopa)",
    "city": "Goa (North)",
    "state": "Goa",
    "lat": 15.7667,
    "lng": 73.8667
  },
  {
    "c": "AMD",
    "n": "Sardar Vallabhbhai Patel International Airport",
    "city": "Ahmedabad",
    "state": "Gujarat",
    "lat": 23.0772,
    "lng": 72.6347
  },
  {
    "c": "STV",
    "n": "Surat International Airport",
    "city": "Surat",
    "state": "Gujarat",
    "lat": 21.1139,
    "lng": 72.7419
  },
  {
    "c": "BDQ",
    "n": "Vadodara Airport (Civil Aerodrome Harni)",
    "city": "Vadodara",
    "state": "Gujarat",
    "lat": 22.3361,
    "lng": 73.2263
  },
  {
    "c": "HSR",
    "n": "Rajkot International Airport (Hirasar)",
    "city": "Rajkot",
    "state": "Gujarat",
    "lat": 22.3611,
    "lng": 70.9903
  },
  {
    "c": "BHU",
    "n": "Bhavnagar Airport",
    "city": "Bhavnagar",
    "state": "Gujarat",
    "lat": 21.7522,
    "lng": 72.1856
  },
  {
    "c": "JGA",
    "n": "Jamnagar Airport (Govardhanpur Enclave)",
    "city": "Jamnagar",
    "state": "Gujarat",
    "lat": 22.465,
    "lng": 70.0125
  },
  {
    "c": "PBD",
    "n": "Porbandar Airport",
    "city": "Porbandar",
    "state": "Gujarat",
    "lat": 21.6489,
    "lng": 69.6575
  },
  {
    "c": "BHJ",
    "n": "Bhuj Airport (Shyamji Krishna Varma Enclave)",
    "city": "Bhuj / Kutch",
    "state": "Gujarat",
    "lat": 23.2878,
    "lng": 69.67
  },
  {
    "c": "IXY",
    "n": "Kandla Airport (Gandhidham)",
    "city": "Gandhidham / Kandla",
    "state": "Gujarat",
    "lat": 23.1122,
    "lng": 70.1006
  },
  {
    "c": "IXK",
    "n": "Keshod Airport (Junagadh / Somnath Gateway)",
    "city": "Junagadh / Keshod",
    "state": "Gujarat",
    "lat": 21.3172,
    "lng": 70.2694
  },
  {
    "c": "DIU",
    "n": "Diu Airport",
    "city": "Diu",
    "state": "Dadra & Nagar Haveli and Daman & Diu",
    "lat": 20.7136,
    "lng": 70.9214
  },
  {
    "c": "NMB",
    "n": "Daman Airport",
    "city": "Daman",
    "state": "Dadra & Nagar Haveli and Daman & Diu",
    "lat": 20.4339,
    "lng": 72.8433
  },
  {
    "c": "VA1Q",
    "n": "Mundra Airport",
    "city": "Mundra",
    "state": "Gujarat",
    "lat": 22.8408,
    "lng": 69.7347
  },
  {
    "c": "BLR",
    "n": "Kempegowda International Airport",
    "city": "Bengaluru",
    "state": "Karnataka",
    "lat": 13.1986,
    "lng": 77.7066
  },
  {
    "c": "MYQ",
    "n": "Mysuru Airport (Mandakalli)",
    "city": "Mysuru",
    "state": "Karnataka",
    "lat": 12.2294,
    "lng": 76.6508
  },
  {
    "c": "IXE",
    "n": "Mangaluru International Airport (Bajpe)",
    "city": "Mangaluru",
    "state": "Karnataka",
    "lat": 12.9614,
    "lng": 74.89
  },
  {
    "c": "HBX",
    "n": "Hubballi Airport",
    "city": "Hubballi / Dharwad",
    "state": "Karnataka",
    "lat": 15.3617,
    "lng": 75.0847
  },
  {
    "c": "IXG",
    "n": "Belagavi Airport (Sambre)",
    "city": "Belagavi",
    "state": "Karnataka",
    "lat": 15.8592,
    "lng": 74.6183
  },
  {
    "c": "GBI",
    "n": "Kalaburagi Airport (Gulbarga)",
    "city": "Kalaburagi",
    "state": "Karnataka",
    "lat": 17.3006,
    "lng": 76.9536
  },
  {
    "c": "IXX",
    "n": "Bidar Airport (Civil Enclave)",
    "city": "Bidar",
    "state": "Karnataka",
    "lat": 17.9069,
    "lng": 77.4844
  },
  {
    "c": "RQY",
    "n": "Shivamogga Airport (Kuvempu)",
    "city": "Shivamogga",
    "state": "Karnataka",
    "lat": 13.8822,
    "lng": 75.6322
  },
  {
    "c": "VDY",
    "n": "Jindal Vijaynagar Airport (Toranagallu / Hampi)",
    "city": "Ballari / Hampi",
    "state": "Karnataka",
    "lat": 15.1719,
    "lng": 76.6347
  },
  {
    "c": "MAA",
    "n": "Chennai International Airport (Meenambakkam)",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "lat": 12.9941,
    "lng": 80.1709
  },
  {
    "c": "CJB",
    "n": "Coimbatore International Airport (Peelamedu)",
    "city": "Coimbatore (Ooty Gateway)",
    "state": "Tamil Nadu",
    "lat": 11.0298,
    "lng": 77.0434
  },
  {
    "c": "IXM",
    "n": "Madurai Airport",
    "city": "Madurai",
    "state": "Tamil Nadu",
    "lat": 9.8345,
    "lng": 78.0934
  },
  {
    "c": "TRZ",
    "n": "Tiruchirappalli International Airport",
    "city": "Tiruchirappalli",
    "state": "Tamil Nadu",
    "lat": 10.7653,
    "lng": 78.7097
  },
  {
    "c": "SXV",
    "n": "Salem Airport (Kamalapuram)",
    "city": "Salem (Yercaud Gateway)",
    "state": "Tamil Nadu",
    "lat": 11.7806,
    "lng": 78.0647
  },
  {
    "c": "TCR",
    "n": "Tuticorin Airport (Thoothukudi)",
    "city": "Thoothukudi / Tirunelveli",
    "state": "Tamil Nadu",
    "lat": 8.7239,
    "lng": 78.0264
  },
  {
    "c": "NVY",
    "n": "Neyveli Airport",
    "city": "Neyveli",
    "state": "Tamil Nadu",
    "lat": 11.5264,
    "lng": 79.5289
  },
  {
    "c": "PNY",
    "n": "Puducherry Airport (Lawspet)",
    "city": "Puducherry",
    "state": "Puducherry",
    "lat": 11.9681,
    "lng": 79.8106
  },
  {
    "c": "COK",
    "n": "Cochin International Airport (Nedumbassery)",
    "city": "Kochi",
    "state": "Kerala",
    "lat": 10.1518,
    "lng": 76.393
  },
  {
    "c": "TRV",
    "n": "Thiruvananthapuram International Airport",
    "city": "Thiruvananthapuram (Kovalam/Varkala)",
    "state": "Kerala",
    "lat": 8.4821,
    "lng": 76.92
  },
  {
    "c": "CCJ",
    "n": "Calicut International Airport (Karipur)",
    "city": "Kozhikode",
    "state": "Kerala",
    "lat": 11.1368,
    "lng": 75.9553
  },
  {
    "c": "CNN",
    "n": "Kannur International Airport (Mattannur)",
    "city": "Kannur / Wayanad",
    "state": "Kerala",
    "lat": 11.9169,
    "lng": 75.5492
  },
  {
    "c": "HYD",
    "n": "Rajiv Gandhi International Airport (Shamshabad)",
    "city": "Hyderabad",
    "state": "Telangana",
    "lat": 17.2403,
    "lng": 78.4294
  },
  {
    "c": "WGC",
    "n": "Warangal Airport (Mamnoor)",
    "city": "Warangal",
    "state": "Telangana",
    "lat": 17.9189,
    "lng": 79.6014
  },
  {
    "c": "VTZ",
    "n": "Visakhapatnam International Airport",
    "city": "Visakhapatnam (Vizag)",
    "state": "Andhra Pradesh",
    "lat": 17.7212,
    "lng": 83.2245
  },
  {
    "c": "VGA",
    "n": "Vijayawada International Airport (Gannavaram)",
    "city": "Vijayawada / Amaravati",
    "state": "Andhra Pradesh",
    "lat": 16.5303,
    "lng": 80.7969
  },
  {
    "c": "TIR",
    "n": "Tirupati Airport (Renigunta)",
    "city": "Tirupati",
    "state": "Andhra Pradesh",
    "lat": 13.6325,
    "lng": 79.5436
  },
  {
    "c": "RJA",
    "n": "Rajahmundry Airport (Madhurapudi)",
    "city": "Rajahmundry",
    "state": "Andhra Pradesh",
    "lat": 17.1103,
    "lng": 81.8183
  },
  {
    "c": "CDP",
    "n": "Kadapa Airport",
    "city": "Kadapa",
    "state": "Andhra Pradesh",
    "lat": 14.51,
    "lng": 78.7728
  },
  {
    "c": "KJB",
    "n": "Kurnool Airport (Uyyalawada Narasimha Reddy)",
    "city": "Kurnool",
    "state": "Andhra Pradesh",
    "lat": 15.7125,
    "lng": 78.2917
  },
  {
    "c": "IXC",
    "n": "Shaheed Bhagat Singh International Airport",
    "city": "Chandigarh / Mohali",
    "state": "Chandigarh",
    "lat": 30.6735,
    "lng": 76.7885
  },
  {
    "c": "ATQ",
    "n": "Sri Guru Ram Dass Jee International Airport",
    "city": "Amritsar",
    "state": "Punjab",
    "lat": 31.7096,
    "lng": 74.7973
  },
  {
    "c": "AIP",
    "n": "Adampur Airport (Jalandhar Civil Enclave)",
    "city": "Jalandhar / Adampur",
    "state": "Punjab",
    "lat": 31.4339,
    "lng": 75.7578
  },
  {
    "c": "BUP",
    "n": "Bathinda Airport (Virpal Kalan Enclave)",
    "city": "Bathinda",
    "state": "Punjab",
    "lat": 30.2708,
    "lng": 74.7572
  },
  {
    "c": "LUH",
    "n": "Ludhiana Airport (Sahnewal)",
    "city": "Ludhiana",
    "state": "Punjab",
    "lat": 30.855,
    "lng": 75.9558
  },
  {
    "c": "IXP",
    "n": "Pathankot Airport",
    "city": "Pathankot (Dalhousie Gateway)",
    "state": "Punjab",
    "lat": 32.2339,
    "lng": 75.6339
  },
  {
    "c": "HSS",
    "n": "Hisar Airport (Maharaja Agrasen)",
    "city": "Hisar",
    "state": "Haryana",
    "lat": 29.1794,
    "lng": 75.7547
  },
  {
    "c": "ABX",
    "n": "Ambala Air Force Station / Civil Enclave",
    "city": "Ambala",
    "state": "Haryana",
    "lat": 30.3689,
    "lng": 76.8153
  },
  {
    "c": "DED",
    "n": "Jolly Grant Airport",
    "city": "Dehradun / Rishikesh",
    "state": "Uttarakhand",
    "lat": 30.1897,
    "lng": 78.1803
  },
  {
    "c": "PGH",
    "n": "Pantnagar Airport",
    "city": "Nainital / Pantnagar / Corbett",
    "state": "Uttarakhand",
    "lat": 29.0333,
    "lng": 79.4739
  },
  {
    "c": "NNS",
    "n": "Naini Saini Airport",
    "city": "Pithoragarh",
    "state": "Uttarakhand",
    "lat": 29.5878,
    "lng": 80.2444
  },
  {
    "c": "SLV",
    "n": "Shimla Airport (Jubbarhatti)",
    "city": "Shimla",
    "state": "Himachal Pradesh",
    "lat": 31.0818,
    "lng": 77.0679
  },
  {
    "c": "KUU",
    "n": "Kullu–Manali Airport (Bhuntar)",
    "city": "Kullu / Manali / Kasol",
    "state": "Himachal Pradesh",
    "lat": 31.8767,
    "lng": 77.1544
  },
  {
    "c": "DHM",
    "n": "Kangra Airport (Gaggal)",
    "city": "Dharamshala / McLeod Ganj",
    "state": "Himachal Pradesh",
    "lat": 32.1651,
    "lng": 76.2634
  },
  {
    "c": "SXR",
    "n": "Sheikh ul-Alam International Airport",
    "city": "Srinagar",
    "state": "Jammu & Kashmir",
    "lat": 33.9871,
    "lng": 74.7744
  },
  {
    "c": "IXJ",
    "n": "Jammu Airport (Satwari Civil Enclave)",
    "city": "Jammu (Katra / Vaishno Devi Gateway)",
    "state": "Jammu & Kashmir",
    "lat": 32.6891,
    "lng": 74.8374
  },
  {
    "c": "IXL",
    "n": "Kushok Bakula Rimpochee Airport",
    "city": "Leh",
    "state": "Ladakh",
    "lat": 34.1359,
    "lng": 77.5465
  },
  {
    "c": "VI65",
    "n": "Kargil Civil Enclave / Airport",
    "city": "Kargil",
    "state": "Ladakh",
    "lat": 34.5217,
    "lng": 76.1558
  },
  {
    "c": "CCU",
    "n": "Netaji Subhash Chandra Bose International Airport",
    "city": "Kolkata",
    "state": "West Bengal",
    "lat": 22.6547,
    "lng": 88.4467
  },
  {
    "c": "IXB",
    "n": "Bagdogra International Airport",
    "city": "Siliguri (Darjeeling & Sikkim Gateway)",
    "state": "West Bengal",
    "lat": 26.6812,
    "lng": 88.3286
  },
  {
    "c": "RDP",
    "n": "Kazi Nazrul Islam Airport (Andal)",
    "city": "Durgapur / Asansol",
    "state": "West Bengal",
    "lat": 23.6231,
    "lng": 87.2417
  },
  {
    "c": "COH",
    "n": "Cooch Behar Airport",
    "city": "Cooch Behar",
    "state": "West Bengal",
    "lat": 26.3308,
    "lng": 89.4678
  },
  {
    "c": "PAT",
    "n": "Jay Prakash Narayan Airport",
    "city": "Patna",
    "state": "Bihar",
    "lat": 25.5913,
    "lng": 85.088
  },
  {
    "c": "GAY",
    "n": "Gaya International Airport",
    "city": "Gaya / Bodh Gaya",
    "state": "Bihar",
    "lat": 24.7442,
    "lng": 84.9511
  },
  {
    "c": "DBR",
    "n": "Darbhanga Airport",
    "city": "Darbhanga",
    "state": "Bihar",
    "lat": 26.195,
    "lng": 85.9189
  },
  {
    "c": "IXR",
    "n": "Birsa Munda Airport",
    "city": "Ranchi",
    "state": "Jharkhand",
    "lat": 23.3143,
    "lng": 85.3217
  },
  {
    "c": "DGH",
    "n": "Deoghar International Airport",
    "city": "Deoghar (Baidyanath Dham)",
    "state": "Jharkhand",
    "lat": 24.4439,
    "lng": 86.7058
  },
  {
    "c": "IXW",
    "n": "Sonari Airport",
    "city": "Jamshedpur",
    "state": "Jharkhand",
    "lat": 22.8131,
    "lng": 86.1689
  },
  {
    "c": "BBI",
    "n": "Biju Patnaik International Airport",
    "city": "Bhubaneswar (Puri / Konark Gateway)",
    "state": "Odisha",
    "lat": 20.2444,
    "lng": 85.8178
  },
  {
    "c": "JRG",
    "n": "Veer Surendra Sai Airport",
    "city": "Jharsuguda",
    "state": "Odisha",
    "lat": 21.9142,
    "lng": 84.0506
  },
  {
    "c": "RRK",
    "n": "Rourkela Airport",
    "city": "Rourkela",
    "state": "Odisha",
    "lat": 22.2567,
    "lng": 84.8144
  },
  {
    "c": "PYB",
    "n": "Jeypore Airport",
    "city": "Jeypore / Koraput",
    "state": "Odisha",
    "lat": 18.8778,
    "lng": 82.5539
  },
  {
    "c": "UKE",
    "n": "Utkela Airport",
    "city": "Kalahandi / Bhawanipatna",
    "state": "Odisha",
    "lat": 20.1017,
    "lng": 83.1817
  },
  {
    "c": "RPR",
    "n": "Swami Vivekananda Airport",
    "city": "Raipur",
    "state": "Chhattisgarh",
    "lat": 21.1804,
    "lng": 81.7388
  },
  {
    "c": "PAB",
    "n": "Bilaspur Airport (Bilasa Devi Kevat)",
    "city": "Bilaspur",
    "state": "Chhattisgarh",
    "lat": 21.9886,
    "lng": 82.1103
  },
  {
    "c": "JGB",
    "n": "Jagdalpur Airport (Maa Danteshwari)",
    "city": "Jagdalpur (Bastar)",
    "state": "Chhattisgarh",
    "lat": 19.0733,
    "lng": 82.0336
  },
  {
    "c": "RGH",
    "n": "Ambikapur Airport (Maa Mahamaya)",
    "city": "Ambikapur",
    "state": "Chhattisgarh",
    "lat": 23.1239,
    "lng": 83.1883
  },
  {
    "c": "GAU",
    "n": "Lokpriya Gopinath Bordoloi International Airport",
    "city": "Guwahati",
    "state": "Assam",
    "lat": 26.1061,
    "lng": 91.5859
  },
  {
    "c": "DIB",
    "n": "Dibrugarh Airport (Mohanbari)",
    "city": "Dibrugarh",
    "state": "Assam",
    "lat": 27.4839,
    "lng": 95.0181
  },
  {
    "c": "IXS",
    "n": "Silchar Airport (Kumbhirgram)",
    "city": "Silchar",
    "state": "Assam",
    "lat": 24.9128,
    "lng": 92.9789
  },
  {
    "c": "JRH",
    "n": "Jorhat Airport (Rowriah / Kaziranga Gateway)",
    "city": "Jorhat / Kaziranga",
    "state": "Assam",
    "lat": 26.7317,
    "lng": 94.1756
  },
  {
    "c": "TEZ",
    "n": "Tezpur Airport (Salonibari)",
    "city": "Tezpur",
    "state": "Assam",
    "lat": 26.7094,
    "lng": 92.7989
  },
  {
    "c": "IXI",
    "n": "Lilabari Airport (North Lakhimpur)",
    "city": "North Lakhimpur",
    "state": "Assam",
    "lat": 27.2961,
    "lng": 94.0983
  },
  {
    "c": "RUP",
    "n": "Rupsi Airport",
    "city": "Dhubri / Kokrajhar",
    "state": "Assam",
    "lat": 26.1408,
    "lng": 89.9078
  },
  {
    "c": "SHL",
    "n": "Shillong Airport (Umroi)",
    "city": "Shillong (Meghalaya)",
    "state": "Meghalaya",
    "lat": 25.7036,
    "lng": 91.9786
  },
  {
    "c": "PYG",
    "n": "Pakyong Airport",
    "city": "Gangtok (Sikkim)",
    "state": "Sikkim",
    "lat": 27.2344,
    "lng": 88.5886
  },
  {
    "c": "IMF",
    "n": "Bir Tikendrajit International Airport",
    "city": "Imphal",
    "state": "Manipur",
    "lat": 24.76,
    "lng": 93.8967
  },
  {
    "c": "IXA",
    "n": "Maharaja Bir Bikram Airport",
    "city": "Agartala",
    "state": "Tripura",
    "lat": 23.8869,
    "lng": 91.2406
  },
  {
    "c": "DMU",
    "n": "Dimapur Airport",
    "city": "Dimapur (Kohima Gateway)",
    "state": "Nagaland",
    "lat": 25.8839,
    "lng": 93.7711
  },
  {
    "c": "AJL",
    "n": "Lengpui Airport",
    "city": "Aizawl",
    "state": "Mizoram",
    "lat": 23.8406,
    "lng": 92.6194
  },
  {
    "c": "HGI",
    "n": "Donyi Polo Airport (Hollongi)",
    "city": "Itanagar",
    "state": "Arunachal Pradesh",
    "lat": 26.9856,
    "lng": 93.6389
  },
  {
    "c": "IXT",
    "n": "Pasighat Airport",
    "city": "Pasighat",
    "state": "Arunachal Pradesh",
    "lat": 28.0664,
    "lng": 95.3347
  },
  {
    "c": "TEI",
    "n": "Tezu Airport",
    "city": "Tezu",
    "state": "Arunachal Pradesh",
    "lat": 27.9408,
    "lng": 96.1347
  },
  {
    "c": "IXZ",
    "n": "Veer Savarkar International Airport",
    "city": "Port Blair (Andaman Islands)",
    "state": "Andaman & Nicobar Islands",
    "lat": 11.6412,
    "lng": 92.7297
  },
  {
    "c": "CBD",
    "n": "Car Nicobar Air Force Station Enclave",
    "city": "Car Nicobar",
    "state": "Andaman & Nicobar Islands",
    "lat": 9.1539,
    "lng": 92.8189
  },
  {
    "c": "AGX",
    "n": "Agatti Airport",
    "city": "Agatti Island (Lakshadweep)",
    "state": "Lakshadweep",
    "lat": 10.8242,
    "lng": 72.1764
  }
];

// Haversine distance in km
function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Find nearest airport to GPS coordinates
export function findNearestAirport(lat: number, lng: number): { airport: Airport; distanceKm: number } {
  let closest = INDIAN_AIRPORTS[0];
  let minDistance = Infinity;

  for (const ap of INDIAN_AIRPORTS) {
    const d = getDistanceKm(lat, lng, ap.lat, ap.lng);
    if (d < minDistance) {
      minDistance = d;
      closest = ap;
    }
  }

  return { airport: closest, distanceKm: minDistance };
}

// Search airports by city, IATA code, name, or state
export function searchAirports(query: string, limit: number = 25): Airport[] {
  const q = query.trim().toUpperCase();
  if (!q) return INDIAN_AIRPORTS.slice(0, limit);

  return INDIAN_AIRPORTS.filter(
    (ap) =>
      ap.c.toUpperCase().includes(q) ||
      ap.city.toUpperCase().includes(q) ||
      ap.n.toUpperCase().includes(q) ||
      ap.state.toUpperCase().includes(q)
  ).slice(0, limit);
}
