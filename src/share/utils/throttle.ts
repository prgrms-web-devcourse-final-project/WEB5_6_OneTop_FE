/**
 * @description 스로틀 함수 - 이벤트 핸들러에 사용
 * @param callback 함수
 * @param delay 딜레이
 * @returns void
 */


export function throttle<T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      callback(...args);
    }
  };
}
