import React from 'react'

function useNodeResize(
  nodeId: string,
  initialScale: number,
  onScaleChange: (id: string, scale: number) => void
) {
  const [isResizing, setIsResizing] = React.useState(false)
  const [startPos, setStartPos] = React.useState({ x: 0, y: 0 })
  const [startScale, setStartScale] = React.useState(initialScale)

  const handleMouseDown = (e: React.MouseEvent, corner: string) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Mouse down on resize handle:', corner, 'for node:', nodeId)

    const reactFlowNode = (e.target as HTMLElement).closest('.react-flow__node')
    if (reactFlowNode) {
      reactFlowNode.setAttribute('data-no-drag', 'true')
    }

    setIsResizing(true)
    setStartPos({ x: e.clientX, y: e.clientY })
    setStartScale(initialScale)
  }

  const handleMouseMove = React.useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return

      const deltaX = e.clientX - startPos.x
      const deltaY = e.clientY - startPos.y
      const delta = Math.max(deltaX, deltaY) / 100

      const newScale = Math.max(0.5, Math.min(2, startScale + delta))
      console.log('Resizing:', { deltaX, deltaY, delta, newScale, startScale })
      onScaleChange(nodeId, newScale)
    },
    [isResizing, startPos, startScale, nodeId, onScaleChange]
  )

  const handleMouseUp = React.useCallback(() => {
    setIsResizing(false)

    const reactFlowNode = document.querySelector(`[data-id="${nodeId}"]`)
    if (reactFlowNode) {
      reactFlowNode.removeAttribute('data-no-drag')
    }
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