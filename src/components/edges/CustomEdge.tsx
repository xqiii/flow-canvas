import React from 'react'
import { EdgeProps } from 'reactflow'

function CustomEdge({ id, sourceX, sourceY, targetX, targetY, style = {}, markerEnd, selected, data }: EdgeProps) {
  const [edgePath] = React.useMemo(() => {
    const dx = targetX - sourceX
    const dy = targetY - sourceY
    const dist = Math.sqrt(dx * dx + dy * dy)
    const dr = dist * 0.3
    const ux = dist ? dx / dist : 0
    const uy = dist ? dy / dist : 0

    const px = -uy
    const py = ux
    const offset = Math.min(60, dist * 0.25)
    if (data?.style === 'straight') {
      return [`M${sourceX},${sourceY} L${targetX},${targetY}`]
    }
    if (data?.style === 'step') {
      const isHorizontalFirst = Math.abs(dx) > Math.abs(dy)
      const mx = isHorizontalFirst ? targetX - ux * dr : sourceX + ux * dr
      const my = isHorizontalFirst ? sourceY + uy * dr : targetY - uy * dr
      return [`M${sourceX},${sourceY} L${mx},${my} L${targetX},${targetY}`]
    }
    const c1x = sourceX + ux * dr + px * offset
    const c1y = sourceY + uy * dr + py * offset
    const c2x = targetX - ux * dr
    const c2y = targetY - uy * dr
    return [`M${sourceX},${sourceY} C${c1x},${c1y} ${c2x},${c2y} ${targetX},${targetY}`]
  }, [sourceX, sourceY, targetX, targetY])

  const getStrokeDasharray = () => {
    if (data?.style === 'dashed') {
      return '8,4'
    }
    return 'none'
  }

  return (
    <>
      <path
        id={id}
        style={{
          ...style,
          strokeDasharray: getStrokeDasharray(),
        }}
        className={`react-flow__edge-path stroke-gray-600 stroke-2 hover:stroke-red-500 transition-colors cursor-pointer ${
          selected ? 'stroke-red-500 stroke-3' : ''
        }`}
        d={edgePath}
        markerEnd={markerEnd}
      />
      <path
        d={edgePath}
        className="react-flow__edge-interaction"
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        style={{ cursor: 'pointer' }}
      />
      <circle cx={sourceX} cy={sourceY} r={8} fill="transparent" className="react-flow__edgeupdater" style={{ cursor: 'move' }} />
      <circle cx={targetX} cy={targetY} r={8} fill="transparent" className="react-flow__edgeupdater" style={{ cursor: 'move' }} />
    </>
  )
}

export default CustomEdge