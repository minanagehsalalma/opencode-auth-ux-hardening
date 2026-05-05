#!/usr/bin/env node

import { spawnSync } from "node:child_process"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, "..")
const supportedVersion = "1.14.31"
const patchedSource = path.join(repoRoot, "artifacts", "opencode-ai", supportedVersion, "bin", "opencode")
const backupName = `opencode.upstream-backup.${supportedVersion}`

function fail(message) {
  console.error(message)
  process.exit(1)
}

function parseArgs(argv) {
  const options = {
    force: false,
    restore: false,
    target: "",
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (arg === "--force") {
      options.force = true
      continue
    }
    if (arg === "--restore") {
      options.restore = true
      continue
    }
    if (arg === "--target") {
      options.target = argv[index + 1] || ""
      index += 1
      continue
    }
    if (arg.startsWith("--target=")) {
      options.target = arg.slice("--target=".length)
      continue
    }
    if (arg === "-h" || arg === "--help") {
      printHelp()
      process.exit(0)
    }
    fail(`Unknown argument: ${arg}`)
  }

  return options
}

function printHelp() {
  console.log(`apply-opencode-auth-ux-patch.mjs

Usage:
  node scripts/apply-opencode-auth-ux-patch.mjs
  node scripts/apply-opencode-auth-ux-patch.mjs --target "C:\\Users\\you\\AppData\\Roaming\\npm\\node_modules\\opencode-ai"
  node scripts/apply-opencode-auth-ux-patch.mjs --restore

Options:
  --target   Explicit opencode-ai package root
  --force    Allow patching a version other than ${supportedVersion}
  --restore  Restore the backed-up upstream launcher
`)
}

function run(command, args) {
  return spawnSync(command, args, {
    encoding: "utf8",
    windowsHide: true,
  })
}

function getDefaultPackageRoot() {
  const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm"
  const result = run(npmCommand, ["root", "-g"])
  if (!result.error && result.status === 0 && result.stdout.trim()) {
    return path.join(result.stdout.trim(), "opencode-ai")
  }

  const home = os.homedir()
  const candidates = process.platform === "win32"
    ? [
        path.join(home, "AppData", "Roaming", "npm", "node_modules", "opencode-ai"),
      ]
    : [
        "/usr/local/lib/node_modules/opencode-ai",
        path.join(home, ".local", "lib", "node_modules", "opencode-ai"),
      ]

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate
  }

  return ""
}

function getPackageRoot(options) {
  const packageRoot = options.target || process.env.OPENCODE_AI_DIR || getDefaultPackageRoot()
  if (!packageRoot) {
    fail("Could not locate a global opencode-ai install. Use --target to point at the package root.")
  }
  return path.resolve(packageRoot)
}

function readPackageInfo(packageRoot) {
  const packageJsonPath = path.join(packageRoot, "package.json")
  if (!fs.existsSync(packageJsonPath)) {
    fail(`package.json not found under ${packageRoot}`)
  }
  return JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))
}

function ensureSupportedVersion(packageInfo, options) {
  if (packageInfo.name !== "opencode-ai") {
    fail(`Expected package name opencode-ai, got ${packageInfo.name || "(missing)"}`)
  }
  if (packageInfo.version !== supportedVersion && !options.force) {
    fail(`Expected opencode-ai@${supportedVersion}, found ${packageInfo.version}. Re-run with --force if you want to override this guard.`)
  }
}

function copyWithMode(sourcePath, targetPath) {
  fs.copyFileSync(sourcePath, targetPath)
  const mode = fs.statSync(sourcePath).mode
  fs.chmodSync(targetPath, mode)
}

function applyPatch(packageRoot, options) {
  const packageInfo = readPackageInfo(packageRoot)
  ensureSupportedVersion(packageInfo, options)

  const targetPath = path.join(packageRoot, "bin", "opencode")
  const backupPath = path.join(packageRoot, "bin", backupName)

  if (!fs.existsSync(targetPath)) {
    fail(`Target launcher not found: ${targetPath}`)
  }
  if (!fs.existsSync(patchedSource)) {
    fail(`Patched source not found: ${patchedSource}`)
  }

  const current = fs.readFileSync(targetPath, "utf8")
  const patched = fs.readFileSync(patchedSource, "utf8")

  if (current === patched) {
    console.log(`Already patched: ${targetPath}`)
    console.log(`Version: ${packageInfo.version}`)
    return
  }

  if (!fs.existsSync(backupPath)) {
    copyWithMode(targetPath, backupPath)
  }

  copyWithMode(patchedSource, targetPath)
  console.log(`Patched ${targetPath}`)
  console.log(`Backup: ${backupPath}`)
  console.log(`Version: ${packageInfo.version}`)
}

function restorePatch(packageRoot) {
  const targetPath = path.join(packageRoot, "bin", "opencode")
  const backupPath = path.join(packageRoot, "bin", backupName)
  if (!fs.existsSync(backupPath)) {
    fail(`Backup not found: ${backupPath}`)
  }
  copyWithMode(backupPath, targetPath)
  console.log(`Restored ${targetPath}`)
  console.log(`Source: ${backupPath}`)
}

const options = parseArgs(process.argv.slice(2))
const packageRoot = getPackageRoot(options)

if (options.restore) {
  restorePatch(packageRoot)
  process.exit(0)
}

applyPatch(packageRoot, options)
