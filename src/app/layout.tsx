import TanstackProvider from "@/share/providers/TanstackProvider";
import "./globals.css";
import { Metadata, Viewport } from "next";
import { Racing_Sans_One, Roboto_Serif } from "next/font/google";
import LoginModal from "@/domains/auth/components/LoginModal";

export const metadata: Metadata = {
  title: "Re:Life",
  description: "Re:Life",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/logo_32.svg", sizes: "32x32", type: "image/svg+xml" },
      { url: "/logo_64.svg", sizes: "64x64", type: "image/svg+xml" },
    ],
    apple: [{ url: "/logo_128.svg", sizes: "128x128", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const racingSansOne = Racing_Sans_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-racing-sans-one",
});

const robotoSerif = Roboto_Serif({
  weight: "700",
  subsets: ["latin"],
  variable: "--font-roboto-serif",
});

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      className={`${racingSansOne.variable} ${robotoSerif.variable}`}
      lang="ko"
      style={
        {
          "--font-racing-sans-one": racingSansOne.style.fontFamily,
          "--font-roboto-serif": robotoSerif.style.fontFamily,
        } as React.CSSProperties
      }
    >
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css"
        />
      </head>
      <body className="min-h-screen font-family-pretendard">
        <TanstackProvider>
          <LoginModal />
          {children}
        </TanstackProvider>
      </body>
    </html>
  );
}
export default RootLayout;
