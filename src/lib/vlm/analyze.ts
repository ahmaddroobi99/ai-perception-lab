import { createServerFn } from "@tanstack/react-start";

export const getXaiAvailability = createServerFn({ method: "GET" }).handler(async () => {
  return { available: Boolean(process.env.XAI_API_KEY) };
});

export const analyzeFrameWithXai = createServerFn({ method: "POST" })
  .validator((input: { imageDataUrl: string; prompt: string }) => input)
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return { ok: false as const, error: "xAI is not available in this environment." };
    }
    if (!data.imageDataUrl.startsWith("data:image/")) {
      return { ok: false as const, error: "Expected a data-URL image." };
    }
    if (data.imageDataUrl.length > 2_400_000) {
      return { ok: false as const, error: "Frame is too large. Capture at a lower resolution." };
    }
    const prompt = (data.prompt || "Describe the visible scene.").slice(0, 500);

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        max_tokens: 350,
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content:
              "You are a careful vision-language assistant for an educational perception lab. Describe only what is visible. Do not invent objects. Flag uncertainty. This is not a safety-certified system.",
          },
          {
            role: "user",
            content: [
              { type: "image_url", image_url: { url: data.imageDataUrl } },
              { type: "text", text: prompt },
            ],
          },
        ],
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return {
        ok: false as const,
        error: `xAI API error ${res.status}${body ? `: ${body.slice(0, 180)}` : ""}`,
      };
    }
    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
      usage?: { total_tokens?: number };
    };
    return {
      ok: true as const,
      text: json.choices?.[0]?.message?.content ?? "",
      tokens: json.usage?.total_tokens ?? null,
    };
  });
