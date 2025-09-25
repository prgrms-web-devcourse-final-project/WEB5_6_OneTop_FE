"use client";

import { useState } from "react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import { BiCalendarAlt } from "react-icons/bi";
import { ko } from "react-day-picker/locale";
import { InputProps } from "../types";
import CustomDropDown from "./CustomDropDown";

const today = new Date().getTime();
const thisYear = new Date(today).getFullYear();
const thisMonth = new Date(today).getMonth() + 1;
const thisDay = new Date(today).getDate();

function InputDate({
  id,
  register,
  errors,
  setValue,
}: InputProps) {
  // TODO: id와 placeholder를 실제로 사용하도록 구현 필요
  const [calendarOpen, setCalendarOpen] = useState(false);

  // 어차피 zustand로 전환할 예정. 아닌가? 일단 디바운스로 추적하려면 관리해야겠는데.
  const [selectedDate, setSelectedDate] = useState<Date>(
    () => new Date(thisYear, thisMonth, thisDay)
  );
  const defaultClassNames = getDefaultClassNames();
  const maxDate = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    0
  ).getDate();
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1;
  const day = selectedDate.getDate();

  return (
    <div
      id={id}
      className="flex gap-8 items-center justify-center w-full h-80"
    >
      <div>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          id="year"
          maxLength={4}
          className="p-6 rounded-md border-2 border-white text-white text-4xl w-35 text-center"
          placeholder={year.toString()}
          {...register(`birthday.birthYear`, {
            valueAsNumber: true,
          })}
          min={1}
          max={9999}
        />
        <label htmlFor="year" className="text-4xl text-white ml-4">
          년
        </label>
      </div>

      <div>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          id="month"
          className="p-6 rounded-md border-2 border-white text-white text-4xl w-25 text-center"
          placeholder={month.toString()}
          maxLength={2}
          max={12}
          min={1}
          {...register(`birthday.birthMonth`, {
            valueAsNumber: true,
          })}
        />
        <label htmlFor="month" className="text-4xl text-white ml-4">
          월
        </label>
      </div>

      <div>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={2}
          id="day"
          max={maxDate}
          min={1}
          className="p-6 rounded-md border-2 border-white text-white text-4xl w-25 text-center"
          placeholder={day.toString()}
          {...register(`birthday.birthDay`, {
            valueAsNumber: true,
          })}
        />
        <label htmlFor="day" className="text-4xl text-white ml-4">
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
        <div
          className={`absolute top-0 left-0 translate-y-[-45%] transform transition-all duration-200 ease-in-out ${
            calendarOpen
              ? "opacity-100 translate-y-0 scale-100 translate-x-[64px]"
              : "opacity-0 -translate-y-2 scale-80 pointer-events-none translate-x-[0]"
          }`}
        >
          {calendarOpen && (
            <DayPicker
              classNames={{
                today: "border-1 border-red-500",
                selected: "bg-deep-navy text-white rounded-md",
                root: `${defaultClassNames.root} shadow-lg p-5 rounded-md bg-white font-pretendard absolute top-0 left-0`,
                chevron: `${defaultClassNames.chevron} fill-deep-navy`,
                day: `${defaultClassNames.day} text-center transition-all duration-300`,
                month_caption: `${defaultClassNames.month_caption} text-deep-navy text-xl font-bold my-3`,
                years_dropdown: `${defaultClassNames.years_dropdown} w-22`,
                months_dropdown: `${defaultClassNames.months_dropdown} w-16`,
              }}
              mode="single"
              components={{
                MonthsDropdown: CustomDropDown,
                YearsDropdown: CustomDropDown,
              }}
              captionLayout="dropdown"
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date ?? new Date());
                setValue(`birthday.birthDay`, date?.getDate() ?? 0);
                setValue(`birthday.birthMonth`, (date?.getMonth() ?? 0) + 1);
                setValue(`birthday.birthYear`, date?.getFullYear() ?? 0);
              }}
              required={false}
              locale={ko}
            />
          )}
        </div>
      </div>
    </div>
  );
}
export default InputDate;
