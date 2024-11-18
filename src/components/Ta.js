import React, { useState, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import "./Ta.css";
import Logo from "../assets/하양 로고.png";

const Ta = ({ onLogoClick, moveUp }) => {
  const [showAnimation, setShowAnimation] = useState(true);
  const [clicked, setClicked] = useState(false);
  const nodeRef = useRef(null);

  const handleLogoClick = () => {
    if (typeof onLogoClick === "function") {
      setClicked(true);
      onLogoClick();
    }
  };

  return (
    <div className="ta-container">
      <div className={`navBackground ${moveUp ? "move-up" : ""}`}></div>
      <CSSTransition
        nodeRef={nodeRef}
        in={showAnimation}
        timeout={1000}
        classNames="fade"
      >
        <div
          ref={nodeRef}
          className="animation-container"
          onClick={handleLogoClick}
        >
          <img
            src={Logo}
            alt="Animation"
            className={`animated-image ${clicked ? "clicked" : ""}`}
            style={{ cursor: "pointer" }}
          />
        </div>
      </CSSTransition>
    </div>
  );
};

export default Ta;
