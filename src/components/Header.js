import { AppBar, Toolbar, IconButton, Typography, Button } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { useAuth } from '../firabase'

export default function Header() {
  const { user, login } = useAuth()

  return <AppBar position="static">
    <Toolbar>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        sx={ { mr: 2 } }
      >
        <MenuIcon/>
      </IconButton>
      <Typography variant="h6" component="div" sx={ { flexGrow: 1 } }>
        Sea War
      </Typography>
      { !user ? <Button
        color="inherit"
        onClick={ login }
      >Login</Button> : <Button
        color="inherit"
      >{ user.displayName }</Button> }
    </Toolbar>
  </AppBar>
}
