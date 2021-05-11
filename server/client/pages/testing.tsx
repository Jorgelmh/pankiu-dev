import React, { useEffect } from 'react'
import { useRouter } from 'next/router'

const Id = () => {
  const router = useRouter()

  useEffect(() => {
    import('../src/SocketRoom').then(({ default: SocketRoom }) => {
      const peerId =
        localStorage.getItem('guestid') || localStorage.getItem('token')
      const videoGrid = document.getElementById('video-grid')

      /* Create socket communication instance */
      const roomid = router.query.roomid
      if (typeof roomid == 'string' && peerId && videoGrid) {
        const socket = new SocketRoom(roomid, peerId, videoGrid)
        socket.enterSocketRoom()
      }
    })
  }, [])

  return (
    <>
      <h1>Testing page {router.query.roomid}</h1>
      <div id="video-grid"></div>
    </>
  )
}

export default Id
