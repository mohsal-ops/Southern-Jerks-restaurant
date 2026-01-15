import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./providers/CartProvider";


export const metadata: Metadata = {
  title: "Southern Jerks | Caribbean Wings & Sandwiches in Houston",
  description: "Order delicious, gluten-free, fat-free snow cones for schools, corporate events, and festivals in NYC. Book online or request a quote!",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
