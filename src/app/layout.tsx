import ScrollSmootherProvider from "@/share/providers/ScrollSmoothProvider";
import TanstackProvider from "@/share/providers/TanstackProvider";

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <TanstackProvider>
        <header className="w-full h-10 bg-amber-200 absolute top-0 left-0">
          헤더입니다.
        </header>

        <main className="flex flex-col items-center sm:items-start w-full h-full">
          <ScrollSmootherProvider>{children}</ScrollSmootherProvider>
        </main>

        <footer className="w-full h-10 bg-amber-200 ">푸터입니다.</footer>
      </TanstackProvider>
    </div>
  );
}
export default RootLayout;
