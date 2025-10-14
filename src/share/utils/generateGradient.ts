function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 32bit 정수로 변환
  }
  return Math.abs(hash);
}

function generateGradientFromNickname(nickname: string): string {
  const hash = hashString(nickname);
  
  // 해시값을 기반으로 HSL 색상 생성
  const hue1 = hash % 360;
  const hue2 = (hash * 137) % 360; // 황금비를 사용해 보색 생성
  
  const saturation = 60 + (hash % 40); // 60-100% 사이
  const lightness = 45 + (hash % 20);  // 45-65% 사이
  
  return `linear-gradient(135deg, 
    hsl(${hue1}, ${saturation}%, ${lightness}%), 
    hsl(${hue2}, ${saturation}%, ${lightness}%))`;
}

export { generateGradientFromNickname };