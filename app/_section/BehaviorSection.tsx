"use client";

import { SectionCard } from "@/components/shared/layout/SectionCard";
import Switch from "@/components/shared/input/Switch";
import type { LightboxState } from "../types";

type Props = { state: LightboxState; update: <K extends keyof LightboxState>(key: K, value: LightboxState[K]) => void };

export default function BehaviorSection({ state, update }: Props) {
  return (
    <div className="space-y-4">
      <SectionCard title="Dismiss" subtitle="How the lightbox closes.">
      <div className="space-y-4">
        <Switch label="Modal (aria-modal)" checked={state.modal} onChange={(value) => update("modal", value)} />
        <Switch label="Close on Escape" checked={state.closeOnEscape} onChange={(value) => update("closeOnEscape", value)} />
        <Switch label="Close on outside click" checked={state.closeOnOutside} onChange={(value) => update("closeOnOutside", value)} />
      </div>
    </SectionCard>
      <SectionCard title="Content" subtitle="Thumbnails, captions, and disabled state.">
      <div className="space-y-4">
        <Switch label="Show thumbnails" checked={state.showThumbnails} onChange={(value) => update("showThumbnails", value)} />
        <Switch label="Show captions" checked={state.showCaptions} onChange={(value) => update("showCaptions", value)} />
        <Switch label="Disabled" checked={state.disabled} onChange={(value) => update("disabled", value)} />
      </div>
    </SectionCard>
    </div>
  );
}
