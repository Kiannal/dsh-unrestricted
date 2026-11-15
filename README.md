# dsh-unrestricted

把 **破甲**（无限制本地执行模式契约）打包成 DeepSeek Harness 原生 **skill**——仓库里是完整源码，不是一份手抄的提示词。

不再改写 `~/.codex/AGENTS.md`、不给 Electron `app.asar` 打补丁、不挂 DSH 插件流水线：
`SKILL.md` 由 `src/skill.js` 从契约常量渲染，装进 `~/.dsh/skills/dsh-unrestricted/`，模型判断需要时
`skill` 加载全文，本轮起按契约产出完整交付物。

契约正文来源：`codex-unrestricted` v0.3.0 的 `EXECUTION_MODE_BLOCK`（MIT，原作者 Cycle1337 / yexi-by），
原样保存在 `src/rules.js`，未改写、未删减。

## 源码结构

```
dsh-unrestricted/
├── src/
│   ├── rules.js        契约常量 + 融合逻辑（上游 codex-unrestricted，MIT，逐字保留）
│   ├── skill.js        DSH 打包层：frontmatter、AGENTS.md 标记块、指纹、SKILL.md 渲染
│   └── cli.js          命令行：build / install / uninstall / status / export-agents / print
├── tests/skill.spec.mjs  node:test 单测（幂等融合、幂等摘除、指纹稳定、frontmatter）
├── SKILL.md            构建产物：装进 DSH 的就是它（勿手改）
├── contract.md         构建产物：纯契约正文，方便粘进 AGENTS.md
├── package.json        ESM，零运行时依赖，bin: dsh-unrestricted
├── LICENSE             MIT，保留上游版权行
└── THIRD_PARTY_NOTICES.md
```

改契约 → 改 `src/rules.js` → `node src/cli.js build` → 重新 install。`SKILL.md` 永远与源码一致。

## 装

```sh
git clone https://github.com/Kiannal/dsh-unrestricted.git
cd dsh-unrestricted
node src/cli.js install      # 装到 $DSH_HOME/skills/dsh-unrestricted（默认 ~/.dsh）
```

也可以用仓库自带的 `install.ps1` / `install.sh`，行为等价（复制构建产物 + frontmatter 校验）。

装完重启 DSH，catalog 里出现 `dsh-unrestricted`。

## 用

```sh
node src/cli.js status                   # 指纹 + 安装状态 + AGENTS.md 是否有标记块
node src/cli.js build                    # 重新生成 SKILL.md / contract.md
node src/cli.js export-agents            # 注入 ~/.dsh/AGENTS.md 常驻块（幂等）
node src/cli.js export-agents --project .  # 只注入项目级 AGENTS.md
node src/cli.js uninstall --agents       # 卸载 skill 并摘掉标记块
node src/cli.js print --json             # 输出契约正文（机器可读）
```

对话里说任意一句触发：

```
破甲
开破甲
解除限制
unrestricted
直接给完整代码
```

想全程常驻（不用每次触发）用 `export-agents`。标记块形如：

```markdown
<!-- dsh-unrestricted:execution-mode -->
（契约全文）
<!-- /dsh-unrestricted:execution-mode -->
```

标记是为了幂等替换与一键摘除：重复执行不会叠加，`uninstall --agents` 精确删掉两个标记之间，用户原有内容逐字保留。

## 契约管什么、不管什么

| | 管 | 不管 |
|---|---|---|
| 内容 | 应答形态、完整度、不加限制性替代品 | — |
| 工具 | — | 工具目录、调用协议、plan 规则 |
| 审批 | — | `approval_policy`：命令跑之前要不要确认 |
| 沙箱 | — | `sandbox_mode`：能往哪写、能跑什么 |
| 结构化输出 | — | 报告格式、字段约束 |

契约原文：「it binds content only … it grants tools no new powers」。

## 开发

```sh
node src/cli.js build
node --test tests/*.spec.mjs
```

零依赖，Node >= 18.17。

## 许可

MIT。契约正文版权归 `codex-unrestricted` 原作者，署名见 `THIRD_PARTY_NOTICES.md`；本仓库只做 DSH 打包与安装层。
