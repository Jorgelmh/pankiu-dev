import Title from "components/atoms/title"
import NotificationContainer from "components/molecules/Notificationbar"
import TopBar from "../topbar"

const Notification: React.FC = () => {
  return (
    <>
    <TopBar/>
    <Title margin='20px 0px 0px 30px'> Notifications</Title>
      <NotificationContainer/>
      <NotificationContainer/>
      <NotificationContainer/>
      <NotificationContainer/>
      <NotificationContainer/>
      <NotificationContainer/>
    </>);
}
  
export default Notification;