import { useState } from "react";
import "./App.css";
import ComboContainer from "@/components/ComboContainer";
import CatContainer from "@/components/CatContainer";

function App() {
  const [display, setDisplay] = useState(<CatContainer />);

  return display;
}

export default App;
