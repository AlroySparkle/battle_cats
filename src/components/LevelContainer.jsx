import React, { memo, useEffect, useState } from "react";
import EnemyCard from "./EnemyCard";

const levels_fetch = async () => {
  const raw_data = await fetch("./src/characters/allLevels.json");
  return await raw_data.json();
};

const get_enemies = async () => {
  const raw_data = await fetch("./src/characters/allEnemies.json");
  return await raw_data.json();
};

export default function LevelContainer() {
  const [enemies, set_enemies] = useState({});

  const [levels, set_levels] = useState({});
  const [searched_level, set_searched_level] = useState("");
  useEffect(() => {
    async function fetch_data() {
      const levels_data = await levels_fetch();
      const enemies_data = await get_enemies();
      set_enemies(enemies_data.units);
      set_levels(levels_data);
    }
    fetch_data();
  }, []);
  useEffect(() => {
    console.log(levels);
    console.log(enemies);
  }, [levels, enemies]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div className="card-container">
        <input
          style={{
            width: "20rem",
            height: "1.5rem",
            fontSize: "1.5rem",
            borderRadius: "10px",
          }}
          value={searched_level}
          onChange={(e) => {
            set_searched_level(e.target.value);
          }}
        />
      </div>
      {Object.entries(levels)
        .filter((level) => {
          return level[0]
            .toLocaleLowerCase()
            .includes(searched_level.toLocaleLowerCase());
        })
        .map((level) => (
          <div key={level[0]} className="card-container">
            <h2 style={{ textAlign: "center" }}>{level[0]}</h2>
            <h3>Enemies</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "10px",
              }}
            >
              {level[1].enemies.map((enemy, index) => {
                if (enemies[enemy[0]])
                  return (
                    <EnemyCard
                      key={index}
                      enemy={enemies[enemy[0]]}
                      percentage={parseInt(enemy[1].replace(",", ""))}
                    />
                  );
                else {
                  return null;
                }
              })}
            </div>
            <h3>Bosses</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "10px",
              }}
            >
              {level[1].bosses.map((enemy, index) => {
                if (enemies[enemy[0]])
                  return (
                    <EnemyCard
                      key={index}
                      enemy={enemies[enemy[0]]}
                      percentage={parseInt(enemy[1].replace(",", ""))}
                    />
                  );
                else {
                  return null;
                }
              })}
            </div>
          </div>
        ))}
    </div>
  );
}
