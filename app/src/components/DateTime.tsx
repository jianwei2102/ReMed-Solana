import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { PiCalendarCheck, PiClock } from "react-icons/pi";

const DateTime = () => {
  const [currentTime, setCurrentTime] = useState(format(new Date(), "hh:mm a"));
  const [currentDate] = useState(format(new Date(), "dd MMMM, yyyy"));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(format(new Date(), "hh:mm a"));
    }, 1000);

    return () => clearInterval(timer); // Cleanup the timer on component unmount
  }, []);

  return (
    <div className="flex items-center">
      <PiCalendarCheck size={15} className="ml-3 mr-1" />
      {currentDate}
      <PiClock size={15} className="ml-3 mr-1" />
      {currentTime}
    </div>
  );
};

export default DateTime;
