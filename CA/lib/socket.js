(function () {
  const { SIMULATE, API_BASE } = window.CA_CONFIG;
  let socket = null;

  if (!SIMULATE && window.io) {
    socket = window.io(API_BASE, { transports: ["websocket"] });
    console.log("[socket] connected mode");
  } else {
    console.log("[socket] simulate mode (no backend socket)");
  }

  window.CA_SOCK = {
    get() { return socket; },
    on(event, handler) { if (socket) socket.on(event, handler); },
    emit(event, payload) { if (socket) socket.emit(event, payload); },
  };
})();
