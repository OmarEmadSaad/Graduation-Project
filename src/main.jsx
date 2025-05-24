import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContextProvider } from "./context/AuthContext.jsx";
createRoot(document.getElementById("root")).render(
  <>
    <BrowserRouter>
      <AuthContextProvider>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100vh",
            margin: 0,
            padding: 0,
          }}
        >
          <App />
        </div>
      </AuthContextProvider>
    </BrowserRouter>
    <ToastContainer
      theme="dark"
      autoClose={3000}
      position="top-right"
      closeOnClick
      pauseOnHover={false}
      newestOnTop
      style={{
        margin: 0,
        padding: 0,
        position: "fixed",
        top: 0,
        right: 0,
        zIndex: 9999,
      }}
    />
  </>
);
