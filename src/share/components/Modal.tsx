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
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getButtonClass = (variant: "primary" | "outline" = "primary") => {
    if (variant === "primary") {
      return "bg-deep-navy text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition";
    } else {
      return "bg-white text-deep-navy border border-deep-navy px-4 py-2 rounded-md hover:bg-gray-50 transition";
    }
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col"
        style={{ maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-6 py-4 flex-shrink-0">
          <h3 className="text-xl font-bold">{title}</h3>
          <button
            onClick={onClose}
            className="hover:bg-gray-100 rounded-lg p-1 transition"
          >
            <IoClose size={24} />
          </button>
        </div>
        <div
          className="px-6"
          style={{
            overflowY: "auto",
            flex: "1 1 auto",
          }}
        >
          {children}
        </div>
        {actions.length > 0 && (
          <div className="flex px-6 py-4 justify-end gap-3 flex-shrink-0">
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
