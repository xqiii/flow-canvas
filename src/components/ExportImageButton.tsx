import React from 'react'

function ExportImageButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="absolute top-6 right-6 z-10">
      <button
        onClick={onClick}
        className="bg-background text-foreground border border-border px-4 py-2 rounded-md shadow-sm hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        📸 导出图片
      </button>
    </div>
  )
}

export default ExportImageButton