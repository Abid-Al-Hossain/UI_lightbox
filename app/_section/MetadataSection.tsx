"use client";

import { SectionCard } from "@/components/shared/layout/SectionCard";
import Input from "@/components/shared/input/Input";
import Slider from "@/components/shared/input/Slider";
import type { LightboxState } from "../types";

type Props = { state: LightboxState; update: <K extends keyof LightboxState>(key: K, value: LightboxState[K]) => void };

export default function MetadataSection({ state, update }: Props) {
  return <SectionCard title="Metadata" subtitle="Metadata controls for native lightbox generation.">
      <div className="space-y-4"><Input label="id" value={state.id} onChange={(value) => update("id", value)} />
<Input label="aria-label" value={state.ariaLabel} onChange={(value) => update("ariaLabel", value)} />
<div className="rounded-2xl border p-3 text-sm" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>Role is derived from the lightbox anatomy as <strong style={{ color: "var(--text)" }}>dialog</strong>, not edited as arbitrary state.</div>
<Slider label="tabIndex" value={state.tabIndex} min={0} max={4} step={1} onChange={(value) => update("tabIndex", value)} /></div>
    </SectionCard>;
}
