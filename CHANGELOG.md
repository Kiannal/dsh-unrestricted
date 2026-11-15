# Changelog

## 1.0.0

首个完整发行版：破甲以 DSH 原生 skill 的形式打包，源码与构建产物同仓。

### 源码

- `src/rules.js` —— 契约常量与融合逻辑，逐字取自 `codex-unrestricted` v0.3.0 的 `EXECUTION_MODE_BLOCK`（MIT）。
- `src/skill.js` —— DSH 打包层：frontmatter 常量、`contract()`、`fingerprint()`、`agentsBlock()`、
  `fuseAgents()` / `unfuseAgents()`（幂等注入与摘除）、`renderSkill()`。
- `src/cli.js` —— `build` / `install` / `uninstall` / `status` / `export-agents` / `print`，
  零依赖，Node >= 18.17。
- `tests/skill.spec.mjs` —— 8 条 `node:test`：契约非空且以模式标题开头、指纹稳定、
  `SKILL.md` 带 frontmatter 且包含全文、标记块包裹、注入保序、重复注入幂等、旧块被替换、摘除还原。

### 构建产物

- `SKILL.md` 由 `renderSkill()` 生成，含 `name` / `description` / `whenToUse` 与契约全文。
- `contract.md` 只有契约正文，便于粘进 `~/.dsh/AGENTS.md`。
- CI 校验构建产物与源码一致（`git diff --exit-code`），改契约不重新 build 会挂。

### 安装

- `node src/cli.js install` → `$DSH_HOME/skills/dsh-unrestricted`（默认 `~/.dsh`），带 frontmatter 校验。
- `install.ps1` / `install.sh` 为无 Node 环境的等价复制路径。
- `export-agents` 把标记块写进 `AGENTS.md`，`uninstall --agents` 精确摘除并保留用户原文。

### 边界

契约约束内容，不新增工具权限；审批（`approval_policy`）与沙箱（`sandbox_mode`）只约束执行，
结构化输出格式不变。
