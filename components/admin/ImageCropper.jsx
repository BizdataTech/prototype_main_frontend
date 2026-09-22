"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, Crop, Check } from "phosphor-react";

/**
 * ImageCropper -- a zero-dependency image cropping modal.
 *
 * Props:
 *  - src: string      -- object URL or any image URL to crop
 *  - onCrop(file: File): void  -- called with the cropped File
 *  - onCancel(): void
 *  - filename: string -- original file name (used for output File name)
 *  - initialAspect: number | null
 *
 * CORS note: external URLs (e.g. Cloudinary) are fetched via fetch() and
 * converted to a local blob: URL so the canvas is never "tainted" and
 * toBlob() always works.
 */
const ASPECT_PRESETS = [
  { label: "Free", value: null },
  { label: "1:1", value: 1 },
  { label: "16:9", value: 16 / 9 },
  { label: "4:3", value: 4 / 3 },
  { label: "3:2", value: 3 / 2 },
  { label: "2:3", value: 2 / 3 },
];

const MIN_SIZE = 40;

export default function ImageCropper({ src, onCrop, onCancel, filename = "cropped.jpg", initialAspect = null }) {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const containerRef = useRef(null);

  const [imgLoaded, setImgLoaded] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });
  const [displaySize, setDisplaySize] = useState({ w: 0, h: 0 });
  const [aspect, setAspect] = useState(initialAspect);
  const [crop, setCrop] = useState({ x: 0, y: 0, w: 200, h: 200 });

  const dragState = useRef(null);
  // Tracks any internally-created blob URL so we can revoke it on cleanup
  const ownBlobUrl = useRef(null);

  // ── Load image, converting external URLs to safe blob: URLs ──────────────
  useEffect(() => {
    let cancelled = false;

    const initImage = (safeSrc) => {
      const img = new Image();
      img.onload = () => {
        if (cancelled) return;
        imgRef.current = img;
        const nw = img.naturalWidth;
        const nh = img.naturalHeight;
        setNaturalSize({ w: nw, h: nh });

        const maxW = Math.min(window.innerWidth * 0.72, 900);
        const maxH = Math.min(window.innerHeight * 0.55, 560);
        const scale = Math.min(maxW / nw, maxH / nh, 1);
        const dw = Math.round(nw * scale);
        const dh = Math.round(nh * scale);
        setDisplaySize({ w: dw, h: dh });

        const cw = initialAspect ? Math.min(dw * 0.8, dh * 0.8 * initialAspect) : dw * 0.8;
        const ch = initialAspect ? cw / initialAspect : dh * 0.8;
        setCrop({
          x: Math.round((dw - cw) / 2),
          y: Math.round((dh - ch) / 2),
          w: Math.round(cw),
          h: Math.round(ch),
        });
        setImgLoaded(true);
      };
      img.onerror = () => {
        if (!cancelled) setLoadError("Failed to load image.");
      };
      img.src = safeSrc;
    };

    const isExternal = src && !src.startsWith("blob:") && !src.startsWith("data:");

    if (isExternal) {
      // Fetch the external image (Cloudinary, etc.) and convert to a local
      // blob: URL so the canvas is never tainted by cross-origin content.
      fetch(src)
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.blob();
        })
        .then((blob) => {
          if (cancelled) return;
          const blobUrl = URL.createObjectURL(blob);
          ownBlobUrl.current = blobUrl;
          initImage(blobUrl);
        })
        .catch((err) => {
          if (!cancelled) setLoadError(`Could not load image: ${err.message}`);
        });
    } else {
      // Already a safe local blob: or data: URL -- load directly
      initImage(src);
    }

    return () => {
      cancelled = true;
      // Revoke any blob URL we created ourselves
      if (ownBlobUrl.current) {
        URL.revokeObjectURL(ownBlobUrl.current);
        ownBlobUrl.current = null;
      }
    };
  }, [src]);

  // ── Redraw canvas whenever crop or image changes ──────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imgRef.current || !imgLoaded) return;
    const ctx = canvas.getContext("2d");
    const { w: dw, h: dh } = displaySize;
    canvas.width = dw;
    canvas.height = dh;

    ctx.drawImage(imgRef.current, 0, 0, dw, dh);

    // Darken outside crop box
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(0, 0, dw, crop.y);
    ctx.fillRect(0, crop.y + crop.h, dw, dh - crop.y - crop.h);
    ctx.fillRect(0, crop.y, crop.x, crop.h);
    ctx.fillRect(crop.x + crop.w, crop.y, dw - crop.x - crop.w, crop.h);

    // Crop border
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.strokeRect(crop.x, crop.y, crop.w, crop.h);

    // Rule-of-thirds grid
    ctx.strokeStyle = "rgba(255,255,255,0.28)";
    ctx.lineWidth = 1;
    for (let i = 1; i <= 2; i++) {
      ctx.beginPath();
      ctx.moveTo(crop.x + (crop.w / 3) * i, crop.y);
      ctx.lineTo(crop.x + (crop.w / 3) * i, crop.y + crop.h);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(crop.x, crop.y + (crop.h / 3) * i);
      ctx.lineTo(crop.x + crop.w, crop.y + (crop.h / 3) * i);
      ctx.stroke();
    }

    // Resize handles
    const HS = 10;
    ctx.fillStyle = "#fff";
    [
      [crop.x, crop.y],
      [crop.x + crop.w - HS, crop.y],
      [crop.x, crop.y + crop.h - HS],
      [crop.x + crop.w - HS, crop.y + crop.h - HS],
      [crop.x + crop.w / 2 - HS / 2, crop.y],
      [crop.x + crop.w / 2 - HS / 2, crop.y + crop.h - HS],
      [crop.x, crop.y + crop.h / 2 - HS / 2],
      [crop.x + crop.w - HS, crop.y + crop.h / 2 - HS / 2],
    ].forEach(([cx, cy]) => ctx.fillRect(cx, cy, HS, HS));
  }, [crop, displaySize, imgLoaded]);

  useEffect(() => { draw(); }, [draw]);

  // ── Clamp helper ──────────────────────────────────────────────────────────
  const clamp = (c, dw, dh) => {
    let { x, y, w, h } = c;
    w = Math.max(MIN_SIZE, Math.min(w, dw));
    h = Math.max(MIN_SIZE, Math.min(h, dh));
    x = Math.max(0, Math.min(x, dw - w));
    y = Math.max(0, Math.min(y, dh - h));
    return { x, y, w, h };
  };

  // ── Hit-test which handle the pointer is on ───────────────────────────────
  const getHandle = (px, py) => {
    const { x, y, w, h } = crop;
    const T = 14;
    const inX = px >= x - T && px <= x + w + T;
    const inY = py >= y - T && py <= y + h + T;
    if (!inX || !inY) return null;

    const onLeft = Math.abs(px - x) < T;
    const onRight = Math.abs(px - (x + w)) < T;
    const onTop = Math.abs(py - y) < T;
    const onBottom = Math.abs(py - (y + h)) < T;

    if (onTop && onLeft) return "nw";
    if (onTop && onRight) return "ne";
    if (onBottom && onLeft) return "sw";
    if (onBottom && onRight) return "se";
    if (onTop) return "n";
    if (onBottom) return "s";
    if (onLeft) return "w";
    if (onRight) return "e";
    if (px > x && px < x + w && py > y && py < y + h) return "move";
    return null;
  };

  const canvasPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      px: (clientX - rect.left) * (displaySize.w / rect.width),
      py: (clientY - rect.top) * (displaySize.h / rect.height),
    };
  };

  const onPointerDown = (e) => {
    e.preventDefault();
    const { px, py } = canvasPos(e);
    const handle = getHandle(px, py);
    if (!handle) return;
    dragState.current = {
      type: handle === "move" ? "move" : "resize",
      handle,
      startX: px,
      startY: py,
      startCrop: { ...crop },
    };
  };

  const onPointerMove = (e) => {
    if (!dragState.current) return;
    e.preventDefault();
    const { px, py } = canvasPos(e);
    const ds = dragState.current;
    const dx = px - ds.startX;
    const dy = py - ds.startY;
    const sc = ds.startCrop;
    const { w: dw, h: dh } = displaySize;

    let next = { ...sc };

    if (ds.type === "move") {
      next.x = sc.x + dx;
      next.y = sc.y + dy;
    } else {
      const h = ds.handle;
      if (h.includes("e")) next.w = sc.w + dx;
      if (h.includes("s")) next.h = sc.h + dy;
      if (h.includes("w")) { next.x = sc.x + dx; next.w = sc.w - dx; }
      if (h.includes("n")) { next.y = sc.y + dy; next.h = sc.h - dy; }

      if (aspect) {
        if (h.includes("e") || h.includes("w")) {
          next.h = next.w / aspect;
        } else {
          next.w = next.h * aspect;
        }
      }
    }

    setCrop(clamp(next, dw, dh));
  };

  const onPointerUp = () => { dragState.current = null; };

  // ── Aspect ratio preset change ────────────────────────────────────────────
  const changeAspect = (a) => {
    setAspect(a);
    if (!a) return;
    setCrop(prev => {
      const newH = prev.w / a;
      const { w: dw, h: dh } = displaySize;
      return clamp({ ...prev, h: newH }, dw, dh);
    });
  };

  // ── Export the cropped region as a File ──────────────────────────────────
  const applyCrop = () => {
    const { w: dw, h: dh } = displaySize;
    const scaleX = naturalSize.w / dw;
    const scaleY = naturalSize.h / dh;

    const nx = Math.round(crop.x * scaleX);
    const ny = Math.round(crop.y * scaleY);
    const nw = Math.round(crop.w * scaleX);
    const nh = Math.round(crop.h * scaleY);

    const out = document.createElement("canvas");
    out.width = nw;
    out.height = nh;
    const ctx = out.getContext("2d");
    // imgRef.current is always a safe local image at this point
    ctx.drawImage(imgRef.current, nx, ny, nw, nh, 0, 0, nw, nh);

    out.toBlob((blob) => {
      if (!blob) return;
      const ext = filename.split(".").pop() || "jpg";
      const outName = filename.replace(/\.[^.]+$/, `_cropped.${ext}`);
      const file = new File([blob], outName, { type: blob.type });
      onCrop(file);
    }, "image/jpeg", 0.92);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  if (loadError) {
    return createPortal(
      <div className="fixed inset-0 z-[200] bg-black/80 flex flex-col items-center justify-center gap-4 p-6">
        <div className="bg-red-900 text-white rounded-2xl p-8 text-center max-w-md">
          <div className="text-[2rem] mb-2">⚠️</div>
          <div className="text-[1.5rem] font-semibold mb-1">Could not load image</div>
          <div className="text-[1.2rem] text-red-200 mb-4">{loadError}</div>
          <button onClick={onCancel} className="px-6 py-2 bg-white text-red-900 font-bold rounded-xl cursor-pointer">
            Close
          </button>
        </div>
      </div>,
      document.body
    );
  }

  if (!imgLoaded) {
    return createPortal(
      <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-white">
          <div className="w-10 h-10 border-4 border-white/30 border-t-violet-500 rounded-full animate-spin" />
          <div className="text-[1.4rem]">Loading image...</div>
        </div>
      </div>,
      document.body
    );
  }

  return createPortal(
    <div className="fixed inset-0 z-[200] bg-black/85 flex flex-col items-center justify-center p-4">
      <div className="bg-[#1a1a2e] rounded-2xl shadow-2xl flex flex-col overflow-hidden w-auto max-w-[95vw]" style={{ minWidth: 320 }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3 text-white">
            <Crop size={22} weight="bold" />
            <span className="text-[1.5rem] font-bold">Crop Image</span>
          </div>
          <button type="button" onClick={onCancel} className="text-white/60 hover:text-red-400 transition-colors">
            <X size={20} weight="bold" />
          </button>
        </div>

        {/* Aspect ratio presets */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-white/10 flex-wrap">
          <span className="text-white/50 text-[1.2rem] mr-1">Aspect:</span>
          {ASPECT_PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => changeAspect(p.value)}
              className={`px-3 py-1 rounded-lg text-[1.15rem] font-semibold border transition-all ${
                aspect === p.value
                  ? "bg-violet-600 border-violet-400 text-white"
                  : "bg-white/10 border-white/20 text-white/70 hover:bg-white/20"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Canvas */}
        <div ref={containerRef} className="flex items-center justify-center bg-black/40 px-6 py-5">
          <canvas
            ref={canvasRef}
            width={displaySize.w}
            height={displaySize.h}
            style={{ cursor: "crosshair", maxWidth: "100%", userSelect: "none", touchAction: "none" }}
            onMouseDown={onPointerDown}
            onMouseMove={onPointerMove}
            onMouseUp={onPointerUp}
            onMouseLeave={onPointerUp}
            onTouchStart={onPointerDown}
            onTouchMove={onPointerMove}
            onTouchEnd={onPointerUp}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 gap-4 flex-wrap">
          <div className="text-white/40 text-[1.15rem]">
            {Math.round(crop.w)} x {Math.round(crop.h)} px
            <span className="ml-3 text-white/25">(drag corners to resize · drag inside to move)</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2 rounded-xl text-[1.3rem] font-semibold bg-white/10 text-white/70 hover:bg-white/20 transition-colors border border-white/15"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={applyCrop}
              className="px-6 py-2 rounded-xl text-[1.3rem] font-bold bg-violet-600 hover:bg-violet-700 text-white flex items-center gap-2 transition-colors shadow-lg"
            >
              <Check size={18} weight="bold" />
              Apply Crop
            </button>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
}
