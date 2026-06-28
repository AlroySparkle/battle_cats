import { useEffect, useState } from "react";
import "./App.css";
import { get_cats_filter_elements, get_cats_list } from "./assets/handle_cats";
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

  const [targets, set_targets] = useState([]);
  const [selected_targets, update_selected_targets] = useState([]);
  const [and_or_targets, set_and_or_targets] = useState("OR");

  const [filtered_cats, set_filtered_cats] = useState([]);
  useEffect(() => {
    const initiate_list = async () => {
      const cats_list = await get_cats_list();
      set_cats(cats_list);
      const [rarity, abilities, targets, against] = await Promise.all([
        get_cats_filter_elements(cats_list, "rarity"),
        get_cats_filter_elements(cats_list, "abilities"),
        get_cats_filter_elements(cats_list, "target"),
        get_cats_filter_elements(cats_list, "against"),
      ]);
      console.log(cats_list);

      set_rarity(rarity);
      set_abilities(abilities);
      set_targets(targets);
      set_against(against.filter((a) => a !== "all"));
    };

    initiate_list();
  }, []);

  const filter_list = (cat_data, search, search_mode = "OR") => {
    if (typeof search === "string") {
      return cat_data.includes(search);
    }

    if (search_mode === "AND") {
      return search.every((data) => cat_data.includes(data));
    }

    return search.some((data) => cat_data.includes(data));
  };

  useEffect(() => {
    const build_cats = () => {
      set_filtered_cats(
        Object.keys(cats)
          .sort((a, b) => {
            return parseInt(a) - parseInt(b);
          })
          // .filter((cat) => {
          //   const name_condition =
          //     cats[cat].data.names.filter((cat) =>
          //       cat.toLowerCase().includes(searched_cat.toLocaleLowerCase()),
          //     ).length >= 1;
          //   const rarity_condition =
          //     filter_list(selected_rarities, cats[cat].data.rarity) ||
          //     selected_rarities.length == 0;

          //   const ability_condition =
          //     selected_abilities.length == 0 ||
          //     (and_or_abilities == "AND"
          //       ? Object.keys(cats[cat])
          //           .filter((form) => form != "data")
          //           .filter((form) =>
          //             filter_list(
          //               cats[cat][form].abilities,
          //               selected_abilities,
          //               and_or_abilities,
          //             ),
          //           ).length > 0
          //       : filter_list(
          //           cats[cat].data.abilities,
          //           selected_abilities,
          //           and_or_abilities,
          //         ));

          //   const against_condition =
          //     selected_against.length === 0 ||
          //     (and_or_against === "AND"
          //       ? Object.keys(cats[cat])
          //           .filter((form) => form !== "data")
          //           .some((form) =>
          //             filter_list(
          //               cats[cat][form].against,
          //               selected_against,
          //               and_or_against,
          //             ),
          //           )
          //       : filter_list(
          //           cats[cat].data.against,
          //           selected_against,
          //           and_or_against,
          //         ) || cats[cat].data.against.includes("all"));

          //   const target_condition =
          //     selected_targets.length === 0 ||
          //     (and_or_targets === "AND"
          //       ? Object.keys(cats[cat])
          //           .filter((form) => form !== "data")
          //           .some((form) =>
          //             filter_list(
          //               cats[cat][form].target,
          //               selected_targets,
          //               and_or_targets,
          //             ),
          //           )
          //       : filter_list(
          //           cats[cat].data.target,
          //           selected_targets,
          //           and_or_targets,
          //         ));

          //   return (
          //     rarity_condition &&
          //     against_condition &&
          //     ability_condition &&
          //     target_condition &&
          //     name_condition
          //   );
          // })
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
            <button
              key={index}
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

        <hr style={{ width: "100%", background: "silver" }} />

        <div style={{ display: "flex", gap: "10px" }}>
          <div style={subHeader}>Abilities</div>
          {set_and_or(and_or_abilities, set_and_or_abilities)}
        </div>
        <div style={flex_design}>
          {[
            ...new Set(
              abilities
                .filter((ability) => ability)
                .map((ability) => Object.keys(ability))
                .flat(),
            ),
          ].map((ability) => (
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
      {filtered_cats.slice(0, visibleCount)}
    </div>
  );
}

export default App;
