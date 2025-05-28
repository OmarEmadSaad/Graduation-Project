export const BASE_URL = "https://rhetorical-periwinkle-puck.glitch.me/";
export const User_URL = `${BASE_URL}/users`;
export const Doctor_URL = `${BASE_URL}/doctors`;
export const Admin_URL = `${BASE_URL}/admin`;

const upload_preset = import.meta.env.VITE_UPLOAD_PRESET;
const cloud_name = import.meta.env.VITE_CLOUD_NAME;

const uploadImageToCloudinary = async (file) => {
  const uploadData = new FormData();
  uploadData.append("file", file);
  uploadData.append("upload_preset", upload_preset);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
      {
        method: "POST",
        body: uploadData,
      }
    );

    const res = await response.json();

    if (!res.secure_url) {
      throw new Error("Failed to upload image. No secure URL found.");
    }

    return res.secure_url;
  } catch (error) {
    console.error("Upload error:", error);
    throw new Error("Failed to upload image");
  }
};

const updateUserPhotoInDB = async (userId, imageUrl, userType) => {
  let urlToUse;

  if (userType === "patient") {
    urlToUse = User_URL;
  } else if (userType === "doctor") {
    urlToUse = Doctor_URL;
  } else if (userType === "admin") {
    urlToUse = Admin_URL;
  } else {
    throw new Error("Invalid user type");
  }

  try {
    const res = await fetch(`${urlToUse}/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ photo: imageUrl }),
    });

    if (!res.ok) {
      throw new Error(`Failed to update ${userType} photo in the database`);
    }

    const updatedUser = await res.json();
    return updatedUser;
  } catch (error) {
    console.error(`Error updating ${userType} photo:`, error.message);
    throw error;
  }
};

export { updateUserPhotoInDB };
export default uploadImageToCloudinary;
