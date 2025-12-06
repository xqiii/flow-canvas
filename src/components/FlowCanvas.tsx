/**
 * FlowCanvas - 流程图画布主组件
 * 
 * 功能：
 * - 管理节点和边的状态
 * - 处理节点拖放创建
 * - 处理连线创建和样式切换
 * - 支持导出画布为图片
 */

import React, { useCallback, useRef, useEffect, useState } from 'react'
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Connection,
  ConnectionMode,
  Node,
  Edge,
  useReactFlow,
  MarkerType,
  BezierEdge,
  StraightEdge,
  StepEdge,
  SmoothStepEdge,
  ConnectionLineType,
  MiniMap,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import html2canvas from 'html2canvas'
import ExportImageButton from './ExportImageButton'
import EdgeStyleSelector from './EdgeStyleSelector'
import RectangleNode from './nodes/RectangleNode'
import CircleNode from './nodes/CircleNode'
import EllipseNode from './nodes/EllipseNode'
import DiamondNode from './nodes/DiamondNode'

// 组件属性接口
interface FlowCanvasProps {
  selectedShape: string  // 当前选中的形状类型
  selectedEdgeStyle: 'straight' | 'step' | 'smoothstep' | 'default' | 'dashed'  // 当前选中的边样式
}

// 初始状态：空画布
const initialNodes: Node[] = []
const initialEdges: Edge[] = []

function FlowCanvas({ selectedShape, selectedEdgeStyle }: FlowCanvasProps) {
  // ===== Refs =====
  const reactFlowWrapper = useRef<HTMLDivElement>(null)  // 画布容器引用，用于导出图片
  
  // ===== React Flow Hooks =====
  const { screenToFlowPosition } = useReactFlow()  // 屏幕坐标转换为画布坐标
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)  // 节点状态管理
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)  // 边状态管理
  
  // ===== 本地状态 =====
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null)  // 当前选中的边 ID
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)  // 当前选中的节点 ID

  /**
   * 生成唯一 ID
   * 优先使用 crypto.randomUUID，降级使用时间戳+随机数
   */
  const genId = useCallback((prefix: string) => {
    const uuid = (globalThis as any).crypto?.randomUUID?.()
    return uuid ? `${prefix}-${uuid}` : `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1e6)}`
  }, [])

  // ===== 节点类型注册 =====
  const nodeTypes = React.useMemo(
    () => ({
      rectangle: RectangleNode,  // 矩形节点
      circle: CircleNode,        // 圆形节点
      ellipse: EllipseNode,      // 椭圆节点
      diamond: DiamondNode,      // 菱形节点
    }),
    []
  )

  // ===== 边类型注册 =====
  const edgeTypes = React.useMemo(
    () => ({
      default: BezierEdge,    // 默认贝塞尔曲线
      straight: StraightEdge, // 直线
      step: StepEdge,         // 阶梯线
      smoothstep: BezierEdge, // 平滑曲线
      dashed: BezierEdge,     // 虚线
    }),
    []
  )

  /**
   * 连线创建回调
   * 当用户从一个节点拖拽连线到另一个节点时触发
   */
  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge: Edge = {
        ...params,
        id: genId('edge'),
        type: selectedEdgeStyle,
        style: {
          strokeWidth: 0.75,
          stroke: 'hsl(var(--muted-foreground))',
          strokeDasharray: selectedEdgeStyle === 'dashed' ? '5,3' : undefined,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 5,
          height: 5,
          color: 'hsl(var(--muted-foreground))',
        },
        data: { style: selectedEdgeStyle },
      }
      setEdges((eds) => addEdge(newEdge, eds))
    },
    [setEdges, selectedEdgeStyle, genId]
  )

  /**
   * 节点标签变更回调
   * 当用户编辑节点内文字时触发
   */
  const onLabelChange = useCallback(
    (nodeId: string, label: string) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId ? { ...node, data: { ...node.data, label } } : node
        )
      )
    },
    [setNodes]
  )

  /**
   * 节点尺寸变更回调
   * 当用户拖拽调整节点大小时触发
   */
  const onSizeChange = useCallback(
    (nodeId: string, size: { width: number; height: number }) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId ? { ...node, data: { ...node.data, width: size.width, height: size.height } } : node
        )
      )
    },
    [setNodes]
  )

  /**
   * 复制选中的节点
   * 创建一个新节点，位置在原节点右下方偏移 30px
   */
  const duplicateNode = useCallback(
    (nodeId: string) => {
      const nodeToDuplicate = nodes.find((n) => n.id === nodeId)
      if (!nodeToDuplicate) return

      const newNodeId = genId(nodeToDuplicate.type || 'node')
      const newNode: Node = {
        ...nodeToDuplicate,
        id: newNodeId,
        position: {
          x: nodeToDuplicate.position.x + 30,
          y: nodeToDuplicate.position.y + 30,
        },
        data: {
          ...nodeToDuplicate.data,
          id: newNodeId,
          onLabelChange,
          onSizeChange,
        },
        selected: false,
      }

      setNodes((nds) => nds.concat(newNode))
      setSelectedNodeId(newNodeId)
    },
    [nodes, genId, onLabelChange, onSizeChange, setNodes]
  )

  /**
   * 键盘事件处理
   * Cmd/Ctrl + D 复制选中的节点
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Cmd/Ctrl + D 复制节点
      if ((event.metaKey || event.ctrlKey) && event.key === 'd') {
        event.preventDefault()
        if (selectedNodeId) {
          duplicateNode(selectedNodeId)
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [selectedNodeId, duplicateNode])

  /**
   * 节点点击回调
   * Cmd/Ctrl + 点击删除节点及其关联的边
   * 普通点击选中节点（用于复制）
   */
  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      if (event.metaKey || event.ctrlKey) {
        setNodes((nds) => nds.filter((n) => n.id !== node.id))
        setEdges((eds) => eds.filter((e) => e.source !== node.id && e.target !== node.id))
        setSelectedNodeId(null)
      } else {
        setSelectedNodeId(node.id)
      }
    },
    [setNodes, setEdges]
  )

  /**
   * 边点击回调
   * 普通点击选中边，Cmd/Ctrl + 点击删除边
   */
  const onEdgeClick = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      event.stopPropagation()
      setSelectedEdge(edge.id)

      if (event.metaKey || event.ctrlKey) {
        setEdges((eds) => eds.filter((e) => e.id !== edge.id))
        setSelectedEdge(null)
      }
    },
    [setEdges]
  )

  /**
   * 更新选中边的样式
   * 用于边样式选择器
   */
  const updateSelectedEdgeStyle = useCallback(
    (newStyle: string) => {
      if (selectedEdge) {
        setEdges((eds) =>
          eds.map((edge) =>
            edge.id === selectedEdge
              ? {
                  ...edge,
                  type: newStyle === 'dashed' ? 'dashed' : newStyle,
                  style: {
                    ...(edge.style || {}),
                    strokeDasharray: newStyle === 'dashed' ? '5,3' : undefined,
                  },
                  data: { ...edge.data, style: newStyle },
                }
              : edge
          )
        )
      }
    },
    [selectedEdge, setEdges]
  )

  /**
   * 边重连回调
   * 当用户拖拽边的端点到新位置时触发
   */
  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      setEdges((els) =>
        els.map((el) => {
          if (el.id === oldEdge.id) {
            return { ...el, ...newConnection }
          }
          return el
        })
      )
    },
    [setEdges]
  )

  /**
   * 画布空白区域点击
   * 取消边和节点的选中状态
   */
  const onPaneClick = useCallback(() => {
    setSelectedEdge(null)
    setSelectedNodeId(null)
  }, [])

  // 边鼠标进入/离开事件（用于高亮显示）
  const onEdgeMouseEnter = useCallback((event: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge.id)
  }, [])

  const onEdgeMouseLeave = useCallback(() => {
  }, [])

  /**
   * 拖拽经过画布事件
   * 设置拖放效果
   */
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  /**
   * 拖放到画布事件
   * 创建新节点
   */
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      if (!reactFlowWrapper.current) return

      // 将屏幕坐标转换为画布坐标
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      // 获取拖放的形状类型
      const shapeType =
        event.dataTransfer.getData('application/reactflow') ||
        event.dataTransfer.getData('shapeType') ||
        selectedShape
      const nodeId = genId(shapeType)

      // 创建新节点
      const newNode: Node = {
        id: nodeId,
        type: shapeType,
        position,
        data: { id: nodeId, label: '', onLabelChange, onSizeChange },
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [screenToFlowPosition, selectedShape, onLabelChange, onSizeChange, setNodes, genId]
  )

  /**
   * 导出画布为 PNG 图片
   */
  const exportImage = async () => {
    if (!reactFlowWrapper.current) return

    const canvas = await html2canvas(reactFlowWrapper.current)
    const link = document.createElement('a')
    link.download = 'diagram.png'
    link.href = canvas.toDataURL()
    link.click()
  }

  // ===== 渲染 =====
  return (
    <div className="h-full w-full relative">
      {/* 导出按钮 */}
      <ExportImageButton onClick={exportImage} />
      
      {/* 边样式选择器（仅在选中边时显示） */}
      {selectedEdge && <EdgeStyleSelector onSelect={updateSelectedEdgeStyle} />}

      {/* 主画布区域 */}
      <div ref={reactFlowWrapper} className="h-full w-full" onDrop={onDrop} onDragOver={onDragOver}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          onEdgeMouseEnter={onEdgeMouseEnter}
          onEdgeMouseLeave={onEdgeMouseLeave}
          onReconnect={onReconnect}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          connectionMode={ConnectionMode.Loose}
          // 缩放设置
          minZoom={0.2}
          maxZoom={5}
          zoomOnScroll={true}
          zoomOnPinch={true}
          zoomOnDoubleClick={true}
          // 平移设置
          panOnDrag={true}
          panOnScroll={false}
          preventScrolling={true}
          onInit={(inst) => inst.fitView({ padding: 0.1, minZoom: 0.2, maxZoom: 5 })}
          // 连接线类型
          connectionLineType={
            selectedEdgeStyle === 'straight'
              ? ConnectionLineType.Straight
              : selectedEdgeStyle === 'step'
              ? ConnectionLineType.Step
              : selectedEdgeStyle === 'smoothstep'
              ? ConnectionLineType.Bezier
              : ConnectionLineType.Bezier
          }
          fitView
          snapToGrid={true}
          snapGrid={[20, 20]}
          // 默认边样式
          defaultEdgeOptions={{
            type: selectedEdgeStyle,
            style: {
              strokeWidth: 0.75,
              stroke: 'hsl(var(--muted-foreground))',
              strokeDasharray: selectedEdgeStyle === 'dashed' ? '5,3' : undefined,
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 5,
              height: 5,
              color: 'hsl(var(--muted-foreground))',
            },
          }}
          proOptions={{ hideAttribution: true }}
        >
          {/* 控制面板（缩放、居中等） */}
          <Controls position="bottom-left" />
          {/* 背景（透明） */}
          <Background bgColor="transparent" color="transparent" />
        </ReactFlow>

        {/* 小地图 */}
        <MiniMap
          position="bottom-right"
          nodeStrokeWidth={1}
          nodeStrokeColor="rgba(0,0,0,0.7)"
          nodeColor="rgba(0,0,0,0.04)"
          bgColor="transparent"
          maskColor="rgba(0,0,0,0.08)"
          zoomable
          pannable
          zoomStep={0.1}
          style={{ width: 200, height: 140, borderRadius: 8, boxShadow: '0 1px 0 rgba(0,0,0,0.06)', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }}
        />
      </div>
    </div>
  )
}

/**
 * 带 Provider 的 FlowCanvas 组件
 * ReactFlowProvider 提供必要的上下文
 */
const FlowCanvasWithProvider = ({ selectedShape, selectedEdgeStyle }: FlowCanvasProps) => {
  return (
    <ReactFlowProvider>
      <FlowCanvas selectedShape={selectedShape} selectedEdgeStyle={selectedEdgeStyle} />
    </ReactFlowProvider>
  )
}

export default FlowCanvasWithProvider
