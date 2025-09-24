"use client";

import { useState } from "react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import { BiCalendarAlt } from "react-icons/bi";
import { ko } from "react-day-picker/locale";
import { DateInputProps } from "../types";

function DateInput({ id, placeholder, register, errors }: DateInputProps) {
  // TODO: id와 placeholder를 실제로 사용하도록 구현 필요
  const today = new Date().getTime();
  const thisYear = new Date(today).getFullYear();
  const thisMonth = new Date(today).getMonth() + 1;
  const thisDay = new Date(today).getDate();

  // 어차피 zustand로 전환할 예정. 아닌가? 일단 디바운스로 추적하려면 관리해야겠는데.
  const [year, setYear] = useState(() => thisYear);
  const [month, setMonth] = useState(() => thisMonth);
  const [day, setDay] = useState(() => thisDay);
  const [selectedDate, setSelectedDate] = useState<Date>(
    () => new Date(year, month, day)
  );

  const [calendarOpen, setCalendarOpen] = useState(false);

  const defaultClassNames = getDefaultClassNames();

  return (
    <div className="flex gap-8 items-center justify-center w-full h-100">
      <div>
        <input
          type="number"
          id="year"
          min={1}
          className="p-6 rounded-md border-2 border-white text-white text-5xl w-50"
          placeholder="연도"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        />
        <label htmlFor="year" className="text-5xl text-white ml-4">
          년
        </label>
      </div>

      <div>
        <input
          type="number"
          id="month"
          className="p-6 rounded-md border-2 border-white text-white text-5xl w-40"
          placeholder="월"
          max={12}
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
        />
        <label htmlFor="month" className="text-5xl text-white ml-4">
          월
        </label>
      </div>

      <div>
        <input
          type="number"
          id="day"
          value={day}
          max={new Date(year, month, 0).getDate()}
          className="p-6 rounded-md border-2 border-white text-white text-5xl w-40"
          placeholder="일"
          onChange={(e) => setDay(Number(e.target.value))}
        />
        <label htmlFor="day" className="text-5xl text-white ml-4">
          일
        </label>
      </div>

      <label htmlFor="date" className="invisible">
        날짜
      </label>
      <div className="relative flex gap-4 items-center -ml-10">
        <button
          type="button"
          id="date"
          onClick={() => setCalendarOpen(!calendarOpen)}
        >
          <BiCalendarAlt size={64} style={{ color: "white" }} />
        </button>
        {calendarOpen && (
          <DayPicker
            className="absolute top-0 left-0"
            classNames={{
              today: "border-1 border-red-500",
              selected: "bg-deep-navy text-white rounded-md",
              root: `${defaultClassNames.root} shadow-lg p-5 rounded-md bg-white font-pretendard`,
              chevron: `${defaultClassNames.chevron} fill-deep-navy`,
              day: `${defaultClassNames.day} p-1 text-center transition-all duration-300`,
              month_caption: `${defaultClassNames.month_caption} text-deep-navy text-xl font-bold my-3`,
            }}
            mode="single"
            selected={selectedDate}
            onSelect={(date) => setSelectedDate(date ?? new Date())}
            required={false}
            locale={ko}
          />
        )}
      </div>
    </div>
  );
}
export default DateInput;
