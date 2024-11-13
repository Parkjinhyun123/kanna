import React, { useEffect, useState, useRef } from "react";
import "./Home.css";
import YouTube from "react-youtube";
import Uroko from "../assets/비늘이.png";
import { useOutletContext } from "react-router-dom";
import Last from "../assets/bye.jpg";
import { fetchDocumentsWithMsField } from "../api/firebase";

const Home = () => {
  const { toggleBackground, videoIdToFetch, isVideoEnded, setIsVideoEnded } =
    useOutletContext();

  const [lastBack, setLastBack] = useState(false);
  const [videoId, setVideoId] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [displayedMs, setDisplayedMs] = useState([]); // 화면에 표시될 ms 필드값 상태
  const audioRef = useRef(new Audio("/Sound/푸보용F.mp3"));
  const msContainerRef = useRef(null); // ms-container에 대한 ref 추가
  const [msCon, setMsCon] = useState(false);

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

  const handleVideoEnd = () => {
    setIsVideoEnded(true);
    if (videoIdToFetch === "kIBXQHvgs1c") {
      setMsCon(true);
      setIsVideoEnded(false);
      setLastBack(true);
      setTimeout(() => {
        audioRef.current.play().catch((error) => {
          console.error("Audio play failed:", error);
        });
      }, 1000);

      const interval = setInterval(() => {
        if (documents.length > 0 && displayedMs.length < 5) {
          const randomIndex = Math.floor(Math.random() * documents.length);
          const newMs = documents[randomIndex].ms;

          console.log("원본 문자열:", newMs);

          // 줄 바꿈 처리
          const transformedMs = newMs
            .replace(/\\n/g, "<br />")
            .replace(/\n/g, "<br />");

          console.log("변환된 문자열:", transformedMs); // 변환된 문자열 확인

          // 상태 업데이트
          setDisplayedMs((prev) => {
            const updatedMs = [
              ...prev,
              {
                value: transformedMs,
                position: getRandomPosition(prev),
                id: Date.now(),
              }, // 타임스탬프를 ID로 사용
            ];

            // 개별 메시지에 대한 타이머 설정
            setTimeout(() => {
              setDisplayedMs((current) =>
                current.filter(
                  (item) => item.id !== updatedMs[updatedMs.length - 1].id
                )
              ); // 방금 추가한 메시지만 제거
            }, 6000); // 6초 후 제거

            console.log("업데이트된 displayedMs:", updatedMs); // 업데이트 상태 확인
            return updatedMs;
          });
        } else {
          console.log(
            "documents 배열이 비어있거나 displayedMs가 가득 찼습니다."
          ); // 디버깅 메시지
        }
      }, 3000); // 3초마다 새로운 메시지 추가

      return () => clearInterval(interval);
    }
  };

  useEffect(() => {
    const loadDocuments = async () => {
      const fetchedDocuments = await fetchDocumentsWithMsField("KANNA");
      setDocuments(fetchedDocuments);
    };

    loadDocuments();
  }, []);

  const getRandomPosition = (prevPositions) => {
    let newPosition;
    let isOverlapping;
    const itemWidth = 100; // ms-item의 너비
    const itemHeight = 30; // ms-item의 높이 (폰트 사이즈 고려)
    const container = msContainerRef.current; // ms-container에 대한 ref 사용

    if (!container) return { x: 0, y: 0 }; // 컨테이너가 없으면 기본 위치 반환

    const containerRect = container.getBoundingClientRect(); // 컨테이너 크기 가져오기
    const offset = 20; // 여백

    do {
      const x = Math.random() * (containerRect.width - itemWidth - offset);
      const y = Math.random() * (containerRect.height - itemHeight - offset);
      newPosition = { x: x + containerRect.left, y: y + containerRect.top };

      isOverlapping = prevPositions.some(
        (pos) =>
          Math.abs(pos.position.x - newPosition.x) < itemWidth &&
          Math.abs(pos.position.y - newPosition.y) < itemHeight
      );
    } while (isOverlapping);

    return newPosition; // 새로운 위치 반환
  };

  const opts = {
    playerVars: {
      autoplay: 0,
    },
  };
  return (
    <div className="Youtube-container">
      {lastBack && <img src={Last} alt="마지막 배경" className="last" />}
      {videoId && (
        <>
          <YouTube
            videoId={videoId}
            opts={opts}
            onEnd={handleVideoEnd}
            className={`player ${lastBack ? "last-background" : ""}`} // 수정된 부분
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
          {displayedMs.map((msObj) => (
            <div
              key={msObj.id} // 타임스탬프를 고유 키로 사용
              className="ms-item"
              style={{
                position: "absolute",
                left: `${msObj.position.x}px`,
                top: `${msObj.position.y}px`,
                animation: `fade-in-out 6s forwards`, // 각 아이템에 대해 독립적인 애니메이션 적용
              }}
              dangerouslySetInnerHTML={{ __html: msObj.value }} // HTML로 렌더링
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
