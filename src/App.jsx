import { useState } from "react";
import "./App.css";
import ComboContainer from "@/components/ComboContainer";
import CatContainer from "@/components/CatContainer";
import EnemyContainer from "./components/EnemyContainer";

function App() {
  const pages = [
    { title: "Cats Dictionary", page: <CatContainer /> },
    { title: "Combo Library", page: <ComboContainer /> },
    { title: "Enemy Bestiary", page: <EnemyContainer /> },
  ];
  const [display, set_display] = useState(pages[0].page);
  const [selected_page, set_selected_page] = useState(pages[0].title);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifySelf: "center",
          margin: "10px",
          width: "50%",
          minWidth: "50rem",
          padding: "10px",
          gap: "10px",
        }}
        className="card-container"
      >
        {pages.map((page) => (
          <div
            key={page.title}
            style={{
              fontWeight: "bold",
              fontSize: "1.2rem",
              flex: "1 0 auto",
              background:
                page.title == selected_page
                  ? "linear-gradient(to bottom, #3399ff, #1a8cff, #3399ff)"
                  : "linear-gradient(to bottom,#e1e1e1,white,#e1e1e1)",
              textAlign: "center",
            }}
            className="button"
            onClick={() => {
              set_selected_page(page.title);
              set_display(page.page);
            }}
          >
            {page.title}
          </div>
        ))}
      </div>
      {display}
    </>
  );
}

export default App;
