import React from 'react'

function useNodeResize(
  nodeId: string,
  initialScale: number,
  onScaleChange: (id: string, scale: number) => void
) {
  const [isResizing, setIsResizing] = React.useState(false)
  const [startPos, setStartPos] = React.useState({ x: 0, y: 0 })
  const [startScale, setStartScale] = React.useState(initialScale)
  const cornerRef = React.useRef<string | null>(null)

  const handleMouseDown = (e: React.MouseEvent, corner: string) => {
    e.preventDefault()
    e.stopPropagation()
    cornerRef.current = corner

    const reactFlowNode = (e.target as HTMLElement).closest('.react-flow__node')
    if (reactFlowNode) {
      reactFlowNode.classList.add('nodrag')
      reactFlowNode.classList.add('nopan')
    }

    setIsResizing(true)
    setStartPos({ x: e.clientX, y: e.clientY })
    setStartScale(initialScale)

    const c = corner
    const cursor = c === 'nw' || c === 'se' ? 'nwse-resize' : 'nesw-resize'
    document.body.style.cursor = cursor
  }

  const handleMouseMove = React.useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return

      const deltaX = e.clientX - startPos.x
      const deltaY = e.clientY - startPos.y

      const c = cornerRef.current
      let vx = 1
      let vy = 1
      if (c === 'nw') {
        vx = -1
        vy = -1
      } else if (c === 'ne') {
        vx = 1
        vy = -1
      } else if (c === 'sw') {
        vx = -1
        vy = 1
      }

      const delta = (deltaX * vx + deltaY * vy) / 200
      const unclamped = startScale + delta
      const clamped = Math.max(0.2, Math.min(3, unclamped))
      const newScale = Math.round(clamped * 100) / 100
      onScaleChange(nodeId, newScale)
    },
    [isResizing, startPos, startScale, nodeId, onScaleChange]
  )

  const handleMouseUp = React.useCallback(() => {
    setIsResizing(false)

    const reactFlowNode = document.querySelector(`[data-id="${nodeId}"]`)
    if (reactFlowNode) {
      reactFlowNode.classList.remove('nodrag')
      reactFlowNode.classList.remove('nopan')
    }
    document.body.style.cursor = ''
  }, [nodeId])

  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isResizing, handleMouseMove, handleMouseUp])

  return { handleMouseDown, isResizing }
}

export default useNodeResize