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
        .map((form, index) => (
          <div
            key={form}
            style={{
              display: "flex",
              flexDirection: "column",
              border: "black solid 2px",
              padding: "10px",
              borderRadius: "1rem",
              maxWidth: "30rem",
              width: "90%",
            }}
          >
            <h3>{cats[form].name}</h3>
            {cats[form].target.map((target) => (
              <div
                key={target}
                className="target"
                style={{
                  padding: "5px 10px",
                  borderRadius: "1rem",
                  border: "1px solid black",
                }}
              >
                <img
                  src={"./src/icons/" + target + ".png"}
                  width={"35rem"}
                  height={"35rem"}
                />
                {target}
              </div>
            ))}
            <hr style={{ width: "100%" }} />
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
              {cats[form].abilities.length > 0
                ? cats[form].abilities.map((ability) => (
                    <div
                      key={ability}
                      className="ability"
                      style={{
                        padding: "5px 10px",
                        borderRadius: "1rem",
                        border: "1px solid black",
                      }}
                    >
                      <img
                        src={"./src/icons/" + ability + ".png"}
                        height={"35rem"}
                        width={"35rem"}
                      />
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
