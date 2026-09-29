@AGENTS.md

# Orbit Proxy 项目开发说明

本仓库当前包含完整的 React 产品原型。后续目标是将其实现为可发布的 Windows Electron 客户端。

开始开发前必须阅读：

- `docs/PRODUCT_SPEC.md`：完整产品需求、业务规则和验收标准。
- `docs/TECHNICAL_PLAN.md`：建议架构、模块边界、数据模型、IPC 与实施顺序。

开发原则：

1. 保留现有视觉设计、导航结构和交互语言，不重新创建另一套前端。
2. 将 `src/App.tsx` 中的演示数据逐步替换为类型安全的服务和 Electron IPC。
3. Renderer 不得直接获得 Node.js、文件系统或进程执行权限。
4. 所有代理核心、进程启动、账号目录、授权与设备指纹操作必须位于 Electron 主进程。
5. 不记录或展示 OAuth Token、API Key、完整卡密和 `.credentials.json` 内容。
6. 任何删除账号目录、停止进程、解绑固定 IP 等高风险操作必须二次确认。
7. 使用 `pnpm`，完成改动后运行 `pnpm run build`。
