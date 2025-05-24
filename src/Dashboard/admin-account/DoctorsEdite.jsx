import { useEffect, useState } from "react";
import axios from "axios";
import { doctor_URL } from "../../config";
import Swal from "sweetalert2";

const DoctorsEdite = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    axios
      .get(doctor_URL)
      .then((res) => {
        setDoctors(res.data);
      })
      .catch((err) => console.error("Error fetching doctors:", err));
  }, []);

  const handleDelete = async (event, id, name) => {
    event.preventDefault();
    console.log(`Initiating delete for doctor: ${name} (ID: ${id})`);

    const result = await Swal.fire({
      title: "Confirm Deletion",
      text: `Are you sure you want to delete ${name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete!",
      cancelButtonText: "Cancel",
      allowOutsideClick: false,
      allowEscapeKey: false,
    });

    if (!result.isConfirmed) {
      console.log("Deletion cancelled for doctor:", name);
      return;
    }

    try {
      console.log(`Deleting doctor ${id} from ${doctor_URL}/${id}...`);
      const response = await axios.delete(`${doctor_URL}/${id}`);
      console.log("Delete response status:", response.status);

      if (response.status >= 300 && response.status < 400) {
        console.warn("Redirect detected in DELETE request:", response.status);
        throw new Error("Unexpected redirect from server");
      }

      setDoctors((prev) => prev.filter((doctor) => doctor.id !== id));
      console.log(`Doctor ${name} deleted successfully.`);
      Swal.fire({
        title: "Deleted!",
        text: `${name} has been deleted.`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Delete error:", error);
      Swal.fire({
        title: "Error!",
        text: `Failed to delete ${name}: ${error.message}`,
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-blue-400">
        Doctors Management
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Photo</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Gender</th>
              <th className="py-2 px-4 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr key={doctor.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{doctor.id}</td>
                <td className="py-2 px-4 border-b">
                  <img
                    src={doctor.photo}
                    alt={doctor.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </td>
                <td className="py-2 px-4 border-b">{doctor.name}</td>
                <td className="py-2 px-4 border-b">{doctor.email}</td>
                <td className="py-2 px-4 border-b">{doctor.gender || "N/A"}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={(e) => handleDelete(e, doctor.id, doctor.name)}
                    className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded hover:cursor-pointer"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {doctors.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No doctors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorsEdite;
