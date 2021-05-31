import { NotificationCon, TextCon } from "./styles"
import Props from './types'

const NotificationContainer: React.FC<Props> = (props) => {
  return (
    <>
      <NotificationCon>
        <TextCon>
          {props.username} has sent you a friend request
        </TextCon>
        <button onClick={() => props.accept(props.id)}>Accept</button>
      </NotificationCon>
  </>);
}
export default NotificationContainer