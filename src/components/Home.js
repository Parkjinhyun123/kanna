import React, { useEffect, useState, useRef } from "react";
import "./Home.css";
import YouTube from "react-youtube";
import Uroko from "../assets/비늘이.png";
import { useOutletContext } from "react-router-dom";
// import Last from "../assets/bye.jpg";
import { fetchDocumentsWithMsField } from "../api/firebase";

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

  // 이미지가 변경될 때마다 로그를 찍어보세요
  useEffect(() => {
    console.log("Current Image Index:", currentImageIndex);
  }, [currentImageIndex]);

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

  const handleVideoEnd = async () => {
    setIsVideoEnded(true);

    // 문서 불러오기
    const fetchedDocuments = await loadDocuments();

    // 문서가 비어 있지 않은지 확인
    if (fetchedDocuments.length === 0) {
      console.log("문서가 없습니다.");
      return; // 문서가 없으면 더 이상 진행하지 않음
    }

    if (
      document.fullscreenElement === null &&
      videoIdToFetch === "kIBXQHvgs1c"
    ) {
      console.log("테스트1");
      console.log(isIntervalActive);
      setIsVideoEnded(false);
      console.log("테스트2");
      setIsIntervalActive(true);
      setMsCon(true);
      setLastBack(true); // 이미지 전환 시작

      // 오디오 재생
      audioRef.current.volume = 0.4;
      audioRef.current.play().catch((error) => {
        console.error("Audio play failed:", error);
      });

      const usedPositions = [];
      const usedIndices = new Set();

      const interval = setInterval(() => {
        if (displayedMs.length < 12) {
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
          const position = getRandomPosition(usedPositions, newMs);
          console.log("Position from getRandomPosition:", position);
          usedPositions.push(position);
          usedIndices.add(randomIndex);

          const transformedMs = newMs
            .replace(/\\n/g, "<br />")
            .replace(/\n/g, "<br />");

          setDisplayedMs((prev) => [
            ...prev,
            {
              value: transformedMs,
              position: position,
              id: Date.now(),
            },
          ]);
        } else {
          console.log("displayedMs가 가득 찼습니다.");
          clearInterval(interval);
          setIsIntervalActive(false);
        }
      }, 1000); // 2000ms 간격 설정

      setTimeout(() => {
        clearInterval(interval);
        setIsIntervalActive(false);
      }, 65000);
    }
  };

  // 문서 불러오기 함수
  const loadDocuments = async () => {
    const fetchedDocuments = await fetchDocumentsWithMsField("KANNA");
    setDocuments(fetchedDocuments);
    return fetchedDocuments; // 로드된 문서를 반환
  };

  //랜덤 배치 함수
  const getRandomPosition = (prevPositions, text) => {
    const container = msContainerRef.current;

    if (!container) return { x: 0, y: 0 };

    const offset = 50;
    const minDistance = 500; // 최소 거리 설정

    const measureText = (text) => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      context.font = "24px Arial"; // 텍스트 폰트 설정
      const lines = text.split("<br />"); // 줄바꿈을 기준으로 텍스트 분리
      const maxWidth = Math.max(
        ...lines.map((line) => context.measureText(line).width)
      ); // 가장 긴 텍스트의 너비
      const height = lines.length * 30; // 각 줄의 높이를 30으로 가정

      return {
        width: maxWidth,
        height: height,
      };
    };

    const { width: itemWidth, height: itemHeight } = measureText(text);

    let isValidPosition = false;
    let newPosition = { x: 0, y: 0 };

    while (!isValidPosition) {
      // 랜덤 x 좌표 생성
      const x =
        Math.random() * (container.clientWidth - itemWidth - offset) + offset;
      // 랜덤 y 좌표 생성
      const y =
        Math.random() * (container.clientHeight - itemHeight - offset) + offset;

      newPosition = { x, y };

      // x와 y 좌표 모두에 대해 최소 거리 조건 확인
      isValidPosition = prevPositions.every((pos) => {
        if (!pos.position) return true; // position이 없으면 거리 체크를 하지 않음
        const distanceX = Math.abs(pos.position.x - newPosition.x);
        const distanceY = Math.abs(pos.position.y - newPosition.y);
        const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
        return distance >= minDistance; // 최소 거리 조건
      });
    }

    return newPosition; // 새로운 위치 반환
  };

  // 유튜브 API 자동재생 막기
  const opts = {
    playerVars: {
      autoplay: 0,
    },
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
                src={Uroko}
                alt="Video Ended"
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
                className="ms-item"
                style={{
                  position: "absolute",
                  left: `${msObj.position.x}px`,
                  top: `${msObj.position.y}px`,
                  animation: `fade-in-out 6s forwards`,
                }}
                dangerouslySetInnerHTML={{ __html: msObj.value }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
