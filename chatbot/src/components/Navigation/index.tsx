import {
  StyledSidebar,
  StyledLogo,
  StyledButton,
  StyledLogoContainer,
  StyledCreateButton,
} from "../Navigation/styles";
import {
  BlockOutlined,
  WalletOutlined,
  PicCenterOutlined,
  FormOutlined,
} from "@ant-design/icons";

export function Navigation() {
  return (
    <StyledSidebar>
      <StyledLogoContainer>
        <StyledLogo /> CashierGranny
        
      </StyledLogoContainer>
      <StyledButton
        onClick={() => console.log("Button 1 clicked")}
        icon={<BlockOutlined />}
      >
        Get Latest Block
      </StyledButton>
      <StyledButton
        onClick={() => console.log("Button 2 clicked")}
        icon={<WalletOutlined />}
      >
        Create Wallet
      </StyledButton>
      <StyledButton
        onClick={() => console.log("Button 3 clicked")}
        icon={<PicCenterOutlined />}
      >
        Get Block Status
      </StyledButton>
      <StyledButton
  onClick={() => window.location.href = "https://invoicing.request.network/"}
  icon={<PicCenterOutlined />}
>
  Dashboard
</StyledButton>
    </StyledSidebar>
  );
}
