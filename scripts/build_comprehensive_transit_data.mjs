// scripts/build_comprehensive_transit_data.mjs
import fs from 'fs';
import path from 'path';

// ==========================================
// 1. COMPREHENSIVE INDIAN AIRPORTS DATASET
// ==========================================
const AIRPORTS = [
  // Delhi NCT
  { c: 'DEL', n: 'Indira Gandhi International Airport', city: 'New Delhi', state: 'Delhi', lat: 28.5562, lng: 77.1000 },

  // Uttar Pradesh
  { c: 'AGR', n: 'Agra Airport (Kheria Air Force Station)', city: 'Agra', state: 'Uttar Pradesh', lat: 27.1558, lng: 77.9609 },
  { c: 'LKO', n: 'Chaudhary Charan Singh International Airport', city: 'Lucknow', state: 'Uttar Pradesh', lat: 26.7606, lng: 80.8893 },
  { c: 'VNS', n: 'Lal Bahadur Shastri International Airport', city: 'Varanasi', state: 'Uttar Pradesh', lat: 25.4524, lng: 82.8593 },
  { c: 'AYJ', n: 'Maharishi Valmiki International Airport', city: 'Ayodhya', state: 'Uttar Pradesh', lat: 26.7461, lng: 82.1558 },
  { c: 'KNU', n: 'Kanpur Airport (Chakeri Civil Aerodrome)', city: 'Kanpur', state: 'Uttar Pradesh', lat: 26.4025, lng: 80.4128 },
  { c: 'IXD', n: 'Prayagraj Airport (Bamrauli)', city: 'Prayagraj', state: 'Uttar Pradesh', lat: 25.4402, lng: 81.7339 },
  { c: 'BEK', n: 'Bareilly Airport (Trishul Civil Enclave)', city: 'Bareilly', state: 'Uttar Pradesh', lat: 28.4222, lng: 79.4503 },
  { c: 'GOP', n: 'Gorakhpur Airport (Mahayogi Gorakhnath Enclave)', city: 'Gorakhpur', state: 'Uttar Pradesh', lat: 26.7397, lng: 83.4497 },
  { c: 'HDO', n: 'Hindon Airport (Ghaziabad / Delhi NCR)', city: 'Ghaziabad', state: 'Uttar Pradesh', lat: 28.7061, lng: 77.3592 },
  { c: 'DXN', n: 'Noida International Airport (Jewar)', city: 'Noida / Greater Noida', state: 'Uttar Pradesh', lat: 28.1883, lng: 77.6256 },
  { c: 'KBK', n: 'Kushinagar International Airport', city: 'Kushinagar', state: 'Uttar Pradesh', lat: 26.7725, lng: 83.9031 },
  { c: 'MBD', n: 'Moradabad Airport', city: 'Moradabad', state: 'Uttar Pradesh', lat: 28.8472, lng: 78.7761 },
  { c: 'HRH', n: 'Aligarh Airport (Dhanipur Airstrip)', city: 'Aligarh', state: 'Uttar Pradesh', lat: 27.8864, lng: 78.1408 },
  { c: 'AZH', n: 'Azamgarh Airport (Manduri)', city: 'Azamgarh', state: 'Uttar Pradesh', lat: 26.1550, lng: 83.1750 },
  { c: 'SHV', n: 'Shravasti Airport', city: 'Shravasti', state: 'Uttar Pradesh', lat: 27.5028, lng: 82.0469 },
  { c: 'CKT', n: 'Chitrakoot Airport (Dewangana)', city: 'Chitrakoot', state: 'Uttar Pradesh', lat: 25.1883, lng: 80.8653 },

  // Madhya Pradesh
  { c: 'GWL', n: 'Rajmata Vijaya Raje Scindia Airport', city: 'Gwalior', state: 'Madhya Pradesh', lat: 26.2933, lng: 78.2277 },
  { c: 'BHO', n: 'Raja Bhoj Airport', city: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2875, lng: 77.3378 },
  { c: 'IDR', n: 'Devi Ahilyabai Holkar Airport', city: 'Indore', state: 'Madhya Pradesh', lat: 22.7217, lng: 75.8011 },
  { c: 'JLR', n: 'Jabalpur Airport (Dumna)', city: 'Jabalpur', state: 'Madhya Pradesh', lat: 23.1778, lng: 80.0522 },
  { c: 'HJR', n: 'Khajuraho Airport', city: 'Khajuraho', state: 'Madhya Pradesh', lat: 24.8172, lng: 79.9197 },
  { c: 'REW', n: 'Rewa Airport (Chorhatta)', city: 'Rewa', state: 'Madhya Pradesh', lat: 24.5361, lng: 81.2269 },
  { c: 'UJN', n: 'Ujjain Airstrip (Datana)', city: 'Ujjain', state: 'Madhya Pradesh', lat: 23.1167, lng: 75.8333 },

  // Maharashtra
  { c: 'BOM', n: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai', state: 'Maharashtra', lat: 19.0896, lng: 72.8656 },
  { c: 'NMI', n: 'Navi Mumbai International Airport', city: 'Navi Mumbai', state: 'Maharashtra', lat: 18.9902, lng: 73.0694 },
  { c: 'PNQ', n: 'Pune International Airport (Lohegaon)', city: 'Pune', state: 'Maharashtra', lat: 18.5822, lng: 73.9197 },
  { c: 'NAG', n: 'Dr. Babasaheb Ambedkar International Airport', city: 'Nagpur', state: 'Maharashtra', lat: 21.0922, lng: 79.0472 },
  { c: 'IXU', n: 'Aurangabad Airport (Chhatrapati Sambhajinagar)', city: 'Aurangabad', state: 'Maharashtra', lat: 19.8631, lng: 75.3981 },
  { c: 'SAG', n: 'Shirdi International Airport (Kakadi)', city: 'Shirdi', state: 'Maharashtra', lat: 19.6897, lng: 74.3789 },
  { c: 'ISK', n: 'Nashik Airport (Ozar Civil Enclave)', city: 'Nashik', state: 'Maharashtra', lat: 20.1192, lng: 73.9136 },
  { c: 'KLH', n: 'Kolhapur Airport (Chhatrapati Rajaram Maharaj)', city: 'Kolhapur', state: 'Maharashtra', lat: 16.6644, lng: 74.2817 },
  { c: 'NDC', n: 'Shri Guru Gobind Singh Ji Airport', city: 'Nanded', state: 'Maharashtra', lat: 19.1836, lng: 77.3197 },
  { c: 'JLG', n: 'Jalgaon Airport', city: 'Jalgaon', state: 'Maharashtra', lat: 20.9639, lng: 75.6322 },
  { c: 'SDW', n: 'Sindhudurg Airport (Chipi / Tarkarli)', city: 'Sindhudurg / Malvan', state: 'Maharashtra', lat: 15.9083, lng: 73.5222 },
  { c: 'GDB', n: 'Gondia Airport (Birsi)', city: 'Gondia', state: 'Maharashtra', lat: 21.5283, lng: 80.2892 },
  { c: 'SSE', n: 'Solapur Airport (Boramani)', city: 'Solapur', state: 'Maharashtra', lat: 17.6289, lng: 75.9333 },

  // Rajasthan
  { c: 'JAI', n: 'Jaipur International Airport (Sanganer)', city: 'Jaipur', state: 'Rajasthan', lat: 26.8242, lng: 75.8122 },
  { c: 'UDR', n: 'Maharana Pratap Airport (Dabok)', city: 'Udaipur', state: 'Rajasthan', lat: 24.6177, lng: 73.8961 },
  { c: 'JDH', n: 'Jodhpur Airport (Civil Enclave)', city: 'Jodhpur', state: 'Rajasthan', lat: 26.2511, lng: 73.0489 },
  { c: 'JSA', n: 'Jaisalmer Airport (Civil Enclave)', city: 'Jaisalmer', state: 'Rajasthan', lat: 26.8894, lng: 70.8653 },
  { c: 'BKB', n: 'Bikaner Airport (Nal Civil Enclave)', city: 'Bikaner', state: 'Rajasthan', lat: 28.0706, lng: 73.2081 },
  { c: 'KQH', n: 'Kishangarh Airport (Ajmer / Pushkar)', city: 'Ajmer / Pushkar', state: 'Rajasthan', lat: 26.5983, lng: 74.8156 },
  { c: 'KTU', n: 'Kota Airport', city: 'Kota', state: 'Rajasthan', lat: 25.1603, lng: 75.8456 },

  // Goa
  { c: 'GOI', n: 'Dabolim Airport', city: 'Goa (South)', state: 'Goa', lat: 15.3808, lng: 73.8313 },
  { c: 'GOX', n: 'Manohar International Airport (Mopa)', city: 'Goa (North)', state: 'Goa', lat: 15.7667, lng: 73.8667 },

  // Gujarat
  { c: 'AMD', n: 'Sardar Vallabhbhai Patel International Airport', city: 'Ahmedabad', state: 'Gujarat', lat: 23.0772, lng: 72.6347 },
  { c: 'STV', n: 'Surat International Airport', city: 'Surat', state: 'Gujarat', lat: 21.1139, lng: 72.7419 },
  { c: 'BDQ', n: 'Vadodara Airport (Civil Aerodrome Harni)', city: 'Vadodara', state: 'Gujarat', lat: 22.3361, lng: 73.2263 },
  { c: 'HSR', n: 'Rajkot International Airport (Hirasar)', city: 'Rajkot', state: 'Gujarat', lat: 22.3611, lng: 70.9903 },
  { c: 'BHU', n: 'Bhavnagar Airport', city: 'Bhavnagar', state: 'Gujarat', lat: 21.7522, lng: 72.1856 },
  { c: 'JGA', n: 'Jamnagar Airport (Govardhanpur Enclave)', city: 'Jamnagar', state: 'Gujarat', lat: 22.4650, lng: 70.0125 },
  { c: 'PBD', n: 'Porbandar Airport', city: 'Porbandar', state: 'Gujarat', lat: 21.6489, lng: 69.6575 },
  { c: 'BHJ', n: 'Bhuj Airport (Shyamji Krishna Varma Enclave)', city: 'Bhuj / Kutch', state: 'Gujarat', lat: 23.2878, lng: 69.6700 },
  { c: 'IXY', n: 'Kandla Airport (Gandhidham)', city: 'Gandhidham / Kandla', state: 'Gujarat', lat: 23.1122, lng: 70.1006 },
  { c: 'IXK', n: 'Keshod Airport (Junagadh / Somnath Gateway)', city: 'Junagadh / Keshod', state: 'Gujarat', lat: 21.3172, lng: 70.2694 },
  { c: 'DIU', n: 'Diu Airport', city: 'Diu', state: 'Dadra & Nagar Haveli and Daman & Diu', lat: 20.7136, lng: 70.9214 },
  { c: 'NMB', n: 'Daman Airport', city: 'Daman', state: 'Dadra & Nagar Haveli and Daman & Diu', lat: 20.4339, lng: 72.8433 },
  { c: 'VA1Q', n: 'Mundra Airport', city: 'Mundra', state: 'Gujarat', lat: 22.8408, lng: 69.7347 },

  // Karnataka
  { c: 'BLR', n: 'Kempegowda International Airport', city: 'Bengaluru', state: 'Karnataka', lat: 13.1986, lng: 77.7066 },
  { c: 'MYQ', n: 'Mysuru Airport (Mandakalli)', city: 'Mysuru', state: 'Karnataka', lat: 12.2294, lng: 76.6508 },
  { c: 'IXE', n: 'Mangaluru International Airport (Bajpe)', city: 'Mangaluru', state: 'Karnataka', lat: 12.9614, lng: 74.8900 },
  { c: 'HBX', n: 'Hubballi Airport', city: 'Hubballi / Dharwad', state: 'Karnataka', lat: 15.3617, lng: 75.0847 },
  { c: 'IXG', n: 'Belagavi Airport (Sambre)', city: 'Belagavi', state: 'Karnataka', lat: 15.8592, lng: 74.6183 },
  { c: 'GBI', n: 'Kalaburagi Airport (Gulbarga)', city: 'Kalaburagi', state: 'Karnataka', lat: 17.3006, lng: 76.9536 },
  { c: 'IXX', n: 'Bidar Airport (Civil Enclave)', city: 'Bidar', state: 'Karnataka', lat: 17.9069, lng: 77.4844 },
  { c: 'RQY', n: 'Shivamogga Airport (Kuvempu)', city: 'Shivamogga', state: 'Karnataka', lat: 13.8822, lng: 75.6322 },
  { c: 'VDY', n: 'Jindal Vijaynagar Airport (Toranagallu / Hampi)', city: 'Ballari / Hampi', state: 'Karnataka', lat: 15.1719, lng: 76.6347 },

  // Tamil Nadu & Puducherry
  { c: 'MAA', n: 'Chennai International Airport (Meenambakkam)', city: 'Chennai', state: 'Tamil Nadu', lat: 12.9941, lng: 80.1709 },
  { c: 'CJB', n: 'Coimbatore International Airport (Peelamedu)', city: 'Coimbatore (Ooty Gateway)', state: 'Tamil Nadu', lat: 11.0298, lng: 77.0434 },
  { c: 'IXM', n: 'Madurai Airport', city: 'Madurai', state: 'Tamil Nadu', lat: 9.8345, lng: 78.0934 },
  { c: 'TRZ', n: 'Tiruchirappalli International Airport', city: 'Tiruchirappalli', state: 'Tamil Nadu', lat: 10.7653, lng: 78.7097 },
  { c: 'SXV', n: 'Salem Airport (Kamalapuram)', city: 'Salem (Yercaud Gateway)', state: 'Tamil Nadu', lat: 11.7806, lng: 78.0647 },
  { c: 'TCR', n: 'Tuticorin Airport (Thoothukudi)', city: 'Thoothukudi / Tirunelveli', state: 'Tamil Nadu', lat: 8.7239, lng: 78.0264 },
  { c: 'NVY', n: 'Neyveli Airport', city: 'Neyveli', state: 'Tamil Nadu', lat: 11.5264, lng: 79.5289 },
  { c: 'PNY', n: 'Puducherry Airport (Lawspet)', city: 'Puducherry', state: 'Puducherry', lat: 11.9681, lng: 79.8106 },

  // Kerala
  { c: 'COK', n: 'Cochin International Airport (Nedumbassery)', city: 'Kochi', state: 'Kerala', lat: 10.1518, lng: 76.3930 },
  { c: 'TRV', n: 'Thiruvananthapuram International Airport', city: 'Thiruvananthapuram (Kovalam/Varkala)', state: 'Kerala', lat: 8.4821, lng: 76.9200 },
  { c: 'CCJ', n: 'Calicut International Airport (Karipur)', city: 'Kozhikode', state: 'Kerala', lat: 11.1368, lng: 75.9553 },
  { c: 'CNN', n: 'Kannur International Airport (Mattannur)', city: 'Kannur / Wayanad', state: 'Kerala', lat: 11.9169, lng: 75.5492 },

  // Andhra Pradesh & Telangana
  { c: 'HYD', n: 'Rajiv Gandhi International Airport (Shamshabad)', city: 'Hyderabad', state: 'Telangana', lat: 17.2403, lng: 78.4294 },
  { c: 'WGC', n: 'Warangal Airport (Mamnoor)', city: 'Warangal', state: 'Telangana', lat: 17.9189, lng: 79.6014 },
  { c: 'VTZ', n: 'Visakhapatnam International Airport', city: 'Visakhapatnam (Vizag)', state: 'Andhra Pradesh', lat: 17.7212, lng: 83.2245 },
  { c: 'VGA', n: 'Vijayawada International Airport (Gannavaram)', city: 'Vijayawada / Amaravati', state: 'Andhra Pradesh', lat: 16.5303, lng: 80.7969 },
  { c: 'TIR', n: 'Tirupati Airport (Renigunta)', city: 'Tirupati', state: 'Andhra Pradesh', lat: 13.6325, lng: 79.5436 },
  { c: 'RJA', n: 'Rajahmundry Airport (Madhurapudi)', city: 'Rajahmundry', state: 'Andhra Pradesh', lat: 17.1103, lng: 81.8183 },
  { c: 'CDP', n: 'Kadapa Airport', city: 'Kadapa', state: 'Andhra Pradesh', lat: 14.5100, lng: 78.7728 },
  { c: 'KJB', n: 'Kurnool Airport (Uyyalawada Narasimha Reddy)', city: 'Kurnool', state: 'Andhra Pradesh', lat: 15.7125, lng: 78.2917 },

  // Punjab, Haryana & Chandigarh
  { c: 'IXC', n: 'Shaheed Bhagat Singh International Airport', city: 'Chandigarh / Mohali', state: 'Chandigarh', lat: 30.6735, lng: 76.7885 },
  { c: 'ATQ', n: 'Sri Guru Ram Dass Jee International Airport', city: 'Amritsar', state: 'Punjab', lat: 31.7096, lng: 74.7973 },
  { c: 'AIP', n: 'Adampur Airport (Jalandhar Civil Enclave)', city: 'Jalandhar / Adampur', state: 'Punjab', lat: 31.4339, lng: 75.7578 },
  { c: 'BUP', n: 'Bathinda Airport (Virpal Kalan Enclave)', city: 'Bathinda', state: 'Punjab', lat: 30.2708, lng: 74.7572 },
  { c: 'LUH', n: 'Ludhiana Airport (Sahnewal)', city: 'Ludhiana', state: 'Punjab', lat: 30.8550, lng: 75.9558 },
  { c: 'IXP', n: 'Pathankot Airport', city: 'Pathankot (Dalhousie Gateway)', state: 'Punjab', lat: 32.2339, lng: 75.6339 },
  { c: 'HSS', n: 'Hisar Airport (Maharaja Agrasen)', city: 'Hisar', state: 'Haryana', lat: 29.1794, lng: 75.7547 },
  { c: 'ABX', n: 'Ambala Air Force Station / Civil Enclave', city: 'Ambala', state: 'Haryana', lat: 30.3689, lng: 76.8153 },

  // Himachal Pradesh & Uttarakhand
  { c: 'DED', n: 'Jolly Grant Airport', city: 'Dehradun / Rishikesh', state: 'Uttarakhand', lat: 30.1897, lng: 78.1803 },
  { c: 'PGH', n: 'Pantnagar Airport', city: 'Nainital / Pantnagar / Corbett', state: 'Uttarakhand', lat: 29.0333, lng: 79.4739 },
  { c: 'NNS', n: 'Naini Saini Airport', city: 'Pithoragarh', state: 'Uttarakhand', lat: 29.5878, lng: 80.2444 },
  { c: 'SLV', n: 'Shimla Airport (Jubbarhatti)', city: 'Shimla', state: 'Himachal Pradesh', lat: 31.0818, lng: 77.0679 },
  { c: 'KUU', n: 'Kullu–Manali Airport (Bhuntar)', city: 'Kullu / Manali / Kasol', state: 'Himachal Pradesh', lat: 31.8767, lng: 77.1544 },
  { c: 'DHM', n: 'Kangra Airport (Gaggal)', city: 'Dharamshala / McLeod Ganj', state: 'Himachal Pradesh', lat: 32.1651, lng: 76.2634 },

  // Jammu & Kashmir and Ladakh
  { c: 'SXR', n: 'Sheikh ul-Alam International Airport', city: 'Srinagar', state: 'Jammu & Kashmir', lat: 33.9871, lng: 74.7744 },
  { c: 'IXJ', n: 'Jammu Airport (Satwari Civil Enclave)', city: 'Jammu (Katra / Vaishno Devi Gateway)', state: 'Jammu & Kashmir', lat: 32.6891, lng: 74.8374 },
  { c: 'IXL', n: 'Kushok Bakula Rimpochee Airport', city: 'Leh', state: 'Ladakh', lat: 34.1359, lng: 77.5465 },
  { c: 'VI65', n: 'Kargil Civil Enclave / Airport', city: 'Kargil', state: 'Ladakh', lat: 34.5217, lng: 76.1558 },

  // West Bengal, Bihar & Jharkhand
  { c: 'CCU', n: 'Netaji Subhash Chandra Bose International Airport', city: 'Kolkata', state: 'West Bengal', lat: 22.6547, lng: 88.4467 },
  { c: 'IXB', n: 'Bagdogra International Airport', city: 'Siliguri (Darjeeling & Sikkim Gateway)', state: 'West Bengal', lat: 26.6812, lng: 88.3286 },
  { c: 'RDP', n: 'Kazi Nazrul Islam Airport (Andal)', city: 'Durgapur / Asansol', state: 'West Bengal', lat: 23.6231, lng: 87.2417 },
  { c: 'COH', n: 'Cooch Behar Airport', city: 'Cooch Behar', state: 'West Bengal', lat: 26.3308, lng: 89.4678 },
  { c: 'PAT', n: 'Jay Prakash Narayan Airport', city: 'Patna', state: 'Bihar', lat: 25.5913, lng: 85.0880 },
  { c: 'GAY', n: 'Gaya International Airport', city: 'Gaya / Bodh Gaya', state: 'Bihar', lat: 24.7442, lng: 84.9511 },
  { c: 'DBR', n: 'Darbhanga Airport', city: 'Darbhanga', state: 'Bihar', lat: 26.1950, lng: 85.9189 },
  { c: 'IXR', n: 'Birsa Munda Airport', city: 'Ranchi', state: 'Jharkhand', lat: 23.3143, lng: 85.3217 },
  { c: 'DGH', n: 'Deoghar International Airport', city: 'Deoghar (Baidyanath Dham)', state: 'Jharkhand', lat: 24.4439, lng: 86.7058 },
  { c: 'IXW', n: 'Sonari Airport', city: 'Jamshedpur', state: 'Jharkhand', lat: 22.8131, lng: 86.1689 },

  // Odisha & Chhattisgarh
  { c: 'BBI', n: 'Biju Patnaik International Airport', city: 'Bhubaneswar (Puri / Konark Gateway)', state: 'Odisha', lat: 20.2444, lng: 85.8178 },
  { c: 'JRG', n: 'Veer Surendra Sai Airport', city: 'Jharsuguda', state: 'Odisha', lat: 21.9142, lng: 84.0506 },
  { c: 'RRK', n: 'Rourkela Airport', city: 'Rourkela', state: 'Odisha', lat: 22.2567, lng: 84.8144 },
  { c: 'PYB', n: 'Jeypore Airport', city: 'Jeypore / Koraput', state: 'Odisha', lat: 18.8778, lng: 82.5539 },
  { c: 'UKE', n: 'Utkela Airport', city: 'Kalahandi / Bhawanipatna', state: 'Odisha', lat: 20.1017, lng: 83.1817 },
  { c: 'RPR', n: 'Swami Vivekananda Airport', city: 'Raipur', state: 'Chhattisgarh', lat: 21.1804, lng: 81.7388 },
  { c: 'PAB', n: 'Bilaspur Airport (Bilasa Devi Kevat)', city: 'Bilaspur', state: 'Chhattisgarh', lat: 21.9886, lng: 82.1103 },
  { c: 'JGB', n: 'Jagdalpur Airport (Maa Danteshwari)', city: 'Jagdalpur (Bastar)', state: 'Chhattisgarh', lat: 19.0733, lng: 82.0336 },
  { c: 'RGH', n: 'Ambikapur Airport (Maa Mahamaya)', city: 'Ambikapur', state: 'Chhattisgarh', lat: 23.1239, lng: 83.1883 },

  // Assam & Northeast States
  { c: 'GAU', n: 'Lokpriya Gopinath Bordoloi International Airport', city: 'Guwahati', state: 'Assam', lat: 26.1061, lng: 91.5859 },
  { c: 'DIB', n: 'Dibrugarh Airport (Mohanbari)', city: 'Dibrugarh', state: 'Assam', lat: 27.4839, lng: 95.0181 },
  { c: 'IXS', n: 'Silchar Airport (Kumbhirgram)', city: 'Silchar', state: 'Assam', lat: 24.9128, lng: 92.9789 },
  { c: 'JRH', n: 'Jorhat Airport (Rowriah / Kaziranga Gateway)', city: 'Jorhat / Kaziranga', state: 'Assam', lat: 26.7317, lng: 94.1756 },
  { c: 'TEZ', n: 'Tezpur Airport (Salonibari)', city: 'Tezpur', state: 'Assam', lat: 26.7094, lng: 92.7989 },
  { c: 'IXI', n: 'Lilabari Airport (North Lakhimpur)', city: 'North Lakhimpur', state: 'Assam', lat: 27.2961, lng: 94.0983 },
  { c: 'RUP', n: 'Rupsi Airport', city: 'Dhubri / Kokrajhar', state: 'Assam', lat: 26.1408, lng: 89.9078 },
  { c: 'SHL', n: 'Shillong Airport (Umroi)', city: 'Shillong (Meghalaya)', state: 'Meghalaya', lat: 25.7036, lng: 91.9786 },
  { c: 'PYG', n: 'Pakyong Airport', city: 'Gangtok (Sikkim)', state: 'Sikkim', lat: 27.2344, lng: 88.5886 },
  { c: 'IMF', n: 'Bir Tikendrajit International Airport', city: 'Imphal', state: 'Manipur', lat: 24.7600, lng: 93.8967 },
  { c: 'IXA', n: 'Maharaja Bir Bikram Airport', city: 'Agartala', state: 'Tripura', lat: 23.8869, lng: 91.2406 },
  { c: 'DMU', n: 'Dimapur Airport', city: 'Dimapur (Kohima Gateway)', state: 'Nagaland', lat: 25.8839, lng: 93.7711 },
  { c: 'AJL', n: 'Lengpui Airport', city: 'Aizawl', state: 'Mizoram', lat: 23.8406, lng: 92.6194 },
  { c: 'HGI', n: 'Donyi Polo Airport (Hollongi)', city: 'Itanagar', state: 'Arunachal Pradesh', lat: 26.9856, lng: 93.6389 },
  { c: 'IXT', n: 'Pasighat Airport', city: 'Pasighat', state: 'Arunachal Pradesh', lat: 28.0664, lng: 95.3347 },
  { c: 'TEI', n: 'Tezu Airport', city: 'Tezu', state: 'Arunachal Pradesh', lat: 27.9408, lng: 96.1347 },

  // Islands
  { c: 'IXZ', n: 'Veer Savarkar International Airport', city: 'Port Blair (Andaman Islands)', state: 'Andaman & Nicobar Islands', lat: 11.6412, lng: 92.7297 },
  { c: 'CBD', n: 'Car Nicobar Air Force Station Enclave', city: 'Car Nicobar', state: 'Andaman & Nicobar Islands', lat: 9.1539, lng: 92.8189 },
  { c: 'AGX', n: 'Agatti Airport', city: 'Agatti Island (Lakshadweep)', state: 'Lakshadweep', lat: 10.8242, lng: 72.1764 },
];

// Validate unique airport codes
const codeSet = new Set();
for (const a of AIRPORTS) {
  if (codeSet.has(a.c)) {
    throw new Error(`DUPLICATE AIRPORT CODE: ${a.c} (${a.n})`);
  }
  codeSet.add(a.c);
}

const airportsTsContent = `export interface Airport {
  c: string; // IATA code (e.g. GWL, DEL, BOM)
  n: string; // Official airport name
  city: string;
  state: string;
  lat: number;
  lng: number;
}

export const INDIAN_AIRPORTS: Airport[] = ${JSON.stringify(AIRPORTS, null, 2)};

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
`;

fs.writeFileSync('./src/data/airports.ts', airportsTsContent, 'utf8');
console.log(`Saved src/data/airports.ts with ${AIRPORTS.length} airports.`);

// ==========================================
// 2. COMPREHENSIVE INDIAN BUS TERMINALS DATASET
// ==========================================
const BUS_TERMINALS = [
  // Delhi NCR
  {
    id: 'del-kashmere',
    name: 'Maharana Pratap ISBT (Kashmere Gate)',
    city: 'New Delhi',
    state: 'Delhi',
    lat: 28.6675,
    lng: 77.2281,
    majorRoutes: ['Chandigarh (NH 44)', 'Shimla', 'Manali', 'Dharamshala', 'Dehradun', 'Amritsar', 'Jaipur'],
  },
  {
    id: 'del-anand-vihar',
    name: 'Swami Vivekananda ISBT (Anand Vihar)',
    city: 'New Delhi (East)',
    state: 'Delhi',
    lat: 28.6489,
    lng: 77.3150,
    majorRoutes: ['Agra', 'Lucknow', 'Kanpur', 'Haridwar', 'Rishikesh', 'Bareilly', 'Moradabad'],
  },
  {
    id: 'del-sarai-kale-khan',
    name: 'Vir Haqiqat Rai ISBT (Sarai Kale Khan)',
    city: 'New Delhi (South)',
    state: 'Delhi',
    lat: 28.5886,
    lng: 77.2588,
    majorRoutes: ['Agra', 'Mathura', 'Gwalior', 'Bhopal', 'Jaipur', 'Alwar'],
  },
  {
    id: 'del-majnu-ka-tilla',
    name: 'Majnu Ka Tilla Tibetan Volvo Hub',
    city: 'New Delhi (North)',
    state: 'Delhi',
    lat: 28.7011,
    lng: 77.2272,
    majorRoutes: ['Manali Luxury Volvo', 'Dharamshala / McLeod Ganj', 'Bir Billing', 'Kasol', 'Shimla'],
  },
  {
    id: 'noida-sec35',
    name: 'Noida City Inter-State Bus Terminal (Sector 35)',
    city: 'Noida',
    state: 'Uttar Pradesh',
    lat: 28.5794,
    lng: 77.3533,
    majorRoutes: ['Agra (Yamuna Expressway)', 'Mathura', 'Lucknow', 'Dehradun', 'Haridwar'],
  },
  {
    id: 'ggn-iffco',
    name: 'Gurugram IFFCO Chowk & Rajiv Chowk Bus Hub',
    city: 'Gurugram',
    state: 'Haryana',
    lat: 28.4725,
    lng: 77.0725,
    majorRoutes: ['Jaipur (NH 48)', 'Udaipur', 'Jodhpur', 'Ajmer', 'Chandigarh', 'Delhi'],
  },

  // Uttar Pradesh
  {
    id: 'agr-isbt',
    name: 'Agra ISBT (Transport Nagar / Idgah Bus Stand)',
    city: 'Agra',
    state: 'Uttar Pradesh',
    lat: 27.2005,
    lng: 77.9622,
    majorRoutes: ['Delhi (Yamuna Expressway)', 'Gwalior (NH 44)', 'Jaipur (NH 21)', 'Lucknow (Agra-Lucknow Exp)', 'Mathura'],
  },
  {
    id: 'mth-central',
    name: 'Mathura Central Roadways Bus Stand (Old Cantt)',
    city: 'Mathura',
    state: 'Uttar Pradesh',
    lat: 27.4925,
    lng: 77.6736,
    majorRoutes: ['Delhi', 'Agra', 'Vrindavan', 'Bharatpur', 'Jaipur', 'Aligarh'],
  },
  {
    id: 'vrn-chhatikara',
    name: 'Vrindavan Chhatikara Roadways Bus Stand',
    city: 'Vrindavan',
    state: 'Uttar Pradesh',
    lat: 27.5683,
    lng: 77.6586,
    majorRoutes: ['Mathura', 'Delhi', 'Agra', 'Govardhan', 'Barsana'],
  },
  {
    id: 'fth-sikri',
    name: 'Fatehpur Sikri Roadways Stand',
    city: 'Fatehpur Sikri',
    state: 'Uttar Pradesh',
    lat: 27.0944,
    lng: 77.6678,
    majorRoutes: ['Agra', 'Bharatpur', 'Jaipur', 'Bayana'],
  },
  {
    id: 'lko-alambagh',
    name: 'Alambagh ISBT & World-Class Bus Terminal',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    lat: 26.8122,
    lng: 80.9022,
    majorRoutes: ['Agra (Agra-Lucknow Exp)', 'Delhi', 'Varanasi (Purvanchal Exp)', 'Kanpur', 'Ayodhya', 'Prayagraj'],
  },
  {
    id: 'lko-charbagh',
    name: 'Charbagh Central Bus Station',
    city: 'Lucknow (Station Hub)',
    state: 'Uttar Pradesh',
    lat: 26.8317,
    lng: 80.9197,
    majorRoutes: ['Kanpur', 'Gorakhpur', 'Sitapur', 'Bareilly', 'Faizabad / Ayodhya'],
  },
  {
    id: 'vns-cantt',
    name: 'Varanasi Cantt Roadways Bus Stand',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    lat: 25.3275,
    lng: 82.9858,
    majorRoutes: ['Prayagraj', 'Lucknow', 'Gorakhpur', 'Patna', 'Ayodhya', 'Gaya'],
  },
  {
    id: 'ayd-dham',
    name: 'Ayodhya Dham Central Bus Station (Naya Ghat)',
    city: 'Ayodhya',
    state: 'Uttar Pradesh',
    lat: 26.7922,
    lng: 82.2033,
    majorRoutes: ['Lucknow (NH 27)', 'Varanasi', 'Gorakhpur', 'Prayagraj', 'Delhi'],
  },
  {
    id: 'pry-civil',
    name: 'Prayagraj Civil Lines Bus Terminal',
    city: 'Prayagraj',
    state: 'Uttar Pradesh',
    lat: 25.4522,
    lng: 81.8336,
    majorRoutes: ['Varanasi', 'Lucknow', 'Kanpur', 'Ayodhya', 'Rewa', 'Chitrakoot'],
  },
  {
    id: 'knp-jhakarkati',
    name: 'Jhakarkati Central Bus Terminal',
    city: 'Kanpur',
    state: 'Uttar Pradesh',
    lat: 26.4528,
    lng: 80.3478,
    majorRoutes: ['Lucknow', 'Delhi', 'Varanasi', 'Prayagraj', 'Agra', 'Jhansi'],
  },
  {
    id: 'jhs-central',
    name: 'Jhansi Central Roadways Bus Stand',
    city: 'Jhansi',
    state: 'Uttar Pradesh',
    lat: 25.4483,
    lng: 78.5686,
    majorRoutes: ['Gwalior', 'Orchha', 'Khajuraho', 'Kanpur', 'Shivpuri', 'Lalitpur'],
  },
  {
    id: 'alg-gandhi',
    name: 'Aligarh Gandhi Park Roadways Bus Stand',
    city: 'Aligarh',
    state: 'Uttar Pradesh',
    lat: 27.8975,
    lng: 78.0881,
    majorRoutes: ['Delhi', 'Agra', 'Mathura', 'Moradabad', 'Bareilly', 'Kanpur'],
  },
  {
    id: 'brl-satellite',
    name: 'Bareilly Satellite Bus Stand',
    city: 'Bareilly',
    state: 'Uttar Pradesh',
    lat: 28.3472,
    lng: 79.4319,
    majorRoutes: ['Delhi', 'Lucknow', 'Moradabad', 'Nainital / Haldwani', 'Pilibhit'],
  },
  {
    id: 'mrt-bhaisali',
    name: 'Meerut Bhaisali Central Bus Stand',
    city: 'Meerut',
    state: 'Uttar Pradesh',
    lat: 28.9864,
    lng: 77.7081,
    majorRoutes: ['Delhi', 'Haridwar', 'Rishikesh', 'Dehradun', 'Muzaffarnagar', 'Agra'],
  },
  {
    id: 'gkp-isbt',
    name: 'Gorakhpur Central ISBT',
    city: 'Gorakhpur',
    state: 'Uttar Pradesh',
    lat: 26.7606,
    lng: 83.3731,
    majorRoutes: ['Lucknow', 'Varanasi', 'Ayodhya', 'Kushinagar', 'Nepal Border (Sonauli)', 'Patna'],
  },
  {
    id: 'ckt-karwi',
    name: 'Chitrakoot Karwi Roadways Bus Stand',
    city: 'Chitrakoot',
    state: 'Uttar Pradesh',
    lat: 25.2133,
    lng: 80.8989,
    majorRoutes: ['Prayagraj', 'Banda', 'Satna', 'Rewa', 'Khajuraho', 'Jhansi'],
  },

  // Madhya Pradesh & Chhattisgarh
  {
    id: 'gwl-isbt',
    name: 'Gwalior Inter-State Bus Terminal (ISBT / Naya Bus Stand)',
    city: 'Gwalior',
    state: 'Madhya Pradesh',
    lat: 26.2183,
    lng: 78.1828,
    majorRoutes: ['Agra (NH 44)', 'Delhi (NH 44)', 'Bhopal (NH 46)', 'Indore', 'Jhansi', 'Shivpuri'],
  },
  {
    id: 'bho-isbt',
    name: 'Kushabhau Thakre ISBT (Hoshangabad Road)',
    city: 'Bhopal',
    state: 'Madhya Pradesh',
    lat: 23.2215,
    lng: 77.4419,
    majorRoutes: ['Indore', 'Gwalior', 'Jabalpur', 'Nagpur', 'Ujjain', 'Hoshangabad / Pachmarhi'],
  },
  {
    id: 'idr-sarwate',
    name: 'Sarwate Bus Stand & AICTSL Central Station',
    city: 'Indore',
    state: 'Madhya Pradesh',
    lat: 22.7150,
    lng: 75.8682,
    majorRoutes: ['Bhopal', 'Ujjain', 'Ahmedabad', 'Mumbai', 'Pune', 'Gwalior', 'Omkareshwar', 'Maheshwar'],
  },
  {
    id: 'ujn-dewas',
    name: 'Ujjain Dewas Gate Central Bus Stand',
    city: 'Ujjain',
    state: 'Madhya Pradesh',
    lat: 23.1828,
    lng: 75.7772,
    majorRoutes: ['Indore', 'Bhopal', 'Omkareshwar', 'Ratlam', 'Kota', 'Ahmedabad'],
  },
  {
    id: 'jbl-deendayal',
    name: 'Deendayal Chowk ISBT (Jabalpur)',
    city: 'Jabalpur',
    state: 'Madhya Pradesh',
    lat: 23.1972,
    lng: 79.9197,
    majorRoutes: ['Bhopal', 'Nagpur', 'Kanha National Park', 'Bandhavgarh', 'Rewa', 'Raipur'],
  },
  {
    id: 'khj-tourist',
    name: 'Khajuraho Tourist Bus Stand',
    city: 'Khajuraho',
    state: 'Madhya Pradesh',
    lat: 24.8483,
    lng: 79.9325,
    majorRoutes: ['Jhansi', 'Satna', 'Bhopal', 'Chhatarpur', 'Panna Tiger Reserve'],
  },
  {
    id: 'orc-central',
    name: 'Orchha Bus Stand (Tikamgarh Road)',
    city: 'Orchha',
    state: 'Madhya Pradesh',
    lat: 25.3528,
    lng: 78.6436,
    majorRoutes: ['Jhansi', 'Gwalior', 'Khajuraho', 'Tikamgarh'],
  },
  {
    id: 'pcm-central',
    name: 'Pachmarhi Hill Bus Stand (Subhash Chowk)',
    city: 'Pachmarhi',
    state: 'Madhya Pradesh',
    lat: 22.4675,
    lng: 78.4339,
    majorRoutes: ['Pipariya Railway Junction', 'Bhopal', 'Hoshangabad', 'Jabalpur', 'Chhindwara'],
  },
  {
    id: 'rew-new',
    name: 'Rewa New Central Bus Stand',
    city: 'Rewa',
    state: 'Madhya Pradesh',
    lat: 24.5372,
    lng: 81.3019,
    majorRoutes: ['Prayagraj', 'Satna', 'Jabalpur', 'Varanasi', 'Bandhavgarh'],
  },
  {
    id: 'rpr-balaji',
    name: 'Sri Balaji Swami Vivekanand ISBT (Bhatagaon)',
    city: 'Raipur',
    state: 'Chhattisgarh',
    lat: 21.2189,
    lng: 81.6372,
    majorRoutes: ['Bilaspur', 'Nagpur', 'Jagdalpur (Bastar)', 'Bhubaneswar', 'Jabalpur', 'Ranchi'],
  },
  {
    id: 'bsp-hitech',
    name: 'Bilaspur Hi-Tech Central Bus Stand (Bodri)',
    city: 'Bilaspur',
    state: 'Chhattisgarh',
    lat: 22.0494,
    lng: 82.1436,
    majorRoutes: ['Raipur', 'Ambikapur', 'Ratanpur (Mahamaya)', 'Korba', 'Jharsuguda'],
  },
  {
    id: 'jgd-bastar',
    name: 'Jagdalpur Bastar Central Bus Stand',
    city: 'Jagdalpur',
    state: 'Chhattisgarh',
    lat: 19.0789,
    lng: 82.0233,
    majorRoutes: ['Raipur', 'Visakhapatnam', 'Chitrakote Falls', 'Dantewada', 'Hyderabad'],
  },

  // Rajasthan
  {
    id: 'jai-sindhi-camp',
    name: 'Sindhi Camp Central Bus Stand',
    city: 'Jaipur',
    state: 'Rajasthan',
    lat: 26.9238,
    lng: 75.7997,
    majorRoutes: ['Delhi (NH 48)', 'Agra (NH 21)', 'Udaipur', 'Jodhpur', 'Ajmer', 'Pushkar', 'Ahmedabad'],
  },
  {
    id: 'jdh-paota',
    name: 'Jodhpur Central Roadways Bus Stand (Paota)',
    city: 'Jodhpur',
    state: 'Rajasthan',
    lat: 26.3014,
    lng: 73.0411,
    majorRoutes: ['Jaipur', 'Jaisalmer', 'Udaipur', 'Bikaner', 'Mount Abu', 'Ahmedabad'],
  },
  {
    id: 'udr-udaipole',
    name: 'Udaipur Udaipole Central Bus Station',
    city: 'Udaipur',
    state: 'Rajasthan',
    lat: 24.5772,
    lng: 73.7019,
    majorRoutes: ['Jaipur', 'Jodhpur', 'Ahmedabad (NH 48)', 'Mount Abu', 'Chittorgarh', 'Mumbai'],
  },
  {
    id: 'jsa-central',
    name: 'Jaisalmer Central Roadways Bus Stand',
    city: 'Jaisalmer',
    state: 'Rajasthan',
    lat: 26.9114,
    lng: 70.9189,
    majorRoutes: ['Jodhpur', 'Bikaner', 'Sam Sand Dunes', 'Jaipur', 'Barmer'],
  },
  {
    id: 'bkb-kem',
    name: 'Bikaner Central Roadways Bus Stand',
    city: 'Bikaner',
    state: 'Rajasthan',
    lat: 28.0189,
    lng: 73.3169,
    majorRoutes: ['Jaipur', 'Jodhpur', 'Jaisalmer', 'Delhi', 'Sri Ganganagar'],
  },
  {
    id: 'psh-marwar',
    name: 'Pushkar Marwar Roadways Bus Stand',
    city: 'Pushkar',
    state: 'Rajasthan',
    lat: 26.4914,
    lng: 74.5556,
    majorRoutes: ['Ajmer', 'Jaipur', 'Jodhpur', 'Delhi', 'Udaipur'],
  },
  {
    id: 'ajm-central',
    name: 'Ajmer Central Roadways Bus Stand',
    city: 'Ajmer',
    state: 'Rajasthan',
    lat: 26.4533,
    lng: 74.6436,
    majorRoutes: ['Pushkar', 'Jaipur', 'Udaipur', 'Jodhpur', 'Delhi', 'Ahmedabad'],
  },
  {
    id: 'abu-toll',
    name: 'Mount Abu Central Bus Stand',
    city: 'Mount Abu',
    state: 'Rajasthan',
    lat: 24.5925,
    lng: 72.7156,
    majorRoutes: ['Abu Road Railway Station', 'Udaipur', 'Ahmedabad', 'Jodhpur', 'Jaipur'],
  },
  {
    id: 'rnb-swm',
    name: 'Sawai Madhopur Bus Stand (Ranthambore Gateway)',
    city: 'Sawai Madhopur / Ranthambore',
    state: 'Rajasthan',
    lat: 25.9928,
    lng: 76.3686,
    majorRoutes: ['Jaipur', 'Kota', 'Delhi', 'Agra', 'Ranthambore National Park'],
  },
  {
    id: 'bhr-central',
    name: 'Bharatpur Central Roadways Stand',
    city: 'Bharatpur',
    state: 'Rajasthan',
    lat: 27.2172,
    lng: 77.4911,
    majorRoutes: ['Agra', 'Jaipur', 'Mathura', 'Delhi', 'Keoladeo National Park'],
  },
  {
    id: 'cht-central',
    name: 'Chittorgarh Central Bus Stand',
    city: 'Chittorgarh',
    state: 'Rajasthan',
    lat: 24.8872,
    lng: 74.6297,
    majorRoutes: ['Udaipur', 'Bhilwara', 'Kota', 'Jaipur', 'Indore'],
  },

  // Himachal Pradesh (Hills & Adventures)
  {
    id: 'mnl-volvo',
    name: 'Manali Private Volvo Stand & HRTC Central Bus Stand',
    city: 'Manali',
    state: 'Himachal Pradesh',
    lat: 32.2394,
    lng: 77.1886,
    majorRoutes: ['Delhi Majnu Ka Tilla / Kashmere Gate (12h)', 'Chandigarh (8h)', 'Shimla (7h)', 'Dharamshala', 'Leh Ladakh', 'Rohtang / Atal Tunnel'],
  },
  {
    id: 'sml-isbt',
    name: 'Shimla ISBT Tutikandi (New Terminal)',
    city: 'Shimla',
    state: 'Himachal Pradesh',
    lat: 31.0944,
    lng: 77.1517,
    majorRoutes: ['Delhi (Kashmere Gate)', 'Chandigarh', 'Manali', 'Kalka', 'Dharamshala', 'Kullu', 'Kinnaur'],
  },
  {
    id: 'dhm-isbt',
    name: 'Dharamshala Inter-State Bus Stand',
    city: 'Dharamshala',
    state: 'Himachal Pradesh',
    lat: 32.2192,
    lng: 76.3236,
    majorRoutes: ['McLeod Ganj', 'Delhi', 'Chandigarh', 'Pathankot', 'Amritsar', 'Manali'],
  },
  {
    id: 'mcg-square',
    name: 'McLeod Ganj Main Square Bus Stand',
    city: 'McLeod Ganj (Upper Dharamshala)',
    state: 'Himachal Pradesh',
    lat: 32.2428,
    lng: 76.3217,
    majorRoutes: ['Delhi Volvo Overnight', 'Dharamshala Lower Bus Stand', 'Bhagsunag', 'Triund Base'],
  },
  {
    id: 'parvati-kasol',
    name: 'Kasol Riverfront & Manikaran Bus Stand',
    city: 'Kasol / Parvati Valley',
    state: 'Himachal Pradesh',
    lat: 32.0100,
    lng: 77.3150,
    majorRoutes: ['Bhuntar Airport Junction', 'Manali', 'Delhi Overnights', 'Tosh', 'Kheerganga Base (Barshaini)'],
  },
  {
    id: 'bhu-junction',
    name: 'Bhuntar Airport Junction Bus Hub',
    city: 'Bhuntar',
    state: 'Himachal Pradesh',
    lat: 31.8789,
    lng: 77.1539,
    majorRoutes: ['Kasol (1 hr)', 'Manali (1.5 hr)', 'Kullu (20 min)', 'Aut Tunnel / Jibhi', 'Chandigarh', 'Delhi'],
  },
  {
    id: 'jibhi-banjar',
    name: 'Jibhi & Banjar Valley Bus Stand',
    city: 'Jibhi / Tirthan Valley',
    state: 'Himachal Pradesh',
    lat: 31.6372,
    lng: 77.3828,
    majorRoutes: ['Aut Tunnel Junction', 'Shoja & Jalori Pass', 'Kullu', 'Delhi Volvo Connections'],
  },
  {
    id: 'spiti-kaza',
    name: 'Kaza Central HRTC Bus Stand (Spiti)',
    city: 'Kaza / Spiti Valley',
    state: 'Himachal Pradesh',
    lat: 32.2272,
    lng: 78.0717,
    majorRoutes: ['Manali (via Kunzum Pass & Atal Tunnel)', 'Shimla (via Reckong Peo & Tabo)', 'Key Monastery', 'Kibber', 'Hikkim'],
  },
  {
    id: 'dal-gandhi',
    name: 'Dalhousie Gandhi Chowk Bus Stand',
    city: 'Dalhousie',
    state: 'Himachal Pradesh',
    lat: 32.5389,
    lng: 75.9714,
    majorRoutes: ['Pathankot Railway Station', 'Khajjiar', 'Chamba', 'Dharamshala', 'Delhi', 'Amritsar'],
  },
  {
    id: 'bir-tibetan',
    name: 'Bir Billing Tibetan Colony Bus Stand',
    city: 'Bir Billing',
    state: 'Himachal Pradesh',
    lat: 32.0433,
    lng: 76.7214,
    majorRoutes: ['Delhi Majnu Ka Tilla Overnight Volvo', 'Dharamshala', 'Baijnath', 'Palampur', 'Chandigarh'],
  },

  // Uttarakhand (Himalayas & Ganga Ghats)
  {
    id: 'rsh-yatra',
    name: 'Rishikesh Yatra Bus Stand & Natraj Chowk',
    city: 'Rishikesh',
    state: 'Uttarakhand',
    lat: 30.1089,
    lng: 78.2933,
    majorRoutes: ['Delhi (Kashmere Gate / Anand Vihar - 5h)', 'Haridwar (45m)', 'Dehradun', 'Badrinath Yatra', 'Kedarnath Yatra', 'Devprayag', 'Chopta'],
  },
  {
    id: 'hdr-gmou',
    name: 'Haridwar GMOU & UTC Roadways Bus Stand',
    city: 'Haridwar',
    state: 'Uttarakhand',
    lat: 29.9483,
    lng: 78.1567,
    majorRoutes: ['Delhi', 'Rishikesh', 'Dehradun', 'Chandigarh', 'Jaipur', 'Agra', 'Char Dham Route'],
  },
  {
    id: 'ddn-isbt',
    name: 'Dehradun ISBT (Haridwar Bypass Road)',
    city: 'Dehradun',
    state: 'Uttarakhand',
    lat: 30.2858,
    lng: 78.0097,
    majorRoutes: ['Delhi', 'Mussoorie (1h)', 'Rishikesh', 'Haridwar', 'Chandigarh', 'Shimla', 'Nainital'],
  },
  {
    id: 'nni-tallital',
    name: 'Nainital Tallital Main Bus Stand',
    city: 'Nainital',
    state: 'Uttarakhand',
    lat: 29.3814,
    lng: 79.4678,
    majorRoutes: ['Kathgodam Railway Station', 'Haldwani ISBT', 'Delhi (Anand Vihar)', 'Almora', 'Ranikhet', 'Mukteshwar'],
  },
  {
    id: 'mus-library',
    name: 'Mussoorie Library Bus Stand (Mall Road)',
    city: 'Mussoorie',
    state: 'Uttarakhand',
    lat: 30.4578,
    lng: 78.0672,
    majorRoutes: ['Dehradun Railway Station & ISBT', 'Kempty Falls', 'Dhanaulti', 'Delhi Direct Volvos'],
  },
  {
    id: 'auli-josh',
    name: 'Joshimath & Auli Yatra Bus Stand',
    city: 'Auli / Joshimath',
    state: 'Uttarakhand',
    lat: 30.5564,
    lng: 79.5661,
    majorRoutes: ['Rishikesh (8h)', 'Haridwar', 'Badrinath (1.5h)', 'Valley of Flowers / Govindghat', 'Auli Ropeway Base'],
  },
  {
    id: 'cor-ramnagar',
    name: 'Ramnagar Roadways Stand (Jim Corbett)',
    city: 'Ramnagar / Jim Corbett',
    state: 'Uttarakhand',
    lat: 29.3956,
    lng: 79.1275,
    majorRoutes: ['Delhi', 'Nainital', 'Haldwani', 'Moradabad', 'Corbett Dhikala & Bijrani Gates'],
  },

  // Punjab, Haryana & Chandigarh
  {
    id: 'chd-sec43',
    name: 'ISBT Sector 43 (Himachal / J&K / Punjab Terminal)',
    city: 'Chandigarh',
    state: 'Chandigarh',
    lat: 30.7225,
    lng: 76.7450,
    majorRoutes: ['Shimla', 'Manali', 'Dharamshala', 'Amritsar', 'Jammu', 'Kullu', 'Dehradun'],
  },
  {
    id: 'chd-sec17',
    name: 'ISBT Sector 17 (Delhi / Haryana / UP Terminal)',
    city: 'Chandigarh',
    state: 'Chandigarh',
    lat: 30.7417,
    lng: 76.7761,
    majorRoutes: ['Delhi (Kashmere Gate)', 'Gurugram', 'Agra', 'Jaipur', 'Ludhiana', 'Patiala'],
  },
  {
    id: 'atq-dhingra',
    name: 'Shahid Madan Lal Dhingra ISBT (Amritsar)',
    city: 'Amritsar',
    state: 'Punjab',
    lat: 31.6317,
    lng: 74.8872,
    majorRoutes: ['Chandigarh', 'Delhi', 'Jalandhar', 'Ludhiana', 'Jammu / Katra', 'Dharamshala', 'Attari Wagah Border'],
  },
  {
    id: 'jld-cbs',
    name: 'Jalandhar Central Bus Stand (BMC Chowk)',
    city: 'Jalandhar',
    state: 'Punjab',
    lat: 31.3211,
    lng: 75.5817,
    majorRoutes: ['Amritsar', 'Ludhiana', 'Chandigarh', 'Delhi', 'Pathankot', 'Jammu'],
  },
  {
    id: 'ldh-sukhdev',
    name: 'Amar Shaheed Sukhdev Central ISBT (Ludhiana)',
    city: 'Ludhiana',
    state: 'Punjab',
    lat: 30.8936,
    lng: 75.8569,
    majorRoutes: ['Chandigarh', 'Delhi', 'Amritsar', 'Jalandhar', 'Ferozepur', 'Patiala'],
  },

  // Jammu & Kashmir and Ladakh
  {
    id: 'sxr-trc',
    name: 'Srinagar Tourist Reception Centre (TRC / Dal Gate)',
    city: 'Srinagar',
    state: 'Jammu & Kashmir',
    lat: 34.0739,
    lng: 74.8258,
    majorRoutes: ['Gulmarg (1.5h)', 'Pahalgam (2.5h)', 'Sonamarg (2.5h)', 'Jammu (via Banihal Tunnel)', 'Leh Ladakh (via Zojila)'],
  },
  {
    id: 'jmu-general',
    name: 'Jammu General Bus Stand (BC Road)',
    city: 'Jammu',
    state: 'Jammu & Kashmir',
    lat: 32.7297,
    lng: 74.8622,
    majorRoutes: ['Katra (Shri Mata Vaishno Devi)', 'Srinagar', 'Patnitop', 'Amritsar', 'Chandigarh', 'Delhi'],
  },
  {
    id: 'ktr-vaishno',
    name: 'Katra Shri Mata Vaishno Devi Central Bus Stand',
    city: 'Katra / Vaishno Devi',
    state: 'Jammu & Kashmir',
    lat: 32.9917,
    lng: 74.9317,
    majorRoutes: ['Jammu (1h)', 'Delhi Direct Volvos', 'Amritsar', 'Chandigarh', 'Patnitop', 'Srinagar'],
  },
  {
    id: 'leh-new',
    name: 'Leh New Bus Stand (Choglamsar Road)',
    city: 'Leh',
    state: 'Ladakh',
    lat: 34.1528,
    lng: 77.5817,
    majorRoutes: ['Nubra Valley (Diskit/Hunder)', 'Pangong Tso', 'Kargil', 'Srinagar (via Kargil)', 'Manali (via Sarchu/Atal Tunnel)', 'Tso Moriri'],
  },

  // Maharashtra & Goa
  {
    id: 'mum-borivali',
    name: 'Borivali Nancy Colony Bus Terminal',
    city: 'Mumbai (Western)',
    state: 'Maharashtra',
    lat: 19.2288,
    lng: 72.8541,
    majorRoutes: ['Ahmedabad', 'Surat', 'Vadodara', 'Udaipur', 'Goa', 'Pune', 'Shirdi'],
  },
  {
    id: 'mum-dadar',
    name: 'Dadar Asiad & TT Circle Intercity Hub',
    city: 'Mumbai (Central)',
    state: 'Maharashtra',
    lat: 19.0178,
    lng: 72.8478,
    majorRoutes: ['Pune (Mumbai-Pune Expressway)', 'Nashik', 'Kolhapur', 'Satara', 'Mahabaleshwar', 'Alibag'],
  },
  {
    id: 'mum-vashi',
    name: 'Vashi Highway Intercity Bus Hub',
    city: 'Navi Mumbai',
    state: 'Maharashtra',
    lat: 19.0658,
    lng: 72.9989,
    majorRoutes: ['Pune', 'Goa (NH 66)', 'Kolhapur', 'Bengaluru', 'Hyderabad', 'Konkan Coast'],
  },
  {
    id: 'pun-swargate',
    name: 'Swargate Intercity Bus Terminal',
    city: 'Pune (South)',
    state: 'Maharashtra',
    lat: 18.5018,
    lng: 73.8586,
    majorRoutes: ['Mahabaleshwar (3h)', 'Kolhapur', 'Goa', 'Solapur', 'Satara', 'Konkan', 'Bengaluru'],
  },
  {
    id: 'pun-wakad',
    name: 'Wakad Highway Bus Terminal (Expressway)',
    city: 'Pune (West)',
    state: 'Maharashtra',
    lat: 18.5989,
    lng: 73.7633,
    majorRoutes: ['Mumbai Dadar / Borivali (3h)', 'Lonavala (1h)', 'Khandala', 'Thane', 'Gujarat'],
  },
  {
    id: 'nsk-thakkar',
    name: 'Thakkar Bazar & CBS Central Bus Stand',
    city: 'Nashik',
    state: 'Maharashtra',
    lat: 19.9972,
    lng: 73.7897,
    majorRoutes: ['Shirdi (2h)', 'Trimbakeshwar', 'Mumbai', 'Pune', 'Aurangabad (Ajanta-Ellora)', 'Saputara', 'Surat'],
  },
  {
    id: 'shr-sainagar',
    name: 'Shirdi Sai Nagar Central Bus Station',
    city: 'Shirdi',
    state: 'Maharashtra',
    lat: 19.7689,
    lng: 74.4789,
    majorRoutes: ['Nashik', 'Pune', 'Mumbai', 'Aurangabad', 'Indore', 'Hyderabad', 'Surat'],
  },
  {
    id: 'mhb-market',
    name: 'Mahabaleshwar ST Bus Stand (Main Market)',
    city: 'Mahabaleshwar',
    state: 'Maharashtra',
    lat: 17.9239,
    lng: 73.6586,
    majorRoutes: ['Pune Swargate (3h)', 'Mumbai Dadar / Vashi (6h)', 'Panchgani (30m)', 'Satara', 'Wai'],
  },
  {
    id: 'lnv-highway',
    name: 'Lonavala ST Bus Stand (Expressway Hub)',
    city: 'Lonavala / Khandala',
    state: 'Maharashtra',
    lat: 18.7519,
    lng: 73.4072,
    majorRoutes: ['Mumbai', 'Pune', 'Khandala Ghats', 'Karla Caves', 'Bhaja Caves', 'Alibag'],
  },
  {
    id: 'aur-central',
    name: 'Chhatrapati Sambhajinagar Central Bus Stand',
    city: 'Aurangabad (Ajanta-Ellora)',
    state: 'Maharashtra',
    lat: 19.8814,
    lng: 75.3267,
    majorRoutes: ['Ellora Caves (Verul - 45m)', 'Ajanta Caves (2h)', 'Pune', 'Nashik', 'Shirdi', 'Mumbai', 'Nagpur'],
  },
  {
    id: 'klp-cbs',
    name: 'Kolhapur Central CBS (Tarabai Park)',
    city: 'Kolhapur',
    state: 'Maharashtra',
    lat: 16.7028,
    lng: 74.2417,
    majorRoutes: ['Pune', 'Goa', 'Bengaluru', 'Belgaum', 'Mahalaxmi Temple', 'Ratnagiri'],
  },
  {
    id: 'nag-ganeshpeth',
    name: 'Ganeshpeth Central Bus Stand',
    city: 'Nagpur',
    state: 'Maharashtra',
    lat: 21.1444,
    lng: 79.0989,
    majorRoutes: ['Pench Tiger Reserve', 'Tadoba National Park', 'Bhopal', 'Raipur', 'Hyderabad', 'Jabalpur', 'Pune'],
  },
  {
    id: 'goa-panaji',
    name: 'Kadamba Inter-State Bus Terminus (Panaji KTC)',
    city: 'Panaji',
    state: 'Goa',
    lat: 15.4989,
    lng: 73.8344,
    majorRoutes: ['Mumbai (NH 66)', 'Pune', 'Bengaluru (via Hubli)', 'Mangaluru', 'Gokarna', 'Belgaum', 'Kolhapur'],
  },
  {
    id: 'goa-mapusa',
    name: 'Mapusa KTC Bus Stand (North Goa Beaches Hub)',
    city: 'Mapusa / North Goa',
    state: 'Goa',
    lat: 15.5925,
    lng: 73.8117,
    majorRoutes: ['Calangute', 'Baga', 'Anjuna', 'Vagator', 'Arambol', 'Panaji', 'Mumbai Direct Volvos'],
  },
  {
    id: 'goa-margao',
    name: 'Margao KTC Inter-State Bus Terminal (South Goa Hub)',
    city: 'Margao / South Goa',
    state: 'Goa',
    lat: 15.2819,
    lng: 73.9686,
    majorRoutes: ['Palolem & Agonda', 'Karwar & Gokarna', 'Mangaluru', 'Bengaluru', 'Panaji', 'Belgaum'],
  },

  // Karnataka
  {
    id: 'blr-majestic',
    name: 'Kempegowda Bus Station (Majestic)',
    city: 'Bengaluru',
    state: 'Karnataka',
    lat: 12.9778,
    lng: 77.5713,
    majorRoutes: ['Mysuru (Expressway - 2h)', 'Coorg (Madikeri)', 'Ooty', 'Chennai (NH 48)', 'Hyderabad (NH 44)', 'Goa', 'Mangaluru', 'Hampi'],
  },
  {
    id: 'blr-mctc',
    name: 'Mysore Road Satellite Bus Terminal (MCTC)',
    city: 'Bengaluru (South-West)',
    state: 'Karnataka',
    lat: 12.9489,
    lng: 77.5361,
    majorRoutes: ['Mysuru', 'Madikeri / Coorg', 'Wayanad', 'Ooty', 'Kozhikode', 'Mangaluru'],
  },
  {
    id: 'mys-suburb',
    name: 'KSRTC Suburb Central Bus Stand',
    city: 'Mysuru',
    state: 'Karnataka',
    lat: 12.3117,
    lng: 76.6578,
    majorRoutes: ['Bengaluru (2h)', 'Coorg / Madikeri (2.5h)', 'Ooty (3.5h)', 'Wayanad', 'Bandipur & Kabini', 'Mangaluru'],
  },
  {
    id: 'mng-bejai',
    name: 'KSRTC Central Bus Stand (Bejai)',
    city: 'Mangaluru',
    state: 'Karnataka',
    lat: 12.8839,
    lng: 74.8489,
    majorRoutes: ['Bengaluru', 'Udupi', 'Gokarna', 'Goa', 'Kozhikode', 'Mysuru', 'Coorg'],
  },
  {
    id: 'cdk-coorg',
    name: 'Madikeri Central KSRTC Bus Stand',
    city: 'Madikeri / Coorg',
    state: 'Karnataka',
    lat: 12.4239,
    lng: 75.7386,
    majorRoutes: ['Bengaluru (6h)', 'Mysuru (2.5h)', 'Mangaluru (3h)', 'Kushalnagar / Dubare', 'Talakaveri'],
  },
  {
    id: 'hpt-ksrtc',
    name: 'Hospet KSRTC Central Bus Station (Hampi Gateway)',
    city: 'Hospet / Hampi',
    state: 'Karnataka',
    lat: 15.2689,
    lng: 76.3917,
    majorRoutes: ['Hampi Bazaar (12 km - local shuttle)', 'Bengaluru (KSRTC Sleeper)', 'Goa', 'Hyderabad', 'Hubballi', 'Badami'],
  },
  {
    id: 'gkr-ksrtc',
    name: 'Gokarna KSRTC Bus Stand',
    city: 'Gokarna',
    state: 'Karnataka',
    lat: 14.5456,
    lng: 74.3189,
    majorRoutes: ['Bengaluru Overnight Volvos', 'Goa (Margao/Panaji - 3h)', 'Mangaluru', 'Murudeshwar', 'Karwar', 'Hubballi'],
  },
  {
    id: 'udp-service',
    name: 'Udupi Service & City Bus Stand',
    city: 'Udupi',
    state: 'Karnataka',
    lat: 13.3408,
    lng: 74.7461,
    majorRoutes: ['Mangaluru', 'Bengaluru', 'Gokarna', 'Murudeshwar', 'Goa', 'Kollur Mookambika'],
  },
  {
    id: 'hbl-oldnew',
    name: 'Hubballi Central Bus Station (Old & New Stand)',
    city: 'Hubballi / Dharwad',
    state: 'Karnataka',
    lat: 15.3528,
    lng: 75.1436,
    majorRoutes: ['Bengaluru', 'Goa', 'Pune', 'Belagavi', 'Hampi', 'Badami', 'Mangaluru'],
  },
  {
    id: 'bgm-cbs',
    name: 'Belagavi Central Central Bus Stand (CBT)',
    city: 'Belagavi',
    state: 'Karnataka',
    lat: 15.8528,
    lng: 74.5089,
    majorRoutes: ['Goa (Panaji via Chorla Ghat - 3h)', 'Pune', 'Kolhapur', 'Bengaluru', 'Hubballi', 'Gokak Falls'],
  },

  // Tamil Nadu & Puducherry
  {
    id: 'maa-koyambedu',
    name: 'Chennai Mofussil Bus Terminus (KMBT / Koyambedu)',
    city: 'Chennai',
    state: 'Tamil Nadu',
    lat: 13.0674,
    lng: 80.1983,
    majorRoutes: ['Bengaluru (NH 48)', 'Pondicherry (ECR - 3h)', 'Tirupati', 'Madurai', 'Coimbatore', 'Vellore'],
  },
  {
    id: 'maa-kilambakkam',
    name: 'Kalaignar Centenary Bus Terminus (KCBT / Kilambakkam)',
    city: 'Chennai (South)',
    state: 'Tamil Nadu',
    lat: 12.8539,
    lng: 80.0719,
    majorRoutes: ['Madurai', 'Tiruchirappalli', 'Tirunelveli', 'Kanyakumari', 'Salem', 'Coimbatore', 'Rameswaram'],
  },
  {
    id: 'mdu-mattuthavani',
    name: 'Mattuthavani Integrated MGR Bus Stand',
    city: 'Madurai',
    state: 'Tamil Nadu',
    lat: 9.9458,
    lng: 78.1561,
    majorRoutes: ['Rameswaram (3.5h)', 'Kanyakumari (4h)', 'Kodaikanal (3.5h)', 'Chennai', 'Bengaluru', 'Tirunelveli', 'Munnar'],
  },
  {
    id: 'cbe-gandhipuram',
    name: 'Gandhipuram Central Bus Stand',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    lat: 11.0189,
    lng: 76.9672,
    majorRoutes: ['Ooty (3h uphill via Mettupalayam)', 'Kodaikanal', 'Bengaluru', 'Chennai', 'Kochi', 'Munnar', 'Madurai'],
  },
  {
    id: 'ooty-cbs',
    name: 'Ooty Central Bus Stand (Udhagamandalam)',
    city: 'Ooty / Nilgiris',
    state: 'Tamil Nadu',
    lat: 11.4089,
    lng: 76.6972,
    majorRoutes: ['Coimbatore (3h)', 'Mysuru (via Mudumalai & Bandipur - 3.5h)', 'Bengaluru', 'Coonoor (45m)', 'Kodaikanal', 'Madurai'],
  },
  {
    id: 'kod-cbs',
    name: 'Kodaikanal Central Bus Stand',
    city: 'Kodaikanal',
    state: 'Tamil Nadu',
    lat: 10.2356,
    lng: 77.4919,
    majorRoutes: ['Madurai (3.5h)', 'Batlagundu', 'Coimbatore', 'Bengaluru Overnight Sleeper', 'Chennai Direct Volvos', 'Palani'],
  },
  {
    id: 'trz-cbs',
    name: 'Tiruchirappalli Central Bus Stand',
    city: 'Tiruchirappalli (Trichy)',
    state: 'Tamil Nadu',
    lat: 10.7967,
    lng: 78.6881,
    majorRoutes: ['Chennai', 'Madurai', 'Thanjavur', 'Rameswaram', 'Coimbatore', 'Kumbakonam'],
  },
  {
    id: 'tpt-cbs',
    name: 'Tirupati Central Bus Station (CBS / Balaji Link)',
    city: 'Tirupati',
    state: 'Andhra Pradesh',
    lat: 13.6272,
    lng: 79.4219,
    majorRoutes: ['Tirumala Hill Top Shuttles (every 3 mins)', 'Chennai (3.5h)', 'Bengaluru (4.5h)', 'Hyderabad', 'Vijayawada'],
  },
  {
    id: 'tnv-new',
    name: 'Tirunelveli New Bus Stand (Veppamkulam)',
    city: 'Tirunelveli',
    state: 'Tamil Nadu',
    lat: 8.7061,
    lng: 77.7289,
    majorRoutes: ['Madurai', 'Kanyakumari', 'Thiruvananthapuram', 'Tenkasi / Courtallam Falls', 'Chennai', 'Tuticorin'],
  },
  {
    id: 'knk-express',
    name: 'Kanyakumari SETC Express Bus Stand',
    city: 'Kanyakumari',
    state: 'Tamil Nadu',
    lat: 8.0839,
    lng: 77.5497,
    majorRoutes: ['Madurai', 'Thiruvananthapuram (2h)', 'Tirunelveli', 'Rameswaram', 'Chennai', 'Bengaluru'],
  },
  {
    id: 'rmw-central',
    name: 'Rameswaram Central Bus Stand',
    city: 'Rameswaram',
    state: 'Tamil Nadu',
    lat: 9.2883,
    lng: 79.3089,
    majorRoutes: ['Dhanushkodi', 'Madurai', 'Tiruchirappalli', 'Kanyakumari', 'Chennai', 'Tirupati'],
  },
  {
    id: 'pnd-new',
    name: 'Pondicherry New Bus Stand (Maraimalai Adigal)',
    city: 'Pondicherry',
    state: 'Puducherry',
    lat: 11.9367,
    lng: 79.8139,
    majorRoutes: ['Chennai (ECR Express - 3h)', 'Bengaluru (via Krishnagiri - 6h)', 'Chidambaram', 'Thanjavur', 'Tiruvannamalai', 'Mahabalipuram'],
  },

  // Kerala
  {
    id: 'cok-vyttila',
    name: 'Vyttila Mobility Hub (Inter-State Bus & Metro Terminal)',
    city: 'Kochi (Cochin)',
    state: 'Kerala',
    lat: 9.9678,
    lng: 76.3197,
    majorRoutes: ['Munnar (4h)', 'Alappuzha / Alleppey (1.5h)', 'Thiruvananthapuram', 'Kozhikode', 'Bengaluru', 'Chennai', 'Coimbatore'],
  },
  {
    id: 'trv-thampanoor',
    name: 'Central Bus Station (Thampanoor)',
    city: 'Thiruvananthapuram',
    state: 'Kerala',
    lat: 8.4878,
    lng: 76.9536,
    majorRoutes: ['Kovalam (30m)', 'Varkala (1h)', 'Kanyakumari (2.5h)', 'Kochi', 'Alappuzha', 'Madurai', 'Bengaluru'],
  },
  {
    id: 'mnr-ksrtc',
    name: 'Munnar Central KSRTC Bus Stand',
    city: 'Munnar',
    state: 'Kerala',
    lat: 10.0889,
    lng: 77.0597,
    majorRoutes: ['Kochi (4h via Neriamangalam)', 'Madurai', 'Coimbatore', 'Thekkady / Periyar (3.5h)', 'Alappuzha', 'Bengaluru'],
  },
  {
    id: 'alp-boatjetty',
    name: 'Alappuzha KSRTC Boat Jetty Bus Stand',
    city: 'Alappuzha (Alleppey)',
    state: 'Kerala',
    lat: 9.4928,
    lng: 76.3319,
    majorRoutes: ['Kochi', 'Thiruvananthapuram', 'Kumarakom', 'Kollam', 'Varkala', 'Bengaluru Direct Volvos'],
  },
  {
    id: 'vrk-temple',
    name: 'Varkala Temple Junction & Cliff Bus Stand',
    city: 'Varkala',
    state: 'Kerala',
    lat: 8.7369,
    lng: 76.7164,
    majorRoutes: ['Thiruvananthapuram (1h)', 'Kollam (45m)', 'Alappuzha', 'Kochi', 'Kovalam'],
  },
  {
    id: 'tkd-kumily',
    name: 'Kumily & Thekkady KSRTC Bus Stand (Periyar)',
    city: 'Thekkady / Periyar',
    state: 'Kerala',
    lat: 9.6017,
    lng: 77.1689,
    majorRoutes: ['Munnar (3.5h)', 'Kottayam', 'Kochi', 'Madurai', 'Dindigul', 'Thiruvananthapuram'],
  },
  {
    id: 'ccj-mavoor',
    name: 'Kozhikode KSRTC Terminal (Mavoor Road)',
    city: 'Kozhikode (Calicut)',
    state: 'Kerala',
    lat: 11.2589,
    lng: 75.7897,
    majorRoutes: ['Wayanad (Sulthan Bathery / Kalpetta - 2.5h)', 'Kochi', 'Kannur', 'Bengaluru', 'Mysuru', 'Mangaluru'],
  },

  // Andhra Pradesh & Telangana
  {
    id: 'hyd-mgbs',
    name: 'Mahatma Gandhi Bus Station (MGBS / Imlibun)',
    city: 'Hyderabad',
    state: 'Telangana',
    lat: 17.3779,
    lng: 78.4839,
    majorRoutes: ['Bengaluru (NH 44 - 8h)', 'Vijayawada (4.5h)', 'Visakhapatnam', 'Pune', 'Nagpur', 'Tirupati', 'Warangal'],
  },
  {
    id: 'hyd-jbs',
    name: 'Jubilee Bus Station (JBS / Secunderabad)',
    city: 'Hyderabad (Secunderabad)',
    state: 'Telangana',
    lat: 17.4478,
    lng: 78.4989,
    majorRoutes: ['Warangal', 'Nizamabad', 'Karimnagar', 'Nagpur', 'Nanded', 'Adilabad'],
  },
  {
    id: 'vja-pnbs',
    name: 'Pandit Nehru Bus Station (PNBS)',
    city: 'Vijayawada',
    state: 'Andhra Pradesh',
    lat: 16.5103,
    lng: 80.6214,
    majorRoutes: ['Hyderabad', 'Visakhapatnam', 'Chennai', 'Tirupati', 'Guntur / Amaravati', 'Rajahmundry'],
  },
  {
    id: 'vzg-dwaraka',
    name: 'Dwaraka RTC Complex (Visakhapatnam)',
    city: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    lat: 17.7289,
    lng: 83.3089,
    majorRoutes: ['Vijayawada', 'Hyderabad', 'Bhubaneswar (8h)', 'Araku Valley (3.5h)', 'Rajahmundry', 'Jagdalpur'],
  },

  // West Bengal, Bihar & Jharkhand
  {
    id: 'ccu-esplanade',
    name: 'Esplanade Bus Terminus (Babughat / Maidan)',
    city: 'Kolkata',
    state: 'West Bengal',
    lat: 22.5647,
    lng: 88.3519,
    majorRoutes: ['Digha & Mandarmani Beaches', 'Sundarbans Base (Godkhali)', 'Siliguri (Overnight Volvo)', 'Durgapur', 'Asansol', 'Bhubaneswar', 'Ranchi'],
  },
  {
    id: 'ixb-tenzing',
    name: 'Tenzing Norgay Central Bus Terminal (Siliguri)',
    city: 'Siliguri (Darjeeling Gateway)',
    state: 'West Bengal',
    lat: 26.7214,
    lng: 88.4239,
    majorRoutes: ['Darjeeling (Hill Shared & Buses - 3h)', 'Gangtok / Sikkim (4h)', 'Kalimpong (2.5h)', 'Kolkata Direct Volvos', 'Guwahati', 'Bhutan Border (Jaigaon)'],
  },
  {
    id: 'drj-chowrasta',
    name: 'Darjeeling Motor Stand & Clubside Terminal',
    city: 'Darjeeling',
    state: 'West Bengal',
    lat: 27.0417,
    lng: 88.2661,
    majorRoutes: ['Siliguri / Bagdogra (3h)', 'Kalimpong (2h)', 'Gangtok (3.5h)', 'Mirik Lake (2h)', 'Tiger Hill Shuttles'],
  },
  {
    id: 'pat-bairiya',
    name: 'Pataliputra Bus Terminal (Bairiya ISBT)',
    city: 'Patna',
    state: 'Bihar',
    lat: 25.5683,
    lng: 85.1917,
    majorRoutes: ['Gaya / Bodh Gaya', 'Varanasi', 'Ranchi', 'Muzaffarpur', 'Darbhanga', 'Bhagalpur', 'Gorakhpur'],
  },
  {
    id: 'bdg-main',
    name: 'Bodh Gaya Main Roadways Bus Stand',
    city: 'Bodh Gaya',
    state: 'Bihar',
    lat: 24.6961,
    lng: 84.9917,
    majorRoutes: ['Gaya Railway Station (30m)', 'Patna', 'Varanasi (5h)', 'Rajgir & Nalanda', 'Ranchi'],
  },
  {
    id: 'ixr-khadgarha',
    name: 'Birsa Munda Bus Terminal (Khadgarha)',
    city: 'Ranchi',
    state: 'Jharkhand',
    lat: 23.3689,
    lng: 85.3517,
    majorRoutes: ['Jamshedpur', 'Patna', 'Kolkata', 'Deoghar', 'Bokaro', 'Dhanbad', 'Hazaribagh'],
  },

  // Odisha
  {
    id: 'bbi-baramunda',
    name: 'Baramunda ISBT (Babasaheb Ambedkar Terminal)',
    city: 'Bhubaneswar',
    state: 'Odisha',
    lat: 20.2789,
    lng: 85.7917,
    majorRoutes: ['Puri (NH 316 - 1.5h)', 'Konark Sun Temple (1.5h)', 'Cuttack (45m)', 'Chilika Lake', 'Kolkata', 'Visakhapatnam', 'Rourkela'],
  },
  {
    id: 'pri-badadanda',
    name: 'Puri Badadanda Central Bus Stand',
    city: 'Puri',
    state: 'Odisha',
    lat: 19.8139,
    lng: 85.8317,
    majorRoutes: ['Bhubaneswar (1.5h)', 'Konark Marine Drive (45m)', 'Chilika Lake (Satapada)', 'Cuttack', 'Kolkata Direct Volvos'],
  },

  // Assam & Northeast States
  {
    id: 'gau-betkuchi',
    name: 'Guwahati ISBT (Betkuchi, NH 37)',
    city: 'Guwahati',
    state: 'Assam',
    lat: 26.1139,
    lng: 91.7317,
    majorRoutes: ['Shillong (3h)', 'Kaziranga National Park (4.5h)', 'Tezpur', 'Jorhat', 'Silchar', 'Itanagar', 'Dimapur'],
  },
  {
    id: 'shl-polo',
    name: 'Shillong Polo Ground & Anjalee Bus Stand',
    city: 'Shillong',
    state: 'Meghalaya',
    lat: 25.5817,
    lng: 91.8917,
    majorRoutes: ['Guwahati (3h)', 'Cherrapunji / Sohra (2h)', 'Dawki / Shnongpdeng River (2.5h)', 'Mawlynnong Cleanest Village', 'Jowai'],
  },
  {
    id: 'kzr-kohora',
    name: 'Kohora Highway Bus Hub (Kaziranga Central)',
    city: 'Kaziranga',
    state: 'Assam',
    lat: 26.5878,
    lng: 93.4189,
    majorRoutes: ['Guwahati (4.5h)', 'Jorhat (1.5h)', 'Tezpur', 'Dibrugarh', 'Kaziranga Central Safari Gate'],
  },
  {
    id: 'gtk-snt',
    name: 'Gangtok SNT Central Bus Terminus (Siliguri Road)',
    city: 'Gangtok',
    state: 'Sikkim',
    lat: 27.3239,
    lng: 88.6089,
    majorRoutes: ['Siliguri Tenzing Norgay (4h)', 'Bagdogra Airport', 'Darjeeling (3.5h)', 'Tsomgo Lake & Nathula Shuttles', 'North Sikkim (Lachen/Lachung)', 'Pelling'],
  },
  {
    id: 'twg-market',
    name: 'Tawang Old Market Shared Sumo & Bus Stand',
    city: 'Tawang',
    state: 'Arunachal Pradesh',
    lat: 27.5861,
    lng: 91.8653,
    majorRoutes: ['Tezpur / Guwahati (via Sela Pass)', 'Bomdila', 'Dirang', 'Tawang Monastery'],
  },

  // Andaman Islands
  {
    id: 'ixz-mohanpura',
    name: 'Port Blair Mohanpura Central Bus Terminus',
    city: 'Port Blair',
    state: 'Andaman & Nicobar Islands',
    lat: 11.6683,
    lng: 92.7389,
    majorRoutes: ['Baratang Island (ATR Convoy)', 'Rangat', 'Mayabunder', 'Diglipur (Ross & Smith Gateway)', 'Wandoor Beach', 'Chidiya Tapu'],
  },
];

// Validate unique bus terminal IDs
const terminalIdSet = new Set();
for (const bt of BUS_TERMINALS) {
  if (terminalIdSet.has(bt.id)) {
    throw new Error(`DUPLICATE BUS TERMINAL ID: ${bt.id} (${bt.name})`);
  }
  terminalIdSet.add(bt.id);
}

const busTerminalsTsContent = `export interface BusTerminal {
  id: string;
  name: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  majorRoutes: string[];
}

export const INDIAN_BUS_TERMINALS: BusTerminal[] = ${JSON.stringify(BUS_TERMINALS, null, 2)};

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

// Find nearest bus terminal to GPS coordinates
export function findNearestBusTerminal(lat: number, lng: number): { terminal: BusTerminal; distanceKm: number } {
  let closest = INDIAN_BUS_TERMINALS[0];
  let minDistance = Infinity;

  for (const bt of INDIAN_BUS_TERMINALS) {
    const d = getDistanceKm(lat, lng, bt.lat, bt.lng);
    if (d < minDistance) {
      minDistance = d;
      closest = bt;
    }
  }

  return { terminal: closest, distanceKm: minDistance };
}

// Search bus terminals by city, terminal name, state, or destination routes
export function searchBusTerminals(query: string, limit: number = 25): BusTerminal[] {
  const q = query.trim().toUpperCase();
  if (!q) return INDIAN_BUS_TERMINALS.slice(0, limit);

  return INDIAN_BUS_TERMINALS.filter(
    (bt) =>
      bt.city.toUpperCase().includes(q) ||
      bt.name.toUpperCase().includes(q) ||
      bt.state.toUpperCase().includes(q) ||
      bt.majorRoutes.some((r) => r.toUpperCase().includes(q))
  ).slice(0, limit);
}
`;

fs.writeFileSync('./src/data/busTerminals.ts', busTerminalsTsContent, 'utf8');
console.log(`Saved src/data/busTerminals.ts with ${BUS_TERMINALS.length} bus terminals.`);
