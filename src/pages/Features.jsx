import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { CATEGORIES } from "../content";
import FeatureBentoPanel from "../components/FeatureBentoPanel";
import MorphingTabs from "../components/MorphingTabs";

const FILTERS = [{ id: "all", label: "All" }, ...CATEGORIES];

export default function Features() {
  const { hash } = useLocation();
  const [active, setActive] = useState("all");

  useEffect(() => {
    const id = hash.replace("#", "");
    if (CATEGORIES.some((c) => c.id === id)) setActive(id);
    else setActive("all");
  }, [hash]);

  const items = useMemo(
    () =>
      FILTERS.map((cat) => ({
        id: cat.id,
        label: cat.label,
        content: <FeatureBentoPanel categoryId={cat.id} />,
      })),
    [],
  );

  return (
    <section
      className="section"
      style={{ paddingTop: "clamp(7rem, 14vw, 11rem)", paddingBottom: "clamp(4rem, 10vw, 8rem)" }}
    >
      <h1 className="sr-only">Features</h1>
      <div className="grid" style={{ marginBottom: "2rem" }}>
        <div style={{ gridColumn: "1 / -1" }}>
          <h2 className="text-big lowercase" style={{ maxWidth: "20ch" }}>
            Eight tools, one semester.
          </h2>
        </div>
      </div>

      <MorphingTabs
        items={items}
        value={active}
        onValueChange={(id) => {
          setActive(id);
          history.replaceState(null, "", id === "all" ? "/features" : `/features#${id}`);
        }}
        ariaLabel="Filter features by area"
      />
    </section>
  );
}
