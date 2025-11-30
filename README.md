<p align="center">
  <img src="public/favicon.svg" width="80" height="80" alt="Flow Map Logo">
</p>

<h1 align="center">Flow Map</h1>

<p align="center">
  <strong>轻量级流程图 / 组件关系图编辑器</strong>
</p>

<p align="center">
  基于 React + TypeScript + Vite 构建，支持拖拽创建节点、自由连线、多种样式切换，一键导出图片。
</p>

---

## ✨ 功能特性

- 🎨 **多种节点类型** — 矩形、圆形、椭圆、菱形，满足不同场景需求
- 🔗 **灵活连线** — 直线、阶梯、平滑曲线、虚线等多种边样式
- 📐 **任意缩放** — 支持独立调整节点宽高，实时显示尺寸
- ✏️ **双击编辑** — 节点内支持多行文本，自动换行
- 🗑️ **快捷删除** — `Cmd/Ctrl + 点击` 快速删除节点或连线
- 📷 **一键导出** — 导出当前画布为 PNG 图片
- 🌙 **深色模式** — 自动适配系统主题

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务
npm run dev

# 构建生产版本
npm run build
```

## 📖 使用指南

| 操作 | 说明 |
|------|------|
| 拖拽节点 | 从左侧选择形状，拖入画布创建节点 |
| 创建连线 | 从节点锚点拖拽到另一节点 |
| 编辑文字 | 双击节点进入编辑模式 |
| 调整大小 | 悬停节点，拖拽四角调整尺寸 |
| 切换线型 | 点击连线后在右上角选择样式 |
| 删除元素 | `Cmd/Ctrl + 点击` 节点或连线 |
| 导出图片 | 点击右上角导出按钮 |

## 🛠️ 技术栈

- **框架**: React 18 + TypeScript
- **构建**: Vite
- **图编辑**: @xyflow/react (React Flow)
- **样式**: Tailwind CSS
- **导出**: html2canvas

## 📁 项目结构

```
src/
├── components/
│   ├── FlowCanvas.tsx      # 主画布组件
│   ├── nodes/              # 节点组件
│   │   ├── RectangleNode.tsx
│   │   ├── CircleNode.tsx
│   │   ├── EllipseNode.tsx
│   │   └── DiamondNode.tsx
│   ├── EdgeStyleSelector.tsx
│   └── ExportImageButton.tsx
├── hooks/
│   └── useNodeResize.ts    # 节点缩放逻辑
└── pages/
    └── Home.tsx
```

## 📄 开源协议

本项目基于 [MIT](LICENSE) 协议开源。
