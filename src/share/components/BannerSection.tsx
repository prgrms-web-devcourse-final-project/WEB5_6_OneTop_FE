interface Props {
  title?: string;
  description?: string;
}

export const BannerSection = ({ title, description }: Props) => {
  return (
    <div className="relative h-[300px]">
      <div className="absolute top-0 left-0 flex flex-col items-center justify-center text-white sub-banner">
        <h2 className="pt-7 text-[32px] font-semibold mb-4">{title}</h2>
        <p className="text-xl">{description}</p>
      </div>
    </div>
  );
};
