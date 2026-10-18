#!/usr/bin/env python3
"""
Local Blender MCP Server for Vice City Heist
Provides tools to interact with Blender, execute bpy scripts, inspect objects, and export 3D assets.
Compatible with MCP SDK 2.x
"""
from mcp.server.mcpserver import MCPServer
import subprocess
import os
import sys

mcp = MCPServer("BlenderMCP")

def find_blender_exe():
    env_path = os.environ.get("BLENDER_PATH")
    if env_path and os.path.exists(env_path):
        return env_path
    
    candidates = [
        r"C:\Program Files\Blender Foundation\Blender 5.2\blender.exe",
        r"C:\Program Files\Blender Foundation\Blender 4.5\blender.exe",
        r"C:\Program Files\Blender Foundation\Blender 4.2\blender.exe",
        r"C:\Program Files\Blender Foundation\Blender\blender.exe",
        r"C:\Program Files (x86)\Blender Foundation\Blender\blender.exe",
        r"D:\apps\blender.exe",
        r"D:\apps\Blender\blender.exe",
    ]
    for c in candidates:
        if os.path.exists(c):
            return c
            
    # Try finding in PATH
    try:
        res = subprocess.run(["where", "blender"], capture_output=True, text=True)
        if res.returncode == 0:
            lines = res.stdout.strip().splitlines()
            if lines and os.path.exists(lines[0].strip()):
                return lines[0].strip()
    except Exception:
        pass
    return None

@mcp.tool()
def get_blender_version() -> str:
    """Returns the installed Blender version and executable path."""
    blender = find_blender_exe()
    if not blender:
        return "Blender executable not found on this system."
    try:
        res = subprocess.run([blender, "-b", "--version"], capture_output=True, text=True, check=True)
        return f"Path: {blender}\n{res.stdout.strip()}"
    except Exception as e:
        return f"Error executing Blender ({blender}): {str(e)}"

@mcp.tool()
def execute_blender_script(script_path: str) -> str:
    """Executes a Python script in Blender headless/background mode."""
    blender = find_blender_exe()
    if not blender:
        return "Blender executable not found on this system."
    if not os.path.isabs(script_path):
        script_path = os.path.abspath(script_path)
    if not os.path.exists(script_path):
        return f"Script file not found: {script_path}"
    try:
        res = subprocess.run(
            [blender, "-b", "--python", script_path],
            capture_output=True,
            text=True
        )
        return f"Return Code: {res.returncode}\n\nSTDOUT:\n{res.stdout}\n\nSTDERR:\n{res.stderr}"
    except Exception as e:
        return f"Failed to execute script in Blender: {str(e)}"

@mcp.tool()
def execute_blender_code(python_code: str) -> str:
    """Executes an inline Python snippet inside Blender headless/background mode."""
    blender = find_blender_exe()
    if not blender:
        return "Blender executable not found on this system."
    temp_script = os.path.abspath("_temp_blender_exec.py")
    try:
        with open(temp_script, "w", encoding="utf-8") as f:
            f.write(python_code)
        res = subprocess.run(
            [blender, "-b", "--python", temp_script],
            capture_output=True,
            text=True
        )
        return f"Return Code: {res.returncode}\n\nSTDOUT:\n{res.stdout}\n\nSTDERR:\n{res.stderr}"
    finally:
        if os.path.exists(temp_script):
            try:
                os.remove(temp_script)
            except Exception:
                pass

if __name__ == "__main__":
    mcp.run()
