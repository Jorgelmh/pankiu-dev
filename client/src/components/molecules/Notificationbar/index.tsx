import { NotificationCon, TextCon } from "./styles"
import { Badge, BadgeContainer } from "@progress/kendo-react-indicators"


const NotificationContainer: React.FC = () => {
  return (
    <>

<NotificationCon>
<BadgeContainer style={{display:'flex',justifyContent:'center',width:'100%',paddingTop:'1rem'}}>
  <TextCon>
  Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
  </TextCon>
    <Badge align={{vertical: "top", horizontal: "start"}}>
      10
    </Badge>
    </BadgeContainer>
  </NotificationCon>

    </>);
}
export default NotificationContainer