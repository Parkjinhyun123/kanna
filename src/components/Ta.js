import React, { useState, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import "./Ta.css";
import Logo from "../assets/stellogo.png";

const Ta = ({ onLogoClick, moveUp }) => {
  const [showAnimation, setShowAnimation] = useState(true);
  const [clicked, setClicked] = useState(false); // 클릭 상태 추가
  const nodeRef = useRef(null);

  const handleLogoClick = () => {
    if (typeof onLogoClick === "function") {
      setClicked(true); // 클릭 상태 변경
      onLogoClick(); // 부모 컴포넌트의 클릭 핸들러 호출
    }
  };

  return (
    <div className="app">
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
