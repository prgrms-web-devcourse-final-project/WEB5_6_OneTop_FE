import Shell from "@/share/components/Shell";

function layout({ children }: { children: React.ReactNode }) {
  return <Shell headerVariant="default">{children}</Shell>;
}
export default layout;
