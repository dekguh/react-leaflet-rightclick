import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react'
import { useLeafletContext } from '@react-leaflet/core'
import { LeafletMouseEvent, Point } from 'leaflet'

export const LeafletRightClickContext = createContext<{[key: string]: any;}>({})

export const LeafletRightClickProvider : React.FC<{
  children : ReactNode | JSX.Element
}> = ({ children }) => {
  const [rightClickEvent, setRightClickEvent] = useState<LeafletMouseEvent | null>(null)

  return(
    <LeafletRightClickContext.Provider
      value={{
        rightClickEvent,
        setRightClickEvent
      }}>
      {children}
    </LeafletRightClickContext.Provider>
  )
}

export const useLeafletRightClick = () : LeafletMouseEvent | null => {
  const {
    rightClickEvent
  } = useContext(LeafletRightClickContext)

  return rightClickEvent
}

const ReactLeafletRightClick : React.FC<{
  onRightClick?: (event : LeafletMouseEvent) => void;
  customComponent: ReactNode | JSX.Element
}> = (props) => {
  const {
    onRightClick,
    customComponent : CustomComponent
  } = props

  const {
    setRightClickEvent
  } = useContext(LeafletRightClickContext)

  const getContext = useLeafletContext()
  const mapContext = useRef<ReturnType<typeof useLeafletContext>>(getContext)
  const mapSize = useRef<Point>()
  const menuWrapRef = useRef<HTMLDivElement>(null)
  const [isShowMenu, setIsShowMenu] = useState<boolean>(false)

  const [point, setPoint] = useState<{
    x: number;
    y: number;
  }>({
    x: 0,
    y: 0
  })

  useEffect(() => {
    if(mapContext.current.map) {
      mapSize.current = mapContext.current.map.getSize()

      mapContext.current.map.on('click', () => {
        setIsShowMenu(false)
      })

      mapContext.current.map.on('resize', (event) => {
        mapSize.current = event.newSize
      }, [])

      mapContext.current.map.on('dragstart', () => {
        setIsShowMenu(false)
      })

      // CHECK MENU HEIGHT
      const menuPointYisOverFlow = (pointY : number, menuWrapHeight : number, mapSize : Point) => {
        if (pointY > (mapSize.y - menuWrapHeight)) return pointY - menuWrapHeight
        else return pointY
      }

      mapContext.current.map.on('contextmenu', (event) => {
        setRightClickEvent(event)

        onRightClick && onRightClick(event)

        const pointRightClick : Point = event.containerPoint
        const menuWrapWidth : number = menuWrapRef.current ? Number(menuWrapRef.current.offsetWidth) : 0
        const menuWrapHeight : number = menuWrapRef.current ? Number(menuWrapRef.current.offsetHeight) : 0

        // CHECK IF CLICK POSITION OVERFLOW X AND Y
        if(mapSize.current && pointRightClick.x > (mapSize.current.x - menuWrapWidth)) {
          // CHECK MAX POINT X
          const calculationX = pointRightClick.x === mapSize.current.x
            ? (pointRightClick.x - menuWrapWidth) - 20
            : pointRightClick.x - menuWrapWidth

          setPoint({
            y: menuPointYisOverFlow(pointRightClick.y, menuWrapHeight, mapSize.current),
            x: calculationX
          })
        } else {
          mapSize.current && setPoint({
            y: menuPointYisOverFlow(pointRightClick.y, menuWrapHeight, mapSize.current),
            x: pointRightClick.x
          })
        }

        setIsShowMenu(true)
      })
    }
  }, [])

  // MAP CONTEXT NOT FOUND
  if(!getContext) return null

  return (
    <div
      ref={menuWrapRef}
      style={{
        display: isShowMenu ? 'block' : 'none',
        position: 'absolute',
        zIndex: 10000,
        top: `${point.y}px`,
        left: `${point.x}px`,
      }}
    >
      {CustomComponent && CustomComponent}
    </div>
  )
}

export default ReactLeafletRightClick