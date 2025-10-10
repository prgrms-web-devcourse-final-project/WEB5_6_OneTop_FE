interface LoadingProps {
  text?: string;
  className?: string;
}

export default function Loading({
  text = "로딩중",
  className = "",
}: LoadingProps) {
  return (
    <div
      className={`flex flex-col items-center py-8 sm:py-12 lg:py-16 gap-2 ${className}`}
    >
      <div className="flex gap-2">
        <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 rounded-full bg-deep-navy animate-bounce delay-0"></span>
        <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 rounded-full bg-deep-navy animate-bounce delay-150"></span>
        <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 rounded-full bg-deep-navy animate-bounce delay-300"></span>
      </div>
      {text && (
        <span className="text-sm sm:text-base lg:text-lg text-deep-navy font-medium">
          {text}
        </span>
      )}
    </div>
  );
}
