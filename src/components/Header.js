import { AppBar, Toolbar, IconButton, Typography, Tooltip } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import { useAuth } from '../firabase'

export default function Header({ inRoom, onLeaveRoomClick, onProfileClick }) {
  const { user } = useAuth()

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
      { !!user && <IconButton
        aria-label="account"
        alt={ user.displayName }
        onClick={ onProfileClick }
      >
        <AccountCircleIcon />
      </IconButton> }
      { inRoom && <Tooltip
        title={ 'Leave room' }
        disableInteractive
      >
        <IconButton
        aria-label="leave room"
        onClick={ onLeaveRoomClick }
      >
        <ExitToAppIcon />
        </IconButton>
      </Tooltip> }
    </Toolbar>
  </AppBar>
}
