"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {getDefaultClassNames } from "react-day-picker";
import { InputProps } from "../types";
import tw from "@/share/utils/tw";

import CalenderButton from "./CalenderButton";

const today = new Date().getTime();
const thisYear = new Date(today).getFullYear();
const thisMonth = new Date(today).getMonth() + 1;
const thisDay = new Date(today).getDate();

function InputDate({ id, register, setValue, className }: InputProps) {
  // TODO: id와 placeholder를 실제로 사용하도록 구현 필요

  const year = new Date(thisYear, thisMonth, thisDay).getFullYear();
  const month = new Date(thisYear, thisMonth, thisDay).getMonth() + 1;
  const day = new Date(thisYear, thisMonth, thisDay).getDate();

  return (
    <div
      id={id}
      className={tw(
        "flex gap-8 items-center justify-center w-full z-50",
        className
      )}
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
          {...register(`birthday_at.birthYear`, {
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
          {...register(`birthday_at.birthMonth`, {
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
          max={31}
          min={1}
          className="p-6 rounded-md border-2 border-white text-white text-4xl w-25 text-center"
          placeholder={day.toString()}
          {...register(`birthday_at.birthDay`, {
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
      
      <CalenderButton
        id={id}
        setValue={setValue}
        className={className}
        placeholder={"캘린더"}
        register={register}
      />
    </div>
  );
}
export default InputDate;
