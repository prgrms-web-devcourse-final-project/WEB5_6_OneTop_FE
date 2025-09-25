import { FaGithub } from "react-icons/fa";

function Footer() {
  return (
    <div className="bg-deep-navy flex items-center justify-between h-[80px] px-5 md:px-[50px] flex-shrink-0">
      <p className="text-sm font-light md:text-base text-white">
        Copyright © 2025 Re:Life. All rights Reserved
      </p>
      <div className="flex gap-4">
        <a
          href="https://github.com/prgrms-web-devcourse-final-project/WEB5_6_OneTop_FE"
          target="_blank"
        >
          <FaGithub size={32} color="white" />
        </a>
      </div>
    </div>
  );
}
export default Footer;
