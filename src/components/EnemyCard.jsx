import { useEffect, useState } from "react";

export default function EnemyCard(params) {
  const enemy = params.enemy;
  const [percentage, set_percentage] = useState(100);
  // Guard against initial loading state
  if (!enemy) return null;

  // Calculate scaled stats dynamically on render based on the input percentage
  const scaledDamage = Math.round((enemy.damage || 0) * (percentage / 100));
  const scaledHealth = Math.round((enemy.health || 0) * (percentage / 100));

  // Helper function to convert raw frame strings (e.g., "47f") to seconds formatted to 2 decimals
  const formatFrames = (frameString) => {
    if (!frameString) return "0.00s";
    const frames = parseInt(frameString, 10);
    return isNaN(frames) ? "0.00s" : (frames / 30).toFixed(2) + "s";
  };

  // Calculate DPS dynamically (Damage / (Attack Frequency Frames / 30))
  const calculateDPS = () => {
    const frames = parseInt(enemy?.attack_frequence, 10);
    if (!frames || isNaN(frames) || frames === 0) return 0;
    const attackPeriodSeconds = frames / 30;
    return Math.round(scaledDamage / attackPeriodSeconds);
  };

  const stats = [
    {
      icon: "./src/icons/stats/Sword.svg",
      title: "Damage",
      // formats e.g. 150000 -> "150,000"
      value: scaledDamage.toLocaleString(),
    },
    {
      icon: "./src/icons/stats/Zap.svg",
      title: "DPS",
      value: calculateDPS().toLocaleString(),
    },
    {
      icon: "./src/icons/stats/Heart (1).svg",
      title: "Health",
      value: scaledHealth.toLocaleString(),
    },
    {
      icon: "./src/icons/stats/Target Light.svg",
      title: "Range",
      value: enemy?.range,
    },
    {
      icon: "./src/icons/stats/Film Reel Light.svg",
      title: "Animation Time",
      value: formatFrames(enemy?.attack_animation),
    },
    {
      icon: "./src/icons/stats/Hourglass Empty.svg",
      title: "Time Between Attacks",
      value: formatFrames(enemy?.attack_frequence),
    },
    {
      icon: "./src/icons/stats/coin.svg",
      title: "Drop",
      value: enemy?.drop?.toLocaleString().split(" ~ ")[1] || enemy?.drop,
    },
    {
      icon: "./src/icons/stats/Boot Fill.svg",
      title: "Speed",
      value: enemy?.movement,
    },
    {
      icon: "./src/icons/stats/Arrow Forward.svg",
      title: "Knockback",
      value: enemy?.kb,
    },
  ];

  return (
    <div
      className="catCard"
      style={{
        display: "flex",
        flexDirection: "column",
        border: "silver solid 1px",
        padding: "5px",
        borderRadius: "1rem",
        maxWidth: "25rem",
        width: "95%",
        background: "linear-gradient(to bottom,#e1e1e1,white,#e1e1e1)",
      }}
    >
      {/* Top Header Layout: Title on left, Strength input on the right side */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h3 style={{ fontSize: "1rem", fontFamily: "sans-serif" }}>
          <div>{enemy.name}</div>
        </h3>

        <img
          width={"50rem"}
          title={enemy.name}
          alt={enemy.name}
          src={
            "./src/characters/enemies_display/" +
            enemy.name.replace(/[/\\?%*:|"<>]/g, "") +
            ".png"
          }
        />
      </div>

      <hr style={{ width: "100%", background: "silver" }} />

      {/* Centered raw stats section title */}
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

      {/* 5-Column layout grid containing custom element first, then standard data */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "10px",
        }}
      >
        {/* First Item: Pure text element displaying current strength calculation base */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              color: "gray",
              fontSize: "0.75rem",
              fontFamily: "sans-serif",
              fontWeight: "bold",
            }}
          >
            strength
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {percentage.toLocaleString()}%
          </div>
        </div>

        {/* Mapped fields completing rows 2 through 5 */}
        {stats.map((enemyStat, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img src={enemyStat.icon} title={enemyStat.title} />
            <div>{enemyStat.value + ""}</div>
          </div>
        ))}
      </div>
      <hr style={{ width: "100%", background: "silver" }} />
      <h3 style={{ fontSize: "1rem", fontFamily: "sans-serif", margin: 0 }}>
        <div
          style={{
            fontSize: ".9rem",
            fontFamily: "sans-serif",
            textAlign: "center",
            fontWeight: "bold",
            marginBottom: "5px",
          }}
        >
          traits
        </div>
      </h3>
      <div
        style={{
          display: "flex",
          gap: "10px",
          minHeight: "40px",
          flexWrap: "wrap",
        }}
      >
        {enemy.traits.map((trait) => (
          <img
            key={trait}
            src={"./src/icons/traits/" + trait + ".png"}
            alt={trait}
            title={trait}
            width={"40rem"}
          />
        ))}
      </div>

      <hr style={{ width: "100%", background: "silver" }} />
      <h3 style={{ fontSize: "1rem", fontFamily: "sans-serif", margin: 0 }}>
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
      </h3>
      <div
        style={{
          display: "flex",
          gap: "10px",
          minHeight: "40px",
          flexWrap: "wrap",
        }}
      >
        {Object.keys(enemy.special_abilities).map((ability) => (
          <img
            key={ability}
            src={"./src/icons/abilities/" + ability + ".png"}
            alt={ability}
            title={enemy.special_abilities[ability]}
            width={"40rem"}
          />
        ))}
      </div>

      <hr style={{ width: "100%", background: "silver" }} />
      <div
        style={{
          fontSize: ".9rem",
          fontFamily: "sans-serif",
          textAlign: "center",
          fontWeight: "bold",
          marginBottom: "5px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>Strength</div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            alignSelf: "center",
            marginBottom: "10px",
          }}
        >
          <span
            style={{
              color: "gray",
              fontSize: "0.75rem",
              fontFamily: "sans-serif",
              fontWeight: "bold",
            }}
          >
            strength:
          </span>
          <input
            type="number"
            value={percentage}
            onChange={(e) => set_percentage(Number(e.target.value) || 0)}
            style={{
              width: "5rem",
              textAlign: "right",
              borderRadius: "3px",
              border: "1px solid silver",
              padding: "1px",
            }}
          />
          <span style={{ fontSize: "0.8rem", fontFamily: "sans-serif" }}>
            %
          </span>
        </div>
      </div>
    </div>
  );
}
