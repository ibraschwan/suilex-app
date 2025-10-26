import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import { SuiProvider } from "@/components/providers/SuiProvider";
import { ToastProvider } from "@/components/ui/Toast";
import { OnboardingProvider } from "@/components/onboarding/OnboardingProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Suilex - Decentralized AI Data Marketplace",
  description: "A decentralized marketplace on Sui where you can sell your valuable, verified data directly to AI companies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} ${firaCode.variable} antialiased`}>
        <SuiProvider>
          <ToastProvider>
            <OnboardingProvider>
              {children}
            </OnboardingProvider>
          </ToastProvider>
        </SuiProvider>
      </body>
    </html>
  );
}
