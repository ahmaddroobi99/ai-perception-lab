import { createFileRoute, Link } from "@tanstack/react-router";
import { Aperture, ArrowRight, Camera, Cpu, Eye, Layers, Network, Scan } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/")({ component: Landing });

const features = [
  {
    icon: Camera,
    title: "Live camera",
    body: "Built-in webcam or USB. Frames stay on-device until you send one.",
  },
  {
    icon: Scan,
    title: "Real detection",
    body: "COCO-SSD in TensorFlow.js. Same task as YOLO, honest about the weights.",
  },
  {
    icon: Eye,
    title: "VLM lab",
    body: "Ask a vision-language model about a captured frame. xAI, Ollama, or BYOK.",
  },
  {
    icon: Layers,
    title: "Frameworks",
    body: "YOLO, PyTorch, TensorFlow, Transformers — taught as different layers, not synonyms.",
  },
  {
    icon: Cpu,
    title: "Use cases",
    body: "People counting, safety, traffic, robotics, documents — each with a pipeline.",
  },
  {
    icon: Network,
    title: "Honest architecture",
    body: "Browser / local GPU / cloud API. Simulated fleet metrics are labeled as such.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-bg text-fg">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Link to="/" className="flex items-center gap-2 text-sm font-medium">
          <Aperture className="size-4 text-primary" />
          Perception Lab
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/learning">Learning</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/dashboard">
              Open live lab
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 pt-10 pb-16 md:pt-20">
        <Badge variant="info">Educational engineering platform</Badge>
        <h1 className="mt-5 max-w-3xl text-4xl leading-[1.1] font-medium tracking-tight md:text-6xl">
          One platform to understand how modern AI systems see, reason, and operate.
        </h1>
        <p className="mt-5 max-w-xl text-base text-muted md:text-lg">
          Connect a camera. Run a real in-browser detector. Trace pixels to tensors to boxes to a
          VLM. Learn YOLO, PyTorch, TensorFlow and Transformers as a stack — not a buzzword list.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button size="lg" asChild>
            <Link to="/camera">
              Connect camera
              <Camera />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/use-cases">Specialized use cases</Link>
          </Button>
        </div>
        <dl className="mt-12 grid grid-cols-2 gap-6 border-y border-border py-6 sm:grid-cols-4">
          {[
            ["Mode A", "Browser TFJS"],
            ["Mode B", "Local GPU path"],
            ["Mode C", "VLM / BYOK"],
            ["14", "Use cases"],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="font-mono text-lg text-fg">{k}</dt>
              <dd className="text-xs text-muted">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="grid gap-3 md:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title}>
              <CardContent className="p-5">
                <f.icon className="size-4 text-primary" />
                <h2 className="mt-3 text-sm font-medium">{f.title}</h2>
                <p className="mt-1 text-sm text-muted">{f.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="mt-10 max-w-2xl text-sm text-subtle">
          This is a learning lab, not a certified safety, medical, or robotics controller. Real
          measurements are labeled Real. Everything else is Simulation, Catalog, or API.
        </p>
      </section>
    </div>
  );
}
