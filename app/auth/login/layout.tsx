import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | ForgeFlow Industrial AEO",
  description: "Sign in to your ForgeFlow workspace to manage industrial AEO campaigns, publishing queues, and answer engine analytics.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
