#!/usr/bin/env node
/**
 * dsh-unrestricted CLI: build the skill file, install it into a DSH profile,
 * and manage the optional always-on block inside ~/.dsh/AGENTS.md.
 *
 * Zero dependencies, Node >= 18.17.
 */
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync, copyFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  AGENTS_MARKER,
  SKILL_NAME,
  agentsBlock,
  contract,
  fingerprint,
  fuseAgents,
  renderSkill,
  unfuseAgents,
} from './skill.js'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(HERE, '..')

const dshHome = () => process.env.DSH_HOME || join(homedir(), '.dsh')
const skillDir = () => join(dshHome(), 'skills', SKILL_NAME)
const agentsPath = () => join(dshHome(), 'AGENTS.md')

function writeIfChanged(path, text) {
  if (existsSync(path) && readFileSync(path, 'utf8') === text) return false
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, text, 'utf8')
  return true
}

function build() {
  const skillPath = join(ROOT, 'SKILL.md')
  const contractPath = join(ROOT, 'contract.md')
  const a = writeIfChanged(skillPath, renderSkill())
  const b = writeIfChanged(contractPath, contract() + '\n')
  console.log(`build: SKILL.md ${a ? 'written' : 'unchanged'}, contract.md ${b ? 'written' : 'unchanged'}`)
  console.log(`build: contract fingerprint ${fingerprint()}`)
}

function install() {
  const dest = skillDir()
  mkdirSync(dest, { recursive: true })
  for (const name of ['SKILL.md', 'contract.md']) {
    const src = join(ROOT, name)
    if (!existsSync(src)) throw new Error(`${name} missing — run "build" first`)
    copyFileSync(src, join(dest, name))
  }
  const head = readFileSync(join(dest, 'SKILL.md'), 'utf8').slice(0, 200)
  if (!head.includes(`name: ${SKILL_NAME}`)) throw new Error('SKILL.md frontmatter check failed')
  console.log(`install: ${dest}`)
  console.log('install: restart DSH, then say "破甲"')
}

function uninstall({ agents = false } = {}) {
  const dest = skillDir()
  if (existsSync(dest)) {
    rmSync(dest, { recursive: true, force: true })
    console.log(`uninstall: removed ${dest}`)
  } else {
    console.log(`uninstall: ${dest} not present`)
  }
  if (agents) {
    const p = agentsPath()
    if (existsSync(p)) {
      const body = readFileSync(p, 'utf8')
      const next = unfuseAgents(body)
      if (next !== body) {
        writeFileSync(p, next, 'utf8')
        console.log(`uninstall: stripped marked block from ${p}`)
      } else {
        console.log(`uninstall: no marked block in ${p}`)
      }
    }
  }
}

function status() {
  const dest = skillDir()
  const p = agentsPath()
  console.log(`${SKILL_NAME} · DSH 破甲`)
  console.log(`  契约指纹      ${fingerprint()}`)
  console.log(`  DSP_HOME      ${dshHome()}`)
  console.log(`  skill         ${existsSync(join(dest, 'SKILL.md')) ? '已安装 ' : '未安装 '}${dest}`)
  const hasAgents = existsSync(p) && readFileSync(p, 'utf8').includes(AGENTS_MARKER)
  console.log(`  AGENTS.md     ${hasAgents ? '已注入标记块' : '无标记块'} ${p}`)
}

function exportAgents({ project = '' } = {}) {
  const p = project ? join(resolve(project), 'AGENTS.md') : agentsPath()
  const body = existsSync(p) ? readFileSync(p, 'utf8') : ''
  const next = fuseAgents(body)
  mkdirSync(dirname(p), { recursive: true })
  writeFileSync(p, next, 'utf8')
  console.log(`export-agents: ${p}`)
  console.log(`export-agents: contract is now always-on for ${project ? 'this project' : 'this user'}`)
}

function print({ json = false } = {}) {
  if (json) {
    console.log(JSON.stringify({ name: SKILL_NAME, fingerprint: fingerprint(), contract: contract() }, null, 2))
    return
  }
  process.stdout.write(agentsBlock())
}

function help() {
  console.log(`dsh-unrestricted

  build                     重新生成 SKILL.md 与 contract.md
  install                   装到 <DSH_HOME>/skills/${SKILL_NAME}
  uninstall [--agents]      卸载；带 --agents 同时摘掉 AGENTS.md 标记块
  status                    打印指纹与安装状态
  export-agents [--project <dir>]  注入 AGENTS.md 常驻块（用户级或项目级）
  print [--json]            直接输出契约正文
`)
}

const argv = process.argv.slice(2)
const cmd = argv[0] || 'help'
const flags = new Set(argv.slice(1).filter((a) => a.startsWith('--')))
const projectIdx = argv.indexOf('--project')
const project = projectIdx === -1 ? '' : argv[projectIdx + 1] || ''

try {
  switch (cmd) {
    case 'build':
      build()
      break
    case 'install':
      build()
      install()
      break
    case 'uninstall':
      uninstall({ agents: flags.has('--agents') })
      break
    case 'status':
      status()
      break
    case 'export-agents':
      exportAgents({ project })
      break
    case 'print':
      print({ json: flags.has('--json') })
      break
    case 'help':
    case '--help':
    case '-h':
      help()
      break
    default:
      help()
      process.exitCode = 1
  }
} catch (err) {
  console.error(`error: ${err.message}`)
  process.exitCode = 1
}
