import React from 'react'

export default function Login({ setUser }) {
  const [username, setUsername] = React.useState('')

  function handleSubmit(event) {
    event.preventDefault()
    setUser(username)
  }

  return (
    <div className="code flex flex-column items-center bg-dark-blue white pa3 fl-1">
      <h2 className="f6">Please enter your name to add a prayer request</h2>
      <form className="mb3" onSubmit={handleSubmit}>
        <input
          onChange={(event) => setUsername(event.target.value)}
          placeholder="My name is..."
          type="text"
        />
        &nbsp;
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}
