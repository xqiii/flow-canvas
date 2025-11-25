import React from 'react'
import { Handle, Position } from 'reactflow'
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

  const width = 112 * scale
  const height = 80 * scale

  return (
    <div
      className="bg-white border-2 border-gray-300 rounded-full p-4 flex items-center justify-center cursor-pointer relative group"
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ width: `${width}px`, height: `${height}px`, borderRadius: '50%' }}
    >
      <Handle
        id="top"
        type="source"
        position={Position.Top}
        className={`w-3 h-3 transition-opacity duration-200 bg-blue-500 border-2 border-white rounded-full ${
          isHovered || isConnecting ? 'opacity-100' : 'opacity-0'
        }`}
        onMouseEnter={() => setIsConnecting(true)}
        onMouseLeave={() => setIsConnecting(false)}
        style={{ top: -6 }}
      />
      <Handle
        id="bottom"
        type="source"
        position={Position.Bottom}
        className={`w-3 h-3 transition-opacity duration-200 bg-blue-500 border-2 border-white rounded-full ${
          isHovered || isConnecting ? 'opacity-100' : 'opacity-0'
        }`}
        onMouseEnter={() => setIsConnecting(true)}
        onMouseLeave={() => setIsConnecting(false)}
        style={{ bottom: -6 }}
      />
      <Handle
        id="left"
        type="source"
        position={Position.Left}
        className={`w-3 h-3 transition-opacity duration-200 bg-blue-500 border-2 border-white rounded-full ${
          isHovered || isConnecting ? 'opacity-100' : 'opacity-0'
        }`}
        onMouseEnter={() => setIsConnecting(true)}
        onMouseLeave={() => setIsConnecting(false)}
        style={{ left: -6 }}
      />
      <Handle
        id="right"
        type="source"
        position={Position.Right}
        className={`w-3 h-3 transition-opacity duration-200 bg-blue-500 border-2 border-white rounded-full ${
          isHovered || isConnecting ? 'opacity-100' : 'opacity-0'
        }`}
        onMouseEnter={() => setIsConnecting(true)}
        onMouseLeave={() => setIsConnecting(false)}
        style={{ right: -6 }}
      />

      <div
        className="absolute w-6 h-6 bg-blue-500 rounded-full cursor-nw-resize opacity-0 group-hover:opacity-100 transition-all duration-200 border-2 border-white shadow-lg z-20 hover:bg-blue-600 hover:scale-110"
        onMouseDown={(e) => handleMouseDown(e, 'nw')}
        style={{ top: -12, left: -12 }}
      />
      <div
        className="absolute w-6 h-6 bg-blue-500 rounded-full cursor-ne-resize opacity-0 group-hover:opacity-100 transition-all duration-200 border-2 border-white shadow-lg z-20 hover:bg-blue-600 hover:scale-110"
        onMouseDown={(e) => handleMouseDown(e, 'ne')}
        style={{ top: -12, right: -12 }}
      />
      <div
        className="absolute w-6 h-6 bg-blue-500 rounded-full cursor-sw-resize opacity-0 group-hover:opacity-100 transition-all duration-200 border-2 border-white shadow-lg z-20 hover:bg-blue-600 hover:scale-110"
        onMouseDown={(e) => handleMouseDown(e, 'sw')}
        style={{ bottom: -12, left: -12 }}
      />
      <div
        className="absolute w-6 h-6 bg-blue-500 rounded-full cursor-se-resize opacity-0 group-hover:opacity-100 transition-all duration-200 border-2 border-white shadow-lg z-20 hover:bg-blue-600 hover:scale-110"
        onMouseDown={(e) => handleMouseDown(e, 'se')}
        style={{ bottom: -12, right: -12 }}
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
        />
      ) : (
        <span className="text-center w-full">{label || '双击编辑'}</span>
      )}
    </div>
  )
}

export default EllipseNode