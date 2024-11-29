import React, { useState, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import Ta from "./Ta";
import styles from "./App.module.css";
import Uroko from "../assets/비늘이2.png";
import UrokoHover from "../assets/Hover.png";
import Uroko1 from "../assets/통통 비늘.gif";
import Uroko2 from "../assets/케이크 비늘.gif";
import Letter from "../assets/편지1.jpg";

const audioFiles = ["/Sound/반갑꼬리.mp3"];

function App() {
  const [currentAudio, setCurrentAudio] = useState("");
  const audioInstanceRef = useRef(null);
  const [showTa, setShowTa] = useState(true);
  const [showGif, setShowGif] = useState(false);
  const [showSecondGif, setShowSecondGif] = useState(false);
  const [showLastGif, setShowLastGif] = useState(false);
  const [showText, setShowText] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [showOutlet, setShowOutlet] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [isVideoEnded, setIsVideoEnded] = useState(false);

  const [isText0Complete, setIsText0Complete] = useState(false);
  const [isText1Complete, setIsText1Complete] = useState(false);

  const [secondTextIndex, setSecondTextIndex] = useState(0);
  const [isSecondTextComplete, setIsSecondTextComplete] = useState(false);

  const [videoIdToFetch, setVideoIdToFetch] = useState("MkrAZi7GMpI");
  const [isTyping, setIsTyping] = useState(false); // 추가된 상태

  const [isCircleActive, setIsCircleActive] = useState(false);
  const [bgColor, setBgColor] = useState("transparent"); // 초기 배경 색상

  const [isHover, setIsHover] = useState(false); // 호버 상태 추가

  const texts = [
    "안녕! \n 우리의 첫 번째 오시!",
    "비늘이들이 \n 칸나를 위해 준비한 선물이 하나 있는데 \n\n 같이 볼래?",
    "좋아! \n 그럼 보러가자!",
  ];

  const secondTexts = [
    "어땠어? \n 칸나의 이야기를 담은 다이어리야 \n\n 더 많은 이야기가 있지만 적기엔 시간이 부족했네...",
    "하지만 못 적은만큼 \n 칸나가 많은 이야기를 써왔다는 거니까 \n\n 좋다고 생각해!",
    "벌써 시간이 이렇게 됐네 \n 우리는 언제 어디서든 칸나를 응원하고 있을거야 ",
    "우리는 아이리 칸나라는 \n 이야기 속에서 기다리고 있을게",
    "그리고 생일 축하해! \n\n  우리의 마지막 오시!  \n\n 언젠가 꼭 다시 만나자 ",
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
      typeSecondText(secondTexts[0], () => {
        setIsSecondTextComplete(true);
      });
    }, 500);
  };

  const playRandomAudio = () => {
    setCurrentAudio(audioFiles);
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

  const audioFile = ["Sound/글씨.mp3"];

  const playAudio = () => {
    if (audioInstanceRef.current) {
      audioInstanceRef.current.pause();
      audioInstanceRef.current.currentTime = 0;
    }

    const newAudioInstance = new Audio(audioFile[0]);
    newAudioInstance.volume = 0.9;
    audioInstanceRef.current = newAudioInstance;
    newAudioInstance.play();
  };

  const typeText = (text, callback) => {
    let index = 0;
    setTypedText("");
    setIsTyping(true);
    const typingInterval = setInterval(() => {
      if (index < text.length) {
        setTypedText((prev) => prev + text[index]);
        if (index === 0 || text[index - 1] === "\n") {
          playAudio(); // 첫 글자 출력 시 오디오 재생
        }
        index++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
        if (callback) callback();

        // 모든 텍스트가 출력된 후 오디오 멈추기
        if (audioInstanceRef.current) {
          audioInstanceRef.current.pause();
          audioInstanceRef.current.src = "";
        }
      }
    }, 100);
  };

  const typeSecondText = (text, callback) => {
    let index = 0;
    setTypedText("");
    setIsVideoEnded(false);
    setIsTyping(true);
    const typingInterval = setInterval(() => {
      if (index < text.length) {
        setTypedText((prev) => prev + text[index]);
        if (index === 0 || text[index - 1] === "\n") {
          playAudio(); // 첫 글자 출력 시 오디오 재생
        }
        index++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
        if (callback) callback();

        // 모든 텍스트가 출력된 후 오디오 멈추기
        if (audioInstanceRef.current) {
          audioInstanceRef.current.pause();
          audioInstanceRef.current.src = "";
        }
      }
    }, 100);
  };

  // 모든 텍스트가 출력된 후 오디오 끄기
  useEffect(() => {
    if (isText0Complete && isText1Complete && isSecondTextComplete) {
      if (audioInstanceRef.current) {
        audioInstanceRef.current.pause();
        audioInstanceRef.current.src = "";
      }
    }
  }, [isText0Complete, isText1Complete, isSecondTextComplete]);

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
        setShowLastGif(true);
        setTimeout(() => {
          setShowLastGif(false);
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
          setShowSecondGif(true);
          setTimeout(() => {
            setShowOutlet(true);
            setShowSecondGif(false);
          }, 3000);
        }, 500);
      });
    }
  };

  const handleLetterClick = () => {
    setShowLetter(false);
    setVideoIdToFetch("kIBXQHvgs1c");
    setShowOutlet(true);
    setIsVideoEnded(false); // 상태 업데이트
    // 원 활성화 상태 변경
    setIsCircleActive(true);

    // 배경 색상 변경
    setBgColor("rgba(0, 0, 255, 0.5)"); // 원하는 색으로 변경
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

  const handleMouseEnter = () => {
    setIsHover(true);
  };

  const handleMouseLeave = () => {
    setIsHover(false);
  };

  return (
    <div className={styles.App}>
      {isCircleActive && <div className={styles.circle}></div>}
      <div
        className={styles.background}
        style={{ backgroundColor: bgColor }}
      ></div>
      {showTa && <Ta onLogoClick={handleTaLogoClick} />}
      {showGif && (
        <img src={Uroko1} alt="비늘이 움짤" className={styles.firstGif} />
      )}
      {showSecondGif && (
        <img src={Uroko2} alt="비늘이 움짤" className={styles.firstGif} />
      )}
      {showLastGif && (
        <img src={Uroko1} alt="비늘이 움짤" className={styles.firstGif} />
      )}
      {showLetter && (
        <img
          src={Letter}
          alt="편지"
          className={styles.letter}
          onClick={handleLetterClick}
          style={{
            cursor: "pointer",
            opacity: showLetter ? 1 : 0,
            transition: "opacity 0.5s ease-in",
          }}
        />
      )}
      {showText && (
        <div className={styles.textMsCotainer}>
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
                src={isHover ? UrokoHover : Uroko} // 호버 상태에 따라 이미지 변경
                alt="Button"
                className={styles.imageButton}
                onClick={handleImageClick}
                onMouseEnter={handleMouseEnter} // 마우스 엔터 이벤트
                onMouseLeave={handleMouseLeave} // 마우스 리브 이벤트
                style={{ cursor: "pointer" }}
              />
            </div>
          )}
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
