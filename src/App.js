import { useMemo, useState, useCallback, useEffect } from 'react'
import { useMediaQuery, createTheme, ThemeProvider, CssBaseline, Container } from '@mui/material'
import blue from '@mui/material/colors/blue'
import teal from '@mui/material/colors/teal'
import Header from './components/Header'
import Home from './components/Home'
import Editor from './components/Editor'
import { db } from './firabase'
import Battle from './components/Battle'

export default function App() {
  const [rooms, setRooms] = useState([])
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  // const [route, setRoute] = useState('home')
  const [route, setRoute] = useState('home')
  const [roomId, setRoomId] = useState(null)

  const theme = useMemo(() => createTheme({
    palette: {
      primary: blue,
      secondary: teal,
      mode: prefersDarkMode ? 'dark' : 'light',
    },
  }), [prefersDarkMode])

  useEffect(() => {
    const roomsUnsubscribe = db.on('/rooms', (rooms) => {
      if (!rooms) return
      setRooms(Object.values(rooms).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)))
    })

    return () => {
      roomsUnsubscribe()
    }
  }, [])

  useEffect(() => {
    const r = rooms.find(({ id }) => roomId)
    if (!r) setRoute('home')
  }, [rooms])

  const renderRoute = useCallback((route) => {
    switch (route) {
      case 'home':
        return <Home rooms={ rooms } onRoomChanged={ (room) => {
          setRoomId(room.id)
          setRoute('editor')
        } }/>
      case 'editor':
        return <Editor
          room={ rooms.find(({ id }) => roomId) }
          onAllUsersReady={ () => setRoute('battle') }
        />
      case 'battle':
        return <Battle room={ rooms.find(({ id }) => roomId) } />
    }
  }, [roomId, rooms, route])

  return (
    <ThemeProvider theme={ theme }>
      <CssBaseline/>
      <Header/>

      <Container
        maxWidth="sm"
        sx={ {
          marginTop: 2,
        } }
      >
        { renderRoute(route) }
      </Container>
    </ThemeProvider>
  )
}
