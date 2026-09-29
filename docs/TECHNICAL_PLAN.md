# Orbit Proxy 技术实施方案

## 1. 目标技术栈

- Electron
- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- SQLite，推荐 `better-sqlite3`
- Zod，用于 IPC 和外部数据校验
- Xray Core 或 sing-box，使用受控子进程运行
- Windows Credential Manager 或 DPAPI，保存敏感刷新凭证

当前 UI 位于 `src/App.tsx`。实施时应拆分模块，但不能重做视觉设计。

---

## 2. 进程边界

### Main Process

负责：

- 窗口生命周期
- 文件和目录选择
- SQLite
- 代理核心管理
- 系统代理和 TUN
- 子进程启动
- Claude Code 环境检测
- 浏览器启动
- Git 与 Worktree
- 授权和设备指纹
- 安全凭据存储

### Preload

只暴露类型安全的业务 API：

```ts
window.orbit.nodes.list()
window.orbit.nodes.import()
window.orbit.socks.create()
window.orbit.claude.launchProject()
window.orbit.claude.detectEnvironment()
window.orbit.license.activate()
```

禁止暴露：

- 任意 `fs`
- 任意 `shell`
- 任意 `child_process`
- 通用 `ipcRenderer.send`

### Renderer

负责：

- 页面展示
- 表单和交互状态
- 调用 preload API
- 展示任务进度

Renderer 不得直接控制系统代理或执行程序。

---

## 3. 推荐目录

```text
src/
  main/
    index.ts
    windows/
    ipc/
    services/
      proxy-core/
      system-proxy/
      routing/
      claude/
      browser/
      git/
      license/
      storage/
  preload/
    index.ts
    orbit-api.ts
  renderer/
    app/
    components/
    features/
      dashboard/
      nodes/
      socks/
      routing/
      app-proxy/
      claude-launcher/
      license/
  shared/
    contracts/
    schemas/
    types/
```

迁移可以分阶段进行，不要一次性删除当前 `src/App.tsx`。

---

## 4. 核心数据模型

```ts
type ProxyNode = {
  id: string;
  name: string;
  protocol: "vless" | "vmess" | "shadowsocks";
  encryptedPayload: string;
  host: string;
  port: number;
  latencyMs: number | null;
  lastTestedAt: string | null;
};

type SocksEndpoint = {
  id: string;
  nodeId: string;
  host: "127.0.0.1";
  port: number;
  status: "stopped" | "starting" | "running" | "error";
};

type ClaudeAccount = {
  id: string;
  name: string;
  email: string | null;
  configDirectory: string;
  browserProfileId: string | null;
  loginStatus: "unknown" | "logged-out" | "logged-in" | "expired";
  lastVerifiedAt: string | null;
};

type ClaudeProject = {
  id: string;
  name: string;
  directory: string;
  defaultAccountId: string;
  defaultBrowserId: string | null;
  terminal: string;
  commandTemplateId: string;
  initialPrompt: string | null;
};

type ClaudeInstance = {
  id: string;
  projectId: string;
  accountId: string;
  processId: number;
  workingDirectory: string;
  configDirectory: string;
  startedAt: string;
  status: "starting" | "running" | "stopping" | "stopped" | "error";
};
```

节点完整分享链接属于敏感数据，数据库中应加密保存。

---

## 5. IPC 设计

每个 IPC 请求包含：

- 唯一请求 ID
- Zod 参数校验
- 结构化成功结果
- 可展示错误码

建议错误格式：

```ts
type OrbitError = {
  code: string;
  message: string;
  action?: "retry" | "select-path" | "login" | "run-as-admin";
};
```

长任务通过事件返回进度：

```ts
type TaskProgress = {
  taskId: string;
  step: string;
  current: number;
  total: number;
  status: "running" | "done" | "failed";
};
```

---

## 6. Claude Code 启动服务

禁止使用拼接后的 PowerShell 字符串执行用户输入。

推荐：

```ts
spawn(claudeExecutable, args, {
  cwd: projectDirectory,
  env: {
    ...safeBaseEnvironment,
    CLAUDE_CONFIG_DIR: accountConfigDirectory,
    ALL_PROXY: fixedSocksUrl,
    HTTP_PROXY: fixedHttpProxyUrl,
    HTTPS_PROXY: fixedHttpProxyUrl,
  },
});
```

启动前：

1. 校验所有路径。
2. 检测项目并发。
3. 检查账号登录状态。
4. 检测固定出口。
5. 必要时创建 Worktree。
6. 启动指定浏览器窗口。
7. 启动终端或后台进程。

---

## 7. 固定 IP 检测

不要只请求一次公共 IP 服务。

建议：

- 使用至少两个 HTTPS IP 检测服务。
- 请求必须显式通过 Claude 专用代理。
- 对 Claude EXE 环境运行独立探针。
- 两个结果一致后才能绑定。
- 保存节点 ID、SOCKS ID、IP、检测时间和签名摘要。

如果检测结果变化：

- 立即阻止新 Claude 实例。
- 可配置是否停止已有实例。
- 要求用户解绑旧 IP。
- 重新检测和绑定。

---

## 8. 分阶段开发计划

### 阶段一：Electron 基础

- 添加 main/preload。
- 建立安全 IPC。
- 文件和目录选择。
- SQLite 与迁移。
- 将演示数据迁移到 Repository。

### 阶段二：代理核心

- 节点解析。
- Xray/sing-box 配置生成。
- SOCKS5 生命周期。
- 真实连接测试。
- 系统代理恢复。

### 阶段三：路由

- 预设模式。
- 自定义规则。
- GeoSite、GeoIP、GFW List 更新。
- TUN 与 DNS。

### 阶段四：Claude 启动器

- 环境检测。
- 账号目录。
- 登录状态。
- 项目、命令和浏览器。
- 进程状态。
- Worktree。
- 固定 IP。

### 阶段五：应用代理

- EXE 选择和规则。
- 环境变量启动包装器。
- Windows 进程级转发方案评估。

### 阶段六：授权

- 授权服务 API。
- 签名令牌。
- DPAPI。
- 设备绑定。
- 到期、撤销和离线宽限期。

### 阶段七：发布

- Windows 安装包。
- 代码签名。
- 自动更新。
- 崩溃恢复。
- 数据备份和迁移。

---

## 9. 首批 Claude Code 任务建议

按顺序交给 Claude Code：

1. “阅读 `CLAUDE.md` 和 `docs`，为当前 Vite 项目增加安全的 Electron main/preload 骨架，不修改现有 UI。”
2. “实现类型安全的目录选择 IPC，并把 Claude 项目目录选择接入现有界面。”
3. “增加 SQLite 数据层和迁移，实现节点、SOCKS5、ClaudeAccount、ClaudeProject 的 Repository。”
4. “将 `src/App.tsx` 中的节点演示数据替换为 IPC 数据，保持视觉和交互不变。”
5. “实现分享链接批量解析和二维码解析，只返回脱敏错误。”
6. “实现代理核心进程管理和单个 SOCKS5 生命周期。”
7. “实现 Claude Code 环境检测与项目启动服务。”
8. “实现全局固定 IP 双重检测和启动拦截。”

每个任务都应：

- 先列出修改计划。
- 保持改动范围小。
- 添加类型和错误处理。
- 运行 `pnpm run build`。
- 报告仍未实现的原生能力。
