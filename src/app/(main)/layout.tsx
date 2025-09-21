import Shell from "@/share/components/Shell";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Shell>{children}</Shell>;
}
