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
    return new_list;
  }, {});
  return serve_list_cats;
};
