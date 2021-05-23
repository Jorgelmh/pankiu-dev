import { StyledContainer } from "./styles";
import IconText from "components/molecules/icontext";
import home from '../../../img/home.svg'
import mood from '../../../img/mood.svg'
import notification from '../../../img/notification.svg'
import chat from '../../../img/chat.svg'
import Anchor from 'components/atoms/anchor'

const Menu: React.FC = () => {
  return (
    <>
      <StyledContainer>
        <Anchor to='/'>
          <IconText src={home} alt='Home'>Home</IconText>
        </Anchor>
        <Anchor to='/mood'>
          <IconText src={mood} alt='Mood'>Mood</IconText>
        </Anchor>
        <Anchor to='/chats'>
          <IconText src={chat} alt='Chats'>Chats</IconText>
        </Anchor>
        <Anchor to='/notification'>
          <IconText src={notification} alt='Notification'>Notification</IconText>
        </Anchor>
      </StyledContainer>
    </>
  );
};

export default Menu;
