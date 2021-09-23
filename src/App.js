import { useMemo } from 'react'
import { useMediaQuery, createTheme, ThemeProvider, CssBaseline, Container } from '@mui/material'
import blue from '@mui/material/colors/blue'
import teal from '@mui/material/colors/teal'
import Header from './components/Header'
import Editor from './components/Editor'

export default function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  const theme = useMemo(() =>
    createTheme({
      palette: {
        primary: blue,
        secondary: teal,
        mode: prefersDarkMode ? 'dark' : 'light',
      },
    }), [prefersDarkMode])

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
        <Editor/>
      </Container>

      {/*<Home />*/ }
    </ThemeProvider>
  )
}
