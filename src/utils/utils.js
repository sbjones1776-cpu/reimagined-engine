// Defensive date formatting utility
export function safeFormatDate(dateVal, fmt = "MMM d, h:mm a") {
  try {
    if (!dateVal) return "-";
    let d = dateVal;
    if (typeof d === "object" && typeof d.toDate === "function") d = d.toDate();
    const dateObj = d ? new Date(d) : null;
    if (!dateObj || isNaN(dateObj.getTime())) {
      console.warn("Invalid date value in safeFormatDate:", dateVal);
      return "-";
    }
    // Dynamically import date-fns/format if needed
    // eslint-disable-next-line global-require
    const { format } = require("date-fns");
    return format(dateObj, fmt);
  } catch (e) {
    console.error("safeFormatDate error:", e, dateVal);
    return "-";
  }
}
