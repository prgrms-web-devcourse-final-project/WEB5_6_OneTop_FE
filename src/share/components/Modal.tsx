"use client";

import { ReactNode, useEffect } from "react";
import { IoClose } from "react-icons/io5";

interface ModalAction {
  label: string;
  onClick: () => void;
  variant?: "primary" | "outline";
  disabled?: boolean;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  actions?: ModalAction[];
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  actions = [],
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      // 현재 스크롤 위치 저장
      const scrollY = window.scrollY;

      // body와 html 스크롤 완전히 막기
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflowY = "scroll";

      return () => {
        // 원래대로 복구
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflowY = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getButtonClass = (variant: "primary" | "outline" = "primary") => {
    if (variant === "primary") {
      return "bg-deep-navy text-white px-4 py-2 rounded-md";
    } else {
      return "bg-white text-deep-navy border border-deep-navy px-4 py-2 rounded-md";
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-10 overflow-hidden">
      <div
        className="absolute inset-0 bg-[rgba(0,0,0,0.2)] backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div
        className="relative bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h3 className="text-xl font-bold">{title}</h3>
          <button onClick={onClose}>
            <IoClose size={24} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 min-h-0">{children}</div>
        {actions.length > 0 && (
          <div className="flex pt-4 justify-end gap-3 flex-shrink-0">
            {actions.map((action, idx) => (
              <button
                key={idx}
                onClick={action.onClick}
                disabled={action.disabled}
                className={`${getButtonClass(action.variant)} ${
                  action.disabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
