import Header from "@/components/modern/Header";
import Footer from "@/components/modern/Footer";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default function AdminPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#050505] selection:bg-cyan-500/30 selection:text-cyan-100">
      <Header />
      <main className="flex-1 px-6 pb-20 pt-28">
        <div className="mx-auto max-w-7xl">
          <AdminDashboard />
        </div>
      </main>
      <Footer />
    </div>
  );
}
