import Shell from "@/share/components/Shell";
import ScrollSmootherProvider from "@/share/providers/ScrollSmoothProvider";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ScrollSmootherProvider>
      <Shell headerVariant="transparent">{children}</Shell>
    </ScrollSmootherProvider>
  );
}
