import Title from "components/atoms/title"
import NotificationContainer from "components/molecules/Notificationbar"
import { NotificationCon } from "components/molecules/Notificationbar/styles"

import TopBar from "../topbar"

const Chatspage: React.FC = () => {
  return (
    <>
    <TopBar/>
    <Title margin='20px 0px 0px 30px'> Chats </Title>
    <NotificationCon>
      <img src='img\human-resources-svgrepo-com 3.svg' style={{display:'flex', justifyContent:'flex-start'}}/>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum, dolorem?
      </NotificationCon>
      <NotificationCon>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum, dolorem?
      </NotificationCon>
      <NotificationCon>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum, dolorem?
      </NotificationCon>
      <NotificationCon>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum, dolorem?
      </NotificationCon>
      <NotificationCon>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum, dolorem?
      </NotificationCon>
    
        </>);
}
  
export default Chatspage;