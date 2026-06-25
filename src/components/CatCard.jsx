import { useEffect, useMemo, useState } from "react";
import { catStat, get_type, TRAIT_COLORS } from "../assets/handle_cats";

/**
 * @typedef {"BAHAMUT" | "CRAZED" | "BASIC" | "RARE" | "SUPER"} CURVE_TYPES
 */

/**
 * @param {CURVE_TYPES} cat_scale_category
 */

function Card(params) {
  const cat = params.cat;
  const [level, setLevel] = useState(30);

  const memoStats = useMemo(() => {
    const damage = Math.round(catStat(cat.damage, level, get_type(cat)));
    const health = Math.ceil(catStat(cat.health, level, get_type(cat)));
    const dps = Math.ceil(
      damage / (parseFloat(cat.anim) + parseFloat(cat.tba)),
    );

    return { damage, health, dps };
  }, [cat, level]);

  const stats = useMemo(
    () => [
      {
        icon: "./src/icons/Sword.svg",
        title: "Damage",
        value: memoStats.damage,
      },
      {
        icon: "./src/icons/Zap.svg",
        title: "DPS",
        value: memoStats.dps,
      },
      {
        icon: "./src/icons/Heart (1).svg",
        title: "Health",
        value: memoStats.health,
      },
      {
        icon: "./src/icons/Target Light.svg",
        title: "Range",
        value: cat.range,
      },
      {
        icon: "./src/icons/Film Reel Light.svg",
        title: "Animation Time",
        value: cat.anim,
      },
      {
        icon: "./src/icons/Hourglass Empty.svg",
        title: "Time Between Attacks",
        value: cat.tba,
      },
      {
        icon: "./src/icons/coin.svg",
        title: "Cost",
        value: cat.cost,
      },
      {
        icon: "./src/icons/Clock Hour.svg",
        title: "Spawn Time",
        value: cat.spawn,
      },
      {
        icon: "./src/icons/Boot Fill.svg",
        title: "Speed",
        value: cat.speed,
      },
      {
        icon: "./src/icons/Arrow Forward.svg",
        title: "Knockback",
        value: cat.kb,
      },
    ],
    [memoStats, cat],
  );

  return (
    <div
      className="catCard"
      style={{
        display: "flex",
        flexDirection: "column",
        border: "silver solid 1px",
        padding: "5px",
        borderRadius: "1rem",
        maxWidth: "30rem",
        width: "95%",
      }}
    >
      <h3 style={{ fontSize: "1rem", fontFamily: "sans-serif" }}>
        {cat.name} <br /> <div style={{ fontSize: ".8rem" }}>{cat.rarity}</div>
      </h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "10px",
        }}
      >
        {stats.map((catStat, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img src={catStat.icon} title={catStat.title} />
            <div>{catStat.value}</div>
          </div>
        ))}
      </div>
      <input
        value={level}
        type="number"
        min={1}
        onChange={(e) => {
          setLevel(e.target.value);
        }}
      />
      <div style={{ display: "flex", gap: "10px" }}>
        {cat.target.map((target) => (
          <img
            key={target}
            alt={target}
            title={target}
            src={"./src/icons/" + target + ".png"}
            width={"40rem"}
            height={"40rem"}
          />
        ))}
      </div>
      <hr style={{ width: "100%", background: "silver" }} />
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "5px",
        }}
      >
        {cat.against.length > 0
          ? cat.against.map((against) => (
              <div
                key={against}
                style={{
                  background: TRAIT_COLORS[against]
                    ? TRAIT_COLORS[against].background
                    : "white",
                  color: TRAIT_COLORS[against]
                    ? TRAIT_COLORS[against].color
                    : "black",
                  padding: "5px 10px",
                  borderRadius: "1rem",
                  border: "1px solid black",
                }}
              >
                {against}
              </div>
            ))
          : "none"}
      </div>
      <hr style={{ width: "100%" }} />
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        {cat.abilities.length > 0
          ? cat.abilities.map((ability) => (
              <img
                key={ability}
                alt={ability}
                title={ability}
                src={"./src/icons/" + ability + ".png"}
                height={"40rem"}
                width={"40rem"}
              />
            ))
          : "none"}
      </div>
    </div>
  );
}

export default function CatCard(params) {
  const cats = params.cats;
  const [cats_list, set_cat_lists] = useState([]);
  useEffect(() => {
    set_cat_lists(
      ["Normal", "Evolved", "True", "Ultra"]
        .filter((form) => cats[form])
        .map((form, index) => <Card cat={cats[form]} key={form} />),
    );
  }, []);
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "1rem",
        justifyItems: "center",
      }}
    >
      {cats_list}
    </div>
  );
}
