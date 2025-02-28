mapboxgl.accessToken = 'pk.eyJ1IjoiemV0b25nemh1IiwiYSI6ImNtNmllamU0ejAwMzcya3BvaHl4cHdyNTEifQ.8DeoWcpHZR2z0XiEGvRoJw';  

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/zetongzhu/cm6v6xrar005201s37oh0dt58',
    center: [-79.3832, 43.6532], // Starting Toronto coordinates
    zoom: 10
});

// Load Toronto Census Tract Data
map.on('load', () => {
    map.addSource('torontoct', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/ZetongZhu/GGR-WK5/3d1fc7972b1ef890df84f5d792a18aef803783a6/Wk5%20Exercise/wk5-data/torontoct.geojson'  // Use raw URL here
    });

    // Add CT Layer with Classification for PopDens21
    map.addLayer({
        id: 'torontoct',
        type: 'fill',
        source: 'torontoct',
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'PopDens21'],  // Property name for population density 
                2000, '#0066ff',  // Low population density color
                10000, '#ffcc00'  // High population density color
            ],
            'fill-opacity': 0.3
        }
    });

    // Add Popups
    map.on('click', 'torontoct', (e) => {
        const popDensity = e.features[0].properties.PopDens21;  
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`<h3>Population Density: ${popDensity}</h3>`)
            .addTo(map);
    });

    // Adjust layer opacity based on zoom level
    map.on('zoom', () => {
        const zoomLevel = map.getZoom();
        map.setPaintProperty('torontoct', 'fill-opacity', zoomLevel > 12 ? 0.5 : 0.3);  // Adjust opacity based on zoom
    });

    // Change Layer Visibility
    document.getElementById('toggle-layer').addEventListener('click', () => {
        const visibility = map.getLayoutProperty('torontoct', 'visibility');
        map.setLayoutProperty('torontoct', 'visibility', visibility === 'visible' ? 'none' : 'visible');
    });

    // Dynamic legend
    const minPopDensity = 0;
    const maxPopDensity = 10000;  // Adjust this range based on your data
    document.getElementById('legend').innerHTML = `
        <h3>Legend</h3>
        <p><span class="legend-box" style="background:#0066ff;"></span> Low Population Density (min: ${minPopDensity})</p>
        <p><span class="legend-box" style="background:#ffcc00;"></span> High Population Density (max: ${maxPopDensity})</p>
    `;
});
