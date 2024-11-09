// Home.js
import React, { useEffect, useState } from "react";
import "./Home.css";
import YouTube from "react-youtube";
import Uroko from "../assets/테스트비늘이.png";
import { useOutletContext } from "react-router-dom";

const Home = () => {
  const {
    toggleBackground,
    apiKey,
    videoIdToFetch,
    isVideoEnded,
    setIsVideoEnded,
  } = useOutletContext();

  const [videoId, setVideoId] = useState(null);

  useEffect(() => {
    const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoIdToFetch}&key=${apiKey}&part=snippet,contentDetails,statistics`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.items.length > 0) {
          setVideoId(data.items[0].id);
        }
      })
      .catch((error) => console.error("Error:", error));
  }, [apiKey, videoIdToFetch]);

  const opts = {
    height: "590",
    width: "900",
    playerVars: {
      autoplay: 0,
    },
  };

  const handleVideoEnd = () => {
    setIsVideoEnded(true);
    if (videoIdToFetch == "kIBXQHvgs1c") {
      setIsVideoEnded(false);
    }
  };

  return (
    <div className="Youtube-container">
      {videoId && (
        <>
          <YouTube
            videoId={videoId}
            opts={opts}
            onEnd={handleVideoEnd} // 비디오가 종료되면 handleVideoEnd 호출
            className="player"
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
    </div>
  );
};

export default Home;
