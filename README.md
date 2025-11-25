# Flow Map

一个基于 React、TypeScript 和 Vite 的轻量级流程图/关系图编辑器。支持拖拽添加节点、连接边、切换多种连线样式，并可一键导出为图片。

## 项目简介
- 可视化地创建矩形、圆形、椭圆、菱形等节点
- 通过拖拽连接器创建边，并支持直线、阶梯、平滑、虚线等样式
- 支持按住 `Cmd/Ctrl` 点击删除节点或边
- 支持在画布上对节点编辑标签与缩放
- 一键导出当前画布为 PNG 图片

## 技术栈
- `React` + `TypeScript` + `Vite`
- `reactflow` 用于图编辑基础能力
- `html2canvas` 用于导出图片

## 快速开始
- 安装依赖：`npm i`
- 开发启动：`npm run dev`
- 预览（适配本环境的本地预览服务）：`npm run preview`

## 使用指南
- 左侧选择节点形状后，拖拽到画布即可创建节点
- 在节点上拖拽连接器到另一个节点即可创建边
- 点击边后可在右上角选择不同连线样式
- `Cmd/Ctrl + 点击` 节点或边可快速删除
- 点击右上角导出按钮可生成当前画布的 PNG 图片

## 构建
- 生产构建：`npm run build`
- 构建产物位于 `dist`

## 目录结构
- 关键文件：
  - 画布组件：`src/components/FlowCanvas.tsx`
  - 节点组件：`src/components/nodes/*`
  - 边组件：`src/components/edges/CustomEdge.tsx`
  - 导出按钮：`src/components/ExportImageButton.tsx`

## 许可协议
本项目基于 MIT 开源许可证发布，详情见 `LICENSE` 文件。

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  extends: [
    // other configs...
    // Enable lint rules for React
    reactX.configs['recommended-typescript'],
    // Enable lint rules for React DOM
    reactDom.configs.recommended,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```
