import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import HashLoader from "react-spinners/HashLoader";
import { authContext } from "../../context/AuthContext";
import { BASE_URL } from "../../config";
import Swal from "sweetalert2";

const Patients = () => {
  const { userId, role, token: authToken } = useContext(authContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId || userId === "null" || userId === "") {
        toast.error("Please log in to view patients.");
        navigate("/login");
        return;
      }

      if (role !== "admin") {
        toast.error("Access denied. Admin role required.");
        navigate("/home");
        return;
      }

      setLoading(true);
      try {
        const usersRes = await fetch(`${BASE_URL}/users`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (!usersRes.ok) {
          const errorText = await usersRes.text();
          throw new Error(errorText || "Failed to fetch patients");
        }
        const usersData = await usersRes.json();

        const adminsRes = await fetch(`${BASE_URL}/admin`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (!adminsRes.ok) {
          const errorText = await adminsRes.text();
          throw new Error(errorText || "Failed to fetch admins");
        }
        const adminsData = await adminsRes.json();

        const filteredUsers = usersData.filter(
          (user) =>
            user.id !== userId && !(user.id === "1" && user.role === "admin")
        );
        const filteredAdmins = adminsData.filter(
          (admin) =>
            admin.id !== userId && !(admin.id === "1" && admin.role === "admin")
        );

        setUsers(filteredUsers);
        setAdmins(filteredAdmins);
      } catch (error) {
        toast.error("Failed to load patients: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, role, authToken, navigate]);

  const handleMakeAdmin = async (user) => {
    const result = await Swal.fire({
      title: "Confirm Promotion",
      text: `Are you sure you want to promote ${user.name} to admin?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, promote!",
      cancelButtonText: "Cancel",
      allowOutsideClick: false,
      allowEscapeKey: false,
    });

    if (!result.isConfirmed) return;

    try {
      const deleteUserRes = await fetch(`${BASE_URL}/users/${user.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!deleteUserRes.ok) {
        const errorText = await deleteUserRes.text();
        throw new Error(errorText || "Failed to remove user from patients");
      }

      const updatedUser = { ...user, role: "admin" };
      const addAdminRes = await fetch(`${BASE_URL}/admin`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });
      if (!addAdminRes.ok) {
        const errorText = await addAdminRes.text();
        throw new Error(errorText || "Failed to add user to admins");
      }

      setAdmins([...admins, updatedUser]);
      setUsers(users.filter((u) => u.id !== user.id));

      toast.success(`${user.name} has been promoted to admin`);
    } catch (error) {
      toast.error("Failed to promote user: " + error.message);
    }
  };

  const handleRemoveAdmin = async (admin) => {
    const result = await Swal.fire({
      title: "Confirm Removal",
      text: `Are you sure you want to remove ${admin.name} from admins?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove!",
      cancelButtonText: "Cancel",
      allowOutsideClick: false,
      allowEscapeKey: false,
    });

    if (!result.isConfirmed) return;

    try {
      const deleteAdminRes = await fetch(`${BASE_URL}/admin/${admin.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!deleteAdminRes.ok) {
        const errorText = await deleteAdminRes.text();
        throw new Error(errorText || "Failed to remove user from admins");
      }

      const updatedUser = { ...admin, role: "patient" };
      const addUserRes = await fetch(`${BASE_URL}/users`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });
      if (!addUserRes.ok) {
        const errorText = await addUserRes.text();
        throw new Error(errorText || "Failed to add user to patients");
      }

      setUsers([...users, updatedUser]);
      setAdmins(admins.filter((a) => a.id !== admin.id));

      toast.success(`${admin.name} has been removed from admins`);
    } catch (error) {
      toast.error("Failed to remove admin: " + error.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <HashLoader size={40} color="#0066ff" />
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold  mb-6 text-blue-500">
            All Patients
          </h1>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-headingColor">
                  <th className="py-3 px-4 text-left text-sm font-semibold">
                    ID
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold">
                    Photo
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold">
                    Name
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold">
                    Email
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold">
                    Gender
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 && admins.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-4 px-4 text-center text-textColor"
                    >
                      No patients or admins available.
                    </td>
                  </tr>
                ) : (
                  <>
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3 px-4 text-sm text-textColor">
                          {user.id}
                        </td>
                        <td className="py-3 px-4 text-sm text-textColor">
                          <img
                            src={user.photo}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        </td>
                        <td className="py-3 px-4 text-sm text-textColor">
                          {user.name}
                        </td>
                        <td className="py-3 px-4 text-sm text-textColor">
                          {user.email}
                        </td>
                        <td className="py-3 px-4 text-sm text-textColor capitalize">
                          {user.gender}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <button
                            type="button"
                            onClick={() => handleMakeAdmin(user)}
                            className=" text-white bg-blue-600 px-3 py-1.5 rounded-md text-sm hover:bg-blue-700 mr-2"
                          >
                            Make Admin
                          </button>
                        </td>
                      </tr>
                    ))}
                    {admins.map((admin) => (
                      <tr
                        key={admin.id}
                        className="border-b hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3 px-4 text-sm text-textColor">
                          {admin.id}
                        </td>
                        <td className="py-3 px-4 text-sm text-textColor">
                          <img
                            src={admin.photo}
                            alt={admin.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        </td>
                        <td className="py-3 px-4 text-sm text-textColor">
                          {admin.name} (Admin)
                        </td>
                        <td className="py-3 px-4 text-sm text-textColor">
                          {admin.email}
                        </td>
                        <td className="py-3 px-4 text-sm text-textColor capitalize">
                          {admin.gender}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <button
                            type="button"
                            onClick={() => handleRemoveAdmin(admin)}
                            className=" text-white bg-red-600 px-3 py-1.5 rounded-md text-sm hover:bg-red-700"
                          >
                            Remove Admin
                          </button>
                        </td>
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Patients;
