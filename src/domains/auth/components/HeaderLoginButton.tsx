"use client";

import { useLoginModalStore } from "@/share/stores/loginModalStore";
import tw from "@/share/utils/tw";

interface Props {
  variant?: "default" | "transparent" | "light" | "primary";
}

function HeaderLoginButton({ variant = "default" }: Props) {
  const setIsOpen = useLoginModalStore((s) => s.setIsOpen);
  const isLogin = false;

  const getLoginButtonStyles = () => {
    switch (variant) {
      case "transparent":
        return "bg-transparent text-white";
      case "light":
        return "bg-white text-black border-black hover:bg-black hover:text-white";
      case "primary":
        return "bg-inherit text-white";
    }
  };

  const loginButtonStyles = getLoginButtonStyles();

  return (
    <>
      {isLogin ? (
        <button
          type="button"
          className={tw(
            `w-25 h-10 text-white rounded-full border border-white hover:bg-white hover:text-black transition-all duration-300`,
            loginButtonStyles
          )}
          onClick={() => setIsOpen(true)}
        >
          로그아웃
        </button>
      ) : (
        <button
          type="button"
          className={tw(
            `w-25 h-10 text-white rounded-full border border-white hover:bg-white hover:text-black transition-all duration-300`,
            loginButtonStyles
          )}
          onClick={() => setIsOpen(true)}
        >
          로그인
        </button>
      )}
    </>
  );
}

export default HeaderLoginButton;
