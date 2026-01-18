export function datePrettify(
  dateInput: Date | string | number,
  options: {
    showTime?: boolean;
    locale?: string; // e.g. "az", "en-US", "ru"
    use24Hour?: boolean; // default true
  } = {},
): string {
  const {
    showTime = false,
    locale = "en-US", // change to "az" if you want Azerbaijani month names
    use24Hour = true,
  } = options;

  // Normalize input to Date object
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  // You can customize month names if locale doesn't give what you want
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  let result = `${day} ${month} ${year}`;

  if (showTime) {
    const hours = use24Hour
      ? date.getHours().toString().padStart(2, "0")
      : (((date.getHours() + 11) % 12) + 1).toString().padStart(2, "0");

    const minutes = date.getMinutes().toString().padStart(2, "0");
    // const ampm = use24Hour ? "" : date.getHours() >= 12 ? " PM" : " AM";

    result += `, ${hours}:${minutes}`;
    // if (!use24Hour) result += ampm;
  }

  return result;
}
