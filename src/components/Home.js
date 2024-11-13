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
  const [displayedMs, setDisplayedMs] = useState([]);
  const audioRef = useRef(new Audio("/Sound/푸보용.mp3"));
  const msContainerRef = useRef(null);
  const [msCon, setMsCon] = useState(false);
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const importAll = (r) => {
      let images = [];
      r.keys().forEach((item) => {
        images.push(r(item));
      });
      return images;
    };

    const images = importAll(
      require.context("../assets/back", false, /\.(jpg|jpeg|png|gif)$/)
    );
    setImages(images.sort()); // 날짜순 정렬 (파일명이 날짜 형식일 경우)
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
  }, [videoIdToFetch]);

  const handleVideoEnd = () => {
    setIsVideoEnded(true);
    if (videoIdToFetch === "kIBXQHvgs1c") {
      setMsCon(true);
      setIsVideoEnded(false);
      setLastBack(true);

      // 오디오 재생
      audioRef.current.play().catch((error) => {
        console.error("Audio play failed:", error);
      });

      const usedIndices = new Set();

      const interval = setInterval(() => {
        if (documents.length > 0 && displayedMs.length < 12) {
          let randomIndex;
          do {
            randomIndex = Math.floor(Math.random() * documents.length);
          } while (
            usedIndices.has(randomIndex) &&
            usedIndices.size < documents.length
          );

          if (usedIndices.size >= documents.length) {
            clearInterval(interval);
            return;
          }

          const newMs = documents[randomIndex].ms;
          usedIndices.add(randomIndex);

          const transformedMs = newMs
            .replace(/\\n/g, "<br />")
            .replace(/\n/g, "<br />");

          setDisplayedMs((prev) => {
            const updatedMs = [
              ...prev,
              {
                value: transformedMs,
                position: getRandomPosition(prev),
                id: Date.now(),
              },
            ];

            setTimeout(() => {
              setDisplayedMs((current) =>
                current.filter(
                  (item) => item.id !== updatedMs[updatedMs.length - 1].id
                )
              );
            }, 6000);

            return updatedMs;
          });
        } else {
          console.log(
            "documents 배열이 비어있거나 displayedMs가 가득 찼습니다."
          );
        }
      }, 2000);

      setTimeout(() => {
        clearInterval(interval);
      }, 60000); // 52초 후 중지

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

  const getRandomPosition = (prevPositions, text) => {
    const container = msContainerRef.current;

    if (!container) return { x: 0, y: 0 };

    const offset = 50;
    const minDistance = 50;

    const measureText = (text) => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      context.font = "24px Arial";
      return {
        width: context.measureText(text).width,
        height: 30,
      };
    };

    const { width: itemWidth } = measureText(text);
    const itemHeight = 30;

    let newPosition;
    let isValidPosition;

    do {
      const x =
        Math.random() * (container.clientWidth - itemWidth - offset * 2);
      const y =
        Math.random() * (container.clientHeight - itemHeight - offset * 2);

      newPosition = { x, y };
      isValidPosition = prevPositions.every((pos) => {
        const distanceX = Math.abs(pos.position.x - newPosition.x);
        const distanceY = Math.abs(pos.position.y - newPosition.y);
        const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
        return distance >= minDistance;
      });
    } while (!isValidPosition);

    return newPosition;
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
