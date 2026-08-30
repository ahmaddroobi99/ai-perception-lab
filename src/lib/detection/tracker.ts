import type { Box, Detection, Track } from "./types";

function centroid(b: Box) {
  return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
}

function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.hypot(dx, dy);
}

export class CentroidTracker {
  private nextId = 1;
  private tracks: Track[] = [];
  entered = 0;
  exited = 0;
  peak = 0;
  private lineY = 0.55;

  reset() {
    this.tracks = [];
    this.nextId = 1;
    this.entered = 0;
    this.exited = 0;
    this.peak = 0;
  }

  update(dets: Detection[], frameH: number): Track[] {
    const now = performance.now();
    const used = new Set<number>();
    for (const d of dets) {
      const c = centroid(d.box);
      let best: Track | null = null;
      let bestD = 80;
      for (const t of this.tracks) {
        if (used.has(t.id) || t.class !== d.class) continue;
        const dd = dist(c, t.centroid);
        if (dd < bestD) {
          bestD = dd;
          best = t;
        }
      }
      if (best) {
        const prevY = best.centroid.y;
        best.box = d.box;
        best.centroid = c;
        best.lastSeen = now;
        best.hits += 1;
        used.add(best.id);
        const line = frameH * this.lineY;
        if (prevY < line && c.y >= line) {
          this.entered += 1;
          best.crossed = "in";
        } else if (prevY > line && c.y <= line) {
          this.exited += 1;
          best.crossed = "out";
        }
      } else {
        const t: Track = {
          id: this.nextId++,
          class: d.class,
          box: d.box,
          centroid: c,
          lastSeen: now,
          hits: 1,
        };
        this.tracks.push(t);
        used.add(t.id);
      }
    }
    this.tracks = this.tracks.filter((t) => now - t.lastSeen < 800);
    const people = this.tracks.filter((t) => t.class === "person").length;
    this.peak = Math.max(this.peak, people);
    return this.tracks;
  }

  getTracks() {
    return this.tracks;
  }
}
