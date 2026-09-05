import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth } from "@/lib/firebase-admin";

async function requireAdminSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) redirect("/admin/login");

  try {
    await adminAuth.verifySessionCookie(session, true);
  } catch {
    redirect("/admin/login");
  }
}

async function logoutAction() {
  "use server";
  const cookieStore = await cookies();
  cookieStore.delete("session");
  redirect("/admin/login");
}

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  await requireAdminSession();

  return (
    <div className="mx-auto max-w-5xl">
      <div className="sticky top-0 z-20 bg-indigo-deep px-5 pt-5 pb-3 text-white md:px-8">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">Kitchen Admin</span>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-[12px] text-indigo-tint/80 underline">
              View site
            </Link>
            <form action={logoutAction}>
              <button type="submit" className="text-[12px] text-indigo-tint/80 underline">
                Log out
              </button>
            </form>
          </div>
        </div>
        <nav className="mt-3 flex gap-4 text-[13px]">
          <Link href="/admin/orders" className="border-b-2 border-transparent pb-2 text-white/90 hover:border-white/40">
            Orders
          </Link>
          <Link href="/admin/menu" className="border-b-2 border-transparent pb-2 text-white/90 hover:border-white/40">
            Menu
          </Link>
        </nav>
      </div>
      {children}
    </div>
  );
}
