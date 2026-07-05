import React, { useEffect, useMemo, useState } from "react";
import EnemyCard from "@/components/EnemyCard.jsx";

const get_enemies = async () => {
  const raw_data = await fetch("./src/characters/allEnemies.json");
  return await raw_data.json();
};

export default function EnemyContainer() {
  const [enemies_data, set_enemies_data] = useState({});
  const [visibleCount, setVisibleCount] = useState(20);

  useEffect(() => {
    const handleScroll = () => {
      const unitsArray = Object.values(enemies_data?.units || {});
      if (unitsArray.length === 0) return;

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      if (docHeight - (scrollTop + windowHeight) < 200) {
        if (visibleCount < unitsArray.length) {
          setVisibleCount((prev) => Math.min(prev + 20, unitsArray.length));
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [enemies_data, visibleCount]);

  useEffect(() => {
    const get_enemies_array = async () => {
      const enemies = await get_enemies();
      set_enemies_data(enemies);
    };
    get_enemies_array();
  }, []);
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        justifyContent: "space-around",
      }}
      className="card-container"
    >
      {Object.values(enemies_data?.units || {})
        .slice(0, visibleCount)
        .map((enemy) => (
          <EnemyCard key={enemy.name} enemy={enemy} />
        ))}
    </div>
  );
}
