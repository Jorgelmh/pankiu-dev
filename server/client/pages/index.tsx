import React, { useState, useEffect } from 'react'
import SocketQueue from '../src/SocketQueue'
export enum searchParam {
  only_counselor,
  counselor_or_happy,
  other_people,
}
const HomePage = () => {
  let socket: SocketQueue
  useEffect(() => {
    socket = new SocketQueue((roomId) => console.log(roomId))
  })

  return (
    <>
      <h1>Home Page</h1>
      <button
        onClick={() =>
          socket.queuePatient('randomtoken1', searchParam.only_counselor)
        }
      >
        Queue Patient
      </button>
      <button onClick={() => socket.queueCounselor('randomtoken2')}>
        Queue Counselor{' '}
      </button>
    </>
  )
}

export default HomePage
