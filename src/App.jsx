import { useEffect, useState } from "react";
import "./App.css";
import { get_cats_list, TRAIT_COLORS } from "./assets/handle_cats";
import CatCard from "./components/CatCard";

function App() {
  const [cats, set_cats] = useState({});
  const [filtered_cats, set_filtered_cats] = useState([]);
  useEffect(() => {
    const initiate_list = async () => {
      const cats_list = await get_cats_list();
      set_cats(cats_list);
    };
    initiate_list();
  }, []);

  useEffect(() => {
    set_filtered_cats(
      Object.keys(cats)
        .sort((a, b) => {
          return parseInt(a) - parseInt(b);
        })
        .map((cat) => <CatCard cats={cats[cat]} />),
    );
  }, [cats]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {filtered_cats}
    </div>
  );
}

export default App;
