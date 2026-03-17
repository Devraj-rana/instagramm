import Header from "@/components/modern/Header";
import Footer from "@/components/modern/Footer";

export default function TermsOfService() {
  return (
    <div className="flex min-h-screen flex-col bg-[#0A0A0A] selection:bg-indigo-500/30 selection:text-indigo-200">
      <Header />
      
      <main className="flex-1 relative pt-32 pb-24 sm:pt-40">
        {/* Background Decorative Element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none translate-y-[-50%]"></div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="font-display text-5xl sm:text-6xl font-black tracking-tighter text-white mb-6">
              Terms of <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500">Service.</span>
            </h1>
            <p className="text-zinc-500 text-lg font-medium italic">
              Last updated: March 17, 2026
            </p>
          </div>

          <div className="prose prose-invert prose-zinc max-w-none space-y-12 text-zinc-400 leading-relaxed text-sm sm:text-base">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-cyan-500"></span>
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing or using Social Insight.Tech ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
                2. Use of Services
              </h2>
              <p>
                Our services are provided "as is" for analytics and social growth purposes. You agree to use the Platform only for lawful purposes and in a way that does not infringe the rights of others.
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4 text-zinc-500">
                <li>You are responsible for maintaining the confidentiality of your account.</li>
                <li>You must not use the service to harass, abuse, or harm others.</li>
                <li>Commercial use is permitted under specific plan agreements.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                3. Social Media Policies
              </h2>
              <p>
                Social Insight.Tech is not affiliated with Instagram, TikTok, YouTube, or Twitter. You are responsible for ensuring your use of our services complies with the terms and conditions of these third-party platforms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-cyan-500"></span>
                4. Payments and Refunds
              </h2>
              <p>
                Payments for social growth packages are processed immediately. Due to the nature of digital services, refunds are generally not provided once a service has commenced, except as required by law or under our 30-day refill guarantee.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
                5. Limitation of Liability
              </h2>
              <p>
                Social Insight.Tech shall not be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use the Platform. We do not guarantee specific growth results as social media algorithms are dynamic.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                6. Changes to Terms
              </h2>
              <p>
                We reserve the right to modify these terms at any time. We will notify users of any significant changes by posting the new terms on this page.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
