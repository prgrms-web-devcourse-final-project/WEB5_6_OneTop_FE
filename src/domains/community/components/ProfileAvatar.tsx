// components/ProfileAvatar.tsx
import { generateGradientFromNickname } from "@/share/utils/generateGradient";

interface ProfileAvatarProps {
  nickname: string;
  size?: number;
  className?: string;
}

function ProfileAvatar({ nickname, size = 40, className = "" }: ProfileAvatarProps) {
  const gradient = generateGradientFromNickname(nickname);
  const initials = nickname.slice(0, 2).toUpperCase();
  
  return (
    <div
      className={`rounded-full flex items-center justify-center text-white font-semibold ${className}`}
      style={{
        width: size,
        height: size,
        background: gradient,
        fontSize: size * 0.4, // 크기에 비례한 폰트 사이즈
      }}
    >
      {initials}
    </div>
  );
}

export default ProfileAvatar;