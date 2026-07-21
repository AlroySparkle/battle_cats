import React, { useEffect, useMemo, useState } from "react";
import { get_cats_list } from "../assets/handle_cats";
import ComboCard from "@/components/ComboCard";

export default function ComboContainer() {
  const [combo_list, set_combo_list] = useState([]);

  const [cats_amount, set_cats_amount] = useState(0);
  const [boost_level, set_boost_level] = useState([]);
  const [boost_effect, set_boost_effect] = useState([]);
  const [final_count, set_final_count] = useState(0);

  const filter_items = useMemo(() => {
    const levelsSet = new Set();
    const effectsSet = new Set();

    combo_list.forEach((combo) => {
      if (combo.boost_level) levelsSet.add(combo.boost_level);
      if (combo.effect) effectsSet.add(combo.effect);
    });

    return {
      boost_levels: [...levelsSet],
      boost_effects: [...effectsSet],
    };
  }, [combo_list]);

  useEffect(() => {
    const get_combos = async () => {
      const cats_lists = await get_cats_list();
      set_combo_list(cats_lists.collections.combos);
    };
    get_combos();
  }, []);
  return (
    <>
      <div className="card-container" style={{ marginBottom: "10px" }}>
        <div style={{ display: "flex", gap: "10px" }}>
          <div className="sub-header">Cats amount</div>
        </div>
        <input
          type="number"
          max={5}
          min={0}
          style={{ height: "1.5rem" }}
          value={cats_amount}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            console.log(val);
            set_cats_amount(isNaN(val) ? 0 : val);
          }}
        />

        <hr style={{ width: "100%", background: "silver" }} />

        <div style={{ display: "flex", gap: "10px" }}>
          <div className="sub-header">Boost effect</div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          {filter_items.boost_effects.map((effect) => (
            <button
              style={{
                textWrap: "nowrap",
                flex: "1 0 auto",
                textAlign: "center",
              }}
              onClick={() => {
                set_boost_effect((prev) => {
                  if (prev.includes(effect)) {
                    return prev.filter(
                      (current_effect) => current_effect != effect,
                    );
                  }
                  return [...prev, effect];
                });
              }}
              className={
                "button" + (boost_effect.includes(effect) ? " selected" : "")
              }
              key={effect}
            >
              {effect}
            </button>
          ))}
        </div>

        <hr style={{ width: "100%", background: "silver" }} />

        <div style={{ display: "flex", gap: "10px" }}>
          <div className="sub-header">Boost level</div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          {filter_items.boost_levels.map((level) => (
            <button
              style={{
                textWrap: "nowrap",
                flex: "1 0 auto",
                textAlign: "center",
              }}
              onClick={() => {
                set_boost_level((prev) => {
                  if (prev.includes(level)) {
                    return prev.filter(
                      (current_level) => current_level != level,
                    );
                  }
                  return [...prev, level];
                });
              }}
              className={
                "button" + (boost_level.includes(level) ? " selected" : "")
              }
              key={level}
            >
              {level}
            </button>
          ))}
        </div>
      </div>
      <div
        className="card-container"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          justifyContent: "space-around",
        }}
      >
        {combo_list
          .filter((combo) => {
            const level_condition =
              boost_level.length == 0 ||
              boost_level.includes(combo.boost_level);
            const effect_condition =
              boost_effect.length == 0 || boost_effect.includes(combo.effect);
            const amount_condition =
              cats_amount == 0 || cats_amount == combo.cats.length;
            return level_condition && effect_condition && amount_condition;
          })
          .map((combo, index) => (
            <ComboCard combo_data={combo} key={combo.name} index={index} />
          ))}
      </div>
    </>
  );
}
