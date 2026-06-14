"use client";

import { CheckSquare, LogOut } from "lucide-react";
import type { Period } from "@/lib/types";
import { PERIODS } from "@/lib/types";
import clsx from "clsx";

interface TopBarProps {
  activeTab: Period;
  onTabChange: (tab: Period) => void;
  onSignOut: () => void;
}

export default function TopBar({ activeTab, onTabChange, onSignOut }: TopBarProps) {
  return (
    <div className="flex items-center justify-between gap-3 flex-wrap mb-6">
      <div className="flex items-center gap-2">
        <CheckSquare size={20} className="text-accent" strokeWidth={2.25} />
        <span className="font-display text-lg font-medium">focal</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex gap-0.5 bg-bg-surface border border-line-subtle rounded-lg p-0.5">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => onTabChange(p.value)}
              className={clsx(
                "px-3.5 py-1.5 rounded-md text-[13px] transition-colors",
                activeTab === p.value
                  ? "bg-bg-base text-ink-primary font-medium border border-line-subtle"
                  : "text-ink-secondary hover:text-ink-primary"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>

        <button
          onClick={onSignOut}
          aria-label="Sair"
          className="w-9 h-9 flex items-center justify-center rounded-md text-ink-tertiary hover:text-ink-primary hover:bg-bg-surface transition-colors"
        >
          <LogOut size={16} />
        </button>
      </div>
    </div>
  );
}
