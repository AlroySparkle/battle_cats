export const get_cats_list = async () => {
  const raw_data = await fetch("./src/characters/allcats.json");
  const cats = await raw_data.json().then((cats) => cats.sampledata);
  const serve_list_cats = await cats.reduce((cats, current_cat) => {
    const new_list = { ...cats };
    const cat_key = current_cat.key.split("-")[0];
    if (!cats[cat_key]) {
      new_list[cat_key] = {};
    }
    const catAgainst = get_cat_against(current_cat);
    const catTargets = get_cat_targets(current_cat);
    const catAbilities = get_cat_abilities(current_cat)
      .filter(
        (ability) =>
          !catAgainst.includes(ability) && ability != "Multi-hit attack",
      )
      .map((ability) => ability.replace("-", " "));

    const identifiedCat = {
      ...current_cat,
      against: catAgainst,
      target: catTargets,
      abilities: catAbilities,
    };
    if (!new_list[cat_key]["data"]) {
      new_list[cat_key]["data"] = {
        against: [],
        target: [],
        abilities: [],
      };
    }
    new_list[cat_key]["data"] = {
      against: [
        ...new Set([...new_list[cat_key]["data"].against, ...catAgainst]),
      ],
      target: [
        ...new Set([...new_list[cat_key]["data"].target, ...catTargets]),
      ],
      abilities: [
        ...new Set([...new_list[cat_key]["data"].abilities, ...catAbilities]),
      ],
    };
    new_list[cat_key][current_cat.form] = identifiedCat;
    return new_list;
  }, {});
  return serve_list_cats;
};

const get_cat_abilities = (cat) => {
  const abilities = [];
  const raw_abilities = cat.ability.split("u2");

  if (raw_abilities.length > 1) {
    for (
      let block_index = 1;
      block_index < raw_abilities.length;
      block_index++
    ) {
      if (raw_abilities[block_index].toLowerCase().includes("attacks only")) {
        abilities.push("Attacks Only");
        continue;
      }
      const splited_abilities = raw_abilities[block_index].split("b1");
      for (
        let ability_index = 1;
        ability_index < splited_abilities.length;
        ability_index++
      ) {
        const abilityName = splited_abilities[ability_index]
          .split("b2")[0]
          .trim();
        const isImmunity =
          raw_abilities[block_index - 1].includes("Not affected by");
        abilities.push(abilityName + (isImmunity ? " immunity" : ""));
      }
    }
  }

  return abilities;
};

const get_cat_targets = (cat) => {
  const target = [cat.target];
  if (cat.ability && cat.ability.includes("Multi-hit")) {
    target.push("Multi-hit");
  }
  if (cat.ability && cat.ability.includes("Long Distance")) {
    target.push("Long Distance");
  }
  if (cat.ability && cat.ability.includes("Omni Strike")) {
    target.push("Omni Strike");
  }
  return target;
};

const get_cat_against = (cat) => {
  if (cat.ability && cat.ability.includes("Against")) {
    const index = cat.ability.indexOf("Against");
    const raw_ability = cat.ability.slice(
      index + "Against".length,
      cat.ability.length,
    );
    const end_against = raw_ability.indexOf("u2");
    const block_against = raw_ability
      .slice(1, end_against)
      .split(" ")
      .map((trait) => trait.replace(",", ""));
    return block_against;
  }
  return [];
};

export const TRAIT_COLORS = {
  white: {
    bg: "#CFCFCF",
    text: "#000000", // light bg → black text
  },
  red: {
    bg: "#FF4B4B",
    text: "#000000", // bright red → black text
  },
  floating: {
    bg: "#00FF7F",
    text: "#000000", // bright green → black text
  },
  black: {
    bg: "#000000",
    text: "#FFFFFF", // black bg → white text
  },
  metal: {
    bg: "#A8A8A8",
    text: "#000000", // light gray → black text
  },
  angel: {
    bg: "#FFFFFF",
    text: "#000000", // white bg → black text
  },
  alien: {
    bg: "#00ddff",
    text: "#000000", // bright blue → black text
  },
  zombie: {
    bg: "#a102b6",
    text: "#FFFFFF", // strong purple → white text
  },
  relic: {
    bg: "#006400",
    text: "#FFFFFF", // dark green → white text
  },
  aku: {
    bg: "#00008B",
    text: "#FFFFFF", // dark blue → white text
  },
  all: {
    bg: "#f2ff00",
    text: "#000000", // dark blue → white text
  },
};
