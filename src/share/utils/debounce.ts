/**
 * @description 디바운스 함수 - 이벤트 핸들러에 사용
 * @param func 함수
 * @param delay 딜레이
 * @returns void
 */

export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}
