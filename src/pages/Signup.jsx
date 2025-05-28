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
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    photo: "",
    specialization: "",
  });
  const [emailExists, setEmailExists] = useState(false);

  const navigate = useNavigate();

  const validate = () => {
    let isValid = true;
    let newErrors = {
      name: "",
      email: "",
      password: "",
      gender: "",
      photo: "",
      specialization: "",
    };

    // Name validation: 3-15 characters, letters and numbers only
    if (!/^[a-zA-Z0-9\s]{3,15}$/.test(formData.name.trim())) {
      newErrors.name =
        "Name must be 3-15 characters long and contain only letters, numbers, or spaces.";
      isValid = false;
    }

    // Email validation: valid email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    // Password validation: at least 8 characters, with uppercase, lowercase, and number
    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(formData.password.trim())
    ) {
      newErrors.password =
        "Password must be at least 8 characters long and contain an uppercase letter, a lowercase letter, and a number.";
      isValid = false;
    }

    // Gender validation
    if (!formData.gender) {
      newErrors.gender = "Please select your gender.";
      isValid = false;
    }

    // Photo validation
    if (!formData.photo) {
      newErrors.photo = "Please upload a profile photo.";
      isValid = false;
    }

    // Specialization validation for doctors
    if (formData.role === "doctor" && !formData.specialization.trim()) {
      newErrors.specialization = "Specialization is required for doctors.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const checkEmailExists = async (email) => {
    try {
      const urlToUse =
        formData.role === "patient"
          ? User_URL
          : formData.role === "doctor"
          ? doctor_URL
          : admin_URL;
      const res = await fetch(urlToUse);
      if (!res.ok) {
        throw new Error(
          `Failed to fetch ${formData.role} data: ${res.statusText}`
        );
      }
      const data = await res.json();
      const foundUser = data.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      setEmailExists(!!foundUser);
      return !!foundUser;
    } catch (error) {
      console.error("Error checking email:", error);
      toast.error("Error checking email availability. Please try again.");
      return false;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Check email existence on email input change
    if (name === "email" && value.trim()) {
      checkEmailExists(value);
    }

    // Clear error for the field being edited
    setErrors({ ...errors, [name]: "" });
  };

  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      toast.error("Please upload a JPG or PNG image");
      return;
    }

    try {
      const imageUrl = await uploadImageToCloudinary(file);
      setPreviewURL(imageUrl);
      setSelectedFile(imageUrl);
      setFormData({ ...formData, photo: imageUrl });
      setErrors({ ...errors, photo: "" });
      toast.success("Photo uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image. Please try again.");
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    // Validate form data
    if (!validate()) {
      setLoading(false);
      toast.error("Please fix the errors in the form.");
      return;
    }

    // Final email existence check
    const isEmailTaken = await checkEmailExists(formData.email.trim());
    if (isEmailTaken) {
      setErrors((prev) => ({
        ...prev,
        email: "This email is already registered.",
      }));
      setEmailExists(true);
      setLoading(false);
      toast.error("Email is already registered. Please use a different email.");
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

      // Send POST request to register user
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

      // Save user data to localStorage
      localStorage.setItem("userId", data.id);
      localStorage.setItem("role", formData.role);

      // Update photo in database
      await updateUserPhotoInDB(data.id, formData.photo, formData.role);

      setLoading(false);
      toast.success(
        `${
          formData.role.charAt(0).toUpperCase() + formData.role.slice(1)
        } registered successfully!`,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error);
      let errorMessage = "Something went wrong. Please try again.";
      if (error.message.includes("email")) {
        errorMessage = "This email is already registered.";
        setErrors((prev) => ({ ...prev, email: errorMessage }));
        setEmailExists(true);
      }
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
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
                  className="w-full px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none text-[16px] leading-7 focus:border-b-primaryColor text-headingColor placeholder:text-textColor rounded-md"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div className="mb-5 mt-4">
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none text-[16px] leading-7 focus:border-b-primaryColor text-headingColor placeholder:text-textColor rounded-md"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
                {emailExists && (
                  <p className="text-red-500 text-sm mt-1">
                    This email is already registered.
                  </p>
                )}
              </div>

              <div className="mb-5 mt-4">
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none text-[16px] leading-7 focus:border-b-primaryColor text-headingColor placeholder:text-textColor rounded-md"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
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
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
              )}

              {formData.role === "doctor" && (
                <div className="mb-5">
                  <input
                    name="specialization"
                    type="text"
                    placeholder="Enter your specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none text-[16px] leading-7 focus:border-b-primaryColor text-headingColor placeholder:text-textColor rounded-md"
                  />
                  {errors.specialization && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.specialization}
                    </p>
                  )}
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
              {errors.photo && (
                <p className="text-red-500 text-sm mt-1">{errors.photo}</p>
              )}

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
