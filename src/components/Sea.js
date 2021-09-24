import { Card, Badge } from '@mui/material'
import { useTheme } from '@emotion/react'
import { Stage, Layer, Rect, Text, Group, Line } from 'react-konva'
import AutoSizer from 'react-virtualized-auto-sizer'
import { useMemo, useCallback, useState, useEffect } from 'react'
import { times } from 'ramda'
import { styled } from '@mui/material/styles'

const StyledSea = styled("div")(({ theme }) => ({
  '&': {
    opacity: '0.5',
    transition: theme.transitions.create('opacity'),
  },
  '&.active': {
    opacity: '1'
  }
}))

function Helpers({ direction, count, cs, coordFn, theme }) {
  return times((index) => {
    return <Group key={ index } listening={ false }>
      { index < count && <>
        <Text
          fontSize={ cs * 0.6 }
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
  const d = s * 0.35

  return <Group>
    <Line
      points={ [x + d, y + d, x + s - d, y + s - d] }
      stroke={ color }
    />

    <Line
      points={ [x + s - d, y + d, x + d, y + s - d] }
      stroke={ color }
    />
  </Group>
}

function SeaCanvas({ width, height, size, ships, misses, showShips, active, onFire }) {
  const theme = useTheme()

  const cs = useMemo(() => {
    return width / (size + 1)
  }, [width, size])

  const coord = useCallback((val) => {
    return (val + 1) * cs
  }, [cs])

  const handleClick = useCallback((e) => {
    if (!active) return

    const target = e.evt.touches && e.evt.touches.length ? e.evt.touches[0] : e.evt
    const bounds = target.target.getBoundingClientRect()

    const x = Math.floor((target.clientX - bounds.x) / cs) - 1
    const y = Math.floor((target.clientY - bounds.y) / cs) - 1
    onFire(x, y)
  }, [cs, onFire, active])

  return <StyledSea className={ active ? 'active' : undefined }>
    <Stage width={ width } height={ height }>
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
                showShips ? theme.palette.primary[theme.palette.mode] : 'transparent' }
          />) }
        </Group>) }

        { misses.map(({ x, y }, i) => <Miss
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
  </StyledSea>
}

export default function Sea({ ships, misses, size = 10, onFire, active, showShips }) {
  return <Card
    sx={ {
      aspectRatio: '1 / 1',
      maxWidth: '80%',
      marginBottom: 2,
      marginLeft: 'auto',
      marginRight: 'auto',
      p: 2,
    } }
  >
    <AutoSizer>
      { ({ width, height }) => <SeaCanvas
        width={ width }
        height={ height }
        size={ size }
        ships={ ships }
        misses={ misses }
        onFire={ onFire }
        showShips={ showShips }
        active={ active }
      /> }
    </AutoSizer>
  </Card>
}
