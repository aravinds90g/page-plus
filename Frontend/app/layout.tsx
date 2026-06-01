import type { Metadata } from "next";
import "./globals.css";
import EventHorizonNav from "@/components/cosmic-ui/EventHorizonNav";
import OptionalParticles from "@/components/cosmic-ui/OptionalParticles";
import CosmicCursor from "@/components/cosmic-ui/CosmicCursor";
import { AuthProvider } from "@/lib/AuthContext";

export const metadata: Metadata = {
  title: "PagePulse — Cosmic Book Archive",
  description: "A forbidden library floating in the void between stars",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Wallpoet&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <AuthProvider>
          {/* Cosmic Orbs */}
        <div className="cosmic-orb-primary -top-40 -left-40" />
        <div className="cosmic-orb-secondary top-1/2 -right-60" />
        <div className="cosmic-orb-tertiary bottom-20 left-1/3" />

        {/* Light Shafts */}
        <div className="light-shaft left-1/4" style={{ animationDelay: '-5s' }} />
        <div className="light-shaft right-1/3" style={{ animationDelay: '-12s' }} />

        {/* Optional Particles */}
        <OptionalParticles />

        {/* Quantum Noise Overlay */}
        <div className="quantum-noise" />

        {/* Custom Cursor */}
        <CosmicCursor />

        {/* Navigation */}
        <EventHorizonNav />

        {/* Main Content */}
        <main className="relative z-10">
          {children}
        </main>
        </AuthProvider>
      </body>
    </html>
  );
}
