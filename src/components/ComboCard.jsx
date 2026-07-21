import React, { useState, useEffect } from "react";
import { get_cats_list } from "../assets/handle_cats";

export default function ComboCard(params) {
  const combo_data = params.combo_data;

  return (
    <div
      className="catCard"
      style={{
        display: "flex",
        flexDirection: "column",
        border: "silver solid 1px",
        padding: "5px",
        flex: "1 0 auto",
        borderRadius: "1rem",
        background: "linear-gradient(to bottom,#e1e1e1,white,#e1e1e1)",
        maxWidth: "30rem",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3 style={{ fontSize: "1rem", fontFamily: "sans-serif" }}>
          {combo_data.effect}
        </h3>
        <h3 style={{ fontSize: "1rem", fontFamily: "sans-serif" }}>
          {combo_data.boost_level + "-" + (params.index + 1)}
        </h3>
      </div>
      <hr style={{ width: "100%", background: "silver" }} />
      <h3
        style={{
          fontSize: "1rem",
          fontFamily: "sans-serif",
          textAlign: "center",
        }}
      >
        {combo_data.name}
      </h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "10px",
        }}
      >
        {combo_data.cats.map((cat, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img
              style={{ width: "5rem" }}
              src={"./src/characters/cats_display/" + cat + ".png"}
              title={cat}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
