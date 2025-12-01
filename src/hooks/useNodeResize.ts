/**
 * useNodeResize - 节点缩放 Hook
 * 
 * 功能：
 * - 支持从四个角落拖拽调整节点大小
 * - 支持独立调整宽度和高度
 * - 限制最小/最大尺寸
 * - 在缩放时禁用节点拖拽
 */

import React from 'react'

// 尺寸接口
interface Size {
  width: number
  height: number
}

/**
 * 节点缩放 Hook
 * @param nodeId - 节点 ID
 * @param initialSize - 初始尺寸
 * @param onSizeChange - 尺寸变更回调
 * @returns handleMouseDown - 鼠标按下处理函数, isResizing - 是否正在缩放
 */
function useNodeResize(
  nodeId: string,
  initialSize: Size,
  onSizeChange: (id: string, size: Size) => void
) {
  // ===== 状态 =====
  const [isResizing, setIsResizing] = React.useState(false)        // 是否正在缩放
  const [startPos, setStartPos] = React.useState({ x: 0, y: 0 })   // 拖拽起始位置
  const [startSize, setStartSize] = React.useState(initialSize)    // 拖拽起始尺寸
  const cornerRef = React.useRef<string | null>(null)              // 当前拖拽的角落

  /**
   * 鼠标按下处理
   * 开始缩放操作
   */
  const handleMouseDown = (e: React.MouseEvent, corner: string) => {
    e.preventDefault()
    e.stopPropagation()
    cornerRef.current = corner

    // 禁用节点拖拽，防止缩放时移动节点
    const reactFlowNode = (e.target as HTMLElement).closest('.react-flow__node')
    if (reactFlowNode) {
      reactFlowNode.classList.add('nodrag')
      reactFlowNode.classList.add('nopan')
    }

    // 记录起始状态
    setIsResizing(true)
    setStartPos({ x: e.clientX, y: e.clientY })
    setStartSize(initialSize)

    // 设置对应方向的光标样式
    const c = corner
    let cursor = 'nwse-resize'
    if (c === 'nw' || c === 'se') cursor = 'nwse-resize'      // 左上/右下
    else if (c === 'ne' || c === 'sw') cursor = 'nesw-resize' // 右上/左下
    else if (c === 'n' || c === 's') cursor = 'ns-resize'     // 上/下
    else if (c === 'e' || c === 'w') cursor = 'ew-resize'     // 左/右
    document.body.style.cursor = cursor
  }

  /**
   * 鼠标移动处理
   * 计算新尺寸并更新
   */
  const handleMouseMove = React.useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return

      // 计算鼠标移动距离
      const deltaX = e.clientX - startPos.x
      const deltaY = e.clientY - startPos.y

      const c = cornerRef.current
      let newWidth = startSize.width
      let newHeight = startSize.height

      // 根据拖拽的角落/边来调整宽高
      if (c === 'nw') {           // 左上角：向左上拖拽增大
        newWidth = startSize.width - deltaX
        newHeight = startSize.height - deltaY
      } else if (c === 'ne') {    // 右上角
        newWidth = startSize.width + deltaX
        newHeight = startSize.height - deltaY
      } else if (c === 'sw') {    // 左下角
        newWidth = startSize.width - deltaX
        newHeight = startSize.height + deltaY
      } else if (c === 'se') {    // 右下角：向右下拖拽增大
        newWidth = startSize.width + deltaX
        newHeight = startSize.height + deltaY
      } else if (c === 'n') {     // 上边
        newHeight = startSize.height - deltaY
      } else if (c === 's') {     // 下边
        newHeight = startSize.height + deltaY
      } else if (c === 'w') {     // 左边
        newWidth = startSize.width - deltaX
      } else if (c === 'e') {     // 右边
        newWidth = startSize.width + deltaX
      }

      // 限制最小和最大尺寸
      newWidth = Math.max(20, Math.min(300, newWidth))    // 宽度：20-300px
      newHeight = Math.max(16, Math.min(200, newHeight))  // 高度：16-200px

      // 触发尺寸变更回调
      onSizeChange(nodeId, { 
        width: Math.round(newWidth), 
        height: Math.round(newHeight) 
      })
    },
    [isResizing, startPos, startSize, nodeId, onSizeChange]
  )

  /**
   * 鼠标释放处理
   * 结束缩放操作
   */
  const handleMouseUp = React.useCallback(() => {
    setIsResizing(false)

    // 恢复节点拖拽功能
    const reactFlowNode = document.querySelector(`[data-id="${nodeId}"]`)
    if (reactFlowNode) {
      reactFlowNode.classList.remove('nodrag')
      reactFlowNode.classList.remove('nopan')
    }
    // 恢复默认光标
    document.body.style.cursor = ''
  }, [nodeId])

  /**
   * 副作用：绑定/解绑全局鼠标事件
   * 在缩放时监听 document 的 mousemove 和 mouseup
   */
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
