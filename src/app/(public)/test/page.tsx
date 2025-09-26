import DateInput from "@/domains/onboarding/components/DateInput";

function Page() {
  return <div className="flex flex-col gap-10 bg-deep-navy p-10 w-screen h-screen"><DateInput id="birthday" placeholder="생년월일" /></div>;
}
export default Page;
