import React, { useState, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import Ta from "./Ta";
import styles from "./App.module.css";
import Uroko from "../assets/비늘이.png";
import Uroko1 from "../assets/불시안1.gif";
import Letter from "../assets/편지.png";

const audioFiles = ["/Sound/반갑꼬리.mp3"];

function App() {
  const [currentAudio, setCurrentAudio] = useState("");
  const audioInstanceRef = useRef(null);
  const [shuffledFiles, setShuffledFiles] = useState(audioFiles);
  const [showTa, setShowTa] = useState(true);
  const [showGif, setShowGif] = useState(false);
  const [showSecondGif, setShowSecondGif] = useState(false);
  const [navFilled, setNavFilled] = useState(false);
  const [showText, setShowText] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [showBackground, setShowBackground] = useState(false);
  const [showOutlet, setShowOutlet] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [isVideoEnded, setIsVideoEnded] = useState(false);

  const [isText0Complete, setIsText0Complete] = useState(false);
  const [isText1Complete, setIsText1Complete] = useState(false);

  const [secondTextIndex, setSecondTextIndex] = useState(0);
  const [isSecondTextComplete, setIsSecondTextComplete] = useState(false);

  const [videoIdToFetch, setVideoIdToFetch] = useState("MkrAZi7GMpI");
  const [isTyping, setIsTyping] = useState(false); // 추가된 상태

  const texts = [
    "어서와! \n 우리의 첫번째 오시!",
    "우리 비늘이들도 \n 칸나에게 보여주고 싶은게 \n 하나있어! \n\n 같이 볼까?",
    "고마워! \n 그럼 보러가자!",
  ];

  const secondTexts = [
    "어땠어? \n 칸나의 이야기를 담은 \n 다이어리야 \n\n 더 많은 이야기가 있었지만 \n 적기엔 페이지가 부족했네..",
    "하지만 그만큼 \n 칸나가 많은 이야기를 \n 써왔다는 거니까 \n\n 좋은게 아닐까? ",
    "벌써 시간이 이렇게 됐네 \n 우리는 언제 어디서든 칸나를 응원하고 있을게! ",
    "다음에 다시 만나자 \n\n 생일 축하해! \n\n 우리의 마지막 오시!",
    "우리는 아이리 칸나라는 \n 이야기 속에서 기다리고 있을게!",
  ];

  const toggleBackground = () => {
    setShowOutlet(false);
    setTimeout(() => {
      setShowButton(true);
    }, 600);
    setTimeout(() => {
      setSecondTextIndex(0);
      setShowText(true);
      setTypedText("");
      setNavFilled(false);
      typeSecondText(secondTexts[0], () => {
        setIsSecondTextComplete(true);
      });
    }, 500);
  };

  const playRandomAudio = () => {
    const selectedAudio =
      shuffledFiles[Math.floor(Math.random() * shuffledFiles.length)];
    setCurrentAudio(selectedAudio);
  };

  const handleTaLogoClick = () => {
    playRandomAudio();
    setShowGif(true);
    setShowTa(false);

    setTimeout(() => {
      setShowGif(false);
      setShowText(true);
      setTypedText("");
      setCurrentTextIndex(0);
      typeText(texts[0], () => {
        setIsText0Complete(true);
        setShowButton(true);
      });
    }, 3000);
  };

  const typeText = (text, callback) => {
    let index = 0;
    setTypedText("");
    setIsTyping(true); // 타이핑 시작
    const typingInterval = setInterval(() => {
      if (index < text.length) {
        setTypedText((prev) => prev + text[index]);
        index++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false); // 타이핑 완료
        if (callback) callback();
      }
    }, 100);
  };

  const typeSecondText = (text, callback) => {
    let index = 0;
    setTypedText("");
    setIsTyping(true); // 타이핑 시작
    const typingInterval = setInterval(() => {
      if (index < text.length) {
        setTypedText((prev) => prev + text[index]);
        index++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false); // 타이핑 완료
        if (callback) callback();
      }
    }, 100);
  };

  const handleImageClick = () => {
    if (isTyping) return; // 타이핑 중일 경우 클릭 무시

    if (isSecondTextComplete) {
      if (secondTextIndex < secondTexts.length - 1) {
        setSecondTextIndex((prev) => prev + 1);
        typeSecondText(secondTexts[secondTextIndex + 1], () => {
          if (secondTextIndex + 1 === secondTexts.length - 1) {
            setIsSecondTextComplete(true);
          }
        });
      } else {
        setShowText(false);
        setShowButton(false);
        setShowSecondGif(true);
        setTimeout(() => {
          setShowSecondGif(false);
          setShowLetter(true);
        }, 3000);
      }
    } else if (currentTextIndex === 0 && isText0Complete) {
      setCurrentTextIndex(1);
      typeText(texts[1], () => {
        setIsText1Complete(true);
      });
    } else if (currentTextIndex === 1 && isText1Complete) {
      setCurrentTextIndex(2);
      typeText(texts[2], () => {
        setTimeout(() => {
          setShowText(false);
          setShowButton(false);
          setShowGif(true);
          setTimeout(() => {
            setShowOutlet(true);
            setShowGif(false);
          }, 3000);
        }, 500);
        setTimeout(() => {
          setNavFilled(true);
        }, 800);
      });
    }
  };

  const handleLetterClick = () => {
    setShowLetter(false);
    setVideoIdToFetch("kIBXQHvgs1c");
    setShowOutlet(true);
    setIsVideoEnded(false);
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
    <div className={styles.App}>
      <div
        className={`${styles.background} ${
          showBackground ? styles.moveUp : ""
        }`}
      ></div>
      {showTa && <Ta onLogoClick={handleTaLogoClick} />}
      {showGif && (
        <img src={Uroko1} alt="비늘이 움짤" className={styles.firstGif} />
      )}
      {showSecondGif && (
        <img src={Uroko1} alt="비늘이 움짤" className={styles.firstGif} />
      )}
      {showLetter && (
        <img
          src={Letter}
          alt="편지"
          className={styles.firstGif}
          onClick={handleLetterClick}
          style={{ cursor: "pointer" }}
        />
      )}
      {showText && (
        <div
          className={`${styles.text} ${showText ? styles.show : ""}`}
          style={{ whiteSpace: "pre-line" }}
        >
          {typedText}
        </div>
      )}
      {showButton && (
        <div className={styles.buttonContainer}>
          <img
            src={Uroko}
            alt="Button"
            className={styles.imageButton}
            onClick={handleImageClick}
            style={{ cursor: "pointer" }}
          />
        </div>
      )}
      <div className={styles.allCt}>
        {showOutlet && (
          <Outlet
            context={{
              toggleBackground,
              videoIdToFetch,
              isVideoEnded,
              setIsVideoEnded,
            }}
          />
        )}
      </div>
    </div>
  );
}

export default App;
