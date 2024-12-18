import React, { useEffect, useState, useRef } from "react";
import "./Home.css";
import YouTube from "react-youtube";
import Uroko from "../assets/비늘이2.png";
import UrokoHover from "../assets/Hover.png";
import { useOutletContext } from "react-router-dom";
import { fetchDocumentsWithMsField } from "../api/firebase";
import { v4 as uuidv4 } from "uuid";

const Home = () => {
  const {
    toggleBackground,
    videoIdToFetch,
    isVideoEnded,
    setIsVideoEnded,
    setHandleModalClose,
  } = useOutletContext();

  const [lastBack, setLastBack] = useState(false);
  const [videoId, setVideoId] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [displayedMs, setDisplayedMs] = useState([]);
  const audioRef = useRef(new Audio("/Sound/푸보용.mp3"));
  const msContainerRef = useRef(null);
  const [msCon, setMsCon] = useState(false);
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const playerRef = useRef(null);
  const [isIntervalActive, setIsIntervalActive] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [videoCheck, setVideoCheck] = useState(false);
  const [hasCalledModalClose, setHasCalledModalClose] = useState(false);

  const handleReady = (event) => {
    playerRef.current = event.target;
  };

  // 이미지 배열에 넣기
  const importAll = (r) => {
    let images = [];
    r.keys().forEach((item) => {
      const match = item.match(/(\d{4}\.\d{2}\.\d{2})/);
      if (match) {
        images.push({ src: r(item), name: item });
      }
    });

    return images
      .sort((a, b) => {
        const dateA = new Date(
          a.name.match(/(\d{4}\.\d{2}\.\d{2})/)[0].replace(/\./g, "-")
        );
        const dateB = new Date(
          b.name.match(/(\d{4}\.\d{2}\.\d{2})/)[0].replace(/\./g, "-")
        );
        return dateA - dateB;
      })
      .map((image) => image.src);
  };

  useEffect(() => {
    const images = importAll(
      require.context("../assets/back", false, /\.(jpg|jpeg|png|gif)$/)
    );
    setImages(images);

    if (lastBack && images.length > 0) {
      let imageIndex = 0;

      const interval = setInterval(() => {
        if (imageIndex < images.length - 1) {
          imageIndex += 1;
          setCurrentImageIndex(imageIndex);
        } else {
          clearInterval(interval);
        }
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [lastBack]);

  //파이어 베이스 불러오기
  useEffect(() => {
    const loadDocuments = async () => {
      const fetchedDocuments = await fetchDocumentsWithMsField("KANNA");
      setDocuments(fetchedDocuments);
    };

    loadDocuments();
  }, []);

  useEffect(() => {
    audioRef.current.volume = 0.4;

    const apiKey = "AIzaSyDL88g-mJDjegmPrGyjqCafSvaIn4iS1w4";
    const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoIdToFetch}&key=${apiKey}&part=snippet,contentDetails,statistics`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.items.length > 0) {
          setVideoId(data.items[0].id);
        }
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  const itemWidth = 200;
  const itemHeight = 50;
  const spacing = 200;

  const getRandomPosition = (
    itemWidth,
    itemHeight,
    containerWidth,
    containerHeight,
    offset = 50,
    bottomOffset = 100
  ) => {
    const x =
      Math.random() * (containerWidth - itemWidth - offset * 2) + offset;
    const y =
      Math.random() * (containerHeight - itemHeight - bottomOffset - offset) +
      offset;
    return { x: Math.round(x), y: Math.round(y) };
  };

  const generateUniquePosition = (
    existingItems,
    containerRef,
    spacing = 150,
    itemWidth = 200,
    itemHeight = 50
  ) => {
    if (!containerRef.current) return null; // 컨테이너가 없는 경우

    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;

    let position;
    let attempts = 0;
    const maxAttempts = 100; // 최대 시도 횟수

    do {
      position = getRandomPosition(
        itemWidth,
        itemHeight,
        containerWidth,
        containerHeight
      );
      attempts++;
    } while (
      isOverlapping(position, existingItems, itemWidth, itemHeight, spacing) &&
      attempts < maxAttempts
    );

    return attempts < maxAttempts ? position : null; // 성공적으로 위치를 찾으면 반환
  };

  const addMsItem = (newMs) => {
    const transformedMs = newMs
      .replace(/\\n/g, "<br />")
      .replace(/\n/g, "<br />");

    const newItem = {
      value: transformedMs,
      position: null,
      id: uuidv4(),
      ref: React.createRef(),
    };

    let position = generateUniquePosition(displayedMs, msContainerRef);

    // 위치가 유효한 경우에만 진행
    if (position) {
      newItem.position = position; // 유효한 위치가 있으면 업데이트

      // 상태를 업데이트하면서 아이템 추가
      setDisplayedMs((prev) => {
        const updatedItems = [...prev];

        // 겹침 검사
        const isOverlappingDetected = updatedItems.some((existingItem) => {
          return isOverlapping(
            position,
            [existingItem],
            itemWidth,
            itemHeight,
            spacing
          );
        });

        // 겹치는 경우 아이템 추가하지 않음
        if (isOverlappingDetected) {
          return prev; // 상태를 변경하지 않음
        }

        // 새로운 아이템 추가
        updatedItems.push(newItem);

        // 최대 아이템 수 검사
        const maxItems = 6;
        if (updatedItems.length > maxItems) {
          updatedItems.shift();
        }

        return updatedItems; // 새로운 상태 반환
      });

      // 애니메이션 후 ms-item 제거 (6000ms 유지)
      setTimeout(() => {
        handleItemRemoval(newItem.id); // 아이템 제거
      }, 6000);
    }
  };

  const isOverlapping = (
    newPosition,
    existingItems,
    itemWidth,
    itemHeight,
    spacing
  ) => {
    return existingItems.some((existingItem) => {
      const existingX = existingItem.position.x;
      const existingY = existingItem.position.y;

      // 겹침 검사 로직
      return (
        newPosition.x < existingX + itemWidth + spacing &&
        newPosition.x + itemWidth > existingX - spacing &&
        newPosition.y < existingY + itemHeight + spacing &&
        newPosition.y + itemHeight > existingY - spacing
      );
    });
  };

  const handleItemRemoval = (itemId) => {
    setDisplayedMs((prev) => prev.filter((item) => item.id !== itemId));
  };

  // 문서 불러오기 함수
  const loadDocuments = async () => {
    const fetchedDocuments = await fetchDocumentsWithMsField("KANNA");
    setDocuments(fetchedDocuments);
    return fetchedDocuments; // 로드된 문서를 반환
  };

  const handleVideoEnd = async () => {
    setIsVideoEnded(true);
  };

  const handleHomeModalClose = async () => {
    if (hasCalledModalClose) return;
    setHasCalledModalClose(true); // 호출 상태 업데이트

    const fetchedDocuments = await loadDocuments();
    setIsIntervalActive(true);
    setMsCon(true);
    setLastBack(true);

    // 문서가 비어 있지 않은지 확인
    if (fetchedDocuments.length === 0) {
      return; // 문서가 없으면 더 이상 진행하지 않음
    }

    audioRef.current.volume = 0.3;
    audioRef.current.play().catch((error) => {
      console.error("Audio play failed:", error);
    });

    const usedIndices = new Set();

    const interval = setInterval(() => {
      if (displayedMs.length < 6) {
        let randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * fetchedDocuments.length);
        } while (
          usedIndices.has(randomIndex) &&
          usedIndices.size < fetchedDocuments.length
        );

        if (usedIndices.size >= fetchedDocuments.length) {
          clearInterval(interval);
          setIsIntervalActive(false);
          return;
        }

        const newMs = fetchedDocuments[randomIndex].ms; // 로드된 문서 사용
        usedIndices.add(randomIndex);

        // 아이템 추가
        addMsItem(newMs); // addMsItem 호출
      } else {
        clearInterval(interval);
        setIsIntervalActive(false);
      }
    }, 1000); // 1000ms 간격 설정

    // 시간 초과 시 인터벌 클리어
    setTimeout(() => {
      clearInterval(interval);
      setIsIntervalActive(false);
      setVideoCheck(true);
      console.log(videoCheck);
    }, 68000);
  };

  if (videoIdToFetch === null) {
    handleHomeModalClose();
  }

  useEffect(() => {
    setHandleModalClose(() => handleHomeModalClose);
  }, []); // 빈 배열로 설정하여 최초 렌더링 시 한 번만 실행

  // 유튜브 API 자동재생 막기
  const opts = {
    playerVars: {
      autoplay: 0,
    },
  };

  const handleMouseEnter = () => {
    setIsHover(true);
  };

  const handleMouseLeave = () => {
    setIsHover(false);
  };

  return (
    <div className="Youtube-container">
      {lastBack && images.length > 0 && (
        <img
          src={images[currentImageIndex]}
          alt="배경"
          className={
            currentImageIndex === images.length - 1 ? "last last-image" : "last"
          }
        />
      )}
      {videoId && (
        <>
          <YouTube
            videoId={videoId}
            opts={opts}
            onEnd={handleVideoEnd}
            onReady={handleReady}
            className={`player ${lastBack ? "last-background" : ""}`}
          />
          {isVideoEnded && (
            <div className="video-ended-image" onClick={toggleBackground}>
              <img
                src={isHover ? UrokoHover : Uroko}
                alt="Video Ended"
                onMouseEnter={handleMouseEnter} // 마우스 엔터 이벤트
                onMouseLeave={handleMouseLeave} // 마우스 리브 이벤트
                style={{ cursor: "pointer" }}
              />
            </div>
          )}
        </>
      )}
      {msCon && (
        <div className="ms-container" ref={msContainerRef}>
          <div className="center-point">
            {" "}
            {/* 중심 div */}
            {displayedMs.map((msObj) => (
              <div
                key={msObj.id}
                ref={msObj.ref} // 고유 ref 사용
                className="ms-item"
                style={{
                  position: "absolute",
                  left: `${msObj.position.x}px`,
                  top: `${msObj.position.y}px`,
                  animation: `fade-in-out 6s forwards`,
                }}
                dangerouslySetInnerHTML={{ __html: msObj.value }} // HTML로 내용 설정
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
