import { CircleDashed } from "lucide-react";
import type { Segment, Task } from "@/lib/types";
import TaskItem from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  segments: Segment[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskList({ tasks, segments, onToggle, onDelete }: TaskListProps) {
  const colorFor = (segmentName: string) =>
    segments.find((s) => s.name === segmentName)?.color ?? "#888780";

  if (!tasks.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center text-ink-tertiary">
        <CircleDashed size={28} className="mb-3" />
        <p className="text-sm">Nenhuma tarefa por aqui.</p>
        <p className="text-xs mt-1">Adicione uma para começar a organizar seu tempo.</p>
      </div>
    );
  }

  const pending = tasks.filter((t) => !t.done);
  const done = tasks.filter((t) => t.done);

  return (
    <div className="flex flex-col">
      {pending.length > 0 && (
        <>
          <SectionLabel label="Pendentes" />
          {pending.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              segmentColor={colorFor(task.segment)}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </>
      )}
      {done.length > 0 && (
        <>
          <SectionLabel label="Concluídas" />
          {done.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              segmentColor={colorFor(task.segment)}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </>
      )}
    </div>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 px-2.5 py-1.5 mt-1 first:mt-0">
      <span className="text-[11px] font-medium text-ink-tertiary uppercase tracking-wide whitespace-nowrap">
        {label}
      </span>
      <span className="flex-1 h-px bg-line-subtle" />
    </div>
  );
}
