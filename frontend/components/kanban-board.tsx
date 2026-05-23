"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { Calendar, MapPin, MoveRight } from "lucide-react";
import { StatusDot } from "@/components/status-badge";
import { api } from "@/lib/api";
import { STATUSES, type Application, type Status } from "@/lib/types";

interface KanbanBoardProps {
  applications: Application[];
  onEdit: (app: Application) => void;
  onSaved: (app: Application) => void;
}

export function KanbanBoard({ applications, onEdit, onSaved }: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Activation distance prevents click-vs-drag confusion: a tap that moves
  // less than 6px counts as a click (opens edit) instead of starting a drag.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } }),
  );

  const grouped = useMemo(() => {
    const map: Record<Status, Application[]> = {
      Applied: [],
      "Phone Screen": [],
      Interview: [],
      Offer: [],
      Rejected: [],
      Withdrawn: [],
    };
    for (const a of applications) map[a.status].push(a);
    return map;
  }, [applications]);

  const activeApp = activeId
    ? applications.find((a) => a.id === activeId) ?? null
    : null;

  function handleDragStart(e: DragStartEvent) {
    setActiveId(String(e.active.id));
    setError(null);
  }

  async function handleDragEnd(e: DragEndEvent) {
    setActiveId(null);
    const { active, over } = e;
    if (!over) return;
    const id = String(active.id);
    const newStatus = String(over.id) as Status;
    const app = applications.find((a) => a.id === id);
    if (!app || app.status === newStatus) return;

    // Optimistic update via onSaved; revert by re-emitting original on error.
    onSaved({ ...app, status: newStatus });
    try {
      const updated = await api.updateApplication(id, { status: newStatus });
      onSaved(updated);
    } catch (err) {
      onSaved(app);
      setError(err instanceof Error ? err.message : "Failed to update status");
    }
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="card border-status-rejected-border p-3 text-sm text-status-rejected-text">
          {error}
        </div>
      )}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        <div className="flex gap-3 overflow-x-auto pb-3">
          {STATUSES.map((status) => (
            <Column
              key={status}
              status={status}
              apps={grouped[status]}
              onEdit={onEdit}
            />
          ))}
        </div>
        <DragOverlay>
          {activeApp ? <Card app={activeApp} dragging /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

function Column({
  status,
  apps,
  onEdit,
}: {
  status: Status;
  apps: Application[];
  onEdit: (app: Application) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  return (
    <div className="flex w-72 flex-shrink-0 flex-col">
      <div className="mb-2 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <StatusDot status={status} />
          <span className="text-sm font-medium text-text-primary">{status}</span>
        </div>
        <span className="rounded-full bg-bg-elevated px-2 py-0.5 text-xs font-medium tabular-nums text-text-muted">
          {apps.length}
        </span>
      </div>
      <div
        ref={setNodeRef}
        className={`flex min-h-[200px] flex-col gap-2 rounded-lg border p-2 transition-all ${
          isOver
            ? "border-brand-500 bg-brand-500/5 shadow-glow"
            : "border-border-subtle bg-bg-elevated/40"
        }`}
      >
        {apps.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-1.5 rounded-md border border-dashed border-border-subtle/60 px-2 py-6 text-center">
            <MoveRight className="h-4 w-4 text-text-muted" />
            <p className="text-xs text-text-muted">Drop here</p>
          </div>
        ) : (
          apps.map((app) => (
            <DraggableCard key={app.id} app={app} onEdit={() => onEdit(app)} />
          ))
        )}
      </div>
    </div>
  );
}

function DraggableCard({
  app,
  onEdit,
}: {
  app: Application;
  onEdit: () => void;
}) {
  const { setNodeRef, attributes, listeners, isDragging } = useDraggable({
    id: app.id,
  });
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={onEdit}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onEdit();
        }
      }}
      className={`cursor-grab touch-none active:cursor-grabbing ${
        isDragging ? "opacity-30" : ""
      }`}
    >
      <Card app={app} />
    </div>
  );
}

function Card({ app, dragging }: { app: Application; dragging?: boolean }) {
  return (
    <div
      className={`card p-3 text-sm transition-all ${
        dragging
          ? "rotate-1 shadow-card-hover ring-2 ring-brand-500"
          : "hover:border-border hover:bg-bg-hover"
      }`}
    >
      <div className="font-medium text-text-primary">{app.company}</div>
      <div className="text-xs text-text-secondary">{app.role}</div>
      <div className="mt-2 flex items-center justify-between text-[11px] text-text-muted">
        <span className="inline-flex items-center gap-1 tabular-nums">
          <Calendar className="h-2.5 w-2.5" />
          {app.date_applied}
        </span>
        {app.location && (
          <span className="inline-flex items-center gap-1 truncate pl-2">
            <MapPin className="h-2.5 w-2.5 flex-shrink-0" />
            <span className="truncate">{app.location}</span>
          </span>
        )}
      </div>
      {app.follow_up_date && <CardFollowUp date={app.follow_up_date} />}
    </div>
  );
}

function CardFollowUp({ date }: { date: string }) {
  const days = daysUntil(date);
  const overdue = days < 0;
  const soon = days >= 0 && days <= 2;
  const cls = overdue
    ? "border-status-rejected-border bg-status-rejected-bg text-status-rejected-text"
    : soon
    ? "border-status-screen-border bg-status-screen-bg text-status-screen-text"
    : "border-border-subtle bg-bg-elevated text-text-muted";
  const label = overdue
    ? `Follow up overdue ${Math.abs(days)}d`
    : days === 0
    ? "Follow up today"
    : `Follow up in ${days}d`;
  return (
    <div
      className={`mt-2 inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] ${cls}`}
    >
      <Calendar className="h-2.5 w-2.5" />
      {label}
    </div>
  );
}

function daysUntil(iso: string): number {
  const target = new Date(iso + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}
