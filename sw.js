self.addEventListener("fetch", (event) => {
  const { headers, url } = event.request;
  const isSSE = headers.get("Accept") === "text/event-stream";

  if (!isSSE) {
    return;
  }

  const sseChunkData = (data, event, retry, id) =>
    Object.entries({ event, id, data, retry })
      .filter(([, value]) => ![undefined, null].includes(value))
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n") + "\n\n";

  const sseHeaders = {
    "Content-Type": "text/event-stream",
    "Transfer-Encoding": "chunked",
    Connection: "keep-alive",
  };

  function toData(text) {
    const responseText = sseChunkData(text);
    return Uint8Array.from(responseText, (x) => x.charCodeAt(0));
  }

  const stream = new ReadableStream({
    start: (controller) => {
      let i = 0;
      function emitEvent() {
        if (++i < 10) {
          controller.enqueue(toData(`Event ${i}: ${url}`));
          setTimeout(emitEvent, 1000);
        }
      }
      emitEvent();
    },
  });
  const response = new Response(stream, { headers: sseHeaders });

  event.respondWith(response);
});

self.addEventListener("install", (e) => e.waitUntil(self.skipWaiting()));
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
