import { Chip, Avatar, Box } from '@mui/material'

export default function RoomMembers({ room }) {
  // console.log(room.users)

  return <Box sx={ { marginBottom: 2 } }>
    {/*{ room.users.map((user) => <Chip*/}
    {/*  key={ user.uid }*/}
    {/*  avatar={<Avatar alt={ user.name } src={ user.photo } />}*/}
    {/*  label={ user.name }*/}
    {/*  color={ user.ready ? 'success' : undefined }*/}
    {/*/>) }*/}
  </Box>
}
