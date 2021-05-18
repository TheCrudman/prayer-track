import React from 'react'
import { useQuery, useMutation, gql } from '@apollo/client'
import DayJS from 'react-dayjs'
import Login from './components/Login'
import Header from './components/Header'

export const UserContext = React.createContext()

const GET_PRAYERS = gql`
  query getPrayers {
    prayers {
      text
      answered
      id
      added_by
      created_at
    }
  }
`

const TOGGLE_PRAYER = gql`
  mutation toggleTodo($id: uuid!, $answered: Boolean!) {
    update_prayers(where: { id: { _eq: $id } }, _set: { answered: $answered }) {
      returning {
        added_by
        answered
        created_at
        id
        text
      }
    }
  }
`

const ADD_PRAYER = gql`
  mutation addPrayer($added_by: String = "", $text: String = "") {
    insert_prayers(objects: { text: $text, added_by: $added_by }) {
      returning {
        added_by
        answered
        created_at
        id
        text
      }
    }
  }
`

const DELETE_PRAYER = gql`
  mutation deletePrayer($id: uuid!) {
    delete_prayers(where: { id: { _eq: $id } }) {
      returning {
        added_by
        answered
        created_at
        id
        text
      }
    }
  }
`

// list todos

// add todos

// toggle todos

// delete todos

function App() {
  const [user, setUser] = React.useState('')
  const [prayerText, setPrayerText] = React.useState('')
  const { data, loading, error } = useQuery(GET_PRAYERS)
  const [togglePrayer] = useMutation(TOGGLE_PRAYER)
  const [addPrayer] = useMutation(ADD_PRAYER, {
    onCompleted: () => setPrayerText(''),
  })
  const [deletePrayer] = useMutation(DELETE_PRAYER)

  // function handleToggleTodo(todo) {
  //   toggleTodo({ variables: { id: todo.id, done: !todo.done } }).then((data) =>
  //     console.log(data)
  // }
  async function handleTogglePrayer({ id, answered }) {
    const data = await togglePrayer({ variables: { id, answered: !answered } })
    console.log('toggled prayer status', data)
  }

  async function handleAddPrayer(event) {
    event.preventDefault()
    if (!prayerText.trim()) return

    const data = await addPrayer({
      variables: { text: prayerText, added_by: user },
      refetchQueries: [{ query: GET_PRAYERS }],
    })
    console.log('added prayer', data)
    // setTodoText('')
  }

  async function handleDeletePrayer({ id }) {
    const isConfirmed = window.confirm(
      'Do you want to delete this prayer item?'
    )
    if (isConfirmed) {
      const data = await deletePrayer({
        variables: { id },
        update: (cache) => {
          const prevData = cache.readQuery({ query: GET_PRAYERS })
          const newPrayers = prevData.prayers.filter(
            (prayer) => prayer.id !== id
          )
          cache.writeQuery({
            query: GET_PRAYERS,
            data: { prayers: newPrayers },
          })
        },
      })
      console.log('deleted prayer item', data)
    }
  }

  if (loading) return <div>Loading items to pray for...</div>
  if (error) return <div>Error fetching the prayer list</div>
  return (
    <UserContext.Provider value={user}>
      <div className="vh-100 code flex flex-column items-center bg-dark-blue white pa3 fl-1">
        <Header user={user} setUser={setUser} />

        {!user ? (
          <Login setUser={setUser} />
        ) : (
          <div>
            <form onSubmit={handleAddPrayer} className="mb3">
              <input
                className="pa2 f4 b--dashed"
                type="text"
                placeholder="Pray about..."
                onChange={(event) => setPrayerText(event.target.value)}
                value={prayerText}
              />
              &nbsp;
              <button className="pa2 f4 bg-green" type="submit">
                Add
              </button>
            </form>
            {/* Todo list */}
          </div>
        )}
        <div className="flex items-center justify-center flex-column">
          {data.prayers.map((prayer) => (
            <p onDoubleClick={() => handleTogglePrayer(prayer)} key={prayer.id}>
              &nbsp;
              <span
                className={`pointer list pa1 f3 ${prayer.answered && 'strike'}`}
              >
                {prayer.text}
              </span>{' '}
              {prayer.answered && (
                <span className="pa1 bg-orange f5">🙌 Answered!</span>
              )}
              &nbsp;
              <button
                onClick={() => handleDeletePrayer(prayer)}
                className="bg-transparent bn f4"
              >
                <span className="red">&times;</span>
              </button>
              <br />
              <span className="f6">
                ({prayer.added_by},&nbsp;
                <DayJS format="D MMM YYYY">{prayer.created_at}</DayJS>)
              </span>
            </p>
          ))}
        </div>
      </div>
    </UserContext.Provider>
  )
}

export default App
