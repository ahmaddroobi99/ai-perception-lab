import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { LiveStage } from "@/components/camera/LiveStage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useLab } from "@/lib/store";
import { persistToken, runVlm } from "@/lib/vlm/client";
import { captureFrame } from "@/lib/capture-frame";
import { CapabilityTag } from "@/components/shared/CapabilityTag";

export const Route = createFileRoute("/_lab/vlm")({ component: VlmPage });

const PRESETS = [
  "What objects are present?",
  "What is happening in this scene?",
  "Describe the environment.",
  "Is there anything unusual?",
  "What safety risks do you see?",
  "What objects are closest to the camera?",
  "What could a robot do in this environment?",
];

function VlmPage() {
  const vlm = useLab((s) => s.vlm);
  const setVlm = useLab((s) => s.setVlm);
  const xai = useLab((s) => s.xaiAvailable);
  const cameraOn = useLab((s) => s.cameraOn);
  const [prompt, setPrompt] = useState(PRESETS[0]);
  const [token, setToken] = useState("");
  const [pending, setPending] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [lastMs, setLastMs] = useState<number | null>(null);

  async function actuallyRun() {
    setConfirm(false);
    setPending(true);
    setError(null);
    const video = document.querySelector("video");
    if (!(video instanceof HTMLVideoElement) || !cameraOn) {
      setPending(false);
      setError("Connect the camera and wait for a live frame first.");
      return;
    }
    const image = captureFrame(video);
    if (!image) {
      setPending(false);
      setError("Could not capture a frame.");
      return;
    }
    persistToken(token);
    const t0 = performance.now();
    const r = await runVlm({ config: vlm, imageDataUrl: image, prompt });
    setLastMs(performance.now() - t0);
    setPending(false);
    if (!r.ok) setError(r.error);
    else setResult(r.text);
  }

  return (
    <div>
      <PageHeader
        eyebrow="VLM lab"
        title="Vision-language reasoning"
        description="Detection names objects. A VLM answers questions about a picture. No API token is shipped with this app. Use the platform xAI path, local Ollama, or paste your own key."
      />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)]">
        <div className="space-y-4">
          <LiveStage />
          <Card>
            <CardHeader>
              <CardTitle>Ask about this frame</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPrompt(p)}
                    className="rounded-md border border-border px-2 py-1 text-left text-[11px] text-muted hover:text-fg"
                  >
                    {p}
                  </button>
                ))}
              </div>
              <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={3} />
              <Button onClick={() => setConfirm(true)} disabled={pending}>
                {pending ? "Running…" : "Run analysis"}
              </Button>
              {error ? <p className="text-sm text-danger">{error}</p> : null}
              {result ? (
                <div className="rounded-lg border border-border bg-surface-2 p-3 text-sm leading-relaxed">
                  {result}
                  {lastMs != null ? (
                    <p className="mt-2 font-mono text-[11px] text-subtle">{lastMs.toFixed(0)} ms round-trip</p>
                  ) : null}
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Provider</CardTitle>
            <CapabilityTag value={vlm.provider === "ollama" ? "local" : "api"} />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>VLM provider</Label>
              <Select
                value={vlm.provider}
                onValueChange={(v) =>
                  setVlm({
                    provider: v as typeof vlm.provider,
                    model:
                      v === "xai"
                        ? "grok-4.5"
                        : v === "ollama"
                          ? "llava"
                          : vlm.model,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="xai">xAI (platform, no pasted key)</SelectItem>
                  <SelectItem value="ollama">Local Ollama</SelectItem>
                  <SelectItem value="huggingface">Hugging Face (BYOK)</SelectItem>
                  <SelectItem value="openai-compat">OpenAI-compatible (BYOK)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {vlm.provider === "xai" ? (
              <p className="text-xs text-muted">
                {xai
                  ? "xAI is available on the server. Frames are sent only when you confirm."
                  : "xAI is not configured in this environment. Switch to Ollama or BYOK."}
              </p>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Endpoint</Label>
                  <Input
                    value={vlm.endpoint}
                    onChange={(e) => setVlm({ endpoint: e.target.value })}
                    placeholder="http://localhost:11434/v1/chat/completions"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Model</Label>
                  <Input value={vlm.model} onChange={(e) => setVlm({ model: e.target.value })} />
                </div>
                {vlm.provider !== "ollama" ? (
                  <div className="space-y-2">
                    <Label>API token (stored only in this browser)</Label>
                    <Input
                      type="password"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      placeholder="hf_… / sk-…"
                    />
                    <p className="text-xs text-warn">
                      Frontend storage is not production-grade. Use a backend proxy for real keys.
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-muted">
                    Free local path: install Ollama, `ollama pull llava`, keep the endpoint on
                    localhost. No token required.
                  </p>
                )}
              </>
            )}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Temperature</Label>
                <span className="font-mono text-xs">{vlm.temperature.toFixed(2)}</span>
              </div>
              <Slider
                min={0}
                max={1}
                step={0.05}
                value={[vlm.temperature]}
                onValueChange={([v]) => setVlm({ temperature: v ?? 0.2 })}
              />
            </div>
            <Badge variant="default">Your token is not supplied by this application</Badge>
          </CardContent>
        </Card>
      </div>

      <Dialog open={confirm} onOpenChange={setConfirm}>
        <DialogContent>
          <DialogTitle>Send this frame?</DialogTitle>
          <DialogDescription>
            The captured image will be sent to{" "}
            {vlm.provider === "xai"
              ? "the xAI vision model on the server"
              : vlm.provider === "ollama"
                ? "your local Ollama endpoint"
                : "the configured external provider"}
            . It is not stored by this app beyond the request. Confirm only if that is acceptable.
          </DialogDescription>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirm(false)}>
              Cancel
            </Button>
            <Button onClick={() => void actuallyRun()}>Send image</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
