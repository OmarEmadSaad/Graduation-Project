import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Services from "../pages/Services";
import Contcat from "../pages/Contcat";
import DoctorDetails from "../pages/Doctors/DoctorDetails";
import Doctors from "../pages/Doctors/Doctors";
import { Routes, Route } from "react-router-dom";
import MyAccount from "../Dashboard/user-account/MyAccount";
import Dashboard from "../Dashboard/doctor-account/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import ServicesDetails from "../pages/ServicesDetails";
import FindLocation from "../pages/FindLocation";
import Profile from "../Dashboard/admin-account/Profile";
import Appointments from "../Dashboard/admin-account/Appointments";
import Patients from "../Dashboard/admin-account/Patients";
import DoctorsEdite from "../Dashboard/admin-account/DoctorsEdite";
import AllServices from "../Dashboard/admin-account/AllServices";
import ServiceEdit from "../Dashboard/admin-account/ServiceEdit";
import ServiceAdd from "../Dashboard/admin-account/ServiceAdd";
import NotFound from "../pages/NotFound";

const Routers = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/contcat" element={<Contcat />} />
        <Route path="/doctors/:id" element={<DoctorDetails />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services-details" element={<ServicesDetails />} />
        <Route path="/find-location" element={<FindLocation />} />

        <Route
          path="/users/profile/me"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <MyAccount />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/profile/me"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <MyAccount />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctors/profile/me"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profile/me"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Appointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patients"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Patients />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctors-edite"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DoctorsEdite />
            </ProtectedRoute>
          }
        />
        <Route
          path="/all-services"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AllServices />
            </ProtectedRoute>
          }
        />
        <Route
          path="/services/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ServiceEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/services/add"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ServiceAdd />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default Routers;
