"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { BookOpen, Eye, EyeOff, User, Shield, Check, Flame, AlertCircle } from "lucide-react";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"user" | "admin">("user");
  const [agree, setAgree] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) return;
    setError(null);
    setIsSubmitting(true);

    const name = `${firstName} ${lastName}`.trim();
    if (!name) {
      setError("Please provide a first and last name.");
      setIsSubmitting(false);
      return;
    }

    const result = await register(name, email, password, role);

    if (result.success) {
      router.push("/library");
    } else {
      setError(result.error || "Failed to forge cosmic sigil.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Cosmic Orbs */}
      <div className="cosmic-orb-primary -top-40 -left-40" />
      <div className="cosmic-orb-secondary top-1/2 -right-60" />
      <div className="cosmic-orb-tertiary bottom-20 left-1/3" />

      {/* Back link */}
      <Link
        href="/"
        className="absolute top-8 left-8 text-void-silver font-spacemono text-xs tracking-widest uppercase hover:text-starlight transition-colors duration-300 z-20"
      >
        ← Return to Void
      </Link>

      {/* Form Container */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-obsidian-card/80 backdrop-blur-xl border border-[rgba(255,255,255,0.04)] rounded-2xl p-8 md:p-10 celestial-glow">
          {/* Header with decorative heading pattern */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-blood-moon" />
              <span className="cinzel-decorative-bold text-xl text-starlight">
                PAGEPULSE
              </span>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-12 h-px bg-gradient-to-r from-transparent to-blood-moon/50" />
                <Flame className="w-5 h-5 text-blood-moon" />
                <div className="w-12 h-px bg-gradient-to-l from-transparent to-blood-moon/50" />
              </div>
              <h2 className="font-cinzel text-3xl md:text-4xl text-starlight mb-2">
                Forge Your Sigil
              </h2>
              <p className="font-crimson text-void-silver text-sm max-w-xs mx-auto">
                Claim your place among the constellations
              </p>
            </motion.div>
          </div>

          {/* Role Selector - styled like genre badges */}
          <div className="flex bg-void-deep rounded-xl p-1 mb-6 border border-[rgba(255,255,255,0.04)]">
            <button
              onClick={() => setRole("user")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-orbitron tracking-wider uppercase transition-all duration-300 ${
                role === "user"
                  ? "bg-blood-moon text-starlight shadow-lg shadow-blood-moon/20"
                  : "text-void-silver hover:text-starlight"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Reader
            </button>
            <button
              onClick={() => setRole("admin")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-orbitron tracking-wider uppercase transition-all duration-300 ${
                role === "admin"
                  ? "bg-blood-moon text-starlight shadow-lg shadow-blood-moon/20"
                  : "text-void-silver hover:text-starlight"
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              Archivist
            </button>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-950/40 border border-red-500/30 text-red-400 rounded-xl text-xs font-spacemono">
                <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-spacemono text-[10px] text-void-silver uppercase tracking-widest mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Kvothe"
                  className="w-full bg-void-deep border border-[rgba(255,255,255,0.06)] rounded-xl px-4 py-3.5 text-starlight font-crimson text-sm placeholder:text-void-silver/40 focus:outline-none focus:border-blood-moon/50 focus:ring-1 focus:ring-blood-moon/20 transition-all duration-300"
                  required
                />
              </div>
              <div>
                <label className="block font-spacemono text-[10px] text-void-silver uppercase tracking-widest mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Hornblower"
                  className="w-full bg-void-deep border border-[rgba(255,255,255,0.06)] rounded-xl px-4 py-3.5 text-starlight font-crimson text-sm placeholder:text-void-silver/40 focus:outline-none focus:border-blood-moon/50 focus:ring-1 focus:ring-blood-moon/20 transition-all duration-300"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-spacemono text-[10px] text-void-silver uppercase tracking-widest mb-2">
                Email / Cosmic Identifier
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="scribe@void.com"
                className="w-full bg-void-deep border border-[rgba(255,255,255,0.06)] rounded-xl px-4 py-3.5 text-starlight font-crimson text-sm placeholder:text-void-silver/40 focus:outline-none focus:border-blood-moon/50 focus:ring-1 focus:ring-blood-moon/20 transition-all duration-300"
                required
              />
            </div>

            <div className="relative">
              <label className="block font-spacemono text-[10px] text-void-silver uppercase tracking-widest mb-2">
                Incantation (Password)
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-void-deep border border-[rgba(255,255,255,0.06)] rounded-xl px-4 py-3.5 text-starlight font-crimson text-sm placeholder:text-void-silver/40 focus:outline-none focus:border-blood-moon/50 focus:ring-1 focus:ring-blood-moon/20 transition-all duration-300 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[38px] text-void-silver hover:text-starlight transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Agreement checkbox */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <button
                type="button"
                onClick={() => setAgree(!agree)}
                className={`mt-0.5 w-5 h-5 rounded-md border flex-shrink-0 flex items-center justify-center transition-all duration-300 ${
                  agree
                    ? "bg-blood-moon border-blood-moon"
                    : "border-[rgba(255,255,255,0.1)] group-hover:border-void-silver/50"
                }`}
              >
                {agree && <Check className="w-3 h-3 text-starlight" />}
              </button>
              <span className="font-crimson text-void-silver text-sm leading-relaxed">
                I accept the{" "}
                <span className="text-blood-moon hover:text-solar-flare transition-colors italic cursor-pointer">
                  Compact of the Archive
                </span>{" "}
                and swear to guard its secrets across the void
              </span>
            </label>

            <motion.button
              whileHover={agree ? { scale: 1.02 } : {}}
              whileTap={agree ? { scale: 0.98 } : {}}
              type="submit"
              disabled={!agree || isSubmitting}
              className={`w-full flex items-center justify-center gap-3 px-8 py-4 border font-orbitron text-xs tracking-[0.2em] uppercase transition-all duration-500 group ${
                agree
                  ? "border-blood-moon/30 text-blood-moon hover:bg-blood-moon hover:text-starlight"
                  : "border-[rgba(255,255,255,0.06)] text-void-silver/30 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? "Forging Sigil..." : "Claim Your Sigil"}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.04)] to-transparent" />
            <span className="font-crimson italic text-void-silver/50 text-xs">or</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.04)] to-transparent" />
          </div>

          {/* Login Link */}
          <p className="text-center font-crimson text-void-silver text-sm">
            Already bear a sigil?{" "}
            <Link
              href="/login"
              className="text-blood-moon hover:text-solar-flare transition-colors italic"
            >
              Sign in to the Archive
            </Link>
          </p>
        </div>

        {/* Role indicator badge */}
        <div className="mt-4 text-center">
          <span className="px-3 py-1 text-[10px] font-orbitron tracking-widest border border-blood-moon/20 text-blood-moon bg-blood-moon/5">
            {role === "admin" ? "ARCHIVIST PATH" : "READER PATH"}
          </span>
        </div>
      </motion.div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-void-abyss to-transparent z-10" />
    </div>
  );
}
