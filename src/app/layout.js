import { Geist, Geist_Mono } from "next/font/google";
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
  // Uses your existing favicon.webp in the public folder
  icons: {
    icon: "/favicon.webp",
    shortcut: "/favicon.webp",
    apple: "/favicon.webp",
  },
  manifest: "/manifest.json", // You would need to create this file in public/ for PWA support

  // --- Theme & Viewport ---
  themeColor: "#ffffff",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },

  // --- Open Graph (Facebook, LinkedIn, etc.) ---
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.instagram.com/", // Replace with your actual URL
    siteName: "Instagram",
    title: "Instagram",
    description:
      "Create an account or log in to Instagram - A simple, fun & creative way to capture, edit & share photos, videos & messages with friends & family.",
    // Replace this URL with a high-res image (1200x630px) for better link previews
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
      "Create an account or log in to Instagram - A simple, fun & creative way to capture, edit & share photos, videos & messages with friends & family.",
    images: ["/favicon.webp"],
  },

  // --- App Links (Deep linking) ---
  // These tell mobile devices to open your app if installed
  alternates: {
    canonical: "https://www.instagram.com/",
  },
  // Note: Next.js handles 'al:android:url', 'al:ios:url' via specific config or manual tags if needed.
  // For standard SEO, the above is usually sufficient.
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
      </body>
    </html>
  );
}
