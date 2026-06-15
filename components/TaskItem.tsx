"use client";

import { useState } from "react";
import { Check, Trash2, Calendar, Clock, ArrowUp, Minus, ArrowDown, ChevronDown, ChevronRight } from "lucide-react";
import type { Task } from "@/lib/types";
import { PRIORITY_STYLES, isOverdue } from "@/lib/types";
import clsx from "clsx";

interface TaskItemProps {
  task: Task;
  segmentColor: string;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
}

const PRIORITY_ICON = { Alta: ArrowUp, Média: Minus, Baixa: ArrowDown } as const;

function formatDate(dateStr: string | null) {
  if (!dateStr) return null;
  const date = new Date(`${dateStr}T00:00`);
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

function formatTime(timeStr: string | null) {
  if (!timeStr) return null;
  return timeStr.slice(0, 5);
}

export default function TaskItem({
  task,
  segmentColor,
  onToggle,
  onDelete,
  onEdit,
  onToggleSubtask,
}: TaskItemProps) {
  const [expanded, setExpanded] = useState(false);

  const priStyle = PRIORITY_STYLES[task.priority];
  const PriIcon = PRIORITY_ICON[task.priority];
  const dateLabel = formatDate(task.due_date);
  const timeLabel = formatTime(task.due_time);
  const overdue = isOverdue(task);

  const subtasks = task.subtasks ?? [];
  const subtaskDone = subtasks.filter((s) => s.done).length;

  return (
    <div className="group rounded-md hover:bg-bg-surface transition-colors">
      <div className="flex items-start gap-2.5 px-2.5 py-2.5">
        <button
          onClick={() => onToggle(task.id)}
          aria-label={task.done ? "Marcar como não feita" : "Marcar como feita"}
          className={clsx(
            "w-[18px] h-[18px] mt-0.5 rounded-md border flex items-center justify-center flex-shrink-0 transition-colors",
            task.done ? "bg-ink-primary border-ink-primary" : "border-line-default"
          )}
        >
          {task.done && <Check size={12} className="text-bg-base" strokeWidth={3} />}
        </button>

        <button onClick={() => onEdit(task)} className="flex-1 min-w-0 text-left" aria-label="Editar tarefa">
          <div
            className={clsx(
              "text-sm leading-relaxed",
              task.done ? "line-through text-ink-tertiary" : "text-ink-primary"
            )}
          >
            {task.title}
          </div>
          <div className={clsx("flex items-center gap-1.5 flex-wrap mt-1", task.done && "opacity-50")}>
            <span
              className="text-[11px] px-1.5 py-0.5 rounded font-medium"
              style={{ background: `${segmentColor}1A`, color: segmentColor }}
            >
              {task.segment}
            </span>
            <span
              className="flex items-center gap-0.5 text-[11px] px-1.5 py-0.5 rounded font-medium"
              style={{ background: priStyle.bg, color: priStyle.text }}
            >
              <PriIcon size={11} />
              {task.priority}
            </span>
            {dateLabel && (
              <span
                className={clsx(
                  "flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded font-medium",
                  overdue ? "bg-[#FAECE7] text-[#993C1D]" : "text-ink-tertiary"
                )}
              >
                <Calendar size={12} />
                {dateLabel}
                {overdue && " · atrasada"}
              </span>
            )}
            {timeLabel && (
              <span className="flex items-center gap-1 text-[11px] text-ink-tertiary">
                <Clock size={12} />
                {timeLabel}
              </span>
            )}
            {task.notes && (
              <span className="text-[11px] text-ink-tertiary truncate max-w-[220px]">{task.notes}</span>
            )}
          </div>
        </button>

        {subtasks.length > 0 && (
          <button
            onClick={() => setExpanded((v) => !v)}
            aria-label={expanded ? "Ocultar subtarefas" : "Mostrar subtarefas"}
            className="flex items-center gap-1 text-[11px] text-ink-tertiary hover:text-ink-primary px-1.5 py-1 rounded-md hover:bg-bg-base flex-shrink-0 mt-0.5"
          >
            {expanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
            {subtaskDone}/{subtasks.length}
          </button>
        )}

        <button
          onClick={() => onDelete(task.id)}
          aria-label="Remover tarefa"
          className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-md text-ink-tertiary hover:text-ink-primary hover:bg-bg-base transition-all flex-shrink-0"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {expanded && subtasks.length > 0 && (
        <div className="pl-[44px] pb-2.5 flex flex-col gap-1.5">
          {subtasks.map((s) => (
            <button
              key={s.id}
              onClick={() => onToggleSubtask(task.id, s.id)}
              className="flex items-center gap-2 text-left"
            >
              <span
                className={clsx(
                  "w-[14px] h-[14px] rounded border flex items-center justify-center flex-shrink-0 transition-colors",
                  s.done ? "bg-ink-primary border-ink-primary" : "border-line-default"
                )}
              >
                {s.done && <Check size={10} className="text-bg-base" strokeWidth={3} />}
              </span>
              <span className={clsx("text-[13px]", s.done ? "line-through text-ink-tertiary" : "text-ink-secondary")}>
                {s.title}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
