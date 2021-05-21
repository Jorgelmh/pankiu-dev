import * as React from 'react'

function Star(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={15}
      height={15}
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M1.725 7.543s4.9-1.454 5.627-5.217c0 0 1.64 5.17 6.148 5.142 0 0-5.813.895-6.148 6.782 0 0 .298-6.037-5.627-6.707z"
        fill="#9795F1"
      />
      <path
        d="M.75 8.25c3.308 0 6 2.692 6 6a.75.75 0 001.5 0c0-3.308 2.692-6 6-6a.75.75 0 000-1.5c-3.308 0-6-2.692-6-6a.75.75 0 00-1.5 0c0 3.308-2.692 6-6 6a.75.75 0 000 1.5zM7.5 4.018A7.55 7.55 0 0010.982 7.5 7.55 7.55 0 007.5 10.982 7.55 7.55 0 004.018 7.5 7.55 7.55 0 007.5 4.018z"
        fill="#9795F1"
      />
    </svg>
  )
}

export default Star
