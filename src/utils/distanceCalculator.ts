// Comprehensive and accurate Navi Mumbai region distance mapping in kilometers
const naviMumbaiDistances = {
  'vashi': {
    'nerul': 5.2,
    'belapur': 8.7,
    'kharghar': 12.5,
    'panvel': 19.8,
    'airoli': 7.3,
    'ghansoli': 4.6,
    'kopar khairane': 3.2,
    'sanpada': 1.8,
    'juinagar': 3.5,
    'seawoods': 6.1,
    'cbd belapur': 8.7,
    'khanda colony': 15.3,
    'taloja': 22.4,
  },
  'nerul': {
    'vashi': 5.2,
    'belapur': 3.5,
    'kharghar': 7.3,
    'panvel': 14.6,
    'airoli': 12.5,
    'ghansoli': 9.8,
    'kopar khairane': 8.4,
    'sanpada': 3.4,
    'juinagar': 1.7,
    'seawoods': 0.9,
    'cbd belapur': 3.5,
    'khanda colony': 10.1,
    'taloja': 17.2,
  },
  'belapur': {
    'vashi': 8.7,
    'nerul': 3.5,
    'kharghar': 3.8,
    'panvel': 11.1,
    'airoli': 16.0,
    'ghansoli': 13.3,
    'kopar khairane': 11.9,
    'sanpada': 6.9,
    'juinagar': 5.2,
    'seawoods': 2.6,
    'cbd belapur': 0.0,
    'khanda colony': 6.6,
    'taloja': 13.7,
  },
  'kharghar': {
    'vashi': 12.5,
    'nerul': 7.3,
    'belapur': 3.8,
    'panvel': 7.3,
    'airoli': 19.8,
    'ghansoli': 17.1,
    'kopar khairane': 15.7,
    'sanpada': 10.7,
    'juinagar': 9.0,
    'seawoods': 6.4,
    'cbd belapur': 3.8,
    'khanda colony': 2.8,
    'taloja': 9.9,
  },
  'panvel': {
    'vashi': 19.8,
    'nerul': 14.6,
    'belapur': 11.1,
    'kharghar': 7.3,
    'airoli': 27.1,
    'ghansoli': 24.4,
    'kopar khairane': 23.0,
    'sanpada': 18.0,
    'juinagar': 16.3,
    'seawoods': 13.7,
    'cbd belapur': 11.1,
    'khanda colony': 4.5,
    'taloja': 9.1,
  },
  'airoli': {
    'vashi': 7.3,
    'nerul': 12.5,
    'belapur': 16.0,
    'kharghar': 19.8,
    'panvel': 27.1,
    'ghansoli': 2.7,
    'kopar khairane': 4.1,
    'sanpada': 9.1,
    'juinagar': 10.8,
    'seawoods': 13.4,
    'cbd belapur': 16.0,
    'khanda colony': 22.6,
    'taloja': 29.7,
  },
  'ghansoli': {
    'vashi': 4.6,
    'nerul': 9.8,
    'belapur': 13.3,
    'kharghar': 17.1,
    'panvel': 24.4,
    'airoli': 2.7,
    'kopar khairane': 1.4,
    'sanpada': 6.4,
    'juinagar': 8.1,
    'seawoods': 10.7,
    'cbd belapur': 13.3,
    'khanda colony': 19.9,
    'taloja': 27.0,
  },
  'kopar khairane': {
    'vashi': 3.2,
    'nerul': 8.4,
    'belapur': 11.9,
    'kharghar': 15.7,
    'panvel': 23.0,
    'airoli': 4.1,
    'ghansoli': 1.4,
    'sanpada': 5.0,
    'juinagar': 6.7,
    'seawoods': 9.3,
    'cbd belapur': 11.9,
    'khanda colony': 18.5,
    'taloja': 25.6,
  },
  'sanpada': {
    'vashi': 1.8,
    'nerul': 3.4,
    'belapur': 6.9,
    'kharghar': 10.7,
    'panvel': 18.0,
    'airoli': 9.1,
    'ghansoli': 6.4,
    'kopar khairane': 5.0,
    'juinagar': 1.7,
    'seawoods': 4.3,
    'cbd belapur': 6.9,
    'khanda colony': 13.5,
    'taloja': 20.6,
  },
  'juinagar': {
    'vashi': 3.5,
    'nerul': 1.7,
    'belapur': 5.2,
    'kharghar': 9.0,
    'panvel': 16.3,
    'airoli': 10.8,
    'ghansoli': 8.1,
    'kopar khairane': 6.7,
    'sanpada': 1.7,
    'seawoods': 2.6,
    'cbd belapur': 5.2,
    'khanda colony': 11.8,
    'taloja': 18.9,
  },
  'seawoods': {
    'vashi': 6.1,
    'nerul': 0.9,
    'belapur': 2.6,
    'kharghar': 6.4,
    'panvel': 13.7,
    'airoli': 13.4,
    'ghansoli': 10.7,
    'kopar khairane': 9.3,
    'sanpada': 4.3,
    'juinagar': 2.6,
    'cbd belapur': 2.6,
    'khanda colony': 9.2,
    'taloja': 16.3,
  }
};

// Helper function to calculate accurate distance between Navi Mumbai locations
export const calculateNaviMumbaiDistance = (origin: string, destination: string): number | null => {
  const originLower = origin.toLowerCase();
  const destinationLower = destination.toLowerCase();
  
  // Check if we have exact data for these locations
  for (const [baseLocation, distances] of Object.entries(naviMumbaiDistances)) {
    if (originLower.includes(baseLocation)) {
      for (const [targetLocation, distance] of Object.entries(distances)) {
        if (destinationLower.includes(targetLocation)) {
          return distance;
        }
      }
    }
    
    // Check reverse direction
    if (destinationLower.includes(baseLocation)) {
      for (const [targetLocation, distance] of Object.entries(distances)) {
        if (originLower.includes(targetLocation)) {
          return distance;
        }
      }
    }
  }
  
  return null; // If no match found
};
