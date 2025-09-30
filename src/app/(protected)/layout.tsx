import { getAuthUser } from "@/domains/auth/api/getAuthUser";
import { redirect } from "next/navigation";



async function Layout({ children }: { children: React.ReactNode }) {
  // 게스트 모드일 때 프로필 정보를 받을 것인가. 어디까지 허용할 것인가.
  // console.log("인증 과정을 거치는 로직이 여기에 들어옵니다.");

  const user = await getAuthUser();

  if (!user) {
    redirect("/onboarding");
  }

  return <>{children}</>;
}

export default Layout;
