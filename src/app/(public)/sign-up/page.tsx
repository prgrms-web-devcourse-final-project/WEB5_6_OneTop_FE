import SignUpForm from "@/domains/auth/components/SignUpForm";

function Page() {
  return (
    <div className="flex flex-col gap-10 py-20 w-full justify-center items-center">
      <div className="sm:w-full sm:px-4 md:w-1/3">
        <div className="text-2xl font-bold w-full mb-10">회원가입</div>
        <div className="px-4">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
}

export default Page;
