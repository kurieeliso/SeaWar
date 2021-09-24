import { useCallback } from 'react'
import RoomMembers from './RoomMembers'
import Sea from './Sea'
import { useAuth, db } from '../firabase'
import { pathOr } from 'ramda'

export default function Battle({ room }) {
  const { user } = useAuth()

  const handleFire = useCallback((uid) => (x, y) => {
    const shoots = pathOr([], ['shoots', uid], room)
    const misses = pathOr([], ['misses', uid], room)
    const ships = pathOr([], ['users', uid, 'ships'], room)

    shoots.push({ x, y, uid: user.uid })
    misses.push({ x, y, uid: user.uid })

    let shipFound = false
    const updatedShips = ships.map((ship) => {
      let paddedCount = 0
      const coords = ship.coords.map((coords) => {
        const found = coords.x === x && coords.y === y
        if (found) shipFound = true

        const updatedCoords = {
          x: coords.x,
          y: coords.y,
          padded: coords.padded || found
        }

        if (updatedCoords.padded) paddedCount++
        return updatedCoords
      })

      return {
        ...ship,
        coords,
        killed: paddedCount === coords.length,
      }
    })

    if (!shipFound) {
      const uids = Object.keys(room.users)
      let nextUser = uids.indexOf(user.uid) + 1
      if (nextUser === uids.length) nextUser = 0
      db.set(`/rooms/${ room.id }/misses/${ uid }`, misses)
      db.set(`/rooms/${ room.id }/currentUser`, uids[nextUser])
    } else {
      db.update(`/rooms/${ room.id }/users/${ uid }`, { ships: updatedShips })
    }

    db.set(`/rooms/${ room.id }/shoots/${ uid }`, shoots)
  }, [user, room])

  return <div>
    <RoomMembers currentUser={ room.currentUser } room={ room } />

    { Object.keys(room.users).filter((v) => v !== user.uid).map((uid) => {
      const u = room.users[uid]

      return <Sea
        key={ uid }
        ships={ u.ships || [] }
        misses={ pathOr([], ['misses', uid], room) }
        onFire={ handleFire(u.uid) }
        showShips={ false }
        active={ room.currentUser === user.uid }
      />
    }) }
  </div>
}
