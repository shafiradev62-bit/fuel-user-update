import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Inject CSS animations
const injectAnimations = () => {
  if (typeof document !== 'undefined' && !document.getElementById('mapbox-animations')) {
    const style = document.createElement('style');
    style.id = 'mapbox-animations';
    style.textContent = `
      @keyframes pulse-ring {
        0% { transform: scale(1); opacity: 0.7; }
        50% { transform: scale(1.3); opacity: 0.3; }
        100% { transform: scale(1.6); opacity: 0; }
      }
      
      @keyframes pulse-danger {
        0% { transform: scale(1); }
        50% { transform: scale(1.3); }
        100% { transform: scale(1); }
      }
      
      @keyframes bounce-click {
        0% { transform: scale(1); }
        30% { transform: scale(0.9); }
        60% { transform: scale(1.1); }
        100% { transform: scale(1); }
      }
      
      .station-marker {
        will-change: transform;
      }
    `;
    document.head.appendChild(style);
  }
};

injectAnimations();

// Set Mapbox access token from environment variable
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoidmluYTk4IiwiYSI6ImNtN3I3eDF6ZTB2OW0yam9kdzFxdndhdTkifQ.HNqbNgBUAoBPYmoAMISdaw';

interface MapboxMapProps {
  stations: any[];
  userLocation: { lat: number; lon: number } | null;
  onStationSelect: (station: any) => void;
  selectedOrder?: any;
  isUK?: boolean;
  fuelType?: 'regular' | 'premium' | 'diesel';
}

interface ExtendedStation {
  hasStore: boolean;
  hasRestroom: boolean;
  hasATM: boolean;
  occupancy_level: 'Low' | 'Medium' | 'High';
  updatedAt: string;
}

const MapboxMap: React.FC<MapboxMapProps> = ({ stations, userLocation, onStationSelect, selectedOrder, isUK = false, fuelType = 'regular' }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const carMarker = useRef<mapboxgl.Marker | null>(null);
  const carElement = useRef<HTMLDivElement | null>(null);

  // Make onStationSelect globally accessible for popup buttons
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).selectStation = (stationId: string) => {
        const station = stations.find(s => s.id === stationId);
        if (station) {
          onStationSelect(station);
        }
      };
    }
  }, [stations, onStationSelect]);
  const animationRef = useRef<number | null>(null);
  const [counter, setCounter] = useState(0);
  const weatherLayerRef = useRef<any>(null);
  const cloudMarkersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current || !userLocation) return;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [userLocation.lon, userLocation.lat],
      zoom: 12,
      attributionControl: false
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add weather effects based on region
    addWeatherEffects(isUK);

    return () => {
      if (map.current) {
        try {
          map.current.remove();
        } catch (e) {
          console.error("Error removing map:", e);
        }
        map.current = null;
      }
      // Clean up weather effects
      cleanupWeatherEffects();
    };
  }, [userLocation]);

  useEffect(() => {
    if (!map.current || !userLocation) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add user location marker (Me)
    const userMarkerEl = document.createElement('div');
    userMarkerEl.className = 'user-marker';
    userMarkerEl.innerHTML = `
      <div style="
        width: 30px;
        height: 30px;
        position: relative;
      ">
        <img 
          src="/pinpoint.png" 
          alt="Your Location" 
          style="
            width: 100%;
            height: 100%;
            object-fit: contain;
          "
        />
      </div>
      <div style="
        position: absolute;
        top: 35px;
        left: 50%;
        transform: translateX(-50%);
        background: white;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 600;
        color: #3F4249;
        white-space: nowrap;
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
      ">Me</div>
    `;

    const userMarker = new mapboxgl.Marker(userMarkerEl)
      .setLngLat([userLocation.lon, userLocation.lat])
      .addTo(map.current);

    markers.current.push(userMarker);

    // Calculate price stats for color coding
    const prices = stations.map(s => s.fuelPrices?.[fuelType] || s.fuelPrices?.regular || 0).filter(p => p > 0);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;

    // Add station markers
    stations.forEach((station) => {
      if (station.lat && station.lon) {
        // SIMULATE MOCK DATA if missing
        const extendedStation: ExtendedStation = {
          hasStore: station.hasStore ?? (Math.random() > 0.3),
          hasRestroom: station.hasRestroom ?? (Math.random() > 0.2),
          hasATM: station.hasATM ?? (Math.random() > 0.5),
          occupancy_level: station.occupancy_level || (Math.random() > 0.6 ? 'High' : Math.random() > 0.3 ? 'Medium' : 'Low'),
          updatedAt: station.updatedAt || new Date(Date.now() - Math.random() * 3600000 * 24).toISOString() // Random time within last 24h
        };

        const currentPrice = station.fuelPrices?.[fuelType] || station.fuelPrices?.regular || 0;

        // Dynamic Color Coding (Heatmap logic)
        let markerColor = '#FFA500'; // Default Yellow (Average)
        if (currentPrice <= minPrice + (avgPrice - minPrice) * 0.3) {
          markerColor = '#3AC36C'; // Green (Low/Best)
        } else if (currentPrice >= maxPrice - (maxPrice - avgPrice) * 0.3) {
          markerColor = '#FF6B6B'; // Red (High)
        } else {
          markerColor = '#FFA500'; // Yellow (Average)
        }

        // Helper for icons
        const getAmenityIcon = (type: string) => {
          if (type === 'store') return '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3h18v18H3zM9 9h6v6H9z"/></svg>';
          if (type === 'restroom') return '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M6 20v-8h12v8"/></svg>';
          if (type === 'atm') return '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>';
          return '';
        };

        const markerSize = '28px'; // Uniform size for now, color indicates value

        const stationMarkerEl = document.createElement('div');
        stationMarkerEl.className = 'station-marker';
        stationMarkerEl.innerHTML = `
          <div style="
            width: ${markerSize};
            height: ${markerSize};
            background: ${markerColor};
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            position: relative;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            justify-content: center;
            transform-origin: center;
          ">
             <!-- Interactive inner elements -->
             <div style="
                position: relative;
                width: 100%;
                height: 100%;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
             ">
                <!-- Central price indicator -->
                <div style="
                  font-size: 8px;
                  font-weight: bold;
                  color: white;
                  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
                ">$${currentPrice.toFixed(1)}</div>
                
                <!-- Animated pulse ring -->
                <div style="
                  position: absolute;
                  width: 100%;
                  height: 100%;
                  border: 2px solid ${markerColor};
                  border-radius: 50%;
                  animation: pulse-ring 2s infinite;
                  opacity: 0.7;
                "></div>
             </div>
             
             <!-- Occupancy indicator with animation -->
             <div style="
                position: absolute;
                top: -2px;
                right: -2px;
                width: 12px;
                height: 12px;
                background: ${extendedStation.occupancy_level === 'High' ? '#FF5252' : extendedStation.occupancy_level === 'Medium' ? '#FFA000' : '#4CAF50'};
                border: 2px solid white;
                border-radius: 50%;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                animation: ${extendedStation.occupancy_level === 'High' ? 'pulse-danger' : 'none'} 1.5s infinite;
             "></div>
             
             <!-- Amenities quick view -->
             <div style="
                position: absolute;
                bottom: -8px;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                gap: 2px;
                background: rgba(255,255,255,0.9);
                padding: 1px 3px;
                border-radius: 6px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.2);
             ">
                ${extendedStation.hasStore ? `<div style="width: 8px; height: 8px; background: #4CAF50; border-radius: 50%;" title="Store"></div>` : ''}
                ${extendedStation.hasRestroom ? `<div style="width: 8px; height: 8px; background: #2196F3; border-radius: 50%;" title="Restroom"></div>` : ''}
                ${extendedStation.hasATM ? `<div style="width: 8px; height: 8px; background: #FF9800; border-radius: 50%;" title="ATM"></div>` : ''}
             </div>
          </div>
          
          <!-- Enhanced Price Badge with trend indicator -->
          <div style="
            position: absolute;
            top: -32px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, white 0%, #f8f9fa 100%);
            padding: 4px 8px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 700;
            color: #3F4249;
            white-space: nowrap;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            border: 2px solid ${markerColor};
            z-index: 10;
            display: flex;
            align-items: center;
            gap: 4px;
          ">
            <span>$${currentPrice.toFixed(2)}</span>
            <!-- Trend indicator -->
            <span style="
              font-size: 10px;
              color: ${currentPrice <= avgPrice ? '#4CAF50' : '#FF5722'};
            ">${currentPrice <= avgPrice ? '↓' : '↑'}</span>
          </div>
        `;

        // Enhanced Hover Effects
        stationMarkerEl.addEventListener('mouseenter', () => {
          stationMarkerEl.style.transform = 'scale(1.25) translateY(-5px)';
          stationMarkerEl.style.zIndex = '100';
          
          // Add glow effect
          const markerCircle = stationMarkerEl.querySelector('div') as HTMLElement;
          if (markerCircle) {
            markerCircle.style.boxShadow = `0 0 20px ${markerColor}, 0 8px 16px rgba(0,0,0,0.4)`;
          }
          
          // Animate amenities bar
          const amenitiesBar = stationMarkerEl.querySelector('div:nth-child(2) > div:last-child') as HTMLElement;
          if (amenitiesBar) {
            amenitiesBar.style.transform = 'translateX(-50%) scale(1.1)';
            amenitiesBar.style.opacity = '1';
          }
        });

        stationMarkerEl.addEventListener('mouseleave', () => {
          stationMarkerEl.style.transform = 'scale(1) translateY(0)';
          stationMarkerEl.style.zIndex = 'auto';
          
          // Reset glow effect
          const markerCircle = stationMarkerEl.querySelector('div') as HTMLElement;
          if (markerCircle) {
            markerCircle.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
          }
          
          // Reset amenities bar
          const amenitiesBar = stationMarkerEl.querySelector('div:nth-child(2) > div:last-child') as HTMLElement;
          if (amenitiesBar) {
            amenitiesBar.style.transform = 'translateX(-50%) scale(1)';
            amenitiesBar.style.opacity = '0.9';
          }
        });

        // Click Animation
        stationMarkerEl.addEventListener('click', (e) => {
          e.stopPropagation();
          
          // Bounce animation
          stationMarkerEl.style.animation = 'bounce-click 0.4s ease';
          setTimeout(() => {
            stationMarkerEl.style.animation = '';
          }, 400);
          
          onStationSelect(station);
        });

        // Enhanced Popup Content
        const timeDiff = Math.floor((Date.now() - new Date(extendedStation.updatedAt).getTime()) / 60000); // mins
        const timeText = timeDiff < 60 ? `${timeDiff}m ago` : `${Math.floor(timeDiff / 60)}h ago`;
        
        const popupHTML = `
            <div style="padding: 8px; min-width: 160px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <span style="font-weight: bold; font-size: 14px; color: #2c3e50;">${station.name}</span>
                    <span style="
                        font-size: 11px; 
                        padding: 2px 6px; 
                        border-radius: 12px;
                        background: ${extendedStation.occupancy_level === 'High' ? '#FFEBEE' : extendedStation.occupancy_level === 'Medium' ? '#FFF3E0' : '#E8F5E9'};
                        color: ${extendedStation.occupancy_level === 'High' ? '#D32F2F' : extendedStation.occupancy_level === 'Medium' ? '#EF6C00' : '#2E7D32'};
                        font-weight: 600;
                        display: flex;
                        align-items: center;
                        gap: 4px;
                    ">
                        <span style="width: 8px; height: 8px; background: currentColor; border-radius: 50%;"></span>
                        ${extendedStation.occupancy_level} Traffic
                    </span>
                </div>
                
                <!-- Fuel Prices Section -->
                <div style="margin-bottom: 10px; padding: 8px; background: #f8f9fa; border-radius: 6px;">
                    <div style="font-size: 12px; color: #666; margin-bottom: 4px;">Fuel Prices:</div>
                    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                      ${station.fuelPrices?.regular ? `<div style="font-size: 11px; padding: 2px 6px; background: #e3f2fd; border-radius: 4px;">
                        Regular: <strong>$${station.fuelPrices.regular.toFixed(2)}</strong>
                      </div>` : ''}
                      ${station.fuelPrices?.premium ? `<div style="font-size: 11px; padding: 2px 6px; background: #f3e5f5; border-radius: 4px;">
                        Premium: <strong>$${station.fuelPrices.premium.toFixed(2)}</strong>
                      </div>` : ''}
                      ${station.fuelPrices?.diesel ? `<div style="font-size: 11px; padding: 2px 6px; background: #e8f5e9; border-radius: 4px;">
                        Diesel: <strong>$${station.fuelPrices.diesel.toFixed(2)}</strong>
                      </div>` : ''}
                    </div>
                </div>
                
                <!-- Amenities Section -->
                <div style="margin-bottom: 8px;">
                    <div style="font-size: 12px; color: #666; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2">
                        <circle cx="12" cy="10" r="3"/><path d="M12 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M20 21v-2a4 4 0 0 0-4-4h-2a4 4 0 0 0-4 4v2"/>
                      </svg>
                      Available Amenities:
                    </div>
                    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                         ${extendedStation.hasStore ? `<span style="font-size: 11px; padding: 3px 8px; background: #4CAF50; color: white; border-radius: 12px; display: flex; align-items: center; gap: 4px;">
                           <svg width="12" height="12" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><rect x="9" y="9" width="6" height="6"/></svg>
                           Store
                         </span>` : ''}
                         ${extendedStation.hasRestroom ? `<span style="font-size: 11px; padding: 3px 8px; background: #2196F3; color: white; border-radius: 12px; display: flex; align-items: center; gap: 4px;">
                           <svg width="12" height="12" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M6 20v-8h12v8"/></svg>
                           Restroom
                         </span>` : ''}
                         ${extendedStation.hasATM ? `<span style="font-size: 11px; padding: 3px 8px; background: #FF9800; color: white; border-radius: 12px; display: flex; align-items: center; gap: 4px;">
                           <svg width="12" height="12" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                           ATM
                         </span>` : ''}
                    </div>
                </div>

                <div style="font-size: 11px; color: #888; border-top: 1px solid #eee; padding-top: 6px; display: flex; justify-content: space-between; align-items: center;">
                    <span>Last updated: ${timeText}</span>
                    <button onclick="window.selectStation('${station.id}')" style="
                      background: #3AC36C; 
                      color: white; 
                      border: none; 
                      padding: 4px 8px; 
                      border-radius: 4px; 
                      font-size: 11px; 
                      cursor: pointer;
                      font-weight: 500;
                    ">View Details</button>
                </div>
            </div>
        `;

        const popup = new mapboxgl.Popup({ offset: 25, closeButton: false })
          .setHTML(popupHTML);

        const stationMarker = new mapboxgl.Marker({
          element: stationMarkerEl,
          anchor: 'center'
        })
          .setLngLat([station.lon, station.lat])
          .setPopup(popup) // Bind popup to marker
          .addTo(map.current);

        // Show popup on hover? Optional. Let's keep it click or separate. 
        // Mapbox Popup usually opens on click. 
        // We can add hover listener to open it.
        stationMarkerEl.addEventListener('mouseenter', () => popup.addTo(map.current!));
        stationMarkerEl.addEventListener('mouseleave', () => popup.remove());

        markers.current.push(stationMarker);
      }
    });

    // Add lines connecting stations to user location
    const addStationLines = () => {
      // Check if map is valid and style is loaded
      if (!map.current || !map.current.getStyle()) return;

      stations.forEach((station, index) => {
        // Double check map validity inside loop
        if (station.lat && station.lon && userLocation && map.current) {
          // Create a line source and layer
          const lineId = `line-${station.id}`;
          const lineSourceId = `line-source-${station.id}`;

          // Add source for the line
          if (!map.current.getSource(lineSourceId)) {
            map.current.addSource(lineSourceId, {
              type: 'geojson',
              data: {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'LineString',
                  coordinates: [
                    [userLocation.lon, userLocation.lat],
                    [station.lon, station.lat]
                  ]
                }
              }
            });
          }

          // Add line layer
          if (!map.current.getLayer(lineId)) {
            map.current.addLayer({
              id: lineId,
              type: 'line',
              source: lineSourceId,
              paint: {
                'line-color': '#3AC36C',
                'line-width': 2,
                'line-opacity': 0.7,
                'line-dasharray': [2, 2] // Dashed line
              }
            });
          }
        }
      });
    };

    if (map.current.isStyleLoaded()) {
      addStationLines();
    } else {
      map.current.on('style.load', addStationLines);
    }

    // Initialize car animation if we have a selected order
    if (selectedOrder && userLocation) {
      console.log('✅ Starting car animation');

      // Create car route coordinates (simulating from user location to station)
      const startCoords: [number, number] = [userLocation.lon, userLocation.lat];

      // Get station coordinates from selected order
      let endCoords: [number, number] = [userLocation.lon + 0.01, userLocation.lat + 0.01]; // Default offset

      if (selectedOrder.station?.lon && selectedOrder.station?.lat) {
        endCoords = [selectedOrder.station.lon, selectedOrder.station.lat];
      } else if (stations.length > 0) {
        // Fallback to first station
        endCoords = [stations[0].lon, stations[0].lat];
      }

      // Create route with intermediate points for smooth animation
      const routeData: [number, number][] = [
        startCoords,
        [(startCoords[0] + endCoords[0]) / 2, (startCoords[1] + endCoords[1]) / 2] as [number, number],
        endCoords
      ];

      // Create car element
      if (!carElement.current) {
        console.log('🔍 Creating car element');
        carElement.current = document.createElement('div');
        carElement.current.className = 'car-marker';
        carElement.current.innerHTML = `
          <div style="
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s ease-out;
          ">
            <img 
              src="/car.png" 
              alt="Moving Car" 
              style="
                width: 100%;
                height: 100%;
                object-fit: contain;
                transform: rotate(0deg);
              "
              onload="console.log('✅ Car image loaded successfully')"
              onerror="console.error('❌ Failed to load car image')"
            />
          </div>
        `;
      }

      // Create or update car marker
      if (!carMarker.current) {
        carMarker.current = new mapboxgl.Marker(carElement.current)
          .setLngLat(startCoords)
          .addTo(map.current);
      } else {
        carMarker.current.setLngLat(startCoords);
      }

      // Animation variables
      let animationCounter = 0;
      const steps = 500;

      const animateCar = () => {
        if (!carMarker.current || !carElement.current) return;

        // Calculate current position
        const start = routeData[Math.floor(animationCounter) % routeData.length];
        const end = routeData[(Math.floor(animationCounter) + 1) % routeData.length];

        const lng = start[0] + (end[0] - start[0]) * (animationCounter % 1);
        const lat = start[1] + (end[1] - start[1]) * (animationCounter % 1);

        // Update car position
        carMarker.current.setLngLat([lng, lat]);

        // Calculate bearing (rotation)
        if (start && end) {
          const deltaX = end[0] - start[0];
          const deltaY = end[1] - start[1];
          const bearing = Math.atan2(deltaX, deltaY) * (180 / Math.PI);

          // Update car rotation
          const img = carElement.current.querySelector('img');
          if (img) {
            (img as HTMLElement).style.transform = `rotate(${bearing}deg)`;
          }
        }

        // Center map on car
        if (map.current) {
          map.current.setCenter([lng, lat]);
        }

        // Continue animation
        animationCounter += 0.01;

        if (animationCounter < steps) {
          animationRef.current = requestAnimationFrame(animateCar);
        }
      };

      // Start animation
      animationRef.current = requestAnimationFrame(animateCar);
    }

    // Cleanup function
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (carMarker.current) {
        carMarker.current.remove();
        carMarker.current = null;
      }

      // Remove line layers and sources
      stations.forEach((station) => {
        const lineId = `line-${station.id}`;
        const lineSourceId = `line-source-${station.id}`;

        // Safely remove layers with try-catch
        if (map.current) {
          try {
            if (map.current.getStyle() && map.current.getLayer(lineId)) {
              map.current.removeLayer(lineId);
            }
            if (map.current.getStyle() && map.current.getSource(lineSourceId)) {
              map.current.removeSource(lineSourceId);
            }
          } catch (e) {
            // Ignore errors if map is already removed
            console.warn("Mapbox cleanup error (ignored):", e);
          }
        }
      });

      // Remove event listener if it was added
      if (map.current) {
        try {
          map.current.off('style.load', addStationLines);
        } catch (e) {
          // Ignore
        }
      }

      // Don't remove map here - it's handled by the first useEffect
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
    };
  }, [stations, userLocation, onStationSelect, selectedOrder, fuelType]);

  // Weather effects functions
  const addWeatherEffects = (isUKRegion: boolean) => {
    if (!map.current) return;

    // Clear existing weather effects
    cleanupWeatherEffects();

    // Create realistic weather overlay
    const weatherCanvas = document.createElement('canvas');
    weatherCanvas.width = 800;
    weatherCanvas.height = 600;
    const ctx = weatherCanvas.getContext('2d');

    if (ctx) {
      if (isUKRegion) {
        // UK Weather: Realistic cloudy conditions with light snow
        drawRealisticUKWeather(ctx, weatherCanvas.width, weatherCanvas.height);
      } else {
        // US Weather: Realistic mixed conditions with sun and clouds
        drawRealisticUSWeather(ctx, weatherCanvas.width, weatherCanvas.height);
      }

      // Add weather layer to map
      weatherLayerRef.current = new mapboxgl.Marker({
        element: weatherCanvas,
        anchor: 'center'
      })
        .setLngLat([userLocation!.lon, userLocation!.lat])
        .addTo(map.current);
    }

    // Add realistic floating weather particles
    addRealisticWeatherParticles(isUKRegion);
  };

  const drawRealisticUKWeather = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Draw realistic cloud formations
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = '#f8f9fa';

    // Large cumulus clouds
    drawRealisticCloud(ctx, 50, 30, 180, 60, '#ffffff');
    drawRealisticCloud(ctx, 300, 80, 200, 70, '#f0f0f0');
    drawRealisticCloud(ctx, 150, 150, 150, 50, '#fafafa');
    drawRealisticCloud(ctx, 450, 120, 170, 55, '#f5f5f5');

    // Add realistic snow effect
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = '#e6f3ff';
    for (let i = 0; i < 80; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = 1 + Math.random() * 3;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawRealisticUSWeather = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Draw realistic mix of clouds and sun
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = '#ffffff';

    // Scattered realistic clouds
    drawRealisticCloud(ctx, 20, 20, 120, 45, '#ffffff');
    drawRealisticCloud(ctx, 200, 40, 130, 50, '#f8f8f8');
    drawRealisticCloud(ctx, 350, 100, 100, 40, '#f0f0f0');
    drawRealisticCloud(ctx, 100, 180, 140, 55, '#f5f5f5');
    drawRealisticCloud(ctx, 500, 60, 110, 42, '#fafafa');

    // Realistic sun effect
    ctx.globalAlpha = 0.25;
    const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, 100);
    gradient.addColorStop(0, '#fff9c4');
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 100, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawRealisticCloud = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, color: string) => {
    ctx.fillStyle = color;

    // Main cloud body
    ctx.beginPath();
    ctx.ellipse(x + width / 4, y + height / 2, width / 4, height / 2, 0, 0, Math.PI * 2);
    ctx.ellipse(x + width / 2, y + height / 3, width / 3, height / 2.5, 0, 0, Math.PI * 2);
    ctx.ellipse(x + width * 0.75, y + height / 2, width / 5, height / 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Add texture/detail
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = '#e0e0e0';
    for (let i = 0; i < 5; i++) {
      const detailX = x + 20 + Math.random() * (width - 40);
      const detailY = y + 10 + Math.random() * (height - 20);
      const detailSize = 5 + Math.random() * 10;
      ctx.beginPath();
      ctx.arc(detailX, detailY, detailSize, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 0.35;
  };

  const addRealisticWeatherParticles = (isUKRegion: boolean) => {
    if (!map.current) return;

    const particleCount = isUKRegion ? 50 : 35;

    for (let i = 0; i < particleCount; i++) {
      setTimeout(() => {
        if (!map.current) return;

        const particleEl = document.createElement('div');
        const isSnow = isUKRegion && Math.random() > 0.3;
        const size = isSnow ? (3 + Math.random() * 5) : (4 + Math.random() * 8);

        particleEl.style.cssText = `
          width: ${size}px;
          height: ${size}px;
          background: ${isSnow ? '#e6f3ff' : '#fff9c4'};
          border-radius: ${isSnow ? '50%' : '30%'};
          opacity: ${0.4 + Math.random() * 0.4};
          box-shadow: 0 0 ${isSnow ? '8px' : '12px'} ${isSnow ? '#cce6ff' : '#fff066'};
          animation: float-${isUKRegion ? 'snow' : 'sun'} ${isUKRegion ? (6 + Math.random() * 4) : (4 + Math.random() * 3)}s linear infinite;
          filter: ${isSnow ? 'blur(0.5px)' : 'blur(1px)'};
        `;

        // Add CSS animations
        if (!document.getElementById('realistic-weather-animation')) {
          const style = document.createElement('style');
          style.id = 'realistic-weather-animation';
          style.textContent = `
            @keyframes float-snow {
              0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
              10% { opacity: 0.7; }
              90% { opacity: 0.7; }
              100% { transform: translateY(-150px) translateX(${20 - Math.random() * 40}px) rotate(${Math.random() * 360}deg); opacity: 0; }
            }
            @keyframes float-sun {
              0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
              10% { opacity: 0.6; }
              90% { opacity: 0.6; }
              100% { transform: translateY(-120px) translateX(${15 - Math.random() * 30}px) rotate(${Math.random() * 180}deg); opacity: 0; }
            }
          `;
          document.head.appendChild(style);
        }

        const offsetLat = (Math.random() - 0.5) * 0.03;
        const offsetLon = (Math.random() - 0.5) * 0.03;

        const particleMarker = new mapboxgl.Marker({
          element: particleEl,
          anchor: 'center'
        })
          .setLngLat([userLocation!.lon + offsetLon, userLocation!.lat + offsetLat])
          .addTo(map.current);

        cloudMarkersRef.current.push(particleMarker);
      }, i * 200);
    }
  };

  const cleanupWeatherEffects = () => {
    if (weatherLayerRef.current) {
      weatherLayerRef.current.remove();
      weatherLayerRef.current = null;
    }

    cloudMarkersRef.current.forEach(marker => marker.remove());
    cloudMarkersRef.current = [];
  };

  return (
    <div
      ref={mapContainer}
      className="w-full h-full"
      style={{ minHeight: '420px' }}
    />
  );
};

export default MapboxMap;