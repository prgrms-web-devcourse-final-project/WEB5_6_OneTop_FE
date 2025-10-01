import Shell from "@/share/components/Shell";

function Layout({ children }: { children: React.ReactNode }) {
  return <Shell showFooter={false}>{children}</Shell>;
}
export default Layout;