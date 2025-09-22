import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo_32.svg";
import HeaderLoginButton from "@/domains/auth/components/HeaderLoginButton";

interface HeaderProps {
  variant?: "default" | "transparent" | "light" | "dark";
}

/* 해결 방법 고민
1. 헤더를 client component로 만들고, 페이지 별로 헤더의 색상을 변경해 줄 수 있도록 함.
2. 전역 provider를 만들어서 라우팅 주소별로 헤더의 색상을 변경해 줄 수 있도록 함.
3. Zustand를 사용해 페이지별로 스타일을 변경할 수 있도록 함.
4. 하위 레이아웃에서 root css 변수를 설정하도록 함
5. Shell을 이용해 헤더 설정 + 헤더가 존재하지 않아야 하는 페이지 (설문 히어로) 등 설정
*/


function Header({ variant = "default" }: HeaderProps) {
  // variant에 따른 스타일 결정
  const getHeaderStyles = () => {
    switch (variant) {
      case "transparent":
        return {
          background: "bg-transparent",
          text: "text-white",
          logoFilter: "brightness(0) invert(1)",
          underlineColor: "after:bg-white",
        };
      case "light":
        return {
          background: "bg-white",
          text: "text-black",
          logoFilter: "brightness(0)",
          underlineColor: "after:bg-black",
        };
      case "dark":
        return {
          background: "bg-black",
          text: "text-white",
          logoFilter: "brightness(0) invert(1)",
          underlineColor: "after:bg-white",
        };
      default:
        return {
          background: "bg-black",
          text: "text-white",
          logoFilter: "brightness(0) invert(1)",
          underlineColor: "after:bg-white",
        };
    }
  };

  const styles = getHeaderStyles();

  return (
    <header
      className={`w-full h-15 ${styles.background} flex-shrink-0 px-[10%] items-center justify-between flex transition-colors duration-300 absolute top-0 left-0 right-0 z-50`}
    >
      <Link href="/" className="flex items-center gap-2 ">
        <Image
          src={logo}
          alt="logo"
          width={32}
          height={32}
          className={styles.text}
          style={{
            width: "32px",
            height: "32px",
            filter: styles.logoFilter,
          }}
        />
        <h1 className={`text-xl font-bold font-family-logo ${styles.text}`}>
          Re:Life
        </h1>
      </Link>

      <div className={`flex items-center gap-12 ${styles.text}`}>
        <Link
          href="/life-record"
          className={`text-md group relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 ${styles.underlineColor} after:transition-all after:duration-300 hover:after:w-full`}
        >
          인생 기록
        </Link>
        <Link
          href="/scenario-list"
          className={`text-md group relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 ${styles.underlineColor} after:transition-all after:duration-300 hover:after:w-full`}
        >
          시나리오 목록
        </Link>
        <Link
          href="/community"
          className={`text-md group relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 ${styles.underlineColor} after:transition-all after:duration-300 hover:after:w-full`}
        >
          커뮤니티
        </Link>
        <Link
          href="/my-page"
          className={`text-md group relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 ${styles.underlineColor} after:transition-all after:duration-300 hover:after:w-full`}
        >
          마이 페이지
        </Link>
      </div>

      <HeaderLoginButton variant={variant} />
    </header>
  );
}
export default Header;
