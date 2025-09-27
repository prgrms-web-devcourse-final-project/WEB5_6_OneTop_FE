import { DropdownProps } from "react-day-picker";

function CustomDropDown({
  className,
  name,
  value,
  onChange,
  options = [],
  classNames:_,
  ...rest
}: DropdownProps) {
  return (
    <div className={`relative w-20 ${className ?? ""}`} onClick={(e) => e.stopPropagation()}>
      <select
        {...rest}
        name={name}
        value={value}
        onChange={onChange}
        className={`block w-full appearance-none rounded-lg border border-gray-300 bg-white
          px-3 py-2 pr-9 text-sm leading-5 shadow-sm
          focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30
          hover:border-gray-400 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700
          ${className ?? ""}`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 opacity-70"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.585l3.71-3.355a.75.75 0 111.04 1.08l-4.24 3.83a.75.75 0 01-1.04 0l-4.24-3.83a.75.75 0 01.02-1.06z" />
      </svg>

      {/* ▼ 아이콘 */}
      <svg
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 opacity-70"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.585l3.71-3.355a.75.75 0 111.04 1.08l-4.24 3.83a.75.75 0 01-1.04 0l-4.24-3.83a.75.75 0 01.02-1.06z" />
      </svg>
    </div>
  );
}

export default CustomDropDown;
