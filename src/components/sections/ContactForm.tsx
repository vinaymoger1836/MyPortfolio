"use client";

import { Send } from "lucide-react";
import { useState, type FormEvent, type InvalidEvent } from "react";
import type { Site } from "@/content/schema";
import { buttonClass } from "@/components/ui/Button";
import { cx, fill } from "@/lib/utils";

type Labels = Site["ui"]["contact"];
type Field = "name" | "email" | "message";
type Errors = Partial<Record<Field, string>>;

const inputClass =
  "mt-2 block w-full rounded-xl border border-border bg-surface px-4 py-3 text-text placeholder:text-muted focus-visible:border-accent aria-[invalid=true]:border-danger";

/**
 * Contact form, P1 version: native constraints plus inline messages, then a
 * prefilled mailto. Without JS the browser validates and posts to mailto.
 * P4 swaps the submit for Web3Forms and adds the honeypot.
 */
export function ContactForm({ email, labels }: { email: string; labels: Labels }) {
  const [errors, setErrors] = useState<Errors>({});
  const types = [
    { value: "job", label: labels.types.job },
    { value: "freelance", label: labels.types.freelance },
    { value: "other", label: labels.types.other },
  ] as const;

  // The browser fires `invalid` on each failing field when submit is attempted.
  // Swap its bubble for an inline message and focus the first bad field.
  function onInvalid(e: InvalidEvent<HTMLInputElement | HTMLTextAreaElement>) {
    e.preventDefault();
    const field = e.currentTarget.name as Field;
    setErrors((prev) => ({ ...prev, [field]: labels.errors[field] }));
    const first = e.currentTarget.form?.querySelector<HTMLElement>(":invalid");
    if (first === e.currentTarget) first.focus();
  }

  function onInput(e: FormEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const el = e.currentTarget;
    if (el.validity.valid && errors[el.name as Field]) {
      setErrors((prev) => ({ ...prev, [el.name]: undefined }));
    }
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k: string) => String(data.get(k) ?? "").trim();
    const typeLabel =
      types.find((t) => t.value === get("type"))?.label ?? labels.types.other;
    const subject = fill(labels.mailSubject, { name: get("name"), type: typeLabel });
    const body = `${get("message")}\n\n${get("name")}\n${get("email")}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  const describedBy = (field: Field) => (errors[field] ? `${field}-error` : undefined);

  return (
    <form
      aria-label={labels.formLabel}
      action={`mailto:${email}`}
      method="post"
      encType="text/plain"
      onSubmit={onSubmit}
      className="rounded-2xl border border-border bg-surface-2/60 p-5 md:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="text-sm font-medium">
            {labels.name} <span className="text-muted">({labels.required})</span>
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={describedBy("name")}
            onInvalid={onInvalid}
            onInput={onInput}
            className={inputClass}
          />
          <FieldError id="name-error" message={errors.name} />
        </div>
        <div>
          <label htmlFor="contact-email" className="text-sm font-medium">
            {labels.email} <span className="text-muted">({labels.required})</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={describedBy("email")}
            onInvalid={onInvalid}
            onInput={onInput}
            className={inputClass}
          />
          <FieldError id="email-error" message={errors.email} />
        </div>
      </div>

      <fieldset className="mt-5">
        <legend className="text-sm font-medium">{labels.type}</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {types.map((t, i) => (
            <label
              key={t.value}
              className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-border bg-surface px-4 text-sm has-[:checked]:border-accent has-[:checked]:text-accent has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent"
            >
              <input
                type="radio"
                name="type"
                value={t.value}
                defaultChecked={i === 0}
                className="size-4 accent-accent focus-visible:outline-none"
              />
              {t.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-5">
        <label htmlFor="contact-message" className="text-sm font-medium">
          {labels.message} <span className="text-muted">({labels.required})</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={describedBy("message")}
          onInvalid={onInvalid}
          onInput={onInput}
          className={cx(inputClass, "resize-y")}
        />
        <FieldError id="message-error" message={errors.message} />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button type="submit" className={buttonClass("primary")}>
          {labels.submit}
          <Send className="size-4" aria-hidden="true" />
        </button>
        <p className="text-sm text-muted">{labels.mailtoNote}</p>
      </div>
    </form>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 text-sm text-danger">
      {message}
    </p>
  );
}
