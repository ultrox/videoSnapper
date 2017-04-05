import React from 'react'

export default function Duration ({ className, seconds }) {
  return (
    <time dateTime={`P${Math.round(seconds)}S`} className={className}>
		<p>What is this</p>
      {format(seconds)}
    </time>
  )
}

function format (seconds) {

  const date = new Date(seconds * 1000)
  const hh = date.getUTCHours()
  const mm = date.getUTCMinutes()
  const ss = pad(date.getUTCSeconds())
  const ms = date.getUTCMilliseconds()
  if (hh) {
    return `${hh}:${pad(mm)}:${ss}`
  }
  return `${mm}:${ss}:${ms}`
}

function pad (string) {
  return ('0' + string).slice(-2)
}
