import Title from "components/atoms/title"
import NotificationContainer from "components/molecules/Notificationbar"
import TopBar from "../topbar"
import FriendRequest from '../../../interfaces/FriendRequest'
import { useEffect, useState } from "react"
import Skeleton from 'react-loading-skeleton'

const Notification: React.FC = () => {

  /* State to store the notifications */
  const [notifications, setNotifications] = useState<FriendRequest[]>([])
  const [fetched, setFetched] = useState(false)

  /* Accept a friend request */
  const handleAccept = async (id: number) : Promise<void> => {
    
    /* Ajax request options */
    const options: RequestInit = {
      method: "PUT", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        "token": String(localStorage.getItem('token'))
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify({ uid: id })
    };

    /* Communicate with the API */
    const response = await fetch('/api/acceptfriend', options)
    const data = await response.json()

    if(!data.ok)
      alert(data.message)
    else{
      /* Remove friend request from notifications */
      const index = notifications.findIndex((req) => req.id === id)
      setNotifications(notifications.splice(index, 1))
    }
  }

  /* Once loaded fetch information from the API */
  useEffect(() => {

    /* Ajax request options */
    const options: RequestInit = {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        "token": String(localStorage.getItem('token'))
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    };

    fetch('/api/notification', options)
      .then(response => response.json())
      .then(data => {
        if(!data.ok)
          alert(data.message)
        else{
          setNotifications(data.requests)
          setFetched(true)
        }
      })
  })

  if(!fetched){
    return (
      <>
        <Title margin='20px 0px 0px 30px'> Notifications</Title>
        <Skeleton count={5} />
      </>);
  }else{
    return (
      <>
        <Title margin='20px 0px 0px 30px'> Notifications</Title>
        {
          notifications.length == 0 ? `You don't have any notification right now` : notifications.map((noti) => <NotificationContainer id={noti.id} username={noti.username} accept={handleAccept} />)
        }
      </>
    )
  }
}
  
export default Notification;