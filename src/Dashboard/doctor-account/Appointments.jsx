import { useState, useEffect } from "react";
import { formateDate } from "../../utils/formateData";
import Swal from "sweetalert2";
import { BASE_URL } from "../../config";
import Loading from "../../Components/Loader/Loading";
import Error from "../../Components/Error/Error";
import UseFetchDate from "../../hooks/UseFetchDate";

const Appointments = () => {
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  const {
    data: appointments,
    loading,
    error,
  } = UseFetchDate(`${BASE_URL}/appointments`);

  const [localAppointments, setLocalAppointments] = useState([]);

  useEffect(() => {
    if (appointments) {
      setLocalAppointments(appointments);
    }
  }, [appointments]);

  if (!role || !userId) {
    return (
      <div className="text-center py-6 text-red-600">
        Please log in or ensure user data is available
      </div>
    );
  }

  if (loading && !error) {
    return <Loading />;
  }

  if (error && !loading) {
    return <Error errMessage={error || "Failed to fetch appointments"} />;
  }

  if (!localAppointments || localAppointments.length === 0) {
    return (
      <div className="text-center py-6 text-red-600">
        No appointments received from API. Please check data source.
      </div>
    );
  }

  const filteredAppointments = localAppointments.filter((appointment) => {
    if (role === "doctor") {
      const doctorId =
        appointment.doctorId || (appointment.doctor && appointment.doctor.id);
      return doctorId === userId && appointment.state === "un";
    }
    if (role === "patient") {
      return appointment.user.id === userId;
    }
    return true;
  });

  const handleComplete = async (appointmentId) => {
    const result = await Swal.fire({
      title: "Confirm Visit",
      text: "Are you sure this appointment has been completed?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, confirm",
      cancelButtonText: "No, cancel",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `${BASE_URL}/appointments/${appointmentId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${
                localStorage.getItem("token") || "dummy-token"
              }`,
            },
            body: JSON.stringify({
              state: "done",
              isCompleted: true,
            }),
          }
        );

        if (response.ok) {
          Swal.fire({
            title: "Completed!",
            text: "The appointment has been marked as completed.",
            icon: "success",
            confirmButtonColor: "#3085d6",
          });
          setLocalAppointments(
            localAppointments.filter(
              (appointment) => appointment.id !== appointmentId
            )
          );
        } else {
          throw new Error(`Failed to update appointment: ${response.status}`);
        }
      } catch (error) {
        console.error("Error in handleComplete:", error);
        Swal.fire({
          title: "Error!",
          text: error.message || "Something went wrong. Please try again.",
          icon: "error",
          confirmButtonColor: "#d33",
        });
      }
    }
  };

  const handleDelete = async (appointmentId) => {
    const result = await Swal.fire({
      title: "Cancel Appointment",
      text: "Are you sure you want to Cancel this appointment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `${BASE_URL}/appointments/${appointmentId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${
                localStorage.getItem("token") || "dummy-token"
              }`,
            },
            body: JSON.stringify({
              state: "not come",
              isCompleted: false,
            }),
          }
        );

        if (response.ok) {
          Swal.fire({
            title: "Updated!",
            text: "The appointment has been marked as 'not come'.",
            icon: "success",
            confirmButtonColor: "#3085d6",
          });
          setLocalAppointments(
            localAppointments.filter(
              (appointment) => appointment.id !== appointmentId
            )
          );
        } else {
          throw new Error(`Failed to update appointment: ${response.status}`);
        }
      } catch (error) {
        console.error("Error in handleDelete:", error);
        Swal.fire({
          title: "Error!",
          text: error.message || "Something went wrong. Please try again.",
          icon: "error",
          confirmButtonColor: "#d33",
        });
      }
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[1000px] sm:min-w-[110%]">
        <table className="w-full table-auto text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Gender</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 sm:px-2 py-3">Booked on</th>
              <th className="px-4 py-3 sm:text-center text-center pr-[2em] sm:pr-0">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((items) => (
                <tr key={items.id}>
                  <td className="px-4 py-4 whitespace-nowrap flex items-center">
                    <img
                      src={items.user.photo}
                      alt=""
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">
                        {items.user.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {items.user.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">{items.user.gender}</td>
                  <td className="px-4 py-4">
                    {items.isPaid ? (
                      <span className="flex items-center text-yellow-600">
                        <span className="w-2.5 h-2.5 bg-yellow-500 rounded-full mr-2"></span>
                        Waiting
                      </span>
                    ) : (
                      <span className="flex items-center text-red-600">
                        <span className="w-2.5 h-2.5 bg-red-500 rounded-full mr-2"></span>
                        Unpaid
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4">{items.ticketPrice}</td>
                  <td className="px-4 sm:px-0 py-4">
                    {formateDate(items.createdAt)}
                  </td>
                  <td className="px-4 py-4 flex items-center space-x-2 justify-center">
                    {items.state !== "un" ? (
                      <span className="flex items-center text-green-600">
                        <span className="w-2.5 h-2.5 bg-green-500 rounded-full mr-2"></span>
                        {items.state === "done" ? "Completed" : "Not Come"}
                      </span>
                    ) : (
                      <div className="flex space-x-2 mb-5">
                        <button
                          onClick={() => handleComplete(items.id)}
                          className="bg-blue-500 hover:cursor-pointer text-white text-xs px-3 py-1 rounded whitespace-nowrap"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => handleDelete(items.id)}
                          className="bg-red-500 hover:cursor-pointer text-white text-xs px-3 py-1 rounded whitespace-nowrap"
                        >
                          Not Come
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center px-4 py-6">
                  No appointments available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Appointments;
