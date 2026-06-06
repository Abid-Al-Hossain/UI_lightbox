import type { LightboxState } from "../types";

export type ExportPayload = { fileName: string; mimeType: "text/plain;charset=utf-8"; content: string };

export function buildExportPayload(state: LightboxState, fileName = "lightbox") : ExportPayload {
  return { fileName: `${fileName || "lightbox"}.jsx`, mimeType: "text/plain;charset=utf-8", content: buildReactCode(state) };
}

export function buildReactCode(state: LightboxState) {
  const exportState = Object.fromEntries(
    Object.entries(state).filter(([key]) => key !== "role"),
  ) as LightboxState;

  return `import * as React from "react";

const state = ${JSON.stringify(exportState, null, 2)};

function createLightboxItems(count, label) {
  const safeCount = Math.max(1, Math.min(10, Math.round(count)));

  return Array.from({ length: safeCount }, (_, index) => {
    const hue = (index * 47 + 190) % 360;
    const title = \`\${label} \${index + 1}\`;
    const caption = \`\${title} caption with keyboard-safe previous, next, close, Escape, and outside-dismiss controls.\`;
    const svg = \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 640"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="hsl(\${hue} 78% 42%)"/><stop offset="1" stop-color="hsl(\${(hue + 58) % 360} 84% 64%)"/></linearGradient></defs><rect width="960" height="640" fill="url(#g)"/><circle cx="\${220 + index * 12}" cy="\${170 + index * 8}" r="120" fill="rgba(255,255,255,.22)"/><path d="M120 520 370 290l150 130 110-88 210 188Z" fill="rgba(15,23,42,.45)"/><text x="72" y="104" fill="white" font-family="Arial" font-size="54" font-weight="700">\${title}</text></svg>\`;

    return {
      src: \`data:image/svg+xml;utf8,\${encodeURIComponent(svg)}\`,
      alt: \`\${title} preview image\`,
      title,
      caption,
    };
  });
}

export default function LightboxComponent() {
  const items = React.useMemo(() => createLightboxItems(state.mediaCount, state.label), []);
  const initialIndex = Math.max(0, Math.min(items.length - 1, Math.round(state.activeIndex)));
  const [activeIndex, setActiveIndex] = React.useState(initialIndex);
  const [open, setOpen] = React.useState(state.previewState !== "closed");
  const triggerRef = React.useRef(null);
  const dialogRef = React.useRef(null);
  const activeItem = items[activeIndex] || items[0];
  const titleId = \`\${state.id}-title\`;
  const captionId = \`\${state.id}-caption\`;
  const canMove = items.length > 1;
  const transition = state.motion ? "transform 180ms ease, opacity 180ms ease, border-color 180ms ease" : "none";

  React.useEffect(() => {
    setActiveIndex(initialIndex);
    setOpen(state.previewState !== "closed");
  }, [initialIndex]);

  React.useEffect(() => {
    if (!open) return;
    dialogRef.current?.focus();

    if (!state.closeOnEscape) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        window.setTimeout(() => triggerRef.current?.focus(), 0);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const previous = () => setActiveIndex((value) => (value - 1 + items.length) % items.length);
  const next = () => setActiveIndex((value) => (value + 1) % items.length);
  const close = () => {
    setOpen(false);
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  };
  const rootStyle = { width: "min(100%, 920px)", color: state.foreground, fontFamily: state.fontFamily, opacity: state.disabled ? 0.55 : 1 };
  const galleryButtonStyle = { display: "grid", gap: state.gap, width: "min(100%, 360px)", padding: 12, border: state.borderWidth + "px solid " + state.border, borderRadius: state.radius, background: state.background, color: state.foreground, boxShadow: \`0 \${Math.round(state.shadow / 4)}px \${state.shadow}px rgba(0,0,0,.24)\`, cursor: state.disabled ? "not-allowed" : "pointer", textAlign: "left", transition };
  const overlayStyle = { position: "fixed", inset: 0, zIndex: 50, display: "grid", placeItems: "center", padding: 24, background: "rgba(2, 6, 23, .74)", backdropFilter: "blur(12px)" };
  const dialogStyle = { width: \`min(100%, \${state.width}px)\`, maxHeight: "92vh", display: "grid", gap: state.gap, padding: state.padding, borderRadius: state.radius, border: state.borderWidth + "px solid " + state.border, background: state.background, color: state.foreground, boxShadow: \`0 \${Math.round(state.shadow / 3)}px \${state.shadow + 24}px rgba(0,0,0,.38)\`, outline: "none", transition };
  const controlStyle = { border: state.borderWidth + "px solid " + state.border, borderRadius: Math.max(12, state.radius / 2), padding: "0.65rem 0.9rem", background: "rgba(255,255,255,.08)", color: state.foreground, fontWeight: 700 };

  return (
    <section id={state.id} aria-label={state.ariaLabel} style={rootStyle}>
      <button
        ref={triggerRef}
        type="button"
        disabled={state.disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={\`\${state.id}-dialog\`}
        onClick={() => setOpen(true)}
        style={galleryButtonStyle}
      >
        <img src={items[0].src} alt={items[0].alt} style={{ width: "100%", height: 190, objectFit: "cover", borderRadius: Math.max(10, state.radius - 8) }} />
        <span style={{ display: "grid", gap: 4 }}>
          <strong style={{ fontSize: state.titleSize, fontWeight: state.fontWeight }}>{state.title}</strong>
          <span style={{ color: state.muted, fontSize: state.bodySize }}>{state.description}</span>
          <span style={{ color: state.accent, fontSize: 12, fontWeight: 700 }}>{items.length} images. Open lightbox.</span>
        </span>
      </button>

      {open && (
        <div
          role="presentation"
          onMouseDown={(event) => {
            if (state.closeOnOutside && event.target === event.currentTarget) close();
          }}
          style={overlayStyle}
        >
          <section
            ref={dialogRef}
            id={\`\${state.id}-dialog\`}
            role="dialog"
            aria-modal={state.modal ? true : undefined}
            aria-labelledby={titleId}
            aria-describedby={state.showCaptions ? captionId : undefined}
            tabIndex={-1}
            style={dialogStyle}
          >
            <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between", gap: 16 }}>
              <div>
                <h3 id={titleId} style={{ margin: 0, fontSize: state.titleSize, fontWeight: state.fontWeight }}>{activeItem.title}</h3>
                <p style={{ margin: "0.35rem 0 0", color: state.muted, fontSize: state.bodySize }}>{state.helper}</p>
              </div>
              <button type="button" onClick={close} aria-label="Close lightbox" style={controlStyle}>Close</button>
            </div>

            <figure style={{ display: "grid", gap: 12, margin: 0 }}>
              <img src={activeItem.src} alt={activeItem.alt} title={activeItem.title} style={{ width: "100%", maxHeight: state.height, objectFit: "cover", borderRadius: Math.max(12, state.radius - 10), border: state.borderWidth + "px solid " + state.border }} />
              {state.showCaptions && <figcaption id={captionId} style={{ color: state.muted, fontSize: state.bodySize }}>{activeItem.caption}</figcaption>}
            </figure>

            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div style={{ display: "flex", gap: 8 }}>
                <button type="button" onClick={previous} disabled={!canMove} aria-label="Previous image" style={controlStyle}>Previous</button>
                <button type="button" onClick={next} disabled={!canMove} aria-label="Next image" style={{ ...controlStyle, background: state.accent, color: "#020617" }}>Next</button>
              </div>
              <output aria-live="polite" style={{ color: state.muted, fontSize: 12 }}>{activeIndex + 1} of {items.length}</output>
            </div>

            {state.showThumbnails && (
              <div role="list" aria-label="Lightbox thumbnails" style={{ display: "grid", gridTemplateColumns: \`repeat(\${Math.min(items.length, 5)}, minmax(0, 1fr))\`, gap: 8 }}>
                {items.map((item, index) => (
                  <button key={item.title} type="button" role="listitem" aria-label={\`Show \${item.title}\`} aria-current={index === activeIndex ? "true" : undefined} onClick={() => setActiveIndex(index)} style={{ border: state.borderWidth + "px solid " + (index === activeIndex ? state.accent : state.border), borderRadius: Math.max(10, state.radius / 3), padding: 3, background: "transparent" }}>
                    <img src={item.src} alt="" aria-hidden="true" style={{ width: "100%", height: 54, objectFit: "cover", borderRadius: Math.max(8, state.radius / 4) }} />
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      <style>{\`@media (prefers-reduced-motion: reduce) { #\${state.id} * { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; scroll-behavior: auto !important; } }\`}</style>
    </section>
  );
}
`;
}
