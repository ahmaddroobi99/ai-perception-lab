export type PipeNode = {
  id: string;
  title: string;
  latency: string;
  throughput: string;
  status: "ok" | "warn" | "idle";
  capability: "real" | "sim" | "api" | "catalog";
  detail: string;
};

export const PIPE_NODES: PipeNode[] = [
  {
    id: "raw",
    title: "Raw sensor data",
    latency: "0 ms",
    throughput: "camera FPS",
    status: "ok",
    capability: "real",
    detail: "Browser MediaStream or uploaded file. Real pixels when the camera is on.",
  },
  {
    id: "sync",
    title: "Timestamp sync",
    latency: "0.4 ms",
    throughput: "frame",
    status: "idle",
    capability: "sim",
    detail: "Multi-sensor sync is simulated. A robot would use hardware timestamps / PTP.",
  },
  {
    id: "filter",
    title: "Noise filtering",
    latency: "1–3 ms",
    throughput: "frame",
    status: "idle",
    capability: "catalog",
    detail: "Bilateral / motion blur compensation lives on the edge CPU.",
  },
  {
    id: "tf",
    title: "Coordinate transform",
    latency: "0.2 ms",
    throughput: "pose",
    status: "idle",
    capability: "sim",
    detail: "Camera optical frame → base_link. Needs calibration extrinsics.",
  },
  {
    id: "calib",
    title: "Camera calibration",
    latency: "once",
    throughput: "intrinsics",
    status: "idle",
    capability: "catalog",
    detail: "Intrinsics (fx, fy, cx, cy) + distortion. Not estimated in v1.",
  },
  {
    id: "lidar",
    title: "LiDAR processing",
    latency: "8–20 ms",
    throughput: "cloud",
    status: "idle",
    capability: "sim",
    detail: "No real LiDAR in the browser. The fusion lab synthesizes ranges from box size.",
  },
  {
    id: "det",
    title: "Object detection",
    latency: "measured",
    throughput: "~12 Hz cap",
    status: "ok",
    capability: "real",
    detail: "COCO-SSD in TFJS when you start the camera. YOLO 11 via Mode B.",
  },
  {
    id: "depth",
    title: "Depth estimation",
    latency: "catalog",
    throughput: "dense map",
    status: "idle",
    capability: "catalog",
    detail: "Monocular depth (Depth Anything etc.) wants a GPU runtime.",
  },
  {
    id: "fusion",
    title: "Sensor fusion",
    latency: "2–6 ms",
    throughput: "track",
    status: "warn",
    capability: "sim",
    detail: "Teaching sketch: camera class + fake range. Not a Kalman filter.",
  },
  {
    id: "track",
    title: "Tracking",
    latency: "<1 ms",
    throughput: "IDs",
    status: "ok",
    capability: "real",
    detail: "Centroid tracker in this app is real code on real boxes.",
  },
  {
    id: "world",
    title: "World model",
    latency: "app",
    throughput: "state",
    status: "idle",
    capability: "catalog",
    detail: "Occupancy, tracks, semantics — consumed by a planner you do not have here.",
  },
];
