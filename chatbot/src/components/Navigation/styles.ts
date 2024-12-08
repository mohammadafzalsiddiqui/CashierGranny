import styled, { keyframes } from "styled-components";
import Logo from "../../assets/chain-ai-logo.webp";
import { Button } from "antd";

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 5px rgba(78, 205, 196, 0.2); }
  50% { box-shadow: 0 0 20px rgba(78, 205, 196, 0.4); }
  100% { box-shadow: 0 0 5px rgba(78, 205, 196, 0.2); }
`;

const particleFloat = keyframes`
  0% { transform: translateY(0px) translateX(0px); }
  50% { transform: translateY(-15px) translateX(15px); }
  100% { transform: translateY(0px) translateX(0px); }
`;

export const StyledSidebar = styled.div`
  width: 280px;
  background: linear-gradient(135deg, #1a1a1a 0%, #0d2b46 100%);
  display: flex;
  flex-direction: column;
  padding: 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, 
      rgba(78, 205, 196, 0.1) 0%,
      rgba(85, 98, 112, 0.1) 100%);
    background-size: 200% 200%;
    animation: ${gradientAnimation} 15s ease infinite;
  }

  &::after {
    content: '';
    position: absolute;
    top: 20%;
    left: 50%;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, 
      rgba(78, 205, 196, 0.1) 0%, 
      rgba(78, 205, 196, 0) 70%);
    transform: translate(-50%, -50%);
    animation: ${particleFloat} 8s ease infinite;
  }
`;

export const StyledCreateButton = styled.div`
  margin-left: auto;
  position: relative;
  z-index: 1;
`;

export const StyledLogoContainer = styled.div`
  gap: 10px;
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  color: white;
  position: relative;
  z-index: 1;
  padding: 10px 0;
  background: linear-gradient(45deg, #4ecdc4, #556270);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${gradientAnimation} 6s ease infinite;
`;

export const StyledLogo = styled.div`
  width: 30px;
  height: 60px;
  background-image: url(${Logo});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: left;
  filter: brightness(0) invert(1);
`;

export const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 20px;
  padding: 20px 10px;
  border: none;
  background-color: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.9);
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  box-shadow: none;
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);

  .anticon {
    margin-right: 4px;
    transition: transform 0.3s ease;
  }

  &:hover,
  &:focus {
    background-color: rgba(78, 205, 196, 0.1) !important;
    color: #4ecdc4 !important;
    transform: translateX(5px);
    animation: ${glowAnimation} 2s infinite;

    .anticon {
      transform: scale(1.2);
    }
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 5px;
    background: linear-gradient(45deg, 
      rgba(78, 205, 196, 0.1), 
      rgba(85, 98, 112, 0.1));
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }
`;