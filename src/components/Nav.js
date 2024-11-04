import React from "react";
import "./Nav.css";
import kannaLogo from "../assets/kannaLogo.webp"; // 이미지 경로를 상대적으로 임포트

const Nav = ({ filled }) => {
  return (
    <nav className={`nav ${filled ? "filled" : ""}`}>
      <img src={kannaLogo} alt="Kanna Logo" className="kanna-logo" />
    </nav>
  );
};

export default Nav;
