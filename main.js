async function subscribeSSE(name, el) {
  const connection = new EventSource(`/example/cdl/${name}`);

  connection.onopen = (event) => {
    console.log("SSE onopen", event);
  };

  connection.onerror = (event) => {
    console.log("SSE onerror", event);
  };

  connection.onmessage = (event) => {
    el.value = el.value + event.data + "\n";
    console.log("SSE onmessage", event);
  };

  // connection.addEventListener("message", (event) => {
  //   console.log("SSE message event", event);
  // });
}

import { fetchEventSource } from "./fech-event-source/fetch.js";

async function subscribeSSEPost(
  subscriptionName,
  body = "subscription foo {}"
) {
  const ctrl = new AbortController();

  return fetchEventSource(`/example/cdl/${subscriptionName}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: body,
    }),
    signal: ctrl.signal,
    onopen(response) {
      console.log(`SSE onopen:`, response);
    },
    onmessage(msg) {
      console.log(`SSE onmessage:`, msg);
    },
    onclose() {
      console.log(`SSE onclose`);
    },
    onerror(err) {
      console.log(`SSE onerror`, err);
    },
  });
}

window.subscribeSSE = subscribeSSE;
