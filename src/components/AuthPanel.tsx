"use client";

import React, { useCallback, useEffect, useState } from "react";
import { SupportedLanguage, translations } from "@/lib/i18n";
import { Icon } from "@/components/Icon";

type User = {
  userId: string;
  displayName: string;
  phone: string;
  role: string;
};

type Props = {
  currentLang: SupportedLanguage;
};

type Mode = "login" | "register";

export function AuthPanel({ currentLang }: Props) {
  const t = translations[currentLang].auth;
  const [mode, setMode] = useState<Mode>("login");
  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadSession = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me", {
        method: "GET",
        cache: "no-store",
        credentials: "same-origin",
      });

      if (!response.ok) {
        setUser(null);
        return;
      }

      const data = await response.json();

      if (data.success && data.user) {
        setUser(data.user as User);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
      setError(t.connectionError);
    } finally {
      setLoading(false);
    }
  }, [t.connectionError]);

  useEffect(() => {
    void loadSession();
  }, [loadSession]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (mode === "register" && password !== confirmPassword) {
      setError(t.passwordMismatch);
      return;
    }

    setSubmitting(true);

    try {
      const endpoint =
        mode === "login"
          ? "/api/auth/login"
          : "/api/auth/register";

      const payload =
        mode === "login"
          ? { phone, password }
          : { phone, password, displayName };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(t.invalidCredentials);
        }

        if (response.status === 409) {
          throw new Error(t.phoneExists);
        }

        if (response.status === 429) {
          throw new Error(t.tooManyAttempts);
        }

        if (response.status === 400) {
          throw new Error(t.invalidInput);
        }

        throw new Error(data.error || t.generalError);
      }

      setSuccess(mode === "login" ? t.loginSuccess : t.registerSuccess);
      setPassword("");
      setConfirmPassword("");

      await loadSession();
    } catch (err) {
      setError(err instanceof Error ? err.message : t.generalError);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogout() {
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
      });

      if (!response.ok) {
        throw new Error(t.generalError);
      }

      setUser(null);
      setMode("login");
      setSuccess(t.logoutSuccess);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.generalError);
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full min-h-[48px] rounded-xl border border-arcade-cardBorder bg-arcade-dark/80 px-4 text-sm text-white placeholder:text-arcade-muted outline-none focus:border-arcade-cyan focus:ring-1 focus:ring-arcade-cyan/30";

  if (loading) {
    return (
      <section className="rounded-2xl border border-arcade-cardBorder bg-arcade-card/80 p-8 text-center">
        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-arcade-cyan/20 border-t-arcade-cyan" />
        <p className="text-xs text-arcade-muted">{t.checkingSession}</p>
      </section>
    );
  }

  if (user) {
    return (
      <section className="flex flex-col gap-4 rounded-2xl border border-arcade-cardBorder bg-arcade-card/80 p-5 shadow-lg">
        <div className="flex flex-col items-center gap-3 border-b border-arcade-cardBorder pb-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-arcade-cyan/30 bg-arcade-cyan/10 text-arcade-cyan shadow-cyanGlow">
            <Icon name="user" size={32} />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-extrabold text-white">
              {user.displayName}
            </h3>
            <p className="mt-1 text-xs text-arcade-green">{t.accountActive}</p>
          </div>
        </div>

        <div className="rounded-xl border border-arcade-cyan/20 bg-arcade-dark/70 p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-arcade-muted">
            {t.userId}
          </p>
          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="break-all text-xl font-black tracking-wider text-arcade-cyan">
              {user.userId}
            </span>
            <button
              type="button"
              onClick={() => {
                void navigator.clipboard?.writeText(user.userId);
                setSuccess(t.copied);
              }}
              className="rounded-lg border border-arcade-cyan/30 p-2 text-arcade-cyan"
              aria-label={t.copyUserId}
            >
              <Icon name="copy" size={18} />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-arcade-muted">
              {t.phone}
            </p>
            <p className="mt-1 text-sm text-white">{user.phone}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-arcade-muted">
              {t.role}
            </p>
            <p className="mt-1 text-sm capitalize text-white">{user.role}</p>
          </div>
        </div>

        {error && (
          <p role="alert" className="rounded-lg bg-red-500/10 p-3 text-xs text-red-400">
            {error}
          </p>
        )}

        {success && (
          <p role="status" className="rounded-lg bg-emerald-500/10 p-3 text-xs text-emerald-400">
            {success}
          </p>
        )}

        <button
          type="button"
          disabled={submitting}
          onClick={handleLogout}
          className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 font-bold text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
        >
          <Icon name="log-out" size={18} />
          {submitting ? t.pleaseWait : t.logout}
        </button>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-arcade-cardBorder bg-arcade-card/80 p-5 shadow-lg">
      <div className="mb-5 flex flex-col items-center gap-2 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-arcade-cyan/30 bg-arcade-cyan/10 text-arcade-cyan">
          <Icon name="user" size={28} />
        </div>
        <h3 className="text-lg font-extrabold text-white">
          {mode === "login" ? t.loginTitle : t.registerTitle}
        </h3>
        <p className="text-xs text-arcade-muted">
          {mode === "login" ? t.loginDescription : t.registerDescription}
        </p>
      </div>

      <div className="mb-5 grid grid-cols-2 rounded-xl border border-arcade-cardBorder bg-arcade-dark p-1">
        <button
          type="button"
          onClick={() => {
            setMode("login");
            setError("");
            setSuccess("");
          }}
          className={`rounded-lg py-2.5 text-xs font-bold transition-all ${
            mode === "login"
              ? "bg-arcade-cyan/15 text-arcade-cyan"
              : "text-arcade-muted"
          }`}
        >
          {t.login}
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("register");
            setError("");
            setSuccess("");
          }}
          className={`rounded-lg py-2.5 text-xs font-bold transition-all ${
            mode === "register"
              ? "bg-arcade-cyan/15 text-arcade-cyan"
              : "text-arcade-muted"
          }`}
        >
          {t.register}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {mode === "register" && (
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-arcade-muted">{t.displayName}</span>
            <input
              className={inputClass}
              type="text"
              autoComplete="name"
              minLength={2}
              maxLength={50}
              required
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder={t.displayNamePlaceholder}
            />
          </label>
        )}

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-bold text-arcade-muted">{t.phone}</span>
          <input
            className={inputClass}
            type="tel"
            autoComplete="tel"
            maxLength={30}
            required
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder={t.phonePlaceholder}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-bold text-arcade-muted">{t.password}</span>
          <div className="relative">
            <input
              className={`${inputClass} pr-14`}
              type={showPassword ? "text" : "password"}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              minLength={mode === "register" ? 8 : undefined}
              maxLength={72}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={mode === "register" ? t.passwordPlaceholder : t.password}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? t.hidePassword : t.showPassword}
              aria-pressed={showPassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-arcade-muted hover:text-arcade-cyan"
            >
              <Icon name={showPassword ? "eye-off" : "eye"} size={20} />
            </button>
          </div>
        </label>

        {mode === "register" && (
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-arcade-muted">{t.confirmPassword}</span>
            <div className="relative">
              <input
                className={`${inputClass} pr-14`}
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                minLength={8}
                maxLength={72}
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder={t.confirmPassword}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((value) => !value)}
                aria-label={showConfirmPassword ? t.hidePassword : t.showPassword}
                aria-pressed={showConfirmPassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-arcade-muted hover:text-arcade-cyan"
              >
                <Icon name={showConfirmPassword ? "eye-off" : "eye"} size={20} />
              </button>
            </div>
          </label>
        )}

        {mode === "register" && (
          <p className="text-[10px] leading-relaxed text-arcade-muted">
            {t.passwordRule}
          </p>
        )}

        {error && (
          <p role="alert" className="rounded-lg bg-red-500/10 p-3 text-xs text-red-400">
            {error}
          </p>
        )}

        {success && (
          <p role="status" className="rounded-lg bg-emerald-500/10 p-3 text-xs text-emerald-400">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 flex min-h-[50px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-arcade-cyan via-blue-600 to-arcade-magenta text-sm font-black text-white shadow-[0_4px_16px_rgba(0,114,255,0.35)] transition-all active:scale-95 disabled:opacity-50"
        >
          {submitting ? t.pleaseWait : mode === "login" ? t.login : t.createAccount}
        </button>
      </form>

      <p className="mt-4 text-center text-[10px] leading-relaxed text-arcade-muted">
        {t.securityNotice}
      </p>
    </section>
  );
}
