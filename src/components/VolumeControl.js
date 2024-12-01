import styled from "styled-components";

const VolumeControl = styled.div`
  display: flex;
  position: absolute;
  right: 3rem;
  bottom: 5rem;
  transform: rotate(-90deg);
  justify-content: center;
  align-items: center;
  margin-left: 1rem;
  width: 6rem;

  input[type='range'] {
    -webkit-appearance: none;
    height: 100%;
    background: transparent;

    &:focus {
      outline: none;
    }

    // WEBKIT
    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      height: 16px;
      width: 16px;
      border-radius: 50%;
      background: ${(props) => (props.$volume > 0 ? "#d9d9d9" : "#E5E7EB")};
      margin-top: -3px;
      cursor: pointer;
    }

    &::-webkit-slider-runnable-track {
      height: 0.6rem;
      background: ${(props) =>
        props.$volume > 0
          ? `linear-gradient(to right, #D9D9D9 ${props.$volume}%, rgba(229, 231, 235, 0.5) ${props.$volume}% 100%)`
          : "#E5E7EB"};
      opacity: ${(props) => (props.$volume > 0 ? "1" : "0.5")};
      border-radius: 3rem;
      transition: all 0.5s;
      cursor: pointer;
    }
`;

export default VolumeControl;
