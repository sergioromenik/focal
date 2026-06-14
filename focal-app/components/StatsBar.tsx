import { ListChecks, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import type { Task } from "@/lib/types";

interface StatsBarProps {
  tasks: Task[];
}

export default function StatsBar({ tasks }: StatsBarProps) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.done).length;
  const pending = total - done;
  const urgent = tasks.filter((t) => t.priority === "Alta" && !t.done).length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  const stats = [
    { label: "Total", value: total, sub: "tarefas", icon: ListChecks },
    { label: "Feitas", value: done, sub: `${pct}% concluído`, icon: CheckCircle2 },
    { label: "Pendentes", value: pending, sub: "restantes", icon: Clock },
    { label: "Urgentes", value: urgent, sub: "alta prioridade", icon: AlertTriangle },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {stats.map(({ label, value, sub, icon: Icon }) => (
        <div key={label} className="bg-bg-surface rounded-lg p-3.5">
          <div className="flex items-center gap-1.5 text-xs text-ink-secondary mb-1.5">
            <Icon size={14} />
            {label}
          </div>
          <div className="text-xl font-medium">{value}</div>
          <div className="text-[11px] text-ink-tertiary mt-0.5">{sub}</div>
        </div>
      ))}
    </div>
  );
}
