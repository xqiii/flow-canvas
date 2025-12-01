/**
 * DiamondNode - 菱形节点组件
 * 
 * 功能：
 * - 菱形外观（正方形旋转 45°）
 * - 可拖拽调整大小（等比例）
 * - 双击编辑文字（文字反向旋转保持水平）
 * - 四边连接锚点
 */

import React from 'react'
import { Handle, Position } from '@xyflow/react'
import useNodeResize from '../../hooks/useNodeResize'

// 默认边长
const DEFAULT_SIZE = 32

function DiamondNode({ data }: { data: any }) {
  // ===== 状态 =====
  const [isEditing, setIsEditing] = React.useState(false)
  const [label, setLabel] = React.useState(data.label || '')
  const [size, setSize] = React.useState({ 
    width: data.width || DEFAULT_SIZE, 
    height: data.height || DEFAULT_SIZE 
  })
  const [isHovered, setIsHovered] = React.useState(false)
  const [isConnecting, setIsConnecting] = React.useState(false)

  /** 双击进入编辑模式 */
  const handleDoubleClick = () => {
    setIsEditing(true)
  }

  /** 失焦退出编辑模式 */
  const handleBlur = () => {
    setIsEditing(false)
    data.onLabelChange?.(data.id, label)
  }

  /**
   * 尺寸变更回调
   * 菱形保持宽高一致
   */
  const handleSizeChange = (id: string, newSize: { width: number; height: number }) => {
    const maxDim = Math.max(newSize.width, newSize.height)
    setSize({ width: maxDim, height: maxDim })
    data.onSizeChange?.(id, { width: maxDim, height: maxDim })
  }

  const { handleMouseDown, isResizing } = useNodeResize(data.id, size, handleSizeChange)

  // ===== 计算样式参数 =====
  const diamondSize = size.width
  const fontSize = diamondSize * 0.15  // 菱形内部空间较小，字体比例略小
  const handleSize = 3
  const handleOffset = -(handleSize / 2)

  return (
    <div
      // rotate-45 使正方形旋转成菱形
      className="relative bg-background border border-border p-1 flex items-center justify-center transform rotate-45 cursor-pointer group"
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ width: `${diamondSize}px`, height: `${diamondSize}px` }}
    >
      {/* ===== 四边连接锚点 ===== */}
      <Handle
        id="top"
        type="source"
        position={Position.Top}
        className={`transition-opacity duration-200 rounded-full ${
          isHovered || isConnecting ? 'opacity-100' : 'opacity-0'
        }`}
        onMouseEnter={() => setIsConnecting(true)}
        onMouseLeave={() => setIsConnecting(false)}
        style={{ 
          width: handleSize, 
          height: handleSize, 
          top: handleOffset, 
          minWidth: 'unset', 
          minHeight: 'unset',
          background: 'hsl(var(--muted-foreground))',
          border: '0.5px solid hsl(var(--background))'
        }}
      />
      <Handle
        id="bottom"
        type="source"
        position={Position.Bottom}
        className={`transition-opacity duration-200 rounded-full ${
          isHovered || isConnecting ? 'opacity-100' : 'opacity-0'
        }`}
        onMouseEnter={() => setIsConnecting(true)}
        onMouseLeave={() => setIsConnecting(false)}
        style={{ 
          width: handleSize, 
          height: handleSize, 
          bottom: handleOffset, 
          minWidth: 'unset', 
          minHeight: 'unset',
          background: 'hsl(var(--muted-foreground))',
          border: '0.5px solid hsl(var(--background))'
        }}
      />
      <Handle
        id="left"
        type="source"
        position={Position.Left}
        className={`transition-opacity duration-200 rounded-full ${
          isHovered || isConnecting ? 'opacity-100' : 'opacity-0'
        }`}
        onMouseEnter={() => setIsConnecting(true)}
        onMouseLeave={() => setIsConnecting(false)}
        style={{ 
          width: handleSize, 
          height: handleSize, 
          left: handleOffset, 
          minWidth: 'unset', 
          minHeight: 'unset',
          background: 'hsl(var(--muted-foreground))',
          border: '0.5px solid hsl(var(--background))'
        }}
      />
      <Handle
        id="right"
        type="source"
        position={Position.Right}
        className={`transition-opacity duration-200 rounded-full ${
          isHovered || isConnecting ? 'opacity-100' : 'opacity-0'
        }`}
        onMouseEnter={() => setIsConnecting(true)}
        onMouseLeave={() => setIsConnecting(false)}
        style={{ 
          width: handleSize, 
          height: handleSize, 
          right: handleOffset, 
          minWidth: 'unset', 
          minHeight: 'unset',
          background: 'hsl(var(--muted-foreground))',
          border: '0.5px solid hsl(var(--background))'
        }}
      />

      {/* ===== 四角缩放手柄 ===== */}
      <div
        className="absolute rounded-full cursor-nw-resize opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 nodrag nopan nowheel"
        onMouseDown={(e) => handleMouseDown(e, 'nw')}
        style={{ width: handleSize, height: handleSize, top: handleOffset, left: handleOffset, background: 'hsl(var(--muted-foreground))' }}
      />
      <div
        className="absolute rounded-full cursor-ne-resize opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 nodrag nopan nowheel"
        onMouseDown={(e) => handleMouseDown(e, 'ne')}
        style={{ width: handleSize, height: handleSize, top: handleOffset, right: handleOffset, background: 'hsl(var(--muted-foreground))' }}
      />
      <div
        className="absolute rounded-full cursor-sw-resize opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 nodrag nopan nowheel"
        onMouseDown={(e) => handleMouseDown(e, 'sw')}
        style={{ width: handleSize, height: handleSize, bottom: handleOffset, left: handleOffset, background: 'hsl(var(--muted-foreground))' }}
      />
      <div
        className="absolute rounded-full cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 nodrag nopan nowheel"
        onMouseDown={(e) => handleMouseDown(e, 'se')}
        style={{ width: handleSize, height: handleSize, bottom: handleOffset, right: handleOffset, background: 'hsl(var(--muted-foreground))' }}
      />

      {/* ===== 文字内容 ===== */}
      {/* -rotate-45 使文字保持水平 */}
      {isEditing ? (
        <textarea
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => e.key === 'Escape' && handleBlur()}
          className="bg-transparent border-none outline-none text-center w-full h-full resize-none transform -rotate-45"
          placeholder="输入..."
          autoFocus
          style={{ fontSize: `${fontSize}px`, lineHeight: 1.2 }}
        />
      ) : (
        <span 
          className="text-center w-full overflow-hidden transform -rotate-45"
          style={{ 
            fontSize: `${fontSize}px`, 
            lineHeight: 1.2,
            wordBreak: 'break-word',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {label || '双击编辑'}
        </span>
      )}

      {/* ===== 尺寸提示框 ===== */}
      {/* -rotate-45 使提示框保持水平 */}
      {(isHovered || isResizing) && (
        <div 
          className="absolute left-1/2 -translate-x-1/2 rounded text-center whitespace-nowrap pointer-events-none z-30 transform -rotate-45"
          style={{ 
            top: `${diamondSize + 4}px`,
            fontSize: '5px',
            padding: '1px 2px',
            background: 'hsl(var(--muted))',
            color: 'hsl(var(--muted-foreground))',
            border: '0.5px solid hsl(var(--border))'
          }}
        >
          {diamondSize}×{diamondSize}
        </div>
      )}
    </div>
  )
}

export default DiamondNode
