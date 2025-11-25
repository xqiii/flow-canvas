import React, { useCallback, useRef } from 'react'
import ReactFlow, {
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
} from 'reactflow'
import 'reactflow/dist/style.css'
import html2canvas from 'html2canvas'
import ExportImageButton from './ExportImageButton'
import EdgeStyleSelector from './EdgeStyleSelector'
import RectangleNode from './nodes/RectangleNode'
import CircleNode from './nodes/CircleNode'
import EllipseNode from './nodes/EllipseNode'
import DiamondNode from './nodes/DiamondNode'
import CustomEdge from './edges/CustomEdge'

interface FlowCanvasProps {
  selectedShape: string
  selectedEdgeStyle: 'straight' | 'step' | 'smoothstep' | 'default' | 'dashed'
}

const initialNodes: Node[] = []
const initialEdges: Edge[] = []

function FlowCanvas({ selectedShape, selectedEdgeStyle }: FlowCanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const { project } = useReactFlow()
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedEdge, setSelectedEdge] = React.useState<string | null>(null)

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
      default: CustomEdge,
      straight: CustomEdge,
      step: CustomEdge,
      smoothstep: CustomEdge,
      dashed: CustomEdge,
    }),
    []
  )

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge: Edge = {
        ...params,
        id: `edge-${Date.now()}`,
        type: selectedEdgeStyle,
        style: { strokeWidth: 2, stroke: '#6b7280' },
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
    [setEdges, selectedEdgeStyle]
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
                  data: { ...edge.data, style: newStyle },
                }
              : edge
          )
        )
      }
    },
    [selectedEdge, setEdges]
  )

  const onEdgeUpdate = useCallback(
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

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
      const position = project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      })

      const newNode: Node = {
        id: `${selectedShape}-${Date.now()}`,
        type: selectedShape,
        position,
        data: { label: '', onLabelChange, onScaleChange, scale: 1 },
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [project, selectedShape, onLabelChange, onScaleChange, setNodes]
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

      <div ref={reactFlowWrapper} className="h-full w-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          onEdgeMouseEnter={onEdgeMouseEnter}
          onEdgeMouseLeave={onEdgeMouseLeave}
          onEdgeUpdate={onEdgeUpdate}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          connectionMode={ConnectionMode.Loose}
          fitView
          snapToGrid={true}
          snapGrid={[20, 20]}
          defaultEdgeOptions={{
            type: selectedEdgeStyle,
            style: { strokeWidth: 2, stroke: '#6b7280' },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 8,
              height: 8,
              color: '#6b7280',
            },
          }}
          proOptions={{ hideAttribution: true }}
        >
          <Controls />
          <Background />
        </ReactFlow>
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