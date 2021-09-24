import { Avatar, AvatarGroup, Badge, useTheme } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useAuth } from '../firabase'

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: theme.palette.success[theme.palette.mode],
    color: theme.palette.success[theme.palette.mode],
    boxShadow: `0 0 0 2px ${ theme.palette.background.paper }`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}))

export default function RoomMembers({ room, currentUser }) {
  if (!room || !room.users) return false
  const theme = useTheme()
  const { user } = useAuth()

  return <div>
    <AvatarGroup max={ 4 }>
      { Object.values(room.users).map((user) => {
        const avatar = <Avatar
          key={ user.uid }
          alt={ user.name }
          src={ user.photo }
          sx={ {
            opacity: currentUser === undefined ? '1' : currentUser === user.uid ? '1' : '0.3',
            transition: theme.transitions.create('opacity'),
          } }
        />

        return !user.ready ? avatar : <StyledBadge
          key={ user.uid }
          overlap="circular"
          anchorOrigin={ { vertical: 'bottom', horizontal: 'right' } }
          variant="dot"
        >
          { avatar }
        </StyledBadge>
      }) }
    </AvatarGroup>
  </div>
}
