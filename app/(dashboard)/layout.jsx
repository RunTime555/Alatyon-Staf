import { Sidebar } from "@/components/sidebar";
import { Footer } from "@/components/footer";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
