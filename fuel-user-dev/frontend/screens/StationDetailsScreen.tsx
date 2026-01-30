import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Clock, Star, Plus, Minus, Trash2, Check, User } from 'lucide-react';
import { Station, FuelFriend } from '../types';
import { apiGetStationDetails } from '../services/api';
import AnimatedPage from '../components/AnimatedPage';
import TapEffectButton from '../components/TapEffectButton';
import { getGroceryIcon } from '../components/GroceryIcons';

interface ExtendedFuelFriend extends FuelFriend {
  price?: number;
  location?: string;
  reviews?: number;
  phone?: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const StationDetailsScreen = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [station, setStation] = useState<Station | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedFuelFriend, setSelectedFuelFriend] = useState<ExtendedFuelFriend | null>(null);
  const [showAllGroceries, setShowAllGroceries] = useState(false);
  const [showAllFuelFriends, setShowAllFuelFriends] = useState(false);

  // Generate real station logo based on station name
  const getStationLogo = (stationName) => {
    const name = stationName?.toLowerCase() || '';
    console.log('Station name for logo:', name); // Debug

    if (name.includes('shell') || name.includes('turbofuel')) {
      return 'https://logos-world.net/wp-content/uploads/2020/04/Shell-Logo.png';
    }
    if (name.includes('bp') || name.includes('british petroleum')) {
      return 'https://logos-world.net/wp-content/uploads/2020/04/BP-Logo.png';
    }
    if (name.includes('exxon') || name.includes('mobil')) {
      return 'https://logos-world.net/wp-content/uploads/2020/04/ExxonMobil-Logo.png';
    }
    if (name.includes('chevron')) {
      return 'https://logos-world.net/wp-content/uploads/2020/04/Chevron-Logo.png';
    }
    if (name.includes('total')) {
      return 'https://logos-world.net/wp-content/uploads/2020/04/Total-Logo.png';
    }
    if (name.includes('ecofuel') || name.includes('eco')) {
      return 'https://logos-world.net/wp-content/uploads/2020/04/BP-Logo.png';
    }
    if (name.includes('quickstop') || name.includes('quick')) {
      return 'https://logos-world.net/wp-content/uploads/2020/04/Chevron-Logo.png';
    }
    if (name.includes('premium') || name.includes('fuel hub')) {
      return 'https://logos-world.net/wp-content/uploads/2020/04/ExxonMobil-Logo.png';
    }

    // Default to Shell
    return 'https://logos-world.net/wp-content/uploads/2020/04/Shell-Logo.png';
  };

  // Check if fuel friend was selected from FuelFriendDetailsScreen
  useEffect(() => {
    if (location.state?.selectedFuelFriend) {
      setSelectedFuelFriend(location.state.selectedFuelFriend);
    }
    // Restore cart from location state if available
    if (location.state?.cartItems) {
      setCart(location.state.cartItems);
    }
  }, [location.state]);

  // ✅ Use groceries and fuel friends from API response
  const groceries = station?.groceries || [];
  const fuelFriends = station?.fuelFriends || [];

  useEffect(() => {
    const fetchStationDetails = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        // First check if station data is passed from HomeScreen
        if (location.state?.station) {
          console.log('Using station data from HomeScreen:', location.state.station);
          setStation(location.state.station);
          return;
        }

        // Try to fetch from API
        const data = await apiGetStationDetails(id);
        setStation(data);
      } catch (err: any) {
        console.error('Error fetching station details:', err);
        setError(err.message);

        // Only use fallback if no station data was passed from HomeScreen
        if (!location.state?.station) {
          console.warn('No station data from HomeScreen, using fallback data');

          // Realistic US station names
          const usStations = [
            { name: 'Shell Gas Station', tag: '24/7', description: 'Convenient Shell location offering premium gasoline, diesel, and quick service. Located at 1234 Highway 1, Nashville, TN 37201. Features clean restrooms, ATM, and car wash facilities.' },
            { name: 'BP Connect', tag: 'BP', description: 'BP Connect station with premium fuels and convenience store. Address: 5678 Interstate Drive, Atlanta, GA 30301. Open 24/7 with coffee bar and fresh food options.' },
            { name: 'Exxon Select', tag: 'EXXON', description: 'Exxon Select fuel station featuring Synergy Supreme+ gasoline. Located at 9012 Petroleum Blvd, Dallas, TX 75201. Offers loyalty rewards and premium car care products.' },
            { name: 'Chevron Extra Mile', tag: 'CHEVRON', description: 'Chevron Extra Mile station with Techron fuel additive. Address: 3456 Energy Lane, Phoenix, AZ 85001. Features diesel exhaust fluid and fleet services.' },
            { name: '7-Eleven Fuel', tag: '7/11', description: '7-Eleven Fuel Center offering Slurpee drinks and fresh food. Located at 789 Convenience Ave, Miami, FL 33101. Open 24 hours with EV charging stations.' },
            { name: 'Wawa Fuel', tag: 'WAWA', description: 'Wawa Fuel location famous for fresh coffee and hoagies. Address: 1123 Travel Plaza, Philadelphia, PA 19101. Features Wawa App pay and premium fuel options.' }
          ];

          // Realistic UK station names
          const ukStations = [
            { name: 'Tesco Fuel Station', tag: 'TESCO', description: 'Tesco petrol station offering supermarket fuel with Clubcard points. Located at 456 High Street, London SW1A 1AA. Features Tesco Express shop and car wash facilities.' },
            { name: 'Shell Service Station', tag: 'SHELL', description: 'Shell service station with V-Power fuels and convenience store. Address: 789 Oxford Street, London W1D 1BS. Open 24/7 with coffee shop and ATMs.' },
            { name: 'BP Garage', tag: 'BP', description: 'BP garage featuring Ultimate fuels and Wild Bean Café. Located at 123 Regent Street, London W1B 4HY. Offers loyalty cards and premium car care services.' },
            { name: 'Esso Express', tag: 'ESSO', description: 'Esso Express station with Synergy Supreme+ fuels. Address: 567 Kings Road, London SW3 4UT. Features forecourt shop and professional car cleaning services.' },
            { name: 'Sainsburys Local Fuel', tag: 'SAINSBURYS', description: 'Sainsburys Local fuel station with Nectar points. Located at 890 High Holborn, London WC1V 7RA. Open late with fresh food and grocery essentials.' },
            { name: 'Morrisons Daily', tag: 'MORRISONS', description: 'Morrisons Daily petrol station with quality fuels and fresh food. Address: 234 Tottenham Court Road, London W1T 2BF. Features Morrisons café and loyalty rewards.' }
          ];

          // Determine if this should be UK or US station based on ID or random
          const isUK = Math.random() > 0.5; // Random for demo purposes
          const stationPool = isUK ? ukStations : usStations;

          const stationIndex = parseInt(id?.replace(/\D/g, '') || '0') % stationPool.length;
          const stationType = stationPool[stationIndex];

          // Fallback groceries data - diverse and interesting variety
          const fallbackGroceries = [
            // Beverages - International variety
            {
              id: 'grocery-1',
              name: 'Premium Coffee Beans',
              price: 12.99,
              description: 'Ethiopian single-origin coffee beans',
              category: 'beverages',
              icon: '☕',
              imageUrl: '/coffee-beans.jpg'
            },
            {
              id: 'grocery-2',
              name: 'Craft Beer Selection',
              price: 8.99,
              description: 'Local craft brewery variety pack',
              category: 'beverages',
              icon: '🍺',
              imageUrl: '/craft-beer.jpg'
            },
            {
              id: 'grocery-3',
              name: 'Sparkling Water',
              price: 2.49,
              description: 'Natural mineral sparkling water',
              category: 'beverages',
              icon: '🥤',
              imageUrl: '/sparkling-water.jpg'
            },
            {
              id: 'grocery-4',
              name: 'Fresh Coconut Water',
              price: 3.99,
              description: '100% pure coconut water',
              category: 'beverages',
              icon: '🥥',
              imageUrl: '/coconut-water.jpg'
            },
            
            // Snacks - Premium and international
            {
              id: 'grocery-5',
              name: 'Gourmet Truffle Chips',
              price: 6.99,
              description: 'Artisan truffle-flavored potato chips',
              category: 'snacks',
              icon: '🍟',
              imageUrl: '/truffle-chips.jpg'
            },
            {
              id: 'grocery-6',
              name: 'International Chocolate Box',
              price: 14.99,
              description: 'Assorted premium chocolates from around the world',
              category: 'snacks',
              icon: '🍫',
              imageUrl: '/chocolate-box.jpg'
            },
            {
              id: 'grocery-7',
              name: 'Korean Kimchi Snacks',
              price: 4.49,
              description: 'Authentic Korean spicy kimchi-flavored crisps',
              category: 'snacks',
              icon: '🌶️',
              imageUrl: '/kimchi-snacks.jpg'
            },
            {
              id: 'grocery-8',
              name: 'Japanese Seaweed Snacks',
              price: 3.99,
              description: 'Roasted nori seaweed sheets',
              category: 'snacks',
              icon: '🍣',
              imageUrl: '/seaweed-snacks.jpg'
            },
            
            // Fresh Food - Quality items
            {
              id: 'grocery-9',
              name: 'Artisan Sourdough Bread',
              price: 5.99,
              description: 'Freshly baked sourdough loaf',
              category: 'fresh-food',
              icon: '🍞',
              imageUrl: '/sourdough-bread.jpg'
            },
            {
              id: 'grocery-10',
              name: 'Gourmet Cheese Board',
              price: 18.99,
              description: 'Selection of aged cheeses with crackers',
              category: 'fresh-food',
              icon: '🧀',
              imageUrl: '/cheese-board.jpg'
            },
            {
              id: 'grocery-11',
              name: 'Fresh Avocados',
              price: 2.49,
              description: 'Ripe Hass avocados, pack of 3',
              category: 'fresh-food',
              icon: '🥑',
              imageUrl: '/avocados.jpg'
            },
            {
              id: 'grocery-12',
              name: 'Organic Mixed Berries',
              price: 7.99,
              description: 'Seasonal organic berry mix',
              category: 'fresh-food',
              icon: '🫐',
              imageUrl: '/mixed-berries.jpg'
            },
            
            // Prepared Foods - Gourmet options
            {
              id: 'grocery-13',
              name: 'Gourmet Sushi Box',
              price: 15.99,
              description: 'Chef-prepared sushi assortment',
              category: 'prepared-food',
              icon: '🍱',
              imageUrl: '/sushi-box.jpg'
            },
            {
              id: 'grocery-14',
              name: 'Gourmet Sandwich Collection',
              price: 9.99,
              description: 'Artisan sandwiches with premium ingredients',
              category: 'prepared-food',
              icon: '🥪',
              imageUrl: '/sandwich-collection.jpg'
            },
            {
              id: 'grocery-15',
              name: 'Fresh Soup of the Day',
              price: 6.49,
              description: 'Chef\'s daily soup selection',
              category: 'prepared-food',
              icon: '🍲',
              imageUrl: '/soup-of-day.jpg'
            },
            
            // Health & Wellness
            {
              id: 'grocery-16',
              name: 'Protein Shake Mix',
              price: 11.99,
              description: 'Premium whey protein powder',
              category: 'health',
              icon: '💪',
              imageUrl: '/protein-shake.jpg'
            },
            {
              id: 'grocery-17',
              name: 'Organic Energy Bars',
              price: 2.99,
              description: 'All-natural energy bars, pack of 5',
              category: 'health',
              icon: '🔋',
              imageUrl: '/energy-bars.jpg'
            },
            {
              id: 'grocery-18',
              name: 'Cold-Pressed Juice',
              price: 5.99,
              description: 'Fresh vegetable and fruit juice blend',
              category: 'health',
              icon: '🧃',
              imageUrl: '/cold-pressed-juice.jpg'
            },
            
            // International Specialties
            {
              id: 'grocery-19',
              name: 'Italian Pasta Selection',
              price: 4.99,
              description: 'Authentic Italian pasta varieties',
              category: 'international',
              icon: '🍝',
              imageUrl: '/italian-pasta.jpg'
            },
            {
              id: 'grocery-20',
              name: 'Middle Eastern Spice Set',
              price: 8.99,
              description: 'Premium spice collection for cooking',
              category: 'international',
              icon: '🧂',
              imageUrl: '/spice-set.jpg'
            },
            {
              id: 'grocery-21',
              name: 'Mexican Street Corn Kit',
              price: 7.49,
              description: 'Authentic Mexican street corn seasoning kit',
              category: 'international',
              icon: '🌽',
              imageUrl: '/mexican-corn-kit.jpg'
            },
            {
              id: 'grocery-22',
              name: 'French Macarons',
              price: 12.99,
              description: 'Delicate French almond meringue cookies',
              category: 'international',
              icon: '🍪',
              imageUrl: '/french-macarons.jpg'
            },
            
            // Premium Items
            {
              id: 'grocery-23',
              name: 'Wagyu Beef Sliders',
              price: 24.99,
              description: 'Premium Japanese Wagyu beef mini burgers',
              category: 'premium',
              icon: '🍔',
              imageUrl: '/wagyu-sliders.jpg'
            },
            {
              id: 'grocery-24',
              name: 'Caviar Tin',
              price: 45.99,
              description: 'Premium Russian sturgeon caviar',
              category: 'premium',
              icon: '🦪',
              imageUrl: '/caviar-tin.jpg'
            },
            {
              id: 'grocery-25',
              name: 'Champagne Bottle',
              price: 29.99,
              description: 'Premium French champagne',
              category: 'premium',
              icon: '🍾',
              imageUrl: '/champagne-bottle.jpg'
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
            }
          ];

          // Check if station is in UK or US
          const isUKStation = station?.address?.toLowerCase().includes('uk') ||
            station?.address?.toLowerCase().includes('london') ||
            (station?.lat && station.lat > 49 && station.lat < 60 && station?.lon && station.lon > -10 && station.lon < 2);

          const fallbackFuelFriends = isUKStation ? fallbackFuelFriendsUK : fallbackFuelFriendsUS;

          setStation({
            id: id,
            name: stationType.name,
            address: isUK ? '123 High Street, London SW1A 1AA' : '1234 Highway 1, Nashville, TN 37201',
            distance: '2.7 miles away',
            deliveryTime: '30 minutes',
            rating: 4.7,
            reviews: 146,
            image: '/brand1.png',
            description: stationType.description,
            fuelPrices: {
              regular: 1.23,
              premium: 1.75,
              diesel: 2.14
            },
            groceries: fallbackGroceries,
            fuelFriends: fallbackFuelFriends
          });
        } else if (location.state?.station) {
          // Ensure station from HomeScreen has groceries and fuel friends
          const stationFromHome = location.state.station;
          if (!stationFromHome.groceries || stationFromHome.groceries.length === 0) {
            stationFromHome.groceries = [
              {
                id: 'grocery-1',
                name: 'Bottled Water',
                price: 2.50,
                description: 'Pure drinking water'
              },
              {
                id: 'grocery-2',
                name: 'Energy Drink',
                price: 3.99,
                description: 'Refreshing energy boost'
              },
              {
                id: 'grocery-3',
                name: 'Potato Chips',
                price: 4.99,
                description: 'Crispy potato chips'
              },
              {
                id: 'grocery-4',
                name: 'Coffee',
                price: 5.99,
                description: 'Hot coffee'
              },
              {
                id: 'grocery-5',
                name: 'Fresh Sandwich',
                price: 7.99,
                description: 'Fresh sandwich with ingredients'
              },
              {
                id: 'grocery-6',
                name: 'Chocolate Bar',
                price: 2.99,
                description: 'Chocolate treat'
              },
              {
                id: 'grocery-7',
                name: 'Fresh Milk',
                price: 4.25,
                description: 'Whole milk, 1 gallon'
              },
              {
                id: 'grocery-8',
                name: 'Bread Loaf',
                price: 3.49,
                description: 'Fresh baked bread'
              },
              {
                id: 'grocery-9',
                name: 'Fresh Eggs',
                price: 5.99,
                description: 'Large eggs, 12-pack'
              },
              {
                id: 'grocery-10',
                name: 'Apple',
                price: 0.99,
                description: 'Fresh red apple'
              }
            ];
          }

          if (!stationFromHome.fuelFriends || stationFromHome.fuelFriends.length === 0) {
            // Check if station is in UK or US
            const isUKStation = stationFromHome?.address?.toLowerCase().includes('uk') ||
              stationFromHome?.address?.toLowerCase().includes('london') ||
              (stationFromHome?.lat && stationFromHome.lat > 49 && stationFromHome.lat < 60 && stationFromHome?.lon && stationFromHome.lon > -10 && stationFromHome.lon < 2);

            const fallbackFuelFriends = isUKStation ? [
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
              }
            ] : [
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
              }
            ];

            stationFromHome.fuelFriends = fallbackFuelFriends;
          }

          setStation(stationFromHome);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchStationDetails();
  }, [id, location.state]);

  const updateCartQuantity = (itemId: string, change: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === itemId);

      if (existingItem) {
        if (existingItem.quantity + change <= 0) {
          return prevCart.filter(item => item.id !== itemId);
        }
        return prevCart.map(item =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + change }
            : item
        );
      } else if (change > 0) {
        const grocery = groceries.find(g => g.id === itemId);
        if (grocery) {
          return [...prevCart, {
            id: itemId,
            name: grocery.name,
            price: grocery.price,
            quantity: 1
          }];
        }
      }

      return prevCart;
    });
  };

  const getItemQuantity = (itemId: string) => {
    const item = cart.find(item => item.id === itemId);
    return item ? item.quantity : 0;
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  if (isLoading) {
    return (
      <AnimatedPage>
        <div className="flex justify-center items-center min-h-screen">
          <div className="w-8 h-8 border-4 border-[#3AC36C] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AnimatedPage>
    );
  }

  if (error && !station) {
    return (
      <AnimatedPage>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-red-500">{error}</p>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="bg-white min-h-screen pb-24">
        {/* Header */}
        <div className="relative">
          <div className="h-48 bg-gradient-to-r from-orange-400 to-pink-400 relative overflow-hidden">
            <img
              src="/image-card-1.png"
              alt="Station"
              className="w-full h-full object-cover"
            />
            <TapEffectButton
              onClick={() => navigate(-1)}
              className="absolute top-4 left-4 p-2 bg-white/80 rounded-full"
            >
              <img src="/Back.png" alt="Back" className="w-5 h-5" />
            </TapEffectButton>
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
              <h1 className="text-lg font-semibold text-white">Station Details</h1>
            </div>
          </div>

          {/* Station Logo */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="w-16 h-16 bg-white rounded-full p-2 shadow-lg">
              <img
                src={getStationLogo(station?.name)}
                alt={station?.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = 'https://logos-world.net/wp-content/uploads/2020/04/Shell-Logo.png';
                }}
              />
            </div>
          </div>
        </div>

        {/* Station Info */}
        <div className="px-4 pt-12 pb-6 text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">{station?.name}</h1>
          <div className="flex items-center justify-center text-gray-600 mb-4">
            <img src="/pinpoint.png" alt="Location" className="w-4 h-4 mr-1" />
            <span className="text-sm">{station?.address}</span>
          </div>

          {/* About Section */}
          {station?.description && (
            <div className="mt-6 text-left">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {station.description}
              </p>
            </div>
          )}
        </div>

        {/* Fuel Prices */}
        <div className="mx-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">Fuel Prices</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-700">Regular</span>
                <span className="font-semibold">${station?.fuelPrices?.regular} per liter</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-700">Premium</span>
                <span className="font-semibold">${station?.fuelPrices?.premium} per liter</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-700">Diesel</span>
                <span className="font-semibold">${station?.fuelPrices?.diesel} per liter</span>
              </div>
            </div>
          </div>
        </div>

        {/* Station Stats */}
        <div className="px-4 mb-6 space-y-2">
          <div className="flex items-center text-gray-600">
            <img src="/pinpoint.png" alt="Location" className="w-4 h-4 mr-2" />
            <span className="text-sm">Distance: {station?.distance}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-2 text-gray-500" />
            <span className="text-sm">Average Pickup time: {station?.deliveryTime}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-600">
              <Star className="w-4 h-4 mr-2 text-yellow-500 fill-current" />
              <span className="text-sm">{station?.rating} Rating </span>
              <span className="text-sm text-green-600">({(station as any)?.reviewCount} reviews)</span>
            </div>
            <button
              onClick={() => navigate(`/station/${id}/reviews`)}
              className="text-green-600 text-sm font-medium hover:underline"
            >
              See all reviews
            </button>
          </div>
        </div>

        {/* Groceries */}
        <div className="px-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Groceries</h2>
            {groceries.length > 4 && (
              <button 
                onClick={() => setShowAllGroceries(!showAllGroceries)}
                className="text-green-600 text-sm font-medium"
              >
                {showAllGroceries ? 'Show less' : 'See all'}
              </button>
            )}
          </div>
          {isLoading ? (
            /* Groceries Skeleton */
            <div className="flex justify-center items-center py-8">
              <div className="w-8 h-8 border-4 border-[#3AC36C] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : groceries.length > 0 ? (
            <div className="space-y-3">
              {(showAllGroceries ? groceries : groceries.slice(0, 4)).map((item) => {
                const quantity = getItemQuantity(item.id);
                return (
                  <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      {getGroceryIcon(item.name, "w-12 h-12")}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">${item.price}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {quantity > 0 ? (
                        <>
                          <button
                            onClick={() => updateCartQuantity(item.id, -1)}
                            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.id, 1)}
                            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center ml-2"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => updateCartQuantity(item.id, 1)}
                          className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium"
                        >
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No groceries available at this station</p>
            </div>
          )}
        </div>

        {/* Fuel Friends */}
        <div className="px-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Select Fuel friend</h2>
            {fuelFriends.length > 4 && (
              <button 
                onClick={() => setShowAllFuelFriends(!showAllFuelFriends)}
                className="text-green-600 text-sm font-medium"
              >
                {showAllFuelFriends ? 'Show less' : 'See all'}
              </button>
            )}
          </div>

          {selectedFuelFriend ? (
            /* Selected Fuel Friend Display */
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={selectedFuelFriend.avatarUrl || '/fuel friend.png'}
                      alt={selectedFuelFriend.name}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/fuel friend.png';
                      }}
                    />
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{selectedFuelFriend.name}</h3>
                    <p className="text-sm text-gray-600">${selectedFuelFriend.rate || 'N/A'}</p>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-xs text-gray-600">{selectedFuelFriend.rating}</span>
                      <Check className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-green-600 font-medium">Selected</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFuelFriend(null)}
                  className="text-red-500 text-sm font-medium"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : isLoading ? (
            /* Fuel Friends Skeleton */
            <div className="flex justify-center items-center py-8">
              <div className="w-8 h-8 border-4 border-[#3AC36C] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            /* Fuel Friends Grid */
            <div className="grid grid-cols-2 gap-3 mb-4">
              {fuelFriends.length > 0 ? (
                (showAllFuelFriends ? fuelFriends : fuelFriends.slice(0, 4)).map((friend) => (
                  <div key={friend.id} className={`rounded-lg p-3 transition-all duration-200 ${selectedFuelFriend?.id === friend.id ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'}`}>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="relative">
                        <img
                          src={friend.avatarUrl || '/fuel friend.png'}
                          alt={friend.name}
                          className="w-8 h-8 rounded-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/fuel friend.png';
                          }}
                        />
                        {selectedFuelFriend?.id === friend.id && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <button
                          onClick={() => navigate(`/fuel-friend/${friend.id}`, {
                            state: {
                              fuelFriend: friend,
                              cartItems: cart,
                              stationId: id
                            }
                          })}
                          className="text-sm font-medium text-gray-900 truncate hover:text-green-600 transition-colors text-left"
                        >
                          {friend.name}
                        </button>
                        <p className="text-xs text-gray-600">${friend.rate || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 mb-2">
                      <img src="/pinpoint.png" alt="Location" className="w-3 h-3" />
                      <span className="text-xs text-gray-600">{(friend as ExtendedFuelFriend).location || 'Location N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-1 mb-3">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-xs text-gray-600">{friend.rating || 'N/A'}</span>
                      <span className="text-xs text-green-600">({friend.reviewCount || (friend as ExtendedFuelFriend).reviews || 0} reviews)</span>
                    </div>
                    <button
                      onClick={() => setSelectedFuelFriend(friend)}
                      className={`w-full py-2 rounded-full text-sm font-medium transition-colors flex items-center justify-center space-x-1 ${selectedFuelFriend?.id === friend.id ? 'bg-green-600 text-white' : 'bg-green-500 text-white hover:bg-green-600'}`}
                    >
                      {selectedFuelFriend?.id === friend.id ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Selected</span>
                        </>
                      ) : (
                        <>
                          <User className="w-4 h-4" />
                          <span>Select</span>
                        </>
                      )}
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-8 text-gray-500">
                  <p>No fuel friends available at this station</p>
                </div>
              )}
            </div>
          )}

          {!selectedFuelFriend && fuelFriends.length > 4 && !showAllFuelFriends ? (
            <button 
              onClick={() => setShowAllFuelFriends(true)}
              className="w-full text-green-600 text-sm font-medium py-2"
            >
              View More ({fuelFriends.length} total)
            </button>
          ) : null}
        </div>

        {/* Order Now Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
          <button
            onClick={() => {
              console.log('StationDetails - Order Now clicked');
              console.log('StationDetails - station:', station);
              console.log('StationDetails - cart:', cart);
              console.log('StationDetails - selectedFuelFriend:', selectedFuelFriend);

              // Defensive navigation with fallback data
              const navigationState = {
                station: station || {
                  id: 'default-station',
                  name: 'Fuel Station',
                  address: 'Station Address',
                  fuelPrices: { regular: 3.29, premium: 3.79, diesel: 3.59 },
                  regularPrice: 3.29,
                  deliveryTime: '15-20 mins',
                  rating: 4.5,
                  reviewCount: 128,
                  imageUrl: '/brand1.png',
                  bannerUrl: '/brand1.png',
                  logoUrl: '/logo-green.png',
                  groceries: [],
                  fuelFriends: []
                },
                cartItems: cart || [],
                selectedFuelFriend: selectedFuelFriend || null,
                totalItems: (cart?.length || 0) + (selectedFuelFriend ? 1 : 0)
              };

              console.log('StationDetails - navigation state:', navigationState);

              try {
                navigate('/checkout', {
                  state: navigationState
                });
              } catch (error) {
                console.error('Navigation error:', error);
                // Fallback navigation
                navigate('/checkout');
              }
            }}
            // Allow navigation even with empty cart/fuel friend for better UX
            // disabled={cart.length === 0 && !selectedFuelFriend}
            className="w-full bg-green-500 text-white py-4 rounded-full text-lg font-semibold hover:bg-green-600 transition-colors"
          >
            {`Order Now${cart.length > 0 || selectedFuelFriend ? ` (${cart.length + (selectedFuelFriend ? 1 : 0)} items)` : ''}`}
          </button>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default StationDetailsScreen;