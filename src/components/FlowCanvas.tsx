import React, { useCallback, useRef } from 'react'
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

interface FlowCanvasProps {
  selectedShape: string
  selectedEdgeStyle: 'straight' | 'step' | 'smoothstep' | 'default' | 'dashed'
}

const initialNodes: Node[] = []
const initialEdges: Edge[] = []

function FlowCanvas({ selectedShape, selectedEdgeStyle }: FlowCanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const { screenToFlowPosition } = useReactFlow()
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedEdge, setSelectedEdge] = React.useState<string | null>(null)
  const genId = useCallback((prefix: string) => {
    const uuid = (globalThis as any).crypto?.randomUUID?.()
    return uuid ? `${prefix}-${uuid}` : `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1e6)}`
  }, [])

  const nodeTypes = React.useMemo(
    () => ({
      rectangle: RectangleNode,
      circle: CircleNode,
      ellipse: EllipseNode,
      diamond: DiamondNode,
    }),
    []
  )

  const edgeTypes = React.useMemo(
    () => ({
      default: BezierEdge,
      straight: StraightEdge,
      step: StepEdge,
      smoothstep: BezierEdge,
      dashed: BezierEdge,
    }),
    []
  )

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge: Edge = {
        ...params,
        id: genId('edge'),
        type: selectedEdgeStyle,
        style: {
          strokeWidth: 2,
          stroke: '#6b7280',
          strokeDasharray: selectedEdgeStyle === 'dashed' ? '8,4' : undefined,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 8,
          height: 8,
          color: '#6b7280',
        },
        data: { style: selectedEdgeStyle },
      }
      setEdges((eds) => addEdge(newEdge, eds))
    },
    [setEdges, selectedEdgeStyle, genId]
  )

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

  const onScaleChange = useCallback(
    (nodeId: string, scale: number) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId ? { ...node, data: { ...node.data, scale } } : node
        )
      )
    },
    [setNodes]
  )

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      if (event.metaKey || event.ctrlKey) {
        setNodes((nds) => nds.filter((n) => n.id !== node.id))
        setEdges((eds) => eds.filter((e) => e.source !== node.id && e.target !== node.id))
      }
    },
    [setNodes, setEdges]
  )

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
                    strokeDasharray: newStyle === 'dashed' ? '8,4' : undefined,
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

  const onPaneClick = useCallback(() => {
    setSelectedEdge(null)
  }, [])

  const onEdgeMouseEnter = useCallback((event: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge.id)
  }, [])

  const onEdgeMouseLeave = useCallback(() => {
  }, [])

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      if (!reactFlowWrapper.current) return

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      const shapeType =
        event.dataTransfer.getData('application/reactflow') ||
        event.dataTransfer.getData('shapeType') ||
        selectedShape
      const nodeId = genId(shapeType)

      const newNode: Node = {
        id: nodeId,
        type: shapeType,
        position,
        data: { id: nodeId, label: '', onLabelChange, onScaleChange, scale: 1 },
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [screenToFlowPosition, selectedShape, onLabelChange, onScaleChange, setNodes, genId]
  )

  const exportImage = async () => {
    if (!reactFlowWrapper.current) return

    const canvas = await html2canvas(reactFlowWrapper.current)
    const link = document.createElement('a')
    link.download = 'diagram.png'
    link.href = canvas.toDataURL()
    link.click()
  }

  return (
    <div className="h-full w-full relative">
      <ExportImageButton onClick={exportImage} />
      {selectedEdge && <EdgeStyleSelector onSelect={updateSelectedEdgeStyle} />}

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
          minZoom={0.2}
          maxZoom={5}
          zoomOnScroll={true}
          zoomOnPinch={true}
          zoomOnDoubleClick={true}
          panOnDrag={true}
          panOnScroll={false}
          preventScrolling={true}
          onInit={(inst) => inst.fitView({ padding: 0.1, minZoom: 0.2, maxZoom: 5 })}
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
        defaultEdgeOptions={{
          type: selectedEdgeStyle,
          style: {
            strokeWidth: 2,
            stroke: '#6b7280',
            strokeDasharray: selectedEdgeStyle === 'dashed' ? '8,4' : undefined,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 8,
            height: 8,
            color: '#6b7280',
          },
        }}
          proOptions={{ hideAttribution: true }}
        >
          <Controls position="bottom-left" />
          <Background bgColor="#ffffff" color="#ffffff" />
        </ReactFlow>
        <MiniMap
          position="bottom-right"
          nodeStrokeWidth={2}
          nodeStrokeColor="#64748b"
          nodeColor="#cbd5e1"
          bgColor="#ffffff"
          maskColor="rgba(0,0,0,0.08)"
          zoomable
          pannable
          zoomStep={0.1}
          style={{ width: 200, height: 140, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
        />
      </div>
    </div>
  )
}

const FlowCanvasWithProvider = ({ selectedShape, selectedEdgeStyle }: FlowCanvasProps) => {
  return (
    <ReactFlowProvider>
      <FlowCanvas selectedShape={selectedShape} selectedEdgeStyle={selectedEdgeStyle} />
    </ReactFlowProvider>
  )
}

export default FlowCanvasWithProvider