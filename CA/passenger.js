(function(){
  const LCS = window.CA_LOCATIONS;
  const map = CA_MAP.createMap("map", [LCS[0].lat, LCS[0].lng], 16);
  let markers = [];
  let currentRide = null;

  // populate selects
  const pickupSel = document.getElementById('pickup');
  const dropSel   = document.getElementById('drop');
  for (const p of LCS) {
    pickupSel.innerHTML += `<option value="${p.id}">${p.label}</option>`;
    dropSel.innerHTML   += `<option value="${p.id}">${p.label}</option>`;
  }
  pickupSel.value = "HOSTEL_B";
  dropSel.value   = "LIBRARY";

  const statusBox  = document.getElementById('statusBox');
  const statusText = document.getElementById('statusText');
  const otpWrap    = document.getElementById('otpWrap');
  const otpEl      = document.getElementById('otp');

  function renderRoute(pick, drop) {
    markers.forEach(m=>map.removeLayer(m)); markers=[];
    const m1 = CA_MAP.addMarker(map, pick.lat, pick.lng, { title: pick.label });
    const m2 = CA_MAP.addMarker(map, drop.lat, drop.lng, { title: drop.label });
    markers.push(m1,m2);
    CA_MAP.fitToMarkers(map, markers);
  }

  function locById(id){ return LCS.find(x=>x.id===id); }

  document.getElementById('requestBtn').addEventListener('click', async ()=>{
    const pick = locById(pickupSel.value);
    const drop = locById(dropSel.value);
    renderRoute(pick, drop);

    statusBox.classList.remove('hide');
    statusText.textContent = "Finding nearest auto…";

    const { rideId, otp, assignedDriver } = await CA_API.requestRide({
      studentId: 1,
      pickup: pick.label, drop: drop.label,
      pickup_lat: pick.lat, pickup_lng: pick.lng,
      drop_lat: drop.lat,   drop_lng: drop.lng
    });

    currentRide = { rideId, otp, pick, drop, assignedDriver };

    statusText.textContent = `Auto assigned (Driver #${assignedDriver}). ETA ~2–4 min`;
    otpWrap.classList.remove('hide'); otpEl.textContent = otp;

    // simulate movement of auto from nearby random point
    const near = { lat: pick.lat + (Math.random()-.5)*0.002, lng: pick.lng + (Math.random()-.5)*0.002 };
    const auto = CA_MAP.addMarker(map, near.lat, near.lng, { title:"Auto" });
    markers.push(auto);

    CA_MAP.moveMarker(auto, { lat: pick.lat, lng: pick.lng }, 5000, ()=>{
      statusText.textContent = "Auto arrived. Tell OTP to driver to board.";
    });
  });
})();
