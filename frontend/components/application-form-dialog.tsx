"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/modal";
import { api } from "@/lib/api";
import { STATUSES, type Application, type ApplicationInput, type Status } from "@/lib/types";

interface ApplicationFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  application?: Application;
}

interface FormState {
  company: string;
  role: string;
  location: string;
  status: Status;
  date_applied: string;
  job_url: string;
  salary_range: string;
  contact_name: string;
  notes: string;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function initialState(app?: Application): FormState {
  return {
    company: app?.company ?? "",
    role: app?.role ?? "",
    location: app?.location ?? "",
    status: app?.status ?? "Applied",
    date_applied: app?.date_applied ?? todayIso(),
    job_url: app?.job_url ?? "",
    salary_range: app?.salary_range ?? "",
    contact_name: app?.contact_name ?? "",
    notes: app?.notes ?? "",
  };
}

export function ApplicationFormDialog({
  open,
  onClose,
  onSaved,
  application,
}: ApplicationFormDialogProps) {
  const isEdit = Boolean(application);
  const [form, setForm] = useState<FormState>(initialState(application));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState(false);
  const [forceSubmit, setForceSubmit] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(initialState(application));
      setError(null);
      setDuplicateWarning(false);
      setForceSubmit(false);
      setConfirmDelete(false);
    }
  }, [open, application]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    if (key === "company" || key === "role") {
      setDuplicateWarning(false);
      setForceSubmit(false);
    }
  }

  function toPayload(): ApplicationInput {
    return {
      company: form.company.trim(),
      role: form.role.trim(),
      location: form.location.trim() || null,
      status: form.status,
      date_applied: form.date_applied,
      job_url: form.job_url.trim() || null,
      salary_range: form.salary_range.trim() || null,
      contact_name: form.contact_name.trim() || null,
      notes: form.notes.trim() || null,
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.company.trim() || !form.role.trim() || !form.date_applied) {
      setError("Company, role, and date are required.");
      return;
    }

    if (!forceSubmit) {
      try {
        const { exists } = await api.duplicateCheck(
          form.company.trim(),
          form.role.trim(),
          application?.id
        );
        if (exists) {
          setDuplicateWarning(true);
          setForceSubmit(true);
          return;
        }
      } catch {
        // Non-fatal: if the duplicate check fails, allow submission.
      }
    }

    setSaving(true);
    try {
      const payload = toPayload();
      if (isEdit && application) {
        await api.updateApplication(application.id, payload);
      } else {
        await api.createApplication(payload);
      }
      onSaved();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!application) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    setError(null);
    try {
      await api.deleteApplication(application.id);
      onSaved();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
      setDeleting(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit application" : "Add application"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Company *" htmlFor="company">
            <input
              id="company"
              required
              value={form.company}
              onChange={(e) => update("company", e.target.value)}
              className="input-base"
              autoFocus
            />
          </Field>
          <Field label="Role *" htmlFor="role">
            <input
              id="role"
              required
              value={form.role}
              onChange={(e) => update("role", e.target.value)}
              className="input-base"
            />
          </Field>

          <Field label="Status *" htmlFor="status">
            <select
              id="status"
              value={form.status}
              onChange={(e) => update("status", e.target.value as Status)}
              className="input-base"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Date applied *" htmlFor="date_applied">
            <input
              id="date_applied"
              type="date"
              required
              value={form.date_applied}
              onChange={(e) => update("date_applied", e.target.value)}
              className="input-base"
            />
          </Field>

          <Field label="Location" htmlFor="location">
            <input
              id="location"
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
              className="input-base"
              placeholder="Remote, NYC, etc."
            />
          </Field>
          <Field label="Salary range" htmlFor="salary_range">
            <input
              id="salary_range"
              value={form.salary_range}
              onChange={(e) => update("salary_range", e.target.value)}
              className="input-base"
              placeholder="$80k–$100k"
            />
          </Field>

          <Field label="Job URL" htmlFor="job_url" full>
            <input
              id="job_url"
              type="url"
              value={form.job_url}
              onChange={(e) => update("job_url", e.target.value)}
              className="input-base"
              placeholder="https://…"
            />
          </Field>

          <Field label="Contact name" htmlFor="contact_name" full>
            <input
              id="contact_name"
              value={form.contact_name}
              onChange={(e) => update("contact_name", e.target.value)}
              className="input-base"
              placeholder="Recruiter or hiring manager"
            />
          </Field>

          <Field label="Notes" htmlFor="notes" full>
            <textarea
              id="notes"
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              rows={4}
              className="input-base resize-y"
            />
          </Field>
        </div>

        {duplicateWarning && (
          <div className="rounded-md border border-status-screen-border bg-status-screen-bg px-3 py-2 text-sm text-status-screen-text">
            You already have an application for this company + role. Click Save
            again to add it anyway.
          </div>
        )}

        {error && (
          <div className="rounded-md border border-status-rejected-border bg-status-rejected-bg px-3 py-2 text-sm text-status-rejected-text">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between gap-2 border-t border-border-subtle pt-4">
          <div>
            {isEdit && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-status-rejected-border bg-status-rejected-bg px-3 py-2 text-sm font-medium text-status-rejected-text transition-colors hover:bg-status-rejected-border/40 disabled:opacity-50"
              >
                {deleting
                  ? "Deleting…"
                  : confirmDelete
                  ? "Click again to confirm"
                  : "Delete"}
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving
                ? "Saving…"
                : duplicateWarning
                ? "Save anyway"
                : isEdit
                ? "Save"
                : "Add application"}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

function Field({
  label,
  htmlFor,
  full,
  children,
}: {
  label: string;
  htmlFor: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={full ? "sm:col-span-2" : undefined}>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-xs font-medium text-text-secondary"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
