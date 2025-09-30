const LoadingSpinner = ({ message }: { message: string }) => (
  <div className="flex items-center justify-center gap-3 text-white">
    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
    <span>{message}</span>
  </div>
);

export default LoadingSpinner;
