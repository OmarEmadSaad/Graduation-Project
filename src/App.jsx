import { useEffect, useState } from "react";
import Layout from "./layout/Layout";
import "./App.css";

const App = () => {
  const [isDriftVisible, setIsDriftVisible] = useState(false);

  const checkDriftVisibility = () => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    const shouldShow =
      role &&
      token &&
      userId &&
      role !== "null" &&
      token !== "null" &&
      userId !== "null";

    setIsDriftVisible(shouldShow);

    if (shouldShow && !window.drift) {
      // Load Drift if not already loaded
      ("use strict");
      !(function () {
        var t = (window.drift = window.drift || []);
        if (!t.init) {
          if (t.invoked) return;
          (t.invoked = !0),
            (t.methods = [
              "identify",
              "config",
              "track",
              "reset",
              "debug",
              "show",
              "ping",
              "page",
              "hide",
              "off",
              "on",
            ]),
            (t.factory = function (e) {
              return function () {
                var n = Array.prototype.slice.call(arguments);
                return n.unshift(e), t.push(n), t;
              };
            }),
            t.methods.forEach(function (e) {
              t[e] = t.factory(e);
            }),
            (t.load = function (t) {
              var e = 3e5,
                n = Math.ceil(new Date() / e) * e,
                o = document.createElement("script");
              (o.type = "text/javascript"),
                (o.async = !0),
                (o.crossorigin = "anonymous"),
                (o.src =
                  "https://js.driftt.com/include/" + n + "/" + t + ".js");
              var i = document.getElementsByTagName("script")[0];
              i.parentNode.insertBefore(o, i);
            });
        }
      })();
      window.drift.SNIPPET_VERSION = "0.3.1";
      window.drift.load("dzuguuxtz63t");
    }

    if (window.drift) {
      window.drift.on("ready", (api) => {
        if (shouldShow) {
          api.widget.show();
        } else {
          api.widget.hide();
        }
      });
    }
  };

  useEffect(() => {
    checkDriftVisibility();

    const handleStorageChange = () => {
      checkDriftVisibility();
    };

    window.addEventListener("customStorageChange", handleStorageChange);

    return () => {
      window.removeEventListener("customStorageChange", handleStorageChange);
    };
  }, []);

  return (
    <div>
      <Layout />
    </div>
  );
};

export default App;
