import React, { useState } from 'react';
import FlowCanvasWithProvider from './components/FlowCanvas';

interface Shape {
  type: string;
  name: string;
  icon: string;
}

const shapes: Shape[] = [
  { type: 'rectangle', name: '矩形', icon: '▭' },
  { type: 'circle', name: '圆形', icon: '○' },
  { type: 'ellipse', name: '椭圆形', icon: '⬭' },
  { type: 'diamond', name: '菱形', icon: '◆' },
];

interface EdgeStyle {
  type: 'straight' | 'step' | 'smoothstep' | 'default' | 'dashed';
  name: string;
}

const edgeStyles: EdgeStyle[] = [
  { type: 'smoothstep', name: '曲线' },
  { type: 'step', name: '折线' },
  { type: 'straight', name: '直线' },
  { type: 'dashed', name: '虚线' },
  { type: 'default', name: '默认' },
];

function App() {
  const [selectedShape, setSelectedShape] = useState('rectangle');
  const [selectedEdgeStyle, setSelectedEdgeStyle] = useState<'straight' | 'step' | 'smoothstep' | 'default' | 'dashed'>('smoothstep');

  const handleDragStart = (e: React.DragEvent, shapeType: string) => {
    e.dataTransfer.setData('shapeType', shapeType);
    e.dataTransfer.setData('application/reactflow', shapeType);
    e.dataTransfer.setData('text/plain', shapeType);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="h-screen bg-background flex">
      {/* 左侧工具栏 */}
      <div className="w-20 bg-background border-r border-border flex flex-col items-center py-6 space-y-3">
        <div className="text-[20px] text-foreground font-medium mb-4 tracking-wide">图形</div>
        {shapes.map((shape) => (
          <div
            key={shape.type}
            draggable
            onDragStart={(e) => handleDragStart(e, shape.type)}
            onClick={() => setSelectedShape(shape.type)}
            className={`w-14 h-14 flex items-center justify-center rounded-md cursor-pointer ${
              selectedShape === shape.type
                ? 'bg-background border border-foreground text-foreground'
                : 'bg-background border border-border text-mutedForeground hover:bg-muted'
            }`}
            title={shape.name}
          >
            <span className="text-xl font-light">{shape.icon}</span>
          </div>
        ))}
        
        <div className="text-[20px] text-foreground font-medium mt-6 mb-4 tracking-wide">连线</div>
        {edgeStyles.map((style) => (
          <div
            key={style.type}
            onClick={() => setSelectedEdgeStyle(style.type)}
            className={`w-14 h-8 flex items-center justify-center rounded-md cursor-pointer text-xs ${
              selectedEdgeStyle === style.type
                ? 'bg-background border border-foreground text-foreground'
                : 'bg-background border border-border text-mutedForeground hover:bg-muted'
            }`}
            title={style.name}
          >
            <span className="font-medium">{style.name}</span>
          </div>
        ))}
      </div>

      {/* 主画布区域 */}
      <div className="flex-1 relative">
        <FlowCanvasWithProvider selectedShape={selectedShape} selectedEdgeStyle={selectedEdgeStyle} />
      </div>

    </div>
  );
}

export default App;
