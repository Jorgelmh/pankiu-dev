import { StyledContainer } from "./styles";
import IconText from "components/molecules/icontext";

const Menu: React.FC = () => {
  return (
    <>
      <StyledContainer>
        <IconText>Jusus</IconText>
        <IconText>Judas</IconText>
        <IconText>Mateo</IconText>
        <IconText>SapoPuto</IconText>
      </StyledContainer>
    </>
  );
};

export default Menu;
