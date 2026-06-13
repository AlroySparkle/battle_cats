export const get_cats_list = async () => {
  const raw_data = await fetch("./src/characters/allcats.json");
  const cats = await raw_data.json().then((cats) => cats.sampledata);
  console.log(cats);
  const serve_list_cats = await cats.reduce((cats, current_cat) => {
    const new_list = { ...cats };
    const cat_key = current_cat.key.split("-")[0];
    if (!cats[cat_key]) {
      new_list[cat_key] = {};
    }
    new_list[cat_key][current_cat.form] = current_cat;
    new_list[cat_key][current_cat.form].against = get_cat_against(current_cat);
    new_list[cat_key][current_cat.form].target = get_cat_targets(current_cat);
    new_list[cat_key][current_cat.form].abilities =
      get_cat_abilities(current_cat);
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
  if (cat.ability && cat.ability.includes("Against") != -1) {
    const index = cat.ability.indexOf("Against");
    const raw_ability = cat.ability.slice(
      index + "Against".length,
      cat.ability.length,
    );
    const end_against = raw_ability.indexOf("u2");
    const block_against = raw_ability.slice(1, end_against).split(" ");
    return block_against;
  }
  return [];
};
