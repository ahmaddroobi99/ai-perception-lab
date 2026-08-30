import { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { CommandPalette } from "./CommandPalette";
import { FollowData } from "@/components/pipeline/FollowData";
import { useLab } from "@/lib/store";
import { getXaiAvailability } from "@/lib/vlm/analyze";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [search, setSearch] = useState(false);
  const theme = useLab((s) => s.theme);
  const tick = useLab((s) => s.tickOps);
  const setXai = useLab((s) => s.setXaiAvailable);
  const setTheme = useLab((s) => s.setTheme);
  const follow = useLab((s) => s.followOpen);

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);

  useEffect(() => {
    const stored = useLab.getState().theme;
    setTheme(stored);
    void getXaiAvailability().then((r) => setXai(r.available));
    const id = window.setInterval(() => tick(), 2500);
    return () => window.clearInterval(id);
  }, [setTheme, setXai, tick]);

  return (
    <div className="flex min-h-screen bg-bg text-fg">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header onSearch={() => setSearch(true)} />
        <main className="flex-1 overflow-x-hidden p-4 md:p-6">{children}</main>
      </div>
      <CommandPalette open={search} onOpenChange={setSearch} />
      {follow ? <FollowData /> : null}
    </div>
  );
}
