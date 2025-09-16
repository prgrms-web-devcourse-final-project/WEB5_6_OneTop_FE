export function timeFormatter(isoUTC: string): string {
  const date = new Date(isoUTC); // UTC -> JS Date (자동으로 로컬 = KST 변환됨)

  const yyyy = date.getFullYear();
  const MM = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  const ms = String(date.getMilliseconds()).padStart(3, "0");

  return `${yyyy}-${MM}-${dd}T${hh}:${mm}:${ss}.${ms}+09:00`;
}
