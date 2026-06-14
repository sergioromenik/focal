"use client";

import { useState } from "react";
import { Plus, Layers } from "lucide-react";
import type { Segment } from "@/lib/types";
import clsx from "clsx";

const PALETTE = ["#378ADD", "#1D9E75", "#D85A30", "#BA7517", "#7F77DD", "#D4537E", "#639922", "#888780"];

interface SidebarProps {
  segments: Segment[];
  activeSegment: string | "Todos";
  onSegmentChange: (segment: string | "Todos") => void;
  counts: Record<string, number>;
  totalPending: number;
  onAddSegment: (name: string, color: string) => void;
}

export default function Sidebar({
  segments,
  activeSegment,
  onSegmentChange,
  counts,
  totalPending,
  onAddSegment,
}: SidebarProps) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState(PALETTE[0]);

  function handleAdd() {
    const trimmed = name.trim();
    if (!trimmed) {
      setAdding(false);
      return;
    }
    onAddSegment(trimmed, color);
    setName("");
    setColor(PALETTE[(segments.length + 1) % PALETTE.length]);
    setAdding(false);
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={() => onSegmentChange("Todos")}
        className={clsx(
          "flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[13px] transition-colors text-left",
          activeSegment === "Todos"
            ? "bg-bg-surface text-ink-primary font-medium"
            : "text-ink-secondary hover:bg-bg-surface hover:text-ink-primary"
        )}
      >
        <span className="w-2 h-2 rounded-full bg-ink-tertiary flex-shrink-0" />
        Todos
        <span className="ml-auto text-[11px] bg-bg-base text-ink-tertiary rounded-full px-1.5 py-0.5">
          {totalPending}
        </span>
      </button>

      <div className="text-[11px] font-medium text-ink-tertiary uppercase tracking-wide px-2.5 pt-3 pb-1">
        Segmentos
      </div>

      {segments.map((seg) => (
        <button
          key={seg.id}
          onClick={() => onSegmentChange(seg.name)}
          className={clsx(
            "flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[13px] transition-colors text-left",
            activeSegment === seg.name
              ? "bg-bg-surface text-ink-primary font-medium"
              : "text-ink-secondary hover:bg-bg-surface hover:text-ink-primary"
          )}
        >
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: seg.color }} />
          <span className="truncate">{seg.name}</span>
          <span className="ml-auto text-[11px] bg-bg-base text-ink-tertiary rounded-full px-1.5 py-0.5">
            {counts[seg.name] ?? 0}
          </span>
        </button>
      ))}

      {adding ? (
        <div className="px-2.5 py-1.5 flex flex-col gap-2 animate-fade-in">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
              if (e.key === "Escape") setAdding(false);
            }}
            placeholder="Nome do segmento"
            className="text-[13px] py-1.5"
          />
          <div className="flex items-center gap-1.5 flex-wrap">
            {PALETTE.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                aria-label={`Cor ${c}`}
                className="w-5 h-5 rounded-full flex-shrink-0"
                style={{
                  background: c,
                  outline: color === c ? "2px solid var(--ink-primary)" : "none",
                  outlineOffset: "1px",
                }}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="text-[12px] px-2.5 py-1 rounded-md bg-accent text-accent-ink font-medium">
              Adicionar
            </button>
            <button onClick={() => setAdding(false)} className="text-[12px] px-2.5 py-1 rounded-md text-ink-secondary">
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[13px] text-ink-tertiary hover:text-ink-primary hover:bg-bg-surface transition-colors text-left"
        >
          <Plus size={14} />
          Novo segmento
        </button>
      )}

      <div className="text-[11px] font-medium text-ink-tertiary uppercase tracking-wide px-2.5 pt-3 pb-1 flex items-center gap-1.5">
        <Layers size={12} />
        Dica
      </div>
      <p className="text-[12px] text-ink-tertiary px-2.5 leading-relaxed">
        Crie segmentos para áreas da sua vida — trabalho, estudos, projetos pessoais — e filtre suas
        tarefas por área a qualquer momento.
      </p>
    </div>
  );
}
