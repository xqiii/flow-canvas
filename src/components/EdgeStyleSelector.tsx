import React from 'react'

function EdgeStyleSelector({ onSelect }: { onSelect: (style: string) => void }) {
  const styles = [
    { type: 'smoothstep', name: '曲线' },
    { type: 'step', name: '折线' },
    { type: 'straight', name: '直线' },
    { type: 'dashed', name: '虚线' },
  ]

  return (
    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-3 flex space-x-2">
      <span className="text-sm text-gray-600 flex items-center mr-2">连线样式:</span>
      {styles.map((style) => (
        <button
          key={style.type}
          onClick={() => onSelect(style.type)}
          className="px-3 py-1 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
        >
          {style.name}
        </button>
      ))}
    </div>
  )
}

export default EdgeStyleSelector