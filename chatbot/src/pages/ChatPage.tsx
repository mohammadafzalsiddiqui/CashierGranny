// ChatPage.tsx
import { Chatbot } from "../components/Chatbot";
import { Navigation } from "../components/Navigation";
import { 
  StyledChatPageContainer,
  AnimatedBackground,
  GradientOverlay,
  FloatingParticle,
  ContentWrapper
} from "./styles";

export function ChatPage() {
  return (
    <StyledChatPageContainer>
      <AnimatedBackground />
      <GradientOverlay />
      <FloatingParticle />
      <FloatingParticle />
      <FloatingParticle />
      
      <Navigation />
      <ContentWrapper>
        <Chatbot />
      </ContentWrapper>
    </StyledChatPageContainer>
  );
}