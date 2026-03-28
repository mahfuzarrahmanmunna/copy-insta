import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script"; // 1. Import the Script component
import "./globals.css";
import Providers from "./providers/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 2. Metadata comes first
export const metadata = {
  // --- Basic Metadata ---
  title: {
    default: "Instagram",
    template: "%s • Instagram",
  },
  description:
    "Create an account or log in to Instagram - Share what you're into with the people who get you.",
  keywords: [
    "instagram",
    "photos",
    "videos",
    "social media",
    "sharing",
    "facebook",
  ],
  authors: [{ name: "Instagram" }],
  creator: "Instagram",
  publisher: "Instagram",

  // --- Icons & Favicon ---
  icons: {
    icon: "/favicon.webp",
    shortcut: "/favicon.webp",
    apple: "/favicon.webp",
  },
  manifest: "/manifest.json",

  // --- Theme & Viewport ---
  themeColor: "#ffffff",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },

  // --- Open Graph ---
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://instagrrams.com/",
    siteName: "Instagram",
    description:
      "Create an account or log in to Instagram - Share what you're into with the people who get you.",
    images: [
      {
        url: "/favicon.webp",
        width: 800,
        height: 800,
        alt: "Instagram Logo",
      },
    ],
  },

  // --- Twitter Card ---
  twitter: {
    card: "summary",
    site: "@instagram",
    title: "Instagram",
    description:
      "Create an account or log in to Instagram - Share what you're into with the people who get you.",
    images: ["/favicon.webp"],
  },

  // --- App Links ---
  alternates: {
    canonical: "https://instagrrams.com/",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      cz-shortcut-listen="true"
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Providers>{children}</Providers>

        {/* 3. Script Tag comes second (inside body) */}
        <Script
          id="custom-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Paste your raw JavaScript code here (e.g., Google Analytics)
              console.log('Script loaded successfully!');
            `,
          }}
        />
      </body>
    </html>
  );
}
