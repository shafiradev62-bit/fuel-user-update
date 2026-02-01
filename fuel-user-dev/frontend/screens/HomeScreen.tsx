import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, MapPin, Star, Fuel, Mic, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Station } from '../types';
import { apiGetStations, apiGetMe } from '../services/api';
import { useAppContext } from '../context/AppContext';
import MapboxMap from '../components/MapboxMap';
import AnimatedPage from '../components/AnimatedPage';
import Button from '../components/Button';
import TouchFeedback from '../components/TouchFeedback';
import TapEffectButton from '../components/TapEffectButton';

// Station Card Component
const StationCard = ({ station, index }: { station: any; index: number }) => {
  const navigate = useNavigate();
  const imageUrl = index % 2 === 0 ? '/image-card-1.png' : '/image-card-2.png';

  return (
    <div className="bg-white dark:bg-gray-800 dark:border-gray-700 rounded-2xl shadow-xl border border-gray-100 p-0 flex flex-col sm:flex-row hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      <div className="w-full sm:w-[118px] h-[200px] sm:h-[183px] p-2 relative">
        <img
          src={station.imageUrl || station.image || imageUrl}
          alt={station.name}
          className="w-full sm:w-[102px] h-full sm:h-[164px] object-cover rounded-lg shadow-md"
          onError={(e) => {
            e.currentTarget.src = imageUrl;
          }}
        />
      </div>
      <div className="flex-1 p-2">
        <div className="p-2">
          <h3 className="text-base font-bold text-[#3F4249] dark:text-white mb-3">{station.name}</h3>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Fuel size={20} className="text-[#3AC36C]" />
                <span className="text-sm font-medium text-[#3F4249] dark:text-gray-300">Fuel Price</span>
              </div>
              <span className="text-sm sm:text-base font-bold text-[#3F4249] dark:text-gray-200">
                ${station.fuelPrices?.regular || station.fuelPrices?.premium || station.fuelPrices?.diesel || 'N/A'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin size={20} className="text-[#FF5630]" />
              <span className="text-sm font-medium text-[#3F4249] dark:text-gray-300 flex-1 truncate">
                {station.address || 'Address not available'} • {station.distance || 'Distance N/A'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              </div>
              <span className="text-sm font-medium text-[#3F4249] dark:text-gray-300 flex-1">
                Average Delivery: {station.averageDeliveryTime || 30} minutes
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Star size={20} className="text-[#FFC107] fill-current" />
              <span className="text-sm font-bold text-[#3F4249] dark:text-gray-300">{station.rating || 'N/A'} Rating</span>
              <span className="text-xs text-[#3AC36C]">({station.reviewCount || station.totalReviews || 0} reviews)</span>
            </div>
          </div>

          <TouchFeedback onPress={() => navigate(`/station/${station.id}`, { state: { station } })} className="mt-4 block">
            <Button
              variant="primary"
              size="sm"
              className="w-full py-3 px-4 text-sm font-bold shadow-lg hover:shadow-xl rounded-full"
            >
              Select Station
            </Button>
          </TouchFeedback>
        </div>
      </div>
    </div>
  );
};

const HomeScreen = () => {
  const { user, logout } = useAppContext();
  const [stations, setStations] = useState<Omit<Station, 'groceries' | 'fuelFriends'>[]>([]);
  const [allStations, setAllStations] = useState<Omit<Station, 'groceries' | 'fuelFriends'>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number, lon: number } | null>(null);
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    fuelType: '',
    priceRange: '',
    distance: '',
    rating: ''
  });
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<'UK' | 'US' | null>(null);
  const [showGreeting, setShowGreeting] = useState(false);
  const [greetingMessage, setGreetingMessage] = useState('');

  // Search Suggestions State
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate();

  // Validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        await apiGetMe();
      } catch (error) {
        console.error('Token validation failed:', error);
        logout();
        navigate('/login');
      }
    };

    validateToken();
  }, [navigate, logout]);

  // Helper function to determine if location is in UK
  const isLocationInUK = (location: { lat: number, lon: number } | null) => {
    if (!location) return false;
    return location.lat > 49 && location.lat < 60 && location.lon > -10 && location.lon < 2;
  };

  // Function to handle location change - can be called from anywhere
  const setLocationAndRefresh = (location: 'UK' | 'US') => {
    setSelectedLocation(location);
    localStorage.setItem('userLocationPreference', location);

    // Set default coordinates
    if (location === 'UK') {
      setUserLocation({ lat: 51.5074, lon: -0.1278 }); // London
    } else {
      setUserLocation({ lat: 40.7128, lon: -74.0060 }); // New York
    }

    // Show greeting notification
    const greeting = getGreetingMessage(location);
    setGreetingMessage(greeting);
    setShowGreeting(true);

    // Hide greeting after 3 seconds
    setTimeout(() => {
      setShowGreeting(false);
    }, 3000);
  };

  // Helper function to get greeting based on time
  const getGreetingMessage = (location: 'UK' | 'US') => {
    // Get current time in the selected location
    const now = new Date();
    const timezone = location === 'UK' ? 'Europe/London' : 'America/New_York';
    const timeInLocation = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      hour12: false
    }).format(now);

    const hour = parseInt(timeInLocation);

    if (hour >= 5 && hour < 12) {
      return 'Good morning';
    } else if (hour >= 12 && hour < 17) {
      return 'Good afternoon';
    } else if (hour >= 17 && hour < 21) {
      return 'Good evening';
    } else {
      return 'Good night';
    }
  };

  // Show location selection modal every time home screen loads
  useEffect(() => {
    const hasSelectedLocation = localStorage.getItem('userLocationPreference');

    // Always show the modal, but pre-select if location exists
    setShowLocationModal(true);

    if (hasSelectedLocation) {
      setSelectedLocation(hasSelectedLocation as 'UK' | 'US');
      // Set default location based on preference
      if (hasSelectedLocation === 'UK') {
        setUserLocation({ lat: 51.5074, lon: -0.1278 }); // London
      } else {
        setUserLocation({ lat: 40.7128, lon: -74.0060 }); // New York
      }
    }
  }, []);

  // Handle location selection
  const handleLocationSelect = (location: 'UK' | 'US') => {
    setLocationAndRefresh(location);
  };

  // Handle modal continue button
  const handleModalContinue = () => {
    if (selectedLocation) {
      // Show greeting notification
      const greeting = getGreetingMessage(selectedLocation);
      setGreetingMessage(greeting);
      setShowGreeting(true);

      // Hide greeting after 3 seconds
      setTimeout(() => {
        setShowGreeting(false);
      }, 3000);

      setShowLocationModal(false);
    }
  };

  // Function to quickly switch to UK location
  const goToUK = () => {
    setLocationAndRefresh('UK');
    setShowLocationModal(false);
  };

  // Function to quickly switch to US location
  const goToUS = () => {
    setLocationAndRefresh('US');
    setShowLocationModal(false);
  };

  // Voice search functionality
  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice search not supported in this browser');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      alert('Voice search failed. Please try again.');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // Filter stations based on search query and filters
  const filterStations = (searchQuery: string, currentFilters = filters) => {
    let filtered = [...allStations];

    // Text search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(station =>
        station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (station.address && station.address.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Fuel type filter
    if (currentFilters.fuelType) {
      filtered = filtered.filter(station => {
        // Assuming station has fuel types available
        return true; // Placeholder - adjust based on your data structure
      });
    }

    // Price range filter
    if (currentFilters.priceRange) {
      filtered = filtered.filter(station => {
        const price = (station as any).regularPrice || 0;
        switch (currentFilters.priceRange) {
          case 'low': return price < 30;
          case 'medium': return price >= 30 && price < 40;
          case 'high': return price >= 40;
          default: return true;
        }
      });
    }

    // Distance filter (assuming you have distance calculation)
    if (currentFilters.distance) {
      filtered = filtered.filter(station => {
        // Placeholder - implement distance calculation
        return true;
      });
    }

    // Rating filter
    if (currentFilters.rating) {
      const minRating = parseFloat(currentFilters.rating);
      filtered = filtered.filter(station =>
        (station.rating || 0) >= minRating
      );
    }

    setStations(filtered);
  };

  // Handle filter changes
  const handleFilterChange = (filterType: string, value: string) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    filterStations(query, newFilters);
  };

  // Clear all filters
  const clearFilters = () => {
    const emptyFilters = { fuelType: '', priceRange: '', distance: '', rating: '' };
    setFilters(emptyFilters);
    filterStations(query, emptyFilters);
  };

  // Helper function to get fallback stations
  const getFallbackStations = () => {
    // Default to US locations (New York area)
    const isUK = selectedLocation === 'UK' || isLocationInUK(userLocation);

    // Real fuel station brands for US and UK
    const usBrands = [
      `Shell`, `Exxon Mobil`, `Chevron`, `BP`, `Marathon`, `Speedway`,
      `7-Eleven`, `Circle K`, `Sunoco`, `Valero`, `Phillips 66`,
      `Sinclair`, `Gulf`, `Wawa`, `Sheetz`, `Buc-ee's`, `Casey's`,
      `QuikTrip`, `Costco Gasoline`, `Kum & Go`, `Love's Travel Stops`, `Pilot Flying J`
    ];

    const ukBrands = [
      `BP`, `Shell`, `Esso`, `Texaco`, `Jet`, `Tesco`, `Sainsbury's`,
      `Asda`, `Morrisons`, `Applegreen`, `Murco`, `Gulf (UK)`,
      `Harvest Energy`, `Gleaner`, `Moto`, `Welcome Break`, `Roadchef`
    ];

    // Fallback groceries data - UK and US specific
    const fallbackGroceriesUK = [
      {
        id: 'grocery-uk-1',
        name: 'Bottled Water',
        price: 1.20,
        description: 'Pure mineral water'
      },
      {
        id: 'grocery-uk-2',
        name: 'Energy Drink',
        price: 2.50,
        description: 'Red Bull energy boost'
      },
      {
        id: 'grocery-uk-3',
        name: 'Crisps',
        price: 1.50,
        description: 'Walkers salted crisps'
      },
      {
        id: 'grocery-uk-4',
        name: 'Tea',
        price: 2.00,
        description: 'PG Tips tea bags'
      },
      {
        id: 'grocery-uk-5',
        name: 'Chocolate Bar',
        price: 1.00,
        description: 'Cadbury Dairy Milk'
      },
      {
        id: 'grocery-uk-6',
        name: 'Sandwich',
        price: 3.50,
        description: 'Prawn mayo sandwich'
      },
      {
        id: 'grocery-uk-7',
        name: 'Soft Drink',
        price: 1.80,
        description: 'Coca Cola 500ml'
      },
      {
        id: 'grocery-uk-8',
        name: 'Biscuits',
        price: 1.20,
        description: 'Digestive biscuits'
      },
      {
        id: 'grocery-uk-9',
        name: 'Juice',
        price: 2.20,
        description: 'Orange juice 1L'
      },
      {
        id: 'grocery-uk-10',
        name: 'Mints',
        price: 0.80,
        description: 'Extra strong mints'
      }
    ];

    const fallbackGroceriesUS = [
      {
        id: 'grocery-us-1',
        name: 'Bottled Water',
        price: 2.50,
        description: 'Pure drinking water'
      },
      {
        id: 'grocery-us-2',
        name: 'Energy Drink',
        price: 3.99,
        description: 'Monster energy boost'
      },
      {
        id: 'grocery-us-3',
        name: 'Potato Chips',
        price: 2.99,
        description: 'Lays classic chips'
      },
      {
        id: 'grocery-us-4',
        name: 'Coffee',
        price: 5.99,
        description: 'Starbucks coffee'
      },
      {
        id: 'grocery-us-5',
        name: 'Sandwich',
        price: 7.99,
        description: 'Turkey club sandwich'
      },
      {
        id: 'grocery-us-6',
        name: 'Chocolate Bar',
        price: 2.99,
        description: 'Hershey chocolate'
      },
      {
        id: 'grocery-us-7',
        name: 'Soda',
        price: 2.49,
        description: 'Coca Cola 2L'
      },
      {
        id: 'grocery-us-8',
        name: 'Donut',
        price: 3.49,
        description: 'Glazed donut'
      },
      {
        id: 'grocery-us-9',
        name: 'Gatorade',
        price: 4.99,
        description: 'Sports drink'
      },
      {
        id: 'grocery-us-10',
        name: 'Protein Bar',
        price: 6.99,
        description: 'High protein bar'
      },
      {
        id: 'grocery-us-11',
        name: 'Ice Cream',
        price: 4.99,
        description: 'Vanilla ice cream'
      },
      {
        id: 'grocery-us-12',
        name: 'Energy Bar',
        price: 3.99,
        description: 'Cliff energy bar'
      }
    ];

    // Fallback fuel friends data - UK and US specific
    const fallbackFuelFriendsUK = [
      {
        id: 'friend-uk-1',
        name: 'James Mitchell',
        rating: 4.8,
        reviewCount: 156,
        avatarUrl: '/fuel friend.png',
        location: '0.5 miles away',
        rate: 4.99,
        phone: '+447712345678'
      },
      {
        id: 'friend-uk-2',
        name: 'Emma Thompson',
        rating: 4.9,
        reviewCount: 203,
        avatarUrl: '/fuel friend.png',
        location: '0.3 miles away',
        rate: 5.49,
        phone: '+447712345679'
      },
      {
        id: 'friend-uk-3',
        name: 'Michael Davies',
        rating: 4.7,
        reviewCount: 142,
        avatarUrl: '/fuel friend.png',
        location: '0.8 miles away',
        rate: 4.49,
        phone: '+447712345680'
      },
      {
        id: 'friend-uk-4',
        name: 'Sarah Williams',
        rating: 5.0,
        reviewCount: 189,
        avatarUrl: '/fuel friend.png',
        location: '0.6 miles away',
        rate: 6.99,
        phone: '+447712345681'
      }
    ];

    const fallbackFuelFriendsUS = [
      {
        id: 'friend-us-1',
        name: 'David Johnson',
        rating: 4.8,
        reviewCount: 156,
        avatarUrl: '/fuel friend.png',
        location: '0.5 miles away',
        rate: 5.99,
        phone: '+12125551234'
      },
      {
        id: 'friend-us-2',
        name: 'Jennifer Smith',
        rating: 4.9,
        reviewCount: 203,
        avatarUrl: '/fuel friend.png',
        location: '0.3 miles away',
        rate: 6.99,
        phone: '+12125551235'
      },
      {
        id: 'friend-us-3',
        name: 'Robert Wilson',
        rating: 4.7,
        reviewCount: 142,
        avatarUrl: '/fuel friend.png',
        location: '0.8 miles away',
        rate: 5.49,
        phone: '+12125551236'
      },
      {
        id: 'friend-us-4',
        name: 'Maria Garcia',
        rating: 5.0,
        reviewCount: 189,
        avatarUrl: '/fuel friend.png',
        location: '0.6 miles away',
        rate: 7.99,
        phone: '+12125551237'
      }
    ];

    // Generate stations using real brand names
    const brandList = isUK ? ukBrands : usBrands;

    // Real addresses for UK and US
    const ukAddresses = [
      'Oxford Street, London W1D 1BS',
      'Regent Street, London W1B 4HY',
      'High Holborn, London WC1V 7RA',
      'Tottenham Court Road, London W1T 2BF',
      'Bond Street, London W1S 1AS',
      'Covent Garden, London WC2E 8RF'
    ];

    const usAddresses = [
      'Times Square, New York, NY 10036',
      'Broadway, New York, NY 10036',
      '5th Avenue, New York, NY 10001',
      'Madison Avenue, New York, NY 10016',
      'Park Avenue, New York, NY 10016',
      'Lexington Avenue, New York, NY 10016'
    ];

    const addresses = isUK ? ukAddresses : usAddresses;

    // Generate stations dynamically
    return brandList.slice(0, 6).map((brand, index) => {
      const stationType = isUK ? 'Petrol Station' : 'Gas Station';
      const currency = isUK ? '£' : '$';

      // Generate realistic prices
      const regularPrice = isUK ? (1.30 + Math.random() * 0.30) : (3.00 + Math.random() * 1.00);
      const premiumPrice = isUK ? (1.50 + Math.random() * 0.30) : (3.50 + Math.random() * 1.00);
      const dieselPrice = isUK ? (1.40 + Math.random() * 0.30) : (3.20 + Math.random() * 1.00);

      return {
        id: `station-${isUK ? 'uk' : 'us'}-${index}-${Date.now()}`,
        name: `${brand} ${stationType}`,
        address: addresses[index] || (isUK ? 'London, UK' : 'New York, NY'),
        distance: `${(0.3 + Math.random() * 0.7).toFixed(1)} miles`,
        deliveryTime: `${Math.floor(10 + Math.random() * 15)} mins`,
        rating: parseFloat((4.0 + Math.random() * 1.0).toFixed(1)),
        reviewCount: Math.floor(50 + Math.random() * 200),
        imageUrl: index % 2 === 0 ? '/image-card-1.png' : '/image-card-2.png',
        bannerUrl: index % 2 === 0 ? '/image-card-1.png' : '/image-card-2.png',
        logoUrl: '/logo-green.png',
        fuelPrices: {
          regular: parseFloat(regularPrice.toFixed(2)),
          premium: parseFloat(premiumPrice.toFixed(2)),
          diesel: parseFloat(dieselPrice.toFixed(2)),
        },
        lat: isUK ? (51.5074 + (Math.random() - 0.5) * 0.02) : (40.7580 + (Math.random() - 0.5) * 0.02),
        lon: isUK ? (-0.1278 + (Math.random() - 0.5) * 0.02) : (-73.9855 + (Math.random() - 0.5) * 0.02),
        groceries: isUK ? fallbackGroceriesUK : fallbackGroceriesUS,
        fuelFriends: isUK ? fallbackFuelFriendsUK : fallbackFuelFriendsUS
      };
    });
  };

  // Helper function to calculate distance between two points (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 3958.8; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in miles
  };

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setQuery(value);

    if (value.trim().length > 0) {
      // Generate Suggestions
      const stationMatches = allStations.filter(s => s.name.toLowerCase().includes(value.toLowerCase())).map(s => ({ type: 'station', ...s }));

      // Grocery matches
      const groceryMatches: any[] = [];
      allStations.forEach(s => {
        if (s.groceries) {
          s.groceries.forEach((g: any) => {
            if (g.name.toLowerCase().includes(value.toLowerCase())) {
              if (!groceryMatches.some(gm => gm.name === g.name)) {
                groceryMatches.push({ type: 'grocery', ...g, stationId: s.id, stationName: s.name });
              }
            }
          });
        }
      });

      setSuggestions([...stationMatches, ...groceryMatches].slice(0, 5));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    filterStations(value, filters);
  };

  const handleSuggestionClick = (item: any) => {
    setQuery(item.name);
    setShowSuggestions(false);
    if (item.type === 'station') {
      navigate(`/station/${item.id}`);
    } else if (item.type === 'grocery' && item.stationId) {
      navigate(`/station/${item.stationId}`, { state: { initialTab: 'groceries' } }); // Assuming we can pass state to switch tab
    }
  };

  // Set default location (NO geolocation detection)
  useEffect(() => {
    // Directly use New York as default location - NO location detection
    setUserLocation({ lat: 40.7580, lon: -73.9855 }); // New York, US
  }, []);

  // Fetch real fuel stations using Mapbox API
  useEffect(() => {
    const fetchNearbyStations = async () => {
      if (!userLocation) return;

      setIsLoading(true);
      setError('');

      try {
        // Use Mapbox Geocoding API to search for fuel stations nearby
        let mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

        // Fallback to hardcoded token if environment variable is missing
        if (!mapboxToken) {
          mapboxToken = 'pk.eyJ1IjoidmluYTk4IiwiYSI6ImNtN3I3eDF6ZTB2OW0yam9kdzFxdndhdTkifQ.HNqbNgBUAoBPYmoAMISdaw';
          console.warn('Using fallback Mapbox token');
        }

        // Calculate bounds around user location
        const lat = userLocation.lat;
        const lon = userLocation.lon;

        // Search for fuel stations within 10km radius
        const bbox = [
          lon - 0.1, // west longitude
          lat - 0.1, // south latitude
          lon + 0.1, // east longitude
          lat + 0.1  // north latitude
        ].join(',');

        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/fuel.json?`
          + `access_token=${mapboxToken}`
          + `&bbox=${bbox}`
          + `&limit=10`
          + `&types=poi`
          + `&country=US,GB` // Only US and Great Britain (UK)
        );

        if (!response.ok) {
          throw new Error(`Mapbox API error: ${response.status}`);
        }

        const data = await response.json();

        // Process the results into our station format
        let processedStations: any[] = [];

        if (data.features && data.features.length > 0) {
          processedStations = data.features.map((feature: any, index: number) => {
            // Calculate distance using Haversine formula
            const distance = calculateDistance(
              userLocation.lat,
              userLocation.lon,
              feature.geometry.coordinates[1],
              feature.geometry.coordinates[0]
            );

            // Generate random but realistic fuel prices based on region
            const isUK = isLocationInUK(userLocation); // More precise UK coordinates
            const currencySymbol = isUK ? '£' : '$';

            const regularPrice = isUK ? (1.3 + Math.random() * 0.3).toFixed(2) : (3.0 + Math.random() * 1.0).toFixed(2);
            const premiumPrice = isUK ? (1.5 + Math.random() * 0.3).toFixed(2) : (3.5 + Math.random() * 1.0).toFixed(2);
            const dieselPrice = isUK ? (1.4 + Math.random() * 0.3).toFixed(2) : (3.2 + Math.random() * 1.0).toFixed(2);

            return {
              id: `station-${index}-${Date.now()}`,
              name: feature.text || 'Fuel Station',
              address: feature.place_name || 'Address not available',
              distance: `${distance.toFixed(1)} ${isUK ? 'miles' : 'miles'}`,
              deliveryTime: `${Math.floor(Math.random() * 20) + 10} mins`,
              rating: parseFloat((4.0 + Math.random() * 1.0).toFixed(1)),
              reviewCount: Math.floor(Math.random() * 200) + 20,
              imageUrl: index % 2 === 0 ? '/image-card-1.png' : '/image-card-2.png',
              bannerUrl: index % 2 === 0 ? '/image-card-1.png' : '/image-card-2.png',
              logoUrl: '/logo-green.png',
              fuelPrices: {
                regular: parseFloat(regularPrice),
                premium: parseFloat(premiumPrice),
                diesel: parseFloat(dieselPrice),
              },
              lat: feature.geometry.coordinates[1],
              lon: feature.geometry.coordinates[0],
              groceries: [],
              fuelFriends: []
            };
          });
        }

        // If no stations found from API, use fallback data
        if (processedStations.length === 0) {
          console.warn('No stations found from API, using fallback data');
          processedStations = getFallbackStations();
        }

        setAllStations(processedStations);
        setStations(processedStations);
      } catch (err: any) {
        console.error('Error fetching stations:', err);
        setError(err.message || 'Failed to load fuel stations');

        // Fallback to mock data if API fails
        const fallbackStations = getFallbackStations();
        setAllStations(fallbackStations);
        setStations(fallbackStations);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNearbyStations();
  }, [userLocation]);

  return (
    <AnimatedPage>
      <div className="bg-white dark:bg-black overflow-y-auto min-h-screen overflow-x-hidden" style={{ width: '100vw', maxWidth: '100vw' }}>
        {/* iOS-style Greeting Notification */}
        {showGreeting && (
          <div className="fixed top-0 left-0 right-0 z-50 animate-slide-down">
            <div className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 px-4 py-3 shadow-sm">
              <div className="flex items-center justify-center">
                <div className="text-gray-900 font-medium">
                  {greetingMessage}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header & Search Bar */}
        <div className="sticky top-0 bg-white z-10 shadow-sm">
          {/* Status Bar Spacer - blank */}
          <div className="h-[38px] bg-white"></div>

          {/* Header - sesuai Figma */}
          <div className="flex justify-between items-center px-4 py-3">
            <div className="flex items-center gap-3 flex-1">
              <TapEffectButton
                onClick={() => navigate('/profile')}
                className="w-7 h-7 rounded-full bg-gray-200 overflow-hidden hover:ring-2 hover:ring-[#3AC36C] transition-all duration-200 flex-shrink-0"
                rippleColor="rgba(58, 195, 108, 0.3)"
                scaleEffect={false}
              >
                <img
                  src="/fuel friend.png"
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'%3E%3Ccircle cx='14' cy='14' r='14' fill='%23e5e7eb'/%3E%3Cpath d='M14 8a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM8 20a6 6 0 0 1 12 0H8z' fill='%23999'/%3E%3C/svg%3E";
                  }}
                />
              </TapEffectButton>
              <img
                src="/tulisan.svg"
                alt="FuelFriendly"
                className="h-6 flex-1 max-w-none"
                style={{ width: 'calc(100% - 3rem)' }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  // Show text fallback
                  const textElement = e.currentTarget.nextElementSibling;
                  if (textElement && (textElement as HTMLElement).style) (textElement as HTMLElement).style.display = 'block';
                }}
              />
              <span className="text-lg font-bold text-[#3AC36C] hidden flex-1">FUELFRIENDLY</span>
            </div>
            <div className="flex items-center space-x-2 ml-3">
              {/* Location Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowLocationModal(true)}
                  className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors flex-shrink-0"
                >
                  {selectedLocation === 'UK' ? (
                    <img
                      src="https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg"
                      alt="UK"
                      className="w-4 h-3 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30"><clipPath id="a"><rect width="60" height="30"/></clipPath><clipPath id="b"><path d="M0 0v30h60V0z"/></clipPath><g clip-path="url(%23a)"><path d="M0 0v30h60V0z" fill="#012169"/><path d="M0 0 60 30M60 0 0 30" stroke="#fff" stroke-width="6"/><path d="M0 0 60 30M60 0 0 30" clip-path="url(%23b)" stroke="#C8102E" stroke-width="4"/><path d="M30 0v30M0 15h60" stroke="#fff" stroke-width="10"/><path d="M30 0v30M0 15h60" stroke="#C8102E" stroke-width="6"/></g></svg>';
                      }}
                    />
                  ) : (
                    <img
                      src="https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg"
                      alt="US"
                      className="w-4 h-3 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7410 3900"><rect width="7410" height="3900" fill="%23b22234"/><path d="M0 450h7410m0 600H0m0 600h7410m0 600H0m0 600h7410m0 600H0" stroke="%23fff" stroke-width="300"/><rect width="2964" height="2100" fill="%233c3b6e"/><path d="M247 90 317.53 307.08 545.5 307.08 361 441.27 431.53 658.35 247 524.16 62.47 658.35 133 441.27 -51.53 307.08 176.47 307.08z" fill="%23fff" transform="scale(11.84)"/><path d="M247 90 317.53 307.08 545.5 307.08 361 441.27 431.53 658.35 247 524.16 62.47 658.35 133 441.27 -51.53 307.08 176.47 307.08z" fill="%23fff" transform="scale(11.84) translate(63 42)"/><path d="M247 90 317.53 307.08 545.5 307.08 361 441.27 431.53 658.35 247 524.16 62.47 658.35 133 441.27 -51.53 307.08 176.47 307.08z" fill="%23fff" transform="scale(11.84) translate(126 84)"/><path d="M247 90 317.53 307.08 545.5 307.08 361 441.27 431.53 658.35 247 524.16 62.47 658.35 133 441.27 -51.53 307.08 176.47 307.08z" fill="%23fff" transform="scale(11.84) translate(189 126)"/><path d="M247 90 317.53 307.08 545.5 307.08 361 441.27 431.53 658.35 247 524.16 62.47 658.35 133 441.27 -51.53 307.08 176.47 307.08z" fill="%23fff" transform="scale(11.84) translate(252 168)"/><path d="M247 90 317.53 307.08 545.5 307.08 361 441.27 431.53 658.35 247 524.16 62.47 658.35 133 441.27 -51.53 307.08 176.47 307.08z" fill="%23fff" transform="scale(11.84) translate(315 210)"/><path d="M247 90 317.53 307.08 545.5 307.08 361 441.27 431.53 658.35 247 524.16 62.47 658.35 133 441.27 -51.53 307.08 176.47 307.08z" fill="%23fff" transform="scale(11.84) translate(378 252)"/><path d="M247 90 317.53 307.08 545.5 307.08 361 441.27 431.53 658.35 247 524.16 62.47 658.35 133 441.27 -51.53 307.08 176.47 307.08z" fill="%23fff" transform="scale(11.84) translate(441 294)"/><path d="M247 90 317.53 307.08 545.5 307.08 361 441.27 431.53 658.35 247 524.16 62.47 658.35 133 441.27 -51.53 307.08 176.47 307.08z" fill="%23fff" transform="scale(11.84) translate(504 336)"/><path d="M247 90 317.53 307.08 545.5 307.08 361 441.27 431.53 658.35 247 524.16 62.47 658.35 133 441.27 -51.53 307.08 176.47 307.08z" fill="%23fff" transform="scale(11.84) translate(567 378)"/></svg>';
                      }}
                    />
                  )}
                </button>
              </div>

              <TapEffectButton
                onClick={() => navigate('/notifications')}
                className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors relative flex-shrink-0"
                rippleColor="rgba(156, 163, 175, 0.3)"
                scaleEffect={false}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3F4249" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {3 > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">3</span>
                  </span>
                )}
              </TapEffectButton>
            </div>
          </div>

          {/* Search Bar */}
          <div className="px-4 pb-3 relative">
            <div className="flex items-center gap-3">
              <div className="flex-1 flex items-center bg-white border border-gray-400 rounded-full px-4 py-3 shadow-sm relative z-20">
                <Search size={20} className="text-[#3F4249] mr-3 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search for fuel and groceries"
                  value={query}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => { if (query) setShowSuggestions(true); }}
                  className="flex-1 outline-none text-base text-gray-600 placeholder-gray-500"
                />
                <button
                  onClick={startVoiceSearch}
                  className={`ml-3 p-1 hover:bg-gray-100 rounded-full transition-colors ${isListening ? 'bg-red-100 text-red-600' : ''
                    }`}
                  disabled={isListening}
                >
                  <Mic size={20} className={isListening ? 'text-red-600 animate-pulse' : 'text-[#3F4249]'} />
                </button>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`w-12 h-12 border border-gray-400 rounded-full flex items-center justify-center transition-colors shadow-sm ${showFilters || Object.values(filters).some(f => f)
                  ? 'bg-[#3AC36C] text-white'
                  : 'bg-[#E3FFEE] hover:bg-[#d1f7dd] text-[#3F4249]'
                  }`}
              >
                <SlidersHorizontal size={24} className="rotate-180" />
              </button>
            </div>

            {/* Dropdown Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-16 left-4 right-4 bg-white shadow-xl max-h-64 overflow-y-auto z-50 border border-gray-100 rounded-2xl animate-fade-in">
                {suggestions.map((item, index) => (
                  <button
                    key={index}
                    className="w-full text-left px-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                    onClick={() => handleSuggestionClick(item)}
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      {item.type === 'station' ? <Fuel size={16} className="text-[#3AC36C]" /> : <ShoppingBag size={16} className="text-orange-500" />}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{item.name}</div>
                      {item.type === 'grocery' && <div className="text-xs text-gray-500">at {item.stationName}</div>}
                      {item.type === 'station' && <div className="text-xs text-gray-500">{item.address}</div>}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="px-4 pb-3">
              <div className="bg-gray-50 rounded-2xl p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-[#3F4249]">Filters</h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-[#3AC36C] hover:underline"
                  >
                    Clear All
                  </button>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-[#3F4249] mb-2">Fuel Type</label>
                  <div className="flex bg-gray-200 p-1 rounded-lg">
                    {['Regular', 'Premium', 'Diesel'].map((type) => (
                      <button
                        key={type}
                        onClick={() => handleFilterChange('fuelType', type.toLowerCase())}
                        className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${(filters.fuelType === type.toLowerCase() || (!filters.fuelType && type === 'Regular'))
                          ? 'bg-white text-[#3AC36C] shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                          }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#3F4249] mb-2">Price Range</label>
                    <select
                      value={filters.priceRange}
                      onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="">All Prices</option>
                      <option value="low">Under $30</option>
                      <option value="medium">$30 - $40</option>
                      <option value="high">Above $40</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#3F4249] mb-2">Min Rating</label>
                    <select
                      value={filters.rating}
                      onChange={(e) => handleFilterChange('rating', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="">Any Rating</option>
                      <option value="4">4+ Stars</option>
                      <option value="4.5">4.5+ Stars</option>
                      <option value="5">5 Stars</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Map - sesuai Figma positioning */}
        <div className="px-4 mb-4 relative">
          <div className="h-[280px] rounded-2xl overflow-hidden border-2 border-[#3F4249] relative">
            <MapboxMap
              stations={stations}
              userLocation={userLocation}
              onStationSelect={(station) => navigate(`/station/${station.id}`)}
              isUK={isLocationInUK(userLocation)}
              fuelType={(filters.fuelType || 'regular') as any}
            />

            {/* Map Controls - sesuai Figma */}
            <div className="absolute right-4 bottom-4 flex flex-col gap-2">
              <TouchFeedback className="block">
                <Button variant="primary" size="sm" className="w-8 h-8 rounded-2xl shadow-lg flex items-center justify-center">
                  <Plus size={18} className="text-white" />
                </Button>
              </TouchFeedback>
              <TouchFeedback className="block">
                <Button variant="primary" size="sm" className="w-8 h-8 rounded-2xl shadow-lg flex items-center justify-center">
                  <Minus size={18} className="text-white" />
                </Button>
              </TouchFeedback>
            </div>

            {/* Location Controls - sesuai Figma */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-2">
              <TouchFeedback className="block">
                <Button variant="ghost" size="sm" className="w-8 h-8 rounded-2xl shadow-lg flex items-center justify-center border-2 border-gray-200">
                  <div className="w-3 h-3 bg-[#3AC36C] rounded-sm"></div>
                </Button>
              </TouchFeedback>
              <TouchFeedback className="block">
                <Button variant="ghost" size="sm" className="w-8 h-8 rounded-2xl shadow-lg flex items-center justify-center border-2 border-gray-200">
                  <MapPin size={16} className="text-[#3AC36C]" />
                </Button>
              </TouchFeedback>
            </div>
          </div>
        </div>

        {/* Fuel Stations List - sesuai Figma */}
        <div className="px-4 pb-20">
          <h2 className="text-xl font-semibold text-[#3F4249] mb-4">Fuel Station nearby</h2>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="w-10 h-10 border-4 border-[#3AC36C] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-500 py-8">
                <p>{error}</p>
              </div>
            ) : stations.length === 0 && query ? (
              <div className="text-center text-gray-500 py-8">
                <p>No stations found for "{query}"</p>
                <button
                  onClick={() => handleSearchChange('')}
                  className="text-[#3AC36C] underline mt-2"
                >
                  Clear search
                </button>
              </div>
            ) : stations.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>No stations found</p>
              </div>
            ) : (
              stations.map((station, index) => (
                <StationCard key={station.id} station={station} index={index} />
              ))
            )}
          </div>
        </div>

        {/* Location Selection Modal */}
        {showLocationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome!</h2>
                <p className="text-gray-600">Please select your location</p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={goToUK}
                  className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 ${selectedLocation === 'UK'
                    ? 'border-[#3AC36C] bg-white'
                    : 'border-gray-200 hover:border-[#3AC36C] hover:bg-gray-50'
                    }`}
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg"
                      alt="UK Flag"
                      className="w-12 h-8 object-cover rounded border"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30"><clipPath id="a"><rect width="60" height="30"/></clipPath><clipPath id="b"><path d="M0 0v30h60V0z"/></clipPath><g clip-path="url(%23a)"><path d="M0 0v30h60V0z" fill="#012169"/><path d="M0 0 60 30M60 0 0 30" stroke="#fff" stroke-width="6"/><path d="M0 0 60 30M60 0 0 30" clip-path="url(%23b)" stroke="#C8102E" stroke-width="4"/><path d="M30 0v30M0 15h60" stroke="#fff" stroke-width="10"/><path d="M30 0v30M0 15h60" stroke="#C8102E" stroke-width="6"/></g></svg>';
                      }}
                    />
                    <div className="text-left">
                      <div className="font-semibold text-lg text-gray-900">United Kingdom</div>
                      <div className="text-sm text-gray-500">London, Manchester, Birmingham...</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={goToUS}
                  className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 ${selectedLocation === 'US'
                    ? 'border-[#3AC36C] bg-white'
                    : 'border-gray-200 hover:border-[#3AC36C] hover:bg-gray-50'
                    }`}
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg"
                      alt="US Flag"
                      className="w-12 h-8 object-cover rounded border"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7410 3900"><rect width="7410" height="3900" fill="%23b22234"/><path d="M0 450h7410m0 600H0m0 600h7410m0 600H0m0 600h7410m0 600H0" stroke="%23fff" stroke-width="300"/><rect width="2964" height="2100" fill="%233c3b6e"/><path d="M247 90 317.53 307.08 545.5 307.08 361 441.27 431.53 658.35 247 524.16 62.47 658.35 133 441.27 -51.53 307.08 176.47 307.08z" fill="%23fff" transform="scale(11.84)"/><path d="M247 90 317.53 307.08 545.5 307.08 361 441.27 431.53 658.35 247 524.16 62.47 658.35 133 441.27 -51.53 307.08 176.47 307.08z" fill="%23fff" transform="scale(11.84) translate(63 42)"/><path d="M247 90 317.53 307.08 545.5 307.08 361 441.27 431.53 658.35 247 524.16 62.47 658.35 133 441.27 -51.53 307.08 176.47 307.08z" fill="%23fff" transform="scale(11.84) translate(126 84)"/><path d="M247 90 317.53 307.08 545.5 307.08 361 441.27 431.53 658.35 247 524.16 62.47 658.35 133 441.27 -51.53 307.08 176.47 307.08z" fill="%23fff" transform="scale(11.84) translate(189 126)"/><path d="M247 90 317.53 307.08 545.5 307.08 361 441.27 431.53 658.35 247 524.16 62.47 658.35 133 441.27 -51.53 307.08 176.47 307.08z" fill="%23fff" transform="scale(11.84) translate(252 168)"/><path d="M247 90 317.53 307.08 545.5 307.08 361 441.27 431.53 658.35 247 524.16 62.47 658.35 133 441.27 -51.53 307.08 176.47 307.08z" fill="%23fff" transform="scale(11.84) translate(315 210)"/><path d="M247 90 317.53 307.08 545.5 307.08 361 441.27 431.53 658.35 247 524.16 62.47 658.35 133 441.27 -51.53 307.08 176.47 307.08z" fill="%23fff" transform="scale(11.84) translate(378 252)"/><path d="M247 90 317.53 307.08 545.5 307.08 361 441.27 431.53 658.35 247 524.16 62.47 658.35 133 441.27 -51.53 307.08 176.47 307.08z" fill="%23fff" transform="scale(11.84) translate(441 294)"/><path d="M247 90 317.53 307.08 545.5 307.08 361 441.27 431.53 658.35 247 524.16 62.47 658.35 133 441.27 -51.53 307.08 176.47 307.08z" fill="%23fff" transform="scale(11.84) translate(504 336)"/><path d="M247 90 317.53 307.08 545.5 307.08 361 441.27 431.53 658.35 247 524.16 62.47 658.35 133 441.27 -51.53 307.08 176.47 307.08z" fill="%23fff" transform="scale(11.84) translate(567 378)"/></svg>';
                      }}
                    />
                    <div className="text-left">
                      <div className="font-semibold text-lg text-gray-900">United States</div>
                      <div className="text-sm text-gray-500">New York, Los Angeles, Chicago...</div>
                    </div>
                  </div>
                </button>
              </div>

              <button
                onClick={handleModalContinue}
                disabled={!selectedLocation}
                className={`w-full mt-6 py-3 rounded-full font-semibold transition-all duration-200 ${selectedLocation
                  ? 'bg-[#3AC36C] text-white hover:bg-[#2ea85a]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
              >
                Continue
              </button>
            </div>
          </div>
        )}
      </div>
    </AnimatedPage>
  );
};

export default HomeScreen;