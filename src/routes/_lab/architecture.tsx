import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_lab/architecture")({ component: ArchPage });

const modes = [
  {
    id: "A",
    title: "Browser",
    body: "TensorFlow.js COCO-SSD, canvas overlay, centroid tracker. Private by default.",
  },
  {
    id: "B",
    title: "Local edge",
    body: "Browser → localhost FastAPI → PyTorch YOLO / TensorRT on a GPU or Jetson.",
  },
  {
    id: "C",
    title: "Cloud API",
    body: "User-initiated VLM calls. xAI on the server, or Ollama / HF / OpenAI-compatible BYOK.",
  },
];

function ArchPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Systems"
        title="Architecture"
        description="A static site cannot run CUDA. This lab is designed so the UI stays useful while inference moves from the tab, to localhost, to a GPU cluster."
      />
      <div className="grid gap-3 md:grid-cols-3">
        {modes.map((m) => (
          <Card key={m.id}>
            <CardContent className="p-5">
              <Badge variant="info">Mode {m.id}</Badge>
              <h2 className="mt-3 text-sm font-medium">{m.title}</h2>
              <p className="mt-1 text-sm text-muted">{m.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Today</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto font-mono text-[11px] leading-6 text-muted">{`User
  └─ React app (this site)
        ├─ getUserMedia camera / upload
        ├─ TFJS COCO-SSD          [REAL]
        ├─ Centroid tracker       [REAL]
        ├─ Use-case policy layer  [REAL]
        ├─ Simulated fleet KPIs   [SIM]
        └─ VLM (opt-in confirm)   [API]`}</pre>
        </CardContent>
      </Card>

      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Production evolution</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto font-mono text-[11px] leading-6 text-muted">{`Sensors (camera, LiDAR, IMU, GPS)
  └─ ROS2 / MQTT
        └─ Edge device (Jetson / x86 GPU)
              ├─ YOLO / TensorRT
              ├─ Depth / fusion
              └─ Telemetry (OpenTelemetry, Prometheus)
                    └─ API gateway + auth
                          ├─ Model router
                          ├─ VLM / LLM
                          ├─ Registry + object store
                          └─ Operations UI  ← this frontend`}</pre>
        </CardContent>
      </Card>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted">
            No secrets in the client bundle. xAI is server-only. BYOK tokens live in localStorage and
            are labeled unsafe for production. Camera frames are not uploaded unless you confirm a
            VLM send.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Robotics roadmap</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted">
            ROS2, RealSense, LiDAR and Jetson are the next hop — not this browser. The UI can
            already display the pipeline; the missing piece is an inference gateway, not more
            dashboard widgets.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
