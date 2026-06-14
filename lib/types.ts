export type Priority = "Alta" | "Média" | "Baixa";
export type Period = "dia" | "semana" | "mes" | "ano";

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
  period: Period;
  due_date: string | null;
  done: boolean;
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

export const PERIODS: { value: Period; label: string }[] = [
  { value: "dia", label: "Hoje" },
  { value: "semana", label: "Semana" },
  { value: "mes", label: "Mês" },
  { value: "ano", label: "Ano" },
];
