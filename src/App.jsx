import { useEffect, useState } from "react";
import "./App.css";
import {
  get_cats_filter_elements,
  get_cats_list,
  TRAIT_COLORS,
} from "./assets/handle_cats";
import CatCard from "./components/CatCard";

function App() {
  const [cats, set_cats] = useState({});

  const [rarity, set_rarity] = useState([]);
  const [selected_rarities, update_selected_rarities] = useState([]);

  const [abilities, set_abilities] = useState([]);
  const [selected_abilities, update_selected_abilities] = useState([]);

  const [targets, set_targets] = useState([]);
  const [selected_targets, update_selected_targets] = useState([]);

  const [against, set_against] = useState([]);
  const [selected_against, update_selected_against] = useState([]);

  const [filtered_cats, set_filtered_cats] = useState([]);
  useEffect(() => {
    const initiate_list = async () => {
      const cats_list = await get_cats_list();
      set_cats(cats_list);
      set_rarity(await get_cats_filter_elements(cats_list, "rarity"));
      set_abilities(await get_cats_filter_elements(cats_list, "abilities"));
      set_targets(await get_cats_filter_elements(cats_list, "target"));
      const against_types = await get_cats_filter_elements(
        cats_list,
        "against",
      );
      set_against(against_types.filter((against) => against != "all"));
    };
    initiate_list();
  }, []);

  const filter_list = (cat_data, search) => {
    if (typeof search == "string") {
      return cat_data.includes(search);
    } else {
      return search.filter((data) => cat_data.includes(data)).length > 0;
    }
  };

  useEffect(() => {
    set_filtered_cats(
      Object.keys(cats)
        .sort((a, b) => {
          return parseInt(a) - parseInt(b);
        })
        .filter((cat) => {
          const rarity_condition =
            filter_list(selected_rarities, cats[cat].data.rarity) ||
            selected_rarities.length == 0;

          const ability_condition =
            selected_abilities == 0 ||
            filter_list(cats[cat].data.abilities, selected_abilities);

          const against_condition =
            selected_against.length == 0 ||
            filter_list(cats[cat].data.against, selected_against) ||
            cats[cat].data.against.includes("all");
          const target_condition =
            selected_targets.length == 0 ||
            filter_list(cats[cat].data.target, selected_targets);
          return (
            rarity_condition &&
            against_condition &&
            ability_condition &&
            target_condition
          );
        })
        .map((cat, index) => <CatCard key={cat} cats={cats[cat]} />),
    );
  }, [
    cats,
    selected_rarities,
    selected_abilities,
    selected_against,
    selected_targets,
  ]);

  const subHeader = { fontSize: "1.54rem", fontWeight: "bold" };

  const grid_design = {
    display: "grid",
    gridTemplateColumns: "repeat(40, 1fr)",
    gap: "5px",
    justifyItems: "center",
  };

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
        <br />
        <div style={subHeader}>Against</div>

        <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
          {against.map((against) => (
            <button
              key={against}
              className={`button ${
                selected_against.includes(against) ? against : "not-selected"
              }`}
              onClick={() => {
                if (selected_against.includes(against)) {
                  update_selected_against(
                    selected_against.filter((current) => current !== against),
                  );
                } else {
                  update_selected_against([...selected_against, against]);
                }
              }}
            >
              {against}
            </button>
          ))}
        </div>

        <br />
        <div style={subHeader}>Target</div>
        <div style={grid_design}>
          {targets.map((target) => (
            <img
              key={target}
              title={target}
              alt={target}
              src={
                "./src/icons/" +
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

        <br />
        <div style={subHeader}>Abilities</div>
        <div style={grid_design}>
          {abilities.map((ability) => (
            <img
              style={{ cursor: "pointer" }}
              key={ability}
              src={
                "./src/icons/" +
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
      </div>
      {filtered_cats}
    </div>
  );
}

export default App;
