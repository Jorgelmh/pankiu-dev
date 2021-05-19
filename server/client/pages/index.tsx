import React, { useState, useEffect } from 'react'
import SocketQueue from '../src/SocketQueue'
import { useRouter } from 'next/router'
import Button from '@atoms/button'

export enum searchParam {
  only_counselor,
  counselor_or_happy,
  other_people,
}
enum Language {
  Spanish,
  English,
}

const jwt =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJFeGFtcGxlIiwiZW1haWwiOiJleGFtcGxlQG1haWwuY29tIiwiaXNBZG1pbiI6ZmFsc2UsInJhdGUiOjV9.j99UPXCrRpCaU4R45ziBwZWaQYNUmqnuSclRZAXed94'

export enum Mood {
  Normal = 'Normal',
  Depressed = 'Depressed',
  Anxious = 'Anxious',
  Stressed = 'Stressed',
  Lonely = 'Lonely',
  Happy = 'Happy',
}

const HomePage = () => {
  let socket: SocketQueue
  const router = useRouter()

  useEffect(() => {
    socket = new SocketQueue((roomid) =>
      router.push({
        pathname: '/testing',
        query: {
          roomid,
        },
      })
    )
  })

  return (
    <>
      <h1>Home Page</h1>
      <Button
        onClick={() =>
          socket.queueGuest(
            'name',
            Mood.Depressed,
            searchParam.only_counselor,
            [Language.English]
          )
        }
      >
        Queue Patient
      </Button>
      <Button
        onClick={() => {
          localStorage.setItem('token', jwt)
          socket.queueCounselor(jwt, [Language.English])
        }}
      >
        Queue Counselor{' '}
      </Button>
    </>
  )
}

export default HomePage
