"use client";

import Image from "next/image";

export const Hero = () => {
  return (
    <div>
      <Image
        src="/logo_32.svg"
        alt="logo"
        width={32}
        height={32}
        className=""
      />
    </div>
  );
};
export default Hero;
