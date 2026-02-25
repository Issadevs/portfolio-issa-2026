"use client";

// Badge de performance live — Dev Mode uniquement
// Affiche FPS, mémoire JS estimée, score Lighthouse approché
// Choix : requestAnimationFrame pour le FPS, performance.memory pour la mémoire

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface PerfData {
  fps: number;
  memory: number | null;
  lighthouseScore: number;
}

// Estimation du score Lighthouse basée sur FPS et mémoire
function estimateLighthouse(fps: number, mem: number | null): number {
  let score = 100;
  if (fps < 55) score -= 15;
  if (fps < 30) score -= 25;
  if (mem && mem > 50) score -= 10;
  if (mem && mem > 100) score -= 20;
  return Math.max(0, score);
}

function getColor(value: number, thresholds: [number, number]) {
  if (value >= thresholds[1]) return "text-[#00FF88]";
  if (value >= thresholds[0]) return "text-yellow-400";
  return "text-red-400";
}

export default function PerfBadge() {
  const [perf, setPerf] = useState<PerfData>({ fps: 60, memory: null, lighthouseScore: 100 });
  const [isExpanded, setIsExpanded] = useState(false);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const rafId = useRef<number>(0);

  useEffect(() => {
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

        setPerf({
          fps: Math.min(fps, 144),
          memory: memMB,
          lighthouseScore: estimateLighthouse(fps, memMB),
        });
      }

      rafId.current = requestAnimationFrame(updateFPS);
    };

    rafId.current = requestAnimationFrame(updateFPS);
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  const lhColor = getColor(perf.lighthouseScore, [50, 90]);
  const fpsColor = getColor(perf.fps, [30, 55]);

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
        title="Performance monitor"
      >
        {/* Indicateur FPS compact */}
        <span className={fpsColor}>{perf.fps}</span>
        <span className="text-dev-muted">fps</span>
        <span className="text-dev-muted">·</span>
        <span className={lhColor}>
          {perf.lighthouseScore}
        </span>
        <span className="text-dev-muted text-[10px]">⚡</span>
      </button>

      {/* Panneau détaillé */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-full right-0 mb-2 w-48 bg-dev-surface border border-dev-border rounded-lg p-3 font-mono text-xs"
        >
          <p className="text-dev-muted mb-2 uppercase tracking-widest text-[10px]">
            Live Performance
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
            <PerfRow
              label="Lighthouse~"
              value={`${perf.lighthouseScore}`}
              color={lhColor}
              bar={perf.lighthouseScore / 100}
            />
          </div>

          <p className="text-dev-muted/50 text-[9px] mt-3">
            * Score Lighthouse estimé
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
          className={`h-full transition-all duration-500 ${color.replace("text-", "bg-").replace("text-[#00FF88]", "bg-[#00FF88]")}`}
          style={{ width: `${Math.min(bar * 100, 100)}%` }}
        />
      </div>
    </div>
  );
}
