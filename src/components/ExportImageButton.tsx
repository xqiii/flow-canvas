import React from 'react'

function ExportImageButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="absolute top-6 right-6 z-10">
      <button
        onClick={onClick}
        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium backdrop-blur-sm"
      >
        📸 导出图片
      </button>
    </div>
  )
}

export default ExportImageButton