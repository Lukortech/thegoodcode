import "react-datepicker/dist/react-datepicker.min.css";

import React, { useState } from 'react'
import { eachYearOfInterval, getMonth, getYear, subYears } from 'date-fns';

import DatePicker from "react-datepicker/"
import { TextField } from "@mui/material";

const HUMAN_LIFE_EXPECTANCY = 200
const MIN_USER_AGE = 18

const CustomDatePicker:React.FC<{date?: Date, setDate: (date: Date)=> void}> = ({date,setDate}) => {
  const years = [
    eachYearOfInterval({
      start: subYears(new Date(), HUMAN_LIFE_EXPECTANCY),
      end: subYears(new Date(), MIN_USER_AGE),
    })
  ].flat().map(date => date.getFullYear())
  const months = [
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

  return (
    <DatePicker
      customInput={<TextField fullWidth/>}
      renderCustomHeader={({
        date,
        changeYear,
        changeMonth,
        decreaseMonth,
        increaseMonth,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled,
      }) => (
        <div
          style={{
            margin: 10,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
            {"<"}
          </button>
          <select
            value={getYear(date)}
            onChange={({ target: { value } }) => changeYear(Number(value))}
          >
            {years.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            value={months[getMonth(date)]}
            onChange={({ target: { value } }) =>
              changeMonth(months.indexOf(value))
            }
          >
            {months.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
            {">"}
          </button>
        </div>
      )}
      selected={date}
      onChange={(date) => date ? setDate(date) : {}}
    />
  );
};

export default CustomDatePicker