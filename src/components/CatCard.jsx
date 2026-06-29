import { useMemo, useState } from "react";
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
      name: params.cat.name.replace("&amp;", "&"),
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
        maxWidth: "30rem",
        width: "95%",
        background: "linear-gradient(to bottom,#e1e1e1,white,#e1e1e1)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3 style={{ fontSize: "1rem", fontFamily: "sans-serif" }}>
          <div>{cat.name}</div>
          <img
            width={"70rem"}
            src={"./src/characters/cats_display/" + cat.name + ".png"}
          />
        </h3>

        <h3 style={{ fontSize: "1rem", fontFamily: "sans-serif" }}>
          {params.cat_index}-{params.form_index}
        </h3>
      </div>
      <hr style={{ width: "100%", background: "silver" }} />
      <div
        style={{
          fontSize: ".9rem",
          fontFamily: "sans-serif",
          textAlign: "center",
          fontWeight: "bold",
          marginBottom: "5px",
        }}
      >
        stats
      </div>
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
            <div>{catStat.value + ""}</div>
          </div>
        ))}
      </div>
      <hr style={{ width: "100%", background: "silver" }} />

      {params.details ? (
        <div>
          {cat.general_info.split("u1").map((block, block_index) => (
            <div key={block_index}>
              {block.split("u2:").map((item, item_index) => (
                <div
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
          <div
            style={{
              fontSize: ".9rem",
              fontFamily: "sans-serif",
              textAlign: "center",
              fontWeight: "bold",
              marginBottom: "5px",
            }}
          >
            attack type
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <img
              alt={cat.stats["Attack Type"]}
              title={cat.stats["Attack Type"]}
              src={"./src/icons/abilities/" + cat.stats["Attack Type"] + ".png"}
              width={"40rem"}
              height={"40rem"}
            />
          </div>
          <hr style={{ width: "100%", background: "silver" }} />
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
              display: "flex",
              flexWrap: "wrap",
              gap: "5px",
            }}
          >
            {cat.against.length > 0
              ? cat.against.map((against) => (
                  <img
                    key={against}
                    title={against}
                    alt={against}
                    src={"./src/icons/traits/" + against + ".png"}
                    width={"40rem"}
                  />
                ))
              : "none"}
          </div>
          <hr style={{ width: "100%" }} />
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
              gap: "10px",
            }}
          >
            {Object.keys(cat.abilities).length > 0
              ? Object.keys(cat.abilities).map((ability) => (
                  <img
                    key={ability}
                    alt={ability}
                    title={cat.abilities[ability]}
                    src={"./src/icons/abilities/" + ability + ".png"}
                    height={"40rem"}
                    width={"40rem"}
                  />
                ))
              : "none"}
          </div>
        </>
      )}
    </div>
  );
}

export default function CatCard({ cats, cat_index }) {
  const [level, setLevel] = useState(30);
  const [details, setDetails] = useState(false);
  const forms = Object.values(cats.units);
  return (
    <div
      style={{
        borderRadius: "1rem",
        border: "1px solid silver",
        padding: "10px",
        background: "linear-gradient(45deg,#ffbf00,#ffdc73)",
      }}
    >
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
          onClick={() => {
            setDetails((prev) => !prev);
          }}
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
    </div>
  );
}
