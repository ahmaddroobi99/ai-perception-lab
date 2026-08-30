import { createFileRoute } from "@tanstack/react-router";
import { FrameworkLab } from "@/components/labs/FrameworkLab";

export const Route = createFileRoute("/_lab/transformers")({
  component: () => (
    <FrameworkLab
      eyebrow="Transformers"
      title="Attention, processors, Hugging Face"
      lede="A Transformer is an architecture. Hugging Face Transformers is the ecosystem. VLMs, ViTs and many LLMs are Transformers. YOLO generally is not."
      steps={[
        { title: "Processor", body: "Image patches or text tokens → embeddings + masks." },
        { title: "Attention", body: "softmax(QKᵀ/√d) V routes information across the sequence." },
        { title: "Layers", body: "Stacked blocks. Residual + MLP + norm." },
        { title: "Head", body: "Classify, generate tokens, or emit dense features." },
      ]}
      compare={[
        { k: "Architecture", v: "Attention blocks" },
        { k: "Ecosystem", v: "Hugging Face hub, tokenizers, pipelines" },
        { k: "In-browser", v: "transformers.js can run small quantized models" },
        { k: "This VLM lab", v: "Calls an API or local Ollama — not a 70B in-tab" },
      ]}
      honesty="We do not ship a hidden Hugging Face token. Paste your own (BYOK) or use local Ollama. Tokens in localStorage are a demo mechanism, not production secret handling."
      cta={{ to: "/vlm", label: "Open VLM lab" }}
    />
  ),
});
