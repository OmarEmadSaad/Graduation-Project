import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User_URL, doctor_URL, admin_URL } from "../config";
import { toast } from "react-toastify";
import { authContext } from "../context/AuthContext.jsx";
import HashLoader from "react-spinners/HashLoader.js";

const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
    role: "patient",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { dispatch } = useContext(authContext);

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let urlToUse;
      if (user.role === "patient") {
        urlToUse = User_URL;
      } else if (user.role === "doctor") {
        urlToUse = doctor_URL;
      } else if (user.role === "admin") {
        urlToUse = admin_URL;
      } else {
        throw new Error("Invalid role");
      }

      const trimmedEmail = user.email.trim();
      const trimmedPassword = user.password.trim();

      const requestUrl = `${urlToUse}?email=${encodeURIComponent(
        trimmedEmail
      )}`;

      const res = await fetch(requestUrl);

      if (!res.ok) {
        const message = await res.text();
        throw new Error(message || "Network error");
      }

      const users = await res.json();

      if (users.length === 0) {
        throw new Error("User not found");
      }

      const matchedUser = users.find(
        (u) => u.email && u.email === trimmedEmail
      );

      if (!matchedUser) {
        throw new Error("User not found with matching email");
      }

      if (!matchedUser.password) {
        throw new Error(
          "Password not found for this user. Please re-register."
        );
      }

      if (matchedUser.password !== trimmedPassword) {
        throw new Error("Incorrect password");
      }

      localStorage.setItem("token", "dummy-token");
      localStorage.setItem("role", matchedUser.role || user.role);
      localStorage.setItem("userId", matchedUser.id);

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user: matchedUser,
          token: "dummy-token",
          role: matchedUser.role || user.role,
        },
      });

      window.dispatchEvent(new Event("customStorageChange"));

      toast.success("Logged in successfully!");
      navigate("/home");
    } catch (err) {
      console.error("Login error:", err.message);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-5 lg:px-0 text-center">
      <div className="w-full max-w-[570px] mx-auto rounded-lg shadow-md md:p-10">
        <h3 className="text-headingColor text-[22px] leading-9 font-bold mb-10">
          Hello <span className="text-primaryColor">Welcome👋 </span> Back 😊🎉
        </h3>

        <form className="py-4 md:py-0" onSubmit={handleLogin}>
          <div className="mb-5 text-left">
            <label className="block text-sm font-medium text-headingColor mb-1">
              Your Role
            </label>
            <select
              name="role"
              value={user.role}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none text-[16px] leading-7 focus:border-primaryColor text-headingColor placeholder:text-textColor rounded-md"
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="mb-5 text-left">
            <label className="block text-sm font-medium text-headingColor mb-1">
              Your Email
            </label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleInputChange}
              placeholder="name@mail.com"
              required
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none text-[16px] leading-7 focus:border-primaryColor text-headingColor placeholder:text-textColor rounded-md"
            />
          </div>

          <div className="mb-5 text-left">
            <label className="block text-sm font-medium text-headingColor mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleInputChange}
              placeholder="********"
              required
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none text-[16px] leading-7 focus:border-primaryColor text-headingColor placeholder:text-textColor rounded-md"
            />
          </div>

          {error && (
            <p className="text-red-500 text-left text-sm mb-2">{error}</p>
          )}

          <div className="mt-7">
            <button
              className="w-full btn btn-accent text-white bg-blue-600 py-2 rounded-md"
              type="submit"
              disabled={loading}
            >
              {loading ? <HashLoader size={25} color="#fff" /> : "Login"}
            </button>
          </div>

          <p className="mt-4">
            Do not have an account?
            <Link to="/register" className="text-primaryColor font-medium ml-1">
              Register
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Login;
