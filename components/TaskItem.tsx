"use client";

import { Check, Trash2, Calendar, ArrowUp, Minus, ArrowDown } from "lucide-react";
import type { Task } from "@/lib/types";
import { PRIORITY_STYLES } from "@/lib/types";
import clsx from "clsx";

interface TaskItemProps {
  task: Task;
  segmentColor: string;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const PRIORITY_ICON = { Alta: ArrowUp, Média: Minus, Baixa: ArrowDown } as const;

function formatDate(dateStr: string | null) {
  if (!dateStr) return null;
  const date = new Date(`${dateStr}T00:00`);
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export default function TaskItem({ task, segmentColor, onToggle, onDelete }: TaskItemProps) {
  const priStyle = PRIORITY_STYLES[task.priority];
  const PriIcon = PRIORITY_ICON[task.priority];
  const dateLabel = formatDate(task.due_date);

  return (
    <div className="group flex items-start gap-2.5 px-2.5 py-2.5 rounded-md hover:bg-bg-surface transition-colors">
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

      <div className="flex-1 min-w-0">
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
            <span className="flex items-center gap-1 text-[11px] text-ink-tertiary">
              <Calendar size={12} />
              {dateLabel}
            </span>
          )}
          {task.notes && (
            <span className="text-[11px] text-ink-tertiary truncate max-w-[220px]">
              {task.notes}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={() => onDelete(task.id)}
        aria-label="Remover tarefa"
        className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-md text-ink-tertiary hover:text-ink-primary hover:bg-bg-base transition-all flex-shrink-0"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}
