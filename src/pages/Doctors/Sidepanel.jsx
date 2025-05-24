import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL, token } from "../../config";
import convertTime from "../../utils/convertTime";
import { v4 as uuidv4 } from "uuid";

const Sidepanel = ({
  doctorId,
  ticketPrice,
  timeSlots,
  doctorName,
  doctorPhoto,
}) => {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [userData, setUserData] = useState(null);
  const [doctorPhone, setDoctorPhone] = useState(null);
  const [doctorNameFromFetch, setDoctorNameFromFetch] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId || userId === "null" || userId === "") {
        toast.error("Please log in to book an appointment");
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
          throw new Error(data.message || "Failed to fetch user data");
        }
        setUserData({
          id: data.id,
          name: data.name,
          email: data.email,
          photo:
            data.photo ||
            "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg",
          gender: data.gender || "Unknown",
        });
      } catch (err) {
        toast.error(err.message);
      }
    };

    fetchUserData();
  }, [userId]);

  useEffect(() => {
    const fetchDoctorPhone = async () => {
      try {
        const res = await fetch(`${BASE_URL}/doctors/${doctorId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch doctor data");
        }
        setDoctorPhone(data.phone || "Not available");
        setDoctorNameFromFetch(data.name || "Unknown Doctor");
      } catch (err) {
        toast.error(err.message);
      }
    };

    fetchDoctorPhone();
  }, [doctorId]);

  const calculateExpectedTime = (startTime, queueNumber) => {
    if (!startTime || !startTime.includes(":")) {
      console.error("Invalid startTime:", startTime);
      return "Not specified";
    }

    let timeStr = startTime.trim();
    let isPM = timeStr.toLowerCase().includes("pm");
    timeStr = timeStr.replace(/( AM| PM)/i, "").trim();

    const [hoursStr, minutesStr] = timeStr.split(":");
    let hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10) || 0;

    if (isNaN(hours) || isNaN(minutes)) {
      console.error("Invalid time format:", startTime);
      return "Not specified";
    }

    if (isPM && hours !== 12) {
      hours += 12;
    } else if (!isPM && hours === 12) {
      hours = 0;
    }

    const startMinutes = hours * 60 + minutes;
    const totalMinutes = startMinutes + queueNumber * 15;

    const expectedHours = Math.floor(totalMinutes / 60) % 24;
    const expectedMinutes = totalMinutes % 60;
    const period = expectedHours >= 12 ? "PM" : "AM";
    const formattedHours = expectedHours % 12 || 12;

    return `${formattedHours}:${expectedMinutes
      .toString()
      .padStart(2, "0")} ${period}`;
  };

  const validateTimeSlot = (selectedSlot, timeSlots) => {
    if (!selectedSlot) {
      return { isValid: false, error: "Please select a time slot." };
    }

    const slotParts = selectedSlot.split(": ");
    if (slotParts.length < 2) {
      return { isValid: false, error: "Invalid time slot format." };
    }

    const day = slotParts[0].toLowerCase();
    const timeRange = slotParts[1];
    const timeMatch = timeRange.match(/(\d{1,2}:\d{2} [AP]M)/i);
    if (!timeMatch) {
      return { isValid: false, error: "Invalid time format in slot." };
    }
    const startTime = timeMatch[0];

    const matchingSlot = timeSlots.find(
      (slot) => slot.day.toLowerCase() === day
    );
    if (!matchingSlot) {
      return {
        isValid: false,
        error: "The doctor is on leave on this day.",
      };
    }

    const convertTo24Hour = (timeStr) => {
      let time = timeStr.replace(/( AM| PM)/i, "").trim();
      let isPM = timeStr.toLowerCase().includes("pm");
      let [hours, minutes] = time.split(":").map(Number);
      if (isPM && hours !== 12) hours += 12;
      if (!isPM && hours === 12) hours = 0;
      return hours * 60 + (minutes || 0);
    };

    const selectedStartMinutes = convertTo24Hour(startTime);
    const slotStartMinutes = convertTo24Hour(
      convertTime(matchingSlot.startingTime)
    );
    const slotEndMinutes = convertTo24Hour(
      convertTime(matchingSlot.endingTime)
    );

    if (
      selectedStartMinutes < slotStartMinutes ||
      selectedStartMinutes >= slotEndMinutes
    ) {
      return {
        isValid: false,
        error: "The selected time is outside the doctor's working hours.",
      };
    }

    const today = new Date();
    const daysOfWeek = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const selectedDayIndex = daysOfWeek.indexOf(day);
    const currentDayIndex = today.getDay();
    const daysUntilSelected = (selectedDayIndex - currentDayIndex + 7) % 7;

    if (daysUntilSelected < 0) {
      return {
        isValid: false,
        error: "Cannot book appointments in the past.",
      };
    }

    return { isValid: true };
  };

  const bookingHandler = async () => {
    if (!token || !userId || userId === "null" || userId === "") {
      toast.error("Please log in to book an appointment");
      return;
    }

    if (!userData) {
      toast.error("User data not loaded. Please try again.");
      return;
    }

    const validation = validateTimeSlot(selectedTimeSlot, timeSlots);
    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    setLoading(true);

    try {
      const resAppointments = await fetch(`${BASE_URL}/appointments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!resAppointments.ok) {
        throw new Error("Failed to fetch existing appointments");
      }

      const appointments = await resAppointments.json();
      const matchingAppointments = appointments.filter(
        (app) => app.doctorId === doctorId && app.timeSlot === selectedTimeSlot
      );

      const queueNumber = matchingAppointments.length + 1;

      const startTimeMatch = selectedTimeSlot.match(/(\d{1,2}:\d{2} [AP]M)/i);
      const startTime = startTimeMatch ? startTimeMatch[0] : null;

      if (!startTime) {
        throw new Error("Invalid time slot format");
      }

      const expectedTime = calculateExpectedTime(startTime, queueNumber);

      const finalDoctorName =
        doctorName || doctorNameFromFetch || "Unknown Doctor";

      const newAppointment = {
        id: `app${Date.now()}${uuidv4().slice(0, 8)}`,
        user: {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          photo: userData.photo,
          gender: userData.gender,
        },
        doctorId: doctorId,
        ticketPrice: ticketPrice?.toString() || "100",
        createdAt: new Date().toISOString(),
        state: "un",
        timeSlot: selectedTimeSlot,
        isPaid: false,
        queueNumber: queueNumber,
        expectedTime: expectedTime,
        doctor: {
          id: doctorId,
          name: finalDoctorName,
          photo:
            doctorPhoto ||
            "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg",
          phone: doctorPhone || "Not available",
        },
      };

      const res = await fetch(`${BASE_URL}/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newAppointment),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to book appointment");
      }

      toast.success("Appointment booked successfully!");
      window.dispatchEvent(new Event("appointment:created"));
      navigate(`/users/profile/me`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shadow-panelShadow p-3 lg:p-5 rounded-md">
      <div className="flex justify-between items-center">
        <p className="text__para mt-0 font-semibold">Ticket Price</p>
        <span className="text-[16px] leading-7 lg:text-[22px] lg:leading-8 text-headingColor font-bold">
          {ticketPrice ? `${ticketPrice} BDT` : "Not specified"}
        </span>
      </div>

      <div className="mt-[30px]">
        <p className="text__para mt-0 font-semibold text-headingColor">
          Available Time Slots
        </p>
        {timeSlots?.length > 0 ? (
          <div>
            <select
              value={selectedTimeSlot}
              onChange={(e) => setSelectedTimeSlot(e.target.value)}
              className="w-full p-2 border rounded-md mt-3"
              disabled={loading}
            >
              <option value="">Choose a time slot</option>
              {timeSlots
                .filter(
                  (item) =>
                    item && item.day && item.startingTime && item.endingTime
                )
                .map((item, index) => (
                  <option
                    key={index}
                    value={`${
                      item.day.charAt(0).toUpperCase() + item.day.slice(1)
                    }: ${convertTime(item.startingTime)} - ${convertTime(
                      item.endingTime
                    )}`}
                  >
                    {item.day.charAt(0).toUpperCase() + item.day.slice(1)}:{" "}
                    {convertTime(item.startingTime)} -{" "}
                    {convertTime(item.endingTime)}
                  </option>
                ))}
            </select>
          </div>
        ) : (
          <p className="text-[15px] leading-6 text-textColor mt-2">
            No available time slots.
          </p>
        )}
      </div>

      <button
        onClick={bookingHandler}
        disabled={loading}
        className={`btn btn-accent text-white bg-blue-600 px-2 rounded-md w-full mt-[0.5em] ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Booking..." : "Book Appointment"}
      </button>
    </div>
  );
};

export default Sidepanel;
