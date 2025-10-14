import { useState } from "react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import { BiCalendarAlt } from "react-icons/bi";
import { ko } from "react-day-picker/locale";
import { useFloating, offset, flip, shift, useClick, useDismiss, useInteractions, FloatingPortal, autoUpdate } from "@floating-ui/react";
import tw from "@/share/utils/tw";
import CustomDropDown from "./CustomDropDown";
import { InputProps } from "../types";

function CalenderButton({ id, setValue, className }: InputProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const defaultClassNames = getDefaultClassNames();

  // Floating UI 세팅
  const {
    refs,
    floatingStyles,
    context
  } = useFloating({
    open: calendarOpen,
    onOpenChange: setCalendarOpen,
    placement: "bottom-start",
    middleware: [offset(8), flip(), shift()],
    whileElementsMounted: autoUpdate, // <-- 위치 자동 업데이트 핵심
  });

  // 상호작용 (클릭으로 열기/닫기 + 외부 클릭 닫기)
  const click = useClick(context);
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

  return (
    <div id={id} className={tw("flex gap-8 items-center justify-center", className)}>

      <div className="relative flex gap-4 items-center -ml-10">
        <button
          type="button"
          ref={refs.setReference}
          {...getReferenceProps()}
        >
          <BiCalendarAlt size={64} style={{ color: "white" }} />
        </button>

        {calendarOpen && (
          <FloatingPortal>
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps()}
              className="z-[9999]"
            >
              <DayPicker
                classNames={{
                  today: "border-1 border-red-500",
                  selected: "bg-deep-navy text-white rounded-md",
                  root: `${defaultClassNames.root} shadow-lg p-5 rounded-md bg-white font-pretendard`,
                  chevron: `${defaultClassNames.chevron} fill-deep-navy`,
                  day: `${defaultClassNames.day} text-center transition-all duration-300`,
                  month_caption: `${defaultClassNames.month_caption} text-deep-navy text-xl font-bold my-3`,
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
                  setValue?.(`birthday_at.birthDay`, date?.getDate() ?? 0);
                  setValue?.(`birthday_at.birthMonth`, (date?.getMonth() ?? 0) + 1);
                  setValue?.(`birthday_at.birthYear`, date?.getFullYear() ?? 0);
                  setCalendarOpen(false);
                }}
                locale={ko}
              />
            </div>
          </FloatingPortal>
        )}
      </div>
    </div>
  );
}

export default CalenderButton;
