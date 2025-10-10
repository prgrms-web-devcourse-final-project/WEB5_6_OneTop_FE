import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="relative h-screen w-screen flex flex-col items-center text-white">
      <Image
        src="/404.png"
        alt="404 background"
        fill
        className="object-cover"
        priority
      />
      <p
        className="absolute top-60 text-lg font-normal leading-normal 
                text-center"
      >
        페이지를 찾을 수 없습니다.
        <br />
        존재하지 않는 주소를 입력하셨거나,
        <br />
        요청하신 페이지의 주소가 변경, 삭제되어 찾을 수 없습니다.
      </p>
      <Link
        href="/"
        className="absolute bottom-60 w-36 h-12 rounded-full border border-white 
               text-xl font-normal leading-normal 
               flex items-center justify-center bg-transparent transition-colors 
               hover:bg-white/10 hover:text-white"
      >
        홈으로 이동
      </Link>
    </div>
  );
}
