import { useEffect, useState } from "react";
import "./App.css";
import { get_cats_list } from "./assets/handle_cats";
import CatCard from "./components/CatCard";

function App() {
  const [cats, set_cats] = useState({});

  const [searched_cat, set_search_cat] = useState("");

  const [rarity, set_rarity] = useState([]);
  const [selected_rarities, update_selected_rarities] = useState([]);

  const [abilities, set_abilities] = useState([]);
  const [selected_abilities, update_selected_abilities] = useState([]);
  const [and_or_abilities, set_and_or_abilities] = useState("OR");

  const [against, set_against] = useState([]);
  const [selected_against, update_selected_against] = useState([]);
  const [and_or_against, set_and_or_against] = useState("OR");

  const [targets /*, set_targets */] = useState([]);
  const [selected_targets, update_selected_targets] = useState([]);
  const [and_or_targets, set_and_or_targets] = useState("OR");

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

  const [filtered_cats, set_filtered_cats] = useState([]);

  useEffect(() => {
    const initiate_list = async () => {
      const cats_list = await get_cats_list();
      set_cats(cats_list.cats);

      set_rarity(cats_list.collections.rarities);
      set_abilities(cats_list.collections.abilities);
      set_against(cats_list.collections.against);
    };

    initiate_list();
  }, []);

  useEffect(() => {
    const build_cats = () => {
      set_filtered_cats(
        Object.keys(cats)
          .sort((a, b) => parseInt(a) - parseInt(b))
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
                    ? selected_against.some((a) =>
                        unit_against.against.includes(a),
                      )
                    : selected_against.every((a) =>
                        unit_against.against.includes(a),
                      )),
              )
              .map((unit) => unit.id);

            // ==========================================
            // EXACT-MATCH DATA STATS RANGE CONDITION
            // ==========================================
            if (cats[cat].units[0].name == "Actress Cat") {
              console.log(cats[cat].units[0]);
            }
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
                  const minFilterVal = parseFloat(filter.min) || 0;
                  const maxFilterVal = parseFloat(filter.max) || 0;

                  // Rule: If both min and max are 0, consider it active/true (no constraint applied)
                  if (minFilterVal === 0 && maxFilterVal === 0) return true;

                  // Otherwise, evaluate boundaries mathematically
                  const minMatch = numValue >= minFilterVal;
                  const maxMatch =
                    maxFilterVal === 0 || numValue <= maxFilterVal;

                  return minMatch && maxMatch;
                };

                // Parse base stats exactly matching your raw keys
                const rawDamage = cleanNum(stats.att) * 2.5;
                const rawHealth = cleanNum(stats.hp) * 2.5;
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
                  checkBounds(rawDamage, damageFilter) &&
                  checkBounds(calculatedDps, dpsFilter) &&
                  checkBounds(rawHealth, healthFilter) &&
                  checkBounds(rawRange, rangeFilter) &&
                  checkBounds(parsedAnimationTime, animationTimeFilter) &&
                  checkBounds(parsedTba, tbaFilter) &&
                  checkBounds(rawCost, costFilter) &&
                  checkBounds(parsedSpawnTime, spawnTimeFilter) &&
                  checkBounds(rawSpeed, speedFilter) &&
                  checkBounds(rawKb, knockbackFilter);

                return { id: index, valid: matchesAllStats };
              })
              .filter((unit) => unit.valid)
              .map((unit) => unit.id);

            // Intersect the stats condition mapping with the existing structural arrays
            const conditions = ability_condition
              .filter((id) => against_condition.includes(id))
              .filter((id) => name_condition.includes(id))
              .filter((id) => stats_condition.includes(id));

            return rarity_condition && conditions.length > 0;
          })
          .map((cat) => <CatCard key={cat} cats={cats[cat]} cat_index={cat} />),
      );
    };
    build_cats();
  }, [
    cats,
    selected_rarities,
    selected_abilities,
    selected_against,
    selected_targets,
    searched_cat,
    and_or_abilities,
    and_or_against,
    and_or_targets,

    // --- New Stat Filters ---
    damageFilter,
    dpsFilter,
    healthFilter,
    rangeFilter,
    animationTimeFilter,
    tbaFilter,
    costFilter,
    spawnTimeFilter,
    speedFilter,
    knockbackFilter,
  ]);

  const subHeader = { fontSize: "1.54rem", fontWeight: "bold" };

  const set_and_or = (value, setter) => {
    const button_stripper = {
      padding: "5px",
      paddingBottom: "0px",
      height: "fit-content",
      border: "1px solid transparent",
    };
    return (
      <div style={{ display: "flex" }}>
        <div
          style={button_stripper}
          onClick={() => {
            setter("OR");
          }}
          className={`button ${value == "OR" ? "selected" : "not-selected"}`}
        >
          OR
        </div>
        <div
          style={button_stripper}
          onClick={() => {
            setter("AND");
          }}
          className={`button ${value == "AND" ? "selected" : "not-selected"}`}
        >
          AND
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
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          padding: "10px",
          borderRadius: "20px",
          border: "1px solid silver",
        }}
      >
        <div style={subHeader}>Name</div>
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

        <hr style={{ width: "100%", background: "silver" }} />

        <div style={subHeader}>Rarity</div>
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

        <hr style={{ width: "100%", background: "silver" }} />

        <div style={{ display: "flex", gap: "10px" }}>
          <div style={subHeader}>Against</div>
          {set_and_or(and_or_against, set_and_or_against)}
        </div>
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
                    selected_against.filter((current) => current !== against),
                  );
                } else {
                  update_selected_against([...selected_against, against]);
                }
              }}
            />
          ))}
        </div>

        <hr style={{ width: "100%", background: "silver" }} />

        <div style={{ display: "flex", gap: "10px" }}>
          <div style={subHeader}>Target</div>
          {set_and_or(and_or_targets, set_and_or_targets)}
        </div>
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
                "./src/icons/abilities" +
                (selected_targets.includes(target) ? target : target + "_BNW") +
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

        <hr style={{ width: "100%", background: "silver" }} />

        <div style={{ display: "flex", gap: "10px" }}>
          <div style={subHeader}>Abilities</div>
          {set_and_or(and_or_abilities, set_and_or_abilities)}
        </div>
        <div style={flex_design}>
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
                  update_selected_abilities([...selected_abilities, ability]);
                }
              }}
            />
          ))}
        </div>
        <hr style={{ width: "100%", background: "silver" }} />

        <div style={{ display: "flex", gap: "10px" }}>
          <div style={subHeader}>stats</div>
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
      </div>
      {filtered_cats.slice(0, visibleCount)}
    </div>
  );
}

export default App;
