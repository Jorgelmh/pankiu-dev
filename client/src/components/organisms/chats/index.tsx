import Text from "components/atoms/text"
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
    <img src='img\human-resources-svgrepo-com 3.svg' style={{display:'block', alignContent:'flex-start', margin:'auto 0px auto 10px'}}/>
      <Text margin='auto auto auto auto' size='0.9rem'>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum, dolorem?
      </Text>
      </NotificationCon>
      <NotificationCon>
      <img src='img\human-resources-svgrepo-com 3.svg' style={{display:'block', alignContent:'flex-start', margin:'auto 0px auto 10px'}}/>
      <Text margin='auto auto auto auto' size='0.9rem'>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum, dolorem?
      </Text>        
      </NotificationCon>
      <NotificationCon>
      <img src='img\human-resources-svgrepo-com 3.svg' style={{display:'block', alignContent:'flex-start', margin:'auto 0px auto 10px'}}/>
      <Text margin='auto auto auto auto' size='0.9rem'>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum, dolorem?
      </Text>
      </NotificationCon>
      <NotificationCon>
      <img src='img\human-resources-svgrepo-com 3.svg' style={{display:'block', alignContent:'flex-start', margin:'auto 0px auto 10px',}}/>
      <Text margin='auto auto auto auto' size='0.9rem'>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum, dolorem?
      </Text>
      </NotificationCon>
      <NotificationCon>
      <img src='img\human-resources-svgrepo-com 3.svg' style={{display:'block', alignContent:'flex-start', margin:'auto 0px auto 10px'}}/>
      <Text margin='auto auto auto auto' size='0.9rem'>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum, dolorem?
      </Text>
      </NotificationCon>
    
        </>);
}
  
export default Chatspage;