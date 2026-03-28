"use client";

import { useEffect, useMemo, useState } from "react";
import Script from "next/script";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  ArrowRight,
  Users,
  Heart,
  Eye,
  MessageSquare,
  CreditCard,
  Zap,
  Wallet,
  Plus,
  ChevronRight,
  ChevronDown,
  Search,
  Loader2,
  Info,
  Instagram,
  Youtube,
  Music,
  Facebook,
  Twitter,
  Send,
  Linkedin,
  Disc,
  AtSign,
  Play,
  Twitch,
  Music2,
  Share2,
  ShieldCheck,
  Globe,
  RefreshCw
} from "lucide-react";

const PLATFORMS = [
  { id: "instagram", name: "Instagram", logo: "instagram", color: "from-pink-500 to-orange-500" },
  { id: "youtube", name: "YouTube", logo: "youtube", color: "from-red-600 to-red-500" },
  { id: "tiktok", name: "TikTok", logo: "tiktok", color: "from-zinc-800 to-zinc-900" },
  { id: "facebook", name: "Facebook", logo: "facebook", color: "from-blue-600 to-blue-500" },
  { id: "twitter", name: "Twitter / X", logo: "x", color: "from-zinc-800 to-zinc-900" },
  { id: "telegram", name: "Telegram", logo: "telegram", color: "from-sky-400 to-sky-300" },
  { id: "spotify", name: "Spotify", logo: "spotify", color: "from-green-500 to-green-400" },
  { id: "threads", name: "Threads", logo: "threads", color: "from-zinc-100 to-zinc-400" },
];

/** 
 * PROFESSIONAL SERVICE DEFINITIONS
 */
const SERVICES = [
  {
    id: "followers_vietnam_aplus",
    id_num: "1101",
    name: "Followers | A+ Grade | Vietnam Import | 150K-200K/Day",
    category: "Followers",
    icon: Users,
    pricePerUnit: 0.12,
    platform: "instagram",
    description: `✨Service Grade - Ⓐ+ Grade\n✨Vietnam Special Import\n✨Market's Most Stable Server\n✨One of the Most Reliable Services\n✨Made for users who want long-lasting followers\n\n➕Addition Information\n\nStart in - Instantly\n\nSpeed After Start - 150K - 200K/Day\n\nQuality - Superior\n\nDrop Ratio - Zero Loss\n\nRefill - Lifetime\n\nCancel - Button Working\n\nLink - Profile URL\n\nCorrect Format - https://www.instagram.com/your_username/`
  },
  {
    id: "followers_philippines_plus",
    id_num: "1102",
    name: "Followers | + Grade | Philippines Import | 60K-70K/Day",
    category: "Followers",
    icon: Users,
    pricePerUnit: 0.1,
    platform: "instagram",
    description: `Service Grade - + Grade\n\nPhilippines Special Import\n\nGood support Available in this service\n\nAddition Information\n\nStart in - 0 - 5 Minutes\n\nSpeed After Start - 60K - 70K/Day\n\nQuality - Supper High\n\nDrop Ratio - 0 to 2% Drop\n\nRefill - 365 Days\n\nCancel - Button Working\n\nLink - Profile URL\n\nCorrect Format - https://www.instagram.com/your_username/`
  },
  {
    id: "followers_bplus_reseller",
    id_num: "1103",
    name: "Followers | B+ Grade | Indian Resellers | 60K-70K/Day",
    category: "Followers",
    icon: Users,
    pricePerUnit: 0.09,
    platform: "instagram",
    description: `✨Service Grade - B+ Grade\n✨Working Very Smooth\n✨Good for Indian Resellers\n✨Discount Available For APis\n\n➕Addition Information\n\nStart - 0 -5 Minutes\n\nSpeed After Start - 60K-70K/Day Easily\n\nQuality - All DP Profiles\n\nDrop - Almost Stable\n\nRefill - 365 Days\n\nCancel - Button Working\n\nLink - Profile Link\n\nCorrect Format - https://www.instagram.com/your_username/`
  },
  {
    id: "followers_b_slow",
    id_num: "1104",
    name: "Followers | B Grade | Slow Overload | 250K/Day",
    category: "Followers",
    icon: Users,
    pricePerUnit: 0.08,
    platform: "instagram",
    description: `✨Service Grade - B Grade\n✨Slow When Overload\n✨No Refill in any case\n✨Cancel & Speedup not possible\n\n➕Addition Information\n\nStart - 0 -2 Hours\n\nSpeed After Start - 250K/Day\n\nQuality - Real\n\nDrop - 10 -15 Drop Normally\n\nRefill - No Refill\n\nCancel - Not Available\n\nLink - Profile Link\n\nCorrect Format - https://www.instagram.com/your_username/`
  },
  {
    id: "likes_b_grade",
    id_num: "2101",
    name: "Likes | B Grade | Stable | 10K/Day",
    category: "Likes",
    icon: Heart,
    pricePerUnit: 0.01,
    platform: "instagram",
    description: `✨Service Grade - 🅱 Grade\n✨Mostly Profiles Have DP\n✨Not Recommended For Big Orders\n✨Don’t expect high results from cheap services.\n\nStart - 0 - 15 Minutes\n\nSpeed - 10K/Day\n\nQuality - Mix DP Profiles\n\nDrop Ratio - Stable\n\nRefill - No refill in any case\n\nCancel - Available\n\nLink - Post Url`
  },
  {
    id: "likes_bplus_grade",
    id_num: "2102",
    name: "Likes | B+ Grade | Good Quality | 20K/Day",
    category: "Likes",
    icon: Heart,
    pricePerUnit: 0.015,
    platform: "instagram",
    description: `✨Service Grade - 🅱+ Grade\n✨Normally Delivers Good Quality\n✨Good For Small Orders\n✨Support Available in This Service\n\nStart - 0 - 15 Minutes\n\nSpeed - 20K/Day\n\nQuality - Good\n\nDrop Ratio - Stable\n\nRefill - 90 Days refill\n\nCancel - Available\n\nLink - Post Url`
  },
  {
    id: "likes_a_grade_fast",
    id_num: "2103",
    name: "Likes | A Grade | Fast Speed | 100K/Day",
    category: "Likes",
    icon: Heart,
    pricePerUnit: 0.018,
    platform: "instagram",
    description: `✨Service Grade - A Grade\n✨Very Good Speed Service\n✨Discount Available For All Users\n\nStart - 0 - 1 Minutes\n\nSpeed - 100K/Day\n\nQuality - Mostly DP Profiles\n\nDrop Ratio - 0 - 2%\n\nRefill - 365 Days refill\n\nCancel - Available\n\nLink - Post Url`
  },
  {
    id: "likes_a_grade_reseller",
    id_num: "2104",
    name: "Likes | A Grade | Reseller Choice | 100K/Day",
    category: "Likes",
    icon: Heart,
    pricePerUnit: 0.02,
    platform: "instagram",
    description: `✨Service Grade - A Grade\n✨Mostly Starts instantly\n✨Recommended For Resellers\n✨Discount Available For All Users\n\nStart - 0 - 30 Seconds Normally\n\nSpeed - 100K/Day\n\nQuality - DP Profiles\n\nDrop Ratio - Non Drop\n\nRefill - Lifetime refill\n\nCancel - Available\n\nLink - Post Url`
  },
  {
    id: "likes_aplus_grade",
    id_num: "2105",
    name: "Likes | A+ Grade | Big Orders | 300K/Day",
    category: "Likes",
    icon: Heart,
    pricePerUnit: 0.025,
    platform: "instagram",
    description: `✨Service Grade - A+ Grade\n✨Best For Big Orders\n✨No Stuck or Delay Issue\n✨Delivers Very High Quality\n✨Good Support in this Service\n✨Normally Looks Likes Real Likes\n\nStart - 0 - 1 Minutes Normally\n\nSpeed - 300K/Day\n\nQuality - 100% Old Accounts\n\nDrop - Zero Drop\n\nRefill - Lifetime refill\n\nCancel - Available\n\nLink - Post Url`
  },
  {
    id: "likes_lifetime_indian",
    id_num: "799",
    name: "Instagram Likes | Lifetime | Indian Story Accounts",
    category: "Likes",
    icon: Heart,
    pricePerUnit: 0.025,
    platform: "instagram",
    description: `Instagram Likes l- Lifetime -I\n\nGrade - A\n\n101% Indian with 90% Story Accounts\n\nRefill - Lifetime\n\nLink - Post Url`
  },
  {
    id: "views_aplus_instant",
    id_num: "1201",
    name: "Views | A+ | Instant Views | 10 Million/Day",
    category: "Views",
    icon: Eye,
    pricePerUnit: 0.01,
    platform: "instagram",
    description: `Read Description before order\n\nService Grade - A+\n\nUse If You wants Instant Views\n\nCancel button working in this service\n\nThis Service Always Works\n\nAddition Information\n\nStart - in one Click\n\nSpeed After Start - Approx 10 Million/Day\n\nDrop Ratio - Non Drop\n\nRefill - Possible if less deliver\n\nCancel - Available\n\nLink - Reel Link`
  },
  {
    id: "views_aplus_big_orders",
    id_num: "1202",
    name: "Views | A+ | Big Orders | 1 Million/Day",
    category: "Views",
    icon: Eye,
    pricePerUnit: 0.02,
    platform: "instagram",
    description: `📈Service Grade - A+\n✨Best for Big Orders\n✨Mostly Instant Start\n✨Cancel Button Working\n✨ Instant Support Available\n\n➕Addition Information\n\nStart - Instantly Normally\n\nSpeed After Start - Approx 1Million/Day\n\nDrop Ratio - Non Drop\n\nRefill - Possible if less deliver\n\nCancel - Possible\n\nLink - Reel Link`
  },
  {
    id: "views_aplus_reach_profile",
    id_num: "1203",
    name: "Views | A+ | Reach + Profile Visits | 1 Million/Day",
    category: "Views",
    icon: Eye,
    pricePerUnit: 0.03,
    platform: "instagram",
    description: `Read Description before order\n\nService Grade - A+\n\nYou will also get reach and profile visits along with views.\n\nAddition Information\n\nStart - Instantly\n\nSpeed After Start - Approx 1Million/Day\n\nDrop Ratio - Non Drop\n\nRefill - No Drop\n\nCancel - Available\n\nLink - Reel Link`
  },
  {
    id: "custom_comments_manual",
    id_num: "1300",
    name: "Custom Comments | One Per Line | Manual Text",
    category: "Comments",
    icon: MessageSquare,
    pricePerUnit: 0.09,
    platform: "instagram",
    description: `Service Grade - A Grade\n\nCustom text comments by user input\n\nUse one comment per line in the custom comments box\n\nAddition Information\n\nNormally Start in - 0 - 30 Minutes\n\nSpeed After Start - Fast\n\nQuality - Custom Input\n\nDrop - Stable\n\nRefill/Partial - As per service\n\nCancel - Manual\n\nLink - Post URL or Reel URL`
  },
  {
    id: "random_comments_b_grade",
    id_num: "1301",
    name: "Random Comments | B Grade | Good Delivery",
    category: "Comments",
    icon: MessageSquare,
    pricePerUnit: 0.04,
    platform: "instagram",
    description: `Service Grade - B Grade\n\nSometimes have less delivery\n\nOnly 1-2% orders have issue\n\nNormally working well without any issue\n\n+Addition Information\n\nNormally Start in - 0 - 6 Hours\n\nSpeed After Start - Good\n\nQuality - Good\n\nDrop - Not Normally\n\nRefill/Partial - Not possible\n\nCancel - Manual\n\nLink - Post URL`
  },
  {
    id: "random_comments_a_grade",
    id_num: "1302",
    name: "Random Comments | A Grade | Indian",
    category: "Comments",
    icon: MessageSquare,
    pricePerUnit: 0.07,
    platform: "instagram",
    description: `Service Grade - A Grade\n\nTrusted by many Indian clients Service is stable and consistent Refill support available (if needed) Guarantee for comments only, not for quality.\n\n-Addition Information\n\nNormally Start in - 0 - 45 Minutes\n\nSpeed After Start -Supper fast\n\nQuality - Indian\n\nDrop - Non Drop\n\nRefill/ Partial - 365 Days possible\n\nCancel - Manual\n\nLink - Post URL`
  },
  {
    id: "random_comments_bplus_negative",
    id_num: "1303",
    name: "Random Comments | B+ Grade | Negative Quality",
    category: "Comments",
    icon: MessageSquare,
    pricePerUnit: 0.051,
    platform: "instagram",
    description: `Service Grade - B+ Grade\n\nSpeed up possible\n\nSupport available in this service\n\nWorking well without any issue\n\nGuarantee for comments only, not for quality.\n\n-Addition Information\n\nNormally Start in - 0 - 1 Hours\n\nSpeed After Start - Fast\n\nQuality - Negative\n\nDrop - Non Drop\n\nRefill/ Partial - 30 Days possible\n\nCancel - Manual\n\nLink - Post URL`
  },
  {
    id: "random_comments_bplus_positive",
    id_num: "1304",
    name: "Random Comments | B+ Grade | Positive Quality",
    category: "Comments",
    icon: MessageSquare,
    pricePerUnit: 0.053,
    platform: "instagram",
    description: `Service Grade - B+ Grade\n\nSpeed up possible\n\nSupport available in this service\n\nWorking well without any issue\n\nGuarantee for comments only, not for quality.\n\nAddition Information\n\nNormally Start in - 0 - 1 Hours\n\nSpeed After Start - Fast\n\nQuality - Positive\n\nDrop - Non Drop\n\nRefill/ Partial - 30 Days possible\n\nCancel - Manual\n\nLink - Post URL`
  },
];

export default function OrderFlow() {
  const [step, setStep] = useState(1); // 1: Form, 2: Success
  const [walletBalance, setWalletBalance] = useState(0);

  const [selection, setSelection] = useState({
    platform: "instagram",
    category: "",
    serviceId: "",
    quantity: 100,
    username: "",
  });

  const [isPlatformOpen, setIsPlatformOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isServiceOpen, setIsServiceOpen] = useState(false);
  const [isQuickServiceOpen, setIsQuickServiceOpen] = useState(false);
  const [quickServiceSearch, setQuickServiceSearch] = useState("");
  const [platformSearch, setPlatformSearch] = useState("");
  const [catSearch, setCatSearch] = useState("");
  const [serviceSearch, setServiceSearch] = useState("");

  const filteredPlatforms = useMemo(() => 
    PLATFORMS.filter(p => p.name.toLowerCase().includes(platformSearch.toLowerCase())), 
    [platformSearch]
  );

  const selectedPlatformData = useMemo(() => 
    PLATFORMS.find(p => p.id === selection.platform), 
    [selection.platform]
  );

  const platformServices = useMemo(() => {
    return SERVICES.filter(s => s.platform === selection.platform);
  }, [selection.platform]);

  const quickServiceResults = useMemo(() => {
    const query = quickServiceSearch.trim().toLowerCase();
    if (!query) return [];

    return platformServices
      .filter((s) => `${s.id_num} ${s.name} ${s.category}`.toLowerCase().includes(query))
      .slice(0, 10);
  }, [quickServiceSearch, platformServices]);

  const categories = useMemo(() => {
    return Array.from(new Set(
      SERVICES
        .filter(s => s.platform === selection.platform)
        .map(s => s.category)
    ));
  }, [selection.platform]);

  const filteredCategories = categories.filter(c => c.toLowerCase().includes(catSearch.toLowerCase()));

  const selectedService = useMemo(() => SERVICES.find(s => s.id === selection.serviceId), [selection.serviceId]);
  const availableServices = useMemo(() => {
    return SERVICES.filter(s => 
      s.category === selection.category && 
      s.platform === selection.platform
    );
  }, [selection.category, selection.platform]);
  const filteredServices = availableServices.filter(s => s.name.toLowerCase().includes(serviceSearch.toLowerCase()));

  const totalPrice = useMemo(() => {
    return selectedService ? (selectedService.pricePerUnit * selection.quantity).toFixed(2) : "0.00";
  }, [selectedService, selection.quantity]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState<string>("50");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [customComments, setCustomComments] = useState("");

  const loadWalletBalance = async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) return null;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("wallet_balance")
      .eq("id", userData.user.id)
      .maybeSingle();

    if (profileError || !profile) return userData.user.id;

    setWalletBalance(Number(profile.wallet_balance ?? 0));
    return userData.user.id;
  };

  useEffect(() => {
    void loadWalletBalance();
  }, []);

  const getLinkRuleText = () => {
    if (selection.platform !== "instagram") return "Enter target link";

    if (selection.category === "Followers") {
      return "Use public profile link: https://www.instagram.com/your_username/";
    }

    if (selection.category === "Likes") {
      return "Use post or reel link from a public account";
    }

    if (selection.category === "Views") {
      return "Use reel link only";
    }

    if (
      selection.category === "Comments" &&
      selectedService &&
      /random comments/i.test(selectedService.name)
    ) {
      return "Use public post or reel link";
    }

    if (
      selection.category === "Comments" &&
      selectedService &&
      /custom/i.test(selectedService.name)
    ) {
      return "Use public post or reel link, then add one custom comment per line below";
    }

    return "Enter Instagram target link";
  };

  const validateInstagramTargetLink = (link: string) => {
    const normalizedLink = link.trim();

    try {
      const url = new URL(normalizedLink);
      const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
      const path = url.pathname.replace(/\/$/, "");

      if (hostname !== "instagram.com") {
        return "Please enter a valid Instagram URL.";
      }

      if (selection.category === "Followers") {
        // Profile URL should not be post/reel/story endpoints.
        if (!path || path === "/") return "Please enter a public Instagram profile URL.";
        if (/^\/(p|reel|reels|tv|stories)\//.test(path)) {
          return "Followers require a public Instagram profile URL.";
        }
        return null;
      }

      if (selection.category === "Likes") {
        if (!/^\/(p|reel)\//.test(path)) {
          return "Likes require a post or reel URL from a public account.";
        }
        return null;
      }

      if (selection.category === "Views") {
        if (!/^\/reel\//.test(path)) {
          return "Views require a reel URL only.";
        }
        return null;
      }

      if (
        selection.category === "Comments" &&
        selectedService &&
        /random comments/i.test(selectedService.name)
      ) {
        if (!/^\/(p|reel)\//.test(path)) {
          return "Random comments require a public post or reel URL.";
        }
        return null;
      }

      return null;
    } catch {
      return "Please enter a valid Instagram URL.";
    }
  };

  const handleSubmit = async () => {
    const isCustomCommentService =
      selection.category === "Comments" &&
      !!selectedService &&
      /custom/i.test(`${selectedService.name} ${selectedService.description}`);

    const commentLines = customComments
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (!selection.username.trim()) {
      alert("Please enter target link.");
      return;
    }

    if (isCustomCommentService && commentLines.length === 0) {
      alert("Please enter custom comments. Use one comment per line.");
      return;
    }

    if (
      selection.platform === "instagram" &&
      (["Followers", "Likes", "Views"].includes(selection.category) ||
        (selection.category === "Comments" && !!selectedService && /random comments/i.test(selectedService.name)))
    ) {
      const linkError = validateInstagramTargetLink(selection.username);
      if (linkError) {
        alert(linkError);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        alert("You must be logged in to place an order.");
        setIsSubmitting(false);
        return;
      }
      const userId = userData.user.id;
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("wallet_balance")
        .eq("id", userId)
        .maybeSingle();

      if (profileError || !profile) {
        alert("Could not fetch wallet balance.");
        setIsSubmitting(false);
        return;
      }

      const balance = parseFloat(profile.wallet_balance);
      const price = parseFloat(totalPrice);
      if (balance < price) {
        alert("Insufficient wallet balance.");
        setIsSubmitting(false);
        return;
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ wallet_balance: balance - price })
        .eq("id", userId);

      if (updateError) throw updateError;

      setWalletBalance(Number((balance - price).toFixed(2)));

      const { data, error } = await supabase
        .from('orders')
        .insert([
          {
            user_id: userId,
            platform: selection.platform,
            service: selection.serviceId,
            quantity: selection.quantity,
            target_username: isCustomCommentService
              ? `${selection.username}\n\nComments:\n${commentLines.join("\n")}`
              : selection.username,
            total_price: price,
            status: 'pending'
          }
        ])
        .select();

      if (error) throw error;
      setOrderId(data[0].id);

      // Financial Log
      await supabase
        .from("wallet_transactions")
        .insert({
          user_id: userId,
          amount: price,
          type: "debit",
          description: `${selection.serviceId} for ${selection.platform}`,
          metadata: {
            order_id: data[0].id,
            target: selection.username,
            quantity: selection.quantity,
            custom_comments: commentLines,
          }
        });

      setStep(2);
    } catch (error) {
      console.error("Order error:", error);
      alert("Failed to submit order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const executeAddFunds = async () => {
    let amountStr = topUpAmount.trim();
    if (!amountStr) return;
    const amount = Math.floor(Number(amountStr));
    if (isNaN(amount) || amount < 10) return alert("Min. ₹10");

    setIsProcessingPayment(true);
    try {
      const userId = await loadWalletBalance();
      if (!userId) {
        setIsProcessingPayment(false);
        return;
      }

      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const order = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "SMM Dashboard",
        description: "Wallet Top-up",
        order_id: order.id,
        handler: async function (response: any) {
          const verifyRes = await fetch("/api/razorpay/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount,
              userId,
            }),
          });
          const result = await verifyRes.json();
          if (result.success) {
            await loadWalletBalance();
            setIsTopUpModalOpen(false);
            alert("Funds added!");
          }
          setIsProcessingPayment(false);
        },
        modal: { ondismiss: () => setIsProcessingPayment(false) },
        theme: { color: "#4f46e5" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-20 px-6 relative">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      {/* Top Up Modal */}
      <AnimatePresence>
        {isTopUpModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTopUpModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm rounded-2xl border border-zinc-700 bg-zinc-950 p-6 shadow-2xl"
            >
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-500/15 flex items-center justify-center">
                    <Wallet className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white uppercase">Add Funds</h2>
                    <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Minimum amount: 10 INR</p>
                  </div>
                </div>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-black">INR</span>
                  <input
                    type="text"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full h-12 bg-zinc-900 border border-zinc-700 rounded-xl pl-14 pr-4 text-xl font-black text-white outline-none focus:ring-2 focus:ring-indigo-500/40"
                    placeholder="0"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setIsTopUpModalOpen(false)}
                    className="h-11 rounded-xl border border-zinc-700 text-zinc-300 font-black uppercase text-xs hover:bg-zinc-900 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={executeAddFunds}
                    disabled={isProcessingPayment || !topUpAmount || Number(topUpAmount) < 10}
                    className="h-11 rounded-xl bg-white text-black font-black uppercase text-xs hover:bg-zinc-200 transition-all disabled:opacity-20"
                  >
                    {isProcessingPayment ? <Loader2 className="animate-spin h-5 w-5 mx-auto" /> : "Proceed"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Dashboard UI */}
      <div className="bg-[#0F0F11] border border-white/10 rounded-[3rem] shadow-2xl relative">
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white/[0.02] border-b border-white/5 px-8 sm:px-12 py-8 gap-6">
          <div className="flex items-center gap-6">
            <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Zap className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white italic uppercase">New Order</h1>
              <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">Efficiency Dashboard v2.0</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest leading-none mb-1">Balance</p>
              <p className="text-2xl font-black text-white">₹{walletBalance.toFixed(2)}</p>
            </div>
            <button
              onClick={() => setIsTopUpModalOpen(true)}
              className="h-12 w-12 rounded-xl bg-white text-black flex items-center justify-center hover:scale-105 transition-all"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-8 sm:p-12">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                <div className="lg:col-span-3 space-y-10">
                  {/* Quick Service Search */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Quick Service Search</label>
                    <div className="relative">
                      <div className="relative">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                        <input
                          value={quickServiceSearch}
                          onFocus={() => setIsQuickServiceOpen(true)}
                          onChange={(e) => {
                            setQuickServiceSearch(e.target.value);
                            setIsQuickServiceOpen(true);
                          }}
                          placeholder="Search by service ID, name, or category..."
                          className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 text-white font-black outline-none"
                        />
                      </div>

                      {isQuickServiceOpen && quickServiceSearch.trim() && (
                        <div data-lenis-prevent className="absolute top-full left-0 right-0 mt-2 bg-[#111114] border border-white/10 rounded-2xl p-2 z-[70] shadow-2xl max-h-72 overflow-y-auto overscroll-contain custom-scrollbar">
                          {quickServiceResults.length > 0 ? (
                            quickServiceResults.map((s) => (
                              <button
                                key={`quick-${s.id}`}
                                onClick={() => {
                                  setSelection({ ...selection, category: s.category, serviceId: s.id });
                                  setIsQuickServiceOpen(false);
                                  setIsCategoryOpen(false);
                                  setIsServiceOpen(false);
                                  setQuickServiceSearch(`${s.id_num} - ${s.name}`);
                                  setServiceSearch("");
                                }}
                                className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 transition-all"
                              >
                                <div className="flex items-center justify-between gap-4">
                                  <div className="min-w-0">
                                    <p className="text-white font-black text-xs truncate">#{s.id_num} - {s.name}</p>
                                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">{s.category}</p>
                                  </div>
                                  <span className="text-indigo-400 font-black text-[10px] shrink-0">₹{(s.pricePerUnit * 1000).toFixed(2)} /k</span>
                                </div>
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-6 text-center text-zinc-500 text-xs font-black uppercase tracking-widest">
                              No matching services
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Platform Selection Dropdown */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Growth Platform</label>
                    <div className="relative">
                      <button
                        onClick={() => {
                          setIsPlatformOpen(!isPlatformOpen);
                          setIsCategoryOpen(false);
                          setIsServiceOpen(false);
                        }}
                        className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 flex items-center justify-between text-white hover:bg-white/[0.08] transition-all"
                      >
                        <div className="flex items-center gap-4">
                          {selectedPlatformData && (
                            <div className={`h-8 w-8 rounded-lg bg-linear-to-br ${selectedPlatformData.color} flex items-center justify-center p-1.5`}>
                              <img 
                                src={`https://cdn.simpleicons.org/${selectedPlatformData.logo}/white`} 
                                className="h-full w-full object-contain" 
                                alt={selectedPlatformData.name}
                              />
                            </div>
                          )}
                          <span className="font-black text-lg">{selectedPlatformData?.name || "Select Platform..."}</span>
                        </div>
                        <ChevronDown className={`h-6 w-6 text-zinc-600 transition-transform ${isPlatformOpen ? "rotate-180" : ""}`} />
                      </button>

                      {isPlatformOpen && (
                        <div className="absolute top-full left-0 right-0 mt-3 bg-[#111114] border border-white/10 rounded-2xl z-[60] shadow-2xl overflow-hidden">
                          <div className="p-4 border-b border-white/5 bg-white/2">
                            <div className="relative">
                              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                              <input 
                                autoFocus
                                value={platformSearch}
                                onChange={(e) => setPlatformSearch(e.target.value)}
                                placeholder="Search platform..."
                                className="w-full bg-black/40 border-none rounded-xl h-12 pl-12 pr-4 text-sm text-white outline-none"
                              />
                            </div>
                          </div>
                          <div data-lenis-prevent className="max-h-64 overflow-y-auto overscroll-contain p-2 custom-scrollbar">
                            {filteredPlatforms.map(p => (
                              <button
                                key={p.id}
                                onClick={() => {
                                  setSelection({ ...selection, platform: p.id, category: "", serviceId: "" });
                                  setIsPlatformOpen(false);
                                  setPlatformSearch("");
                                }}
                                className="w-full text-left px-5 py-4 rounded-xl hover:bg-white/5 text-zinc-500 hover:text-white transition-all group flex items-center justify-between"
                              >
                                <div className="flex items-center gap-4">
                                  <div className={`h-8 w-8 rounded-lg bg-linear-to-br ${p.color} flex items-center justify-center p-1.5 opacity-70 group-hover:opacity-100 transition-opacity`}>
                                    <img 
                                      src={`https://cdn.simpleicons.org/${p.logo}/white`} 
                                      className="h-full w-full object-contain" 
                                      alt={p.name}
                                    />
                                  </div>
                                  <span className="text-sm font-black uppercase tracking-tight">{p.name}</span>
                                </div>
                                <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-3 group-hover:translate-x-0" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Category</label>
                    <div className="relative">
                      <button onClick={() => { setIsCategoryOpen(!isCategoryOpen); setIsQuickServiceOpen(false); }} className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 flex items-center justify-between text-white font-black text-lg">
                        {selection.category || "Select Category"}
                        <ChevronDown className={`h-5 w-5 transition-transform ${isCategoryOpen ? "rotate-180" : ""}`} />
                      </button>
                      {isCategoryOpen && (
                        <div data-lenis-prevent className="absolute top-full left-0 right-0 mt-2 bg-[#111114] border border-white/10 rounded-2xl p-2 z-[55] shadow-2xl overflow-hidden">
                          {categories.map(cat => (
                            <button key={cat} onClick={() => { setSelection({ ...selection, category: cat, serviceId: "" }); setIsCategoryOpen(false); }} className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white font-black uppercase text-xs">
                              {cat}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={`space-y-4 transition-all ${!selection.category ? "opacity-20" : "opacity-100"}`}>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Service Package</label>
                    <div className="relative">
                      <button onClick={() => { setIsServiceOpen(!isServiceOpen); setIsQuickServiceOpen(false); }} className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 flex items-center justify-between text-white font-black">
                        <span className="truncate">{selectedService ? `${selectedService.id_num} - ${selectedService.name}` : "Pick Package"}</span>
                        <ChevronDown className={`h-5 w-5 transition-transform ${isServiceOpen ? "rotate-180" : ""}`} />
                      </button>
                      {isServiceOpen && (
                        <div data-lenis-prevent className="absolute top-full left-0 right-0 mt-2 bg-[#111114] border border-white/10 rounded-2xl p-2 z-50 max-h-60 overflow-y-auto overscroll-contain custom-scrollbar shadow-2xl">
                          <div className="sticky top-0 z-10 p-2 bg-[#111114] border-b border-white/5">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                              <input
                                autoFocus
                                value={serviceSearch}
                                onChange={(e) => setServiceSearch(e.target.value)}
                                placeholder="Search package..."
                                className="w-full bg-black/40 border-none rounded-xl h-10 pl-10 pr-3 text-xs text-white outline-none"
                              />
                            </div>
                          </div>
                          {filteredServices.map(s => (
                            <button key={s.id} onClick={() => { setSelection({ ...selection, serviceId: s.id }); setIsServiceOpen(false); }} className="w-full text-left px-4 py-4 rounded-xl hover:bg-white/5 group">
                              <div className="flex justify-between items-center">
                                <span className="text-white font-black uppercase text-xs">#{s.id_num} - {s.name}</span>
                                <span className="text-indigo-400 font-black text-[10px]">₹{(s.pricePerUnit * 1000).toFixed(2)} /k</span>
                              </div>
                            </button>
                          ))}
                          {filteredServices.length === 0 && (
                            <div className="px-4 py-6 text-center text-zinc-500 text-xs font-black uppercase tracking-widest">
                              No service found in this category
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={`grid grid-cols-1 sm:grid-cols-2 gap-8 transition-all ${!selectedService ? "opacity-20" : "opacity-100"}`}>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Quantity</label>
                      <input type="number" value={selection.quantity} onChange={(e) => setSelection({ ...selection, quantity: parseInt(e.target.value) || 0 })} className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 text-white font-black text-xl outline-none" />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Target Username/Link</label>
                      <input type="text" value={selection.username} onChange={(e) => setSelection({ ...selection, username: e.target.value })} className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 text-white font-black outline-none" placeholder={getLinkRuleText()} />
                      <p className="text-[10px] font-black uppercase tracking-wider text-zinc-600">{getLinkRuleText()}</p>
                    </div>
                  </div>

                  {selection.category === "Comments" && selectedService && /custom/i.test(`${selectedService.name} ${selectedService.description}`) && (
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Custom Comments (One Per Line)</label>
                      <textarea
                        value={customComments}
                        onChange={(e) => setCustomComments(e.target.value)}
                        placeholder="Awesome post!&#10;Great content 👏&#10;Loved this reel"
                        className="w-full min-h-32 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-black outline-none resize-y"
                      />
                      <p className="text-[10px] font-black uppercase tracking-wider text-zinc-600">For custom-comment services, enter one comment on each line.</p>
                    </div>
                  )}

                  {selectedService && (
                    <div className="bg-linear-to-r from-indigo-500/10 to-pink-500/10 rounded-3xl p-8 border border-white/10 flex justify-between items-center mt-10">
                      <div>
                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Total Payable</p>
                        <p className="text-4xl font-black text-white italic">₹{totalPrice}</p>
                      </div>
                      <button onClick={handleSubmit} disabled={isSubmitting || !selection.username} className="px-12 h-16 rounded-2xl bg-white text-black font-black uppercase hover:scale-105 transition-all disabled:opacity-20 shadow-xl shadow-white/10">
                        {isSubmitting ? "Processing..." : "Place Order"}
                      </button>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-2">
                  <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 h-full min-h-[400px]">
                    <div className="flex items-center gap-3 mb-8">
                      <Info className="h-5 w-5 text-indigo-400" />
                      <h3 className="text-xs font-black text-white uppercase tracking-widest">Instance Details</h3>
                    </div>
                    <div className="text-[11px] leading-relaxed text-zinc-500 font-bold uppercase tracking-widest whitespace-pre-wrap">
                      {selectedService ? selectedService.description : "Initialize a package to view specs"}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="success" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-20 space-y-10">
                <div className="mx-auto h-32 w-32 rounded-3xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/50">
                   <CheckCircle2 className="h-16 w-16 text-white" />
                </div>
                <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter">Order Established</h2>
                <div className="flex gap-6 justify-center">
                  <button onClick={() => { setStep(1); setSelection({ ...selection, serviceId: "", username: "" }); setCustomComments(""); }} className="px-10 h-14 rounded-xl bg-white text-black font-black uppercase">Another Order</button>
                  <a href="/account" className="px-10 h-14 rounded-xl bg-white/5 border border-white/10 text-white flex items-center justify-center font-black uppercase">Dashboard</a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Features / Trust Section */}
        <div className="bg-white/[0.01] border-t border-white/5 p-8 sm:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/[0.02] transition-colors group">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/10 group-hover:scale-110 transition-transform">
                <Zap className="h-5 w-5 text-indigo-400" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Instant Start</h4>
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider leading-relaxed">Processing begins in minutes</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/[0.02] transition-colors group">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-pink-500/10 flex items-center justify-center border border-pink-500/10 group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-5 w-5 text-pink-400" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest leading-none">100% Secure</h4>
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider leading-relaxed">No password required ever</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/[0.02] transition-colors group">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/10 group-hover:scale-110 transition-transform">
                <Globe className="h-5 w-5 text-cyan-400" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Global Reach</h4>
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider leading-relaxed">High quality global network</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/[0.02] transition-colors group">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/10 group-hover:scale-110 transition-transform">
                <RefreshCw className="h-5 w-5 text-green-400" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Refill Guarantee</h4>
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider leading-relaxed">30-day drop protection</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
