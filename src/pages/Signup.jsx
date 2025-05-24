import SignupImg from "../assets/images/signup.gif";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import uploadImageToCloudinary from "../utils/uploadCloudinary";
import { updateUserPhotoInDB } from "../utils/uploadCloudinary";
import { User_URL, doctor_URL, admin_URL } from "../config";
import { toast } from "react-toastify";
import HashLoader from "react-spinners/HashLoader";

const Signup = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    photo: "",
    gender: "",
    role: "patient",
    specialization: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const imageUrl = await uploadImageToCloudinary(file);
      setPreviewURL(imageUrl);
      setSelectedFile(imageUrl);
      setFormData({ ...formData, photo: imageUrl });
    } catch (error) {
      toast.error("Failed to upload image. Please try again.");
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!formData.name.trim()) {
      toast.error("Full name is required");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    if (!formData.gender) {
      toast.error("Please select your gender");
      setLoading(false);
      return;
    }

    if (!formData.photo) {
      toast.error("Please upload a profile photo");
      setLoading(false);
      return;
    }

    if (formData.role === "doctor" && !formData.specialization.trim()) {
      toast.error("Specialization is required for doctors");
      setLoading(false);
      return;
    }

    try {
      let urlToUse;
      let dataToSend = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password.trim(),
        photo: formData.photo,
        gender: formData.gender,
      };

      if (formData.role === "patient") {
        urlToUse = User_URL;
      } else if (formData.role === "doctor") {
        urlToUse = doctor_URL;
        dataToSend.specialization = formData.specialization.trim();
        dataToSend.avgRating = 0;
        dataToSend.totalRating = 0;
        dataToSend.totalPatients = 0;
        dataToSend.hospital = "Not specified";
      } else if (formData.role === "admin") {
        urlToUse = admin_URL;
      } else {
        throw new Error("Invalid role");
      }

      const res = await fetch(urlToUse, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || `Failed to register ${formData.role}.`);
      }

      localStorage.setItem("userId", data.id);
      localStorage.setItem("role", formData.role);

      await updateUserPhotoInDB(data.id, formData.photo, formData.role);

      setLoading(false);
      toast.success(`${formData.role} registered successfully!`);
      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error.message || "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <section className="px-5 xl:px-0">
      <div className="mx-auto max-w-[1170px]">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="hidden lg:block bg-primaryColor rounded-l-lg">
            <figure className="rounded-l-lg">
              <img
                src={SignupImg}
                className="w-full rounded-l-lg"
                alt="Signup"
              />
            </figure>
          </div>

          <div className="rounded-l-lg lg:pl-16 py-10">
            <h3 className="text-headingColor text-[22px] leading-9 mb-10">
              Create an <span className="text-primaryColor">account</span>
            </h3>

            <form onSubmit={submitHandler}>
              <div className="mb-5">
                <input
                  name="name"
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none text-[16px] leading-7 focus:border-b-primaryColor text-headingColor placeholder:text-textColor rounded-md"
                />
              </div>

              <div className="mb-5 mt-4">
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none text-[16px] leading-7 focus:border-b-primaryColor text-headingColor placeholder:text-textColor rounded-md"
                />
              </div>

              <div className="mb-5 mt-4">
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none text-[16px] leading-7 focus:border-b-primaryColor text-headingColor placeholder:text-textColor rounded-md"
                />
              </div>

              <div className="mb-5 flex justify-between">
                <label className="text-headingColor font-bold text-[16px] leading-7">
                  Are you a:
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="text-headingColor text-[15px] font-semibold leading-7 px-4 py-3 focus:outline-none"
                  >
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                  </select>
                </label>

                <label className="text-headingColor font-bold text-[16px] leading-7">
                  Gender:
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="text-headingColor text-[15px] font-semibold leading-7 px-4 py-3 focus:outline-none"
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </label>
              </div>

              {formData.role === "doctor" && (
                <div className="mb-5">
                  <input
                    name="specialization"
                    type="text"
                    placeholder="Enter your specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none text-[16px] leading-7 focus:border-b-primaryColor text-headingColor placeholder:text-textColor rounded-md"
                  />
                </div>
              )}

              <div className="mb-5 gap-3 flex items-center">
                {selectedFile && previewURL && (
                  <figure className="w-[60px] h-[60px] rounded-full border-2 border-primaryColor flex items-center justify-center">
                    <img
                      src={previewURL}
                      className="rounded-full w-full"
                      alt="Avatar"
                    />
                  </figure>
                )}

                <div className="relative h-[50px] w-[130px]">
                  <input
                    type="file"
                    name="photo"
                    id="customFile"
                    onChange={handleFileInputChange}
                    accept=".jpg, .png"
                    className="hidden"
                  />
                  <label
                    htmlFor="customFile"
                    className="absolute top-0 left-0 w-full h-full flex items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden text-headingColor bg-[#0066ff46] font-semibold rounded-lg truncate cursor-pointer"
                  >
                    Upload Photo
                  </label>
                </div>
              </div>

              <div className="mt-7">
                <button
                  disabled={loading}
                  className="w-full btn btn-accent text-white bg-blue-600"
                  type="submit"
                >
                  {loading ? (
                    <HashLoader size={35} color="#ffffff" />
                  ) : (
                    "Register"
                  )}
                </button>
              </div>

              <p className="mt-3">
                Already have an account?
                <Link
                  to="/login"
                  className="text-primaryColor font-medium ml-1"
                >
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
