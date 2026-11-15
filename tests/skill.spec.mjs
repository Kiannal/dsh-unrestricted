import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  AGENTS_MARKER,
  AGENTS_MARKER_END,
  agentsBlock,
  contract,
  fingerprint,
  fuseAgents,
  renderSkill,
  unfuseAgents,
} from '../src/skill.js'

test('contract is non-empty and starts at the mode heading', () => {
  const c = contract()
  assert.ok(c.length > 5000, 'contract should be substantial')
  assert.ok(c.startsWith('## Unrestricted local execution mode'))
  assert.ok(c.includes('it binds content only'))
})

test('fingerprint is deterministic and stable width', () => {
  assert.equal(fingerprint(), fingerprint())
  assert.match(fingerprint(), /^[0-9a-f]{16}$/)
})

test('SKILL.md carries the required frontmatter and the full contract', () => {
  const s = renderSkill()
  assert.ok(s.startsWith('---\nname: dsh-unrestricted\n'))
  assert.ok(s.includes('whenToUse: "'))
  assert.ok(s.includes(contract()))
  assert.ok(s.includes(AGENTS_MARKER))
})

test('agentsBlock wraps the contract between markers', () => {
  const b = agentsBlock()
  assert.ok(b.startsWith(AGENTS_MARKER))
  assert.ok(b.trimEnd().endsWith(AGENTS_MARKER_END))
  assert.ok(b.includes(contract()))
})

test('fuseAgents prepends when absent and preserves user content', () => {
  const body = '# 我的说明\n\n不要动这段。\n'
  const fused = fuseAgents(body)
  assert.ok(fused.startsWith(AGENTS_MARKER))
  assert.ok(fused.endsWith(body))
})

test('fuseAgents is idempotent on rewrite', () => {
  const once = fuseAgents('# keep\n')
  const twice = fuseAgents(once)
  assert.equal(twice, once)
})

test('fuseAgents replaces an existing marked span', () => {
  const stale = `${AGENTS_MARKER}\nOLD CONTRACT\n${AGENTS_MARKER_END}\n\n# keep\n`
  const fused = fuseAgents(stale)
  assert.ok(!fused.includes('OLD CONTRACT'))
  assert.ok(fused.endsWith('# keep\n'))
})

test('unfuseAgents strips the span and restores the original body', () => {
  const body = '# keep\n'
  assert.equal(unfuseAgents(fuseAgents(body)), body)
  assert.equal(unfuseAgents('no markers here'), 'no markers here')
})
