"use client";

import { useState } from "react";
import { Plus, Layers, Pencil, Trash2, Check, X } from "lucide-react";
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
  onUpdateSegment: (id: string, name: string, color: string) => void;
  onDeleteSegment: (id: string, name: string) => void;
}

export default function Sidebar({
  segments,
  activeSegment,
  onSegmentChange,
  counts,
  totalPending,
  onAddSegment,
  onUpdateSegment,
  onDeleteSegment,
}: SidebarProps) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState(PALETTE[0]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState(PALETTE[0]);

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

  function startEdit(seg: Segment) {
    setEditingId(seg.id);
    setEditName(seg.name);
    setEditColor(seg.color);
    setAdding(false);
  }

  function saveEdit(seg: Segment) {
    const trimmed = editName.trim();
    if (!trimmed) {
      setEditingId(null);
      return;
    }
    onUpdateSegment(seg.id, trimmed, editColor);
    setEditingId(null);
  }

  function handleDelete(seg: Segment) {
    const count = counts[seg.name] ?? 0;
    const message =
      count > 0
        ? `Excluir "${seg.name}"? ${count} tarefa(s) pendente(s) ficarão sem este segmento.`
        : `Excluir o segmento "${seg.name}"?`;
    if (window.confirm(message)) {
      onDeleteSegment(seg.id, seg.name);
      setEditingId(null);
    }
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

      {segments.map((seg) =>
        editingId === seg.id ? (
          <div key={seg.id} className="px-2.5 py-1.5 flex flex-col gap-2 animate-fade-in">
            <input
              autoFocus
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveEdit(seg);
                if (e.key === "Escape") setEditingId(null);
              }}
              className="text-[13px] py-1.5"
            />
            <div className="flex items-center gap-1.5 flex-wrap">
              {PALETTE.map((c) => (
                <button
                  key={c}
                  onClick={() => setEditColor(c)}
                  aria-label={`Cor ${c}`}
                  className="w-5 h-5 rounded-full flex-shrink-0"
                  style={{
                    background: c,
                    outline: editColor === c ? "2px solid var(--ink-primary)" : "none",
                    outlineOffset: "1px",
                  }}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => saveEdit(seg)}
                className="flex items-center gap-1 text-[12px] px-2.5 py-1 rounded-md bg-accent text-accent-ink font-medium"
              >
                <Check size={12} /> Salvar
              </button>
              <button
                onClick={() => setEditingId(null)}
                className="flex items-center gap-1 text-[12px] px-2.5 py-1 rounded-md text-ink-secondary"
              >
                <X size={12} /> Cancelar
              </button>
              <button
                onClick={() => handleDelete(seg)}
                className="flex items-center gap-1 text-[12px] px-2.5 py-1 rounded-md text-ink-tertiary hover:text-ink-primary ml-auto"
              >
                <Trash2 size={12} /> Excluir
              </button>
            </div>
          </div>
        ) : (
          <div key={seg.id} className="group relative flex items-center">
            <button
              onClick={() => onSegmentChange(seg.name)}
              className={clsx(
                "flex-1 flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[13px] transition-colors text-left",
                activeSegment === seg.name
                  ? "bg-bg-surface text-ink-primary font-medium"
                  : "text-ink-secondary hover:bg-bg-surface hover:text-ink-primary"
              )}
            >
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: seg.color }} />
              <span className="truncate">{seg.name}</span>
              <span className="ml-auto text-[11px] bg-bg-base text-ink-tertiary rounded-full px-1.5 py-0.5 group-hover:hidden">
                {counts[seg.name] ?? 0}
              </span>
            </button>
            <button
              onClick={() => startEdit(seg)}
              aria-label={`Editar segmento ${seg.name}`}
              className="hidden group-hover:flex absolute right-1.5 w-6 h-6 items-center justify-center rounded-md text-ink-tertiary hover:text-ink-primary hover:bg-bg-base"
            >
              <Pencil size={12} />
            </button>
          </div>
        )
      )}

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
        tarefas por área a qualquer momento. Passe o mouse sobre um segmento para editar ou excluir.
      </p>
    </div>
  );
}
