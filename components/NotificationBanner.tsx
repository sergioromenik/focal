"use client";

import { Bell, BellRing } from "lucide-react";

interface NotificationBannerProps {
  permission: NotificationPermission | "unsupported";
  onEnable: () => void;
}

export default function NotificationBanner({ permission, onEnable }: NotificationBannerProps) {
  if (permission === "unsupported" || permission === "denied") return null;

  if (permission === "granted") {
    return (
      <div className="flex items-center gap-2.5 bg-bg-surface border border-line-subtle rounded-lg px-3.5 py-2.5 mb-5 text-[13px] text-ink-secondary">
        <BellRing size={16} className="text-ink-secondary flex-shrink-0" />
        <span>
          <span className="text-ink-primary font-medium">Notificações ativadas</span> — você será
          avisado sobre tarefas urgentes de hoje.
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5 bg-bg-surface border border-line-subtle rounded-lg px-3.5 py-2.5 mb-5 text-[13px] text-ink-secondary">
      <Bell size={16} className="flex-shrink-0" />
      <span>Ative notificações para nunca perder um prazo</span>
      <button onClick={onEnable} className="ml-auto text-ink-primary font-medium underline whitespace-nowrap">
        Ativar
      </button>
    </div>
  );
}
