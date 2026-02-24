"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useLanguage } from "@/lib/i18n-context";

export default function SignUpPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t.auth.errorGeneric);
        setLoading(false);
        return;
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(t.auth.errorAutoSignIn);
      } else {
        router.push("/onboarding");
        router.refresh();
      }
    } catch {
      setError(t.auth.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 px-4">
      <div className="w-full max-w-sm animate-card-enter">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              KORE
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {t.auth.signUpTitle}
          </h1>
          <p className="text-sm text-gray-500">
            {t.auth.haveAccount}{" "}
            <Link
              href="/auth/signin"
              className="text-brand-600 hover:text-brand-700 font-medium transition-colors duration-150"
            >
              {t.auth.signInLink}
            </Link>
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="fullName"
              label={t.auth.fullNameLabel}
              type="text"
              placeholder={t.auth.fullNamePlaceholder}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <Input
              id="email"
              label={t.auth.emailLabel}
              type="email"
              placeholder={t.auth.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              id="password"
              label={t.auth.passwordLabel}
              type="password"
              placeholder={t.auth.passwordPlaceholderNew}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
            <Button type="submit" loading={loading} className="w-full" size="lg">
              {t.auth.createAccountButton}
            </Button>
          </form>

          <p className="mt-4 text-xs text-gray-400 text-center">
            {t.auth.termsText}
          </p>
        </div>
      </div>
    </div>
  );
}
