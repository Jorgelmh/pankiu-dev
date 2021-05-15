import React, { useEffect } from 'react'
import { useRouter } from 'next/router'

const Id = () => {
  const router = useRouter()

  useEffect(() => {
    import('../src/SocketRoom').then(({ default: SocketRoom }) => {
      const peerId = localStorage.getItem('guestid')

      const videoGrid = document.getElementById('video-grid')

      /* Create socket communication instance */
      const roomid = router.query.roomid
      if (typeof roomid == 'string' && peerId && videoGrid) {
        console.log(peerId)
        const socket = new SocketRoom(roomid, peerId, videoGrid)
        socket.enterSocketRoom()
      }
    })
  }, [])

  return (
    <>
      <h1>Testing page {router.query.roomid}</h1>
      <div id="video-grid"></div>
      <button id="call">call</button>
    </>
  )
}

export default Id
