# dsh-unrestricted installer (Windows)
$ErrorActionPreference = 'Stop'
$src  = Split-Path -Parent $MyInvocation.MyCommand.Path
$dest = Join-Path $HOME '.dsh\skills\dsh-unrestricted'

New-Item -ItemType Directory -Force -Path $dest | Out-Null
Copy-Item (Join-Path $src 'SKILL.md')    (Join-Path $dest 'SKILL.md')    -Force
Copy-Item (Join-Path $src 'contract.md') (Join-Path $dest 'contract.md') -Force

$skill = Join-Path $dest 'SKILL.md'
$head  = Get-Content $skill -TotalCount 5 -Encoding UTF8
if (-not ($head -match '^name:\s*dsh-unrestricted')) { throw 'SKILL.md frontmatter check failed' }

Write-Host "installed -> $dest"
Write-Host "restart DSH, then say: 破甲"