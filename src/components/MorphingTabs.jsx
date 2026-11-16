import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";

const DRAG_THRESHOLD = 5;
const MAX_TAB_WIDTH = 176;
const MIN_TAB_WIDTH = 88;
const TAB_HEIGHT = 56;
const TAB_TOP = 24;
const TAB_RADIUS = 24;
const RAIL_HEIGHT = 80;
const SURFACE_INSET = 16;
const LIQUID_JOIN = 24;
const PANEL_RADIUS = 28;

function moveItem(order, from, to) {
  if (from === to) return order.slice();
  const next = order.slice();
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function liquidTabPath(tabLeft, surfaceWidth, tabWidth) {
  const panelLeft = SURFACE_INSET;
  const panelRight = surfaceWidth - SURFACE_INSET;
  const left = Math.max(panelLeft, Math.min(panelRight - tabWidth, tabLeft));
  const right = left + tabWidth;
  const top = RAIL_HEIGHT - TAB_HEIGHT;
  const bottom = RAIL_HEIGHT;
  const leftJoin = Math.max(panelLeft, left - LIQUID_JOIN);
  const rightJoin = Math.min(panelRight, right + LIQUID_JOIN);
  const leftDepth = Math.min(LIQUID_JOIN, left - leftJoin);
  const rightDepth = Math.min(LIQUID_JOIN, rightJoin - right);
  const leftControl = leftDepth * 0.55;
  const rightControl = rightDepth * 0.55;
  const leftPanelRadius = Math.min(PANEL_RADIUS, leftJoin - panelLeft);
  const rightPanelRadius = Math.min(PANEL_RADIUS, panelRight - rightJoin);

  return [
    `M${panelLeft} ${bottom + PANEL_RADIUS}`,
    `V${bottom + leftPanelRadius}`,
    `Q${panelLeft} ${bottom} ${panelLeft + leftPanelRadius} ${bottom}`,
    `H${leftJoin}`,
    `C${leftJoin + leftControl} ${bottom} ${left} ${bottom - leftDepth + leftControl} ${left} ${bottom - leftDepth}`,
    `V${top + TAB_RADIUS}`,
    `Q${left} ${top} ${left + TAB_RADIUS} ${top}`,
    `H${right - TAB_RADIUS}`,
    `Q${right} ${top} ${right} ${top + TAB_RADIUS}`,
    `V${bottom - rightDepth}`,
    `C${right} ${bottom - rightDepth + rightControl} ${rightJoin - rightControl} ${bottom} ${rightJoin} ${bottom}`,
    `H${panelRight - rightPanelRadius}`,
    `Q${panelRight} ${bottom} ${panelRight} ${bottom + rightPanelRadius}`,
    `V${bottom + PANEL_RADIUS}`,
    "Z",
  ].join(" ");
}

export default function MorphingTabs({ items, value, onValueChange, ariaLabel = "Feature tabs" }) {
  const uid = useId();
  const rootRef = useRef(null);
  const pathRef = useRef(null);
  const tabRefs = useRef({});
  const dragRef = useRef(null);

  const [order, setOrder] = useState(() => items.map((i) => i.id));
  const [internalVal, setInternalVal] = useState(() => items[0]?.id ?? null);
  const activeId = value !== undefined ? value : internalVal;

  const [surfaceWidth, setSurfaceWidth] = useState(0);
  const [draggingId, setDraggingId] = useState(null);
  const [dragLeft, setDragLeft] = useState(SURFACE_INSET);
  const [dragTargetIndex, setDragTargetIndex] = useState(-1);

  const springRef = useRef({ current: SURFACE_INSET, target: SURFACE_INSET, velocity: 0 });

  useEffect(() => {
    const ids = items.map((i) => i.id);
    setOrder((prev) => {
      const kept = prev.filter((id) => ids.includes(id));
      const added = ids.filter((id) => !kept.includes(id));
      const next = [...kept, ...added];
      return next.length === prev.length && next.every((v, i) => v === prev[i]) ? prev : next;
    });
  }, [items]);

  const itemMap = useMemo(() => new Map(items.map((i) => [i.id, i])), [items]);
  const orderedItems = useMemo(() => order.map((id) => itemMap.get(id)).filter(Boolean), [order, itemMap]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const measure = () => setSurfaceWidth(root.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    return () => ro.disconnect();
  }, []);

  const { tabWidth, slotGap } = useMemo(() => {
    const count = order.length;
    const baseGap = 12;
    if (!surfaceWidth || count === 0) return { tabWidth: MAX_TAB_WIDTH, slotGap: baseGap };
    const inner = surfaceWidth - SURFACE_INSET * 2;
    const widthAt = (gap) => Math.floor((inner - gap * (count - 1)) / count);
    if (widthAt(baseGap) >= MIN_TAB_WIDTH) {
      return { tabWidth: Math.min(MAX_TAB_WIDTH, widthAt(baseGap)), slotGap: baseGap };
    }
    if (count > 1 && widthAt(0) >= MIN_TAB_WIDTH) {
      const gap = Math.floor((inner - MIN_TAB_WIDTH * count) / (count - 1));
      return { tabWidth: MIN_TAB_WIDTH, slotGap: Math.max(0, gap) };
    }
    return { tabWidth: Math.max(64, widthAt(0)), slotGap: 0 };
  }, [order.length, surfaceWidth]);

  const slotLefts = useMemo(
    () => order.map((_, idx) => SURFACE_INSET + idx * (tabWidth + slotGap)),
    [order, slotGap, tabWidth],
  );

  const dragStartIndex = draggingId ? order.indexOf(draggingId) : -1;
  const visualIndexFor = useCallback(
    (idx) => {
      if (dragStartIndex < 0 || dragTargetIndex < 0) return idx;
      if (idx === dragStartIndex) return dragTargetIndex;
      if (dragTargetIndex > dragStartIndex && idx > dragStartIndex && idx <= dragTargetIndex) return idx - 1;
      if (dragTargetIndex < dragStartIndex && idx >= dragTargetIndex && idx < dragStartIndex) return idx + 1;
      return idx;
    },
    [dragStartIndex, dragTargetIndex],
  );

  const activeOrderIdx = activeId ? order.indexOf(activeId) : 0;
  const activeVisualIdx = activeOrderIdx < 0 ? 0 : visualIndexFor(activeOrderIdx);
  const targetSurfaceLeft =
    draggingId === activeId ? dragLeft : (slotLefts[activeVisualIdx] ?? SURFACE_INSET);

  useEffect(() => {
    springRef.current.target = targetSurfaceLeft;
  }, [targetSurfaceLeft]);

  useEffect(() => {
    if (surfaceWidth <= SURFACE_INSET * 2) return;
    let raf = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const tick = () => {
      const s = springRef.current;
      if (reduced || draggingId === activeId) {
        s.current = s.target;
        s.velocity = 0;
      } else {
        const force = (s.target - s.current) * 0.24;
        s.velocity = (s.velocity + force) * 0.62;
        s.current += s.velocity;
        if (Math.abs(s.target - s.current) < 0.25 && Math.abs(s.velocity) < 0.25) {
          s.current = s.target;
          s.velocity = 0;
        }
      }

      if (pathRef.current) {
        pathRef.current.setAttribute("d", liquidTabPath(s.current, surfaceWidth, tabWidth));
      }

      if (Math.abs(s.target - s.current) >= 0.25 || Math.abs(s.velocity) >= 0.25 || draggingId) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [activeId, draggingId, surfaceWidth, tabWidth, targetSurfaceLeft]);

  const setActive = (id) => {
    if (value === undefined) setInternalVal(id);
    onValueChange?.(id);
  };

  const onPointerDown = (id, e) => {
    if (e.button !== 0 || dragRef.current) return;
    const startIdx = order.indexOf(id);
    if (startIdx < 0) return;
    const startLeft = slotLefts[startIdx] ?? SURFACE_INSET;
    dragRef.current = {
      id,
      pointerId: e.pointerId,
      originX: e.clientX,
      startLeft,
      startIdx,
      targetIdx: startIdx,
      moved: false,
      slots: slotLefts.slice(),
    };
  };

  const onPointerMove = (e) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    const delta = e.clientX - drag.originX;
    if (!drag.moved && Math.abs(delta) < DRAG_THRESHOLD) return;
    if (!drag.moved) {
      drag.moved = true;
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {}
      setDraggingId(drag.id);
      setDragTargetIndex(drag.startIdx);
    }

    const minL = drag.slots[0] ?? SURFACE_INSET;
    const maxL = drag.slots[drag.slots.length - 1] ?? SURFACE_INSET;
    const nextLeft = Math.max(minL, Math.min(maxL, drag.startLeft + delta));
    setDragLeft(nextLeft);

    let nextIdx = drag.startIdx;
    if (nextLeft >= drag.startLeft) {
      for (let i = drag.startIdx + 1; i < drag.slots.length; i++) {
        if (nextLeft + tabWidth / 2 >= drag.slots[i]) nextIdx = i;
      }
    } else {
      for (let i = drag.startIdx - 1; i >= 0; i--) {
        if (nextLeft <= drag.slots[i] + tabWidth / 2) nextIdx = i;
      }
    }
    if (nextIdx !== drag.targetIdx) {
      drag.targetIdx = nextIdx;
      setDragTargetIndex(nextIdx);
    }
  };

  const finishDrag = (e) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    if (drag.moved) {
      setOrder((prev) => moveItem(prev, drag.startIdx, drag.targetIdx));
    }
    dragRef.current = null;
    setDraggingId(null);
    setDragTargetIndex(-1);
  };

  const activeItem = itemMap.get(activeId) || orderedItems[0];

  return (
    <div ref={rootRef} className="morph-tabs-root">
      {surfaceWidth > SURFACE_INSET * 2 && (
        <svg
          aria-hidden="true"
          viewBox={`0 0 ${surfaceWidth} ${RAIL_HEIGHT + PANEL_RADIUS}`}
          preserveAspectRatio="none"
          className="morph-tabs-svg"
        >
          <path
            ref={pathRef}
            d={liquidTabPath(targetSurfaceLeft, surfaceWidth, tabWidth)}
            fill="currentColor"
          />
        </svg>
      )}

      <div className="morph-tabs-rail-wrap">
        <div role="tablist" aria-label={ariaLabel} className="morph-tabs-rail">
          {orderedItems.map((item, idx) => {
            const isActive = item.id === activeItem?.id;
            const isDragging = item.id === draggingId;
            const vIdx = visualIndexFor(idx);
            const left = isDragging ? dragLeft : (slotLefts[vIdx] ?? SURFACE_INSET);
            const tabId = `${uid}-tab-${item.id}`;

            return (
              <div
                key={item.id}
                className={`morph-tab-slot ${isDragging ? "is-dragging" : ""}`.trim()}
                style={{
                  width: `${tabWidth}px`,
                  height: `${TAB_HEIGHT}px`,
                  marginTop: `${TAB_TOP}px`,
                  zIndex: isDragging ? 30 : isActive ? 20 : 1,
                  transform: `translate3d(${left}px, 0, 0)`,
                }}
                onPointerDown={(e) => onPointerDown(item.id, e)}
                onPointerMove={onPointerMove}
                onPointerUp={finishDrag}
                onPointerCancel={finishDrag}
              >
                <button
                  ref={(n) => {
                    tabRefs.current[item.id] = n;
                  }}
                  id={tabId}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`${uid}-panel`}
                  tabIndex={isActive ? 0 : -1}
                  className={`morph-tab-btn ${isActive ? "is-active" : ""}`.trim()}
                  onClick={() => {
                    if (dragRef.current?.moved) return;
                    setActive(item.id);
                  }}
                >
                  <span className="morph-tab-label">{item.label}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div
        id={`${uid}-panel`}
        role="tabpanel"
        aria-labelledby={activeItem ? `${uid}-tab-${activeItem.id}` : undefined}
        className="morph-tabs-panel"
      >
        <div key={activeItem?.id} className="morph-tabs-panel-inner">
          {activeItem?.content}
        </div>
      </div>
    </div>
  );
}
