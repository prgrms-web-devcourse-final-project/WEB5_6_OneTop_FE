
// TODO : 렌더 패턴 추가하기. (개방 - 폐쇄 원칙 : 확장을 위해 FormSlider를 수정할 필요 없이 steps만 수정하면 확장 가능)
export const steps = [
  { key: "name", label: "당신의 이름은?", placeholder: "이름을 입력해주세요" },
  {
    key: "birthday",
    label: "당신의 생년월일은?",
    placeholder: "생년월일을 입력해주세요",
  },
  {
    key: "gender",
    label: "당신의 성별은?",
    placeholder: "성별을 입력해주세요",
  },
  { key: "mbti", label: "당신의 MBTI는?", placeholder: "MBTI를 입력해주세요" },
  {
    key: "preference",
    label: "당신의 성향은?",
    placeholder: "성향을 입력해주세요",
  },
  {
    key: "addtional",
    label: "추가 정보를 입력해주세요",
    placeholder: "추가 정보를 입력해주세요",
  },
  { key: "done", label: "완료", placeholder: "완료" },
] as const
