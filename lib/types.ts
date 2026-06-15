export type Priority = "Alta" | "Média" | "Baixa";
export type ViewTab = "hoje" | "semana" | "mes" | "sem-data";

export interface Subtask {
  id: string;
  title: string;
  done: boolean;
}

export interface Segment {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  notes: string | null;
  segment: string;
  priority: Priority;
  due_date: string | null;
  due_time: string | null;
  done: boolean;
  subtasks: Subtask[];
  created_at: string;
}

export const DEFAULT_SEGMENTS: { name: string; color: string }[] = [
  { name: "Trabalho", color: "#378ADD" },
  { name: "Pessoal", color: "#1D9E75" },
  { name: "Saúde", color: "#D85A30" },
  { name: "Finanças", color: "#BA7517" },
  { name: "Projetos", color: "#7F77DD" },
];

export const PRIORITIES: Priority[] = ["Alta", "Média", "Baixa"];

export const PRIORITY_STYLES: Record<Priority, { bg: string; text: string }> = {
  Alta: { bg: "#FAECE7", text: "#993C1D" },
  Média: { bg: "#FAEEDA", text: "#854F0B" },
  Baixa: { bg: "#EAF3DE", text: "#3B6D11" },
};

export const VIEW_TABS: { value: ViewTab; label: string }[] = [
  { value: "hoje", label: "Hoje" },
  { value: "semana", label: "Semana" },
  { value: "mes", label: "Mês" },
  { value: "sem-data", label: "Sem data" },
];

/** Returns today's date as YYYY-MM-DD in the user's local timezone. */
export function todayStr(): string {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  return new Date(d.getTime() - offset * 60000).toISOString().slice(0, 10);
}

/**
 * Buckets a task into a view tab based on its due date, mirroring how
 * apps like Todoist/TickTick compute "Today" / "Upcoming" / "Someday"
 * from a single date field instead of a manual category.
 *
 * - Sem data: no due date, or due date beyond this month
 * - Hoje: due today or overdue
 * - Semana: due within the next 6 days
 * - Mês: due later this month
 */
export function getViewTab(dueDate: string | null): ViewTab {
  if (!dueDate) return "sem-data";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(`${dueDate}T00:00:00`);

  if (due.getTime() <= today.getTime()) return "hoje";

  const diffDays = Math.round((due.getTime() - today.getTime()) / 86400000);
  if (diffDays <= 6) return "semana";

  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  if (due.getTime() <= endOfMonth.getTime()) return "mes";

  return "sem-data";
}

/** True when a task is overdue (due before today and not done). */
export function isOverdue(task: Pick<Task, "due_date" | "done">): boolean {
  if (!task.due_date || task.done) return false;
  return task.due_date < todayStr();
}
