import { useEffect, useState } from "react";
import { TRAIT_COLORS } from "../assets/handle_cats";
export default function CatCard(params) {
  const cats = params.cats;
  const [cats_list, set_cat_lists] = useState([]);
  useEffect(() => {
    set_cat_lists(
      ["Normal", "Evolved", "True", "Ultra"]
        .filter((form) => cats[form])
        .map((form, index) => (
          <div
            key={form}
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
              {cats[form].name} <br />{" "}
              <div style={{ fontSize: ".8rem" }}>{cats[form].rarity}</div>
            </h3>

            <div style={{ display: "flex", gap: "10px" }}>
              {cats[form].target.map((target) => (
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
              {cats[form].against.length > 0
                ? cats[form].against.map((against) => (
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
              {cats[form].abilities.length > 0
                ? cats[form].abilities.map((ability) => (
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
        )),
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
