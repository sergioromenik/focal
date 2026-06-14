import type { Task } from "@/lib/types";

export async function registerServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return null;
  try {
    return await navigator.serviceWorker.register("/sw.js");
  } catch {
    return null;
  }
}

export function getNotificationPermission(): NotificationPermission | "unsupported" {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermission | "unsupported"> {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
  return Notification.requestPermission();
}

async function showNotification(title: string, body: string, tag: string) {
  const registration = await navigator.serviceWorker.getRegistration();
  if (registration) {
    registration.active?.postMessage({ type: "SHOW_NOTIFICATION", title, body, tag });
  } else {
    new Notification(title, { body, tag, icon: "/icons/icon-192.png" });
  }
}

const REMINDED_KEY = "focal_reminded_ids";

function getRemindedIds(): Set<string> {
  try {
    const raw = sessionStorage.getItem(REMINDED_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function saveRemindedIds(ids: Set<string>) {
  sessionStorage.setItem(REMINDED_KEY, JSON.stringify([...ids]));
}

/**
 * Checks pending tasks and fires a local notification for anything that's
 * due today (or overdue) and marked as high priority. Runs while the app
 * is open; call it on load and on an interval.
 */
export function checkDueTasks(tasks: Task[]) {
  if (typeof window === "undefined" || Notification.permission !== "granted") return;

  const todayStr = new Date().toISOString().slice(0, 10);
  const reminded = getRemindedIds();

  const due = tasks.filter(
    (t) =>
      !t.done &&
      t.due_date &&
      t.due_date <= todayStr &&
      t.priority === "Alta" &&
      !reminded.has(t.id)
  );

  if (!due.length) return;

  if (due.length === 1) {
    showNotification("focal — tarefa de hoje", `"${due[0].title}" está pendente.`, due[0].id);
  } else {
    showNotification(
      "focal — tarefas de hoje",
      `Você tem ${due.length} tarefas de alta prioridade pendentes hoje.`,
      "focal-batch"
    );
  }

  due.forEach((t) => reminded.add(t.id));
  saveRemindedIds(reminded);
}
