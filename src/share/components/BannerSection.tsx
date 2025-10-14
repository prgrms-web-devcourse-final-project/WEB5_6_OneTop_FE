import tw from "../utils/tw";

interface Props {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export const BannerSection = ({
  title,
  description,
  children,
  className,
}: Props) => {
  return (
    <div className="relative w-full h-[300px] sub-banner">
      <div
        className={tw(
          "absolute inset-0 flex flex-col items-center justify-center text-white bg-black/30",
          className
        )}
      >
        {children ? (
          children
        ) : (
          <>
            <h2 className="pt-7 text-2xl md:text-[32px] font-semibold mb-4">
              {title}
            </h2>
            <p className="text-base md:text-xl px-5 text-center">
              {description}
            </p>{" "}
          </>
        )}
      </div>
    </div>
  );
};
