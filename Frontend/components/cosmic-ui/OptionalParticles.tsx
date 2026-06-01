"use client";

import { usePathname } from "next/navigation";
import ParticleCanvas from "@/components/particles/ParticleCanvas";

export default function OptionalParticles() {
  const pathname = usePathname();

  // Hide particles on the hero (root) page
  if (pathname === "/") return null;

  return <ParticleCanvas />;
}
