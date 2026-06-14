"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CheckSquare, ArrowRight, Mail } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus("sending");
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setStatus(error ? "error" : "sent");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <CheckSquare size={22} className="text-accent" strokeWidth={2} />
          <span className="font-display text-lg font-medium">focal</span>
        </div>

        <div className="bg-bg-surface border border-line-subtle rounded-xl p-6">
          {status === "sent" ? (
            <div className="text-center py-2">
              <div className="w-10 h-10 rounded-full bg-bg-base flex items-center justify-center mx-auto mb-3">
                <Mail size={18} className="text-ink-secondary" />
              </div>
              <h1 className="text-base font-medium mb-1">Verifique seu e-mail</h1>
              <p className="text-sm text-ink-secondary leading-relaxed">
                Enviamos um link de acesso para <span className="text-ink-primary">{email}</span>.
                Abra-o neste dispositivo para entrar.
              </p>
            </div>
          ) : (
            <>
              <h1 className="text-base font-medium mb-1">Entrar no focal</h1>
              <p className="text-sm text-ink-secondary mb-5 leading-relaxed">
                Digite seu e-mail e enviaremos um link de acesso. Sem senha para lembrar.
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                  type="email"
                  required
                  placeholder="voce@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                />
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full flex items-center justify-center gap-2 bg-accent text-accent-ink rounded-md py-2.5 text-sm font-medium disabled:opacity-60 transition-opacity"
                >
                  {status === "sending" ? "Enviando..." : "Enviar link de acesso"}
                  {status !== "sending" && <ArrowRight size={15} />}
                </button>
                {status === "error" && (
                  <p className="text-sm text-center" style={{ color: "#993C1D" }}>
                    Algo deu errado. Tente novamente.
                  </p>
                )}
              </form>
            </>
          )}
        </div>

        <p className="text-xs text-ink-tertiary text-center mt-5">
          Seus dados ficam salvos com segurança e visíveis só para você.
        </p>
      </div>
    </main>
  );
}
