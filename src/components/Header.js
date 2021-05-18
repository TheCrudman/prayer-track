import React from 'react'

export default function Header({ user, setUser }) {
  return (
    <div>
      <h1 className="f2-l mb1">
        PrayerTrack{' '}
        <span role="img" aria-label="Checkmark">
          🙏
        </span>
      </h1>
      {/* Welcome, {user}!<button onClick={() => setUser('')}>Logout</button> */}
      {user && (
        // `Welcome ${user}`
        <div className="pb3">
          Welcome {user}! <button onClick={() => setUser('')}>Logout</button>
        </div>
      )}
    </div>
  )
}
