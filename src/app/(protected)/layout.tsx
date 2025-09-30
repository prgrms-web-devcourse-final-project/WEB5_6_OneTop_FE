import { getAuthUser } from "@/domains/auth/api/getAuthUser";
import { userResponseSchema } from "@/domains/auth/schemas/loginResponseSchema";
import ClientRedirectHandler from "@/domains/auth/components/clientRedirectHandler";



async function Layout({ children }: { children: React.ReactNode }) {
  // 게스트 모드일 때 프로필 정보를 받을 것인가. 어디까지 허용할 것인가.
  // console.log("인증 과정을 거치는 로직이 여기에 들어옵니다.");

  const authUser = await getAuthUser();
  const parsedAuthUser = userResponseSchema.safeParse(authUser);
  const isLogin = parsedAuthUser.data?.message === "authenticated";

  if (!isLogin) {
    return <ClientRedirectHandler />;
  }

  return <>{children}</>;
}

export default Layout;
