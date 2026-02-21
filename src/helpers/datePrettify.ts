export function datePrettify(
  dateInput: Date | string | number,
  options: {
    showTime?: boolean;
    use24Hour?: boolean;
  } = {},
): string {
  const { showTime = false, use24Hour = true } = options;
  let date: Date;
  if (
    typeof dateInput === "string" &&
    !dateInput.endsWith("Z") &&
    !dateInput.includes("+")
  ) {
    date = new Date(`${dateInput}Z`);
  } else {
    date = new Date(dateInput);
  }

  if (isNaN(date.getTime())) {
    return "Invalid date";
  }
  const formatterOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  if (showTime) {
    formatterOptions.hour = "2-digit";
    formatterOptions.minute = "2-digit";
    formatterOptions.hour12 = !use24Hour;
  }
  try {
    return new Intl.DateTimeFormat(undefined, formatterOptions).format(date);
  } catch (e) {
    // Fallback for environments with limited Intl support
    return date.toDateString();
  }
}
