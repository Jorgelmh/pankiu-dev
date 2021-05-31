import { StyledContainer } from "./styles";
import IconText from "components/molecules/icontext";
import home from '../../../img/home.svg'
import key from '../../../img/key.svg'
import Anchor from 'components/atoms/anchor'

const Menulogin: React.FC = () => {
  return (
    <>
      <StyledContainer>
        <Anchor to='/'>
          <IconText src={home} alt='Home'>Home</IconText>
        </Anchor>
        <Anchor to='/login'>
          <IconText src={key} alt='login'>Login</IconText>
        </Anchor>
      </StyledContainer>
    </>
  );
};

export default Menulogin;
