import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Camera,
  Scan,
  Boxes,
  Workflow,
  AppWindow,
  MessageSquareText,
  Gauge,
  FlaskConical,
  Network,
  BookOpen,
  Brain,
  Cpu,
  Layers,
  Combine,
} from "lucide-react";

export type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  hint?: string;
};

export type NavGroup = {
  title: string;
  items: NavItem[];
};

export const NAV_GROUPS: NavGroup[] = [
  {
    title: "Operations",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/camera", label: "Live Camera", icon: Camera },
      { to: "/performance", label: "Performance", icon: Gauge },
    ],
  },
  {
    title: "Model labs",
    items: [
      { to: "/yolo", label: "YOLO Lab", icon: Scan, hint: "Object detection" },
      { to: "/pytorch", label: "PyTorch", icon: Brain },
      { to: "/tensorflow", label: "TensorFlow", icon: Cpu },
      { to: "/transformers", label: "Transformers", icon: Layers },
      { to: "/vlm", label: "VLM Lab", icon: MessageSquareText },
      { to: "/models", label: "Model catalog", icon: Boxes },
    ],
  },
  {
    title: "Systems",
    items: [
      { to: "/pipelines", label: "Pipelines", icon: Workflow },
      { to: "/use-cases", label: "Use cases", icon: AppWindow },
      { to: "/fusion", label: "Sensor fusion", icon: Combine },
      { to: "/experiments", label: "Experiments", icon: FlaskConical },
    ],
  },
  {
    title: "Knowledge",
    items: [
      { to: "/architecture", label: "Architecture", icon: Network },
      { to: "/learning", label: "Learning center", icon: BookOpen },
    ],
  },
];

export const ALL_NAV = NAV_GROUPS.flatMap((g) => g.items);
