import React from 'react'
import { Handle, Position } from '@xyflow/react'
import useNodeResize from '../../hooks/useNodeResize'

function EllipseNode({ data }: { data: any }) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [label, setLabel] = React.useState(data.label || '')
  const [scale, setScale] = React.useState(data.scale || 1)
  const [isHovered, setIsHovered] = React.useState(false)
  const [isConnecting, setIsConnecting] = React.useState(false)

  const handleDoubleClick = () => {
    setIsEditing(true)
  }

  const handleBlur = () => {
    setIsEditing(false)
    data.onLabelChange(data.id, label)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur()
    }
  }

  const handleScaleChange = (id: string, newScale: number) => {
    setScale(newScale)
    data.onScaleChange(id, newScale)
  }

  const { handleMouseDown } = useNodeResize(data.id, scale, handleScaleChange)

  const width = 96 * scale
  const height = 64 * scale
  const fontSize = 13 * scale
  const handleSize = Math.max(6, Math.min(10, 10 * scale))
  const handleOffset = -(handleSize / 2)

  return (
    <div
      className="bg-background border border-border rounded-full p-4 flex items-center justify-center cursor-pointer relative group"
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ width: `${width}px`, height: `${height}px`, borderRadius: '50%' }}
    >
      <Handle
        id="top"
        type="source"
        position={Position.Top}
        className={`transition-opacity duration-200 bg-foreground border border-background rounded-full ${
          isHovered || isConnecting ? 'opacity-100' : 'opacity-0'
        }`}
        onMouseEnter={() => setIsConnecting(true)}
        onMouseLeave={() => setIsConnecting(false)}
        style={{ top: -5 }}
      />
      <Handle
        id="bottom"
        type="source"
        position={Position.Bottom}
        className={`transition-opacity duration-200 bg-foreground border border-background rounded-full ${
          isHovered || isConnecting ? 'opacity-100' : 'opacity-0'
        }`}
        onMouseEnter={() => setIsConnecting(true)}
        onMouseLeave={() => setIsConnecting(false)}
        style={{ bottom: -5 }}
      />
      <Handle
        id="left"
        type="source"
        position={Position.Left}
        className={`transition-opacity duration-200 bg-foreground border border-background rounded-full ${
          isHovered || isConnecting ? 'opacity-100' : 'opacity-0'
        }`}
        onMouseEnter={() => setIsConnecting(true)}
        onMouseLeave={() => setIsConnecting(false)}
        style={{ left: -5 }}
      />
      <Handle
        id="right"
        type="source"
        position={Position.Right}
        className={`transition-opacity duration-200 bg-foreground border border-background rounded-full ${
          isHovered || isConnecting ? 'opacity-100' : 'opacity-0'
        }`}
        onMouseEnter={() => setIsConnecting(true)}
        onMouseLeave={() => setIsConnecting(false)}
        style={{ right: -5 }}
      />

      <div
        className="absolute bg-foreground rounded-full cursor-nw-resize opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-background z-20 nodrag nopan nowheel"
        onMouseDown={(e) => handleMouseDown(e, 'nw')}
        style={{ width: handleSize, height: handleSize, top: handleOffset, left: handleOffset }}
      />
      <div
        className="absolute bg-foreground rounded-full cursor-ne-resize opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-background z-20 nodrag nopan nowheel"
        onMouseDown={(e) => handleMouseDown(e, 'ne')}
        style={{ width: handleSize, height: handleSize, top: handleOffset, right: handleOffset }}
      />
      <div
        className="absolute bg-foreground rounded-full cursor-sw-resize opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-background z-20 nodrag nopan nowheel"
        onMouseDown={(e) => handleMouseDown(e, 'sw')}
        style={{ width: handleSize, height: handleSize, bottom: handleOffset, left: handleOffset }}
      />
      <div
        className="absolute bg-foreground rounded-full cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-background z-20 nodrag nopan nowheel"
        onMouseDown={(e) => handleMouseDown(e, 'se')}
        style={{ width: handleSize, height: handleSize, bottom: handleOffset, right: handleOffset }}
      />

      {isEditing ? (
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={handleBlur}
          onKeyPress={handleKeyPress}
          className="bg-transparent border-none outline-none text-center w-full"
          placeholder="输入文字..."
          autoFocus
          style={{ fontSize: `${fontSize}px` }}
        />
      ) : (
        <span className="text-center w-full" style={{ fontSize: `${fontSize}px` }}>
          {label || '双击编辑'}
        </span>
      )}
    </div>
  )
}

export default EllipseNode