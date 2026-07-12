import { memo, useEffect, useMemo, useState } from "react";
import { catStat, get_type } from "../assets/handle_cats";

/**
 * @typedef {"BAHAMUT" | "CRAZED" | "BASIC" | "RARE" | "SUPER"} CURVE_TYPES
 */

/**
 * @param {CURVE_TYPES} cat_scale_category
 */

const Card = memo(function Card(params) {
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
    const dps = Math.ceil(
      damage / (parseInt(cat.stats.attCy.replaceAll(",", "")) / 30),
    );

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
        value: (parseInt(cat.stats.fore.replaceAll(",", "")) / 30).toFixed(2),
      },
      {
        icon: "./src/icons/stats/Hourglass Empty.svg",
        title: "Time Between Attacks",
        value: (parseInt(cat.stats.attCy.replaceAll(",", "")) / 30).toFixed(2),
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
        border: "silver solid 3px",
        padding: "5px",
        borderRadius: "1rem",
        background: "#e1e1e1",
        gap: "10px",
        width: "100%",
        boxSizing: "border-box",
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
            background: "#F5F5F5",
            display: "block",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
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
            background: "#F5F5F5",
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
          background: "#F5F5F5",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
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
          background: "#F5F5F5",
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
              <div>
                {(catStat.value + "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: "1px solid silver",
            borderRadius: "10px",
            padding: "10px",
            background: "#F5F5F5",
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
              src={"./src/icons/abilities/" + cat.stats["Attack Type"] + ".png"}
              width={"30rem"}
              height={"30rem"}
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
            background: "#F5F5F5",
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
          background: "#F5F5F5",
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
              height={"30rem"}
              width={"30rem"}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

const CatCard = memo(function CatCard({ cats, cat_index, owned, set_owned }) {
  const [level, setLevel] = useState(30);

  useEffect(() => {
    if (owned[cat_index] && owned[cat_index] != level) {
      setLevel(owned[cat_index]);
    }
  }, [owned]);

  const forms = Object.values(cats.units);
  const general = cats.general;
  return (
    <div
      className="card-container"
      style={{ gap: "10px", display: "flex", flexDirection: "column" }}
    >
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <div
          style={{
            display: "flex",
            padding: "10px",
            border: "solid silver 1px",
            width: "fit-content",
            borderRadius: "5px",
            background: "#f5f5f5",
            fontWeight: "bold",
          }}
        >
          {cats.general.rarity.toUpperCase()}
        </div>
        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <div style={{ fontWeight: "bold" }}>Level:&nbsp;</div>
          <input
            value={level}
            type="number"
            min={1}
            onChange={(e) => setLevel(Number(e.target.value))}
            style={{ width: "5ch", height: "1.5rem", fontSize: "1rem" }}
          />
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
          />
        ))}
        {Array(4 - forms.length)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              style={{
                width: "100%",
                height: "100%",
                background: "#e1e1e1",
                borderRadius: "10px",
                border: "3px solid silver",
                boxSizing: "border-box",
              }}
            ></div>
          ))}
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
      <div
        style={{
          fontWeight: "bold",
          display: "flex",
          width: "fit-content",
          background: Object.keys(owned).includes(cat_index) ? "" : "#f5f5f5",
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
        {cat_index in owned ? "OWNED" : "NOT OWNED"}
      </div>
    </div>
  );
});

export default CatCard;
