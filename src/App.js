import { useMemo, useState, useCallback, useEffect } from 'react'
import { useMediaQuery, createTheme, ThemeProvider, CssBaseline } from '@mui/material'
import { blue, teal, red } from '@mui/material/colors'
import Header from './components/Header'
import Home from './components/Home'
import Editor from './components/Editor'
import { db, useAuth } from './firabase'
import Battle from './components/Battle'
import Auth from './components/Auth'

export default function App() {
  const { user } = useAuth()

  const [rooms, setRooms] = useState([])
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  // const [route, setRoute] = useState('home')
  const [route, setRoute] = useState('home')
  const [roomId, setRoomId] = useState(null)

  const theme = useMemo(() => createTheme({
    palette: {
      primary: {
        main: blue.A400,
      },
      secondary: {
        main: teal.A400,
      },
      error: {
        main: red.A400,
      },
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
    if (!user) return <Auth />

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
  }, [roomId, rooms, route, user])

  return (
    <ThemeProvider theme={ theme }>
      <CssBaseline/>
      <Header
        inRoom={ !!roomId }
        onProfileClick={ () => {} }
        onLeaveRoomClick={ () => {
          setRoute('home')
          setRoomId(undefined)
          // TODO mark user in room as idle
        } }
      />
      { renderRoute(route) }
    </ThemeProvider>
  )
}
