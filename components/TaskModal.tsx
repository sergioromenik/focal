"use client";

import { useState } from "react";
import { X, Plus, GripVertical } from "lucide-react";
import type { Priority, Segment, Subtask, Task, ViewTab } from "@/lib/types";
import { PRIORITIES, todayStr } from "@/lib/types";

export interface TaskFormData {
  title: string;
  segment: string;
  priority: Priority;
  due_date: string | null;
  due_time: string | null;
  notes: string | null;
  subtasks: Subtask[];
}

interface TaskModalProps {
  segments: Segment[];
  defaultSegment: string;
  activeTab: ViewTab;
  editingTask?: Task | null;
  onClose: () => void;
  onSave: (data: TaskFormData) => void;
}

export default function TaskModal({
  segments,
  defaultSegment,
  activeTab,
  editingTask,
  onClose,
  onSave,
}: TaskModalProps) {
  const isEditing = !!editingTask;

  const [title, setTitle] = useState(editingTask?.title ?? "");
  const [segment, setSegment] = useState(
    editingTask?.segment ?? (defaultSegment !== "Todos" ? defaultSegment : segments[0]?.name ?? "")
  );
  const [priority, setPriority] = useState<Priority>(editingTask?.priority ?? "Média");
  const [dueDate, setDueDate] = useState(
    editingTask?.due_date ?? (activeTab === "hoje" ? todayStr() : "")
  );
  const [dueTime, setDueTime] = useState(editingTask?.due_time?.slice(0, 5) ?? "");
  const [notes, setNotes] = useState(editingTask?.notes ?? "");
  const [subtasks, setSubtasks] = useState<Subtask[]>(editingTask?.subtasks ?? []);

  function addSubtask() {
    setSubtasks((current) => [...current, { id: crypto.randomUUID(), title: "", done: false }]);
  }

  function updateSubtask(id: string, title: string) {
    setSubtasks((current) => current.map((s) => (s.id === id ? { ...s, title } : s)));
  }

  function toggleSubtask(id: string) {
    setSubtasks((current) => current.map((s) => (s.id === id ? { ...s, done: !s.done } : s)));
  }

  function removeSubtask(id: string) {
    setSubtasks((current) => current.filter((s) => s.id !== id));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onSave({
      title: trimmed,
      segment,
      priority,
      due_date: dueDate || null,
      due_time: dueTime || null,
      notes: notes.trim() || null,
      subtasks: subtasks
        .map((s) => ({ ...s, title: s.title.trim() }))
        .filter((s) => s.title.length > 0),
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-bg-surface border border-line-subtle rounded-xl p-6 animate-fade-in max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-medium">{isEditing ? "Editar tarefa" : "Nova tarefa"}</h2>
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
            <Field label="Data limite">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full"
              />
            </Field>
            <Field label="Hora">
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
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

          <div>
            <span className="block text-xs font-medium text-ink-secondary mb-1.5">Subtarefas</span>
            <div className="flex flex-col gap-1.5">
              {subtasks.map((s) => (
                <div key={s.id} className="flex items-center gap-2">
                  <GripVertical size={13} className="text-ink-tertiary flex-shrink-0" />
                  <button
                    type="button"
                    onClick={() => toggleSubtask(s.id)}
                    aria-label={s.done ? "Marcar como não feita" : "Marcar como feita"}
                    className={`w-[16px] h-[16px] rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                      s.done ? "bg-ink-primary border-ink-primary" : "border-line-default"
                    }`}
                  >
                    {s.done && <span className="block w-1.5 h-1.5 bg-bg-base rounded-[1px]" />}
                  </button>
                  <input
                    value={s.title}
                    onChange={(e) => updateSubtask(s.id, e.target.value)}
                    placeholder="Descreva a subtarefa..."
                    className="flex-1 text-[13px] py-1.5"
                  />
                  <button
                    type="button"
                    onClick={() => removeSubtask(s.id)}
                    aria-label="Remover subtarefa"
                    className="w-6 h-6 flex items-center justify-center rounded-md text-ink-tertiary hover:text-ink-primary hover:bg-bg-base flex-shrink-0"
                  >
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addSubtask}
              className="flex items-center gap-1.5 mt-2 text-[12px] text-ink-tertiary hover:text-ink-primary transition-colors"
            >
              <Plus size={13} />
              Adicionar subtarefa
            </button>
          </div>

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
              {isEditing ? "Salvar alterações" : "Salvar tarefa"}
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
