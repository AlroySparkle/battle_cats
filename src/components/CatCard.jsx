import { useEffect, useMemo, useState } from "react";
import { catStat, get_type } from "../assets/handle_cats";

/**
 * @typedef {"BAHAMUT" | "CRAZED" | "BASIC" | "RARE" | "SUPER"} CURVE_TYPES
 */

/**
 * @param {CURVE_TYPES} cat_scale_category
 */

function Card(params) {
  const cat = useMemo(
    () => ({
      ...params.cat,
      name: params.cat.name.replace("&amp;", "&").toUpperCase(),
      stats: params.cat.stats || {
        attCy: "0",
        hp: "0",
        att: "0",
        fore: "0",
        "Attack Type": "Single",
        kb: "0",
        range: "0",
        speed: "0",
        recharge: "0 ~ 0",
        cost: "0",
      },
      against: params.cat.against || ["no info"],
      abilities: params.cat.abilities || { "no info": "no info" },
    }),
    [params.cat],
  );
  const level = params.level;
  const memoStats = useMemo(() => {
    const damage = Math.round(
      catStat(
        cat.stats?.att?.replace(",", "") * 2.5 || 0,
        level,
        get_type(cat),
      ),
    );
    const health = Math.ceil(
      catStat(cat.stats?.hp?.replace(",", "") * 2.5 || 0, level, get_type(cat)),
    );
    const dps = Math.ceil(damage / (parseInt(cat.stats.attCy) / 30));

    return { damage, health, dps };
  }, [cat, level]);

  const stats = useMemo(
    () => [
      {
        icon: "./src/icons/stats/Sword.svg",
        title: "Damage",
        value: memoStats.damage,
      },
      {
        icon: "./src/icons/stats/Zap.svg",
        title: "DPS",
        value: memoStats.dps,
      },
      {
        icon: "./src/icons/stats/Heart (1).svg",
        title: "Health",
        value: memoStats.health,
      },
      {
        icon: "./src/icons/stats/Target Light.svg",
        title: "Range",
        value: cat.stats.range,
      },
      {
        icon: "./src/icons/stats/Film Reel Light.svg",
        title: "Animation Time",
        value: (parseInt(cat.stats.fore) / 30).toFixed(2),
      },
      {
        icon: "./src/icons/stats/Hourglass Empty.svg",
        title: "Time Between Attacks",
        value: (parseInt(cat.stats.attCy) / 30).toFixed(2),
      },
      {
        icon: "./src/icons/stats/coin.svg",
        title: "Cost",
        value: cat.stats.cost,
      },
      {
        icon: "./src/icons/stats/Clock Hour.svg",
        title: "Spawn Time",
        value: cat.stats.recharge.split("~ ")[1].replace(" seconds", "s"),
      },
      {
        icon: "./src/icons/stats/Boot Fill.svg",
        title: "Speed",
        value: cat.stats.speed,
      },
      {
        icon: "./src/icons/stats/Arrow Forward.svg",
        title: "Knockback",
        value: cat.stats.kb,
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
        background: "linear-gradient(to bottom,#e1e1e1,white,#e1e1e1)",
        gap: "10px",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "10px",
        }}
      >
        <h3
          style={{
            fontSize: "1.3rem",
            fontFamily: "sans-serif",
            flex: "5 0 auto",
            padding: "10px",
            borderRadius: "10px",
            border: "1px solid silver",
            margin: 0,
          }}
        >
          <div>{cat.name}</div>
        </h3>

        <h3
          style={{
            fontSize: "1.3rem",
            fontFamily: "sans-serif",
            flex: "1 0 auto",
            padding: "10px",
            borderRadius: "10px",
            border: "1px solid silver",
            margin: 0,
            textAlign: "center",
          }}
        >
          <div>
            {params.cat_index}-{params.form_index}
          </div>
        </h3>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          border: "1px solid silver",
          borderRadius: "10px",
          padding: "5px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <img
            width={"100rem"}
            src={
              "./src/characters/cats_display/" +
              cat.name.replace(/[/\\?%*:|"<>]/g, "") +
              ".png"
            }
          />
          <div
            style={{
              whiteSpace: "pre-line",
              marginLeft: "1rem",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            <a href={cat.desc_link} target="_blank" style={{ color: "black" }}>
              {cat.desc}
            </a>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: "10px",
          border: "1px solid silver",
          padding: "5px",
          borderRadius: "10px",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            fontSize: ".9rem",
            fontFamily: "sans-serif",
            textAlign: "center",
            fontWeight: "bold",
            marginBottom: "5px",
          }}
        >
          Stats
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            placeContent: "center",
            flex: "1 0 auto",
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
              <div>{catStat.value + ""}</div>
            </div>
          ))}
        </div>
      </div>

      {params.details ? (
        <div>
          {cat.general_info.split("u1").map((block, block_index) => (
            <div key={block_index}>
              {block.split("u2:").map((item, item_index) => (
                <div
                  key={item_index}
                  style={{
                    fontWeight: item_index % 2 == 0 ? "bold" : "normal",
                    fontSize: item_index % 2 == 0 ? "1.2rem" : "1rem",
                    display: "flex",
                    flexWrap: "wrap",
                  }}
                  index={item_index}
                >
                  {item_index % 2 == 0
                    ? item
                    : item.split("b2").map((ability, index) => (
                        <div
                          key={index}
                          style={{
                            fontWeight: index % 2 == 0 ? "bold" : "normal",
                          }}
                        >
                          {ability.replace("b1", "")}&nbsp;
                        </div>
                      ))}
                  <br />
                  <br />
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <>
          <div style={{ display: "flex", gap: "10px" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                border: "1px solid silver",
                borderRadius: "10px",
                padding: "10px",
              }}
            >
              <div
                style={{
                  fontSize: ".9rem",
                  fontFamily: "sans-serif",
                  textAlign: "center",
                  fontWeight: "bold",
                  marginBottom: "5px",
                }}
              >
                TARGET
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <img
                  alt={cat.stats["Attack Type"]}
                  title={cat.stats["Attack Type"]}
                  src={
                    "./src/icons/abilities/" + cat.stats["Attack Type"] + ".png"
                  }
                  width={"40rem"}
                  height={"40rem"}
                />
              </div>
            </div>
            <div
              style={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                border: "1px solid silver",
                borderRadius: "10px",
                padding: "10px",
              }}
            >
              <div
                style={{
                  fontSize: ".9rem",
                  fontFamily: "sans-serif",
                  textAlign: "center",
                  fontWeight: "bold",
                  marginBottom: "5px",
                }}
              >
                Against
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(10, 1fr)",
                  gap: "3px",
                }}
              >
                {cat.against.map((against) => (
                  <img
                    key={against}
                    title={against}
                    alt={against}
                    src={"./src/icons/traits/" + against + ".png"}
                    width={"100%"}
                  />
                ))}
              </div>
            </div>
          </div>
          <div
            style={{
              border: "1px solid silver",
              borderRadius: "10px",
              padding: "10px",
            }}
          >
            <div
              style={{
                fontSize: ".9rem",
                fontFamily: "sans-serif",
                textAlign: "center",
                fontWeight: "bold",
                marginBottom: "5px",
              }}
            >
              Abilities
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                minHeight: "50px",
                gap: "10px",
              }}
            >
              {Object.keys(cat.abilities).map((ability) => (
                <img
                  key={ability}
                  alt={ability}
                  title={cat.abilities[ability]}
                  src={"./src/icons/abilities/" + ability + ".png"}
                  height={"40rem"}
                  width={"40rem"}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function CatCard({ cats, cat_index, owned, set_owned }) {
  const [level, setLevel] = useState(30);

  useEffect(() => {
    if (owned[cat_index] && owned[cat_index] != level) {
      setLevel(owned[cat_index]);
    }
  }, [owned]);

  const [details, setDetails] = useState(false);
  const forms = Object.values(cats.units);
  const general = cats.general;
  return (
    <div className="card-container">
      <div
        style={{
          marginBottom: "10px",
          display: "flex",
          width: "fit-content",
          background: Object.keys(owned).includes(cat_index)
            ? undefined
            : "#ffbf00",
        }}
        className={
          (Object.keys(owned).includes(cat_index)
            ? "selected"
            : "not_selected") + " button"
        }
        onClick={() => {
          set_owned((prev) => {
            const new_owned = { ...prev };
            if (cat_index in new_owned) {
              delete new_owned[cat_index];
            } else {
              new_owned[cat_index] = level;
            }
            return new_owned;
          });
        }}
      >
        {Object.keys(owned).includes(cat_index) ? "owned" : "not owned"}
      </div>

      <div style={{ marginBottom: "10px", display: "flex" }}>
        {cats.general.rarity}&nbsp;
      </div>
      <div style={{ marginBottom: "10px", display: "flex" }}>
        <div style={{ fontWeight: "bold" }}>Level:&nbsp;</div>
        <input
          value={level}
          type="number"
          min={1}
          onChange={(e) => setLevel(Number(e.target.value))}
          style={{ width: "5ch" }}
        />
      </div>
      <div style={{ marginBottom: "10px", display: "flex" }}>
        <div
          style={{ fontWeight: "bold", color: details ? "#3399ff" : "black" }}
        >
          Details
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1rem",
          justifyItems: "center",
        }}
      >
        {forms.map((form, unit_index) => (
          <Card
            key={form.name}
            cat={form}
            level={level}
            cat_index={cat_index}
            form_index={unit_index + 1}
            details={details}
          />
        ))}
      </div>
      <div style={{ marginTop: "20px", display: "flex" }}>
        {general.evolve_data.length > 0 && (
          <div
            style={{
              fontWeight: "bold",
              fontSize: "1.5rem",
              fontWeight: "bold",
            }}
          >
            Evolution Requirements
          </div>
        )}
      </div>
      {general.evolve_data.length > 0 && (
        <div
          style={{
            display: "grid",
            gap: "10px",
            height: "10rem",
            gridTemplateColumns: "repeat(2, 1fr)",
            marginTop: "10px",
            borderRadius: "1rem",
            padding: "10px",
          }}
        >
          <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
            True Evolution
          </div>
          <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
            Ultra Evolution
          </div>

          {general.evolve_data.map(
            (evolve_items, index) =>
              Object.keys(evolve_items).length > 0 && (
                <div
                  key={index}
                  style={{
                    display: "grid",
                    borderRadius: "1rem",
                    background: "#d0d0d0",
                    border: "1px solid silver",
                    gridTemplateColumns: "repeat(5, 1fr)",
                    justifyItems: "center",
                    padding: "10px",
                  }}
                >
                  {Object.keys(evolve_items).map((evolve_item, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "10px",
                        border: "silver solid 1px",
                        padding: "10px",
                        borderRadius: "1rem",
                        width: "8rem",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#c5c5c5",
                      }}
                    >
                      <div>
                        {evolve_item == "undefined" ? (
                          ""
                        ) : (
                          <img
                            width={"70px"}
                            height={"70px"}
                            src={
                              "./src/icons/evolve_items/" + evolve_item + ".png"
                            }
                          />
                        )}
                      </div>
                      <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
                        {evolve_item == "undefined"
                          ? ""
                          : evolve_items[evolve_item]}
                      </div>
                    </div>
                  ))}
                </div>
              ),
          )}
        </div>
      )}
    </div>
  );
}
