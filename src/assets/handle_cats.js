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

export const get_cats_list = async () => {
  const raw_data = await fetch("./src/characters/allcats.json");
  return await raw_data.json();
};
