import React, { useEffect, useRef, useState } from "react";
import styles from "./Modal.module.css";
import Left from "../assets/chevron_left_bk.png";
import Right from "../assets/chevron_right_bk.png";
import Close from "../assets/close-icon.png";
import VolumeControl from "./VolumeControl"; // VolumeControl import

const Modal = ({ isOpen, onClose, images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [volume, setVolume] = useState(0.4); // 초기 볼륨 상태
  const audioRef = useRef(new Audio("/Sound/사랑의 노래.mp3"));
  const [isPlaying, setIsPlaying] = useState(false); // 재생 상태 관리

  useEffect(() => {
    if (isOpen) {
      audioRef.current.volume = volume; // 초기 볼륨 설정

      // 재생 요청
      const playAudio = async () => {
        try {
          await audioRef.current.play();
          setIsPlaying(true); // 재생 상태 업데이트
        } catch (error) {
          console.error("Audio play failed:", error);
        }
      };

      playAudio();

      return () => {
        audioRef.current.pause();
        audioRef.current.currentTime = 0; // 재생 위치 초기화
        setIsPlaying(false); // 재생 상태 업데이트
      };
    }
  }, [isOpen, volume]); // isOpen 및 volume 상태가 변경될 때마다 실행

  useEffect(() => {
    // 볼륨이 변경될 때마다 오디오 볼륨 업데이트
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]); // volume 상태가 변경될 때마다 실행

  // 볼륨 변경 핸들러
  const handleVolumeChange = (event) => {
    const newVolume = event.target.valueAsNumber;
    setVolume(newVolume); // 볼륨 상태 업데이트
  };

  if (!isOpen) return null;

  const handleClose = () => {
    console.log("Modal.js 모달이 닫힙니다."); // 로그 추가
    onClose(); // 모달 닫힐 때 onClose 호출
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, images.length - 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {currentIndex === images.length - 1 && (
          <img
            src={Close}
            alt="닫기 버튼"
            className={styles.closeButton}
            onClick={handleClose}
          />
        )}
        <div className={styles.imageContainer}>
          <img
            src={Left}
            alt="왼쪽 버튼"
            onClick={handlePrev}
            className={`${styles.navButton} ${
              currentIndex === 0 ? styles.hidden : ""
            }`}
            disabled={currentIndex === 0}
          />

          <img
            src={images[currentIndex]}
            alt={`편지 ${currentIndex + 1}`}
            className={`${styles.modalImage} ${
              currentIndex === images.length - 1 ? styles.lastImage : ""
            }`}
          />

          <img
            src={Right}
            alt="오른쪽 버튼"
            onClick={handleNext}
            className={`${styles.navButton} ${
              currentIndex === images.length - 1 ? styles.hidden : ""
            }`}
            disabled={currentIndex === images.length - 1}
          />
        </div>

        {/* 볼륨 조절 슬라이더 */}
        <VolumeControl $volume={volume * 100}>
          <input
            type="range"
            min={0}
            max={1}
            step={0.02}
            value={volume}
            onChange={handleVolumeChange}
          />
        </VolumeControl>
      </div>
    </div>
  );
};

export default Modal;
