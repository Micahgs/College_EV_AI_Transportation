(function(){
  const { SIMULATE, API_BASE } = window.CA_CONFIG;

  // small utils
  const sleep = (ms)=>new Promise(r=>setTimeout(r,ms));
  const pick = (arr)=>arr[Math.floor(Math.random()*arr.length)];

  async function requestRide(payload) {
    if (!SIMULATE) {
      const res = await fetch(`${API_BASE}/rides/request`, {
        method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(payload)
      });
      return res.json();
    }
    // simulate: assign fake driver + otp
    await sleep(700);
    const rideId = Math.floor(Math.random()*100000);
    const otp = String(Math.floor(1000+Math.random()*9000));
    const assignedDriver = 1;
    // stash for driver side to pick
    localStorage.setItem('CA_SIM_LAST_RIDE', JSON.stringify({ rideId, otp, payload, assignedDriver }));
    return { rideId, otp, assignedDriver };
  }

  async function boardRide({ rideId, otp }) {
    if (!SIMULATE) {
      const res = await fetch(`${API_BASE}/rides/${rideId}/board`, {
        method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ otp })
      });
      return res.json();
    }
    await sleep(300);
    return { ok:true };
  }

  async function completeRide({ rideId }) {
    if (!SIMULATE) {
      const res = await fetch(`${API_BASE}/rides/${rideId}/complete`, { method:'POST' });
      return res.json();
    }
    await sleep(300);
    return { ok:true };
  }

  async function driverOnline({ driverId, online }) {
    if (!SIMULATE) {
      const res = await fetch(`${API_BASE}/driver/online`, {
        method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ driverId, online })
      });
      return res.json();
    }
    await sleep(200);
    return { ok:true };
  }

  window.CA_API = { requestRide, boardRide, completeRide, driverOnline };
})();
