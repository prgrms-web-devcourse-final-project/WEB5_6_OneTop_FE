function InfoCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
}) {
  return (
    <div className="p-4 border border-deep-navy bg-white rounded-lg flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        {title}
      </div>
      {value}
    </div>
  );
}

export default InfoCard;
