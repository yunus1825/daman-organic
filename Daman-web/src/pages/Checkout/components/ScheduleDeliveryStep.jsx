import React, { useState } from "react";

const ScheduleDeliveryStep = () => {
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");

  const timeSlots = [
    "Morning (10 AM - 1 PM)",
    "Afternoon (1 PM - 5 PM)",
    "Evening (5 PM - 9 PM)",
  ];

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Schedule Your Delivery</h2>
      
      <div>
        <label className="block mb-1">Select Date:</label>
        <input
          type="date"
          className="border p-2 rounded"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
        />
      </div>

      <div>
        <label className="block mb-1">Select Time Slot:</label>
        <select
          className="border p-2 rounded"
          value={timeSlot}
          onChange={(e) => setTimeSlot(e.target.value)}
        >
          <option value="">-- Choose a time slot --</option>
          {timeSlots.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ScheduleDeliveryStep;
