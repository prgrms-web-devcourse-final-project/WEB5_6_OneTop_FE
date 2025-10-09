"use client";

import { useRouter } from "next/navigation";
import tw from "../utils/tw";

function BackButton({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={tw("bg-deep-navy text-white px-4 py-2 rounded-md", className)}
    >
      {children}
    </button>
  );
}
export default BackButton;
