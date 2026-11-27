/**
 * Web3Forms submission, loaded on the first submit (a lazy chunk), so it
 * costs nothing until the form is used. API: docs.web3forms.com.
 */
export type SendResult = { ok: true } | { ok: false; message?: string };

export async function sendToWeb3Forms(
  endpoint: string,
  payload: Record<string, string>,
): Promise<SendResult> {
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
    const json: unknown = await res.json().catch(() => null);
    if (res.ok && isRecord(json) && json.success === true) return { ok: true };
    // 400: { body: { message } } · 429: { message } · 500: { error }
    const body = isRecord(json) && isRecord(json.body) ? json.body : {};
    const message = [body.message, isRecord(json) && json.message, isRecord(json) && json.error].find(
      (m): m is string => typeof m === "string" && m.trim().length > 0,
    );
    return { ok: false, message };
  } catch {
    return { ok: false };
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
