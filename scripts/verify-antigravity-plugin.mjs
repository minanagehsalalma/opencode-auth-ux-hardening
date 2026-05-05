#!/usr/bin/env node

import crypto from "node:crypto"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"

const expected = {
  name: "opencode-antigravity-auth",
  version: "1.6.5-beta.0",
  pluginJsSha256: "3DA3651908AC2FB8F2FA10F3ABAC83CE75FE0E0142E8AC3BC8A13B70C88A6D04",
  npmTarball: "https://registry.npmjs.org/opencode-antigravity-auth/-/opencode-antigravity-auth-1.6.5-beta.0.tgz",
}

function sha256(filePath) {
  const hash = crypto.createHash("sha256")
  hash.update(fs.readFileSync(filePath))
  return hash.digest("hex").toUpperCase()
}

function fail(message) {
  console.error(message)
  process.exit(1)
}

function resolveDefaultPluginRoot() {
  return path.join(
    os.homedir(),
    ".cache",
    "opencode",
    "packages",
    "opencode-antigravity-auth@beta",
    "node_modules",
    "opencode-antigravity-auth",
  )
}

function parseTarget(argv) {
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (arg === "--target") {
      return argv[index + 1] || ""
    }
    if (arg.startsWith("--target=")) {
      return arg.slice("--target=".length)
    }
    if (arg === "-h" || arg === "--help") {
      console.log(`verify-antigravity-plugin.mjs

Usage:
  node scripts/verify-antigravity-plugin.mjs
  node scripts/verify-antigravity-plugin.mjs --target "<plugin-root>"
`)
      process.exit(0)
    }
  }
  return ""
}

const explicitTarget = parseTarget(process.argv.slice(2))
const pluginRoot = path.resolve(explicitTarget || resolveDefaultPluginRoot())
const packageJsonPath = path.join(pluginRoot, "package.json")
const pluginJsPath = path.join(pluginRoot, "dist", "src", "plugin.js")

if (!fs.existsSync(packageJsonPath)) fail(`Plugin package.json not found: ${packageJsonPath}`)
if (!fs.existsSync(pluginJsPath)) fail(`Plugin entry file not found: ${pluginJsPath}`)

const packageInfo = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))
const installedHash = sha256(pluginJsPath)

if (packageInfo.name !== expected.name) fail(`Expected ${expected.name}, found ${packageInfo.name}`)
if (packageInfo.version !== expected.version) fail(`Expected version ${expected.version}, found ${packageInfo.version}`)
if (installedHash !== expected.pluginJsSha256) {
  fail(`Plugin hash mismatch\ninstalled: ${installedHash}\nexpected:  ${expected.pluginJsSha256}`)
}

console.log("Plugin verification passed")
console.log(`package: ${packageInfo.name}@${packageInfo.version}`)
console.log(`installed plugin.js sha256: ${installedHash}`)
console.log(`upstream plugin.js sha256:  ${expected.pluginJsSha256}`)
console.log(`npm tarball: ${expected.npmTarball}`)
