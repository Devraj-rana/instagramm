import { Metadata } from "next";
import { baseUrl } from "@/lib/seo-utils";
import AuthPage from "@/components/auth/AuthPage";

export const metadata: Metadata = {
  title: "Sign Up | Social Insight.Tech",
  description: "Create a Social Insight.Tech account to start analyzing Instagram profiles and unlocking powerful insights.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: `${baseUrl}/sign-up`,
  },
};

export default function SignUpPage() {
  return <AuthPage mode="sign-up" />;
}
