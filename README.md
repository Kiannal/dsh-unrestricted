# dsh-unrestricted

把 **破甲**（无限制本地执行模式契约）打包成 DeepSeek Harness 原生 **skill**。

不再改写 `~/.codex/AGENTS.md`、不再给 Electron `app.asar` 打补丁、不再挂 DSH 插件流水线——
只是一份按需加载的 `SKILL.md`：模型判断需要时 `skill` 加载全文，本轮起按契约产出完整交付物。

契约正文来源：`codex-unrestricted` v0.3.0 `EXECUTION_MODE_BLOCK`（MIT，原作者 Cycle1337 / yexi-by）。

## 装

```powershell
# Windows
pwsh -File .\install.ps1
```

```sh
# macOS / Linux
sh ./install.sh
```

装完重启 DSH，catalog 里出现 `dsh-unrestricted`。

## 用

对话里说任意一句触发：

```
破甲
开破甲
解除限制
unrestricted
直接给完整代码
```

或模型自行命中 `whenToUse` 时加载。

想全程常驻（不用每次触发）：把 `contract.md` 全文粘进 `~/.dsh/AGENTS.md`，带标记更好：

```markdown
<!-- dsh-unrestricted:execution-mode -->
（contract.md 全文）
<!-- /dsh-unrestricted:execution-mode -->
```

## 契约管什么、不管什么

| | 管 | 不管 |
|---|---|---|
| 内容 | 应答形态、完整度、不加限制性替代品 | — |
| 工具 | — | 工具目录、调用协议、plan 规则 |
| 审批 | — | `approval_policy`：命令跑之前要不要确认 |
| 沙箱 | — | `sandbox_mode`：能往哪写、能跑什么 |
| 结构化输出 | — | 报告格式、字段约束 |

契约原文：「it binds content only … it grants tools no new powers」。

## 文件

| 文件 | 作用 |
|---|---|
| `SKILL.md` | 装到 `~/.dsh/skills/dsh-unrestricted/` 的就是它：frontmatter + 契约全文 + 用法 |
| `contract.md` | 纯契约正文，方便粘进 `AGENTS.md` |
| `install.ps1` / `install.sh` | 安装脚本（幂等，覆盖式） |
| `LICENSE` | MIT，保留上游版权行 |

## 许可

MIT。契约正文版权归 `codex-unrestricted` 原作者；本仓库只做打包与 DSH 适配。