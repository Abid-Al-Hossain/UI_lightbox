"use client";

import { useMemo, useState } from "react";
import Input from "@/components/shared/input/Input";
import Select from "@/components/shared/input/Select";
import { SectionCard } from "@/components/shared/layout/SectionCard";
import { LIGHTBOX_PRESETS } from "../_data/LightboxPresets";
import type { StudioPreset } from "../types";

const PAGE_SIZE = 8;

export default function PresetsSection({ activePresetId, onApply }: { activePresetId: string | null; onApply: (preset: StudioPreset) => void }) {
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState("all");
  const [size, setSize] = useState("all");
  const [currentPage, setPage] = useState(1);
  const families = useMemo(() => ["all", ...Array.from(new Set(LIGHTBOX_PRESETS.map((preset) => preset.family)))], []);
  const sizes = useMemo(() => ["all", ...Array.from(new Set(LIGHTBOX_PRESETS.map((preset) => preset.size)))], []);
  const appliedFilterCount = [query.trim(), family !== "all", size !== "all"].filter(Boolean).length;
  const filtered = useMemo(() => LIGHTBOX_PRESETS.filter((preset) => [preset.family, preset.archetype, preset.variant, preset.size, ...preset.tags].join(" ").toLowerCase().includes(query.toLowerCase()) && (family === "all" || preset.family === family) && (size === "all" || preset.size === size)), [family, query, size]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(currentPage, pageCount);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const source = filtered.length ? filtered : LIGHTBOX_PRESETS;
  const resetFilters = () => { setQuery(""); setFamily("all"); setSize("all"); setPage(1); };
  const applyPreset = (preset: StudioPreset) => { onApply(preset); };
  const changeQuery = (value: string) => { setQuery(value); setPage(1); };
  const changeFamily = (value: string) => { setFamily(value); setPage(1); };
  const changeSize = (value: string) => { setSize(value); setPage(1); };

  return <SectionCard title="Presets" subtitle="48 structured full-state presets."><div className="grid gap-3 sm:grid-cols-3" data-testid="preset-filters"><Input label="Search presets" value={query} onChange={changeQuery} /><Select label="Family" value={family} options={families} onChange={changeFamily} /><Select label="Size" value={size} options={sizes} onChange={changeSize} /></div><div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm" data-testid="preset-result-count" style={{ color: "var(--muted)" }}>{filtered.length} results · {appliedFilterCount} filters applied · page {page} of {pageCount}</p><button type="button" onClick={resetFilters} data-testid="preset-reset-filters" className="rounded-xl border px-4 py-2 text-sm font-semibold" style={{ borderColor: "var(--border)", color: "var(--text)" }}>Reset filters</button></div><button type="button" onClick={() => applyPreset(source[Math.floor(Math.random() * source.length)])} data-testid="preset-surprise-button" className="rounded-xl border px-4 py-3 text-sm font-semibold" style={{ borderColor: "var(--border)", color: "var(--text)" }}>Surprise me</button><div className="grid gap-3" data-testid="preset-results">{paged.map((preset) => <button key={preset.id} type="button" onClick={() => applyPreset(preset)} data-testid="preset-apply-button" data-preset-id={preset.id} data-applied={activePresetId === preset.id ? "true" : "false"} className="rounded-2xl border p-4 text-left" style={{ borderColor: activePresetId === preset.id ? "var(--primary)" : "var(--border)", background: activePresetId === preset.id ? "color-mix(in oklab, var(--primary) 20%, transparent)" : "color-mix(in oklab, var(--card) 65%, transparent)", color: "var(--text)" }}><strong>{preset.archetype}</strong><span className="ml-2 text-xs uppercase tracking-[0.16em]" style={{ color: "var(--muted)" }}>{preset.variant} / {preset.size}</span><p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>{preset.tags.join(", ")}</p></button>)}</div><div className="flex items-center justify-between gap-3" data-testid="preset-pagination"><button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page <= 1} data-testid="preset-page-prev" className="rounded-xl border px-4 py-2 text-sm font-semibold disabled:opacity-50" style={{ borderColor: "var(--border)", color: "var(--text)" }}>Previous page</button><span className="text-sm" style={{ color: "var(--muted)" }}>{page} / {pageCount}</span><button type="button" onClick={() => setPage((value) => Math.min(pageCount, value + 1))} disabled={page >= pageCount} data-testid="preset-page-next" className="rounded-xl border px-4 py-2 text-sm font-semibold disabled:opacity-50" style={{ borderColor: "var(--border)", color: "var(--text)" }}>Next page</button></div></SectionCard>;
}
