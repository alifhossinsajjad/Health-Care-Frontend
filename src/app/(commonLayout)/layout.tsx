import { Navbar } from "@/src/components/shared/Navbar";

export default function CommonLayout({ children }: any) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
