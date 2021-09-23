import { Container, Typography, TextField, Box, Button, Stack } from '@mui/material'

export default function Home() {
  return <>
    <Stack
      sx={ {
        marginTop: 16,
        marginBottom: 4,
        textAlign: 'center'
      } }
    >
      <Typography variant={ 'h3' }>Welcome to</Typography>
      <Typography variant={ 'h3' }>Sea War!</Typography>
    </Stack>


    <Stack direction="row" spacing={ 2 } justifyContent={ 'center' }>
      <TextField id="outlined-basic" label="Room name" variant="outlined"/>
      <Button variant={ "contained" } size={ 'large' }>Create / Join</Button>
    </Stack>
  </>
}
