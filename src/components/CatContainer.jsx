import { useEffect, useMemo, useState } from "react";
import { get_cats_list } from "@/assets/handle_cats";
import CatCard from "@/components/CatCard";
import { catStat, get_type } from "../assets/handle_cats";

function CatContainer() {
  const [cats, set_cats] = useState({});
  const [cats_owned, set_cats_owned] = useState({});

  const [searched_cat, set_search_cat] = useState("");

  const [rarity, set_rarity] = useState([]);
  const [selected_rarities, update_selected_rarities] = useState([]);

  const [abilities, set_abilities] = useState([]);
  const [selected_abilities, update_selected_abilities] = useState([]);
  const [and_or_abilities, set_and_or_abilities] = useState("OR");

  const [against, set_against] = useState([]);
  const [selected_against, update_selected_against] = useState([]);
  const [and_or_against, set_and_or_against] = useState("OR");

  const [targets, set_targets] = useState([]);
  const [selected_targets, update_selected_targets] = useState([]);
  const [and_or_targets, set_and_or_targets] = useState("OR");

  const [cats_stats, set_cats_stats] = useState({});

  const [damage_filter, set_damage_filter] = useState({ min: 0, max: 0 });
  const [dps_filter, set_dps_filter] = useState({ min: 0, max: 0 });
  const [health_filter, set_health_filter] = useState({ min: 0, max: 0 });
  const [range_filter, set_range_filter] = useState({ min: 0, max: 0 });
  const [animation_time_filter, set_animation_time_filter] = useState({
    min: 0,
    max: 0,
  });
  const [tba_filter, set_tba_filter] = useState({ min: 0, max: 0 });
  const [cost_filter, set_cost_filter] = useState({ min: 0, max: 0 });
  const [spawn_time_filter, set_spawn_time_filter] = useState({
    min: 0,
    max: 0,
  });
  const [speed_filter, set_speed_filter] = useState({ min: 0, max: 0 });
  const [knockback_filter, set_knockback_filter] = useState({ min: 0, max: 0 });

  const download_cats = () => {
    const fileName = "exported_cats";
    const json = JSON.stringify(cats_owned, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const href = URL.createObjectURL(blob);

    // create "a" HTLM element with href to file
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();

    // clean up "a" element & remove ObjectURL
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  const handleResetAll = () => {
    // Strings and Arrays
    set_search_cat("");
    update_selected_rarities([]);
    update_selected_abilities([]);
    set_and_or_abilities("OR");
    update_selected_against([]);
    set_and_or_against("OR");
    update_selected_targets([]);
    set_and_or_targets("OR");

    // Numeric Object _filters
    const defaultMinMax = { min: 0, max: 0 };
    set_damage_filter(defaultMinMax);
    set_dps_filter(defaultMinMax);
    set_health_filter(defaultMinMax);
    set_range_filter(defaultMinMax);
    set_animation_time_filter(defaultMinMax);
    set_tba_filter(defaultMinMax);
    set_cost_filter(defaultMinMax);
    set_spawn_time_filter(defaultMinMax);
    set_speed_filter(defaultMinMax);
    set_knockback_filter(defaultMinMax);
  };

  useEffect(() => {
    const initiate_list = async () => {
      const cats_list = await get_cats_list();
      set_cats(cats_list.cats);

      set_rarity(cats_list.collections.rarities);
      set_abilities(cats_list.collections.abilities);
      set_against(cats_list.collections.against);
      set_targets(cats_list.collections.targets);
    };

    initiate_list();
  }, []);

  const filtered_cats = useMemo(() => {
    return Object.keys(cats)
      .sort((a, b) => {
        const rarity = {
          "Normal Cat": 1,
          "Special Cat": 2,
          "Special CatMythic": 3,
          "Rare Cat": 4,
          "Super Rare Cat": 5,
          "Uber Rare Cat": 6,
          "Legend Rare Cat": 7,
        };
        return (
          rarity[cats[a].general.rarity] - rarity[cats[b].general.rarity] ||
          parseInt(a) - parseInt(b)
        );
      })
      .filter((cat) => {
        const units_names = Object.values(cats[cat].units).map(
          (unit, index) => ({
            id: index,
            name: unit.name.toLowerCase(),
          }),
        );

        const name_condition = units_names
          .filter((unit) => unit.name.includes(searched_cat.toLowerCase()))
          .map((unit) => unit.id);

        const rarity_condition =
          selected_rarities.includes(cats[cat].general.rarity) ||
          selected_rarities.length == 0;

        const units_abilities = Object.values(cats[cat].units).map(
          (catUnit, index) => ({
            id: index,
            abilities: Object.keys(catUnit.abilities || {}),
          }),
        );
        const ability_condition = units_abilities
          .filter(
            (cat_abilities) =>
              selected_abilities.length == 0 ||
              (and_or_abilities == "OR"
                ? selected_abilities.some((ability) =>
                    cat_abilities.abilities.includes(ability),
                  )
                : selected_abilities.every((ability) =>
                    cat_abilities.abilities.includes(ability),
                  )),
          )
          .map((catUnit) => catUnit.id);

        const units_against = Object.values(cats[cat].units).map(
          (unit, index) => ({
            id: index,
            against: unit.against || [],
          }),
        );

        const against_condition = units_against
          .filter(
            (unit_against) =>
              selected_against.length === 0 ||
              (and_or_against === "OR"
                ? selected_against.some((a) => unit_against.against.includes(a))
                : selected_against.every((a) =>
                    unit_against.against.includes(a),
                  )),
          )
          .map((unit) => unit.id);
        const target_units = Object.values(cats[cat].units).map(
          (unit, index) => ({
            id: index,
            target: unit.stats ? unit.stats["Attack Type"] : "Single",
          }),
        );

        const target_condition = target_units
          .filter(
            (unit_target) =>
              selected_targets.length === 0 ||
              selected_targets.includes(unit_target.target),
          )
          .map((unit) => unit.id);

        // ==========================================
        // EXACT-MATCH DATA STATS RANGE CONDITION
        // ==========================================

        const stats_condition = Object.values(cats[cat].units)
          .map((unit, index) => {
            const stats = unit.stats || {};

            // Clean strings containing formatting commas (e.g., "4,050" -> 4050)
            const cleanNum = (val) => {
              if (!val) return 0;
              return parseFloat(String(val).replace(/,/g, "")) || 0;
            };

            // Updated helper function checking for dual-zero defaults
            const checkBounds = (numValue, filter) => {
              const min_filterVal = parseFloat(filter.min) || 0;
              const max_filterVal = parseFloat(filter.max) || 0;

              // Rule: If both min and max are 0, consider it active/true (no constraint applied)
              if (min_filterVal === 0 && max_filterVal === 0) return true;

              // Otherwise, evaluate boundaries mathematically
              const minMatch = numValue >= min_filterVal;
              const maxMatch = max_filterVal === 0 || numValue <= max_filterVal;

              return minMatch && maxMatch;
            };

            // Parse base stats exactly matching your raw keys
            const rawDamage = catStat(
              cleanNum(stats.att) * 2.5,
              30,
              get_type(unit),
            );
            const rawHealth = catStat(
              cleanNum(stats.hp) * 2.5,
              30,
              get_type(unit),
            );
            const rawRange = cleanNum(stats.range);
            const rawSpeed = cleanNum(stats.speed);
            const rawKb = cleanNum(stats.kb);
            const rawCost = cleanNum(stats.cost);

            // Convert frame strings ("301", "5") into clean mathematical seconds
            const rawAttCy = cleanNum(stats.attCy);
            const parsedAnimationTime = cleanNum(stats.fore) / 30;
            const parsedTba = rawAttCy / 30;

            // Derived calculation for accurate Battle Cats DPS filtering
            const calculatedDps =
              rawAttCy > 0 ? rawDamage / (rawAttCy / 30) : 0;

            // Handle formatting for "100 ~ 91.2 seconds" string layout
            let parsedSpawnTime = 0;
            if (stats.recharge) {
              const parts = stats.recharge.split("~ ");
              parsedSpawnTime = cleanNum(parts[1] ? parts[1] : parts[0]);
            }

            const matchesAllStats =
              checkBounds(rawDamage, damage_filter) &&
              checkBounds(calculatedDps, dps_filter) &&
              checkBounds(rawHealth, health_filter) &&
              checkBounds(rawRange, range_filter) &&
              checkBounds(parsedAnimationTime, animation_time_filter) &&
              checkBounds(parsedTba, tba_filter) &&
              checkBounds(rawCost, cost_filter) &&
              checkBounds(parsedSpawnTime, spawn_time_filter) &&
              checkBounds(rawSpeed, speed_filter) &&
              checkBounds(rawKb, knockback_filter);

            return { id: index, valid: matchesAllStats };
          })
          .filter((unit) => unit.valid)
          .map((unit) => unit.id);

        // Intersect the stats condition mapping with the existing structural arrays
        const conditions = ability_condition
          .filter((id) => against_condition.includes(id))
          .filter((id) => name_condition.includes(id))
          .filter((id) => stats_condition.includes(id))
          .filter((id) => target_condition.includes(id));

        return rarity_condition && conditions.length > 0;
      })
      .map((cat) => (
        <CatCard
          key={cat}
          set_owned={set_cats_owned}
          owned={cats_owned}
          cats={cats[cat]}
          cat_index={cat}
        />
      ));
  }, [
    cats,
    cats_owned,
    selected_rarities,
    selected_abilities,
    selected_against,
    selected_targets,
    searched_cat,
    and_or_abilities,
    and_or_against,
    and_or_targets,
    damage_filter,
    dps_filter,
    health_filter,
    range_filter,
    animation_time_filter,
    tba_filter,
    cost_filter,
    spawn_time_filter,
    speed_filter,
    knockback_filter,
  ]);

  const subHeader = { fontSize: "1.2rem", fontWeight: "bold" };

  const set_and_or = (value, setter) => {
    const button_stripper = {
      padding: "5px",
      paddingBottom: "0px",
      height: "fit-content",
      border: "1px solid transparent",
    };
    return (
      <div style={{ display: "flex", marginBottom: "10px" }}>
        <div
          style={button_stripper}
          onClick={() => {
            setter("OR");
          }}
          className={`button ${value == "OR" ? "selected" : "not-selected"}`}
        >
          Any
        </div>
        <div
          style={button_stripper}
          onClick={() => {
            setter("AND");
          }}
          className={`button ${value == "AND" ? "selected" : "not-selected"}`}
        >
          All
        </div>
      </div>
    );
  };

  const flex_design = {
    display: "flex",
    gap: "5px",
    flexWrap: "wrap",
  };

  const [visibleCount, setVisibleCount] = useState(20);

  useEffect(() => {
    setVisibleCount(20);
  }, [filtered_cats]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 200
      ) {
        setVisibleCount((prev) => prev + 20);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div
        className="card-container"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6,1fr)",
          alignItems: "center",
          justifyItems: "center",
          paddingTop: "0",
          position: "sticky",
          top: "10px",
        }}
      >
        <div
          style={{ ...subHeader, borderRadius: "10px 0 0 0" }}
          className="menu-header"
        >
          Name
          <div className="menu-item card-container">
            <input
              value={searched_cat}
              style={{
                width: "20rem",
                height: "1.5rem",
                fontSize: "1.5rem",
                borderRadius: "10px",
              }}
              onChange={(e) => {
                set_search_cat(e.target.value);
              }}
            />
          </div>
        </div>

        <div style={subHeader} className="menu-header">
          Rarity
          <div className="menu-item card-container">
            <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
              {rarity.map((rarity) => (
                <button
                  key={rarity}
                  className={`button ${selected_rarities.includes(rarity) ? "selected" : "not-selected"}`}
                  onClick={() => {
                    if (selected_rarities.includes(rarity)) {
                      update_selected_rarities(
                        selected_rarities.filter(
                          (current_rarity) => rarity != current_rarity,
                        ),
                      );
                    } else {
                      update_selected_rarities([...selected_rarities, rarity]);
                    }
                  }}
                >
                  {rarity}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={subHeader} className="menu-header">
          Against
          <div className="menu-item card-container">
            {set_and_or(and_or_against, set_and_or_against)}

            <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
              {against.map((against, index) => (
                <img
                  key={index}
                  style={{
                    cursor: "pointer",
                    opacity: selected_against.includes(against) ? "1" : ".8",
                    height: "40px",
                    width: "40px",
                  }}
                  src={
                    "./src/icons/traits/" +
                    against +
                    (selected_against.includes(against) ? "" : "_BNW") +
                    ".png"
                  }
                  onClick={() => {
                    if (selected_against.includes(against)) {
                      update_selected_against(
                        selected_against.filter(
                          (current) => current !== against,
                        ),
                      );
                    } else {
                      update_selected_against([...selected_against, against]);
                    }
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div style={subHeader} className="menu-header">
          Target
          <div className="card-container menu-item">
            <div style={flex_design}>
              {targets.map((target, index) => (
                <img
                  key={index}
                  title={target}
                  alt={target}
                  style={{
                    opacity: selected_targets.includes(target) ? "1" : ".8",
                    cursor: "pointer",
                  }}
                  src={
                    "./src/icons/abilities/" +
                    (selected_targets.includes(target)
                      ? target
                      : target + "_BNW") +
                    ".png"
                  }
                  height={"40rem"}
                  widht={"40rem"}
                  onClick={() => {
                    if (selected_targets.includes(target)) {
                      update_selected_targets(
                        selected_targets.filter(
                          (current_target) => target != current_target,
                        ),
                      );
                    } else {
                      update_selected_targets([...selected_targets, target]);
                    }
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div style={subHeader} className="menu-header">
          Abilities
          <div className="card-container menu-item">
            {set_and_or(and_or_abilities, set_and_or_abilities)}
            <div
              style={{ display: "grid", gridTemplateColumns: "repeat(10,1fr)" }}
            >
              {abilities.map((ability) => (
                <img
                  key={ability}
                  style={{
                    opacity: selected_abilities.includes(ability) ? "1" : ".8",
                    cursor: "pointer",
                  }}
                  src={
                    "./src/icons/abilities/" +
                    (selected_abilities.includes(ability)
                      ? ability
                      : ability + "_BNW") +
                    ".png"
                  }
                  height={"40rem"}
                  width={"40rem"}
                  alt={ability}
                  title={ability}
                  className="abilities"
                  onClick={() => {
                    if (selected_abilities.includes(ability)) {
                      update_selected_abilities(
                        selected_abilities.filter(
                          (current_ability) => ability != current_ability,
                        ),
                      );
                    } else {
                      update_selected_abilities([
                        ...selected_abilities,
                        ability,
                      ]);
                    }
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div
          style={{ ...subHeader, borderRadius: "0 10px 0 0" }}
          className="menu-header"
        >
          stats
          <div className="card-container menu-item">
            <div
              style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)" }}
            >
              {[
                {
                  icon: "./src/icons/stats/Sword.svg",
                  title: "Damage",
                  state: damage_filter,
                  setState: set_damage_filter,
                },
                {
                  icon: "./src/icons/stats/Zap.svg",
                  title: "DPS",
                  state: dps_filter,
                  setState: set_dps_filter,
                },
                {
                  icon: "./src/icons/stats/Heart (1).svg",
                  title: "Health",
                  state: health_filter,
                  setState: set_health_filter,
                },
                {
                  icon: "./src/icons/stats/Target Light.svg",
                  title: "Range",
                  state: range_filter,
                  setState: set_range_filter,
                },
                {
                  icon: "./src/icons/stats/Film Reel Light.svg",
                  title: "Animation Time",
                  state: animation_time_filter,
                  setState: set_animation_time_filter,
                },
                {
                  icon: "./src/icons/stats/Hourglass Empty.svg",
                  title: "Time Between Attacks",
                  state: tba_filter,
                  setState: set_tba_filter,
                },
                {
                  icon: "./src/icons/stats/coin.svg",
                  title: "Cost",
                  state: cost_filter,
                  setState: set_cost_filter,
                },
                {
                  icon: "./src/icons/stats/Clock Hour.svg",
                  title: "Spawn Time",
                  state: spawn_time_filter,
                  setState: set_spawn_time_filter,
                },
                {
                  icon: "./src/icons/stats/Boot Fill.svg",
                  title: "Speed",
                  state: speed_filter,
                  setState: set_speed_filter,
                },
                {
                  icon: "./src/icons/stats/Arrow Forward.svg",
                  title: "Knockback",
                  state: knockback_filter,
                  setState: set_knockback_filter,
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
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: "10px",
          textWrap: "nowrap",
          marginTop: "10px",
        }}
      >
        <button
          onClick={handleResetAll}
          style={{
            ...subHeader, // Copies your existing subHeader styles
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
        <button
          onClick={download_cats}
          style={{
            ...subHeader, // Copies your existing subHeader styles
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
          export owned cats
        </button>
        <label
          style={{
            ...subHeader, // Copies your existing subHeader styles
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
          import cats
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) {
                return;
              }
              const reader = new FileReader();

              // This event fires when the file reading is completely finished
              reader.onload = (event) => {
                try {
                  // event.target.result contains the raw file text string
                  const parsedData = JSON.parse(event.target.result);
                  set_cats_owned(parsedData);
                } catch (err) {
                  setError("Failed to parse JSON. File might be corrupted.");
                }
              };

              // Start reading the file as plain text
              reader.readAsText(file);
            }}
            style={{ display: "none" }}
          />
        </label>
      </div>
      {filtered_cats.slice(0, visibleCount)}
    </div>
  );
}

export default CatContainer;
