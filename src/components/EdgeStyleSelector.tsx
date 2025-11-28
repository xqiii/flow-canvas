import React from 'react'

function EdgeStyleSelector({ onSelect }: { onSelect: (style: string) => void }) {
  const styles = [
    { type: 'smoothstep', name: '曲线' },
    { type: 'step', name: '折线' },
    { type: 'straight', name: '直线' },
    { type: 'dashed', name: '虚线' },
  ]

  return (
    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10 bg-card border border-border rounded-md shadow-sm p-2 flex space-x-2">
      <span className="text-sm text-mutedForeground flex items-center mr-2">连线样式:</span>
      {styles.map((style) => (
        <button
          key={style.type}
          onClick={() => onSelect(style.type)}
          className="px-3 py-1 text-sm rounded-md bg-background border border-border text-foreground hover:bg-muted"
        >
          {style.name}
        </button>
      ))}
    </div>
  )
}

export default EdgeStyleSelector