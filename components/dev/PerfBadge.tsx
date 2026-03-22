"use client";

// Badge de performance live — Dev Mode uniquement
// Métriques réelles — PerformanceObserver + Navigation Timing

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { Lang } from "@/hooks/useLang";

interface PerfData {
  fps: number;
  memory: number | null;    // Chrome only
  ttfb: number | null;      // ms, Navigation Timing
  fcp: number | null;       // ms, PerformanceObserver paint
  lcp: number | null;       // ms, PerformanceObserver largest-contentful-paint
}

// Couleur pour métriques "plus bas = mieux" (TTFB, FCP, LCP)
function colorLow(value: number, good: number, needs: number): string {
  if (value < good) return "text-[#00FF88]";
  if (value < needs) return "text-yellow-400";
  return "text-red-400";
}

// Couleur pour FPS "plus haut = mieux"
function colorFPS(fps: number): string {
  if (fps >= 55) return "text-[#00FF88]";
  if (fps >= 30) return "text-yellow-400";
  return "text-red-400";
}

export default function PerfBadge({ lang }: { lang: Lang }) {
  const [perf, setPerf] = useState<PerfData>({
    fps: 60,
    memory: null,
    ttfb: null,
    fcp: null,
    lcp: null,
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const frameCount = useRef(0);
  const lastTime = useRef(0);
  const rafId = useRef<number>(0);

  // FPS loop — requestAnimationFrame
  useEffect(() => {
    lastTime.current = performance.now();

    const updateFPS = () => {
      frameCount.current++;
      const now = performance.now();
      const delta = now - lastTime.current;

      if (delta >= 1000) {
        const fps = Math.round((frameCount.current / delta) * 1000);
        frameCount.current = 0;
        lastTime.current = now;

        // performance.memory est une API non-standard (Chrome uniquement)
        const mem = (performance as Performance & { memory?: { usedJSHeapSize: number } })
          .memory?.usedJSHeapSize;
        const memMB = mem ? Math.round(mem / 1024 / 1024) : null;

        setPerf((prev) => ({
          ...prev,
          fps: Math.min(fps, 144),
          memory: memMB,
        }));
      }

      rafId.current = requestAnimationFrame(updateFPS);
    };

    rafId.current = requestAnimationFrame(updateFPS);
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  // TTFB + FCP + LCP — one-shot au mount via PerformanceObserver + Navigation Timing
  useEffect(() => {
    // TTFB via Navigation Timing API
    const navEntries = performance.getEntriesByType("navigation");
    const navTimeout = setTimeout(() => {
      if (navEntries.length > 0) {
        const nav = navEntries[0] as PerformanceNavigationTiming;
        setPerf((prev) => ({ ...prev, ttfb: Math.round(nav.responseStart) }));
      }
    }, 0);

    // FCP via PerformanceObserver (paint entries)
    let fcpObserver: PerformanceObserver | null = null;
    try {
      fcpObserver = new PerformanceObserver((list) => {
        const entry = list.getEntriesByName("first-contentful-paint")[0];
        if (entry) {
          setPerf((prev) => ({ ...prev, fcp: Math.round(entry.startTime) }));
          fcpObserver?.disconnect();
        }
      });
      fcpObserver.observe({ type: "paint", buffered: true });
    } catch {
      // PerformanceObserver non supporté
    }

    // LCP via PerformanceObserver (largest-contentful-paint)
    let lcpObserver: PerformanceObserver | null = null;
    try {
      lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries.length > 0) {
          const last = entries[entries.length - 1];
          setPerf((prev) => ({ ...prev, lcp: Math.round(last.startTime) }));
        }
      });
      lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
    } catch {
      // PerformanceObserver non supporté
    }

    return () => {
      clearTimeout(navTimeout);
      fcpObserver?.disconnect();
      lcpObserver?.disconnect();
    };
  }, []);

  const fpsColor = colorFPS(perf.fps);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1 }}
      className="fixed bottom-6 right-6 z-40"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 px-3 py-2 bg-dev-surface border border-dev-border rounded-lg font-mono text-xs hover:border-dev-accent/40 transition-colors"
        title={lang === "fr" ? "Moniteur de performance" : "Performance monitor"}
      >
        <span className={fpsColor}>{perf.fps}</span>
        <span className="text-dev-muted">fps</span>
        {perf.memory !== null && (
          <>
            <span className="text-dev-muted">·</span>
            <span className="text-dev-text">{perf.memory}</span>
            <span className="text-dev-muted">MB</span>
          </>
        )}
      </button>

      {/* Panneau détaillé */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-full right-0 mb-2 w-52 bg-dev-surface border border-dev-border rounded-lg p-3 font-mono text-xs"
        >
          <p className="text-dev-muted mb-2 uppercase tracking-widest text-[10px]">
            {lang === "fr" ? "Performance temps réel" : "Live Performance"}
          </p>

          <div className="space-y-1.5">
            <PerfRow
              label="FPS"
              value={`${perf.fps}`}
              color={fpsColor}
              bar={perf.fps / 60}
            />
            {perf.memory !== null && (
              <PerfRow
                label="JS Heap"
                value={`${perf.memory} MB`}
                color={perf.memory > 100 ? "text-red-400" : perf.memory > 50 ? "text-yellow-400" : "text-[#00FF88]"}
                bar={Math.min(perf.memory / 150, 1)}
              />
            )}
            {/* TTFB — seuils W3C : vert < 100ms, jaune < 500ms, rouge ≥ 500ms */}
            <PerfRow
              label="TTFB"
              value={perf.ttfb !== null ? `${perf.ttfb} ms` : "—"}
              color={perf.ttfb !== null ? colorLow(perf.ttfb, 100, 500) : "text-dev-muted"}
              bar={perf.ttfb !== null ? Math.min(perf.ttfb / 500, 1) : 0}
            />
            {/* FCP — seuils W3C : vert < 1800ms, jaune < 3000ms, rouge ≥ 3000ms */}
            <PerfRow
              label="FCP"
              value={perf.fcp !== null ? `${perf.fcp} ms` : "—"}
              color={perf.fcp !== null ? colorLow(perf.fcp, 1800, 3000) : "text-dev-muted"}
              bar={perf.fcp !== null ? Math.min(perf.fcp / 3000, 1) : 0}
            />
            {/* LCP — seuils W3C : vert < 2500ms, jaune < 4000ms, rouge ≥ 4000ms */}
            <PerfRow
              label="LCP"
              value={perf.lcp !== null ? `${perf.lcp} ms` : "—"}
              color={perf.lcp !== null ? colorLow(perf.lcp, 2500, 4000) : "text-dev-muted"}
              bar={perf.lcp !== null ? Math.min(perf.lcp / 4000, 1) : 0}
            />
          </div>

          <p className="text-dev-muted/50 text-[9px] mt-3">
            {"// métriques réelles — PerformanceObserver + Navigation Timing"}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

function PerfRow({
  label,
  value,
  color,
  bar,
}: {
  label: string;
  value: string;
  color: string;
  bar: number;
}) {
  return (
    <div>
      <div className="flex justify-between mb-0.5">
        <span className="text-dev-muted">{label}</span>
        <span className={color}>{value}</span>
      </div>
      <div className="h-0.5 bg-dev-surface-2 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${color.replace("text-", "bg-")}`}
          style={{ width: `${Math.min(bar * 100, 100)}%` }}
        />
      </div>
    </div>
  );
}
