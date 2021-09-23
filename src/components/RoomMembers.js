import { Chip, Avatar, Stack } from '@mui/material'
import { useAuth } from '../firabase'

export default function RoomMembers({ room, currentUser }) {
  if (!room || !room.users) return false
  const { user } = useAuth()

  return <Stack
    direction={ 'row' }
    sx={ { marginBottom: 2 } }
    spacing={ 1 }
    overflow={ 'auto' }
  >
    { Object.values(room.users).map((user) => <Chip
      key={ user.uid }
      avatar={ <Avatar alt={ user.name } src={ user.photo }/> }
      label={ user.name }
      color={ currentUser ? (
        currentUser === user.uid ? 'success' : undefined
      ) : user.ready ? 'success' : undefined }
    />) }
  </Stack>
}
