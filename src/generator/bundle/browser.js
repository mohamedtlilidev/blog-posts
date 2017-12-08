/* global ga */
import React from "react";
import { render, hydrate } from "react-dom";
import App from "../tmp/App";
import { BrowserRouter } from "react-router-dom";
import { loadComponents } from "loadable-components";
import { dispatchUpdateEvent } from "../../site/updateNotification";
import UpdateNotification from "../../site/components/UpdateNotification";

const app = [
  <BrowserRouter key="app">
    <App />
  </BrowserRouter>,
  <UpdateNotification key="service-worker" />
];

loadComponents().then(() => {
  if (process.env.NODE_ENV === "development") {
    render(app, document.getElementById("root"));
  } else {
    hydrate(app, document.getElementById("root"));
  }
});

if ("serviceWorker" in navigator) {
  if (process.env.NODE_ENV === "production") {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then(registration => {
        // Registration was successful
        registration.addEventListener("updatefound", () => {
          const installingWorker = registration.installing;
          installingWorker.addEventListener("statechange", () => {
            if (installingWorker.state === "installed") {
              if (navigator.serviceWorker.controller) {
                dispatchUpdateEvent();
              }
            }
          });
        });
      })
      .catch(err => {
        // registration failed :(
        console.log("ServiceWorker registration failed: ", err);
      });

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      window.location.reload();
    });
  } else {
    navigator.serviceWorker.getRegistration().then(registration => {
      if (registration) {
        registration.unregister();
      }
    });
  }
}

if (process.env.GA_TRACKING_ID) {
  const analyticsUrl =
    process.env.NODE_ENV === "production"
      ? "https://www.google-analytics.com/analytics.js"
      : "https://www.google-analytics.com/analytics_debug.js";

  /* eslint-disable */
  (function(i, s, o, g, r, a, m) {
    i["GoogleAnalyticsObject"] = r;
    (i[r] =
      i[r] ||
      function() {
        (i[r].q = i[r].q || []).push(arguments);
      }),
      (i[r].l = 1 * new Date());
    (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m);
  })(window, document, "script", analyticsUrl, "ga");
  /* eslint-enable */

  if (process.env.NODE_ENV !== "production") {
    ga("set", "sendHitTask", null);
  }

  ga("create", process.env.GA_TRACKING_ID, "auto");
}
