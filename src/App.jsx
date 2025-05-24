import { useEffect } from "react";
import Layout from "./layout/Layout";
import "./App.css";

const App = () => {
  const loadDriftScript = () => {
    if (!window.drift) {
      console.log("Loading Drift script..."); // تصحيح
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
              o.type = "text/javascript";
              o.async = true;
              o.crossorigin = "anonymous";
              o.src = "https://js.driftt.com/include/" + n + "/" + t + ".js";
              o.onerror = () => {
                console.error("Failed to load Drift script"); // تصحيح: خطأ تحميل
              };
              o.onload = () => {
                console.log("Drift script loaded successfully"); // تصحيح: نجاح
              };
              var i = document.getElementsByTagName("script")[0];
              i.parentNode.insertBefore(o, i);
            });
        }
      })();
      window.drift.SNIPPET_VERSION = "0.3.1";
      window.drift.load("dzuguuxtz63t");
    } else {
      console.log("Drift already loaded"); // تصحيح
    }
  };

  const checkDriftVisibility = () => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    console.log("Checking localStorage:", { role, token, userId }); // تصحيح

    const shouldShow =
      role &&
      token &&
      userId &&
      role !== "null" &&
      token !== "null" &&
      userId !== "null";

    console.log("shouldShow:", shouldShow); // تصحيح

    // اختبار: إظهار الشات دايمًا مؤقتًا
    if (window.drift) {
      window.drift.config({
        mobileOptimized: true, // تحسين الموبايل
        enableChatTargeting: true, // استهداف الشات
      });

      window.drift.on("ready", (api) => {
        console.log("Drift ready, showing widget"); // تصحيح
        api.widget.show(); // إظهار الشات دايمًا كاختبار
      });
    } else {
      console.log("Drift not available yet"); // تصحيح
    }
  };

  useEffect(() => {
    loadDriftScript(); // تحميل السكربت أولاً
    checkDriftVisibility();

    const handleStorageChange = () => {
      console.log("Storage change detected"); // تصحيح
      checkDriftVisibility();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("customStorageChange", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
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
