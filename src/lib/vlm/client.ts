import { analyzeFrameWithXai } from "./analyze";
import type { VlmConfig } from "@/lib/store";
import { VLM_TOKEN_KEY } from "@/lib/store";

export type VlmResult = { ok: true; text: string; tokens: number | null } | { ok: false; error: string };

function storedToken(fallback: string) {
  if (typeof window === "undefined") return fallback;
  return localStorage.getItem(VLM_TOKEN_KEY) || fallback;
}

export async function runVlm(opts: {
  config: VlmConfig;
  imageDataUrl: string;
  prompt: string;
}): Promise<VlmResult> {
  const { config, imageDataUrl, prompt } = opts;
  if (config.provider === "xai") {
    return analyzeFrameWithXai({ data: { imageDataUrl, prompt } });
  }

  const token = storedToken(config.token);
  const model =
    config.provider === "ollama"
      ? config.model || "llava"
      : config.provider === "huggingface"
        ? config.model || "meta-llama/Llama-3.2-11B-Vision-Instruct"
        : config.model || "gpt-4o-mini";

  const endpoint =
    config.provider === "huggingface"
      ? `https://router.huggingface.co/v1/chat/completions`
      : config.endpoint || "http://localhost:11434/v1/chat/completions";

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model,
        max_tokens: config.maxTokens || 350,
        temperature: config.temperature,
        messages: [
          {
            role: "user",
            content: [
              { type: "image_url", image_url: { url: imageDataUrl } },
              { type: "text", text: prompt },
            ],
          },
        ],
      }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return { ok: false, error: `Provider error ${res.status}: ${body.slice(0, 200)}` };
    }
    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
      usage?: { total_tokens?: number };
    };
    return {
      ok: true,
      text: json.choices?.[0]?.message?.content ?? JSON.stringify(json).slice(0, 800),
      tokens: json.usage?.total_tokens ?? null,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Network error";
    if (config.provider === "ollama") {
      return {
        ok: false,
        error: `${msg}. Start Ollama locally and pull a vision model (e.g. llava), then retry.`,
      };
    }
    return { ok: false, error: msg };
  }
}

export function persistToken(token: string) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem(VLM_TOKEN_KEY, token);
  else localStorage.removeItem(VLM_TOKEN_KEY);
}
