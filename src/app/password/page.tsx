"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PasswordPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [protectionDisabled, setProtectionDisabled] = useState(false);
  const router = useRouter();

  // If password protection is disabled via env, redirect directly to home
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_PASSWORD_PROTECTION_ENABLED === "false") {
      setProtectionDisabled(true);
      router.replace("/");
    }
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        // Login erfolgreich – zurück zum Dashboard
        router.push("/");
        router.refresh();
      } else {
        const data = (await response.json().catch(() => null)) as
          | { message?: string }
          | null;

        setError(
          data?.message ??
            "Das Passwort ist leider falsch. Bitte versuche es erneut."
        );
      }
    } catch {
      setError(
        "Es ist ein Fehler aufgetreten. Bitte versuche es später noch einmal."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (protectionDisabled) {
    return null;
  }

  return (
    <div className="flex items-center justify-center w-full min-h-screen px-4">
      <div className="w-full max-w-md p-6 space-y-6 bg-background-light/80 dark:bg-primary-900/80 rounded-2xl shadow-xl backdrop-blur-sm border border-primary-100/60 dark:border-primary-700">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-primary-800 dark:text-primary-50">
            Geschütztes Dashboard
          </h1>
          <p className="text-sm text-primary-600 dark:text-primary-100">
            Bitte gib das Passwort ein, um auf die Messdaten zuzugreifen.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-primary-700 dark:text-primary-100"
            >
              Passwort
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-lg shadow-sm outline-none bg-background-light dark:bg-primary-800 border-primary-200 dark:border-primary-700 text-primary-900 dark:text-primary-50 focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
              placeholder="Passwort eingeben"
              required
            />
          </div>

          {error != null && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-2 text-sm font-semibold text-white rounded-lg shadow-md bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "Prüfe Passwort ..." : "Anmelden"}
          </button>
        </form>

        <p className="text-xs text-center text-primary-500 dark:text-primary-200">
          Der Zugriff ist nur mit bekanntem Passwort möglich.
        </p>
      </div>
    </div>
  );
}

