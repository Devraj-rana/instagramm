import Header from "@/components/modern/Header";
import Footer from "@/components/modern/Footer";

export default function PrivacyPage() {
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
              Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500">Policy.</span>
            </h1>
            <p className="text-zinc-500 text-lg font-medium italic">
              Last updated: March 17, 2026
            </p>
          </div>

          <div className="prose prose-invert prose-zinc max-w-none space-y-12 text-zinc-400 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
                Introduction
              </h2>
              <p>
                At SocialInsight.Tech, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services, including our analytics tools and social media growth packages.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                Information We Collect
              </h2>
              <p>
                To provide our premium services, we may collect the following types of information:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong className="text-zinc-200">Personal Information:</strong> Name, email address, and payment information when you purchase a service or sign in with Google.</li>
                <li><strong className="text-zinc-200">Social Media Data:</strong> Publicly available usernames and profile data you provide for analysis or growth services. We never ask for your social media passwords.</li>
                <li><strong className="text-zinc-200">Usage Data:</strong> Information about how you interact with our platform, including IP addresses, browser types, and page views.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-pink-500"></span>
                How We Use Your Information
              </h2>
              <p>
                We use the collected data to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Deliver our social media growth and analytics services.</li>
                <li>Process payments and provide customer support.</li>
                <li>Improve our AI algorithms and user experience.</li>
                <li>Comply with legal obligations and prevent fraud.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
                Data Security
              </h2>
              <p>
                We implement industry-standard security measures to protect your data. All transactions are encrypted, and we do not store sensitive payment details on our servers. We use trusted third-party payment processors to handle your financial information securely.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                Third-Party Services
              </h2>
              <p>
                Our platform integrates with third-party services like Google Authentication and payment gateways. These services have their own privacy policies, and we encourage you to review them. We do not sell your personal data to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-pink-500"></span>
                Contact Us
              </h2>
              <p>
                If you have any questions about this Privacy Policy, please contact our support team at <span className="text-indigo-400 font-bold">support@socialinsight.tech</span>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
