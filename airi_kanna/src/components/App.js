import React, { useState, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import Ta from "./Ta";
import Nav from "./Nav";
import "./App.css";
import Uroko from "../assets/테스트비늘이.png";

const audioFiles = ["/Sound/반갑꼬리.mp3"];

function App() {
  const [currentAudio, setCurrentAudio] = useState("");
  const audioInstanceRef = useRef(null);
  const [shuffledFiles, setShuffledFiles] = useState(audioFiles);
  const [showTa, setShowTa] = useState(true);
  const [navVisible, setNavVisible] = useState(false);
  const [navFilled, setNavFilled] = useState(false);
  const [showText, setShowText] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [showButton, setShowButton] = useState(false);
  const [showThirdText, setShowThirdText] = useState(false);
  const [showBackground, setShowBackground] = useState(false);

  const firstText = "어서와! \n 우리의 첫번째 오시!";
  const secondText =
    "우리 비늘이들도 \n 칸나에게 해주고 싶은 \n 이야기가 많아! \n\n 들어줄래?"; // "들어줄래?" 앞에 줄 바꿈 추가
  const thirdTextContent = "고마워! \n 그럼 출발하자!";

  const playRandomAudio = () => {
    if (shuffledFiles.length === 0) {
      setShuffledFiles(audioFiles);
    }
    const selectedAudio =
      shuffledFiles[Math.floor(Math.random() * shuffledFiles.length)];
    setCurrentAudio(selectedAudio);
  };

  const handleTaLogoClick = () => {
    setNavVisible(true);
    playRandomAudio();
    setShowText(true);
    setTypedText("");

    typeText(firstText, () => {
      setTimeout(() => {
        typeText(secondText, () => {
          setShowButton(true);
        });
      }, 500);
    });

    setShowTa(false);
  };

  const typeText = (text, callback) => {
    let index = 0;
    setTypedText("");
    const typingInterval = setInterval(() => {
      if (index < text.length) {
        setTypedText((prev) => prev + text[index]);
        index++;
      } else {
        clearInterval(typingInterval);
        if (callback) callback();
      }
    }, 100);
  };

  const handleImageClick = () => {
    setShowThirdText(true);
    setTypedText(thirdTextContent);
    typeText(thirdTextContent, () => {
      setTimeout(() => {
        setShowBackground(true);
        setShowButton(false);
        setShowThirdText(false);
        setNavFilled(true);
      }, 500);
    });
  };

  useEffect(() => {
    if (audioInstanceRef.current) {
      audioInstanceRef.current.pause();
      audioInstanceRef.current.src = "";
    }

    if (currentAudio) {
      const newAudioInstance = new Audio(currentAudio);
      newAudioInstance.volume = 0.3;
      audioInstanceRef.current = newAudioInstance;
      newAudioInstance.play();
    }

    return () => {
      if (audioInstanceRef.current) {
        audioInstanceRef.current.pause();
      }
    };
  }, [currentAudio]);

  return (
    <div className="App">
      <div className={`background ${showBackground ? "move-up" : ""}`}></div>
      {showTa && <Ta onLogoClick={handleTaLogoClick} />}
      {showText && (
        <div
          className={`text ${showText ? "show" : ""}`}
          style={{ whiteSpace: "pre-line" }}
        >
          {typedText}
        </div>
      )}
      {showButton && (
        <div className="button-container">
          <img
            src={Uroko}
            alt="Button"
            className="image-button"
            onClick={handleImageClick}
            style={{ cursor: "pointer" }}
          />
        </div>
      )}
      {showThirdText && (
        <div className={`third-text ${showThirdText ? "show" : ""}`}>
          {typedText}
        </div>
      )}
      <Nav filled={navFilled} showText={false} />
      <Outlet />
    </div>
  );
}

export default App;
