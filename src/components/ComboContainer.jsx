import React, { useEffect, useState } from "react";
import { get_cats_list } from "../assets/handle_cats";
import ComboCard from "@/components/ComboCard";

export default function ComboContainer() {
  const [combo_list, set_combo_list] = useState([]);
  useEffect(() => {
    const get_combos = async () => {
      const cats_lists = await get_cats_list();
      set_combo_list(cats_lists.collections.combos);
    };
    get_combos();
  }, []);
  useEffect(() => {
    console.log(combo_list);
  }, [combo_list]);
  return (
    <div
      className="card-container"
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        justifyContent: "center",
      }}
    >
      {combo_list.map((combo) => (
        <ComboCard combo_data={combo} key={combo.name} />
      ))}
    </div>
  );
}
