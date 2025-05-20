

"use client";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";
import { useState, useEffect } from "react";

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    setSelectedDate(dayjs()); // Ensure date is set on the client side
  }, []);

  const handleDateChange = (newValue) => {
    if (newValue) {
      setSelectedDate(newValue);
    }
  };

  if (!selectedDate) return null; // Avoid rendering until date is set

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        value={selectedDate}
        onChange={handleDateChange}
        sx={{
          background: "#F5F5F5",
          boxShadow: "0px 0px 11px 1px #67C587",
          "& .MuiTypography-root": { color: "#000" },
          "& .MuiButtonBase-root": { color: "#fff", backgroundColor: "#fff" },
          "& .MuiPickersDay-root": { color: "#000" },
          "& .MuiPickersDay-root.Mui-selected": {
            backgroundColor: "#27CDA5 !important",
            color: "#000 !important",
          },
          "& .MuiOutlinedInput-root": { color: "#000" },
          "& .MuiSvgIcon-root": { color: "#000" },
          "& .MuiPickersCalendarHeader-root .MuiTypography-root": {
            color: "#000",
          },
          "& .MuiPickersCalendarHeader-root": {
            borderBottom: "2px solid #fff",
            marginBottom: "1rem",
          },
        }}
      />
    </LocalizationProvider>
  );
}
