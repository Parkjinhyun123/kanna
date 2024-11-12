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
      setIsVideoEnded(false);
      setLastBack(true);
      setTimeout(() => {
        audioRef.current.play().catch((error) => {
          console.error("Audio play failed:", error);
        });
      }, 1000);

      // 동영상이 끝난 후 ms-item을 생성하는 interval 설정
      const interval = setInterval(() => {
        if (documents.length > 0 && displayedMs.length < 7) {
          const randomIndex = Math.floor(Math.random() * documents.length);
          const newMs = documents[randomIndex].ms;

          setDisplayedMs((prev) => [
            ...prev,
            { value: newMs, position: getRandomPosition(prev) },
          ]);

          setTimeout(() => {
            setDisplayedMs((prev) => prev.filter((_, i) => i !== 0));
          }, 10000);
        }
      }, 2000);

      // 컴포넌트 언마운트 시 interval 정리
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
    const itemWidth = 100;
    const itemHeight = 50;
    const offset = 800;

    do {
      const x = Math.random() * (window.innerWidth - itemWidth - offset);
      const y = Math.random() * (window.innerHeight - itemHeight);
      newPosition = { x, y };

      isOverlapping = prevPositions.some(
        (pos) =>
          Math.abs(pos.position.x - newPosition.x) < itemWidth &&
          Math.abs(pos.position.y - newPosition.y) < itemHeight
      );
    } while (isOverlapping);

    const adjustedX = Math.max(
      0,
      Math.min(window.innerWidth - itemWidth - offset, newPosition.x)
    );
    const adjustedY = Math.max(
      0,
      Math.min(window.innerHeight - itemHeight, newPosition.y)
    );

    return { x: adjustedX, y: adjustedY };
  };

  const opts = {
    height: "590",
    width: "900",
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
      <div className="ms-container">
        {displayedMs.map((msObj, index) => (
          <div
            key={index}
            className="ms-item"
            style={{
              position: "absolute", // 절대 위치 설정
              left: `${msObj.position.x}px`,
              top: `${msObj.position.y}px`,
            }}
          >
            {msObj.value}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
