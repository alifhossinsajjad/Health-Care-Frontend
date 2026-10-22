import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { Navbar } from "@/src/components/shared/Navbar";
import { Footer } from "@/src/components/shared/Footer";

export default async function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  let isLoggedIn = !!token;
  let userRole = "PATIENT";

  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      userRole = decoded?.role || "PATIENT";
    } catch {
      // safe fallback if malformed token
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <Navbar initialIsLoggedIn={isLoggedIn} initialUserRole={userRole} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
