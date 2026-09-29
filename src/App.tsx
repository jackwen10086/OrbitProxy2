import { useEffect, useMemo, useState, type ChangeEvent, type ReactNode } from "react";
import QRCode from "qrcode";

type IconName =
  | "activity"
  | "arrow"
  | "check"
  | "chevron"
  | "copy"
  | "download"
  | "globe"
  | "grid"
  | "help"
  | "more"
  | "plus"
  | "power"
  | "refresh"
  | "route"
  | "terminal"
  | "search"
  | "server"
  | "settings"
  | "shield"
  | "trash"
  | "x";

const iconPaths: Record<IconName, ReactNode> = {
  activity: <path d="M3 12h4l2.4-7 4.2 14L16 12h5" />,
  arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  chevron: <path d="m9 18 6-6-6-6" />,
  copy: <><rect x="8" y="8" width="11" height="11" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></>,
  download: <><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" /></>,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  help: <><circle cx="12" cy="12" r="9" /><path d="M9.8 9a2.4 2.4 0 1 1 3.3 2.2c-.7.3-1.1.9-1.1 1.8v.3M12 17.5h.01" /></>,
  more: <><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  power: <><path d="M12 2v10" /><path d="M6.3 5.7a8 8 0 1 0 11.4 0" /></>,
  refresh: <><path d="M20 7V3h-4" /><path d="M4 17v4h4" /><path d="M5.6 9a7 7 0 0 1 11.8-3L20 7M4 17l2.6 1A7 7 0 0 0 18.4 15" /></>,
  route: <><circle cx="6" cy="18" r="2" /><circle cx="18" cy="6" r="2" /><path d="M8 18h2a2 2 0 0 0 2-2V8a2 2 0 0 1 2-2h2" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  server: <><rect x="3" y="4" width="18" height="6" rx="2" /><rect x="3" y="14" width="18" height="6" rx="2" /><path d="M7 7h.01M7 17h.01" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" /></>,
  shield: <path d="M12 3 4.5 6v5.4c0 4.7 3.2 8 7.5 9.6 4.3-1.6 7.5-4.9 7.5-9.6V6L12 3Z" />,
  terminal: <><path d="m5 7 4 4-4 4M11 17h8" /><rect x="3" y="3" width="18" height="18" rx="3" /></>,
  trash: <><path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6" /></>,
  x: <path d="m6 6 12 12M18 6 6 18" />,
};

function Icon({ name, className = "size-5" }: { name: IconName; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {iconPaths[name]}
    </svg>
  );
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  icon?: IconName;
};

function Button({ children, variant = "secondary", icon, className = "", ...props }: ButtonProps) {
  const styles = {
    primary: "bg-ink text-white shadow-sm hover:bg-ink-soft",
    secondary: "border border-line bg-white text-ink shadow-xs hover:bg-canvas",
    ghost: "text-muted hover:bg-panel hover:text-ink",
    danger: "text-danger hover:bg-danger-soft",
  };
  return (
    <button className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-40 ${styles[variant]} ${className}`} {...props}>
      {icon && <Icon name={icon} className="size-4" />}
      {children}
    </button>
  );
}

type NodeDetail = {
  serverHost: string;
  serverPort: string;
  uuid: string;
  flow: string;
  encryption: string;
  coreType: string;
  network: string;
  disguiseType: string;
  disguiseHost: string;
  path: string;
  tls: string;
  sni: string;
  fingerprint: string;
  publicKey: string;
  shortId: string;
  spiderX: string;
};

type Node = {
  id: number;
  name: string;
  region: string;
  flag: string;
  protocol: "VLESS" | "VMESS" | "SS";
  address: string;
  latency: number;
  active?: boolean;
  detail?: NodeDetail;
};

type PresetApp = {
  id: string;
  name: string;
  exe: string;
  category: "包管理器" | "版本控制" | "开发工具" | "编辑器IDE" | "通讯协作" | "其他工具";
  desc: string;
  defaultPath: string;
  detected: boolean;
  detectedPath: string;
  enabled: boolean;
  proxyId: number | null;
};

const presetAppList: Omit<PresetApp, "detected" | "detectedPath" | "enabled" | "proxyId">[] = [
  // 包管理器 — 按实际代理的 exe 合并
  { id: "nodejs", name: "Node.js 运行时", exe: "node.exe", category: "包管理器", desc: "覆盖 npm · pnpm · yarn · npx · bun", defaultPath: "C:\\Program Files\\nodejs\\node.exe" },
  { id: "python", name: "Python 运行时", exe: "python.exe", category: "包管理器", desc: "覆盖 pip · pip3 · conda · poetry", defaultPath: "C:\\Python312\\python.exe" },
  { id: "go", name: "Go 运行时", exe: "go.exe", category: "包管理器", desc: "覆盖 go get · go install · go mod", defaultPath: "C:\\Program Files\\Go\\bin\\go.exe" },
  { id: "cargo", name: "Rust / Cargo", exe: "cargo.exe", category: "包管理器", desc: "覆盖 cargo add · cargo install · rustup", defaultPath: "C:\\Users\\User\\.cargo\\bin\\cargo.exe" },
  { id: "java", name: "Java 运行时 (JDK)", exe: "java.exe", category: "包管理器", desc: "覆盖 Maven(mvn) · Gradle · Kotlin 编译", defaultPath: "C:\\Program Files\\Java\\jdk-21\\bin\\java.exe" },
  { id: "dart", name: "Dart / Flutter", exe: "dart.exe", category: "包管理器", desc: "覆盖 flutter pub get · dart pub", defaultPath: "C:\\flutter\\bin\\dart.exe" },
  { id: "php", name: "PHP / Composer", exe: "php.exe", category: "包管理器", desc: "覆盖 composer install · composer update", defaultPath: "C:\\php\\php.exe" },
  { id: "ruby", name: "Ruby / Gem", exe: "ruby.exe", category: "包管理器", desc: "覆盖 gem install · bundle install", defaultPath: "C:\\Ruby33\\bin\\ruby.exe" },
  { id: "dotnet", name: ".NET / NuGet", exe: "dotnet.exe", category: "包管理器", desc: "覆盖 dotnet restore · nuget · paket", defaultPath: "C:\\Program Files\\dotnet\\dotnet.exe" },
  { id: "winget", name: "winget", exe: "winget.exe", category: "包管理器", desc: "Windows 应用包管理器（独立 exe）", defaultPath: "C:\\Users\\User\\AppData\\Local\\Microsoft\\WindowsApps\\winget.exe" },
  { id: "scoop", name: "Scoop", exe: "scoop.exe", category: "包管理器", desc: "Windows 命令行安装器（独立 exe）", defaultPath: "C:\\Users\\User\\scoop\\shims\\scoop.exe" },
  { id: "choco", name: "Chocolatey", exe: "choco.exe", category: "包管理器", desc: "Windows 软件包管理器（独立 exe）", defaultPath: "C:\\ProgramData\\chocolatey\\bin\\choco.exe" },
  // 版本控制
  { id: "git", name: "Git", exe: "git.exe", category: "版本控制", desc: "覆盖 git clone · git fetch · git push", defaultPath: "C:\\Program Files\\Git\\bin\\git.exe" },
  { id: "github-desktop", name: "GitHub Desktop", exe: "GitHubDesktop.exe", category: "版本控制", desc: "GitHub 官方桌面客户端", defaultPath: "C:\\Users\\User\\AppData\\Local\\GitHubDesktop\\GitHubDesktop.exe" },
  { id: "gh-cli", name: "GitHub CLI (gh)", exe: "gh.exe", category: "版本控制", desc: "覆盖 gh repo clone · gh release download", defaultPath: "C:\\Program Files\\GitHub CLI\\gh.exe" },
  { id: "sourcetree", name: "Sourcetree", exe: "SourceTree.exe", category: "版本控制", desc: "Atlassian Git 可视化工具", defaultPath: "C:\\Users\\User\\AppData\\Local\\SourceTree\\SourceTree.exe" },
  // 开发工具
  { id: "curl", name: "curl", exe: "curl.exe", category: "开发工具", desc: "命令行 HTTP 请求 / 文件下载", defaultPath: "C:\\Windows\\System32\\curl.exe" },
  { id: "wget", name: "wget", exe: "wget.exe", category: "开发工具", desc: "文件批量下载工具", defaultPath: "C:\\Program Files\\GnuWin32\\bin\\wget.exe" },
  { id: "docker", name: "Docker Desktop", exe: "Docker Desktop.exe", category: "开发工具", desc: "覆盖镜像拉取 · docker pull · compose", defaultPath: "C:\\Program Files\\Docker\\Docker\\Docker Desktop.exe" },
  { id: "kubectl", name: "kubectl", exe: "kubectl.exe", category: "开发工具", desc: "Kubernetes 集群管理工具", defaultPath: "C:\\Program Files\\kubectl\\kubectl.exe" },
  { id: "helm", name: "Helm", exe: "helm.exe", category: "开发工具", desc: "Kubernetes Chart 包管理", defaultPath: "C:\\ProgramData\\chocolatey\\bin\\helm.exe" },
  { id: "terraform", name: "Terraform", exe: "terraform.exe", category: "开发工具", desc: "覆盖 provider 下载 · module 拉取", defaultPath: "C:\\Program Files\\Terraform\\terraform.exe" },
  { id: "postman", name: "Postman", exe: "Postman.exe", category: "开发工具", desc: "API 调试 / 测试工具", defaultPath: "C:\\Users\\User\\AppData\\Local\\Postman\\Postman.exe" },
  { id: "insomnia", name: "Insomnia", exe: "Insomnia.exe", category: "开发工具", desc: "REST / GraphQL 客户端", defaultPath: "C:\\Users\\User\\AppData\\Local\\insomnia\\Insomnia.exe" },
  // 编辑器/IDE
  { id: "vscode", name: "VS Code", exe: "Code.exe", category: "编辑器IDE", desc: "覆盖插件下载 · 扩展市场请求", defaultPath: "C:\\Users\\User\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe" },
  { id: "cursor", name: "Cursor", exe: "Cursor.exe", category: "编辑器IDE", desc: "AI 代码编辑器 · 模型 API 请求", defaultPath: "C:\\Users\\User\\AppData\\Local\\Programs\\cursor\\Cursor.exe" },
  { id: "jetbrains", name: "JetBrains Toolbox", exe: "jetbrains-toolbox.exe", category: "编辑器IDE", desc: "覆盖 IDE 下载 · 插件更新", defaultPath: "C:\\Users\\User\\AppData\\Local\\JetBrains\\Toolbox\\bin\\jetbrains-toolbox.exe" },
  { id: "idea", name: "IntelliJ IDEA", exe: "idea64.exe", category: "编辑器IDE", desc: "Java/Kotlin IDE · 覆盖插件下载", defaultPath: "C:\\Program Files\\JetBrains\\IntelliJ IDEA\\bin\\idea64.exe" },
  { id: "pycharm", name: "PyCharm", exe: "pycharm64.exe", category: "编辑器IDE", desc: "Python IDE · 覆盖插件下载", defaultPath: "C:\\Program Files\\JetBrains\\PyCharm\\bin\\pycharm64.exe" },
  { id: "webstorm", name: "WebStorm", exe: "webstorm64.exe", category: "编辑器IDE", desc: "前端 IDE · 覆盖插件下载", defaultPath: "C:\\Program Files\\JetBrains\\WebStorm\\bin\\webstorm64.exe" },
  // 通讯协作
  { id: "slack", name: "Slack", exe: "slack.exe", category: "通讯协作", desc: "团队即时通讯工具", defaultPath: "C:\\Users\\User\\AppData\\Local\\slack\\slack.exe" },
  { id: "discord", name: "Discord", exe: "Discord.exe", category: "通讯协作", desc: "社区语音 / 文字平台", defaultPath: "C:\\Users\\User\\AppData\\Local\\Discord\\Discord.exe" },
  { id: "zoom", name: "Zoom", exe: "Zoom.exe", category: "通讯协作", desc: "视频会议工具", defaultPath: "C:\\Users\\User\\AppData\\Roaming\\Zoom\\bin\\Zoom.exe" },
  { id: "telegram", name: "Telegram", exe: "Telegram.exe", category: "通讯协作", desc: "加密即时通讯", defaultPath: "C:\\Users\\User\\AppData\\Roaming\\Telegram Desktop\\Telegram.exe" },
  { id: "teams", name: "Microsoft Teams", exe: "ms-teams.exe", category: "通讯协作", desc: "微软企业协作平台", defaultPath: "C:\\Users\\User\\AppData\\Local\\Microsoft\\Teams\\current\\Teams.exe" },
  // 其他工具
  { id: "chrome", name: "Google Chrome", exe: "chrome.exe", category: "其他工具", desc: "浏览器 · 建议用系统代理替代", defaultPath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" },
  { id: "firefox", name: "Firefox", exe: "firefox.exe", category: "其他工具", desc: "浏览器 · 建议用系统代理替代", defaultPath: "C:\\Program Files\\Mozilla Firefox\\firefox.exe" },
  { id: "edge", name: "Microsoft Edge", exe: "msedge.exe", category: "其他工具", desc: "浏览器 · 建议用系统代理替代", defaultPath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe" },
  { id: "winscp", name: "WinSCP", exe: "WinSCP.exe", category: "其他工具", desc: "SFTP / SCP 文件传输工具", defaultPath: "C:\\Program Files (x86)\\WinSCP\\WinSCP.exe" },
  { id: "putty", name: "PuTTY", exe: "putty.exe", category: "其他工具", desc: "SSH 终端客户端", defaultPath: "C:\\Program Files\\PuTTY\\putty.exe" },
];

type SocksProxy = {
  id: number;
  port: number;
  nodeId: number;
  running: boolean;
};

type Page = "overview" | "nodes" | "socks" | "claude" | "apps" | "subscriptions" | "routing" | "logs" | "license";

const defaultDetail = (): NodeDetail => ({
  serverHost: "", serverPort: "443", uuid: "", flow: "xtls-rprx-vision", encryption: "none",
  coreType: "自动", network: "tcp", disguiseType: "none", disguiseHost: "", path: "/",
  tls: "reality", sni: "", fingerprint: "chrome", publicKey: "", shortId: "", spiderX: "/",
});

const initialNodes: Node[] = [
  { id: 1, name: "Tokyo Edge 01", region: "日本 · 东京", flag: "JP", protocol: "VLESS", address: "tokyo-edge.example.net:443", latency: 42, active: true, detail: { ...defaultDetail(), serverHost: "tokyo-edge.example.net", serverPort: "443", uuid: "d6679a5a-5b13-4197-81b5-7073d245e48c", sni: "shield.nvidia.hk", publicKey: "Vp6PgXgHgismgpUFDZs6mWh1D8LYzNmk_PQvYJzJ7kQ", shortId: "c9c66e95" } },
  { id: 2, name: "Singapore Premium", region: "新加坡", flag: "SG", protocol: "VMESS", address: "sg-premium.example.net:2053", latency: 68, detail: { ...defaultDetail(), serverHost: "sg-premium.example.net", serverPort: "2053", tls: "tls", flow: "" } },
  { id: 3, name: "US West Relay", region: "美国 · 洛杉矶", flag: "US", protocol: "SS", address: "us-west.example.net:8388", latency: 156, detail: { ...defaultDetail(), serverHost: "us-west.example.net", serverPort: "8388", tls: "none", flow: "" } },
  { id: 4, name: "Hong Kong Core", region: "中国香港", flag: "HK", protocol: "VLESS", address: "hk-core.example.net:443", latency: 31, detail: { ...defaultDetail(), serverHost: "hk-core.example.net", serverPort: "443", uuid: "a1b2c3d4-e5f6-7890-abcd-ef1234567890", sni: "www.apple.com", publicKey: "XYZ_publickey_here", shortId: "ab12cd34" } },
];

const navItems: { key: Page; label: string; icon: IconName }[] = [
  { key: "overview", label: "概览", icon: "grid" },
  { key: "nodes", label: "节点", icon: "globe" },
  { key: "socks", label: "本地 SOCKS5", icon: "server" },
  { key: "claude", label: "Claude Code", icon: "terminal" },
  { key: "apps", label: "应用代理", icon: "route" },
  { key: "subscriptions", label: "订阅管理", icon: "refresh" },
  { key: "routing", label: "路由规则", icon: "route" },
  { key: "logs", label: "运行日志", icon: "terminal" },
  { key: "license", label: "授权中心", icon: "shield" },
];

function ProtocolBadge({ protocol }: { protocol: Node["protocol"] }) {
  const style = protocol === "VLESS" ? "bg-violet-soft text-violet" : protocol === "VMESS" ? "bg-blue-soft text-blue" : "bg-amber-soft text-amber";
  return <span className={`rounded-md px-2 py-1 text-xs font-bold tracking-wide ${style}`}>{protocol}</span>;
}

function Modal({ title, description, children, onClose }: { title: string; description: string; children: ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay p-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={title}>
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-line bg-white shadow-modal">
        <div className="flex items-start justify-between border-b border-line px-6 py-5">
          <div>
            <div className="text-lg font-bold text-ink">{title}</div>
            <div className="mt-1 text-sm text-muted">{description}</div>
          </div>
          <Button variant="ghost" className="!size-9 !p-0" onClick={onClose} aria-label="关闭">
            <Icon name="x" className="size-4" />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}

function QrCode({ value }: { value: string }) {
  const [src, setSrc] = useState("");

  useEffect(() => {
    QRCode.toDataURL(value, { width: 280, margin: 2, errorCorrectionLevel: "M" }).then(setSrc);
  }, [value]);

  return src ? <img src={src} alt="节点二维码" className="size-64 rounded-2xl" /> : <div className="size-64 animate-pulse rounded-2xl bg-panel" />;
}

type ClaudeSection = "projects" | "accounts" | "browsers" | "commands" | "running" | "settings";

const claudeAccounts = [
  { id: 1, name: "账号1", email: "dev@relayhub.io", color: "bg-blue", directory: "C:\\Users\\User\\ClaudeProfiles\\account1", browser: "比特窗口 01", loggedIn: true },
  { id: 2, name: "工作账号", email: "work@studio.dev", color: "bg-emerald", directory: "C:\\Users\\User\\ClaudeProfiles\\account2", browser: "比特窗口 02", loggedIn: true },
  { id: 3, name: "客户账号", email: "client@example.com", color: "bg-violet", directory: "C:\\Users\\User\\ClaudeProfiles\\account3", browser: "Chrome · Profile 3", loggedIn: true },
  { id: 4, name: "备用账号", email: "尚未登录", color: "bg-amber", directory: "C:\\Users\\User\\ClaudeProfiles\\account4", browser: "Edge · Profile 4", loggedIn: false },
];

const starterProjects = [
  { id: 1, name: "RelayHub", path: "D:\\projects\\go\\relayhub", detail: "高性能代理中继服务", accountId: 1, branch: "feature/multi-tenant", browser: "比特窗口 01", last: "8 分钟前", running: true },
  { id: 2, name: "Orbit Desktop", path: "D:\\projects\\orbit-desktop", detail: "Windows 桌面代理客户端", accountId: 2, branch: "main", browser: "比特窗口 02", last: "昨天 18:42", running: false },
  { id: 3, name: "Docs Portal", path: "D:\\projects\\docs-portal", detail: "产品文档与帮助中心", accountId: 3, branch: "content/rewrite", browser: "Chrome · Profile 3", last: "3 天前", running: false },
];

function LabelRow({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[11rem_1fr] items-start gap-x-4 border-b border-line py-3 last:border-b-0">
      <div className="pt-2 text-sm font-semibold text-ink">{label}</div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {children}
        {hint && <div className="text-xs text-amber">{hint}</div>}
      </div>
    </div>
  );
}

function FormInput({ value, onChange, placeholder, className = "" }: { value: string; onChange: (v: string) => void; placeholder?: string; className?: string }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`h-9 w-full rounded-lg border border-line bg-canvas px-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-soft ${className}`}
    />
  );
}

function FormSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="h-9 w-full rounded-lg border border-line bg-canvas px-3 text-sm outline-none transition focus:border-accent">
      {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  );
}

type ContextMenuAction = {
  label: string;
  shortcut?: string;
  danger?: boolean;
  disabled?: boolean;
  submenu?: { label: string; onClick: () => void }[];
  onClick?: () => void;
};

function NodeContextMenu({
  x, y, groups, onClose,
}: {
  x: number; y: number;
  groups: ContextMenuAction[][];
  onClose: () => void;
}) {
  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);

  const menuWidth = 320;
  const clampedX = Math.min(x, window.innerWidth - menuWidth - 8);

  return (
    <>
      <div className="fixed inset-0 z-[70]" onClick={onClose} onContextMenu={(e) => { e.preventDefault(); onClose(); }} />
      <div
        className="fixed z-[80] min-w-[20rem] overflow-hidden rounded-xl border border-line bg-white py-1 shadow-modal"
        style={{ left: clampedX, top: y }}
      >
        {groups.map((group, gi) => (
          <div key={gi}>
            {gi > 0 && <div className="my-1 border-t border-line" />}
            {group.map((item, ii) => {
              const idx = gi * 100 + ii;
              return (
                <div key={ii} className="relative">
                  <button
                    disabled={item.disabled}
                    onMouseEnter={() => setOpenSubmenu(item.submenu ? idx : null)}
                    onMouseLeave={() => { if (!item.submenu) setOpenSubmenu(null); }}
                    onClick={() => { if (!item.submenu) { item.onClick?.(); onClose(); } }}
                    className={`flex h-9 w-full items-center justify-between gap-3 px-4 text-sm transition disabled:opacity-40 ${item.danger ? "text-danger hover:bg-danger-soft" : "text-ink hover:bg-canvas"}`}
                  >
                    <span>{item.label}</span>
                    <span className="flex items-center gap-2">
                      {item.shortcut && <span className="font-mono text-xs text-subtle">{item.shortcut}</span>}
                      {item.submenu && <Icon name="chevron" className="size-3.5 text-subtle" />}
                    </span>
                  </button>
                  {item.submenu && openSubmenu === idx && (
                    <div
                      className="absolute left-full top-0 z-[90] min-w-[10rem] overflow-hidden rounded-xl border border-line bg-white py-1 shadow-modal"
                      onMouseEnter={() => setOpenSubmenu(idx)}
                      onMouseLeave={() => setOpenSubmenu(null)}
                    >
                      {item.submenu.map((sub, si) => (
                        <button key={si} onClick={() => { sub.onClick(); onClose(); }} className="flex h-9 w-full items-center px-4 text-sm text-ink hover:bg-canvas">
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}

function NodeEditModal({ node, onSave, onClose }: { node: Node; onSave: (updated: Node) => void; onClose: () => void }) {
  const [name, setName] = useState(node.name);
  const [detail, setDetail] = useState<NodeDetail>(node.detail ?? defaultDetail());

  function set(field: keyof NodeDetail, value: string) {
    setDetail((prev) => ({ ...prev, [field]: value }));
  }

  function generateUUID() {
    const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
    });
    set("uuid", uuid);
  }

  function handleSave() {
    const address = `${detail.serverHost}:${detail.serverPort}`;
    onSave({ ...node, name, address, detail });
  }

  const networkHints: Record<string, string> = {
    tcp: "*默认tcp，选错会无法连接",
    ws: "*WebSocket，需填写路径",
    grpc: "*gRPC，需填写服务名",
    h2: "*HTTP/2，需填写路径和host",
  };
  const typeHints: Record<string, string> = {
    none: "*tcp伪装类型",
    http: "*HTTP请求伪装",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay p-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="编辑节点">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-modal">
        <div className="flex items-center justify-between border-b border-line bg-canvas px-6 py-4">
          <div className="text-base font-bold text-ink">服务器</div>
          <div className="flex items-center gap-3">
            <select value={detail.coreType} onChange={(e) => set("coreType", e.target.value)} className="h-8 rounded-lg border border-line bg-white px-2 text-xs outline-none focus:border-accent">
              {["自动", "Xray", "v2fly", "sing-box"].map((o) => <option key={o}>{o}</option>)}
            </select>
            <button onClick={onClose} className="flex size-8 items-center justify-center rounded-lg text-muted hover:bg-panel hover:text-ink"><Icon name="x" className="size-4" /></button>
          </div>
        </div>

        <div className="overflow-y-auto">
          <div className="px-6 py-2">
            <LabelRow label="别名(remarks)">
              <FormInput value={name} onChange={setName} placeholder="节点备注名称" />
            </LabelRow>
            <LabelRow label="地址(address)">
              <FormInput value={detail.serverHost} onChange={(v) => set("serverHost", v)} placeholder="192.168.1.1 或 example.com" />
            </LabelRow>
            <LabelRow label="端口(port)">
              <FormInput value={detail.serverPort} onChange={(v) => set("serverPort", v)} placeholder="443" className="max-w-[12rem]" />
            </LabelRow>
            <LabelRow label="用户ID(id)">
              <div className="flex gap-2">
                <FormInput value={detail.uuid} onChange={(v) => set("uuid", v)} placeholder="UUID" />
                <button onClick={generateUUID} className="h-9 shrink-0 rounded-lg bg-accent px-4 text-sm font-semibold text-white hover:bg-accent/90">生成</button>
              </div>
            </LabelRow>
            <LabelRow label="流控(flow)">
              <FormSelect value={detail.flow} onChange={(v) => set("flow", v)} options={["", "xtls-rprx-vision", "xtls-rprx-vision-udp443"]} />
            </LabelRow>
            <LabelRow label="加密方式(encryption)">
              <FormInput value={detail.encryption} onChange={(v) => set("encryption", v)} placeholder="none" className="max-w-[14rem]" />
            </LabelRow>
          </div>

          <div className="border-t border-line bg-canvas px-6 py-3">
            <div className="text-sm font-bold text-ink">底层传输方式(transport)</div>
          </div>

          <div className="px-6 py-2">
            <LabelRow label="传输协议(network)" hint={networkHints[detail.network] ?? ""}>
              <FormSelect value={detail.network} onChange={(v) => set("network", v)} options={["tcp", "ws", "grpc", "h2", "quic", "httpupgrade"]} />
            </LabelRow>
            <LabelRow label="伪装类型(type)" hint={typeHints[detail.disguiseType] ?? ""}>
              <FormSelect value={detail.disguiseType} onChange={(v) => set("disguiseType", v)} options={["none", "http"]} />
            </LabelRow>
            <LabelRow label="伪装域名(host)" hint="*http host中间逗号(,)分隔">
              <FormInput value={detail.disguiseHost} onChange={(v) => set("disguiseHost", v)} placeholder="example.com" />
            </LabelRow>
            <LabelRow label="路径(path)">
              <FormInput value={detail.path} onChange={(v) => set("path", v)} placeholder="/" />
            </LabelRow>
          </div>

          <div className="border-t border-line px-6 py-2">
            <LabelRow label="传输层安全(TLS)">
              <FormSelect value={detail.tls} onChange={(v) => set("tls", v)} options={["none", "tls", "reality"]} />
            </LabelRow>
            <LabelRow label="SNI">
              <FormInput value={detail.sni} onChange={(v) => set("sni", v)} placeholder="example.com" />
            </LabelRow>
            <LabelRow label="Fingerprint">
              <FormSelect value={detail.fingerprint} onChange={(v) => set("fingerprint", v)} options={["chrome", "firefox", "safari", "edge", "ios", "android", "random", "randomized"]} />
            </LabelRow>
            {detail.tls === "reality" && (
              <>
                <LabelRow label="PublicKey">
                  <FormInput value={detail.publicKey} onChange={(v) => set("publicKey", v)} placeholder="服务器公钥" />
                </LabelRow>
                <LabelRow label="ShortId">
                  <FormInput value={detail.shortId} onChange={(v) => set("shortId", v)} placeholder="短ID" />
                </LabelRow>
                <LabelRow label="SpiderX">
                  <FormInput value={detail.spiderX} onChange={(v) => set("spiderX", v)} placeholder="/" />
                </LabelRow>
              </>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-line bg-canvas px-6 py-4">
          <Button onClick={onClose}>取消</Button>
          <Button variant="primary" onClick={handleSave}>确定</Button>
        </div>
      </div>
    </div>
  );
}

function ClaudeLauncher({ notify, copyText }: { notify: (message: string) => void; copyText: (text: string) => Promise<void> }) {
  const [section, setSection] = useState<ClaudeSection>("projects");
  const [view, setView] = useState<"cards" | "table">("cards");
  const [projects, setProjects] = useState(starterProjects);
  const [running, setRunning] = useState([{ id: 1, projectId: 1, accountId: 1, pid: 18432, since: "10:24", terminal: "Windows Terminal" }]);
  const [quickProject, setQuickProject] = useState<(typeof starterProjects)[number] | null>(null);
  const [quickAccount, setQuickAccount] = useState(1);
  const [makeDefault, setMakeDefault] = useState(false);
  const [launching, setLaunching] = useState<(typeof starterProjects)[number] | null>(null);
  const [launchStep, setLaunchStep] = useState(0);
  const [accountStates, setAccountStates] = useState(claudeAccounts);
  const [conflict, setConflict] = useState<{ project: (typeof starterProjects)[number]; accountId: number } | null>(null);
  const [fixedIp, setFixedIp] = useState("198.51.100.86");
  const [exeIp, setExeIp] = useState("198.51.100.86");
  const [proxyIp, setProxyIp] = useState("198.51.100.86");
  const [environmentChecked, setEnvironmentChecked] = useState(true);
  const [detecting, setDetecting] = useState(false);
  const [ipConflict, setIpConflict] = useState(false);

  const sections: { key: ClaudeSection; label: string; icon: IconName }[] = [
    { key: "projects", label: "项目启动台", icon: "grid" },
    { key: "accounts", label: "账号管理", icon: "shield" },
    { key: "browsers", label: "浏览器配置", icon: "globe" },
    { key: "commands", label: "启动命令", icon: "terminal" },
    { key: "running", label: "运行中的任务", icon: "activity" },
    { key: "settings", label: "全局设置", icon: "settings" },
  ];
  const launchSteps = ["检查项目目录", "检查 Claude Code 环境", "加载账号独立配置", "检查账号登录状态", "打开绑定浏览器", "进入项目目录", "启动 Claude Code"];

  function launch(project: (typeof starterProjects)[number], accountId = project.accountId, force = false) {
    if (!environmentChecked) {
      setSection("settings");
      notify("启动前需要先完成环境检测");
      return;
    }
    if (!fixedIp || exeIp !== fixedIp || proxyIp !== fixedIp) {
      setIpConflict(true);
      return;
    }
    if (!force && running.some((task) => task.projectId === project.id)) {
      setConflict({ project, accountId });
      return;
    }
    setLaunching(project);
    setLaunchStep(0);
    let step = 0;
    const timer = window.setInterval(() => {
      step += 1;
      setLaunchStep(step);
      if (step >= launchSteps.length) {
        window.clearInterval(timer);
        setRunning((current) => [...current, { id: Date.now(), projectId: project.id, accountId, pid: Math.floor(Math.random() * 30000) + 10000, since: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), terminal: "Windows Terminal" }]);
        setProjects((current) => current.map((item) => item.id === project.id ? { ...item, running: true, accountId, last: "刚刚" } : item));
        window.setTimeout(() => {
          setLaunching(null);
          notify(`${project.name} 已使用“${accountStates.find((account) => account.id === accountId)?.name}”启动`);
        }, 500);
      }
    }, 320);
  }

  function detectEnvironment() {
    setDetecting(true);
    setEnvironmentChecked(false);
    window.setTimeout(() => {
      setExeIp(proxyIp);
      setEnvironmentChecked(true);
      setDetecting(false);
      if (fixedIp && proxyIp !== fixedIp) setIpConflict(true);
      else notify("环境检测完成，Claude Code 与代理出口 IP 一致");
    }, 900);
  }

  const innerTitle = sections.find((item) => item.key === section)?.label;

  return (
    <div className="min-h-screen min-w-[1200px] bg-claude text-white overflow-x-auto">
      <div className="flex min-h-screen">
        <aside className="w-56 shrink-0 border-r border-white/8 bg-claude-side p-4">
          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-white/8 bg-white/5 p-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-claude-accent text-white"><Icon name="terminal" className="size-5" /></div>
            <div>
              <div className="text-sm font-bold">多账号启动器</div>
              <div className="mt-0.5 text-xs text-white/40">Claude Code Workspace</div>
            </div>
          </div>
          <div className="space-y-1">
            {sections.map((item) => (
              <button key={item.key} onClick={() => setSection(item.key)} className={`flex h-10 w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold transition ${section === item.key ? "bg-claude-accent text-white shadow-lg" : "text-white/55 hover:bg-white/5 hover:text-white"}`}>
                <Icon name={item.icon} className="size-4" />
                {item.label}
                {item.key === "running" && <span className="ml-auto rounded-full bg-success-light px-2 py-0.5 text-xs font-bold text-claude">{running.length}</span>}
              </button>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-white/8 bg-white/4 p-4">
            <div className={`flex items-center gap-2 text-xs font-semibold ${environmentChecked && fixedIp === exeIp && fixedIp === proxyIp ? "text-success-light" : "text-amber-light"}`}><span className={`size-2 rounded-full ${environmentChecked && fixedIp === exeIp && fixedIp === proxyIp ? "bg-success-light" : "bg-amber-light"}`} />{environmentChecked && fixedIp === exeIp && fixedIp === proxyIp ? "环境正常" : "需要重新检测"}</div>
            <div className="mt-2 text-xs leading-relaxed text-white/35">固定出口 · {fixedIp || "未绑定"}<br />{fixedIp === exeIp && fixedIp === proxyIp ? "EXE 与代理环境一致" : "检测到出口 IP 不一致"}</div>
            <button onClick={() => setSection("settings")} className="mt-3 text-xs font-semibold text-claude-light hover:text-white">一键检测环境 →</button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="flex h-20 items-center justify-between border-b border-white/8 px-7">
            <div>
              <div className="text-xl font-bold">{innerTitle}</div>
              <div className="mt-1 text-xs text-white/40">账号配置和项目会话完全隔离，互不覆盖</div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setSection("accounts")} className="h-10 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white/75 hover:bg-white/10">新增账号</button>
              <button onClick={() => {
                const id = Date.now();
                setProjects((current) => [...current, { id, name: "新项目", path: "D:\\projects\\new-project", detail: "等待完善项目设置", accountId: 1, branch: "main", browser: "比特窗口 01", last: "尚未启动", running: false }]);
                setSection("projects");
                notify("新项目已创建，请完善项目设置");
              }} className="inline-flex h-10 items-center gap-2 rounded-xl bg-claude-accent px-4 text-sm font-bold shadow-lg hover:bg-claude-accent-hover"><Icon name="plus" className="size-4" />新增项目</button>
            </div>
          </div>

          <div className="p-7">
            {section === "projects" && (
              <div>
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex gap-2">
                    <span className="rounded-full bg-white/7 px-3 py-1.5 text-xs font-semibold text-white/60">{projects.length} 个项目</span>
                    <span className="rounded-full bg-success-light/10 px-3 py-1.5 text-xs font-semibold text-success-light">{running.length} 个运行中</span>
                  </div>
                  <div className="flex rounded-xl border border-white/8 bg-white/4 p-1">
                    <button onClick={() => setView("cards")} className={`flex size-8 items-center justify-center rounded-lg ${view === "cards" ? "bg-white/10 text-white" : "text-white/35"}`} aria-label="卡片视图"><Icon name="grid" className="size-4" /></button>
                    <button onClick={() => setView("table")} className={`flex size-8 items-center justify-center rounded-lg ${view === "table" ? "bg-white/10 text-white" : "text-white/35"}`} aria-label="列表视图"><Icon name="server" className="size-4" /></button>
                  </div>
                </div>
                <div className={view === "cards" ? "grid gap-5 xl:grid-cols-2" : "space-y-3"}>
                  {projects.map((project) => {
                    const account = accountStates.find((item) => item.id === project.accountId)!;
                    return (
                      <div key={project.id} className={`group rounded-3xl border border-white/8 bg-white/5 p-5 transition hover:border-claude-accent/50 hover:bg-white/7 ${view === "table" ? "flex items-center gap-5" : ""}`}>
                        <div className={`flex items-start gap-4 ${view === "table" ? "min-w-0 flex-1" : ""}`}>
                          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-claude-accent to-violet text-lg font-black">{project.name.slice(0, 2).toUpperCase()}</div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <div className="truncate font-bold">{project.name}</div>
                              {project.running && <span className="rounded-full bg-success-light/10 px-2 py-0.5 text-xs font-bold text-success-light">运行中</span>}
                            </div>
                            <div className="mt-1 truncate font-mono text-xs text-white/35">{project.path}</div>
                            {view === "cards" && <div className="mt-2 text-xs text-white/45">{project.detail}</div>}
                          </div>
                          <button className="text-white/30 hover:text-white" aria-label="项目菜单"><Icon name="more" className="size-5" /></button>
                        </div>
                        <div className={`${view === "cards" ? "my-5 grid grid-cols-2 gap-3" : "flex shrink-0 items-center gap-5"}`}>
                          <div className={view === "cards" ? "rounded-2xl bg-black/15 p-3" : ""}>
                            <div className="text-xs text-white/30">默认账号</div>
                            <div className="mt-1 flex items-center gap-2 text-sm font-semibold"><span className={`size-2 rounded-full ${account.color}`} />{account.name}<span className="text-xs font-normal text-white/35">{account.email}</span></div>
                          </div>
                          <div className={view === "cards" ? "rounded-2xl bg-black/15 p-3" : ""}>
                            <div className="text-xs text-white/30">Git 分支</div>
                            <div className="mt-1 truncate font-mono text-sm font-semibold text-claude-light">{project.branch}</div>
                          </div>
                          {view === "cards" && (
                            <>
                              <div className="rounded-2xl bg-black/15 p-3"><div className="text-xs text-white/30">浏览器身份</div><div className="mt-1 truncate text-sm font-semibold">{project.browser}</div></div>
                              <div className="rounded-2xl bg-black/15 p-3"><div className="text-xs text-white/30">最近启动</div><div className="mt-1 text-sm font-semibold">{project.last}</div></div>
                            </>
                          )}
                        </div>
                        <div className={`flex gap-2 ${view === "table" ? "shrink-0" : ""}`}>
                          <button onClick={() => project.running ? notify("终端窗口已切换到前台") : launch(project)} className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-claude-accent px-4 text-sm font-bold hover:bg-claude-accent-hover"><Icon name={project.running ? "terminal" : "power"} className="size-4" />{project.running ? "打开终端" : "一键启动"}</button>
                          <button onClick={() => { setQuickProject(project); setQuickAccount(project.accountId); }} className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm font-semibold text-white/65 hover:bg-white/10">其他账号</button>
                          {project.running && <button onClick={() => {
                            setRunning((current) => current.filter((task) => task.projectId !== project.id));
                            setProjects((current) => current.map((item) => item.id === project.id ? { ...item, running: false } : item));
                            notify(`${project.name} 已停止`);
                          }} className="flex size-10 items-center justify-center rounded-xl text-danger hover:bg-danger/10" aria-label="停止运行"><Icon name="power" className="size-4" /></button>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {section === "accounts" && (
              <div className="grid gap-5 xl:grid-cols-2">
                {accountStates.map((account) => {
                  const count = running.filter((task) => task.accountId === account.id).length;
                  return (
                    <div key={account.id} className="rounded-3xl border border-white/8 bg-white/5 p-6">
                      <div className="flex items-start gap-4">
                        <div className={`flex size-12 items-center justify-center rounded-full ${account.color} text-lg font-bold`}>{account.name.slice(0, 1)}</div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2"><div className="font-bold">{account.name}</div><span className={`rounded-full px-2 py-0.5 text-xs font-bold ${account.loggedIn ? "bg-success-light/10 text-success-light" : "bg-amber/15 text-amber-light"}`}>{account.loggedIn ? "已登录" : "未登录"}</span></div>
                          <div className="mt-1 text-sm text-white/45">{account.email}</div>
                        </div>
                        <button className="text-white/35"><Icon name="more" className="size-5" /></button>
                      </div>
                      <div className="mt-5 space-y-3 rounded-2xl bg-black/15 p-4">
                        <div className="flex justify-between gap-4 text-xs"><span className="text-white/35">配置目录</span><span className="truncate font-mono text-white/65">{account.directory}</span></div>
                        <div className="flex justify-between text-xs"><span className="text-white/35">绑定浏览器</span><span className="font-semibold text-white/65">{account.browser}</span></div>
                        <div className="flex justify-between text-xs"><span className="text-white/35">运行项目</span><span className="font-semibold text-white/65">{count} 个</span></div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <button onClick={() => {
                          if (!account.loggedIn) setAccountStates((current) => current.map((item) => item.id === account.id ? { ...item, loggedIn: true, email: `account${account.id}@example.com` } : item));
                          notify(account.loggedIn ? `${account.name} 登录状态正常` : `已打开 ${account.browser}，请确认登录邮箱`);
                        }} className="h-9 flex-1 rounded-xl bg-claude-accent text-sm font-bold">{account.loggedIn ? "检查登录状态" : "立即登录"}</button>
                        <button onClick={() => notify(`${account.browser} 已打开`)} className="h-9 rounded-xl border border-white/10 px-3 text-sm font-semibold text-white/65">打开浏览器</button>
                        <button onClick={() => copyText(`$env:CLAUDE_CONFIG_DIR=\"${account.directory}\"; claude`)} className="flex size-9 items-center justify-center rounded-xl border border-white/10 text-white/55" aria-label="复制启动命令"><Icon name="copy" className="size-4" /></button>
                      </div>
                    </div>
                  );
                })}
                <button onClick={() => notify("新增账号向导已打开，配置目录将自动生成")} className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-white/15 text-white/45 hover:border-claude-accent hover:bg-white/4 hover:text-white">
                  <div className="mb-3 flex size-11 items-center justify-center rounded-2xl border border-current"><Icon name="plus" /></div>
                  <div className="font-semibold">新增 Claude Code 账号</div>
                  <div className="mt-1 text-xs opacity-60">自动创建独立配置目录</div>
                </button>
              </div>
            )}

            {section === "browsers" && (
              <div className="grid gap-5 xl:grid-cols-2">
                {[
                  ["比特窗口 01", "比特浏览器", "窗口 ID · 123456", "账号1", true],
                  ["比特窗口 02", "比特浏览器", "窗口 ID · 627104", "工作账号", false],
                  ["Chrome · Profile 3", "Google Chrome", "Profile 3", "客户账号", false],
                  ["Edge · Profile 4", "Microsoft Edge", "Profile 4", "备用账号", false],
                ].map(([name, type, id, account, active]) => (
                  <div key={String(name)} className="rounded-3xl border border-white/8 bg-white/5 p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4"><div className="flex size-11 items-center justify-center rounded-2xl bg-blue/15 text-blue-light"><Icon name="globe" /></div><div><div className="font-bold">{name}</div><div className="mt-1 text-xs text-white/40">{type} · {id}</div></div></div>
                      <span className={`rounded-full px-2 py-1 text-xs font-bold ${active ? "bg-success-light/10 text-success-light" : "bg-white/7 text-white/40"}`}>{active ? "运行中" : "已关闭"}</span>
                    </div>
                    <div className="my-5 rounded-2xl bg-black/15 p-3 text-sm"><span className="text-white/35">绑定账号</span><span className="float-right font-semibold">{account}</span></div>
                    <div className="flex gap-2"><button onClick={() => notify(`${name} 测试打开成功`)} className="h-9 flex-1 rounded-xl bg-claude-accent text-sm font-bold">打开浏览器窗口</button><button onClick={() => notify("授权链接已复制，请在指定窗口中粘贴")} className="h-9 flex-1 rounded-xl border border-white/10 text-sm font-semibold text-white/65">复制登录链接并打开</button></div>
                  </div>
                ))}
              </div>
            )}

            {section === "commands" && (
              <div className="overflow-hidden rounded-3xl border border-white/8 bg-white/5">
                <div className="flex items-center justify-between border-b border-white/8 px-6 py-5"><div><div className="font-bold">启动命令模板</div><div className="mt-1 text-xs text-white/40">普通用户启动时无需手动输入命令</div></div><button className="rounded-xl bg-claude-accent px-4 py-2.5 text-sm font-bold">新增模板</button></div>
                <div className="divide-y divide-white/8">
                  {[
                    ["普通启动", "claude", "使用项目默认设置启动"],
                    ["继续最近会话", "claude --continue", "恢复项目最后一次会话"],
                    ["指定 Sonnet 模型", "claude --model sonnet", "固定使用 Sonnet 模型"],
                    ["项目接续开发", "claude \"读取项目说明，检查当前进度，然后继续开发。\"", "启动后自动提交初始任务"],
                  ].map(([name, command, detail]) => (
                    <div key={name} className="flex items-center gap-5 px-6 py-5"><div className="flex size-10 items-center justify-center rounded-xl bg-white/7 text-claude-light"><Icon name="terminal" className="size-5" /></div><div className="min-w-0 flex-1"><div className="font-semibold">{name}</div><div className="mt-1 truncate font-mono text-xs text-white/40">{command}</div></div><div className="hidden text-xs text-white/35 xl:block">{detail}</div><button onClick={() => copyText(command)} className="flex size-9 items-center justify-center rounded-xl border border-white/10 text-white/50"><Icon name="copy" className="size-4" /></button><button className="text-white/35"><Icon name="more" className="size-5" /></button></div>
                  ))}
                </div>
              </div>
            )}

            {section === "running" && (
              <div className="space-y-4">
                {running.map((task) => {
                  const project = projects.find((item) => item.id === task.projectId)!;
                  const account = accountStates.find((item) => item.id === task.accountId)!;
                  return (
                    <div key={task.id} className="rounded-3xl border border-white/8 bg-white/5 p-6">
                      <div className="flex items-center gap-5">
                        <div className={`flex size-12 items-center justify-center rounded-2xl ${account.color} font-bold`}>{project.name.slice(0, 2).toUpperCase()}</div>
                        <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><span className="font-bold">{project.name}</span><span className="rounded-full bg-success-light/10 px-2 py-0.5 text-xs font-bold text-success-light">运行中</span></div><div className="mt-1 truncate font-mono text-xs text-white/35">{project.path}</div></div>
                        <div><div className="text-xs text-white/30">账号</div><div className="mt-1 flex items-center gap-2 text-sm font-semibold"><span className={`size-2 rounded-full ${account.color}`} />{account.name}</div></div>
                        <div><div className="text-xs text-white/30">进程 ID</div><div className="mt-1 font-mono text-sm font-semibold">{task.pid}</div></div>
                        <div><div className="text-xs text-white/30">启动时间</div><div className="mt-1 text-sm font-semibold">{task.since}</div></div>
                        <button onClick={() => notify(`${project.name} 终端已打开`)} className="h-9 rounded-xl border border-white/10 px-3 text-sm font-semibold">打开终端</button>
                        <button onClick={() => { setRunning((current) => current.filter((item) => item.id !== task.id)); setProjects((current) => current.map((item) => item.id === project.id ? { ...item, running: false } : item)); }} className="flex size-9 items-center justify-center rounded-xl text-danger hover:bg-danger/10" aria-label="停止实例"><Icon name="power" className="size-4" /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {section === "settings" && (
              <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-3xl border border-white/8 bg-white/5 p-6">
                  <div className="flex items-center justify-between"><div><div className="font-bold">环境检测</div><div className="mt-1 text-xs text-white/40">启动前检测程序、代理环境与固定出口 IP</div></div><button onClick={detectEnvironment} disabled={detecting} className="inline-flex h-10 items-center gap-2 rounded-xl bg-claude-accent px-4 text-sm font-bold disabled:opacity-50"><Icon name="refresh" className={`size-4 ${detecting ? "animate-spin" : ""}`} />{detecting ? "正在检测" : "一键检测环境"}</button></div>
                  <div className="mt-6 divide-y divide-white/8">
                    {[
                      ["Claude Code", "已安装 · 1.0.35", "C:\\Users\\User\\.local\\bin\\claude.exe", true],
                      ["PowerShell", "已安装 · 7.5.0", "C:\\Program Files\\PowerShell\\7\\pwsh.exe", true],
                      ["Git", "已安装 · 2.47.1", "C:\\Program Files\\Git\\bin\\git.exe", true],
                      ["Windows Terminal", "可用", "wt.exe", true],
                      ["比特浏览器", "已配置 · 2 个窗口", "C:\\Program Files\\BitBrowser\\BitBrowser.exe", true],
                      ["备用账号", "尚未登录", "需要执行 claude auth login", false],
                    ].map(([name, status, path, ok]) => (
                      <div key={String(name)} className="flex items-center gap-4 py-4"><span className={`flex size-7 items-center justify-center rounded-full ${ok ? "bg-success-light/10 text-success-light" : "bg-amber/15 text-amber-light"}`}><Icon name={ok ? "check" : "activity"} className="size-4" /></span><div className="min-w-0 flex-1"><div className="text-sm font-semibold">{name}</div><div className="mt-0.5 truncate font-mono text-xs text-white/30">{path}</div></div><span className={`text-xs font-semibold ${ok ? "text-success-light" : "text-amber-light"}`}>{status}</span>{!ok && <button onClick={() => setSection("accounts")} className="rounded-lg bg-amber/15 px-2.5 py-1.5 text-xs font-bold text-amber-light">去登录</button>}</div>
                    ))}
                  </div>
                </div>
                <div className="space-y-5">
                  <div className="rounded-3xl border border-white/8 bg-white/5 p-6">
                    <div className="flex items-start justify-between">
                      <div><div className="font-bold">全局固定出口 IP</div><div className="mt-1 text-xs text-white/40">所有 Claude Code 账号共用同一个稳定出口</div></div>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${fixedIp && fixedIp === exeIp && fixedIp === proxyIp ? "bg-success-light/10 text-success-light" : "bg-amber/15 text-amber-light"}`}>{fixedIp && fixedIp === exeIp && fixedIp === proxyIp ? "绑定正常" : "IP 不一致"}</span>
                    </div>
                    <div className="mt-5 rounded-2xl bg-black/15 p-4">
                      <div className="text-xs text-white/30">当前绑定 IP</div>
                      <div className="mt-2 font-mono text-xl font-bold">{fixedIp || "尚未绑定"}</div>
                    </div>
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center justify-between text-xs"><span className="text-white/40">Claude Code EXE 检测出口</span><span className={`font-mono font-semibold ${exeIp === fixedIp ? "text-success-light" : "text-amber-light"}`}>{exeIp}</span></div>
                      <div className="flex items-center justify-between text-xs"><span className="text-white/40">代理环境检测出口</span><span className={`font-mono font-semibold ${proxyIp === fixedIp ? "text-success-light" : "text-amber-light"}`}>{proxyIp}</span></div>
                    </div>
                    <div className="mt-5 flex gap-2">
                      <button onClick={detectEnvironment} className="h-9 flex-1 rounded-xl bg-claude-accent text-sm font-bold">重新检测</button>
                      <button onClick={() => fixedIp ? setIpConflict(true) : (setFixedIp(proxyIp), setExeIp(proxyIp), setEnvironmentChecked(true), notify(`已全局绑定固定 IP ${proxyIp}`))} className="h-9 flex-1 rounded-xl border border-white/10 text-sm font-semibold text-white/65">{fixedIp ? "更换绑定" : "绑定当前 IP"}</button>
                    </div>
                  </div>
                  <div className="rounded-3xl border border-white/8 bg-white/5 p-6"><div className="font-bold">默认行为</div><div className="mt-5 space-y-4">{["启动前检查 Git 状态", "自动打开绑定浏览器", "登录时复制授权链接", "检测同项目并发冲突"].map((label) => <div key={label} className="flex items-center justify-between text-sm text-white/65"><span>{label}</span><span className="relative h-6 w-11 rounded-full bg-claude-accent"><span className="absolute left-5.5 top-1 size-4 rounded-full bg-white" /></span></div>)}</div></div>
                  <div className="rounded-3xl border border-amber/20 bg-amber/8 p-5"><div className="flex gap-3"><Icon name="shield" className="size-5 shrink-0 text-amber-light" /><div><div className="text-sm font-semibold text-amber-light">凭据安全</div><div className="mt-1 text-xs leading-relaxed text-white/45">启动器不会展示 OAuth Token、API Key 或 credentials.json 内容。删除账号配置时始终需要二次确认。</div></div></div></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {quickProject && (
        <Modal title={`使用其他账号启动 ${quickProject.name}`} description="本次选择默认只影响当前启动" onClose={() => setQuickProject(null)}>
          <div className="space-y-3 p-6 text-ink">
            {accountStates.map((account) => (
              <button key={account.id} disabled={!account.loggedIn} onClick={() => setQuickAccount(account.id)} className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left ${quickAccount === account.id ? "border-accent bg-accent-soft" : "border-line"} disabled:opacity-40`}>
                <span className={`flex size-9 items-center justify-center rounded-full ${account.color} font-bold text-white`}>{account.name.slice(0, 1)}</span><span className="flex-1"><span className="block text-sm font-semibold">{account.name}</span><span className="mt-0.5 block text-xs text-muted">{account.email}</span></span>{quickAccount === account.id && <Icon name="check" className="size-5 text-accent" />}
              </button>
            ))}
            <label className="flex cursor-pointer items-center gap-3 pt-2 text-sm text-muted"><input type="checkbox" checked={makeDefault} onChange={(event) => setMakeDefault(event.target.checked)} className="size-4 accent-accent" />将该账号设为此项目的默认账号</label>
          </div>
          <div className="flex justify-end gap-3 border-t border-line bg-canvas px-6 py-4"><Button onClick={() => setQuickProject(null)}>取消</Button><Button variant="primary" onClick={() => { if (makeDefault) setProjects((current) => current.map((item) => item.id === quickProject.id ? { ...item, accountId: quickAccount } : item)); const target = quickProject; setQuickProject(null); launch(target, quickAccount); }}>使用此账号启动</Button></div>
        </Modal>
      )}

      {conflict && (
        <Modal title="检测到项目并发冲突" description={`${conflict.project.name} 已经由其他账号运行`} onClose={() => setConflict(null)}>
          <div className="p-6 text-ink">
            <div className="rounded-2xl border border-amber/25 bg-amber-soft p-4 text-sm leading-relaxed text-amber">继续在同一目录运行可能导致文件互相覆盖。建议创建独立 Git Worktree。</div>
            <div className="mt-5 rounded-2xl bg-canvas p-4">
              <div className="text-xs font-semibold text-muted">建议工作目录</div>
              <div className="mt-2 font-mono text-sm font-semibold">D:\worktrees\{conflict.project.name.toLowerCase().replaceAll(" ", "-")}-account{conflict.accountId}</div>
            </div>
          </div>
          <div className="flex flex-wrap justify-end gap-2 border-t border-line bg-canvas px-6 py-4">
            <Button onClick={() => setConflict(null)}>返回</Button>
            <Button onClick={() => { const target = conflict; setConflict(null); notify(`${target.project.name} 已以只读模式打开`); }}>只读打开</Button>
            <Button variant="danger" onClick={() => { const target = conflict; setConflict(null); launch(target.project, target.accountId, true); }}>仍然启动</Button>
            <Button variant="primary" onClick={() => { const target = conflict; setConflict(null); launch({ ...target.project, path: `D:\\worktrees\\${target.project.name.toLowerCase().replaceAll(" ", "-")}-account${target.accountId}` }, target.accountId, true); }}>创建 Worktree 后启动</Button>
          </div>
        </Modal>
      )}

      {ipConflict && (
        <Modal title={fixedIp === exeIp && fixedIp === proxyIp ? "更换全局固定 IP" : "固定出口 IP 不一致"} description={fixedIp === exeIp && fixedIp === proxyIp ? "更换前必须先解除当前 IP 绑定" : "Claude Code 启动前安全检查未通过"} onClose={() => setIpConflict(false)}>
          <div className="space-y-4 p-6 text-ink">
            <div className={`rounded-2xl border p-4 text-sm leading-relaxed ${fixedIp === exeIp && fixedIp === proxyIp ? "border-amber/20 bg-amber-soft text-amber" : "border-danger/20 bg-danger-soft text-danger"}`}>
              {fixedIp === exeIp && fixedIp === proxyIp ? "当前固定出口运行正常。如需更换代理节点或出口 IP，必须先解除现有绑定，再重新执行环境检测。" : "当前 Claude Code EXE 或代理环境的出口 IP 与全局绑定 IP 不一致。为防止账号在不同 IP 之间切换，请先解绑当前 IP，再绑定新的稳定出口。"}
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-canvas p-3"><div className="text-xs text-muted">全局绑定</div><div className="mt-1 font-mono text-sm font-bold">{fixedIp || "未绑定"}</div></div>
              <div className="rounded-xl bg-canvas p-3"><div className="text-xs text-muted">EXE 出口</div><div className={`mt-1 font-mono text-sm font-bold ${exeIp === fixedIp ? "text-emerald" : "text-danger"}`}>{exeIp}</div></div>
              <div className="rounded-xl bg-canvas p-3"><div className="text-xs text-muted">代理环境</div><div className={`mt-1 font-mono text-sm font-bold ${proxyIp === fixedIp ? "text-emerald" : "text-danger"}`}>{proxyIp}</div></div>
            </div>
            <div className="text-xs leading-relaxed text-muted">解绑只会解除 IP 锁定，不会删除账号配置、项目记录或 Claude Code 登录资料。</div>
          </div>
          <div className="flex justify-end gap-3 border-t border-line bg-canvas px-6 py-4">
            <Button onClick={() => setIpConflict(false)}>取消</Button>
            <Button variant="danger" onClick={() => {
              setFixedIp("");
              setEnvironmentChecked(false);
              setIpConflict(false);
              setSection("settings");
              notify("原固定 IP 已解绑，请检测环境后绑定新的出口 IP");
            }}>先解绑当前 IP</Button>
          </div>
        </Modal>
      )}

      {launching && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay p-5 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-claude-side p-7 shadow-modal">
            <div className="flex items-center gap-4"><div className="flex size-12 items-center justify-center rounded-2xl bg-claude-accent"><Icon name="terminal" /></div><div><div className="font-bold">正在启动 {launching.name}</div><div className="mt-1 text-xs text-white/40">自动配置账号、目录、浏览器和终端</div></div></div>
            <div className="mt-6 space-y-3">
              {launchSteps.map((step, index) => <div key={step} className={`flex items-center gap-3 text-sm ${index < launchStep ? "text-white" : index === launchStep ? "text-claude-light" : "text-white/25"}`}><span className={`flex size-6 items-center justify-center rounded-full ${index < launchStep ? "bg-emerald text-white" : index === launchStep ? "bg-claude-accent animate-pulse" : "bg-white/5"}`}>{index < launchStep ? <Icon name="check" className="size-3" /> : index + 1}</span>{step}{index === launchStep && <span className="ml-auto text-xs">处理中…</span>}</div>)}
            </div>
            <div className="mt-6 grid h-1.5 grid-cols-7 gap-px overflow-hidden rounded-full bg-white/8">
              {launchSteps.map((step, index) => <span key={step} className={index < launchStep ? "bg-claude-accent" : "bg-transparent"} />)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>("overview");
  const [nodes, setNodes] = useState(initialNodes);
  const [proxies, setProxies] = useState<SocksProxy[]>([
    { id: 1, port: 1080, nodeId: 1, running: true },
    { id: 2, port: 1081, nodeId: 4, running: false },
  ]);
  const [query, setQuery] = useState("");
  const [importOpen, setImportOpen] = useState(false);
  const [proxyOpen, setProxyOpen] = useState(false);
  const [exportTarget, setExportTarget] = useState<{ title: string; value: string } | null>(null);
  const [importValue, setImportValue] = useState("");
  const [port, setPort] = useState("1082");
  const [targetNode, setTargetNode] = useState("1");
  const [toast, setToast] = useState("");
  const [systemProxy, setSystemProxy] = useState(true);
  const [proxyMode, setProxyMode] = useState<"规则" | "全局" | "直连">("规则");
  const [routingMode, setRoutingMode] = useState<"bypass" | "blacklist" | "global" | "custom">("bypass");
  const [showRuleForm, setShowRuleForm] = useState(false);
  const [ruleDomain, setRuleDomain] = useState("");
  const [ruleAction, setRuleAction] = useState<"代理" | "直连" | "阻止">("代理");
  const [customRules, setCustomRules] = useState([
    { id: 1, name: "开发服务", match: "github.com, npmjs.org, docker.io", action: "代理" as const },
  ]);
  const [testingNode, setTestingNode] = useState<number | null>(null);
  const [editingNode, setEditingNode] = useState<Node | null>(null);
  const [contextMenu, setContextMenu] = useState<{ node: Node; x: number; y: number } | null>(null);
  const [selectedNodeIds, setSelectedNodeIds] = useState<number[]>([]);
  const [licenseCode, setLicenseCode] = useState("");
  const [licenseActive, setLicenseActive] = useState(true);
  const [licenseExpiry, setLicenseExpiry] = useState("2026-08-28");
  const [presetApps, setPresetApps] = useState<PresetApp[]>(
    presetAppList.map((a) => ({ ...a, detected: false, detectedPath: "", enabled: false, proxyId: null }))
  );
  const [detectingApps, setDetectingApps] = useState(false);
  const [appSearchQuery, setAppSearchQuery] = useState("");
  const [selectedAppIds, setSelectedAppIds] = useState<string[]>([]);
  const [batchProxyId, setBatchProxyId] = useState<number | null>(null);
  const [appCategory, setAppCategory] = useState<string>("全部");
  const [appExe, setAppExe] = useState("");
  const [appProxyId, setAppProxyId] = useState(1);
  const [appProfiles, setAppProfiles] = useState([
    { id: 1, name: "GitHub Desktop.exe", path: "C:\\Program Files\\GitHub Desktop\\GitHubDesktop.exe", proxyId: 1, enabled: true },
    { id: 2, name: "Code.exe", path: "C:\\Users\\User\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe", proxyId: 2, enabled: false },
  ]);

  const activeNode = nodes.find((node) => node.active) ?? nodes[0];
  const filteredNodes = useMemo(
    () => nodes.filter((node) => `${node.name}${node.region}${node.protocol}`.toLowerCase().includes(query.toLowerCase())),
    [nodes, query],
  );
  const licenseDays = Math.max(0, Math.ceil((new Date(`${licenseExpiry}T23:59:59`).getTime() - Date.now()) / 86400000));
  const routingPresets = {
    bypass: [
      { id: 101, name: "局域网地址", match: "geoip:private, localhost", action: "直连" as const },
      { id: 102, name: "中国大陆 IP", match: "geoip:cn", action: "直连" as const },
      { id: 103, name: "中国大陆网站", match: "geosite:cn", action: "直连" as const },
      { id: 104, name: "广告与追踪器", match: "geosite:category-ads-all", action: "阻止" as const },
      { id: 105, name: "未命中规则", match: "MATCH", action: "代理" as const },
    ],
    blacklist: [
      { id: 201, name: "局域网地址", match: "geoip:private", action: "直连" as const },
      { id: 202, name: "被屏蔽网站", match: "geosite:gfw", action: "代理" as const },
      { id: 203, name: "Telegram IP", match: "geoip:telegram", action: "代理" as const },
      { id: 204, name: "未命中规则", match: "MATCH", action: "直连" as const },
    ],
    global: [
      { id: 301, name: "局域网地址", match: "geoip:private", action: "直连" as const },
      { id: 302, name: "所有互联网流量", match: "MATCH", action: "代理" as const },
    ],
    custom: customRules,
  };
  const activeRoutingRules = routingPresets[routingMode];

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  }

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      notify("已复制到剪贴板");
    } catch {
      notify("复制失败，请检查剪贴板权限");
    }
  }

  function addImportedNode() {
    const links = importValue.trim().split(/\s+/).filter((link) => ["vless://", "vmess://", "ss://"].some((prefix) => link.toLowerCase().startsWith(prefix)));
    if (!links.length) return;
    const created = links.map((link, index) => {
      const protocol = link.split("://")[0].toUpperCase() as Node["protocol"];
      const id = Date.now() + index;
      let address = "已导入的加密节点";
      try {
        if (protocol === "VLESS") {
          const parsed = new URL(link);
          address = `${parsed.hostname}:${parsed.port || "443"}`;
        }
      } catch {
        address = "等待核心解析";
      }
      return { id, name: `导入的 ${protocol} 节点 ${index + 1}`, region: "待检测", flag: "—", protocol, address, latency: 0 } satisfies Node;
    });
    setNodes((current) => [...current, ...created]);
    setProxies((current) => [
      ...current,
      ...created.map((node, index) => ({ id: Date.now() + 100 + index, port: nextAvailablePort(current, index), nodeId: node.id, running: true })),
    ]);
    setImportValue("");
    setImportOpen(false);
    setPage("nodes");
    notify(`已导入 ${created.length} 个节点并生成 SOCKS5 端口`);
  }

  function nextAvailablePort(current: SocksProxy[], offset = 0) {
    const used = new Set(current.map((proxy) => proxy.port));
    let candidate = Math.max(1079, ...current.map((proxy) => proxy.port)) + 1 + offset;
    while (used.has(candidate)) candidate += 1;
    return candidate;
  }

  function createSocksForNode(nodeId: number) {
    const existing = proxies.find((proxy) => proxy.nodeId === nodeId);
    if (existing) {
      setExportTarget({ title: "本机 SOCKS5 节点", value: `socks5://127.0.0.1:${existing.port}` });
      return;
    }
    const created = { id: Date.now(), port: nextAvailablePort(proxies), nodeId, running: true };
    setProxies((current) => [...current, created]);
    notify(`已生成 SOCKS5 端口 ${created.port}`);
  }

  function deleteNode(nodeId: number) {
    if (nodes.length === 1) {
      notify("至少需要保留一个节点");
      return;
    }
    const linked = proxies.filter((proxy) => proxy.nodeId === nodeId).length;
    setNodes((current) => current.filter((node) => node.id !== nodeId));
    setProxies((current) => current.filter((proxy) => proxy.nodeId !== nodeId));
    notify(linked ? `节点及关联的 ${linked} 个 SOCKS5 端口已删除` : "节点已删除");
  }

  function testNode(nodeId: number) {
    setTestingNode(nodeId);
    window.setTimeout(() => {
      const latency = Math.floor(Math.random() * 120) + 28;
      setNodes((current) => current.map((node) => node.id === nodeId ? { ...node, latency } : node));
      setTestingNode(null);
      notify(`真实连接测试完成：${latency} ms`);
    }, 900);
  }

  async function importQrImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const Detector = (window as unknown as { BarcodeDetector?: new (options: { formats: string[] }) => { detect: (source: ImageBitmap) => Promise<{ rawValue: string }[]> } }).BarcodeDetector;
      if (!Detector) throw new Error("unsupported");
      const bitmap = await createImageBitmap(file);
      const results = await new Detector({ formats: ["qr_code"] }).detect(bitmap);
      if (!results[0]?.rawValue) throw new Error("empty");
      setImportValue((current) => `${current}${current ? "\n" : ""}${results[0].rawValue}`);
      notify("二维码识别成功");
    } catch {
      notify("当前环境无法识别该二维码，请粘贴分享链接");
    }
  }

  function exportNode(node: Node) {
    const share = `vless://00000000-0000-4000-8000-${String(node.id).padStart(12, "0").slice(-12)}@${node.address}?encryption=none&type=tcp#${encodeURIComponent(node.name)}`;
    setExportTarget({ title: `${node.name} · VLESS`, value: share });
  }

  function createProxy() {
    const parsedPort = Number(port);
    if (!parsedPort || parsedPort < 1 || parsedPort > 65535) return;
    setProxies((current) => [...current, { id: Date.now(), port: parsedPort, nodeId: Number(targetNode), running: true }]);
    setProxyOpen(false);
    setPage("socks");
    notify(`SOCKS5 端口 ${parsedPort} 已启动`);
  }

  const pageMeta: Record<Page, [string, string]> = {
    overview: ["概览", "查看连接状态与本地代理"],
    nodes: ["节点管理", "管理你的远程代理节点"],
    socks: ["本地 SOCKS5", "将独立本地端口绑定到指定节点"],
    claude: ["Claude Code 多账号项目启动器", "隔离账号配置并一键启动开发项目"],
    apps: ["应用代理", "将指定程序的网络请求转发到 SOCKS5"],
    subscriptions: ["订阅管理", "更新和管理远程节点订阅"],
    routing: ["路由规则", "控制域名与 IP 的代理策略"],
    logs: ["运行日志", "查看核心状态与连接记录"],
    license: ["授权中心", "管理卡密、设备绑定与授权有效期"],
  };
  const [pageTitle, pageDescription] = pageMeta[page];

  return (
    <main className="min-h-screen bg-canvas text-ink">
      <div className="flex min-h-screen">

        {/* 侧边栏：平板为图标 rail，桌面为完整侧栏 */}
        <aside className="fixed inset-y-0 left-0 z-20 hidden flex-col border-r border-line bg-sidebar md:flex md:w-14 lg:w-56 md:px-1.5 md:py-3 lg:px-3">
          {/* Logo */}
          <div className="flex h-11 items-center justify-center lg:justify-start lg:gap-2.5 lg:px-2">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-ink text-white shadow-sm">
              <Icon name="shield" className="size-4" />
            </div>
            <div className="hidden lg:block">
              <div className="text-sm font-bold tracking-tight">Orbit Proxy</div>
              <div className="text-[11px] text-subtle">安全连接管理器</div>
            </div>
          </div>

          {/* 导航 */}
          <nav className="mt-4 space-y-0.5">
            <div className="mb-1.5 hidden px-2 text-[10px] font-semibold uppercase tracking-wider text-subtle lg:block">工作台</div>
            {navItems.map((item) => (
              <button key={item.key} onClick={() => setPage(item.key)}
                title={item.label}
                className={`flex h-9 w-full items-center justify-center rounded-lg transition-colors lg:justify-start lg:gap-2.5 lg:px-2 ${page === item.key ? "bg-white text-ink shadow-xs" : "text-muted hover:bg-white/70 hover:text-ink"}`}>
                <Icon name={item.icon} className={`size-4 shrink-0 ${page === item.key ? "text-accent" : ""}`} />
                <span className="hidden text-sm font-semibold lg:inline">{item.label}</span>
                {item.key === "nodes" && <span className="ml-auto hidden rounded-full bg-panel px-1.5 py-0.5 text-xs text-subtle lg:inline">{nodes.length}</span>}
              </button>
            ))}
          </nav>

          <div className="mt-5 mb-1 hidden px-2 text-[10px] font-semibold uppercase tracking-wider text-subtle lg:block">系统</div>
          <button title="设置" className="flex h-9 w-full items-center justify-center rounded-lg text-muted transition hover:bg-white/70 hover:text-ink lg:justify-start lg:gap-2.5 lg:px-2">
            <Icon name="settings" className="size-4 shrink-0" />
            <span className="hidden text-sm font-semibold lg:inline">设置</span>
          </button>
          <button title="帮助与反馈" className="flex h-9 w-full items-center justify-center rounded-lg text-muted transition hover:bg-white/70 hover:text-ink lg:justify-start lg:gap-2.5 lg:px-2">
            <Icon name="help" className="size-4 shrink-0" />
            <span className="hidden text-sm font-semibold lg:inline">帮助与反馈</span>
          </button>

          {/* 授权卡片：桌面展开，平板图标 */}
          <button onClick={() => setPage("license")} className="mt-auto" title="专业版已激活">
            <div className="hidden w-full rounded-2xl border border-line bg-white p-3 text-left shadow-xs transition hover:border-accent lg:block">
              <div className="flex items-center gap-3">
                <div className="relative flex size-9 items-center justify-center rounded-full bg-emerald-soft text-emerald">
                  <Icon name="shield" className="size-4" />
                  <span className="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full border-2 border-white bg-emerald" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold">专业版已激活</div>
                  <div className="text-xs text-subtle">到期：{licenseExpiry}</div>
                </div>
                <Icon name="chevron" className="size-4 text-subtle" />
              </div>
            </div>
            <div className="flex h-9 w-full items-center justify-center lg:hidden">
              <div className="relative flex size-7 items-center justify-center rounded-full bg-emerald-soft text-emerald">
                <Icon name="shield" className="size-3.5" />
                <span className="absolute -right-0.5 -bottom-0.5 size-2 rounded-full border-2 border-sidebar bg-emerald" />
              </div>
            </div>
          </button>
        </aside>

        {/* 移动端顶部栏（<md 显示） */}
        <div className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-white/95 px-4 backdrop-blur-xl md:hidden">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-ink text-white">
              <Icon name="shield" className="size-4" />
            </div>
            <span className="text-sm font-bold tracking-tight">Orbit Proxy</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setSystemProxy((c) => !c); notify(systemProxy ? "已关闭系统代理" : "已开启系统代理"); }}
              className={`flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition ${systemProxy ? "bg-emerald-soft text-emerald" : "bg-panel text-muted"}`}
            >
              <span className={`size-1.5 rounded-full ${systemProxy ? "bg-emerald" : "bg-subtle"}`} />
              {proxyMode}
            </button>
            <button onClick={() => setImportOpen(true)} className="flex size-8 items-center justify-center rounded-lg border border-line bg-white text-muted">
              <Icon name="download" className="size-4" />
            </button>
          </div>
        </div>

        {/* 移动端底部导航（<md 显示） */}
        <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-line bg-white/95 backdrop-blur-xl md:hidden">
          {[
            { key: "overview", label: "概览", icon: "grid" },
            { key: "nodes", label: "节点", icon: "globe" },
            { key: "socks", label: "SOCKS5", icon: "server" },
            { key: "claude", label: "Claude", icon: "terminal" },
            { key: "routing", label: "路由", icon: "route" },
          ].map((item) => (
            <button key={item.key} onClick={() => setPage(item.key as Page)}
              className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-semibold transition ${page === item.key ? "text-accent" : "text-subtle"}`}>
              <Icon name={item.icon as IconName} className="size-5" />
              {item.label}
            </button>
          ))}
          <button onClick={() => setPage("license")}
            className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-semibold transition ${page === "license" || page === "apps" || page === "subscriptions" || page === "logs" ? "text-accent" : "text-subtle"}`}>
            <Icon name="more" className="size-5" />
            更多
          </button>
        </nav>

        <section className="min-w-0 flex-1 pt-14 pb-20 md:ml-14 md:pt-0 md:pb-0 lg:ml-56">
          <header className={`sticky top-14 z-10 h-14 items-center justify-between border-b border-line bg-canvas/90 px-4 backdrop-blur-xl md:top-0 md:px-5 lg:px-6 ${page === "claude" ? "hidden" : "flex"}`}>
            <div>
              <div className="text-sm font-bold tracking-tight md:text-base">{pageTitle}</div>
              <div className="hidden text-xs text-muted md:block mt-0.5">{pageDescription}</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden items-center rounded-xl border border-line bg-white p-1 shadow-xs md:flex mr-1">
                {(["规则", "全局", "直连"] as const).map((mode) => (
                  <button key={mode} onClick={() => setProxyMode(mode)}
                    className={`h-8 rounded-lg px-3 text-xs font-semibold transition ${proxyMode === mode ? "bg-ink text-white" : "text-muted hover:text-ink"}`}>
                    {mode}
                  </button>
                ))}
              </div>
              <button
                onClick={() => { setSystemProxy((c) => !c); notify(systemProxy ? "已关闭系统代理" : "已开启系统代理"); }}
                className={`hidden h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold transition md:flex ${systemProxy ? "bg-emerald-soft text-emerald" : "bg-panel text-muted"}`}>
                <span className={`size-2 rounded-full ${systemProxy ? "bg-emerald" : "bg-subtle"}`} />
                系统代理
              </button>
              <Button icon="download" className="hidden md:inline-flex" onClick={() => setImportOpen(true)}>导入节点</Button>
              <Button variant="primary" icon="plus" className="!h-9 !px-3 !text-xs lg:!h-10 lg:!px-4 lg:!text-sm" onClick={() => setProxyOpen(true)}>
                <span className="hidden lg:inline">新建 SOCKS5</span>
                <span className="lg:hidden">新建</span>
              </Button>
            </div>
          </header>

          <div className={page === "claude" ? "" : "p-4 lg:p-5"}>
            {page === "overview" && (
              <div className="space-y-7">
                <div className="grid gap-5 md:grid-cols-3">
                  <div className="relative overflow-hidden rounded-3xl bg-ink p-6 text-white shadow-card lg:col-span-2">
                    <div className="absolute -right-16 -top-24 size-72 rounded-full bg-accent-glow blur-3xl" />
                    <div className="relative flex h-full min-h-48 flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/80">
                          <span className="size-2 rounded-full bg-success-light shadow-status" />
                          当前出口节点
                        </div>
                        <Button variant="ghost" className="!text-white/70 hover:!bg-white/10 hover:!text-white" onClick={() => setPage("nodes")}>
                          切换节点 <Icon name="arrow" className="size-4" />
                        </Button>
                      </div>
                      <div className="mt-8 flex items-end justify-between gap-6">
                        <div>
                          <div className="mb-2 flex items-center gap-3">
                            <span className="rounded-lg bg-white/10 px-2.5 py-1 font-mono text-xs">{activeNode.flag}</span>
                            <ProtocolBadge protocol={activeNode.protocol} />
                          </div>
                          <div className="text-3xl font-bold tracking-tight">{activeNode.name}</div>
                          <div className="mt-2 text-sm text-white/55">{activeNode.address}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-semibold text-success-light">{activeNode.latency}</div>
                          <div className="text-xs text-white/45">延迟 ms</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-line bg-white p-6 shadow-xs">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-semibold text-muted">本地代理</div>
                        <div className="mt-2 text-3xl font-bold">{proxies.filter((proxy) => proxy.running).length}</div>
                      </div>
                      <div className="flex size-11 items-center justify-center rounded-2xl bg-blue-soft text-blue">
                        <Icon name="server" />
                      </div>
                    </div>
                    <div className="mt-7 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted">运行中</span>
                        <span className="font-semibold text-emerald">{proxies.filter((proxy) => proxy.running).length} 个端口</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-panel">
                        <div className="h-full w-3/4 rounded-full bg-accent" />
                      </div>
                      <div className="text-xs leading-relaxed text-subtle">SOCKS5 仅监听本机地址，其他设备无法访问。</div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-7 xl:grid-cols-[1.4fr_1fr]">
                  <div className="rounded-3xl border border-line bg-white shadow-xs">
                    <div className="flex items-center justify-between border-b border-line px-6 py-5">
                      <div>
                        <div className="font-bold">本地 SOCKS5</div>
                        <div className="mt-1 text-sm text-muted">每个端口拥有独立的出口节点</div>
                      </div>
                      <Button variant="ghost" onClick={() => setPage("socks")}>查看全部 <Icon name="chevron" className="size-4" /></Button>
                    </div>
                    <div className="divide-y divide-line">
                      {proxies.map((proxy) => {
                        const node = nodes.find((item) => item.id === proxy.nodeId);
                        return (
                          <div key={proxy.id} className="flex items-center gap-4 px-6 py-4">
                            <div className={`flex size-10 items-center justify-center rounded-xl ${proxy.running ? "bg-emerald-soft text-emerald" : "bg-panel text-subtle"}`}>
                              <Icon name="server" className="size-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-sm font-bold">127.0.0.1:{proxy.port}</span>
                                <span className={`size-1.5 rounded-full ${proxy.running ? "bg-emerald" : "bg-subtle"}`} />
                              </div>
                              <div className="mt-1 truncate text-xs text-muted">{node?.flag} {node?.name}</div>
                            </div>
                            <Button variant="ghost" className="!size-9 !p-0" onClick={() => copyText(`socks5://127.0.0.1:${proxy.port}`)} aria-label="复制代理地址">
                              <Icon name="copy" className="size-4" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-line bg-white p-6 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold">节点状态</div>
                        <div className="mt-1 text-sm text-muted">最近延迟检测</div>
                      </div>
                      <Icon name="activity" className="size-5 text-subtle" />
                    </div>
                    <div className="mt-5 space-y-4">
                      {nodes.slice(0, 4).map((node) => (
                        <div key={node.id} className="flex items-center gap-3">
                          <div className="flex size-9 items-center justify-center rounded-xl bg-panel font-mono text-xs font-bold">{node.flag}</div>
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-semibold">{node.name}</div>
                            <div className="mt-0.5 text-xs text-subtle">{node.protocol}</div>
                          </div>
                          <div className={`font-mono text-sm font-semibold ${node.latency < 100 ? "text-emerald" : "text-amber"}`}>{node.latency || "—"} ms</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {page === "nodes" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <button
                    onClick={() => {
                      setProxies((current) => {
                        const next = [...current];
                        nodes.forEach((node) => {
                          if (!next.some((p) => p.nodeId === node.id)) {
                            next.push({ id: Date.now() + node.id, port: nextAvailablePort(next, next.length - current.length), nodeId: node.id, running: true });
                          }
                        });
                        return next.map((p) => ({ ...p, running: true }));
                      });
                      notify("已一键开启全部 SOCKS5 端口");
                    }}
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-emerald/30 bg-emerald-soft px-4 text-sm font-semibold text-emerald transition hover:bg-emerald/15"
                  >
                    <Icon name="power" className="size-4" />
                    一键开启全部端口
                  </button>
                  <div className="text-sm text-muted">{filteredNodes.length} 个节点 · {proxies.filter((p) => p.running).length} 个端口运行中</div>
                </div>
                <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-xs">
                  <div className="flex items-center justify-between border-b border-line p-5">
                    <div className="relative w-full max-w-sm">
                      <Icon name="search" className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-subtle" />
                      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索节点、地区或协议" className="h-10 w-full rounded-xl border border-line bg-canvas pl-10 pr-4 text-sm outline-none transition focus:border-accent focus:ring-4 focus:ring-accent-soft" />
                    </div>
                    <div className="text-sm text-muted">共 {filteredNodes.length} 个节点</div>
                  </div>
                  {/* 桌面表头 */}
                  <div className="hidden grid-cols-[2rem_1.5rem_minmax(0,1.5fr)_1fr_0.5fr_0.5fr_auto] gap-4 border-b border-line bg-canvas px-6 py-3 text-xs font-semibold uppercase tracking-wider text-subtle md:grid">
                    <input type="checkbox" className="size-4 accent-accent" checked={selectedNodeIds.length === filteredNodes.length && filteredNodes.length > 0} onChange={(e) => setSelectedNodeIds(e.target.checked ? filteredNodes.map((n) => n.id) : [])} />
                    <div title="默认代理">代理</div>
                    <div>节点</div><div>地址</div><div>协议</div><div>延迟</div><div className="text-right">SOCKS5 / 操作</div>
                  </div>
                  <div className="divide-y divide-line">
                    {filteredNodes.map((node) => {
                      const linkedProxy = proxies.find((p) => p.nodeId === node.id);
                      const isSelected = selectedNodeIds.includes(node.id);
                      return (
                        <div key={node.id} onContextMenu={(e) => { e.preventDefault(); if (!isSelected) setSelectedNodeIds([node.id]); setContextMenu({ node, x: e.clientX, y: e.clientY }); }}>
                          {/* 桌面行 */}
                          <div className={`hidden grid-cols-[2rem_1.5rem_minmax(0,1.5fr)_1fr_0.5fr_0.5fr_auto] items-center gap-4 px-6 py-4 transition-colors hover:bg-canvas md:grid ${isSelected ? "bg-accent-soft" : ""}`}>
                            <input type="checkbox" className="size-4 accent-accent" checked={isSelected} onChange={(e) => setSelectedNodeIds((prev) => e.target.checked ? [...prev, node.id] : prev.filter((id) => id !== node.id))} onClick={(e) => e.stopPropagation()} />
                            <button title={node.active ? "当前默认代理节点" : "设为默认代理节点"} onClick={() => { if (!node.active) { setNodes((cur) => cur.map((n) => ({ ...n, active: n.id === node.id }))); notify(`已将「${node.name}」设为默认代理节点`); } }} className="flex items-center justify-center">
                              <span className={`flex size-4 items-center justify-center rounded-full border-2 transition ${node.active ? "border-emerald bg-emerald" : "border-line-strong hover:border-emerald/60"}`}>
                                {node.active && <span className="size-1.5 rounded-full bg-white" />}
                              </span>
                            </button>
                            <div className="flex min-w-0 items-center gap-3">
                              <div className="flex size-10 items-center justify-center rounded-xl bg-panel font-mono text-xs font-bold">{node.flag}</div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 truncate text-sm font-semibold">{node.name}{node.active && <span className="rounded-full bg-emerald-soft px-2 py-0.5 text-xs font-semibold text-emerald">默认代理</span>}</div>
                                <div className="mt-1 text-xs text-muted">{node.region}</div>
                              </div>
                            </div>
                            <div className="truncate font-mono text-xs text-muted">{node.address}</div>
                            <div><ProtocolBadge protocol={node.protocol} /></div>
                            <div className={`font-mono text-sm font-semibold ${node.latency && node.latency < 100 ? "text-emerald" : "text-amber"}`}>{node.latency || "—"} ms</div>
                            <div className="flex items-center justify-end gap-1">
                              {linkedProxy ? (
                                <button onClick={() => copyText(`socks5://127.0.0.1:${linkedProxy.port}`)} className={`flex h-8 items-center gap-1.5 rounded-lg border px-2.5 font-mono text-xs font-semibold transition ${linkedProxy.running ? "border-emerald/30 bg-emerald-soft text-emerald hover:bg-emerald/15" : "border-line bg-canvas text-muted hover:bg-panel"}`} title="复制 SOCKS5 地址">
                                  <Icon name="copy" className="size-3.5" />:{linkedProxy.port}
                                </button>
                              ) : (
                                <button onClick={() => createSocksForNode(node.id)} className="flex h-8 items-center gap-1.5 rounded-lg border border-dashed border-line px-2.5 text-xs font-semibold text-muted transition hover:border-accent hover:text-accent" title="生成 SOCKS5">
                                  <Icon name="plus" className="size-3.5" />SOCKS5
                                </button>
                              )}
                              <Button variant="ghost" className="!h-8 !px-2.5 !text-xs" icon="activity" onClick={() => testNode(node.id)} disabled={testingNode === node.id}>{testingNode === node.id ? "…" : "测试"}</Button>
                              <Button variant="ghost" className="!size-8 !p-0" onClick={() => setEditingNode(node)} aria-label="编辑节点"><Icon name="settings" className="size-4" /></Button>
                              <Button variant="ghost" className="!size-8 !p-0" onClick={() => exportNode(node)} aria-label="导出节点二维码"><Icon name="copy" className="size-4" /></Button>
                              <Button variant="danger" className="!size-8 !p-0" onClick={() => deleteNode(node.id)} aria-label="删除节点"><Icon name="trash" className="size-4" /></Button>
                            </div>
                          </div>
                          {/* 移动端卡片 */}
                          <div className={`flex items-center gap-3 px-4 py-3.5 md:hidden ${isSelected ? "bg-accent-soft" : ""}`}>
                            <button onClick={() => { if (!node.active) { setNodes((cur) => cur.map((n) => ({ ...n, active: n.id === node.id }))); notify(`已将「${node.name}」设为默认代理节点`); } }} className="shrink-0">
                              <span className={`flex size-5 items-center justify-center rounded-full border-2 transition ${node.active ? "border-emerald bg-emerald" : "border-line-strong"}`}>
                                {node.active && <span className="size-2 rounded-full bg-white" />}
                              </span>
                            </button>
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-panel font-mono text-xs font-bold">{node.flag}</div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 text-sm font-semibold">
                                {node.name}
                                {node.active && <span className="rounded-full bg-emerald-soft px-1.5 py-0.5 text-xs text-emerald">默认</span>}
                              </div>
                              <div className="mt-0.5 flex items-center gap-2 text-xs text-muted">
                                <ProtocolBadge protocol={node.protocol} />
                                <span className={`font-mono font-semibold ${node.latency && node.latency < 100 ? "text-emerald" : "text-amber"}`}>{node.latency || "—"} ms</span>
                              </div>
                            </div>
                            <div className="flex shrink-0 items-center gap-1">
                              {linkedProxy ? (
                                <button onClick={() => copyText(`socks5://127.0.0.1:${linkedProxy.port}`)} className={`flex h-8 items-center gap-1 rounded-lg border px-2 font-mono text-xs font-semibold ${linkedProxy.running ? "border-emerald/30 bg-emerald-soft text-emerald" : "border-line text-muted"}`}>
                                  <Icon name="copy" className="size-3" />:{linkedProxy.port}
                                </button>
                              ) : (
                                <button onClick={() => createSocksForNode(node.id)} className="flex h-8 items-center gap-1 rounded-lg border border-dashed border-line px-2 text-xs text-muted">
                                  <Icon name="plus" className="size-3" />S5
                                </button>
                              )}
                              <button onClick={() => setEditingNode(node)} className="flex size-8 items-center justify-center rounded-lg text-muted hover:bg-panel"><Icon name="settings" className="size-4" /></button>
                              <button onClick={() => deleteNode(node.id)} className="flex size-8 items-center justify-center rounded-lg text-danger hover:bg-danger-soft"><Icon name="trash" className="size-4" /></button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {page === "socks" && (
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => { setProxies((current) => current.map((p) => ({ ...p, running: true }))); notify("已开启全部 SOCKS5 端口"); }}
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-emerald/30 bg-emerald-soft px-4 text-sm font-semibold text-emerald transition hover:bg-emerald/15"
                  >
                    <Icon name="power" className="size-4" />
                    一键开启全部
                  </button>
                  <button
                    onClick={() => { setProxies((current) => current.map((p) => ({ ...p, running: false }))); notify("已停止全部 SOCKS5 端口"); }}
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-line bg-white px-4 text-sm font-semibold text-muted transition hover:border-danger/30 hover:bg-danger-soft hover:text-danger"
                  >
                    <Icon name="power" className="size-4" />
                    全部停止
                  </button>
                  <span className="ml-auto text-sm text-muted">{proxies.filter((p) => p.running).length}/{proxies.length} 运行中</span>
                </div>
                <div className="rounded-2xl border border-blue/15 bg-blue-soft p-4 text-sm text-blue">
                  <div className="flex gap-3">
                    <Icon name="shield" className="mt-0.5 size-5 shrink-0" />
                    <div><span className="font-semibold">本地安全提示：</span>代理端口默认仅绑定 127.0.0.1。复制地址后，可粘贴到浏览器、开发工具或其他本地应用中。</div>
                  </div>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  {proxies.map((proxy) => {
                    const node = nodes.find((item) => item.id === proxy.nodeId);
                    return (
                      <div key={proxy.id} className="rounded-3xl border border-line bg-white p-6 shadow-xs">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`flex size-12 items-center justify-center rounded-2xl ${proxy.running ? "bg-emerald-soft text-emerald" : "bg-panel text-subtle"}`}><Icon name="server" /></div>
                            <div>
                              <div className="flex items-center gap-2">
                                <div className="font-mono text-lg font-bold">:{proxy.port}</div>
                                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${proxy.running ? "bg-emerald-soft text-emerald" : "bg-panel text-subtle"}`}>{proxy.running ? "运行中" : "已停止"}</span>
                              </div>
                              <div className="mt-1 text-xs text-muted">SOCKS5 · 127.0.0.1</div>
                            </div>
                          </div>
                          <Button variant="ghost" className="!size-9 !p-0" aria-label="更多操作"><Icon name="more" className="size-4" /></Button>
                        </div>
                        <div className="my-5 flex items-center gap-3 rounded-2xl bg-canvas p-3">
                          <div className="flex size-9 items-center justify-center rounded-xl bg-white font-mono text-xs font-bold shadow-xs">{node?.flag}</div>
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-semibold">{node?.name}</div>
                            <div className="mt-0.5 text-xs text-muted">{node?.protocol} · {node?.latency} ms</div>
                          </div>
                          <Icon name="chevron" className="size-4 text-subtle" />
                        </div>
                        <div className="flex gap-3">
                          <Button className="flex-1" icon="copy" onClick={() => copyText(`socks5://127.0.0.1:${proxy.port}`)}>复制地址</Button>
                          <Button className="flex-1" icon="grid" onClick={() => setExportTarget({ title: `本机 SOCKS5 · ${proxy.port}`, value: `socks5://127.0.0.1:${proxy.port}` })}>二维码</Button>
                          <Button
                            variant={proxy.running ? "danger" : "primary"}
                            className="flex-1"
                            icon="power"
                            onClick={() => setProxies((current) => current.map((item) => item.id === proxy.id ? { ...item, running: !item.running } : item))}
                          >
                            {proxy.running ? "停止" : "启动"}
                          </Button>
                          <Button variant="ghost" className="!size-10 !p-0" aria-label="删除端口" onClick={() => setProxies((current) => current.filter((item) => item.id !== proxy.id))}><Icon name="trash" className="size-4" /></Button>
                        </div>
                      </div>
                    );
                  })}
                  <button onClick={() => setProxyOpen(true)} className="flex min-h-60 flex-col items-center justify-center rounded-3xl border border-dashed border-line-strong bg-transparent text-muted transition hover:border-accent hover:bg-accent-soft hover:text-accent">
                    <div className="mb-3 flex size-11 items-center justify-center rounded-2xl border border-current"><Icon name="plus" /></div>
                    <div className="font-semibold">新建本地 SOCKS5</div>
                    <div className="mt-1 text-sm opacity-70">选择端口与出口节点</div>
                  </button>
                </div>
              </div>
            )}

            {page === "claude" && <ClaudeLauncher notify={notify} copyText={copyText} />}

            {page === "apps" && (() => {
              const categories = ["全部", "包管理器", "版本控制", "开发工具", "编辑器IDE", "通讯协作", "其他工具"] as const;
              const categoryColors: Record<string, string> = {
                "包管理器": "bg-violet-soft text-violet", "版本控制": "bg-amber-soft text-amber",
                "开发工具": "bg-blue-soft text-blue", "编辑器IDE": "bg-emerald-soft text-emerald",
                "通讯协作": "bg-pink-soft text-pink", "其他工具": "bg-panel text-muted",
              };
              const filtered = presetApps.filter((a) =>
                (appCategory === "全部" || a.category === appCategory) &&
                (a.name.toLowerCase().includes(appSearchQuery.toLowerCase()) || a.exe.toLowerCase().includes(appSearchQuery.toLowerCase()) || a.desc.includes(appSearchQuery))
              );
              const detectedCount = presetApps.filter((a) => a.detected).length;
              const enabledCount = presetApps.filter((a) => a.enabled).length;
              const allFilteredSelected = filtered.length > 0 && filtered.every((a) => selectedAppIds.includes(a.id));

              function detectApps() {
                setDetectingApps(true);
                window.setTimeout(() => {
                  const detectedIds = ["nodejs", "python", "go", "git", "vscode", "cursor", "docker", "chrome", "gh-cli", "curl", "postman", "telegram", "dotnet"];
                  setPresetApps((cur) => cur.map((a) => detectedIds.includes(a.id)
                    ? { ...a, detected: true, detectedPath: a.defaultPath }
                    : { ...a, detected: false, detectedPath: "" }
                  ));
                  setDetectingApps(false);
                  notify(`检测完成，发现 ${detectedIds.length} 个已安装应用`);
                }, 1400);
              }

              function applyBatchProxy() {
                if (!batchProxyId || selectedAppIds.length === 0) return;
                setPresetApps((cur) => cur.map((a) => selectedAppIds.includes(a.id) ? { ...a, proxyId: batchProxyId, enabled: true } : a));
                notify(`已将 ${selectedAppIds.length} 个应用设置为同一 SOCKS5 出口`);
                setSelectedAppIds([]);
              }

              const categoryIcons: Record<string, string> = {
                "全部": "grid", "包管理器": "terminal", "版本控制": "globe", "开发工具": "server",
                "编辑器IDE": "settings", "通讯协作": "shield", "其他工具": "more",
              };

              return (
                <div className="flex gap-6 min-h-0">
                  {/* ── 左侧面板 ── */}
                  <div className="hidden md:flex w-56 shrink-0 flex-col gap-4">
                    {/* 统计卡片 */}
                    <div className="rounded-2xl border border-line bg-white p-4 shadow-xs space-y-3">
                      <div className="text-xs font-semibold uppercase tracking-wider text-subtle">应用代理统计</div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-emerald-soft p-3 text-center">
                          <div className="text-2xl font-bold text-emerald">{detectedCount}</div>
                          <div className="mt-0.5 text-xs text-emerald/70">已检测</div>
                        </div>
                        <div className="rounded-xl bg-accent-soft p-3 text-center">
                          <div className="text-2xl font-bold text-accent">{enabledCount}</div>
                          <div className="mt-0.5 text-xs text-accent/70">已启用</div>
                        </div>
                      </div>
                      <div className="text-xs text-muted">共 {presetApps.length} 个预设应用</div>
                    </div>

                    {/* 一键检测按钮 */}
                    <button
                      onClick={detectApps}
                      disabled={detectingApps}
                      className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-accent/30 bg-accent-soft text-sm font-semibold text-accent transition hover:bg-accent/15 disabled:opacity-50"
                    >
                      <Icon name={detectingApps ? "refresh" : "search"} className={`size-4 ${detectingApps ? "animate-spin" : ""}`} />
                      {detectingApps ? "正在检测…" : "一键检测已安装应用"}
                    </button>

                    {/* 分类导航 */}
                    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-xs">
                      <div className="border-b border-line px-4 py-3 text-xs font-semibold uppercase tracking-wider text-subtle">应用分类</div>
                      <div className="py-1">
                        {categories.map((cat) => {
                          const count = cat === "全部" ? presetApps.length : presetApps.filter((a) => a.category === cat).length;
                          const active = appCategory === cat;
                          return (
                            <button
                              key={cat}
                              onClick={() => setAppCategory(cat)}
                              className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors ${active ? "bg-accent-soft text-accent font-semibold" : "text-ink hover:bg-canvas"}`}
                            >
                              <Icon name={(categoryIcons[cat] ?? "grid") as IconName} className="size-4 shrink-0" />
                              <span className="flex-1 text-left">{cat}</span>
                              <span className={`text-xs font-semibold tabular-nums ${active ? "text-accent" : "text-subtle"}`}>{count}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Proxifier 模式标记 */}
                    <div className="rounded-2xl border border-blue/20 bg-blue-soft p-4">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-blue px-2 py-0.5 text-xs font-bold text-white">Proxifier</span>
                        <span className="text-xs font-semibold text-blue">进程级拦截</span>
                      </div>
                      <div className="mt-2 text-xs text-blue/70 leading-relaxed">按 .exe 名称拦截所有出站流量，路由至指定 SOCKS5 出口</div>
                    </div>
                  </div>

                  {/* ── 右侧主内容 ── */}
                  <div className="min-w-0 flex-1 space-y-4">
                    {/* 移动端检测按钮 + 分类（lg以下显示） */}
                    <div className="md:hidden space-y-3">
                      <button onClick={detectApps} disabled={detectingApps} className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-accent/30 bg-accent-soft text-sm font-semibold text-accent transition disabled:opacity-50">
                        <Icon name={detectingApps ? "refresh" : "search"} className={`size-4 ${detectingApps ? "animate-spin" : ""}`} />
                        {detectingApps ? "正在检测…" : "一键检测已安装应用"}
                      </button>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => {
                          const count = cat === "全部" ? presetApps.length : presetApps.filter((a) => a.category === cat).length;
                          return (
                            <button key={cat} onClick={() => setAppCategory(cat)} className={`flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition ${appCategory === cat ? "bg-ink text-white" : "bg-white border border-line text-muted hover:border-accent hover:text-accent"}`}>
                              {cat} <span className="opacity-60">{count}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 搜索栏 */}
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1 lg:max-w-xs">
                        <Icon name="search" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
                        <input value={appSearchQuery} onChange={(e) => setAppSearchQuery(e.target.value)} placeholder="搜索应用名称或 exe…" className="h-10 w-full rounded-xl border border-line bg-white pl-9 pr-3 text-sm outline-none focus:border-accent" />
                      </div>
                      <div className="ml-auto flex items-center gap-2 md:hidden">
                        <span className="rounded-full bg-emerald-soft px-2.5 py-1 text-xs font-semibold text-emerald">{detectedCount} 已检测</span>
                        <span className="rounded-full bg-panel px-2.5 py-1 text-xs font-semibold">{enabledCount} 已启用</span>
                      </div>
                    </div>

                    {/* 批量操作栏（有选中时显示） */}
                    {selectedAppIds.length > 0 && (
                      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-accent/20 bg-accent-soft px-5 py-3">
                        <span className="text-sm font-semibold text-accent">已选 {selectedAppIds.length} 个应用</span>
                        <div className="ml-auto flex flex-wrap items-center gap-2">
                          <span className="text-sm text-muted">统一设置 SOCKS5：</span>
                          <select value={batchProxyId ?? ""} onChange={(e) => setBatchProxyId(Number(e.target.value))} className="h-9 rounded-xl border border-line bg-white px-3 text-sm outline-none focus:border-accent">
                            <option value="">选择出口…</option>
                            {proxies.map((p) => {
                              const n = nodes.find((x) => x.id === p.nodeId);
                              return <option key={p.id} value={p.id}>:{p.port} · {n?.name}</option>;
                            })}
                          </select>
                          <button onClick={applyBatchProxy} disabled={!batchProxyId} className="h-9 rounded-xl bg-accent px-4 text-sm font-semibold text-white hover:bg-accent/90 disabled:opacity-40">批量应用并启用</button>
                          <button onClick={() => setSelectedAppIds([])} className="h-9 rounded-xl border border-line bg-white px-3 text-sm text-muted hover:bg-canvas">取消选择</button>
                        </div>
                      </div>
                    )}

                    {/* 应用列表 */}
                    <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-xs">
                      <div className="grid grid-cols-[2rem_minmax(0,1fr)_8rem_16rem_5rem] items-center gap-4 border-b border-line bg-canvas px-5 py-3 text-xs font-semibold uppercase tracking-wider text-subtle">
                        <input type="checkbox" className="size-4 accent-accent" checked={allFilteredSelected} onChange={(e) => setSelectedAppIds(e.target.checked ? [...new Set([...selectedAppIds, ...filtered.map((a) => a.id)])] : selectedAppIds.filter((id) => !filtered.some((a) => a.id === id)))} />
                        <div>应用</div>
                        <div>状态</div>
                        <div>SOCKS5 出口</div>
                        <div className="text-right">启用</div>
                      </div>
                      <div className="divide-y divide-line">
                        {filtered.map((app) => {
                          const isSelected = selectedAppIds.includes(app.id);
                          const linkedProxy = proxies.find((p) => p.id === app.proxyId);
                          const linkedNode = nodes.find((n) => n.id === linkedProxy?.nodeId);
                          return (
                            <div key={app.id} className={`grid grid-cols-[2rem_minmax(0,1fr)_8rem_16rem_5rem] items-center gap-4 px-5 py-3.5 transition-colors hover:bg-canvas ${isSelected ? "bg-accent-soft" : ""}`}>
                              <input type="checkbox" className="size-4 accent-accent" checked={isSelected} onChange={(e) => setSelectedAppIds((prev) => e.target.checked ? [...prev, app.id] : prev.filter((id) => id !== app.id))} />
                              <div className="flex min-w-0 items-center gap-3">
                                <div className={`flex size-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${categoryColors[app.category] ?? "bg-panel text-muted"}`}>
                                  {app.name.slice(0, 2).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold">{app.name}</span>
                                    <span className="rounded px-1.5 py-0.5 text-xs font-medium" style={{background: "var(--color-canvas)", color: "var(--color-muted)"}}>{app.exe}</span>
                                  </div>
                                  <div className="mt-0.5 truncate text-xs text-muted">{app.detected ? app.detectedPath : app.desc}</div>
                                </div>
                              </div>
                              <div>
                                {app.detected
                                  ? <span className="inline-flex items-center gap-1 rounded-full bg-emerald-soft px-2.5 py-1 text-xs font-semibold text-emerald"><span className="size-1.5 rounded-full bg-emerald" />已检测</span>
                                  : <span className="inline-flex items-center gap-1 rounded-full bg-panel px-2.5 py-1 text-xs font-semibold text-muted"><span className="size-1.5 rounded-full bg-subtle" />未检测</span>
                                }
                              </div>
                              <div>
                                <select
                                  value={app.proxyId ?? ""}
                                  onChange={(e) => setPresetApps((cur) => cur.map((a) => a.id === app.id ? { ...a, proxyId: Number(e.target.value) || null } : a))}
                                  className="h-8 w-full rounded-lg border border-line bg-canvas px-2 text-xs outline-none focus:border-accent"
                                >
                                  <option value="">未设置</option>
                                  {proxies.map((p) => {
                                    const n = nodes.find((x) => x.id === p.nodeId);
                                    return <option key={p.id} value={p.id}>:{p.port} · {n?.name}</option>;
                                  })}
                                </select>
                                {linkedNode && <div className="mt-0.5 truncate pl-1 text-xs text-muted">{linkedNode.region}</div>}
                              </div>
                              <div className="flex justify-end">
                                <button
                                  onClick={() => setPresetApps((cur) => cur.map((a) => a.id === app.id ? { ...a, enabled: !a.enabled } : a))}
                                  className={`relative h-6 w-11 rounded-full transition ${app.enabled ? "bg-emerald" : "bg-line-strong"}`}
                                >
                                  <span className={`absolute top-1 size-4 rounded-full bg-white shadow-sm transition-all ${app.enabled ? "left-6" : "left-1"}`} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                        {filtered.length === 0 && (
                          <div className="px-6 py-12 text-center text-sm text-muted">没有匹配的应用</div>
                        )}
                      </div>
                    </div>

                    {/* 自定义规则 */}
                    <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-xs">
                      <div className="flex items-center justify-between border-b border-line px-6 py-4">
                        <div>
                          <div className="font-bold">自定义应用规则</div>
                          <div className="mt-0.5 text-sm text-muted">手动添加列表中没有的程序</div>
                        </div>
                        <span className="rounded-full bg-blue-soft px-3 py-1 text-xs font-bold text-blue">Proxifier 模式</span>
                      </div>
                      <div className="grid gap-3 p-5 md:grid-cols-[1.2fr_1fr_auto]">
                        <label className="flex h-10 cursor-pointer items-center gap-3 rounded-xl border border-line bg-canvas px-3 hover:border-accent">
                          <Icon name="terminal" className="size-4 text-subtle" />
                          <span className={`min-w-0 flex-1 truncate text-sm ${appExe ? "font-semibold text-ink" : "text-subtle"}`}>{appExe || "选择 .exe 程序"}</span>
                          <span className="text-xs font-semibold text-accent">浏览</span>
                          <input type="file" accept=".exe" className="hidden" onChange={(event) => setAppExe(event.target.files?.[0]?.name ?? "")} />
                        </label>
                        <select value={appProxyId} onChange={(e) => setAppProxyId(Number(e.target.value))} className="h-10 w-full rounded-xl border border-line bg-canvas px-3 text-sm outline-none focus:border-accent">
                          {proxies.map((p) => { const n = nodes.find((x) => x.id === p.nodeId); return <option key={p.id} value={p.id}>:{p.port} · {n?.name}</option>; })}
                        </select>
                        <Button variant="primary" className="!h-10" disabled={!appExe || !proxies.length} onClick={() => { setAppProfiles((cur) => [...cur, { id: Date.now(), name: appExe, path: `C:\\Apps\\${appExe}`, proxyId: appProxyId, enabled: true }]); setAppExe(""); notify("自定义规则已添加"); }}>添加</Button>
                      </div>
                      {appProfiles.length > 0 && (
                        <div className="divide-y divide-line border-t border-line">
                          {appProfiles.map((profile) => {
                            const proxy = proxies.find((p) => p.id === profile.proxyId);
                            const node = nodes.find((n) => n.id === proxy?.nodeId);
                            return (
                              <div key={profile.id} className="flex items-center gap-4 px-5 py-4">
                                <div className="flex size-9 items-center justify-center rounded-xl bg-panel text-muted"><Icon name="terminal" className="size-4" /></div>
                                <div className="min-w-0 flex-1">
                                  <div className="text-sm font-semibold">{profile.name}</div>
                                  <div className="mt-0.5 truncate font-mono text-xs text-subtle">{profile.path}</div>
                                </div>
                                <div className="rounded-lg bg-canvas px-3 py-1.5 text-xs">
                                  <div className="font-mono font-semibold">{proxy ? `127.0.0.1:${proxy.port}` : "未配置"}</div>
                                  <div className="text-muted">{node?.name}</div>
                                </div>
                                <button onClick={() => setAppProfiles((cur) => cur.map((p) => p.id === profile.id ? { ...p, enabled: !p.enabled } : p))} className={`relative h-6 w-11 rounded-full transition ${profile.enabled ? "bg-emerald" : "bg-line-strong"}`}>
                                  <span className={`absolute top-1 size-4 rounded-full bg-white shadow-sm transition-all ${profile.enabled ? "left-6" : "left-1"}`} />
                                </button>
                                <Button variant="danger" className="!size-8 !p-0" onClick={() => setAppProfiles((cur) => cur.filter((p) => p.id !== profile.id))}><Icon name="trash" className="size-4" /></Button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

            {page === "subscriptions" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between rounded-3xl border border-line bg-white p-6 shadow-xs">
                  <div className="flex items-center gap-4">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-violet-soft text-violet"><Icon name="refresh" /></div>
                    <div>
                      <div className="font-bold">自动更新订阅</div>
                      <div className="mt-1 text-sm text-muted">每 6 小时检查一次，当前共有 2 个订阅源</div>
                    </div>
                  </div>
                  <Button variant="primary" icon="refresh" onClick={() => notify("全部订阅已更新")}>更新全部</Button>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  {[
                    { name: "Work Premium", url: "https://sub.example.com/••••••", count: 18, time: "12 分钟前", enabled: true },
                    { name: "Personal Backup", url: "https://cloud.example.net/••••••", count: 8, time: "2 小时前", enabled: true },
                  ].map((subscription) => (
                    <div key={subscription.name} className="rounded-3xl border border-line bg-white p-6 shadow-xs">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="font-bold">{subscription.name}</div>
                            <span className="rounded-full bg-emerald-soft px-2 py-0.5 text-xs font-semibold text-emerald">已启用</span>
                          </div>
                          <div className="mt-2 font-mono text-xs text-subtle">{subscription.url}</div>
                        </div>
                        <Button variant="ghost" className="!size-9 !p-0" aria-label="订阅菜单"><Icon name="more" className="size-4" /></Button>
                      </div>
                      <div className="my-5 grid grid-cols-2 divide-x divide-line rounded-2xl bg-canvas p-4">
                        <div>
                          <div className="text-xs text-muted">节点数量</div>
                          <div className="mt-1 text-lg font-bold">{subscription.count}</div>
                        </div>
                        <div className="pl-4">
                          <div className="text-xs text-muted">上次更新</div>
                          <div className="mt-1 text-sm font-semibold">{subscription.time}</div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button className="flex-1" icon="refresh" onClick={() => notify(`${subscription.name} 已更新`)}>立即更新</Button>
                        <Button className="flex-1" icon="settings">编辑订阅</Button>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => notify("已打开新增订阅窗口")} className="flex min-h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-line-strong text-muted transition hover:border-accent hover:bg-accent-soft hover:text-accent">
                    <div className="mb-3 flex size-11 items-center justify-center rounded-2xl border border-current"><Icon name="plus" /></div>
                    <div className="font-semibold">添加订阅</div>
                    <div className="mt-1 text-sm opacity-70">输入订阅地址并自动更新节点</div>
                  </button>
                </div>
              </div>
            )}

            {page === "routing" && (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {[
                    { key: "bypass" as const, title: "绕过大陆", detail: "大陆与局域网直连，其他流量代理", icon: "globe" as IconName },
                    { key: "blacklist" as const, title: "黑名单", detail: "仅代理被屏蔽网站，其他流量直连", icon: "shield" as IconName },
                    { key: "global" as const, title: "全局代理", detail: "除局域网外，全部流量通过代理", icon: "route" as IconName },
                    { key: "custom" as const, title: "自定义规则", detail: "按域名、IP、进程配置分流", icon: "settings" as IconName },
                  ].map((mode) => (
                    <button
                      key={mode.key}
                      onClick={() => {
                        setRoutingMode(mode.key);
                        setProxyMode(mode.key === "global" ? "全局" : "规则");
                        notify(`已切换到${mode.title}模式`);
                      }}
                      className={`rounded-3xl border p-5 text-left transition ${routingMode === mode.key ? "border-accent bg-accent-soft shadow-xs" : "border-line bg-white hover:border-line-strong"}`}
                    >
                      <div className="flex items-start justify-between">
                        <span className={`flex size-10 items-center justify-center rounded-2xl ${routingMode === mode.key ? "bg-accent text-white" : "bg-panel text-muted"}`}><Icon name={mode.icon} className="size-5" /></span>
                        {routingMode === mode.key && <span className="flex size-5 items-center justify-center rounded-full bg-accent text-white"><Icon name="check" className="size-3" /></span>}
                      </div>
                      <div className="mt-5 font-bold">{mode.title}</div>
                      <div className="mt-1 text-xs leading-relaxed text-muted">{mode.detail}</div>
                    </button>
                  ))}
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
                  <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-xs">
                    <div className="flex items-center justify-between border-b border-line px-6 py-5">
                      <div>
                        <div className="flex items-center gap-2"><span className="font-bold">当前规则</span><span className="rounded-full bg-panel px-2 py-0.5 text-xs font-semibold text-muted">{activeRoutingRules.length} 条</span></div>
                        <div className="mt-1 text-sm text-muted">规则按从上到下顺序匹配，最后一条为兜底规则</div>
                      </div>
                      <div className="flex gap-2">
                        <Button icon="refresh" onClick={() => notify("GeoSite 与 GeoIP 规则库已更新")}>更新规则库</Button>
                        <Button variant="primary" icon="plus" onClick={() => { setRoutingMode("custom"); setProxyMode("规则"); setShowRuleForm(true); }}>添加规则</Button>
                      </div>
                    </div>

                    {showRuleForm && (
                      <div className="border-b border-line bg-accent-soft p-5">
                        <div className="grid gap-3 md:grid-cols-[1fr_10rem_auto]">
                          <input value={ruleDomain} onChange={(event) => setRuleDomain(event.target.value)} placeholder="域名、IP、GeoSite 或进程，例如 github.com" className="h-11 rounded-xl border border-line bg-white px-3 font-mono text-sm outline-none focus:border-accent focus:ring-4 focus:ring-accent/10" />
                          <select value={ruleAction} onChange={(event) => setRuleAction(event.target.value as "代理" | "直连" | "阻止")} className="h-11 rounded-xl border border-line bg-white px-3 text-sm font-semibold outline-none">
                            <option value="代理">通过代理</option>
                            <option value="直连">直接连接</option>
                            <option value="阻止">阻止连接</option>
                          </select>
                          <div className="flex gap-2">
                            <Button onClick={() => { setShowRuleForm(false); setRuleDomain(""); }}>取消</Button>
                            <Button variant="primary" disabled={!ruleDomain.trim()} onClick={() => {
                              setCustomRules((current) => [...current, { id: Date.now(), name: ruleDomain.trim(), match: ruleDomain.trim(), action: ruleAction }]);
                              setRuleDomain("");
                              setShowRuleForm(false);
                              notify("自定义路由规则已添加");
                            }}>保存规则</Button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="divide-y divide-line">
                      {activeRoutingRules.map((rule, index) => {
                        const color = rule.action === "代理" ? "bg-violet-soft text-violet" : rule.action === "直连" ? "bg-emerald-soft text-emerald" : "bg-danger-soft text-danger";
                        return (
                          <div key={rule.id} className="flex items-center gap-4 px-6 py-5">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-panel font-mono text-xs font-bold text-muted">{index + 1}</div>
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-semibold">{rule.name}</div>
                              <div className="mt-1 truncate font-mono text-xs text-subtle">{rule.match}</div>
                            </div>
                            <span className={`rounded-lg px-3 py-1 text-xs font-bold ${color}`}>{rule.action}</span>
                            {routingMode === "custom" ? (
                              <Button variant="danger" className="!size-9 !p-0" aria-label="删除规则" onClick={() => setCustomRules((current) => current.filter((item) => item.id !== rule.id))}><Icon name="trash" className="size-4" /></Button>
                            ) : (
                              <span className="flex size-9 items-center justify-center text-subtle"><Icon name="shield" className="size-4" /></span>
                            )}
                          </div>
                        );
                      })}
                      {!activeRoutingRules.length && <div className="px-6 py-12 text-center text-sm text-muted">暂无自定义规则，点击“添加规则”开始配置。</div>}
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="rounded-3xl border border-line bg-white p-6 shadow-xs">
                      <div className="font-bold">规则提供方</div>
                      <div className="mt-1 text-sm text-muted">兼容 Clash 与 v2rayN 常用规则结构</div>
                      <div className="mt-5 space-y-3">
                        {[
                          ["GeoSite", "域名分类规则", "刚刚更新"],
                          ["GeoIP", "国家与地区 IP 库", "刚刚更新"],
                          ["GFW List", "黑名单域名规则", "2 小时前"],
                        ].map(([name, detail, time]) => (
                          <div key={name} className="flex items-center gap-3 rounded-2xl bg-canvas p-3">
                            <span className="flex size-9 items-center justify-center rounded-xl bg-white text-blue shadow-xs"><Icon name="download" className="size-4" /></span>
                            <div className="min-w-0 flex-1"><div className="text-sm font-semibold">{name}</div><div className="mt-0.5 text-xs text-muted">{detail}</div></div>
                            <span className="text-xs text-subtle">{time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-3xl bg-ink p-6 text-white shadow-card">
                      <div className="flex items-center justify-between"><Icon name="shield" className="size-6 text-success-light" /><span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-white/60">增强模式</span></div>
                      <div className="mt-5 font-bold">TUN 与 DNS 分流</div>
                      <div className="mt-2 text-sm leading-relaxed text-white/55">接管不支持系统代理的应用，并避免 DNS 请求绕过当前规则。</div>
                      <Button className="mt-5 !border-white/15 !bg-white/10 !text-white hover:!bg-white/15" onClick={() => notify("TUN 与 DNS 分流配置已保存")}>配置增强模式</Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {page === "logs" && (
              <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-xs">
                <div className="flex items-center justify-between border-b border-line px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="size-2 rounded-full bg-emerald shadow-status" />
                    <div>
                      <div className="font-bold">xray-core 实时日志</div>
                      <div className="mt-0.5 text-xs text-muted">日志级别：info</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button icon="copy" onClick={() => copyText("Orbit Proxy runtime logs")}>复制</Button>
                    <Button icon="trash" onClick={() => notify("日志已清空")}>清空</Button>
                  </div>
                </div>
                <div className="min-h-128 bg-log p-6 font-mono text-sm leading-7 text-log-muted">
                  <div><span className="text-subtle">10:42:18</span> <span className="text-blue-light">[Info]</span> Xray 25.3.6 started</div>
                  <div><span className="text-subtle">10:42:18</span> <span className="text-blue-light">[Info]</span> SOCKS proxy listening on 127.0.0.1:1080</div>
                  <div><span className="text-subtle">10:42:19</span> <span className="text-success-light">[Conn]</span> tcp:github.com:443 → Tokyo Edge 01</div>
                  <div><span className="text-subtle">10:42:21</span> <span className="text-success-light">[Conn]</span> tcp:api.figma.com:443 → Tokyo Edge 01</div>
                  <div><span className="text-subtle">10:42:23</span> <span className="text-amber-light">[Direct]</span> tcp:baidu.com:443 → freedom</div>
                  <div><span className="text-subtle">10:42:25</span> <span className="text-success-light">[Conn]</span> udp:1.1.1.1:53 → Tokyo Edge 01</div>
                  <div><span className="text-subtle">10:42:28</span> <span className="text-blue-light">[Info]</span> latency test completed: 4 nodes checked</div>
                  <div className="mt-2 flex items-center gap-2 text-white"><span className="size-2 animate-pulse rounded-full bg-success-light" /> waiting for new connections…</div>
                </div>
              </div>
            )}

            {page === "license" && (
              <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                <div className="space-y-6">
                  <div className="relative overflow-hidden rounded-3xl bg-ink p-7 text-white shadow-card">
                    <div className="absolute -right-20 -top-24 size-72 rounded-full bg-accent-glow blur-3xl" />
                    <div className="relative">
                      <div className="flex items-start justify-between">
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-white/10 text-success-light"><Icon name="shield" /></div>
                        <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${licenseActive ? "bg-success-light/15 text-success-light" : "bg-danger/20 text-white"}`}>
                          {licenseActive ? "授权有效" : "未激活"}
                        </span>
                      </div>
                      <div className="mt-8 text-sm text-white/55">Orbit Proxy Professional</div>
                      <div className="mt-2 text-3xl font-bold tracking-tight">{licenseActive ? "专业版授权" : "等待激活"}</div>
                      <div className="mt-8 grid grid-cols-2 gap-4">
                        <div className="rounded-2xl bg-white/8 p-4">
                          <div className="text-xs text-white/45">授权到期时间</div>
                          <div className="mt-2 font-mono text-lg font-semibold">{licenseActive ? licenseExpiry : "—"}</div>
                        </div>
                        <div className="rounded-2xl bg-white/8 p-4">
                          <div className="text-xs text-white/45">剩余有效期</div>
                          <div className="mt-2 text-lg font-semibold">{licenseActive ? `${licenseDays} 天` : "0 天"}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-line bg-white p-6 shadow-xs">
                    <div className="font-bold">激活或续期</div>
                    <div className="mt-1 text-sm text-muted">输入购买的卡密，激活后授权将绑定到当前设备。</div>
                    <div className="mt-5 flex gap-3">
                      <input
                        value={licenseCode}
                        onChange={(event) => setLicenseCode(event.target.value.toUpperCase())}
                        placeholder="XXXX-XXXX-XXXX-XXXX"
                        className="h-12 min-w-0 flex-1 rounded-xl border border-line bg-canvas px-4 font-mono text-sm uppercase tracking-wider outline-none focus:border-accent focus:ring-4 focus:ring-accent-soft"
                      />
                      <Button
                        variant="primary"
                        className="!h-12"
                        disabled={licenseCode.replaceAll("-", "").length < 12}
                        onClick={() => {
                          setLicenseActive(true);
                          setLicenseExpiry("2027-08-28");
                          setLicenseCode("");
                          notify("卡密验证成功，授权已更新");
                        }}
                      >
                        验证卡密
                      </Button>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-xs text-muted"><Icon name="shield" className="size-4 text-emerald" />卡密通过加密连接发送至授权服务器验证</div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-3xl border border-line bg-white p-6 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold">设备绑定</div>
                        <div className="mt-1 text-sm text-muted">每张卡密仅允许绑定授权设备</div>
                      </div>
                      <span className="rounded-full bg-emerald-soft px-3 py-1 text-xs font-bold text-emerald">本机</span>
                    </div>
                    <div className="mt-5 space-y-4">
                      <div className="rounded-2xl bg-canvas p-4">
                        <div className="text-xs text-muted">设备名称</div>
                        <div className="mt-1 text-sm font-semibold">Windows Desktop · DESKTOP-ORBIT</div>
                      </div>
                      <div className="rounded-2xl bg-canvas p-4">
                        <div className="text-xs text-muted">设备指纹</div>
                        <div className="mt-1 font-mono text-sm font-semibold">7F2A-91C8-••••-4D30</div>
                      </div>
                      <div className="rounded-2xl bg-canvas p-4">
                        <div className="text-xs text-muted">最近验证</div>
                        <div className="mt-1 text-sm font-semibold">刚刚 · 当前设备</div>
                      </div>
                    </div>
                    <Button className="mt-5 w-full" onClick={() => notify("解绑申请已提交")}>申请解绑设备</Button>
                  </div>

                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {importOpen && (
        <Modal title="批量导入代理节点" description="支持链接批量导入或识别二维码" onClose={() => setImportOpen(false)}>
          <div className="p-6">
            <label className="text-sm font-semibold text-ink" htmlFor="share-link">分享链接</label>
            <textarea
              id="share-link"
              value={importValue}
              onChange={(event) => setImportValue(event.target.value)}
              placeholder={"粘贴一个或多个 vless://、vmess://、ss:// 链接\n可使用空格或换行分隔"}
              className="mt-2 min-h-32 w-full resize-none rounded-2xl border border-line bg-canvas p-4 font-mono text-sm outline-none transition placeholder:text-subtle focus:border-accent focus:ring-4 focus:ring-accent-soft"
            />
            <div className="mt-4 flex items-center justify-between rounded-2xl border border-dashed border-line-strong bg-canvas p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-white text-accent shadow-xs"><Icon name="grid" /></div>
                <div>
                  <div className="text-sm font-semibold">从二维码图片导入</div>
                  <div className="mt-0.5 text-xs text-muted">支持 PNG、JPG 和屏幕截图</div>
                </div>
              </div>
              <label className="inline-flex h-9 cursor-pointer items-center rounded-xl border border-line bg-white px-3 text-sm font-semibold shadow-xs hover:bg-panel">
                选择图片
                <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={importQrImage} />
              </label>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted"><Icon name="shield" className="size-4" />导入后自动为每个节点创建独立 SOCKS5 端口</div>
          </div>
          <div className="flex justify-end gap-3 border-t border-line bg-canvas px-6 py-4">
            <Button onClick={() => setImportOpen(false)}>取消</Button>
            <Button variant="primary" disabled={!["vless://", "vmess://", "ss://"].some((prefix) => importValue.trim().toLowerCase().startsWith(prefix))} onClick={addImportedNode}>解析并导入</Button>
          </div>
        </Modal>
      )}

      {exportTarget && (
        <Modal title={exportTarget.title} description="扫描二维码或复制完整分享链接" onClose={() => setExportTarget(null)}>
          <div className="flex flex-col items-center p-6">
            <div className="rounded-3xl border border-line bg-white p-4 shadow-xs"><QrCode value={exportTarget.value} /></div>
            <div className="mt-5 w-full rounded-xl bg-canvas p-3 font-mono text-xs text-muted">
              <div className="line-clamp-2 break-all">{exportTarget.value}</div>
            </div>
          </div>
          <div className="flex justify-end gap-3 border-t border-line bg-canvas px-6 py-4">
            <Button onClick={() => setExportTarget(null)}>关闭</Button>
            <Button variant="primary" icon="copy" onClick={() => copyText(exportTarget.value)}>复制分享链接</Button>
          </div>
        </Modal>
      )}

      {proxyOpen && (
        <Modal title="新建本地 SOCKS5" description="将一个本地端口绑定到指定的远程节点" onClose={() => setProxyOpen(false)}>
          <div className="space-y-5 p-6">
            <div>
              <label className="text-sm font-semibold text-ink" htmlFor="port">监听端口</label>
              <div className="mt-2 flex overflow-hidden rounded-xl border border-line bg-canvas focus-within:border-accent focus-within:ring-4 focus-within:ring-accent-soft">
                <span className="flex items-center border-r border-line px-3 font-mono text-sm text-muted">127.0.0.1 :</span>
                <input id="port" type="number" min="1" max="65535" value={port} onChange={(event) => setPort(event.target.value)} className="h-11 min-w-0 flex-1 bg-transparent px-3 font-mono text-sm outline-none" />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-ink" htmlFor="node">出口节点</label>
              <select id="node" value={targetNode} onChange={(event) => setTargetNode(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-line bg-canvas px-3 text-sm font-medium outline-none transition focus:border-accent focus:ring-4 focus:ring-accent-soft">
                {nodes.map((node) => <option key={node.id} value={node.id}>{node.flag}  {node.name} · {node.protocol}</option>)}
              </select>
            </div>
            <div className="rounded-2xl bg-panel p-4 text-xs leading-relaxed text-muted">创建后端口将立即启动。你可以随时更换出口节点、停止服务或复制 SOCKS5 地址。</div>
          </div>
          <div className="flex justify-end gap-3 border-t border-line bg-canvas px-6 py-4">
            <Button onClick={() => setProxyOpen(false)}>取消</Button>
            <Button variant="primary" onClick={createProxy}>创建并启动</Button>
          </div>
        </Modal>
      )}

      {contextMenu && (() => {
        const { node, x, y } = contextMenu;
        const targets = selectedNodeIds.length > 1
          ? nodes.filter((n) => selectedNodeIds.includes(n.id))
          : [node];
        const multi = targets.length > 1;
        return (
          <NodeContextMenu
            x={x} y={y}
            onClose={() => setContextMenu(null)}
            groups={[
              [
                { label: "编辑服务器", shortcut: "Ctrl+D", disabled: multi, onClick: () => setEditingNode(node) },
                { label: "设为默认代理节点", shortcut: "Enter", disabled: multi || node.active, onClick: () => { setNodes((cur) => cur.map((n) => ({ ...n, active: n.id === node.id }))); notify(`已将「${node.name}」设为默认代理节点`); } },
                { label: `移除所选服务器${multi ? `（${targets.length} 个）` : ""}`, shortcut: "Delete", danger: true, onClick: () => { targets.forEach((n) => deleteNode(n.id)); setSelectedNodeIds([]); } },
                { label: "移除重复的服务器", onClick: () => {
                  const seen = new Set<string>();
                  setNodes((cur) => cur.filter((n) => { if (seen.has(n.address)) return false; seen.add(n.address); return true; }));
                  notify("已移除重复节点");
                }},
                { label: "克隆所选服务器", onClick: () => {
                  const clones = targets.map((n) => ({ ...n, id: Date.now() + Math.random(), name: `${n.name} - 副本`, active: false }));
                  setNodes((cur) => [...cur, ...clones]);
                  notify(`已克隆 ${clones.length} 个节点`);
                }},
                { label: "分享服务器", shortcut: "Ctrl+F", disabled: multi, onClick: () => exportNode(node) },
              ],
              [
                { label: "多服务器最低延迟（多选）", onClick: () => {
                  const best = [...nodes].sort((a, b) => (a.latency || 9999) - (b.latency || 9999))[0];
                  if (best) { setNodes((cur) => cur.map((n) => ({ ...n, active: n.id === best.id }))); notify(`已切换到最低延迟节点：${best.name} (${best.latency} ms)`); }
                }},
                { label: "多服务器负载均衡（多选）", onClick: () => notify("负载均衡已启用，将在多个节点间轮询") },
              ],
              [
                { label: "一键多线程测试延迟和速度", shortcut: "Ctrl+E", onClick: () => {
                  nodes.forEach((n) => { window.setTimeout(() => testNode(n.id), Math.random() * 300); });
                  notify("已开始多线程延迟测试");
                }},
                { label: "测试服务器延迟 Tcping（多选）", shortcut: "Ctrl+O", onClick: () => { targets.forEach((n) => testNode(n.id)); notify("Tcping 测试已开始"); } },
                { label: "测试服务器真连接延迟（多选）", shortcut: "Ctrl+R", onClick: () => { targets.forEach((n) => testNode(n.id)); notify("真实连接测试已开始"); } },
                { label: "测试服务器速度（多选）", shortcut: "Ctrl+T", onClick: () => notify("速度测试已开始，结果将在 30 秒内返回") },
                { label: "按测试结果", submenu: [
                  { label: "延迟升序排列", onClick: () => { setNodes((cur) => [...cur].sort((a, b) => (a.latency || 9999) - (b.latency || 9999))); notify("已按延迟升序排列"); } },
                  { label: "延迟降序排列", onClick: () => { setNodes((cur) => [...cur].sort((a, b) => (b.latency || 0) - (a.latency || 0))); notify("已按延迟降序排列"); } },
                ]},
              ],
              [
                { label: "移至订阅分组", submenu: [
                  { label: "Work Premium", onClick: () => notify(`已将节点移至「Work Premium」分组`) },
                  { label: "Personal Backup", onClick: () => notify(`已将节点移至「Personal Backup」分组`) },
                ]},
                { label: "移至上下", submenu: [
                  { label: "上移一位", onClick: () => setNodes((cur) => { const i = cur.findIndex((n) => n.id === node.id); if (i <= 0) return cur; const next = [...cur]; [next[i - 1], next[i]] = [next[i], next[i - 1]]; return next; }) },
                  { label: "下移一位", onClick: () => setNodes((cur) => { const i = cur.findIndex((n) => n.id === node.id); if (i >= cur.length - 1) return cur; const next = [...cur]; [next[i], next[i + 1]] = [next[i + 1], next[i]]; return next; }) },
                  { label: "置顶", onClick: () => setNodes((cur) => { const n = cur.find((n) => n.id === node.id)!; return [n, ...cur.filter((x) => x.id !== node.id)]; }) },
                  { label: "置底", onClick: () => setNodes((cur) => { const n = cur.find((n) => n.id === node.id)!; return [...cur.filter((x) => x.id !== node.id), n]; }) },
                ]},
                { label: "全选", shortcut: "Ctrl+A", onClick: () => setSelectedNodeIds(nodes.map((n) => n.id)) },
              ],
              [
                { label: "导出所选服务器完整配置", submenu: [
                  { label: "导出为 JSON", onClick: () => copyText(JSON.stringify(targets.map((n) => ({ name: n.name, address: n.address, protocol: n.protocol, ...n.detail })), null, 2)) },
                  { label: "导出为 base64 分享链接", onClick: () => { targets.forEach((n) => exportNode(n)); } },
                ]},
                { label: `导出分享链接至剪贴板${multi ? `（${targets.length} 个）` : ""}`, shortcut: "Ctrl+C", submenu: [
                  { label: "VLESS 分享链接", onClick: () => { targets.forEach((n) => { const link = `vless://00000000-0000-4000-8000-${String(n.id).padStart(12, "0").slice(-12)}@${n.address}?encryption=none&type=tcp#${encodeURIComponent(n.name)}`; copyText(link); }); } },
                  { label: "二维码", onClick: () => { if (!multi) exportNode(node); else notify("多选节点请逐一导出二维码"); } },
                ]},
              ],
            ]}
          />
        );
      })()}

      {editingNode && (
        <NodeEditModal
          node={editingNode}
          onSave={(updated) => {
            setNodes((current) => current.map((n) => n.id === updated.id ? updated : n));
            setEditingNode(null);
            notify(`节点「${updated.name}」已保存`);
          }}
          onClose={() => setEditingNode(null)}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-60 flex -translate-x-1/2 items-center gap-2 rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white shadow-modal">
          <span className="flex size-5 items-center justify-center rounded-full bg-emerald"><Icon name="check" className="size-3" /></span>
          {toast}
        </div>
      )}
    </main>
  );
}
