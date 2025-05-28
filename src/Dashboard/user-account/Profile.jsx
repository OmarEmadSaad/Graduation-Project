import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import uploadImageToCloudinary from "../../utils/uploadCloudinary";
import { BASE_URL, token } from "../../config";
import { toast } from "react-toastify";
import HashLoader from "react-spinners/HashLoader";
import { authContext } from "../../context/AuthContext";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Profile = () => {
  const { user, userId } = useContext(authContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    photo: null,
    gender: "",
    bloodType: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatientData = async () => {
      if (!userId || userId === "null" || userId === "") {
        console.warn("userId missing:", { user, userId });
        toast.error("Please log in to view your profile", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }

      try {
        const res = await fetch(`${BASE_URL}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch patient data");
        }

        setFormData({
          name: data.name || "",
          email: data.email || "",
          password: data.password || "",
          photo: data.photo || null,
          gender: data.gender || "",
          bloodType: data.bloodType || "",
        });
        setPreviewURL(data.photo || "");
      } catch (error) {
        console.error("Error fetching patient data:", error);
        toast.error("Failed to load patient data: " + error.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    };

    fetchPatientData();
  }, [userId]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      toast.error("Please upload a JPG or PNG image", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    setLoading(true);
    const preview = URL.createObjectURL(file);
    setPreviewURL(preview);
    setSelectedFile(file);

    try {
      const data = await uploadImageToCloudinary(file);

      const imageUrl = typeof data === "string" ? data : data.url;
      if (!imageUrl) {
        throw new Error("Invalid Cloudinary response: URL missing");
      }
      setFormData((prevFormData) => ({
        ...prevFormData,
        photo: imageUrl,
      }));
      setPreviewURL(imageUrl);
      toast.success("Photo uploaded successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast.error("Failed to upload photo: " + error.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setPreviewURL(formData.photo || "");
      setSelectedFile(null);
    } finally {
      setLoading(false);
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const resCurrent = await fetch(`${BASE_URL}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const currentData = await resCurrent.json();
      if (!resCurrent.ok) {
        throw new Error(currentData.message || "Failed to fetch current data");
      }

      const payload = { ...currentData };

      if (formData.name && formData.name.trim() !== currentData.name) {
        payload.name = formData.name.trim();
      }
      if (formData.email && formData.email.trim() !== currentData.email) {
        payload.email = formData.email.trim();
      }
      if (formData.password && formData.password.trim()) {
        payload.password = formData.password.trim();
      }
      if (formData.photo && formData.photo !== currentData.photo) {
        payload.photo = formData.photo;
      }
      if (formData.gender && formData.gender !== currentData.gender) {
        payload.gender = formData.gender;
      }
      if (
        formData.bloodType &&
        formData.bloodType.trim() !== currentData.bloodType
      ) {
        payload.bloodType = formData.bloodType.trim();
      }

      if (
        Object.keys(payload).every((key) => payload[key] === currentData[key])
      ) {
        toast.info("No changes made", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setLoading(false);
        return;
      }

      const res = await fetch(`${BASE_URL}/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      toast.success(data.message || "Profile updated successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate("/users/profile/me");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="mt-10">
      <form onSubmit={submitHandler}>
        <div className="mb-5">
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full pr-4 px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none text-[16px] leading-7
            focus:border-b-primaryColor text-headingColor placeholder:text-textColor rounded-md cursor-pointer"
          />
        </div>

        <div className="mb-5">
          <input
            name="email"
            type="email"
            placeholder="Enter your Email"
            value={formData.email}
            readOnly
            className="w-full pr-4 px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none text-[16px] leading-7
            focus:border-b-primaryColor text-headingColor placeholder:text-textColor rounded-md cursor-not-allowed"
          />
        </div>

        <div className="mb-5 relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full pr-10 px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none text-[16px] leading-7
            focus:border-b-primaryColor text-headingColor placeholder:text-textColor rounded-md cursor-pointer"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[20px] text-headingColor"
          >
            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </button>
        </div>

        <div className="mb-5">
          <input
            name="bloodType"
            type="text"
            placeholder="Blood Type"
            value={formData.bloodType}
            onChange={handleInputChange}
            className="w-full pr-4 px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none text-[16px] leading-7
            focus:border-b-primaryColor text-headingColor placeholder:text-textColor rounded-md cursor-pointer"
          />
        </div>

        <div className="mb-5 flex justify-between">
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

        <div className="mb-5 flex items-center gap-3">
          {(selectedFile || formData.photo) && previewURL && (
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
              accept=".jpg,.png"
              className="hidden"
            />
            <label
              htmlFor="customFile"
              className="absolute top-0 left-0 w-full h-full flex items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 
              overflow-hidden text-headingColor bg-[#0066ff46] font-semibold rounded-lg truncate cursor-pointer"
            >
              {loading ? (
                <HashLoader size={25} color="#0066ff" />
              ) : selectedFile ? (
                "Change Photo"
              ) : (
                "Upload Photo"
              )}
            </label>
          </div>
        </div>

        <div className="mt-7">
          <button
            disabled={loading}
            className="w-full btn btn-accent text-white bg-blue-600"
            type="submit"
          >
            {loading ? <HashLoader size={25} color="#ffffff" /> : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
