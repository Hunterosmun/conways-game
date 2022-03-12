import React from 'react'
import styled from 'styled-components'

// Conways Game of Life

function useAnimationFrame (fn) {
  let stopId = React.useRef()
  let [active, setActive] = React.useState(false)

  function loop () {
    fn()
    stopId.current = window.requestAnimationFrame(loop)
    setActive(true)
  }

  /*
    could have instead made all the functions above, then returned them as an array,
    then when declared in the main function the user can destructure the names out to whatever they want them to be
    IE: [startThing, stoptheTRAIN, running?!!] = useAnimationFrame(func)
  */
  return {
    start: () => loop(),
    stop: () => {
      window.cancelAnimationFrame(stopId.current)
      stopId.current = null
      setActive(false)
    },
    active
  }
}

export default function App () {
  const [numOfRows, setRows] = React.useState(17)
  const [numOfCols, setCols] = React.useState(35)
  const [size, setSize] = React.useState(35)
  const animation = useAnimationFrame(step)
  const [wrap, setWrap] = React.useState(false)
  const [update, trick] = React.useState(0)

  const refRows = React.useRef()
  refRows.current = numOfRows
  const refLiv = React.useRef()
  refLiv.current = refLiv.current || {}
  const refwrap = React.useRef()
  refwrap.current = wrap

  React.useEffect(() => {
    let obj = {}
    for (let i = 0; i < numOfRows * numOfCols; i++) {
      obj[i] = false
    }
    refLiv.current = obj
    trick(Math.random())
  }, [numOfCols, numOfRows])

  function step () {
    let oldLife = { ...refLiv.current }
    const numOfRows = refRows.current
    const numOfCols = Object.keys(refLiv.current).length / numOfRows
    let wrap = refwrap.current

    function at (board, x, y) {
      if (wrap) {
        let _x = (x + numOfCols) % numOfCols
        let _y = (y + numOfRows) % numOfRows
        // console.log({ x, y })
        // console.log(board[_y * numOfCols + _x])
        return board[_y * numOfCols + _x]
      } else {
        if (x === -1 || y === -1 || x === numOfCols || y === numOfRows) {
          return false
        }
        // console.log({ x, y })
        // console.log(board[y * numOfCols + x])
        return board[y * numOfCols + x]
      }
    }

    Object.keys(oldLife).forEach(el => {
      let livingTouch = 0
      const x = +el % numOfCols
      const y = Math.floor(+el / numOfCols)

      //top
      if (at(oldLife, x - 1, y + 1)) livingTouch += 1
      if (at(oldLife, x, y + 1)) livingTouch += 1
      if (at(oldLife, x + 1, y + 1)) livingTouch += 1

      //bottom
      if (at(oldLife, x - 1, y - 1)) livingTouch += 1
      if (at(oldLife, x, y - 1)) livingTouch += 1
      if (at(oldLife, x + 1, y - 1)) livingTouch += 1

      //sides
      if (at(oldLife, x + 1, y)) livingTouch += 1
      if (at(oldLife, x - 1, y)) livingTouch += 1

      // 1) Any live cell with fewer than two live neighbours dies, as if by underpopulation.
      if (oldLife[el] === true && livingTouch < 2) refLiv.current[el] = false

      // 2) Any live cell with two or three live neighbours lives on to the next generation.
      if (oldLife[el] === true && (livingTouch === 3 || livingTouch === 2))
        refLiv.current[el] = true

      // 3) Any live cell with more than three live neighbours dies, as if by overpopulation.
      if (oldLife[el] === true && livingTouch > 3) refLiv.current[el] = false

      // 4) Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
      if (oldLife[el] === false && livingTouch === 3) refLiv.current[el] = true
    })

    trick(Math.random())
  }

  return (
    <Background>
      <TopBox>Conway's Game of Life </TopBox>
      <GridBlock numOfCols={numOfCols} size={size}>
        {Object.keys(refLiv.current).map(el => (
          <Block
            key={el}
            active={refLiv.current[el]}
            size={size}
            onMouseOver={e => {
              if (!e.buttons) return
              let was = refLiv.current[el]
              refLiv.current[el] = !was
              trick(Math.random())
            }}
            onClick={() => {
              let was = refLiv.current[el]
              refLiv.current[el] = !was
              trick(Math.random())
            }}
          />
        ))}
      </GridBlock>
      <BtnBox>
        {!animation.active ? (
          <button
            style={{ backgroundColor: '#90ee90' }}
            onClick={() => {
              animation.start()
            }}
          >
            Start
          </button>
        ) : (
          <button
            style={{ backgroundColor: '#f36060' }}
            onClick={() => {
              animation.stop()
            }}
          >
            Stop
          </button>
        )}
        <button onClick={() => step()}>Step</button>
        <button
          onClick={() => {
            Object.keys(refLiv.current).forEach(el => {
              if (Math.floor(Math.random() * 10) > 5) refLiv.current[el] = true
              else refLiv.current[el] = false
            })
            trick(Math.random())
          }}
        >
          Randomize
        </button>
        <button
          onClick={() => {
            for (let i = 0; i < numOfRows * numOfCols; i++) {
              refLiv.current[i] = false
            }
            animation.stop()
            trick(Math.random())
          }}
        >
          Clear
        </button>
        <label>Rows</label>
        <input
          style={{ width: '90px' }}
          type='range'
          min='3'
          value={numOfRows}
          onChange={e => {
            setRows(e.target.valueAsNumber)
          }}
        />
        <label>Columns</label>
        <input
          style={{ width: '90px' }}
          type='range'
          min='3'
          value={numOfCols}
          onChange={e => {
            setCols(e.target.valueAsNumber)
          }}
        />
        <label>Box Size</label>
        <input
          style={{ width: '90px' }}
          type='range'
          value={size}
          onChange={e => {
            setSize(e.target.valueAsNumber)
          }}
        />
        <button
          onClick={() => {
            setSize(35)
            setCols(35)
            setRows(17)
          }}
        >
          Default
        </button>
        <div>
          <button
            onClick={() => {
              for (let i = 0; i < 5; i++) {
                step()
              }
            }}
          >
            +5
          </button>
          <button
            onClick={() => {
              for (let i = 0; i < 10; i++) {
                step()
              }
            }}
          >
            +10
          </button>
          <button
            onClick={() => {
              for (let i = 0; i < 20; i++) {
                step()
              }
            }}
          >
            +20
          </button>
        </div>
        <button onClick={() => setWrap(!wrap)}>
          {wrap ? 'continuous' : 'bordered'}
        </button>
      </BtnBox>
    </Background>
  )
}

const Block = styled.div`
  background-color: ${p => (p.active ? 'black' : 'white')};
  box-sizing: border-box;
  width: ${p => p.size}px;
  height: ${p => p.size}px;
  border: 1px solid black;
`

const GridBlock = styled.div`
  width: ${p => p.size * p.numOfCols}px;
  padding-left: 130px;
  display: flex;
  flex-wrap: wrap;
`

const BtnBox = styled.div`
  position: absolute;
  top: 120px;
  left: 20px;
  justify-content: space-between;
  display: flex;
  flex-direction: column;
  height: 400px;
  div button {
    padding: 4px 4px;
    margin-right: 4px;
  }
  button {
    padding: 8px 12px;
    margin-right: 8px;
    border: 1px solid #777;
    border-radius: 4px;
    &:hover {
      background-color: #ccc;
    }
    &:active {
      background-color: #aaa;
    }
  }
`

const TopBox = styled.div`
  font-size: 60px;
  padding: 10px 0 20px 20px;
  position: relative;
`

const Background = styled.div`
  height: 100vh;
  width: 100%;
`
