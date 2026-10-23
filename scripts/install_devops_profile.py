#!/usr/bin/env python3
"""
install_devops_profile.py
Utility script to replicate the 5-Phase DevOps and Full-Spectrum Testing Lifecycle
into ANY project folder or new workspace on your system.

Usage:
  python scripts/install_devops_profile.py <target_directory_path>
Example:
  python scripts/install_devops_profile.py "d:/Association/new-project"
"""

import sys
import os
import shutil
from pathlib import Path

SOURCE_ROOT = Path(__file__).resolve().parent.parent

def install_devops_profile(target_dir):
    target = Path(target_dir).resolve()
    print(f"🚀 Deploying Antigravity Master DevOps Profile to: {target}")

    if not target.exists():
        target.mkdir(parents=True, exist_ok=True)
        print(f"  Created target directory: {target}")

    # 1. Replicate AGENTS.md
    agents_src = SOURCE_ROOT / "AGENTS.md"
    if agents_src.exists():
        shutil.copy2(agents_src, target / "AGENTS.md")
        print(f"  ✅ Copied AGENTS.md -> {target / 'AGENTS.md'}")

    # 2. Replicate .agents/rules
    rules_src = SOURCE_ROOT / ".agents" / "rules"
    rules_dst = target / ".agents" / "rules"
    rules_dst.mkdir(parents=True, exist_ok=True)
    if rules_src.exists():
        for item in rules_src.glob("*.md"):
            shutil.copy2(item, rules_dst / item.name)
            print(f"  ✅ Copied rule: {item.name} -> {rules_dst}")

    # 3. Replicate .agents/skills/devops-pipeline
    skill_src = SOURCE_ROOT / ".agents" / "skills" / "devops-pipeline"
    skill_dst = target / ".agents" / "skills" / "devops-pipeline"
    skill_dst.mkdir(parents=True, exist_ok=True)
    if skill_src.exists():
        for item in skill_src.glob("*.md"):
            shutil.copy2(item, skill_dst / item.name)
            print(f"  ✅ Copied skill: devops-pipeline/{item.name} -> {skill_dst}")

    # 4. Initialize TASK_LOG.md if not present
    task_log_dst = target / "TASK_LOG.md"
    if not task_log_dst.exists():
        initial_log = """# 📋 PROJECT MASTER TASK & ERROR LOG

> **Document Purpose**: Central persistent engineering ledger following the 5-Phase DevOps Lifecycle.

---

## 🚀 Session Resumption State (Checkpoint)
- **Status**: Initialized with Master DevOps Lifecycle
- **Branch**: main

---

## 📊 Task & Issue Registry
| ID | Origin | Category | Description | Priority | Status |
|---|---|---|---|---|---|
| **TSK-001** | User Request | Initialization | Project setup with DevOps Lifecycle | High | COMPLETED |

---

## 📝 Detailed Task & Error Logs
"""
        task_log_dst.write_text(initial_log, encoding="utf-8")
        print(f"  ✅ Initialized TASK_LOG.md -> {task_log_dst}")

    print("\n🎉 Master DevOps Profile successfully deployed! Any agent session in that directory will automatically adopt the 5-Phase DevOps Lifecycle.")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python scripts/install_devops_profile.py <target_directory_path>")
        sys.exit(1)
    install_devops_profile(sys.argv[1])
