import React from "react";
import "./Nav.css";
import kannaLogo from "../assets/kannaLogo.webp";

const Nav = ({ filled }) => {
  return (
    <header className={`nav ${filled ? "filled" : ""}`}>
      <img src={kannaLogo} alt="Kanna Logo" className="kanna-logo" />
    </header>
  );
};

export default Nav;
