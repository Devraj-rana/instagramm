import Header from "@/components/modern/Header";
import Footer from "@/components/modern/Footer";
import ServicesSection from "@/components/modern/ServicesSection";

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#050505] selection:bg-indigo-500/30 selection:text-indigo-200">
      <Header />
      <main className="flex-1 pt-20">
        <ServicesSection />
      </main>
      <Footer />
    </div>
  );
}
