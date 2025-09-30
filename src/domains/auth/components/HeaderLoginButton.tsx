"use client";

import { useLoginModalStore } from "@/domains/auth/stores/loginModalStore";
import tw from "@/share/utils/tw";
import { useAuthUser } from "../api/useAuthUser";
import { useLogout } from "../hooks/useLogout";
import { loginResponseSchema } from "../schemas/loginResponseSchema";

interface Props {
  variant?: "default" | "transparent" | "light" | "primary";
}

function HeaderLoginButton({ variant = "default" }: Props) {
  const setIsOpen = useLoginModalStore((s) => s.setIsOpen);
  const { data: authUser } = useAuthUser();
  // safeParse를 이용해 오류 방지
  const parsedAuthUser = loginResponseSchema.safeParse(authUser);
  const { logout } = useLogout();
  const isLogin = parsedAuthUser.data?.message === "authenticated";

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
          onClick={() => logout()}
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
