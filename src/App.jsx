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
          .sort((a, b) => {
            return parseInt(a) - parseInt(b);
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
            console.log(cats[cat]);
            const rarity_condition =
              selected_rarities.includes(cats[cat].general.rarity) ||
              selected_rarities.length == 0;

            const units_abilities = Object.values(cats[cat].units).map(
              (cat, index) => ({
                id: index,
                abilities: Object.keys(cat.abilities || {}),
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
              .map((cat) => cat.id);

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

            // const target_condition = true;
            const conditions = ability_condition
              .filter((id) => against_condition.includes(id))
              .filter((id) => name_condition.includes(id));
            //..filter((id) => target_condition.includes(id));
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
      </div>
      {filtered_cats.slice(0, visibleCount)}
    </div>
  );
}

export default App;
