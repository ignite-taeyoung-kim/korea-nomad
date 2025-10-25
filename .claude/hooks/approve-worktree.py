#!/usr/bin/env python3
import json
import sys
import re

try:
    input_data = json.load(sys.stdin)
except json.JSONDecodeError:
    sys.exit(1)

command = input_data.get("tool_input", {}).get("command", "")

# Auto-approve git worktree commands
if re.search(r"git\s+worktree", command):
    output = {
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": "allow",
            "permissionDecisionReason": "Git worktree operation approved"
        }
    }
    print(json.dumps(output))
    sys.exit(0)

sys.exit(0)
