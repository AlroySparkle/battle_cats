import { useEffect, useState } from "react";
import { TRAIT_COLORS } from "../assets/handle_cats";
export default function CatCard(params) {
  const cats = params.cats;
  const [cats_list, set_cat_lists] = useState([]);
  useEffect(() => {
    console.log(cats);
    set_cat_lists(
      ["Normal", "Evolved", "True", "Ultra"]
        .filter((form) => cats[form])
        .map((cat) => (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              border: "black solid 2px",
              padding: "10px",
              borderRadius: "1rem",
              minWidth: "10rem",
              maxWidth: "20rem",
            }}
          >
            <h3>{cats[cat].name}</h3>
            <hr style={{ width: "100%" }} />
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "5px",
              }}
            >
              {cats[cat].against.length > 0
                ? cats[cat].against.map((against) => (
                    <div
                      style={{
                        background: TRAIT_COLORS[against]
                          ? TRAIT_COLORS[against].bg
                          : "white",
                        color: TRAIT_COLORS[against]
                          ? TRAIT_COLORS[against].text
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
                gap: "5px",
              }}
            >
              {cats[cat].abilities.length > 0
                ? cats[cat].abilities.map((ability) => (
                    <div
                      style={{
                        padding: "5px 10px",
                        borderRadius: "1rem",
                        border: "1px solid black",
                      }}
                    >
                      {ability}
                    </div>
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
        gridTemplateColumns: "25% 25% 25% 25%",
        gap: "1rem",
        justifyContent: "center",
      }}
    >
      {cats_list}
    </div>
  );
}
