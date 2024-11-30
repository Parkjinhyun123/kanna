import React, { useEffect, useState, useRef, useCallback } from "react";
import "./Home.css";
import YouTube from "react-youtube";
import Uroko from "../assets/비늘이2.png";
import UrokoHover from "../assets/Hover.png";
import { useOutletContext } from "react-router-dom";
import { fetchDocumentsWithMsField } from "../api/firebase";
import { v4 as uuidv4 } from "uuid";

const Home = () => {
  const { toggleBackground, videoIdToFetch, isVideoEnded, setIsVideoEnded } =
    useOutletContext();

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

  const handleReady = (event) => {
    playerRef.current = event.target;
  };

  // 전체화면 변경 이벤트 리스너 추가
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && videoIdToFetch === "kIBXQHvgs1c") {
        handleVideoEnd(); // 전체화면 종료 시 함수 호출
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [videoIdToFetch]);

  // 이미지 배열에 넣기
  const importAll = (r) => {
    let images = [];
    r.keys().forEach((item) => {
      const match = item.match(/(\d{4}\.\d{2}\.\d{2})/); // 날짜 형식 변경
      if (match) {
        images.push({ src: r(item), name: item });
      }
    });

    return images
      .sort((a, b) => {
        const dateA = new Date(
          a.name.match(/(\d{4}\.\d{2}\.\d{2})/)[0].replace(/\./g, "-")
        ); // `.`을 `-`로 변환
        const dateB = new Date(
          b.name.match(/(\d{4}\.\d{2}\.\d{2})/)[0].replace(/\./g, "-")
        );
        return dateA - dateB;
      })
      .map((image) => image.src);
  };
  // 이미지 정렬
  useEffect(() => {
    const images = importAll(
      require.context("../assets/back", false, /\.(jpg|jpeg|png|gif)$/)
    );
    setImages(images);

    if (lastBack && images.length > 0) {
      let imageIndex = 0; // 현재 이미지 인덱스

      const interval = setInterval(() => {
        // 마지막 이미지에 도달했는지 확인
        if (imageIndex < images.length - 1) {
          imageIndex += 1; // 다음 이미지로 이동
          setCurrentImageIndex(imageIndex);
        } else {
          clearInterval(interval); // 마지막 이미지 도달 시 인터벌 정리
        }
      }, 2000); // 2000ms 간격으로 이미지 변경

      return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 정리
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

  //유튜브 API
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
  }, [videoIdToFetch]);

  const itemWidth = 200; // 원하는 아이템의 너비
  const itemHeight = 50; // 원하는 아이템의 높이
  const spacing = 150; // 아이템 간의 간격

  const getRandomPosition = (
    itemWidth,
    itemHeight,
    containerWidth,
    containerHeight,
    offset = 50
  ) => {
    // 중앙에 가깝게 위치를 생성하기 위해 중앙을 기준으로 랜덤하게 생성
    const x =
      Math.random() * (containerWidth - itemWidth - offset * 2) + offset;
    const y =
      Math.random() * (containerHeight - itemHeight - offset * 2) + offset;
    return { x: Math.round(x), y: Math.round(y) };
  };

  const generateUniquePosition = (
    existingItems,
    containerRef,
    spacing = 20,
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
    } else {
      console.error("모든 위치를 소진했습니다.");
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
    const fetchedDocuments = await loadDocuments();

    if (videoIdToFetch === "MkrAZi7GMpI") {
      setIsVideoEnded(true);
    }

    // 문서가 비어 있지 않은지 확인
    if (fetchedDocuments.length === 0) {
      return; // 문서가 없으면 더 이상 진행하지 않음
    }

    if (!document.fullscreenElement === null) {
      setIsVideoEnded(false);
    }

    // 전체화면이 아니고 비디오 ID가 맞는 경우
    if (
      document.fullscreenElement === null &&
      videoIdToFetch === "kIBXQHvgs1c"
    ) {
      // 초기 상태 리셋
      setIsVideoEnded(false);
      setIsIntervalActive(true);
      setMsCon(true);
      setLastBack(true);
      setVideoId(null);

      // 67초 후에 비디오 ID 설정
      setTimeout(() => {
        setVideoId("kIBXQHvgs1c");
      }, 70000);

      // 오디오 재생
      audioRef.current.volume = 0.4;
      audioRef.current.play().catch((error) => {
        console.error("Audio play failed:", error);
      });

      const usedIndices = new Set();

      // 랜덤 문서 선택 및 추가
      const interval = setInterval(() => {
        if (displayedMs.length < 6) {
          let randomIndex;
          do {
            randomIndex = Math.floor(Math.random() * fetchedDocuments.length);
          } while (
            usedIndices.has(randomIndex) &&
            usedIndices.size < fetchedDocuments.length
          );

          // 모든 문서를 사용한 경우
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
      }, 65000);
    }
  };

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
        <img src={images[currentImageIndex]} alt="배경" className="last" />
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
