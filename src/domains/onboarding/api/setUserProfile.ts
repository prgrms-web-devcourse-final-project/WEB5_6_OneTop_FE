"use client"

import axios from "axios";
import { UserOnboardingData } from "../types";

export async function setUserProfile(data: UserOnboardingData) {
  const username = data.name;
  const mbti = data.mbti;
  const beliefs = data.beliefs;
  const gender = data.gender;

  // additional 데이터 추출
  const additional_rawData = data.additional;

  // additional 데이터 flat하게 변환
  const lifeSatis = additional_rawData.life_satis;
  const relationship = additional_rawData.relationships;
  const workLifeBal = additional_rawData.work_life_bal;
  const riskAvoid = additional_rawData.risk_avoid;

  // data 객체에서 birthday_at 정보 추출
  const birthday_rawData = {
    year: data.birthday_at?.birthYear?.toString() ?? "",
    month: data.birthday_at?.birthMonth?.toString() ?? "",
    day: data.birthday_at?.birthDay?.toString() ?? "",
  };

  // ISO 8601 형식으로 변환
  const birthdayAt = `${
    birthday_rawData.year
  }-${birthday_rawData.month.padStart(2, "0")}-${birthday_rawData.day.padStart(
    2,
    "0"
  )}T00:00:00`;

  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users-info`,
    {
      username,
      birthdayAt,
      gender,
      mbti,
      beliefs,
      lifeSatis,
      relationship,
      workLifeBal,
      riskAvoid,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}
