const convertTime = (time) => {
  if (!time || typeof time !== "string") {
    return "N/A";
  }

  const timeParts = time.split(":");
  if (timeParts.length < 2) {
    return "N/A";
  }

  let hours = parseInt(timeParts[0]);
  let minutes = parseInt(timeParts[1]);

  let meridiem = "am";
  if (hours >= 12) {
    meridiem = "pm";
    if (hours > 12) {
      hours -= 12;
    }
  }

  return (
    hours.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0") +
    " " +
    meridiem
  );
};

export default convertTime;
