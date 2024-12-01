// Modal.js
import React, { useEffect, useRef, useState } from "react";
import styles from "./Modal.module.css"; // 스타일 파일
import Left from "../assets/chevron_left_bk.png";
import Right from "../assets/chevron_right_bk.png";
import Close from "../assets/close-icon.png";

const Modal = ({ isOpen, onClose, images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    // 모달이 열릴 때 오디오 객체 생성
    if (isOpen) {
      audioRef.current = new Audio("/Sound/사랑의 노래.mp3");
      audioRef.current.volume = 0.4; // 볼륨 설정
      audioRef.current.play().catch((error) => {
        console.error("Audio play failed:", error);
      });

      return () => {
        // 모달이 닫힐 때 오디오 중지 및 초기화
        audioRef.current.pause();
        audioRef.current.currentTime = 0; // 재생 위치 초기화
      };
    }
  }, [isOpen]); // isOpen 상태가 변경될 때마다 실행

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
        {/* 현재 인덱스가 마지막 이미지일 때만 닫기 버튼 보이기 */}
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
      </div>
    </div>
  );
};

export default Modal;
