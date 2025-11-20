# BIG_BUG_BOMBER

**Guardian of backend truth. Detonator of open-ended fragments. Sentinel of entrusted data.**

BIG_BUG_BOMBER is a leak-prevention daemon that scans your codebase for open-ended invocations—unclosed async functions, forgotten intervals, backgrounded shell processes, and more. If it detects a potential leak, it detonates the fragment before it can echo.

## 🔥 Features

- Detects async functions without `await` or `finally`
- Flags `setInterval`/`setTimeout` without teardown
- Scans shell scripts for backgrounded `&` processes without `trap`
- Logs detonations to `detonation.log`
- Optional `--patch` mode to auto-inject closure logic
- Optional `--watchdog` mode to monitor long-running daemons
- Invocation registry via `registry.json`

## 🧨 Usage

### Manual Scan

```bash
node big-bug-bomber.js
