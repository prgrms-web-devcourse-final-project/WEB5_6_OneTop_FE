import ScrollSmootherProvider from "@/share/providers/ScrollSmoothProvider";
import TanstackProvider from "@/share/providers/TanstackProvider";
import "@/share/styles/index.css";
import ScrollTopButton from "@/share/components/ScrollTopButton";
import Footer from "@/share/components/Footer";
import { Metadata } from "next";
import { Racing_Sans_One, Roboto_Serif } from "next/font/google";

export const metadata: Metadata = {
  title: "Re:Life",
  description: "Re:Life",
  icons: {
    icon: "/favicon.ico",
  },
};

const racingSansOne = Racing_Sans_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-accent",
});

const robotoSerif = Roboto_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-logo",
});

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={`${racingSansOne.variable} ${robotoSerif.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css"
        />
      </head>
      <body className="min-h-screen">
        <ScrollSmootherProvider>
          <TanstackProvider>
            <div className="min-h-screen flex flex-col">
              <header className="w-full h-10 bg-amber-200 flex-shrink-0">
                헤더입니다.
              </header>

              <main className="flex flex-col items-center sm:items-start w-full flex-1">
                {children}
              </main>

              <Footer />

              <ScrollTopButton />
            </div>
          </TanstackProvider>
        </ScrollSmootherProvider>
      </body>
    </html>
  );
}
export default RootLayout;
