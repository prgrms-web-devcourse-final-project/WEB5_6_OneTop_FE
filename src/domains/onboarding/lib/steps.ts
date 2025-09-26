// TODO : 렌더 패턴 추가하기. (개방 - 폐쇄 원칙 : 확장을 위해 FormSlider를 수정할 필요 없이 steps만 수정하면 확장 가능)

import InputBelief from "../components/InputBelief";
import InputDate from "../components/InputDate";
import InputGender from "../components/InputGender";
import InputMbti from "../components/InputMbti";
import InputText from "../components/InputText";
import { StepDefinition } from "../types";

/**
 * 온보딩 폼의 전체 흐름을 선언적으로 정의하는 파일입니다.
 * 확장을 위해 FormSlider를 수정할 필요 없이 steps만 수정해 확장할 수 있습니다.
 */

export const steps: StepDefinition[] = [
  {
    key: "name",
    label: "당신의 이름은?",
    placeholder: "이름을 입력해주세요",
    component: InputText,
  },
  {
    key: "birthday_at",
    label: "당신의 생년월일은?",
    placeholder: "생년월일을 입력해주세요",
    component: InputDate,
  },
  {
    key: "gender",
    label: "당신의 성별은?",
    placeholder: "성별을 입력해주세요",
    component: InputGender,
  },
  {
    key: "mbti",
    label: "당신의 MBTI는?",
    placeholder: "MBTI를 입력해주세요",
    component: InputMbti,
  },
  {
    key: "beliefs",
    label: "당신이 가장 중요하게 여기는 것은?",
    placeholder: "가장 중요하게 여기는 신념을 입력해주세요",
    component: InputBelief,
  },
  {
    key: "additional",
    label: "추가 정보를 입력해주세요",
    placeholder: "추가 정보를 입력해주세요",
    component: InputText,
  },
];
