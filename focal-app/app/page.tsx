"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  registerServiceWorker,
  getNotificationPermission,
  requestNotificationPermission,
  checkDueTasks,
} from "@/lib/notifications";
import type { Period, Priority, Segment, Task } from "@/lib/types";
import { DEFAULT_SEGMENTS } from "@/lib/types";
import TopBar from "@/components/TopBar";
import StatsBar from "@/components/StatsBar";
import Sidebar from "@/components/Sidebar";
import FilterBar, { type PriorityFilter } from "@/components/FilterBar";
import TaskList from "@/components/TaskList";
import TaskModal from "@/components/TaskModal";
import NotificationBanner from "@/components/NotificationBanner";

export default function DashboardPage() {
  const supabase = useMemo(() => createClient(), []);

  const [loading, setLoading] = useState(true);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const [activeTab, setActiveTab] = useState<Period>("dia");
  const [activeSegment, setActiveSegment] = useState<string | "Todos">("Todos");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("Todas");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("default");

  // Initial load: session, segments, tasks.
  useEffect(() => {
    let active = true;

    async function load() {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user || !active) return;

      let { data: segmentRows } = await supabase
        .from("segments")
        .select("*")
        .order("created_at", { ascending: true });

      if (!segmentRows || segmentRows.length === 0) {
        const seeded = DEFAULT_SEGMENTS.map((s) => ({ ...s, user_id: user.id }));
        const { data: inserted } = await supabase.from("segments").insert(seeded).select("*");
        segmentRows = inserted ?? [];
      }

      const { data: taskRows } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });

      if (!active) return;
      setSegments(segmentRows ?? []);
      setTasks(taskRows ?? []);
      setLoading(false);
    }

    load();
    registerServiceWorker();
    setPermission(getNotificationPermission());

    return () => {
      active = false;
    };
  }, [supabase]);

  // Realtime sync so the same account stays in sync across devices.
  useEffect(() => {
    const channel = supabase
      .channel("tasks-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "tasks" }, (payload) => {
        setTasks((current) => {
          if (payload.eventType === "INSERT") {
            const incoming = payload.new as Task;
            if (current.some((t) => t.id === incoming.id)) return current;
            return [incoming, ...current];
          }
          if (payload.eventType === "UPDATE") {
            const incoming = payload.new as Task;
            return current.map((t) => (t.id === incoming.id ? incoming : t));
          }
          if (payload.eventType === "DELETE") {
            const removed = payload.old as Task;
            return current.filter((t) => t.id !== removed.id);
          }
          return current;
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  // Periodic check for due/high-priority tasks while the app is open.
  useEffect(() => {
    if (permission !== "granted") return;
    checkDueTasks(tasks);
    const interval = setInterval(() => checkDueTasks(tasks), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [tasks, permission]);

  async function handleEnableNotifications() {
    const result = await requestNotificationPermission();
    setPermission(result);
  }

  async function handleToggle(id: string) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const done = !task.done;
    setTasks((current) => current.map((t) => (t.id === id ? { ...t, done } : t)));
    await supabase.from("tasks").update({ done }).eq("id", id);
  }

  async function handleDelete(id: string) {
    setTasks((current) => current.filter((t) => t.id !== id));
    await supabase.from("tasks").delete().eq("id", id);
  }

  async function handleAddTask(data: {
    title: string;
    segment: string;
    priority: Priority;
    period: Period;
    due_date: string | null;
    notes: string | null;
  }) {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) return;

    const optimistic: Task = {
      id: crypto.randomUUID(),
      user_id: user.id,
      done: false,
      created_at: new Date().toISOString(),
      ...data,
    };

    setTasks((current) => [optimistic, ...current]);
    setModalOpen(false);

    const { data: inserted } = await supabase
      .from("tasks")
      .insert({ ...data, user_id: user.id })
      .select("*")
      .single();

    if (inserted) {
      setTasks((current) => current.map((t) => (t.id === optimistic.id ? inserted : t)));
    }
  }

  async function handleAddSegment(name: string, color: string) {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) return;

    const optimistic: Segment = {
      id: crypto.randomUUID(),
      user_id: user.id,
      name,
      color,
      created_at: new Date().toISOString(),
    };
    setSegments((current) => [...current, optimistic]);

    const { data: inserted } = await supabase
      .from("segments")
      .insert({ name, color, user_id: user.id })
      .select("*")
      .single();

    if (inserted) {
      setSegments((current) => current.map((s) => (s.id === optimistic.id ? inserted : s)));
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (activeSegment !== "Todos" && t.segment !== activeSegment) return false;
      if (activeTab !== "ano" && t.period !== activeTab) return false;
      if (priorityFilter === "Feitas") {
        if (!t.done) return false;
      } else if (priorityFilter !== "Todas" && t.priority !== priorityFilter) {
        return false;
      }
      if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [tasks, activeSegment, priorityFilter, activeTab, search]);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const t of tasks) {
      if (t.done) continue;
      map[t.segment] = (map[t.segment] ?? 0) + 1;
    }
    return map;
  }, [tasks]);

  const totalPending = useMemo(() => tasks.filter((t) => !t.done).length, [tasks]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-ink-tertiary text-sm">
        Carregando...
      </div>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      <TopBar activeTab={activeTab} onTabChange={setActiveTab} onSignOut={handleSignOut} />

      <NotificationBanner permission={permission} onEnable={handleEnableNotifications} />

      <StatsBar tasks={filtered} />

      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
        <Sidebar
          segments={segments}
          activeSegment={activeSegment}
          onSegmentChange={setActiveSegment}
          counts={counts}
          totalPending={totalPending}
          onAddSegment={handleAddSegment}
        />

        <div>
          <FilterBar
            search={search}
            onSearchChange={setSearch}
            priorityFilter={priorityFilter}
            onPriorityFilterChange={setPriorityFilter}
            onAddClick={() => setModalOpen(true)}
          />
          <TaskList tasks={filtered} segments={segments} onToggle={handleToggle} onDelete={handleDelete} />
        </div>
      </div>

      {modalOpen && (
        <TaskModal
          segments={segments}
          defaultSegment={activeSegment}
          defaultPeriod={activeTab}
          onClose={() => setModalOpen(false)}
          onSave={handleAddTask}
        />
      )}
    </main>
  );
}
