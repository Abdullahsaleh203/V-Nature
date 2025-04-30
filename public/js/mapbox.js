'use strict';

// Get the map element
const mapEl = document.getElementById('map');

// Check if map element exists
if (!mapEl) {
  console.error('Map element not found');
  return;
}

try {
  // Parse locations data
  const locations = JSON.parse(mapEl.dataset.locations);
  console.log('Locations data:', locations); // Debug log

  // Set your Mapbox access token
  mapboxgl.accessToken = 'pk.eyJ1IjoibmF0b3Vyc2VydmljZXMiLCJhIjoiY2x0eWJ1a2RrMDF1NzJrcGR1Z2J1a2RrIn0.YOUR_ACCESS_TOKEN';

  // Create the map
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    scrollZoom: false
  });

  // Add navigation controls
  map.addControl(new mapboxgl.NavigationControl());

  const bounds = new mapboxgl.LngLatBounds();

  // Add markers for each location
  locations.forEach(loc => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current position
    bounds.extend(loc.coordinates);
  });

  // Fit map to bounds
  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    }
  });

  // Add error handling for map load
  map.on('error', (e) => {
    console.error('Mapbox error:', e);
  });

  // Add load event handler
  map.on('load', () => {
    console.log('Map loaded successfully');
  });

} catch (err) {
  console.error('Error initializing map:', err);
}
