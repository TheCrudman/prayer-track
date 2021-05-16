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
      category
      answered
      id
      added_by
      created_at
    }
  }
`

const TOGGLE_TODO = gql`
  mutation toggleTodo($id: uuid!, $done: Boolean!) {
    update_todos(where: { id: { _eq: $id } }, _set: { done: $done }) {
      returning {
        done
        id
        text
      }
    }
  }
`

const ADD_TODO = gql`
  mutation addTodo($text: String!) {
    insert_todos(objects: { text: $text }) {
      returning {
        done
        id
        text
      }
    }
  }
`

const DELETE_TODO = gql`
  mutation deleteTodo($id: uuid!) {
    delete_todos(where: { id: { _eq: $id } }) {
      returning {
        done
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
  const [user, setUser] = React.useState('will')
  const [todoText, setTodoText] = React.useState('')
  const { data, loading, error } = useQuery(GET_PRAYERS)
  const [toggleTodo] = useMutation(TOGGLE_TODO)
  const [addTodo] = useMutation(ADD_TODO, {
    onCompleted: () => setTodoText(''),
  })
  const [deleteTodo] = useMutation(DELETE_TODO)

  // function handleToggleTodo(todo) {
  //   toggleTodo({ variables: { id: todo.id, done: !todo.done } }).then((data) =>
  //     console.log(data)
  // }
  async function handleToggleTodo({ id, done }) {
    const data = await toggleTodo({ variables: { id, done: !done } })
    console.log('toggled todo', data)
  }

  async function handleAddTodo(event) {
    event.preventDefault()
    if (!todoText.trim()) return

    const data = await addTodo({
      variables: { text: todoText },
      refetchQueries: [{ query: GET_PRAYERS }],
    })
    console.log('added todo', data)
    // setTodoText('')
  }

  async function handleDeleteTo({ id }) {
    const isConfirmed = window.confirm('Do you want to delete this todo?')
    if (isConfirmed) {
      const data = await deleteTodo({
        variables: { id },
        update: (cache) => {
          const prevData = cache.readQuery({ query: GET_PRAYERS })
          const newTodos = prevData.todos.filter((todo) => todo.id !== id)
          cache.writeQuery({ query: GET_PRAYERS, data: { todos: newTodos } })
        },
      })
      console.log('deleted todo', data)
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
            <form onSubmit={handleAddTodo} className="mb3">
              <input
                className="pa2 f4 b--dashed"
                type="text"
                placeholder="Pray about..."
                onChange={(event) => setTodoText(event.target.value)}
                value={todoText}
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
            <p onDoubleClick={() => handleToggleTodo(prayer)} key={prayer.id}>
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
                onClick={() => handleDeleteTo(prayer)}
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
