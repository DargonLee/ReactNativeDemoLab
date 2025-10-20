
# ReactNativeDemoLab

> 基于 [Expo](https://expo.dev) 的 React Native 组件与功能实验室，支持多端（iOS/Android/Web）开发、测试与扩展。

---

## 快速开始

1. 安装依赖：
   ```bash
   npm install
   ```
2. 启动开发服务器：
   ```bash
   npx expo start
   ```
   按照终端提示选择在 iOS 模拟器、Android 模拟器、Web 或 Expo Go 中运行。

## 目录结构说明

```
├── app/                # 路由与页面目录，支持文件路由
│   ├── (tabs)/         # Tab 页签相关页面
│   ├── test/           # 动态测试页面（按组件名渲染）
│   ├── _layout.tsx     # 全局布局与导航配置
│   └── +not-found.tsx  # 404 页面
├── components/         # 复用组件库
│   ├── charts/         # 图表相关组件
│   ├── testui/         # UI 组件测试用例
│   └── ui/             # 通用UI组件
├── hooks/              # 自定义 hooks
├── constants/          # 常量配置
├── assets/             # 静态资源（图片、字体等）
├── scripts/            # 辅助脚本（如 reset-project）
├── types/              # TypeScript 类型定义
├── package.json        # 项目依赖与脚本
├── tsconfig.json       # TypeScript 配置
├── eslint.config.js    # ESLint 配置
└── README.md           # 项目说明文档
```

## 主要依赖

- `expo`、`react-native`、`expo-router`：基础框架与路由
- `@react-navigation/*`：导航
- `react-native-chart-kit`、`react-native-svg`：图表与可视化
- `expo-haptics`、`expo-font` 等：原生能力扩展
- `typescript`、`eslint`：类型与代码规范

详见 `package.json`。

## 常用脚本

| 命令                | 说明                       |
|---------------------|----------------------------|
| npm start           | 启动开发服务器             |
| npm run android     | 启动 Android 模拟器         |
| npm run ios         | 启动 iOS 模拟器             |
| npm run web         | 启动 Web 端                 |
| npm run lint        | 代码检查                   |
| npm run reset-project | 重置项目为空白模板（保留示例）|

## 扩展与维护建议

1. **新增页面/功能**：
   - 在 `app/` 下新建页面文件或目录，自动成为路由。
   - 复用组件建议放在 `components/`，并按功能分类。
2. **组件测试**：
   - 在 `components/testui/` 下添加测试用例，并在 `app/(tabs)/index.tsx` 注册。
   - 动态路由 `app/test/[component].tsx` 支持按名称渲染测试组件。
3. **样式与主题**：
   - 推荐使用 `ThemedText`、`ThemedView` 等自定义主题组件，便于暗色/亮色切换。
4. **类型与规范**：
   - 新增类型定义请放在 `types/`。
   - 保持 TypeScript 严格模式，使用 ESLint 保证代码质量。
5. **依赖管理**：
   - 新增依赖请同步更新 `package.json` 并说明用途。
6. **脚本与工具**：
   - 辅助脚本统一放在 `scripts/`，如需批量操作可参考 `reset-project.js`。

## 贡献指南

1. Fork 本仓库并新建分支进行开发。
2. 保持提交信息简洁明了。
3. 合并前请确保通过 lint 检查和基本功能测试。
4. 如有较大结构调整，请先在 Issue 中讨论。

## 参考资料

- [Expo 官方文档](https://docs.expo.dev/)
- [React Native 官方文档](https://reactnative.dev/)
- [expo-router 路由文档](https://expo.github.io/router/docs)

---

如需进一步扩展或维护本 README，请遵循模块化、分层、简明的原则，保持目录与功能说明同步。
