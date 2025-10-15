export const getImageUrl = (url?: string): string | null => {
  if (!url) return null;

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // CDN URL과 조합
  const cdnUrl =
    process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "http://localhost:8080/images";

  const baseUrl = cdnUrl.endsWith("/") ? cdnUrl.slice(0, -1) : cdnUrl;
  const fileName = url.startsWith("/") ? url : `/${url}`;

  return `${baseUrl}${fileName}`;
};