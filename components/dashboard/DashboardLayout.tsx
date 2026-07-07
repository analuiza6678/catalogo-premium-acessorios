import { MobileNav } from "./MobileNav";
import { Sidebar } from "./Sidebar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_6%_10%,rgba(215,174,74,0.10),transparent_26%),radial-gradient(circle_at_94%_0%,rgba(234,219,200,0.64),transparent_34%),linear-gradient(135deg,#FAF6EF_0%,#F5EDE2_55%,#FAF6EF_100%)] text-[#1E1D1B] lg:flex">
      <Sidebar />
      <main className="min-w-0 flex-1 px-4 py-5 pb-28 sm:px-6 lg:px-8 lg:py-8 lg:pb-8">
        <div className="mx-auto w-full max-w-[1440px]">{children}</div>
      </main>
      <MobileNav />
    </div>
  );
}
