import { useEffect, useState } from "react";
import { TRAIT_COLORS } from "../assets/handle_cats";

function Card(params) {
  function catStat(base, level, rarity = "uber") {
    let milestone1 = 60;
    if (rarity === "normal") milestone1 = 20;

    let multiplier = 1.0;

    for (let i = 2; i <= level; i++) {
      if (i <= milestone1) {
        multiplier += 0.2;
      } else if (i <= 80) {
        multiplier += 0.1;
      } else {
        multiplier += 0.05;
      }
    }
    return Math.round(base * multiplier) + base;
  }

  const cat = params.cat;
  const [level, setLevel] = useState(30);

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
      {Math.round(catStat(cat.damage, level))}
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
