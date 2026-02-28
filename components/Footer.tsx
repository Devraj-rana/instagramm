'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const footerLinks = {
  Product: ['Features', 'How It Works', 'Pricing', 'FAQ'],
  Resources: ['Blog', 'Guides', 'Case Studies', 'Changelog'],
  Company: ['About', 'Careers', 'Contact', 'Partners'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
};

const socialLinks = [
  { name: 'Twitter', icon: '𝕏', href: '#', color: 'hover:text-blue-400' },
  { name: 'Instagram', icon: '📷', href: '#', color: 'hover:text-pink-400' },
  { name: 'GitHub', icon: '⚡', href: '#', color: 'hover:text-purple-400' },
  { name: 'Discord', icon: '💬', href: '#', color: 'hover:text-indigo-400' },
];

/**
 * Premium footer with newsletter subscription
 */
export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="relative border-t border-[rgba(255,255,255,0.06)] bg-black overflow-hidden">
      {/* Background effects */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />
      
      {/* Top gradient line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-linear-to-r from-transparent via-[rgba(168,85,247,0.5)] to-transparent" />
      
      {/* Gradient orbs */}
      <div className="absolute top-20 right-1/4 w-64 h-64 bg-[rgba(168,85,247,0.03)] rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-[rgba(236,72,153,0.03)] rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 py-12 sm:py-16 lg:py-20">
        {/* Top Section - Brand and Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-12 lg:mb-16 pb-12 lg:pb-16 border-b border-[rgba(255,255,255,0.06)]">
          {/* Brand Section */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-5"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-instagram rounded-xl blur-lg opacity-50" />
                <div className="relative w-10 h-10 rounded-xl bg-gradient-instagram flex items-center justify-center shadow-lg">
                  <span className="text-white text-base font-bold">IG</span>
                </div>
              </div>
              <span className="text-white font-bold text-xl">IG Analyzer</span>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-sm sm:text-base text-gray-400 leading-relaxed mb-6 max-w-md"
            >
              Unlock the full potential of your Instagram presence with AI-powered insights. 
              Get personalized recommendations and watch your engagement soar.
            </motion.p>
            
            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3"
            >
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className={`w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]
                    flex items-center justify-center text-xl
                    transition-all duration-300 hover:bg-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.15)]
                    hover:scale-110 ${social.color}`}
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </motion.div>
          </div>

          {/* Newsletter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg sm:text-xl font-bold text-white mb-3">
              Stay Updated
            </h3>
            <p className="text-sm text-gray-400 mb-5">
              Get the latest Instagram growth tips, AI insights, and platform updates delivered to your inbox.
            </p>
            
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)]
                  text-white placeholder:text-gray-500 text-sm
                  focus:outline-none focus:border-[rgba(168,85,247,0.4)] focus:bg-[rgba(255,255,255,0.05)]
                  transition-all duration-300"
                required
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 rounded-lg bg-gradient-modern text-white font-semibold text-sm
                  shadow-lg hover:shadow-xl transition-shadow duration-300 whitespace-nowrap"
              >
                {subscribed ? '✓ Subscribed!' : 'Subscribe'}
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {Object.entries(footerLinks).map(([category, links], i) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <h4 className="text-white font-bold mb-4 text-sm tracking-wide uppercase">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-gray-400 hover:text-white transition-colors duration-300 inline-flex items-center group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {link}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[rgba(255,255,255,0.06)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © 2026 <span className="text-gradient-instagram font-semibold">IG Analyzer</span>. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="text-green-400">●</span> All systems operational
            </span>
            <span>Made with ❤️ for creators</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
