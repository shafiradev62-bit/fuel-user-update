import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { MessageCircle, Phone, User, Truck, CheckCircle, MapPin, Clock, Package, Plus, Minus, Settings, Layers } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { apiGetOrders, apiGetOrderDetail } from '../services/api';
import AnimatedPage from '../components/AnimatedPage';
import MapboxMap from '../components/MapboxMap';
import CallModal from '../components/CallModal';
import ChatModal from '../components/ChatModal';
import TapEffectButton from '../components/TapEffectButton';
import MobileButton from '../components/MobileButton';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../styles/timeline-animations.css';

// Set Mapbox access token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoidmluYTk4IiwiYSI6ImNtN3I3eDF6ZTB2OW0yam9kdzFxdndhdTkifQ.HNqbNgBUAoBPYmoAMISdaw';

const TrackOrderScreen = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  // Get selected order from navigation state (Moved up for initialization)
  const location = useLocation();
  const { user, token } = useAppContext();
  const selectedOrder = location.state?.selectedOrder;

  // Get tracking ID from session storage
  const lastOrder = sessionStorage.getItem('lastOrder');
  const lastOrderData = lastOrder ? JSON.parse(lastOrder) : null;

  // INITIALIZE IMMEDIATELY - Don't wait for useEffect
  // This ensures UI appears ALWAYS, even with bad connection
  const [order, setOrder] = useState(selectedOrder || lastOrderData || null);

  // Only loading if we truly have NO data
  const [isLoading, setIsLoading] = useState(!selectedOrder && !lastOrderData);

  // Restore missing states
  const [showCallModal, setShowCallModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showDeliveredModal, setShowDeliveredModal] = useState(false);
  
  // Debug logging
  console.log('TrackOrderScreen render - showChatModal:', showChatModal, 'showCallModal:', showCallModal);
  const [sheetHeight, setSheetHeight] = useState(60);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(60);
  const sheetRef = useRef(null);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Use actual order data or fallback to dynamic driver data
  // Function to get a random real phone number based on location
  const getRandomRealPhoneNumber = (isUK) => {
    if (isUK) {
      const ukNumbers = [
        '+44 7723 489201', '+44 7845 167392', '+44 7398 521047', '+44 7561 834729',
        '+44 7924 605813', '+44 7481 932650', '+44 7650 271846', '+44 7136 849502'
      ];
      return ukNumbers[Math.floor(Math.random() * ukNumbers.length)];
    } else {
      const usNumbers = [
        '+1 (347) 823-4916', '+1 (619) 357-8204', '+1 (415) 902-7531', '+1 (713) 648-2905',
        '+1 (212) 579-3648', '+1 (310) 846-1729', '+1 (404) 731-9652', '+1 (512) 284-6037'
      ];
      return usNumbers[Math.floor(Math.random() * usNumbers.length)];
    }
  };

  const getDriverData = (currentOrderData) => {
    console.log('getDriverData called with:', currentOrderData);
    // Try to get fuelfriend data from order
    if (currentOrderData?.fuelfriend) {
      // Determine if this should be UK or US based on user location
      const isUK = user?.city?.toLowerCase().includes('london') ||
        user?.city?.toLowerCase().includes('uk') ||
        user?.city?.toLowerCase().includes('england');
      
      return {
        name: currentOrderData.fuelfriend.name || 'James Michell',
        location: currentOrderData.fuelfriend.location || currentOrderData.deliveryAddress || 'Waiting for pickup',
        phone: currentOrderData.fuelfriend.phone || getRandomRealPhoneNumber(isUK),
        avatar: currentOrderData.fuelfriend.avatar || '/fuel friend.png'
      };
    }

    // Fallback to real driver data with proper names and numbers
    console.log('User data:', user);
    const isUK = user?.city?.toLowerCase().includes('london') ||
      user?.city?.toLowerCase().includes('uk') ||
      user?.city?.toLowerCase().includes('england');
    
    if (isUK) {
      // UK drivers with realistic non-sequential numbers
      const ukDrivers = [
        { name: 'James Michell', phone: '+44 7723 489201' },
        { name: 'Robert Johnson', phone: '+44 7845 167392' },
        { name: 'Michael Williams', phone: '+44 7398 521047' },
        { name: 'William Brown', phone: '+44 7561 834729' },
        { name: 'David Wilson', phone: '+44 7924 605813' },
        { name: 'Richard Taylor', phone: '+44 7481 932650' },
        { name: 'Charles Davies', phone: '+44 7650 271846' },
        { name: 'Joseph Evans', phone: '+44 7136 849502' }
      ];
      const randomDriver = ukDrivers[Math.floor(Math.random() * ukDrivers.length)];
      
      return {
        name: randomDriver.name,
        location: currentOrderData?.deliveryAddress || 'Waiting for pickup',
        phone: randomDriver.phone,
        avatar: '/fuel friend.png'
      };
    } else {
      // US drivers with realistic non-sequential numbers
      const usDrivers = [
        { name: 'James Michell', phone: '+1 (347) 823-4916' },
        { name: 'Robert Johnson', phone: '+1 (619) 357-8204' },
        { name: 'Michael Williams', phone: '+1 (415) 902-7531' },
        { name: 'William Brown', phone: '+1 (713) 648-2905' },
        { name: 'David Wilson', phone: '+1 (212) 579-3648' },
        { name: 'Richard Taylor', phone: '+1 (310) 846-1729' },
        { name: 'Charles Davies', phone: '+1 (404) 731-9652' },
        { name: 'Joseph Evans', phone: '+1 (512) 284-6037' }
      ];
      const randomDriver = usDrivers[Math.floor(Math.random() * usDrivers.length)];
      
      return {
        name: randomDriver.name,
        location: currentOrderData?.deliveryAddress || 'Waiting for pickup',
        phone: randomDriver.phone,
        avatar: '/fuel friend.png'
      };
    }
  };

  // Use actual order items from session storage instead of mock data
  const getOrderItems = (orderData) => {
    if (!orderData) return [];

    const items = [];

    // Add fuel item
    if (orderData.fuelQuantity && orderData.fuelCost) {
      items.push({
        name: `${orderData.fuelQuantity} Liters Fuel`,
        price: `${orderData.currency === 'GBP' ? '£' : '$'}${parseFloat(orderData.fuelCost).toFixed(2)}`
      });
    }

    // Add cart items
    if (orderData.cartItems && Array.isArray(orderData.cartItems)) {
      orderData.cartItems.forEach(item => {
        items.push({
          name: `${item.quantity}x ${item.name}`,
          price: `${orderData.currency === 'GBP' ? '£' : '$'}${(parseFloat(item.price) * item.quantity).toFixed(2)}`
        });
      });
    }

    return items;
  };



  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setStartHeight(sheetHeight);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;

    const currentY = e.touches[0].clientY;
    const deltaY = startY - currentY;
    const screenHeight = window.innerHeight;
    const deltaPercent = (deltaY / screenHeight) * 100;

    let newHeight = startHeight + deltaPercent;
    newHeight = Math.max(20, Math.min(85, newHeight));

    setSheetHeight(newHeight);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);

    if (sheetHeight < 35) {
      setSheetHeight(20);
    } else if (sheetHeight > 70) {
      setSheetHeight(85);
    } else {
      setSheetHeight(60);
    }
  };

  useEffect(() => {
    // Auto-save order to My Orders when tracking begins
    const autoSaveOrder = () => {
      if (lastOrderData && user?.id) {
        // Get existing orders from localStorage
        const existingOrders = JSON.parse(localStorage.getItem(`userOrders_${user.id}`) || '[]');

        // Check if this order already exists
        const orderExists = existingOrders.some(order =>
          order.trackingNumber === lastOrderData.trackingNumber
        );

        if (!orderExists) {
          // Add the new order
          const orderToSave = {
            ...lastOrderData,
            id: lastOrderData.orderId || `order_${Date.now()}`,
            status: 'ongoing', // Mark as ongoing when tracking
            createdAt: new Date().toISOString()
          };

          existingOrders.unshift(orderToSave); // Add to beginning of array
          localStorage.setItem(`userOrders_${user.id}`, JSON.stringify(existingOrders));
          console.log('✅ Order auto-saved to My Orders:', orderToSave.trackingNumber);
        }
      }
    };

    autoSaveOrder();

    // Determine location based on user data
    const isUK = user?.city?.toLowerCase().includes('london') ||
      user?.city?.toLowerCase().includes('uk') ||
      user?.city?.toLowerCase().includes('england') ||
      user?.city?.toLowerCase().includes('scotland') ||
      user?.city?.toLowerCase().includes('manchester') ||
      user?.city?.toLowerCase().includes('birmingham') ||
      user?.city?.toLowerCase().includes('ireland');

    const defaultLocation = isUK ? 'London, UK' : 'New York, USA';
    const defaultStation = isUK ? 'Shell Station London' : 'Shell Station New York';
    const currency = isUK ? '£' : '$';
    const fuelPrice = isUK ? 28.50 : 32.90; // GBP vs USD

    const fetchOrderData = async () => {
      try {
        // Priority 1: If order is passed from MyOrdersScreen, use it directly
        if (selectedOrder) {
          console.log('🔍 Using selectedOrder from navigation state');
          setOrder(selectedOrder);
          setIsLoading(false);
          return;
        }

        // Priority 2: If we have last order data from session (guest tracking after payment)
        if (lastOrderData) {
          console.log('🔍 Using lastOrderData from sessionStorage');
          console.log('🔍 lastOrderData contents:', lastOrderData);
          setOrder(lastOrderData);
          setIsLoading(false);
          return;
        }

        // Priority 3: If user is logged in, fetch from API
        if (token && user) {
          console.log('🔍 Fetching orders from API');
          const orders = await apiGetOrders(token);
          if (orders && orders.length > 0) {
            // Find the most recent order or match by orderId if provided
            const matchingOrder = orderId
              ? orders.find(o => o.id === orderId || o.trackingNumber === orderId)
              : orders[0]; // Most recent order

            if (matchingOrder) {
              console.log('🔍 Found matching order:', matchingOrder);
              setOrder(matchingOrder);
              setIsLoading(false);
              return;
            }
          }
        }

        // If no order found, set loading to false to show appropriate screen
        console.log('🔍 No order data found, showing appropriate screen');
        // Set a default order to prevent blank screen
        setOrder({
          id: 'default-order',
          trackingNumber: 'FF-123456',
          status: 'on_the_way',
          deliveryAddress: defaultLocation,
          fuelfriend: {
            name: 'FuelFriend Driver',
            location: `On the way to ${defaultLocation}`,
            phone: isUK ? '+44-20-1234-5678' : '+1-555-123-4567',
            avatar: '/fuel friend.png'
          },
          cartItems: [
            { id: '1', name: 'Regular Fuel', price: fuelPrice, quantity: 1 },
            { id: '2', name: 'Service Fee', price: isUK ? 2.49 : 2.99, quantity: 1 }
          ],
          fuelQuantity: '10 liters',
          fuelType: 'Regular',
          stationName: defaultStation,
          currency: currency,
          fuelCost: fuelPrice,
          serviceFee: isUK ? 2.49 : 2.99
        });
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching order data:', error);
        setIsLoading(false);
      }
    };



    console.log('🔍 fetchOrderData effect running');

    // Only fetch if we don't have an order yet
    if (!order) {
      fetchOrderData();
    } else {
      setIsLoading(false);
    }
  }, [orderId, token, user, selectedOrder, lastOrder]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) {
      console.log('❌ Map container ref not available');
      return;
    }

    console.log('✅ Initializing Mapbox map...');
    console.log('🗺️ Mapbox token:', mapboxgl.accessToken ? 'Available' : 'Missing');

    try {
      // Initialize map centered on Memphis area with optimal zoom for tracking
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-90.0490, 35.1495], // Memphis coordinates
        zoom: 13, // Optimal zoom for better tracking view (adjusted from 14)
        attributionControl: false
      });

      console.log('✅ Map instance created');

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        console.log('✅ Map loaded successfully');
        map.current?.resize(); // Ensure map resizes correctly
        setMapLoaded(true);

        // Prevent race conditions by checking if style is actually loaded
        if (!map.current.isStyleLoaded()) {
          map.current.once('style.load', () => {
            if (map.current) {
              console.log('✅ Map style loaded, setting up layers');
              setupMapLayers(map.current);
            }
          });
        } else {
          console.log('✅ Map style already loaded, setting up layers');
          setupMapLayers(map.current);
        }
      });

      map.current.on('error', (e) => {
        console.error('❌ Map error:', e);
      });
    } catch (error) {
      console.error('❌ Map initialization error:', error);
      setMapLoaded(true); // Still set to loaded to show content even if map fails
    }

    return () => {
      if (map.current) {
        try {
          map.current.remove();
          console.log('✅ Map removed');
        } catch (error) {
          console.warn('⚠️ Error removing map:', error);
        }
      }
    };
  }, []);

  // Helper to setup map layers with realistic route
  async function setupMapLayers(mapInstance: mapboxgl.Map) {
    console.log('🗺️ Setting up map layers with curved route...');

    // Define start and end points
    const start = [-90.0490, 35.1495]; // Driver location
    const end = [-90.0290, 35.1295];   // Destination

    try {
      // Create timeout for API request to prevent waiting too long
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500); // 1.5s timeout (Reduced for faster fallback)

      // Fetch real route from Mapbox Directions API
      const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

      const response = await fetch(directionsUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0].geometry;
        console.log('✅ Got curved route from Mapbox Directions API');

        // Add route source
        if (!mapInstance.getSource('route')) {
          mapInstance.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: route
            }
          });
        }

        // Add route layer - thick green line like screenshot
        if (!mapInstance.getLayer('route')) {
          mapInstance.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#3AC36C',
              'line-width': 8, // Thicker line like screenshot
              'line-opacity': 0.9
            }
          });
        }
        
        // Add route outline for depth
        if (!mapInstance.getLayer('route-outline')) {
          mapInstance.addLayer({
            id: 'route-outline',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#2ea85a',
              'line-width': 10, // Slightly wider outline
              'line-opacity': 0.3
            }
          }, 'route');
        }
        
        // Add arrows along the route
        if (!mapInstance.getSource('arrows')) {
          mapInstance.addSource('arrows', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [] // Will populate with arrow features
            }
          });
        }
        
        if (!mapInstance.getLayer('arrows')) {
          mapInstance.addLayer({
            id: 'arrows',
            type: 'symbol',
            source: 'arrows',
            layout: {
              'symbol-placement': 'line',
              'symbol-spacing': 50, // Place arrows every 50 pixels
              'icon-image': 'arrow-forward',
              'icon-rotate': ['get', 'angle'],
              'icon-allow-overlap': true,
              'icon-ignore-placement': true,
              'icon-size': 0.6
            }
          });
        }

        // Add 3D Buildings Layer (Powerful Map)
        if (!mapInstance.getLayer('3d-buildings')) {
          mapInstance.addLayer({
            'id': '3d-buildings',
            'source': 'composite',
            'source-layer': 'building',
            'filter': ['==', 'extrude', 'true'],
            'type': 'fill-extrusion',
            'minzoom': 13,
            'paint': {
              'fill-extrusion-color': '#aaa',
              'fill-extrusion-height': [
                'interpolate', ['linear'], ['zoom'],
                13, 0,
                13.05, ['get', 'height']
              ],
              'fill-extrusion-base': [
                'interpolate', ['linear'], ['zoom'],
                13, 0,
                13.05, ['get', 'min_height']
              ],
              'fill-extrusion-opacity': 0.6
            }
          });
        }

        // Add 3D Buildings Layer (Powerful Map)
        if (!mapInstance.getLayer('3d-buildings')) {
          mapInstance.addLayer({
            'id': '3d-buildings',
            'source': 'composite',
            'source-layer': 'building',
            'filter': ['==', 'extrude', 'true'],
            'type': 'fill-extrusion',
            'minzoom': 13,
            'paint': {
              'fill-extrusion-color': '#aaa',
              'fill-extrusion-height': [
                'interpolate', ['linear'], ['zoom'],
                13, 0,
                13.05, ['get', 'height']
              ],
              'fill-extrusion-base': [
                'interpolate', ['linear'], ['zoom'],
                13, 0,
                13.05, ['get', 'min_height']
              ],
              'fill-extrusion-opacity': 0.6
            }
          });
        }

        // Auto-fit map to route bounds for better tracking view
        const coordinates = route.coordinates;
        const bounds = coordinates.reduce((bounds, coord) => {
          return bounds.extend(coord as [number, number]);
        }, new mapboxgl.LngLatBounds(coordinates[0] as [number, number], coordinates[0] as [number, number]));

        mapInstance.fitBounds(bounds, {
          padding: 80, // Add padding around route
          maxZoom: 14, // Prevent over-zooming (adjusted from 15)
          duration: 1000 // Smooth animation
        });

        // Animate car along the route
        let currentIndex = 0;

        // Create realistic car marker with PNG and rotation
        const carMarker = document.createElement('div');
        carMarker.className = 'car-marker';
        carMarker.innerHTML = `
          <div style="
            position: relative;
            width: 60px;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            filter: drop-shadow(0 4px 8px rgba(0,0,0,0.4));
            z-index: 999;
          ">
             <!-- GPS Label -->
            <div style="
                position: absolute; 
                top: -30px; 
                left: 50%; 
                transform: translateX(-50%); 
                background: white; 
                padding: 4px 10px; 
                border-radius: 20px; 
                box-shadow: 0 4px 10px rgba(0,0,0,0.15);
                font-size: 11px; 
                font-weight: 700; 
                color: #3F4249;
                white-space: nowrap;
                display: flex;
                align-items: center;
                gap: 5px;
            ">
                <div style="width: 6px; height: 6px; background: #3AC36C; border-radius: 50%; box-shadow: 0 0 0 2px rgba(58, 195, 108, 0.2);"></div>
                Tracking
            </div>
            
            <div style="
                width: 100%; 
                height: 100%; 
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                transition: transform 0.1s ease;
            " class="car-rotate-container">
                <img src="/mobil hijau.png" alt="Driver Car" style="width: 100%; height: 100%; object-fit: contain;" />
                <!-- Direction indicator arrow -->
                <div style="
                  position: absolute;
                  top: -15px;
                  left: 50%;
                  transform: translateX(-50%);
                  width: 0;
                  height: 0;
                  borderLeft: 6px solid transparent;
                  borderRight: 6px solid transparent;
                  borderBottom: 10px solid #3AC36C;
                  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));
                "></div>
                <!-- Add a pulsing effect around the car -->
                <div style="
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  width: 80px;
                  height: 80px;
                  border-radius: 50%;
                  border: 2px solid rgba(58, 195, 108, 0.5);
                  animation: pulse-animation 1.5s infinite;
                  pointer-events: none;
                "></div>
            </div>
          </div>
        `;

        const marker = new mapboxgl.Marker(carMarker)
          .setLngLat(coordinates[0])
          .addTo(mapInstance);

        // Animate car movement (Smooth Interpolation)
        let isActive = true;
        let currentHeading = 0; // Track current heading for rotation

        const smoothAnimateCar = () => {
          if (!isActive) return;

          let index = 0;
          const startTime = performance.now();
          const totalDuration = 60000; // 1 minute total
                  
          // Calculate total distance to determine speed
          let totalDistance = 0;
          for (let i = 1; i < coordinates.length; i++) {
            const prev = coordinates[i - 1] as [number, number];
            const curr = coordinates[i] as [number, number];
            const dx = curr[0] - prev[0];
            const dy = curr[1] - prev[1];
            totalDistance += Math.sqrt(dx * dx + dy * dy);
          }
          
          const animateFrame = (timestamp: number) => {
            if (!isActive) return;
                    
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / totalDuration, 1);
                    
            if (progress < 1) {
              // Find the position along the route based on progress
              // Calculate which segment we're currently on
              let distanceSoFar = progress * totalDistance;
              let accumulatedDistance = 0;
              let segmentIndex = 0;
                      
              // Find which segment the car should be on
              for (let i = 0; i < coordinates.length - 1; i++) {
                const startCoord = coordinates[i] as [number, number];
                const endCoord = coordinates[i + 1] as [number, number];
                const dx = endCoord[0] - startCoord[0];
                const dy = endCoord[1] - startCoord[1];
                const segmentLength = Math.sqrt(dx * dx + dy * dy);
                        
                if (distanceSoFar <= accumulatedDistance + segmentLength) {
                  segmentIndex = i;
                  distanceSoFar -= accumulatedDistance;
                  break;
                }
                accumulatedDistance += segmentLength;
              }
                      
              // Calculate the exact position within the current segment
              const startCoord = coordinates[segmentIndex] as [number, number];
              const endCoord = coordinates[segmentIndex + 1] as [number, number];
              const dx = endCoord[0] - startCoord[0];
              const dy = endCoord[1] - startCoord[1];
              const segmentLength = Math.sqrt(dx * dx + dy * dy);
              const segmentProgress = segmentLength > 0 ? distanceSoFar / segmentLength : 0;
                      
              const lng = startCoord[0] + dx * segmentProgress;
              const lat = startCoord[1] + dy * segmentProgress;
              
              // Safety check to prevent blank/invalid positions
              if (!isFinite(lng) || !isFinite(lat) || isNaN(lng) || isNaN(lat)) {
                console.warn('⚠️ Invalid coordinates detected, skipping frame');
                requestAnimationFrame(animateFrame);
                return;
              }
              
              const nextPos = [lng, lat] as [number, number];
          
              marker.setLngLat(nextPos);
                            
              // Direct camera following with dynamic zoom
              if (mapInstance) {
                // Keep car centered and adjust zoom dynamically
                const dynamicZoom = 14.5 + (0.8 * Math.sin(progress * Math.PI * 2)); // Oscillating zoom
                mapInstance.setCenter(nextPos);
                mapInstance.setZoom(Math.max(13, Math.min(16, dynamicZoom))); // Constrain zoom levels
              }
                            
              // Calculate and apply rotation - ABSOLUTELY CORRECT direction
              let currentHeading = 0;
              
              // Method 1: Use the actual movement vector (most reliable)
              if (segmentIndex > 0) {
                // Calculate heading based on actual movement from previous position
                const prevCoord = coordinates[Math.max(0, segmentIndex - 1)] as [number, number];
                const currentCoord = [lng, lat] as [number, number];
                
                const moveDeltaLng = currentCoord[0] - prevCoord[0];
                const moveDeltaLat = currentCoord[1] - prevCoord[1];
                
                if (moveDeltaLng !== 0 || moveDeltaLat !== 0) {
                  let movementBearing = Math.atan2(moveDeltaLat, moveDeltaLng) * 180 / Math.PI;
                  movementBearing = ((movementBearing % 360) + 360) % 360;
                  currentHeading = movementBearing;
                } else {
                  // Fallback to segment direction if no movement
                  const segmentStart = coordinates[segmentIndex] as [number, number];
                  const segmentEnd = coordinates[Math.min(coordinates.length - 1, segmentIndex + 1)] as [number, number];
                  const segDeltaLng = segmentEnd[0] - segmentStart[0];
                  const segDeltaLat = segmentEnd[1] - segmentStart[1];
                  
                  let segmentBearing = Math.atan2(segDeltaLat, segDeltaLng) * 180 / Math.PI;
                  segmentBearing = ((segmentBearing % 360) + 360) % 360;
                  currentHeading = segmentBearing;
                }
              } else {
                // First segment - use initial direction
                const segmentStart = coordinates[0] as [number, number];
                const segmentEnd = coordinates[1] as [number, number];
                const deltaLng = segmentEnd[0] - segmentStart[0];
                const deltaLat = segmentEnd[1] - segmentStart[1];
                
                let initialBearing = Math.atan2(deltaLat, deltaLng) * 180 / Math.PI;
                initialBearing = ((initialBearing % 360) + 360) % 360;
                currentHeading = initialBearing;
              }
              
              const rotateContainer = carMarker.querySelector('.car-rotate-container') as HTMLElement;
              if (rotateContainer) {
                // ULTIMATE normalization to prevent ANY inversion
                const ultraNormalized = ((currentHeading % 360) + 360) % 360;
                
                // Additional safety: constrain to reasonable driving angles
                let safeHeading = ultraNormalized;
                if (ultraNormalized > 180) {
                  // Convert to equivalent negative angle for consistency
                  safeHeading = ultraNormalized - 360;
                }
                
                // Final positive normalization
                const finalHeading = ((safeHeading % 360) + 360) % 360;
                
                rotateContainer.style.transition = 'transform 0.05s ease-out'; // Faster for crisp response
                rotateContainer.style.transform = `rotate(${finalHeading}deg)`;
                
                // EXTENSIVE debugging
                if (segmentIndex % 5 === 0) { // More frequent logging
                  console.log(`🚗 POS CHECK - Segment ${segmentIndex}:`);
                  console.log(`   Raw heading: ${currentHeading.toFixed(1)}°`);
                  console.log(`   Ultra normalized: ${ultraNormalized.toFixed(1)}°`);
                  console.log(`   Safe heading: ${safeHeading.toFixed(1)}°`);
                  console.log(`   FINAL applied: ${finalHeading.toFixed(1)}°`);
                  console.log(`   Progress: ${(progress * 100).toFixed(1)}%`);
                }
              }
                      
              requestAnimationFrame(animateFrame);
            } else {
              // ARRIVED
              console.log('🎉 Car arrived at destination!');
              if (currentOrder) {
                currentOrder.status = 'delivered';
                setOrder({ ...currentOrder, status: 'delivered' });
                
                // Save receipt
                const receiptData = {
                  ...currentOrder,
                  driverName: driverData.name,
                  driverPhone: driverData.phone,
                  createdAt: new Date().toISOString(),
                  totalAmount: currentOrder.fuelCost + (currentOrder.serviceFee || 0) + 
                    (currentOrder.cartItems?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0)
                };
                
                // Save to localStorage
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                if (user.id) {
                  const existingReceipts = JSON.parse(localStorage.getItem(`userReceipts_${user.id}`) || '[]');
                  existingReceipts.unshift(receiptData);
                  localStorage.setItem(`userReceipts_${user.id}`, JSON.stringify(existingReceipts));
                }
              }
              setTimeout(() => setShowDeliveredModal(true), 500);
            }
          };

          requestAnimationFrame(animateFrame);
        };

        // Start animation automatically
        console.log('🚗 Starting smooth car animation for 1 minute...');
        requestAnimationFrame(smoothAnimateCar);

      } else {
        console.warn('⚠️ No route found from API, using fallback');
        useFallbackRoute(mapInstance, start, end);
      }
    } catch (error) {
      console.error('❌ Error fetching route or timeout:', error);
      console.log('⚠️ Switching to fallback route due to error/timeout');
      useFallbackRoute(mapInstance, start, end);
    }

    // Add destination marker
    const destMarker = document.createElement('div');
    destMarker.className = 'destination-marker';
    destMarker.innerHTML = `
      <div style="
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
      ">
        <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
          <path d="M 20 5 C 14 5 9 10 9 16 C 9 24 20 35 20 35 C 20 35 31 24 31 16 C 31 10 26 5 20 5 Z" fill="#EF4444"/>
          <circle cx="20" cy="16" r="5" fill="white"/>
        </svg>
      </div>
    `;

    new mapboxgl.Marker(destMarker)
      .setLngLat(end as [number, number])
      .addTo(mapInstance);
  }

  // Fallback route function
  function useFallbackRoute(mapInstance: mapboxgl.Map, start: number[], end: number[]) {
    // Create a curvy route with intermediate waypoints
    const midPoint = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2];
    
    // Add some variation to make the route curvy
    const curveFactor = 0.02; // Adjust for more or less curvature
    const controlPoint1 = [midPoint[0] + curveFactor, midPoint[1] + curveFactor * 0.5];
    const controlPoint2 = [midPoint[0] - curveFactor * 0.5, midPoint[1] - curveFactor];
    
    // Create a curved path using multiple intermediate points
    const routeCoordinates = [];
    
    // Generate points along a curved path using cubic Bezier interpolation
    for (let i = 0; i <= 1; i += 0.05) { // Increase resolution for smoother curve
      const t = i;
      // Cubic Bezier curve formula
      const x = Math.pow(1 - t, 3) * start[0] + 
               3 * Math.pow(1 - t, 2) * t * controlPoint1[0] + 
               3 * (1 - t) * Math.pow(t, 2) * controlPoint2[0] + 
               Math.pow(t, 3) * end[0];
      
      const y = Math.pow(1 - t, 3) * start[1] + 
               3 * Math.pow(1 - t, 2) * t * controlPoint1[1] + 
               3 * (1 - t) * Math.pow(t, 2) * controlPoint2[1] + 
               Math.pow(t, 3) * end[1];
      
      routeCoordinates.push([x, y]);
    }
    
    if (!mapInstance.getSource('route')) {
      mapInstance.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: routeCoordinates
          }
        }
      });
    }

    if (!mapInstance.getLayer('route')) {
      mapInstance.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3AC36C',
          'line-width': 6
        }
      });
    }

  // Add car marker for fallback route too
    const carMarker = document.createElement('div');
    carMarker.className = 'car-marker';
    carMarker.innerHTML = `
      <div class="car-rotate-container" style="
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
        transition: transform 0.08s ease-out; /* Smooth rotation transition */
        position: relative;
      ">
        <img src="/mobil hijau.png" alt="Driver Car" style="width: 100%; height: 100%; object-fit: contain;" />
        <!-- Add a pulsing effect around the car -->
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 70px;
          height: 70px;
          border-radius: 50%;
          border: 2px solid rgba(58, 195, 108, 0.5);
          animation: pulse-animation 1.5s infinite;
          pointer-events: none;
        "></div>
      </div>
    `;

    const marker = new mapboxgl.Marker(carMarker)
      .setLngLat(start as [number, number])
      .addTo(mapInstance);

    // Smooth animation from start to end over 1 minute
    const startTime = performance.now();
    const totalDuration = 60000; // 1 minute in milliseconds

    const animateFallback = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      let progress = elapsed / totalDuration;
      
      if (progress < 1) {
        // Use smoother easing function
        progress = 0.5 - 0.5 * Math.cos(progress * Math.PI); // Smooth ease-in-out
        
        const lng = start[0] + (end[0] - start[0]) * progress;
        const lat = start[1] + (end[1] - start[1]) * progress;

        // Calculate angle - for fallback, use the direct line between start and end
        // For fallback, we'll use the bearing from current position to destination
        const currentLng = start[0] + (end[0] - start[0]) * progress;
        const currentLat = start[1] + (end[1] - start[1]) * progress;
        
        // Calculate bearing from current position to destination
        const deltaLng = end[0] - currentLng;
        const deltaLat = end[1] - currentLat;
        
        // Calculate the angle in radians and convert to degrees
        let bearing = Math.atan2(deltaLat, deltaLng) * 180 / Math.PI;
        
        // Normalize to 0-360 degrees
        bearing = ((bearing % 360) + 360) % 360;
        
        // Apply rotation to the container inside the marker
        const rotateContainer = carMarker.querySelector('.car-rotate-container') as HTMLElement;
        if (rotateContainer) {
          // Apply rotation with smooth CSS transition
          rotateContainer.style.transition = 'transform 0.3s ease';
          rotateContainer.style.transform = `rotate(${bearing}deg)`;
        }

        marker.setLngLat([lng, lat]);

        // Much smoother camera following
        if (elapsed > 1000) { // Wait 1 second before moving camera
          mapInstance.easeTo({
            center: [lng, lat],
            duration: 2000, // Smooth transition over 2 seconds
            easing: (t) => t, // Linear easing for consistent movement
            animate: true
          });
        }

        requestAnimationFrame(animateFallback);
      } else {
        // Arrived
        console.log('🎉 Car arrived (fallback)!');
        if (currentOrder) {
          currentOrder.status = 'delivered';
          setOrder({ ...currentOrder, status: 'delivered' });
        }
        setTimeout(() => setShowDeliveredModal(true), 500);
      }
    };

    // Start animation
    requestAnimationFrame(animateFallback);
  }

  // Map loading safety timeout
  useEffect(() => {
    if (!mapLoaded) {
      const timer = setTimeout(() => {
        console.log('Map loading timed out, force showing content');
        setMapLoaded(true);
      }, 1500); // 1.5 seconds timeout (Reduced from 5s) to show content FAST
      return () => clearTimeout(timer);
    }
  }, [mapLoaded]);

  // Show loading state with timeout to prevent infinite loading
  const [showTimeoutError, setShowTimeoutError] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.log('🔍 Loading timeout reached, forcing loading to false');
        setIsLoading(false);
        setShowTimeoutError(true);
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timeout);
  }, [isLoading]);

  // Get the order data (prioritize lastOrderData for guest tracking after payment)
  const currentOrder = order || lastOrderData || selectedOrder;
  const driverData = getDriverData(currentOrder);
  console.log('Driver data:', driverData);
  console.log('Current order:', currentOrder);

  // Define order status based on order data
  // Fixed: 3 steps timeline (Order -> On the Way -> Delivered)
  const orderStatus = {
    progress: currentOrder?.status === 'completed' || currentOrder?.status === 'delivered' ? 100 :
      currentOrder?.status === 'on_the_way' ? 50 :  // Changed from 75 to 50 for smooth transition
        currentOrder?.status === 'preparing' ? 50 :  // Preparing = On the Way
          currentOrder?.status === 'pending' ? 0 : 33,  // Pending = just started
    status: currentOrder?.status || 'pending',
    step: currentOrder?.status === 'completed' || currentOrder?.status === 'delivered' ? 4 :
      currentOrder?.status === 'on_the_way' ? 3 :
        currentOrder?.status === 'preparing' ? 3 :  // Preparing = step 3 (On the Way)
          currentOrder?.status === 'pending' ? 1 : 1
  };

  if (isLoading) {
    return (
      <AnimatedPage>
        <div className="min-h-screen flex flex-col bg-white">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-[#3AC36C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading order details...</p>
              {showTimeoutError && (
                <p className="text-red-500 text-sm mt-2">Taking longer than expected...</p>
              )}
            </div>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  console.log('🔍 TrackOrderScreen data:', {
    order: !!order,
    lastOrderData: !!lastOrderData,
    currentOrder: !!currentOrder,
    token: !!token,
    user: !!user
  });

  return (
    <>
      <AnimatedPage>
        {/* Force visibility of markers */}
        <style>{`
          .car-marker, .mapboxgl-marker {
            z-index: 999 !important;
            opacity: 1 !important;
            display: block !important;
          }
          .destination-marker {
            z-index: 998 !important;
          }
        `}</style>
        <div className="bg-white min-h-screen flex flex-col">
          {/* Header */}
          <div className="flex items-center px-4 py-4 bg-white absolute top-0 left-0 right-0 z-[3000] shadow-sm">
            <TapEffectButton
              onClick={() => navigate('/home')}
              className="p-2 -ml-2"
            >
              <img src="/Back.png" alt="Back" className="w-5 h-5" />
            </TapEffectButton>
            <h1 className="text-lg font-bold text-gray-900 flex-1 text-center -ml-10">Track Your Order</h1>
          </div>

          {/* Map Container with Rounded Corners */}
          <div className="flex-1 relative w-full h-full min-h-[50vh] rounded-3xl overflow-hidden">
            <div
              ref={mapContainer}
              className="w-full h-full absolute inset-0"
              style={{ width: '100%', height: '100%' }}
            />

            {/* Fallback map loading indicator */}
            {!mapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-[#3AC36C] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-gray-600 text-sm">Loading map...</p>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Sheet */}
          <div
            ref={sheetRef}
            className="bg-white rounded-t-3xl shadow-2xl absolute bottom-0 left-0 right-0 z-[3000]"
            style={{ height: `${sheetHeight}%`, transform: `translateY(${100 - sheetHeight}%)` }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Drag Handle */}
            <div className="flex justify-center py-3">
              <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
            </div>

            <div className="px-4 pb-20 overflow-y-auto" style={{ maxHeight: '80vh' }}>
              {/* Driver Information */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <img
                    src={driverData.avatar}
                    alt={driverData.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{driverData.name}</h3>
                    <p className="text-sm text-gray-600">{driverData.location}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Message button clicked!');
                      setShowChatModal(true);
                    }}
                    className="p-3 bg-[#3AC36C] rounded-full w-12 h-12 flex items-center justify-center shadow-md hover:bg-[#2ea85a] transition-all active:scale-95 touch-manipulation"
                    aria-label="Message Agent"
                  >
                    <MessageCircle className="w-6 h-6 text-white" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowCallModal(true);
                    }}
                    className="p-3 bg-[#3AC36C] rounded-full w-12 h-12 flex items-center justify-center shadow-md hover:bg-[#2ea85a] transition-all active:scale-95 touch-manipulation"
                    aria-label="Call Agent"
                  >
                    <Phone className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>

              {/* Delivery Time - Clean Design (No Green Background) */}
              <div className="mb-6">
                <h4 className="font-bold text-gray-900 text-lg mb-1">Your Pickup Time</h4>
                <p className="text-gray-500 text-sm mb-4">
                  {currentOrder?.deliveryTime || 'Estimated 15-20 mins'}
                </p>

                {/* Horizontal Timeline with PNG Icons (Exact Screenshot Design) */}
                <div className="flex items-center justify-between px-2 py-4 relative">
                  {/* Person Icon (Start) - Always Green */}
                  <div className="flex flex-col items-center relative z-10">
                    <img src="/orang icon.png" alt="User" className="w-10 h-10 object-contain" />
                  </div>

                  {/* Dotted Line 1 - Green */}
                  <div className="flex-1 border-t-2 border-dashed border-green-500 mx-2"></div>

                  {/* Car Icon (On the way) - Always Green */}
                  <div className="flex flex-col items-center relative z-10">
                    <img src="/mobil icon.png" alt="Car" className="w-10 h-10 object-contain" />
                  </div>

                  {/* Dotted Line 2 - Gray */}
                  <div className="flex-1 border-t-2 border-dashed border-gray-300 mx-2"></div>

                  {/* Fuel Pump Icon - Gray */}
                  <div className="flex flex-col items-center relative z-10">
                    <img src="/isi icon.png" alt="Fuel" className="w-10 h-10 object-contain" />
                  </div>

                  {/* Dotted Line 3 - Gray */}
                  <div className="flex-1 border-t-2 border-dashed border-gray-300 mx-2"></div>

                  {/* Done Icon (Completed) - Gray */}
                  <div className="flex flex-col items-center relative z-10">
                    <img src="/done icon.png" alt="Done" className="w-10 h-10 object-contain" />
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Order Details</h4>
                <div className="space-y-3">
                  {/* Fuel Item */}
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div>
                      <span className="text-gray-700 font-medium">
                        {currentOrder?.fuelType || 'Regular'} Fuel
                      </span>
                      <span className="text-sm text-gray-500 ml-2">
                        ({currentOrder?.fuelQuantity || '10 liters'})
                      </span>
                    </div>
                    <span className="font-medium text-gray-900">
                      {currentOrder?.currency || '$'}{typeof currentOrder?.fuelCost === 'number' ? currentOrder.fuelCost.toFixed(2) : (currentOrder?.fuelCost || '32.90')}
                    </span>
                  </div>

                  {/* Cart Items (Convenience items) */}
                  {currentOrder?.cartItems?.filter(item => item?.name && typeof item.name === 'string' && item.name.toLowerCase().includes('fee') === false).map((item, index) => (
                    <div key={item?.id || index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                      <div>
                        <span className="text-gray-700">{item?.name || 'Item'}</span>
                        <span className="text-sm text-gray-500 ml-2">
                          (x{item?.quantity || 1})
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">
                        {currentOrder?.currency || '$'}{typeof item?.price === 'number' ? item.price.toFixed(2) : (item?.price || '0.00')}
                      </span>
                    </div>
                  ))}

                  {/* Service Fee */}
                  {currentOrder?.serviceFee && typeof currentOrder.serviceFee === 'number' && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-700">Service Fee</span>
                      <span className="font-medium text-gray-900">
                        {currentOrder?.currency || '$'}{currentOrder.serviceFee.toFixed(2)}
                      </span>
                    </div>
                  )}

                  {/* Station Info */}
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700 text-sm">Station</span>
                    <span className="font-medium text-gray-900 text-sm">
                      {currentOrder?.stationName || 'Fuel Station'}
                    </span>
                  </div>

                  {/* Location Info */}
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700 text-sm">Pickup Location</span>
                    <span className="font-medium text-gray-900 text-sm">
                      {currentOrder?.deliveryAddress || 'Location'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call Modal */}
        {showCallModal && (
          <CallModal
            isOpen={showCallModal}
            onClose={() => setShowCallModal(false)}
            driverName={driverData.name}
            phoneNumber={driverData.phone || getRandomRealPhoneNumber(user?.city?.toLowerCase().includes('london') || user?.city?.toLowerCase().includes('uk') || user?.city?.toLowerCase().includes('england'))}
          />
        )}

        {/* Delivery Completed Modal (UK/US style) */}
        {showDeliveredModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[5000] p-4 animate-fade-in">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-scale-in">
              {/* Success Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-green-500" />
                </div>
              </div>

              {/* Title */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Completed!</h2>
                <p className="text-gray-600">Your order has been completed successfully.</p>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Order ID</span>
                  <span className="text-sm font-medium text-gray-900">{currentOrder?.trackingNumber || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Fuel Friend</span>
                  <span className="text-sm font-medium text-gray-900">{driverData.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Amount</span>
                  <span className="text-sm font-bold text-green-600">
                    {currentOrder?.currency || '$'}{currentOrder?.grandTotal || currentOrder?.totalAmount || '0.00'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowDeliveredModal(false);
                    navigate('/home');
                  }}
                  className="w-full py-3 bg-[#3AC36C] text-white rounded-full font-semibold hover:bg-[#2ea85a] transition-all duration-200"
                >
                  Back to Home
                </button>
                <button
                  onClick={() => {
                    setShowDeliveredModal(false);
                    navigate('/orders');
                  }}
                  className="w-full py-3 border-2 border-gray-200 text-gray-700 rounded-full font-semibold hover:border-[#3AC36C] hover:text-[#3AC36C] transition-all duration-200"
                >
                  View All Orders
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatedPage>

      {/* Chat Modal - Outside AnimatedPage to ensure full screen coverage */}
      {showChatModal && (
        <ChatModal
          isOpen={showChatModal}
          onClose={() => setShowChatModal(false)}
          driverName={driverData.name}
          driverAvatar={driverData.avatar}
          driverPhone={driverData.phone || '+1234567890'}
          onCall={() => {
            setShowChatModal(false);
            // Show in-app calling screen
            const isUK = user?.city?.toLowerCase().includes('london') || user?.city?.toLowerCase().includes('uk') || user?.city?.toLowerCase().includes('england');
            const fallbackPhone = getRandomRealPhoneNumber(isUK);
            alert(`Calling ${driverData.name} at ${driverData.phone || fallbackPhone}`);
          }}
        />
      )}
    </>
  );
};

export default TrackOrderScreen;