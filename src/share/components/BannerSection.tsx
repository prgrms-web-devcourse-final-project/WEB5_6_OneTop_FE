interface Props {
  title?: string;
  description?: string;
}

export const BannerSection = ({ title, description }: Props) => {
  return (
    <div className="relative w-full h-[300px] sub-banner">
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/30">
        <h2 className="pt-7 text-[32px] font-semibold mb-4">{title}</h2>
        <p className="text-xl">{description}</p>
      </div>
    </div>
  );
};
