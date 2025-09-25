function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-screen h-screen bg-deep-navy relative">
      <div
        className="w-full h-full flex items-center justify-center flex-col"
        style={{
          background:
            "linear-gradient(246deg, rgba(217, 217, 217, 0.00) 41.66%, rgba(130, 79, 147, 0.15) 98.25%)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
export default layout;
