import React, { useEffect, useMemo, useState } from "react";
import EnemyCard from "@/components/EnemyCard.jsx";

const get_enemies = async () => {
  const raw_data = await fetch("./src/characters/allEnemies.json");
  return await raw_data.json();
};

export default function EnemyContainer() {
  const flex_design = {
    display: "flex",
    gap: "5px",
    flexWrap: "wrap",
  };

  const [enemies_data, set_enemies_data] = useState({});
  const [visibleCount, setVisibleCount] = useState(20);

  const [enemy_name, set_enemy_name] = useState("");

  const [abilities, set_abilities] = useState([]);
  const [selected_abilities, update_selected_abilities] = useState([]);
  const [and_or_abilities, set_and_or_abilities] = useState("OR");

  const [traits, set_traits] = useState([]);
  const [selected_traits, update_selected_traits] = useState([]);
  const [and_or_traits, set_and_or_traits] = useState("OR");

  // Numeric Object Filters
  const [damageFilter, setDamageFilter] = useState({ min: 0, max: 0 });
  const [dpsFilter, setDpsFilter] = useState({ min: 0, max: 0 });
  const [healthFilter, setHealthFilter] = useState({ min: 0, max: 0 });
  const [rangeFilter, setRangeFilter] = useState({ min: 0, max: 0 });
  const [animationTimeFilter, setAnimationTimeFilter] = useState({
    min: 0,
    max: 0,
  });
  const [tbaFilter, setTbaFilter] = useState({ min: 0, max: 0 });
  const [costFilter, setCostFilter] = useState({ min: 0, max: 0 });
  const [spawnTimeFilter, setSpawnTimeFilter] = useState({ min: 0, max: 0 });
  const [speedFilter, setSpeedFilter] = useState({ min: 0, max: 0 });
  const [knockbackFilter, setKnockbackFilter] = useState({ min: 0, max: 0 });

  const handleResetAll = () => {
    // Strings and Arrays
    set_enemy_name("");
    update_selected_abilities([]);
    set_and_or_abilities("OR");

    // FIXED: Resetting the Traits states you declared above
    update_selected_traits([]);
    set_and_or_traits("OR");

    // Numeric Object Filters
    // FIXED: Creating a fresh object primitive literal for each setter
    // to guarantee React registers the state re-render safely.
    setDamageFilter({ min: 0, max: 0 });
    setDpsFilter({ min: 0, max: 0 });
    setHealthFilter({ min: 0, max: 0 });
    setRangeFilter({ min: 0, max: 0 });
    setAnimationTimeFilter({ min: 0, max: 0 });
    setTbaFilter({ min: 0, max: 0 });
    setCostFilter({ min: 0, max: 0 });
    setSpawnTimeFilter({ min: 0, max: 0 });
    setSpeedFilter({ min: 0, max: 0 });
    setKnockbackFilter({ min: 0, max: 0 });
  };

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
    <>
      <div className="card-container" style={{ marginBottom: "10px" }}>
        <div style={{ display: "flex", gap: "10px" }}>
          <div className="sub-header">Enemy name</div>
        </div>
        <input
          value={enemy_name}
          style={{
            width: "20rem",
            height: "1.5rem",
            fontSize: "1.5rem",
            borderRadius: "10px",
          }}
          onChange={(e) => {
            set_enemy_name(e.target.value);
          }}
        />

        <hr style={{ width: "100%", background: "silver" }} />
        <div style={{ display: "flex", gap: "10px" }}>
          <div className="sub-header">Traits</div>
        </div>
        <div style={flex_design}>
          {(enemies_data?.collections?.traits || []).map((trait) => (
            <img
              key={trait}
              src={
                "./src/icons/traits/" +
                (selected_traits.includes(trait) ? trait : trait + "_BNW") +
                ".png"
              }
              width={"40rem"}
              height={"40rem"}
              style={{
                opacity: selected_traits.includes(trait) ? "1" : ".8",
                cursor: "pointer",
              }}
              title={trait}
              alt={trait}
              onClick={() => {
                update_selected_traits((prev) => {
                  if (prev.includes(trait)) {
                    return prev.filter((prev_trait) => prev_trait != trait);
                  }
                  return [...prev, trait];
                });
              }}
            />
          ))}
        </div>

        <hr style={{ width: "100%", background: "silver" }} />
        <div style={{ display: "flex", gap: "10px" }}>
          <div className="sub-header">Abilities</div>
        </div>
        <div style={flex_design}>
          {(enemies_data?.collections?.abilities || []).map((ability) => (
            <img
              key={ability}
              src={
                "./src/icons/abilities/" +
                (selected_abilities.includes(ability)
                  ? ability
                  : ability + "_BNW") +
                ".png"
              }
              width={"40rem"}
              height={"40rem"}
              style={{
                opacity: selected_abilities.includes(ability) ? "1" : ".8",
                cursor: "pointer",
              }}
              title={ability}
              alt={ability}
              onClick={() => {
                update_selected_abilities((prev) => {
                  if (prev.includes(ability)) {
                    return prev.filter(
                      (prev_ability) => prev_ability != ability,
                    );
                  }
                  return [...prev, ability];
                });
              }}
            />
          ))}
        </div>

        <hr style={{ width: "100%", background: "silver" }} />
        <div style={{ display: "flex", gap: "10px" }}>
          <div className="sub-header">Stats</div>
        </div>
        <div style={flex_design}>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {[
              {
                icon: "./src/icons/stats/Sword.svg",
                title: "Damage",
                state: damageFilter,
                setState: setDamageFilter,
              },
              {
                icon: "./src/icons/stats/Zap.svg",
                title: "DPS",
                state: dpsFilter,
                setState: setDpsFilter,
              },
              {
                icon: "./src/icons/stats/Heart (1).svg",
                title: "Health",
                state: healthFilter,
                setState: setHealthFilter,
              },
              {
                icon: "./src/icons/stats/Target Light.svg",
                title: "Range",
                state: rangeFilter,
                setState: setRangeFilter,
              },
              {
                icon: "./src/icons/stats/Film Reel Light.svg",
                title: "Animation Time",
                state: animationTimeFilter,
                setState: setAnimationTimeFilter,
              },
              {
                icon: "./src/icons/stats/Hourglass Empty.svg",
                title: "Time Between Attacks",
                state: tbaFilter,
                setState: setTbaFilter,
              },
              {
                icon: "./src/icons/stats/coin.svg",
                title: "Cost",
                state: costFilter,
                setState: setCostFilter,
              },
              {
                icon: "./src/icons/stats/Clock Hour.svg",
                title: "Spawn Time",
                state: spawnTimeFilter,
                setState: setSpawnTimeFilter,
              },
              {
                icon: "./src/icons/stats/Boot Fill.svg",
                title: "Speed",
                state: speedFilter,
                setState: setSpeedFilter,
              },
              {
                icon: "./src/icons/stats/Arrow Forward.svg",
                title: "Knockback",
                state: knockbackFilter,
                setState: setKnockbackFilter,
              },
            ].map((stat, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "6px",
                  margin: "10px",
                }}
              >
                {/* Icon */}
                <img
                  src={stat.icon}
                  alt={stat.title}
                  title={stat.title}
                  style={{ width: "28px", height: "28px" }}
                />

                {/* Min / Max Inputs with Text Indicators */}
                <div style={{ display: "flex", gap: "8px" }}>
                  {/* Min Column */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10px",
                        color: "#888",
                        marginBottom: "2px",
                      }}
                    >
                      Min
                    </span>
                    <input
                      className="filter min-filter"
                      type="number"
                      min={0}
                      value={stat.state.min}
                      onChange={(e) =>
                        stat.setState((prev) => ({
                          ...prev,
                          min: e.target.value,
                        }))
                      }
                      style={{ width: "60px" }}
                    />
                  </div>

                  {/* Max Column */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10px",
                        color: "#888",
                        marginBottom: "2px",
                      }}
                    >
                      Max
                    </span>
                    <input
                      className="filter max-filter"
                      type="number"
                      min={0}
                      value={stat.state.max}
                      onChange={(e) =>
                        stat.setState((prev) => ({
                          ...prev,
                          max: e.target.value,
                        }))
                      }
                      style={{ width: "60px" }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <hr style={{ width: "100%", background: "silver" }} />
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={handleResetAll}
            style={{
              fontSize: "1.54rem",
              fontWeight: "bold", // Copies your existing subHeader styles
              cursor: "pointer", // Makes it look clickable
              background: "#3399ff", // Removes default HTML button background (adjust if needed)
              font: "inherit", // Inherits typography from your subHeader style
              userSelect: "none", // Prevents text highlighting on double clicks
              borderRadius: "10px",
              border: "1px solid #2288EE",
              padding: "10px",
              color: "white",
            }}
          >
            Reset
          </button>
        </div>
      </div>
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
          .filter(
            (enemy) =>
              enemy.name
                .toLowerCase()
                .includes(enemy_name.toLocaleLowerCase()) &&
              (selected_traits.length == 0 ||
                selected_traits.every((trait) =>
                  enemy.traits.includes(trait),
                )) &&
              (selected_abilities.length == 0 ||
                selected_abilities.every((ability) =>
                  Object.keys(enemy?.special_abilities || {}).includes(ability),
                )),
          )
          .slice(0, visibleCount)
          .map((enemy) => (
            <EnemyCard key={enemy.name} enemy={enemy} />
          ))}
      </div>
    </>
  );
}
