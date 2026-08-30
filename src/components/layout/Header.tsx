import { Bell, Menu, Moon, Search, Sun, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusDot } from "@/components/shared/StatusDot";
import { useLab } from "@/lib/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header({ onSearch }: { onSearch: () => void }) {
  const setOpen = useLab((s) => s.setSidebarOpen);
  const theme = useLab((s) => s.theme);
  const setTheme = useLab((s) => s.setTheme);
  const cameraOn = useLab((s) => s.cameraOn);
  const det = useLab((s) => s.detectorStatus);
  const xai = useLab((s) => s.xaiAvailable);
  const vlmProvider = useLab((s) => s.vlm.provider);

  const vlmState =
    vlmProvider === "xai"
      ? xai
        ? "ok"
        : xai === false
          ? "warn"
          : "idle"
      : "ok";

  return (
    <header className="flex min-h-14 items-center gap-2 border-b border-border bg-surface px-3 md:px-5">
      <Button
        size="icon"
        variant="ghost"
        className="md:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <Menu />
      </Button>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium tracking-tight">
          AI Perception & Model Intelligence Lab
        </p>
        <p className="hidden truncate text-[11px] text-subtle sm:block">
          Real-time computer vision, multimodal AI, edge inference
        </p>
      </div>
      <div className="hidden items-center gap-4 lg:flex">
        <StatusDot state={cameraOn ? "ok" : "idle"} label={cameraOn ? "Camera connected" : "Camera idle"} />
        <StatusDot
          state={det === "running" || det === "ready" ? "ok" : det === "error" ? "danger" : "idle"}
          label={det === "running" || det === "ready" ? "AI engine ready" : "AI engine idle"}
        />
        <StatusDot
          state={vlmState}
          label={
            vlmProvider === "xai"
              ? xai
                ? "VLM ready (xAI)"
                : "VLM not configured"
              : `VLM ${vlmProvider}`
          }
        />
      </div>
      <Button size="icon" variant="ghost" onClick={onSearch} aria-label="Search">
        <Search />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        aria-label="Toggle theme"
      >
        {theme === "dark" ? <Sun /> : <Moon />}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" aria-label="Notifications">
            <Bell />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Session</DropdownMenuLabel>
          <DropdownMenuItem disabled>No production alerts — this is a lab</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" aria-label="Profile">
            <User />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Operator</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>Local session · no account</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
