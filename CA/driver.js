(function(){
  const LCS = window.CA_LOCATIONS;
  const map = CA_MAP.createMap("map", [LCS[0].lat, LCS[0].lng], 16);
  let myMarker = null, ride = null;

  const goOnlineBtn  = document.getElementById('goOnline');
  const goOfflineBtn = document.getElementById('goOffline');
  const box   = document.getElementById('assignBox');
  const text  = document.getElementById('assignText');
  const dOtp  = document.getElementById('dOtp');
  const btnBoard = document.getElementById('markBoarded');
  const btnDone  = document.getElementById('markComplete');

  function startGPS() {
    // demo marker
    const base = LCS[0];
    myMarker = CA_MAP.addMarker(map, base.lat, base.lng, { title:"Me (auto)" });
    setInterval(()=>{
      // wander a little in SIMULATE
      const lat = myMarker.getLatLng().lat + (Math.random()-.5)*0.0006;
      const lng = myMarker.getLatLng().lng + (Math.random()-.5)*0.0006;
      myMarker.setLatLng([lat,lng]);
    }, 2500);
  }

  async function goOnline() {
    await CA_API.driverOnline({ driverId: 1, online: true });
    goOnlineBtn.disabled = true;
    goOfflineBtn.disabled = false;

    // SIMULATE: check if passenger requested
    setInterval(()=>{
      const last = localStorage.getItem('CA_SIM_LAST_RIDE');
      if (!ride && last) {
        const data = JSON.parse(last);
        ride = data;
        box.classList.remove('hide');
        text.textContent = `${ride.payload.pickup} → ${ride.payload.drop}`;
        dOtp.textContent = ride.otp;

        // move to pickup, then to drop
        const p = { lat: ride.payload.pickup_lat, lng: ride.payload.pickup_lng };
        const d = { lat: ride.payload.drop_lat,   lng: ride.payload.drop_lng   };
        CA_MAP.moveMarker(myMarker, p, 5000, ()=>{
          text.textContent = "At pickup — verify OTP & press Boarded";
        });

      }
    }, 1200);

    startGPS();
  }

  function goOffline() {
    location.reload();
  }

  btnBoard.addEventListener('click', async ()=>{
    if (!ride) return;
    await CA_API.boardRide({ rideId: ride.rideId, otp: ride.otp });
    text.textContent = "In progress… heading to destination";
    const d = { lat: ride.payload.drop_lat, lng: ride.payload.drop_lng };
    CA_MAP.moveMarker(myMarker, d, 6000, ()=>{
      text.textContent = "Reached — press Trip Complete";
    });
  });

  btnDone.addEventListener('click', async ()=>{
    if (!ride) return;
    await CA_API.completeRide({ rideId: ride.rideId });
    text.textContent = "Trip completed. Good job!";
    localStorage.removeItem('CA_SIM_LAST_RIDE');
  });

  goOnlineBtn.addEventListener('click', goOnline);
  goOfflineBtn.addEventListener('click', goOffline);
})();



