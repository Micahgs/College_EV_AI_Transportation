(function(){
  function createMap(el, center=[30.3553,76.3666], zoom=16) {
    const map = L.map(el).setView(center, zoom);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19, attribution: '&copy; OpenStreetMap'
    }).addTo(map);
    return map;
  }

  function addMarker(map, lat, lng, opts={}) {
    const m = L.marker([lat,lng], opts).addTo(map);
    return m;
  }

  // Simple linear movement between points
  function moveMarker(marker, to, durationMs=6000, cb) {
    const from = marker.getLatLng();
    const steps = Math.max(20, Math.floor(durationMs / 50));
    let i=0;
    const int = setInterval(()=>{
      i++;
      const lat = from.lat + (to.lat - from.lat) * (i/steps);
      const lng = from.lng + (to.lng - from.lng) * (i/steps);
      marker.setLatLng([lat,lng]);
      if (i>=steps) { clearInterval(int); cb && cb(); }
    }, 50);
  }

  // Bounds to include all markers
  function fitToMarkers(map, markers) {
    const group = L.featureGroup(markers);
    map.fitBounds(group.getBounds().pad(0.2));
  }

  window.CA_MAP = { createMap, addMarker, moveMarker, fitToMarkers };
})();
