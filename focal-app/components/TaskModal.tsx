"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { Period, Priority, Segment } from "@/lib/types";
import { PERIODS, PRIORITIES } from "@/lib/types";

interface TaskModalProps {
  segments: Segment[];
  defaultSegment: string;
  defaultPeriod: Period;
  onClose: () => void;
  onSave: (data: {
    title: string;
    segment: string;
    priority: Priority;
    period: Period;
    due_date: string | null;
    notes: string | null;
  }) => void;
}

export default function TaskModal({
  segments,
  defaultSegment,
  defaultPeriod,
  onClose,
  onSave,
}: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [segment, setSegment] = useState(defaultSegment !== "Todos" ? defaultSegment : segments[0]?.name ?? "");
  const [priority, setPriority] = useState<Priority>("Média");
  const [period, setPeriod] = useState<Period>(defaultPeriod === "ano" ? "ano" : defaultPeriod);
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onSave({
      title: trimmed,
      segment,
      priority,
      period,
      due_date: dueDate || null,
      notes: notes.trim() || null,
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-bg-surface border border-line-subtle rounded-xl p-6 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-medium">Nova tarefa</h2>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="w-7 h-7 flex items-center justify-center rounded-md text-ink-tertiary hover:text-ink-primary hover:bg-bg-base"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <Field label="Título">
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="O que precisa ser feito?"
              className="w-full"
              required
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Segmento">
              <select value={segment} onChange={(e) => setSegment(e.target.value)} className="w-full">
                {segments.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Prioridade">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Período">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as Period)}
                className="w-full"
              >
                {PERIODS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Data limite">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full"
              />
            </Field>
          </div>

          <Field label="Notas">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Detalhes opcionais..."
              rows={2}
              className="w-full resize-none"
            />
          </Field>

          <div className="flex justify-end gap-2 mt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-line-default text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-ink-primary text-bg-base text-sm font-medium"
            >
              Salvar tarefa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-ink-secondary mb-1.5">{label}</span>
      {children}
    </label>
  );
}
