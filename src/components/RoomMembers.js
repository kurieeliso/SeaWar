import { Chip, Avatar, Box } from '@mui/material'

export default function RoomMembers({ room }) {
  if (!room || !room.users) return false

  return <Box sx={ { marginBottom: 2 } }>
    { Object.values(room.users).map((user) => <Chip
      key={ user.uid }
      avatar={<Avatar alt={ user.name } src={ user.photo } />}
      label={ user.name }
      color={ user.ready ? 'success' : undefined }
    />) }
  </Box>
}
