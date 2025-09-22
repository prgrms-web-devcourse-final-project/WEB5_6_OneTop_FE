import SignUpForm from "@/domains/auth/components/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "회원가입 | Re:Life",
  description: "Re:Life에 가입하여 개인화된 정확한 시뮬레이션을 체험해보세요.",
  keywords: "회원가입, Re:Life, 선택 시뮬레이션, 가입, 시뮬레이션, 개인화, 정확한 시뮬레이션",
};

function Page() {
  return (
    <div className="flex flex-col gap-10 py-20 w-full justify-center items-center">
      <div className="sm:w-full sm:px-4 md:w-1/3">
        <h1 className="text-2xl font-bold w-full mb-10">회원가입</h1>
        <div className="px-4">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
}

export default Page;
