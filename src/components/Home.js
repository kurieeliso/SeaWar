import { useState, Fragment, useEffect } from 'react'
import {
  Typography,
  TextField,
  Button,
  Stack,
  List,
  ListItemAvatar,
  Avatar, ListItemText, Divider, Card, ListItemButton,
} from '@mui/material'
import { db, useAuth } from '../firabase'


export default function Home() {
  const [rooms, setRooms] = useState([])
  const [roomName, setRoomName] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    const roomsUnsubscribe = db.on('/rooms', (rooms) => {
      if (!rooms) return
      setRooms(Object.values(rooms))
    })

    return () => {
      roomsUnsubscribe()
    }
  }, [])

  if (!user) {
    return 'PNX!'
  }

  console.log(rooms)
  return <>
    <Stack
      sx={ {
        marginTop: 8,
        marginBottom: 4,
        textAlign: 'center'
      } }
    >
      <Typography variant={ 'h3' }>Welcome to</Typography>
      <Typography variant={ 'h3' }>Sea War!</Typography>
    </Stack>


    <Stack direction="row" spacing={ 2 } justifyContent={ 'center' }>
      <TextField
        id="room-name"
        label="Room name"
        variant="outlined"
        value={ roomName }
        onChange={ (e) => setRoomName(e.target.value) }
      />
      <Button
        variant={ "contained" }
        size={ 'large' }
        onClick={ () => {
          if (roomName) {
            db.createRoom(roomName)
            setRoomName('')
          }
        } }
      >Create</Button>
    </Stack>

    <Typography
      variant={'h2'}
      textAlign={ 'center' }
      paddingTop={ 8 }
    >
      Available rooms
    </Typography>

    <Card>
      <List>
        { rooms.map((room, index) => <Fragment key={ room.id }>
          <ListItemButton alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt={ room.author.name } src={ room.author.photo } />
            </ListItemAvatar>
            <ListItemText
              primary={ room.name }
              secondary={
                <>
                  <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    { room.author.name }
                  </Typography>
                  {` Peoples: ${ (room.peoples || 0) } / ${ room.size || '∞' } `}
                </>
              }
            />
          </ListItemButton>
          { index < rooms.length - 1 && <Divider variant="inset" component="li" /> }
        </Fragment>) }
      </List>
    </Card>
  </>
}
