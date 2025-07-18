import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/Calendar.scss";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface CustomCalendarProps {
  value: Value;
  onChange: (value: Value) => void;
  maxDate?: Date;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({
  value,
  onChange,
  maxDate = new Date()
}) => {

  return (
    <div style={{ width: 280, fontSize: 14 }}>
      <Calendar
        value={value}
        onChange={onChange}
        maxDate={maxDate}
      />
    </div>
  );
};

export default CustomCalendar;