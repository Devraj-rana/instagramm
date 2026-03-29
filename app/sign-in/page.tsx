import { Metadata } from "next";
import { baseUrl } from "@/lib/seo-utils";
import AuthPage from "@/components/auth/AuthPage";

export const metadata: Metadata = {
  title: "Sign In | Social Insight.Tech",
  description: "Sign in to your Social Insight.Tech account to access Instagram analytics and insights.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: `${baseUrl}/sign-in`,
  },
};

export default function SignInPage() {
  return <AuthPage mode="sign-in" />;
}
