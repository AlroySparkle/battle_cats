export function catStat(base, level, cat_scale_category) {
  if (cat_scale_category === "BAHAMUT" && level <= 30) {
    // Bahamut: +0.2 per level (1–30)
    return base * (1 + (level - 1) * 0.2);
  } else if (cat_scale_category === "BAHAMUT" && level > 30) {
    // Bahamut: +0.1 per level after 30
    return base * (1 + 29 * 0.2 + (level - 30) * 0.1);
  } else if (cat_scale_category === "CRAZED" && level <= 20) {
    // Crazed: +0.2 per level (1–20)
    return base * (1 + (level - 1) * 0.2);
  } else if (cat_scale_category === "CRAZED" && level > 20) {
    // Crazed: +0.1 per level after 20
    return base * (1 + 19 * 0.2 + (level - 20) * 0.1);
  } else if (cat_scale_category === "BASIC" && level <= 60) {
    // Basic/Special: +0.2 per level (1–60)
    return base * (1 + (level - 1) * 0.2);
  } else if (cat_scale_category === "BASIC" && level > 60) {
    // Basic/Special: +0.1 per level after 60
    return base * (1 + 59 * 0.2 + (level - 60) * 0.1);
  } else if (cat_scale_category === "RARE" && level <= 70) {
    // Rare: +0.2 per level (1–70)
    return base * (1 + (level - 1) * 0.2);
  } else if (cat_scale_category === "RARE" && level <= 90) {
    // Rare: +0.1 per level (71–90)
    return base * (1 + 69 * 0.2 + (level - 70) * 0.1);
  } else if (cat_scale_category === "RARE" && level > 90) {
    // Rare: +0.05 per level after 90
    return base * (1 + 69 * 0.2 + 20 * 0.1 + (level - 90) * 0.05);
  } else if (cat_scale_category === "SUPER" && level <= 60) {
    // Super/Uber/Legend: +0.2 per level (1–60)
    return base * (1 + (level - 1) * 0.2);
  } else if (cat_scale_category === "SUPER" && level <= 80) {
    // Super/Uber/Legend: +0.1 per level (61–80)
    return base * (1 + 59 * 0.2 + (level - 60) * 0.1);
  } else if (cat_scale_category === "SUPER" && level > 80) {
    // Super/Uber/Legend: +0.05 per level after 80
    return base * (1 + 59 * 0.2 + 20 * 0.1 + (level - 80) * 0.05);
  }
}

export const get_type = (cat) => {
  if (cat.iscrazed) {
    return "CRAZED";
  } else if (cat.name.toLowerCase().includes("bahamut")) {
    return "BAHAMUT";
  } else if (["Basic", "Special"].includes(cat.rarity)) {
    return "BASIC";
  } else if (cat.rarity === "Rare") {
    return "RARE";
  } else if (
    ["Super Rare", "Uber Super Rare", "Legend Rare"].includes(cat.rarity)
  ) {
    return "SUPER";
  }

  // Optional fallback if something unexpected appears
  return "BASIC";
};

export const get_cats_filter_elements = async (cats, key) => {
  const filtered_menu = Object.values(cats).flatMap((cat) => {
    return cat[key] ?? Object.values(cat).map((cat_data) => cat_data[key]);
  });

  return [...new Set(filtered_menu.flat())];
};

export const get_cats_list = async () => {
  const raw_data = await fetch("./src/characters/allcats.json");
  return await raw_data.json();
};

export const TRAIT_COLORS = {
  white: {
    background: "linear-gradient(to bottom, #FFFFFF, #F5F5F5)",
    hover: "linear-gradient(to bottom, #FFFFFF, #E8E8E8)",
    color: "#000000",
  },
  red: {
    background: "linear-gradient(to bottom, #FF4B4B, #FF7A7A)",
    hover: "linear-gradient(to bottom, #FF5F5F, #FF8A8A)",
    color: "#000000",
  },
  floating: {
    background: "linear-gradient(to bottom, #00FF7F, #66FFB2)",
    hover: "linear-gradient(to bottom, #33FF99, #80FFC2)",
    color: "#000000",
  },
  black: {
    background: "linear-gradient(to bottom, #000000, #444444)",
    hover: "linear-gradient(to bottom, #111111, #555555)",
    color: "#FFFFFF",
  },
  metal: {
    background: "linear-gradient(to bottom, #A8A8A8, #C8C8C8)",
    hover: "linear-gradient(to bottom, #B5B5B5, #D5D5D5)",
    color: "#000000",
  },
  angel: {
    background:
      "linear-gradient(to bottom, #FFFDF5 10%, #FFE766 15%, #FFFDF5 20%, #FFFDF5)",
    hover:
      "linear-gradient(to bottom, #FFFFFF 10%, #FFEFA0 15%, #FFFFFF 20%, #FFFFFF)",
    color: "#000000",
  },
  alien: {
    background: "linear-gradient(to bottom, #00DDFF, #66ECFF)",
    hover: "linear-gradient(to bottom, #22E6FF, #80F2FF)",
    color: "#000000",
  },
  zombie: {
    background: "linear-gradient(to bottom, #A102B6, #C44AD1)",
    hover: "linear-gradient(to bottom, #B312C6, #D05CDE)",
    color: "#FFFFFF",
  },
  relic: {
    background: "linear-gradient(to bottom, #006400, #228B22)",
    hover: "linear-gradient(to bottom, #007000, #2FAF2F)",
    color: "#FFFFFF",
  },
  aku: {
    background: "linear-gradient(to bottom, #00008B, #3333A3)",
    hover: "linear-gradient(to bottom, #000099, #4444B5)",
    color: "#FFFFFF",
  },
  all: {
    background: "linear-gradient(to bottom, #F2FF00, #FAFF66)",
    hover: "linear-gradient(to bottom, #F7FF33, #FDFF80)",
    color: "#000000",
  },
};
