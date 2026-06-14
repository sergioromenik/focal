"use client";

import { Plus, Search } from "lucide-react";
import clsx from "clsx";

export type PriorityFilter = "Todas" | "Alta" | "Média" | "Baixa" | "Feitas";

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  priorityFilter: PriorityFilter;
  onPriorityFilterChange: (value: PriorityFilter) => void;
  onAddClick: () => void;
}

const FILTERS: { value: PriorityFilter; label: string }[] = [
  { value: "Todas", label: "Todas" },
  { value: "Alta", label: "Alta" },
  { value: "Média", label: "Média" },
  { value: "Baixa", label: "Baixa" },
  { value: "Feitas", label: "Feitas" },
];

export default function FilterBar({
  search,
  onSearchChange,
  priorityFilter,
  onPriorityFilterChange,
  onAddClick,
}: FilterBarProps) {
  return (
    <div className="mb-3">
      <div className="flex items-center gap-2 mb-3">
        <div className="relative flex-1 min-w-[140px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary" />
          <input
            type="text"
            placeholder="Buscar tarefas..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 text-[13px]"
          />
        </div>
        <button
          onClick={onAddClick}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-ink-primary text-bg-base rounded-md text-[13px] font-medium whitespace-nowrap"
        >
          <Plus size={15} />
          Nova tarefa
        </button>
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => onPriorityFilterChange(f.value)}
            className={clsx(
              "px-2.5 py-1 rounded-full text-xs border transition-colors",
              priorityFilter === f.value
                ? "border-line-default bg-bg-surface text-ink-primary font-medium"
                : "border-line-subtle text-ink-secondary hover:text-ink-primary"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}
