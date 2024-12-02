import React, { useState, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import Ta from "./Ta";
import styles from "./App.module.css";
import Uroko from "../assets/비늘이2.png";
import UrokoHover from "../assets/Hover.png";
import Uroko1 from "../assets/등장.gif";
import Uroko2 from "../assets/케이크.gif";
import Uroko3 from "../assets/마지막.gif";
import Letter from "../assets/편지1.jpg";

import Letter1 from "../assets/편지1.png";
import Letter2 from "../assets/편지2.png";
import Letter3 from "../assets/편지3.png";
import Letter4 from "../assets/편지4.png";
import Letter5 from "../assets/편지6.png";
import Letter6 from "../assets/편지5.png";
import Modal from "./Modal";

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

  const [isTyping, setIsTyping] = useState(false); // 추가된 상태

  const [isCircleActive, setIsCircleActive] = useState(false);
  const [bgColor, setBgColor] = useState("transparent"); // 초기 배경 색상

  const [isHover, setIsHover] = useState(false); // 호버 상태 추가

  const [gifOpacity, setGifOpacity] = useState(1);

  const [gifComment, setGitCommemt] = useState(false);
  const [gifLastComment, setGitLastCommemt] = useState(false);
  const [letterOpacity, setLetterOpacity] = useState(0); // 초기값을 0으로 설정

  const [isSecondGifClickable, setIsSecondGifClickable] = useState(false);
  const [isLastGifClickable, setIsLastGifClickable] = useState(false);
  const [videoIdToFetch, setVideoIdToFetch] = useState("3nxmYzsQCHk"); //다이어리 아이디

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [handleModalClose, setHandleModalClose] = useState(null);
  const [currentImages, setCurrentImages] = useState([]);

  const texts = [
    "안녕! \n 우리의 첫 번째 오시!",
    "비늘이들이 \n 칸나를 위해 준비한 선물이 있는데 \n\n 같이 볼래?",
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
    newAudioInstance.volume = 0.5;
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
          playAudio();
        }
        index++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
        if (callback) callback();

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
    setGitCommemt(false);
    setIsTyping(true);
    const typingInterval = setInterval(() => {
      if (index < text.length) {
        setTypedText((prev) => prev + text[index]);
        if (index === 0 || text[index - 1] === "\n") {
          playAudio();
        }
        index++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
        if (callback) callback();

        if (audioInstanceRef.current) {
          audioInstanceRef.current.pause();
          audioInstanceRef.current.src = "";
        }
      }
    }, 100);
  };

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
          if (!showSecondGif) {
            // 이 조건을 추가
            setShowSecondGif(true);
          }
          setShowText(false);
          setShowButton(false);
        }, 500);
      });
    }
  };

  const handleSecondGifClick = () => {
    if (!isSecondGifClickable) return; // 클릭 불가 시 함수 종료
    setShowOutlet(true);
    setShowSecondGif(false);
    setGitCommemt(false);
  };

  const handleLastGifClick = () => {
    if (!isLastGifClickable) return; // 클릭 불가 시 함수 종료
    setGifOpacity(0); // GIF의 opacity를 0으로 설정
    setShowLetter(true); // Letter를 나타나게 설정
    setTimeout(() => {
      setShowLastGif(false); // GIF를 숨김
      setGitLastCommemt(false);
      setLetterOpacity(1); // 서서히 나타나게 설정
    }, 2000); // 0.5초 후에 실행
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // 모달 닫기
    setShowOutlet(true); // Outlet을 보여줌
    setIsCircleActive(false);
    setVideoIdToFetch(null);
  };

  useEffect(() => {
    if (showOutlet && handleModalClose) {
      handleModalClose(); // Home.js의 핸들러 호출
    }
  }, [showOutlet, handleModalClose]); // showOutlet이 true로 변경될 때 호출

  const handleLetterClick = () => {
    const letterImages = [Letter1, Letter2, Letter3, Letter4, Letter5, Letter6];

    setShowLetter(false);

    setCurrentImages(letterImages);
    setTimeout(() => {
      setIsModalOpen(true);
    }, 2000);
    setIsCircleActive(true);
    setBgColor("rgba(0, 0, 255, 0.5)");
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

  useEffect(() => {
    if (showSecondGif) {
      const timer = setTimeout(() => {
        setIsSecondGifClickable(true); // GIF 재생 완료 후 클릭 가능
        setGitCommemt(true);
      }, 3000); // GIF 재생 시간에 맞춰 조정

      return () => clearTimeout(timer);
    }
  }, [showSecondGif]);

  useEffect(() => {
    if (showLastGif) {
      const timer = setTimeout(() => {
        setIsLastGifClickable(true); // GIF 재생 완료 후 클릭 가능
        setGitLastCommemt(true);
      }, 4000); // GIF 재생 시간에 맞춰 조정

      return () => clearTimeout(timer);
    }
  }, [showLastGif]);

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
        <div className={styles.gifContainer}>
          <img
            src={Uroko2}
            alt="비늘이 움짤"
            className={styles.firstGif}
            style={{ cursor: "pointer" }}
            onClick={handleSecondGifClick}
          />
          {gifComment && (
            <p
              className={styles.comment}
              style={{
                left: "51% ",
              }}
            >
              날 클릭해줘!
            </p>
          )}
        </div>
      )}
      {showLastGif && (
        <div className={styles.gifContainer}>
          <img
            src={Uroko3}
            alt="비늘이 움짤"
            className={styles.firstGif}
            onClick={handleLastGifClick}
            style={{
              cursor: "pointer",
              opacity: gifOpacity,
              transition: "opacity 0.5s ease",
              left: "50.5%",
            }} // opacity와 transition 추가
          />
          {gifLastComment && (
            <p
              className={styles.comment}
              style={{
                opacity: gifOpacity,
                transition: "opacity 0.5s ease",
              }}
            >
              날 클릭해줘
            </p>
          )}
        </div>
      )}
      {showLetter && (
        <img
          src={Letter}
          alt="편지"
          className={`${styles.letter} fadeIn`}
          onClick={handleLetterClick}
          style={{
            cursor: "pointer",
            opacity: letterOpacity,
            transition: "opacity 0.5s ease",
          }}
        />
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        images={currentImages}
      />
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
              isVideoEnded,
              videoIdToFetch,
              setIsVideoEnded,
              setHandleModalClose: (callback) => {
                setHandleModalClose(() => {
                  return callback; // 콜백 함수 반환
                });
              },
            }}
          />
        )}
      </div>
    </div>
  );
}

export default App;
