"use client";

import { Check, Send } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent, type InvalidEvent } from "react";
import type { Site } from "@/content/schema";
import { buttonClass } from "@/components/ui/Button";
import { cx, fill } from "@/lib/utils";

type Labels = Site["ui"]["contact"];
type Field = "name" | "email" | "message";
type Errors = Partial<Record<Field, string>>;
type Status = "idle" | "sending" | "sent" | "error";

export const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

const inputClass =
  "mt-2 block w-full rounded-xl border border-border bg-surface px-4 py-3 text-text placeholder:text-muted focus-visible:border-accent aria-[invalid=true]:border-danger";

/**
 * Contact form. Native constraints with inline messages, then:
 * - Web3Forms (when a key is set at build): a JSON POST from the browser,
 *   with success and error states and a prefilled email as the fallback.
 *   Without JS the form posts straight to Web3Forms.
 * - Otherwise a prefilled mailto (and a mailto action without JS).
 * A hidden `botcheck` honeypot catches simple bots. Services CTAs with
 * `data-contact-service` pre-select Freelance and that service.
 */
export function ContactForm({
  email,
  ownerName,
  labels,
  accessKey,
  services,
}: {
  email: string;
  ownerName: string;
  labels: Labels;
  /** Web3Forms access key; without one the form uses mailto. */
  accessKey?: string;
  services: string[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [apiMessage, setApiMessage] = useState<string>();
  const [fallbackHref, setFallbackHref] = useState(`mailto:${email}`);
  const provider = accessKey ? "web3forms" : "mailto";

  const types = [
    { value: "job", label: labels.types.job },
    { value: "freelance", label: labels.types.freelance },
    { value: "other", label: labels.types.other },
  ] as const;

  // Services "Let's talk" links: pre-select Freelance and the service.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const link = (e.target as Element | null)?.closest?.("a[data-contact-service]");
      const form = formRef.current;
      if (!link || !form) return;
      setStatus((s) => (s === "sent" ? "idle" : s));
      const freelance = form.querySelector<HTMLInputElement>('input[name="type"][value="freelance"]');
      if (freelance) freelance.checked = true;
      const select = form.elements.namedItem("service");
      if (select instanceof HTMLSelectElement) {
        select.value = link.getAttribute("data-contact-service") ?? "";
      }
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (status === "sent") successRef.current?.focus();
  }, [status]);

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

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;
    const data = new FormData(form);
    const get = (k: string) => String(data.get(k) ?? "").trim();
    const type = get("type");
    const typeLabel = types.find((t) => t.value === type)?.label ?? labels.types.other;
    const service = type === "freelance" ? get("service") : "";
    const subject = fill(labels.mailSubject, { name: get("name"), type: typeLabel });
    const body = [get("message"), service && `${labels.service}: ${service}`, `${get("name")}\n${get("email")}`]
      .filter(Boolean)
      .join("\n\n");
    const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    if (!accessKey) {
      window.location.href = mailto;
      return;
    }

    // Honeypot ticked: pretend it worked and send nothing.
    if (data.get("botcheck")) {
      form.reset();
      setStatus("sent");
      return;
    }

    setStatus("sending");
    setApiMessage(undefined);
    setFallbackHref(mailto);
    const { sendToWeb3Forms } = await import("./submitContact");
    const result = await sendToWeb3Forms(WEB3FORMS_ENDPOINT, {
      access_key: accessKey,
      subject,
      from_name: fill(labels.fromName, { name: ownerName }),
      name: get("name"),
      email: get("email"),
      type: typeLabel,
      ...(service ? { service } : {}),
      message: get("message"),
    });
    if (result.ok) {
      form.reset();
      setStatus("sent");
    } else {
      setApiMessage(result.message);
      setStatus("error");
    }
  }

  function sendAnother() {
    setStatus("idle");
    requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>("#contact-name")?.focus());
  }

  const describedBy = (field: Field) => (errors[field] ? `${field}-error` : undefined);
  const sending = status === "sending";

  return (
    <form
      ref={formRef}
      aria-label={labels.formLabel}
      data-provider={provider}
      action={accessKey ? WEB3FORMS_ENDPOINT : `mailto:${email}`}
      method="post"
      encType={accessKey ? undefined : "text/plain"}
      onSubmit={onSubmit}
      className="contact-form rounded-2xl border border-border bg-surface-2/60 p-5 md:p-8"
    >
      {status === "sent" && (
        <div className="form-success flex flex-col items-start py-6">
          <span className="success-pop inline-flex size-14 items-center justify-center rounded-full bg-accent text-accent-ink">
            <Check className="size-7" aria-hidden="true" />
          </span>
          <h3 ref={successRef} tabIndex={-1} className="mt-6 text-2xl font-semibold tracking-tight focus:outline-none">
            {labels.successTitle}
          </h3>
          <p role="status" className="mt-2 text-muted">
            {labels.successBody}
          </p>
          <button type="button" onClick={sendAnother} className={cx(buttonClass("outline"), "mt-6")}>
            {labels.sendAnother}
          </button>
        </div>
      )}

      <div hidden={status === "sent"}>
        {accessKey && (
          <>
            <input type="hidden" name="access_key" value={accessKey} />
            <input type="hidden" name="from_name" value={fill(labels.fromName, { name: ownerName })} />
            <input
              type="checkbox"
              name="botcheck"
              tabIndex={-1}
              autoComplete="off"
              aria-label={labels.honeypot}
              className="hidden"
            />
          </>
        )}

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

        {services.length > 0 && (
          <div className="contact-service mt-5">
            <label htmlFor="contact-service" className="text-sm font-medium">
              {labels.service}
            </label>
            <select id="contact-service" name="service" defaultValue="" className={cx(inputClass, "min-h-11")}>
              <option value="">{labels.serviceAny}</option>
              {services.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        )}

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
          <button
            type="submit"
            aria-disabled={sending || undefined}
            aria-busy={sending || undefined}
            className={cx(buttonClass("primary"), sending && "cursor-progress opacity-80")}
          >
            {sending ? labels.sending : labels.submit}
            <Send className="size-4" aria-hidden="true" />
          </button>
          <p className="text-sm text-muted">{accessKey ? labels.sendNote : labels.mailtoNote}</p>
        </div>

        <div role="alert">
          {status === "error" && (
            <div className="mt-5 rounded-xl border border-danger/60 bg-surface p-4 text-sm">
              <p className="font-medium text-danger">{labels.errorTitle}</p>
              {apiMessage && <p className="mt-1 text-muted">{apiMessage}</p>}
              <a
                href={fallbackHref}
                className="mt-2 inline-flex min-h-11 items-center text-text underline decoration-accent/60 underline-offset-4 hover:text-accent"
              >
                {labels.errorFallback}
              </a>
            </div>
          )}
        </div>
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
