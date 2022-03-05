import React from 'react'
import styled from 'styled-components'

// Conways Game of Life

// TO DO:
// [x] Animation frame
// [ ] Dragable to fill
// [ ] Sliders for row, column, and size (also reset to default button)
// [ ] make sure clear stops animation
// [ ] Option for hard edges or continuous (like dallins)
// [ ] Maybe give options to go for so many frames (like 10 or 5 (sets of 16ms))

function useAnimationFrame (fn) {
  let stopId = React.useRef()
  let [active, setActive] = React.useState(false)

  function loop () {
    fn()
    stopId.current = window.requestAnimationFrame(loop)
    setActive(true)
  }

  // could have instead made all the functions above, then returned them as an array,
  // then when declared in the main function the user can destructure the names out to whatever they want them to be
  // IE: [startThing, stoptheTRAIN, running?!!] = useAnimationFrame(func)
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

const numOfRows = 30
const numOfCols = 20
export default function App () {
  const [livingThings, setLife] = React.useState([
    ...new Array(numOfRows * numOfCols).fill(false)
  ])
  const animation = useAnimationFrame(step)

  // here we could have used React.useRef and set the ref.current to be living things
  function step () {
    setLife(actualLivingThings => {
      // y = position / numOfRows
      // x = position % numOfRows
      let newLife = [...actualLivingThings]
      newLife = newLife.map((el, i) => {
        let livingTouch = 0

        // in this section the top is known
        if (i > numOfRows) {
          // top
          if (actualLivingThings[i - numOfRows] === true) livingTouch += 1
          // top-right
          if (i % numOfRows !== 0) {
            if (actualLivingThings[i - numOfRows - 1] === true) livingTouch += 1
          }
          // top-left
          if (i % numOfRows !== 1) {
            if (actualLivingThings[i - numOfRows + 1] === true) livingTouch += 1
          }
        }

        // right
        if (i % numOfRows !== 0) {
          if (actualLivingThings[i + 1] === true) livingTouch += 1
        }

        // left
        if (i % numOfRows !== 1) {
          if (actualLivingThings[i - 1] === true) livingTouch += 1
        }

        // bottom
        if (i <= actualLivingThings.length - numOfRows) {
          // bottom
          if (actualLivingThings[i + numOfRows] === true) livingTouch += 1
          // bottom-right
          if (i % numOfRows !== 0) {
            if (actualLivingThings[i + numOfRows + 1] === true) livingTouch += 1
          }
          // bottom-left
          if (i % numOfRows !== 1) {
            if (actualLivingThings[i + numOfRows - 1] === true) livingTouch += 1
          }
        }

        // 1) Any live cell with fewer than two live neighbours dies, as if by underpopulation.
        if (el === true && livingTouch < 2) return false

        // 2) Any live cell with two or three live neighbours lives on to the next generation.
        if (el === true && (livingTouch === 3 || livingTouch === 2)) return true

        // 3) Any live cell with more than three live neighbours dies, as if by overpopulation.
        if (el === true && livingTouch > 3) return false

        // 4) Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
        if (el === false && livingTouch === 3) return true

        return false
      })

      return newLife
    })
  }

  return (
    <Background>
      <TopBox>Conways Game of Life </TopBox>
      <GridBlock>
        {livingThings.map((el, i) => (
          <Block
            key={i}
            active={el}
            onClick={() => {
              let newLiving = [...livingThings]
              newLiving[i] = !el
              setLife(newLiving)
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
            let randLife = [...livingThings]
            randLife = randLife.map(el => {
              if (Math.floor(Math.random() * 10) > 5) return true
              else return false
            })
            setLife(randLife)
          }}
        >
          Randomize
        </button>
        <button
          onClick={() => {
            let erradicate = new Array(numOfRows * numOfCols).fill(false)
            setLife(erradicate)
            animation.stop()
          }}
        >
          Clear
        </button>
      </BtnBox>
    </Background>
  )
}

const Block = styled.div`
  background-color: ${p => (p.active ? 'black' : 'white')};
  box-sizing: border-box;
  width: 24px;
  height: 24px;
  border: 1px solid black;
`

const GridBlock = styled.div`
  width: ${24 * numOfRows}px;
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
  height: 180px;
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
