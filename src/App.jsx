import { useEffect } from "react";
import "./App.css";
import { get_cats_list } from "./assets/handle_cats";

function App() {
  useEffect(() => {
    const test = async () => {
      const cats = await get_cats_list();
      console.log(cats);
    };
    test();
  }, []);
  return <></>;
}

export default App;
