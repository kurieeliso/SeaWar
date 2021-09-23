import { Card } from '@mui/material'
import { useTheme } from '@emotion/react'
import { Stage, Layer, Rect, Text, Group, Line, Circle } from 'react-konva'
import AutoSizer from 'react-virtualized-auto-sizer'
import { useMemo, useCallback, useState } from 'react'
import { times } from 'ramda'

function convertRemToPixels(rem) {
  rem = rem.substr(0, rem.length - 3) * 1

  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize)
}

function Helpers({ direction, count, cs, coordFn, theme }) {
  return times((index) => {
    return <Group key={ index } listening={ false }>
      { index < count && <>
        <Text
          fontSize={ convertRemToPixels(theme.typography.h6.fontSize) }
          fontFamily={ theme.typography.h6.fontFamily }
          x={ coordFn(direction === 'row' ? index : -1) }
          y={ coordFn(direction === 'col' ? index : -1) }
          width={ cs }
          height={ cs }
          fill={ theme.palette.text.secondary }
          text={ direction === 'row' ? (index + 1) : String.fromCharCode(65 + index) }
          align={ 'center' }
          verticalAlign={ 'middle' }
        />

        <Text
          fontSize={ convertRemToPixels(theme.typography.h6.fontSize) }
          fontFamily={ theme.typography.h6.fontFamily }
          x={ coordFn(direction === 'row' ? index : count) }
          y={ coordFn(direction === 'col' ? index : count) }
          width={ cs }
          height={ cs }
          fill={ theme.palette.text.secondary }
          text={ direction === 'row' ? (index + 1) : String.fromCharCode(65 + index) }
          align={ 'center' }
          verticalAlign={ 'middle' }
        />
      </> }

      <Line
        points={ [
          coordFn(direction === 'row' ? index : 0),
          coordFn(direction === 'col' ? index : 0),
          coordFn(direction === 'row' ? index : count),
          coordFn(direction === 'col' ? index : count),
        ] }
        strokeWidth={ 1 }
        stroke={ theme.palette.divider }
      />
    </Group>
  }, count + 1)
}

function ShipPiece({ x, y, s, color }) {
  return <Rect
    x={ x + s * 0.1 }
    y={ y + s * 0.1 }
    width={ s - s * 0.2 }
    height={ s - s * 0.2 }
    fill={ color }
    cornerRadius={ s * 0.1 }
  />
}

function Miss({ x, y, s, color }) {
  return <Circle
    x={ x + s / 2 }
    y={ y + s / 2 }
    radius={ (s * 0.4) / 2 }
    fill={ color }
  />
}

function SeaCanvas({ width, height, size, ships, misses, onFire }) {
  const theme = useTheme()

  const cs = useMemo(() => {
    return width / (size + 2)
  }, [width, size])

  const coord = useCallback((val) => {
    return (val + 1) * cs
  }, [cs])

  const handleClick = useCallback((e) => {
    const x = Math.floor((e.evt.layerX - e.target.attrs.x) / cs)
    const y = Math.floor((e.evt.layerY - e.target.attrs.y) / cs)
    onFire(x, y)
  }, [cs, onFire])

  return <Stage width={ width } height={ height }>
    <Layer>
      <Helpers
        theme={ theme }
        count={ size }
        direction={ 'row' }
        coordFn={ coord }
        cs={ cs }
      />

      <Helpers
        theme={ theme }
        count={ size }
        direction={ 'col' }
        coordFn={ coord }
        cs={ cs }
      />

      { ships.map(({ killed, coords }, i) => <Group key={ i }>
        { coords.map(({ x, y, padded }, j) => <ShipPiece
          key={ j }
          x={ coord(x) }
          y={ coord(y) }
          s={ cs }
          color={ killed ?
            theme.palette.error[theme.palette.mode] :
            padded ? theme.palette.warning[theme.palette.mode] :
            theme.palette.primary[theme.palette.mode] }
        />) }
      </Group>) }

      { misses.map(([x, y], i) => <Miss
        key={ i }
        x={ coord(x) }
        y={ coord(y) }
        s={ cs }
        color={ theme.palette.divider }
      />) }

      <Rect
        x={ coord(0) }
        y={ coord(0) }
        width={ coord(size - 1) }
        height={ coord(size - 1) }
        // fill={'rgba(255, 0, 0, 0.2)'}
        onMouseDown={ handleClick }
        onTouchStart={ handleClick }
      />
    </Layer>
  </Stage>
}

export default function Sea({ size = 10 }) {
  const [ships, setShips] = useState([
    {
      killed: false,
      coords: [{
        x: 0, y: 0,
        padded: true,
      }, {
        x: 0, y: 1,
      }, {
        x: 0, y: 2,
        padded: true,
      }, {
        x: 0, y: 3,
      }]
    },
    {
      killed: false,
      coords: [{
        x: 7, y: 6,
      }, {
        x: 8, y: 6,
      }, {
        x: 9, y: 6,
      }]
    },
    {
      killed: true,
      coords: [{
        x: 5, y: 0,
        padded: true,
      }, {
        x: 5, y: 1,
        padded: true,
      }]
    },
  ])
  const [misses, setMisses] = useState([[4, 7]])

  const checkFire = useCallback((x, y) => {
    let shipFound = false
    setShips(ships.map((ship) => {
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
    }))

    if (!shipFound) {
      setMisses([...misses, [x, y]])
    }
  }, [ships, misses])

  return <Card sx={ { aspectRatio: '1 / 1' } }>
    <AutoSizer>
      { ({ width, height }) => <SeaCanvas
        width={ width }
        height={ height }
        size={ size }
        ships={ ships }
        misses={ misses }
        onFire={ checkFire }
      /> }
    </AutoSizer>
  </Card>
}
