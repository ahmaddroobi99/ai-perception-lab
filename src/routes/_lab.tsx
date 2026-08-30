import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";

export const Route = createFileRoute("/_lab")({
  component: () => (
    <AppShell>
      <Outlet />
    </AppShell>
  ),
});
