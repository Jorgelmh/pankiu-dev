import { Badge, BadgeContainer } from "@progress/kendo-react-indicators"
import Title from "components/atoms/title"
import NotificationContainer from "components/molecules/Notificationbar"
import { NotificationCon } from "components/molecules/Notificationbar/styles"
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