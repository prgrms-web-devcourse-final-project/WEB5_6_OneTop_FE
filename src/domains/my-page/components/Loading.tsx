export default function Loading() {
  return (
    <div className="flex flex-col items-center py-8 gap-2">
      <div className="flex gap-2">
        <span className="w-2 h-2 rounded-full bg-deep-navy animate-bounce delay-0"></span>
        <span className="w-2 h-2 rounded-full bg-deep-navy animate-bounce delay-150"></span>
        <span className="w-2 h-2 rounded-full bg-deep-navy animate-bounce delay-300"></span>
      </div>
      <span className="text-deep-navy font-medium">로딩중</span>
    </div>
  );
}
