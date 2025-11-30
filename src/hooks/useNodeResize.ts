import React from 'react'

interface Size {
  width: number
  height: number
}

function useNodeResize(
  nodeId: string,
  initialSize: Size,
  onSizeChange: (id: string, size: Size) => void
) {
  const [isResizing, setIsResizing] = React.useState(false)
  const [startPos, setStartPos] = React.useState({ x: 0, y: 0 })
  const [startSize, setStartSize] = React.useState(initialSize)
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
    setStartSize(initialSize)

    const c = corner
    let cursor = 'nwse-resize'
    if (c === 'nw' || c === 'se') cursor = 'nwse-resize'
    else if (c === 'ne' || c === 'sw') cursor = 'nesw-resize'
    else if (c === 'n' || c === 's') cursor = 'ns-resize'
    else if (c === 'e' || c === 'w') cursor = 'ew-resize'
    document.body.style.cursor = cursor
  }

  const handleMouseMove = React.useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return

      const deltaX = e.clientX - startPos.x
      const deltaY = e.clientY - startPos.y

      const c = cornerRef.current
      let newWidth = startSize.width
      let newHeight = startSize.height

      // 根据拖拽的角落/边来调整宽高
      if (c === 'nw') {
        newWidth = startSize.width - deltaX
        newHeight = startSize.height - deltaY
      } else if (c === 'ne') {
        newWidth = startSize.width + deltaX
        newHeight = startSize.height - deltaY
      } else if (c === 'sw') {
        newWidth = startSize.width - deltaX
        newHeight = startSize.height + deltaY
      } else if (c === 'se') {
        newWidth = startSize.width + deltaX
        newHeight = startSize.height + deltaY
      } else if (c === 'n') {
        newHeight = startSize.height - deltaY
      } else if (c === 's') {
        newHeight = startSize.height + deltaY
      } else if (c === 'w') {
        newWidth = startSize.width - deltaX
      } else if (c === 'e') {
        newWidth = startSize.width + deltaX
      }

      // 限制最小和最大尺寸
      newWidth = Math.max(20, Math.min(300, newWidth))
      newHeight = Math.max(16, Math.min(200, newHeight))

      onSizeChange(nodeId, { 
        width: Math.round(newWidth), 
        height: Math.round(newHeight) 
      })
    },
    [isResizing, startPos, startSize, nodeId, onSizeChange]
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
