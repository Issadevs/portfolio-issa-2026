"use client";

// Background WebGL — Three.js PUR avec useRef + useEffect (pas de @react-three/fiber)
// Choix : R3F retiré car incompatible avec three v0.183.x sans config supplémentaire
// Avantage : contrôle total du render loop, pas de dépendance supplémentaire, même résultat
// Shaders GLSL custom — instanced geometry simulée via BufferAttribute

import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  particleVertexShader,
  particleFragmentShader,
} from "@/lib/webgl/shaders";

const GRID_SIZE = 22;   // 22x22 = 484 particules
const GRID_STEP = 0.85;
const TOTAL = GRID_SIZE * GRID_SIZE;

export default function WebGLBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ─── Renderer ───────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // ─── Scène et caméra ────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 8, 0);
    camera.lookAt(0, 0, 0);

    // ─── Géométrie de la grille ─────────────────────────────────────────────
    const geo = new THREE.BufferGeometry();
    const basePositions = new Float32Array(TOTAL * 3);
    const phases        = new Float32Array(TOTAL);
    const sizes         = new Float32Array(TOTAL);

    let idx = 0;
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let z = 0; z < GRID_SIZE; z++) {
        basePositions[idx * 3]     = (x - GRID_SIZE / 2) * GRID_STEP;
        basePositions[idx * 3 + 1] = 0;
        basePositions[idx * 3 + 2] = (z - GRID_SIZE / 2) * GRID_STEP;
        phases[idx] = Math.random() * Math.PI * 2;
        sizes[idx]  = 2.5 + Math.random() * 2.0;
        idx++;
      }
    }

    geo.setAttribute("position",         new THREE.BufferAttribute(basePositions.slice(), 3));
    geo.setAttribute("instancePosition", new THREE.BufferAttribute(basePositions,          3));
    geo.setAttribute("instancePhase",    new THREE.BufferAttribute(phases,                 1));
    geo.setAttribute("instanceSize",     new THREE.BufferAttribute(sizes,                  1));

    // ─── Shader material ────────────────────────────────────────────────────
    const material = new THREE.ShaderMaterial({
      vertexShader:   particleVertexShader,
      fragmentShader: particleFragmentShader,
      uniforms: {
        uTime:      { value: 0 },
        uMouse:     { value: new THREE.Vector2(0, 0) },
        uIntensity: { value: 1.0 },
      },
      transparent: true,
      blending:    THREE.AdditiveBlending,
      depthWrite:  false,
    });

    const points = new THREE.Points(geo, material);
    scene.add(points);

    // ─── Mouse tracking avec lerp ────────────────────────────────────────────
    const mouse       = new THREE.Vector2(0, 0);
    const targetMouse = new THREE.Vector2(0, 0);

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      targetMouse.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1;
      targetMouse.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1;
    };
    const onMouseLeave = () => targetMouse.set(0, 0);

    window.addEventListener("mousemove",   onMouseMove);
    window.addEventListener("mouseleave",  onMouseLeave);

    // ─── Resize handler ──────────────────────────────────────────────────────
    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", onResize);

    // ─── Render loop ─────────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    let rafId: number;

    const animate = () => {
      rafId = requestAnimationFrame(animate);

      // Lerp souris pour un mouvement fluide
      mouse.lerp(targetMouse, 0.05);

      material.uniforms.uTime.value  = clock.getElapsedTime();
      material.uniforms.uMouse.value = mouse;

      renderer.render(scene, camera);
    };
    animate();

    // ─── Cleanup ─────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove",   onMouseMove);
      window.removeEventListener("mouseleave",  onMouseLeave);
      window.removeEventListener("resize",      onResize);

      geo.dispose();
      material.dispose();
      renderer.dispose();

      // Retire le canvas du DOM proprement
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0"
      aria-hidden="true"
      style={{ pointerEvents: "none" }}
    />
  );
}
