import TanstackProvider from "@/share/providers/TanstackProvider";
import "./globals.css";
import { Metadata, Viewport } from "next";
import { Racing_Sans_One, Roboto_Serif } from "next/font/google";
import LoginModal from "@/domains/auth/components/LoginModal";
import Script from "next/script";
import { headers } from "next/headers";

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

async function RootLayout({ children }: { children: React.ReactNode }) {
    const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
    const h = await headers();
    const nonce = h.get("x-nonce") ?? undefined;

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
            {/* Google Tag Manager */}
            <Script
                id="gtm-script"
                nonce={nonce}
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmId}');
            `,
                }}
            />

            <link
                rel="stylesheet"
                href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css"
            />
        </head>
        <body className="min-h-screen font-family-pretendard">
        {/* Google Tag Manager (noscript) */}
        <noscript>
            <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
                height="0"
                width="0"
                style={{ display: 'none', visibility: 'hidden' }}
            />
        </noscript>

        {/* 임시 테스트: Clarity 직접 설치 */}
        <Script
            id="clarity-direct-test"
            nonce={nonce}
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
                __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "tp9puimxhj");
            `,
            }}
        />

        <TanstackProvider>
            <LoginModal />
            {children}
        </TanstackProvider>
        </body>
        </html>
    );
}
export default RootLayout;
