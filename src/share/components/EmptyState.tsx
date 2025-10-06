import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  linkText: string;
  linkHref: string;
  showBackground?: boolean;
}

export default function EmptyState({
  title,
  description,
  linkText,
  linkHref,
  showBackground = false,
}: EmptyStateProps) {
  const containerClass = showBackground
    ? "min-h-screen bg-gray-100 flex items-center justify-center"
    : "py-20 flex items-center justify-center";

  return (
    <div className={containerClass}>
      <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>
        <p className="text-gray-600 mb-6">{description}</p>
        <Link
          href={linkHref}
          className="block w-full bg-deep-navy text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition"
        >
          {linkText}
        </Link>
      </div>
    </div>
  );
}
