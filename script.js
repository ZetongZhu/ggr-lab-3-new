mapboxgl.accessToken = 'pk.eyJ1IjoiemV0b25nemh1IiwiYSI6ImNtNmllamU0ejAwMzcya3BvaHl4cHdyNTEifQ.8DeoWcpHZR2z0XiEGvRoJw';  

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/zetongzhu/cm6v6xrar005201s37oh0dt58',
    center: [-79.3832, 43.6532], // Toronto coordinates
    zoom: 10
});

// Load Toronto Census Tract Data
map.on('load', () => {
    map.addSource('torontoct', {
        type: 'geojson',
        data: 'https://github.com/ZetongZhu/GGR-WK5/blob/3d1fc7972b1ef890df84f5d792a18aef803783a6/Wk5%20Exercise/wk5-data/torontoct.geojson' 
    });

    // Add Layer with Classification
    map.addLayer({
        id: 'torontoct',
        type: 'fill',
        source: 'torontoct',
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'population_density'],
                0, '#0066ff',
                10000, '#ffcc00'
            ],
            'fill-opacity': 0.6
        }
    });

    // Add Popups
    map.on('click', 'torontoct', (e) => {
        const popDensity = e.features[0].properties.population_density;
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`<h3>Population Density: ${popDensity}</h3>`)
            .addTo(map);
    });

    // Change Layer Visibility
    document.getElementById('toggle-layer').addEventListener('click', () => {
        const visibility = map.getLayoutProperty('toronto-ct-layer', 'visibility');
        map.setLayoutProperty('toronto-ct-layer', 'visibility', visibility === 'visible' ? 'none' : 'visible');
    });
});
