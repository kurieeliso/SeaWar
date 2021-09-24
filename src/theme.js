import { blue, teal, red } from '@mui/material/colors'
import { createTheme } from '@mui/material/styles'

const theme = createTheme({
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
  },
})

export default theme
