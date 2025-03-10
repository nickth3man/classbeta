#!/usr/bin/env python3
"""
Portable Devin Setup Script

This script helps set up the portable Devin AI assistant in any codebase.
It handles:
1. Setting up the .windsurfrules file in the target project
2. Creating a local .env file from the template
3. Ensuring dependencies are installed
"""

import os
import sys
import shutil
import subprocess
from pathlib import Path

def print_header(title):
    """Print a section header."""
    print(f"\n{'=' * 60}")
    print(f"{title}".center(60))
    print(f"{'=' * 60}")

def setup_windsurfrules(target_dir=None):
    """Set up the .windsurfrules file in the target directory."""
    source_file = Path(__file__).parent / ".windsurfrules"
    
    if not target_dir:
        target_dir = Path.cwd()
    else:
        target_dir = Path(target_dir)
    
    target_file = target_dir / ".windsurfrules"
    
    if not source_file.exists():
        print("❌ Error: .windsurfrules file not found in the portable Devin package.")
        return False
    
    try:
        shutil.copy(source_file, target_file)
        print(f"✅ Copied .windsurfrules to {target_file}")
        return True
    except Exception as e:
        print(f"❌ Error copying .windsurfrules: {str(e)}")
        return False

def setup_env_file():
    """Set up the .env file from the template."""
    source_file = Path(__file__).parent / ".env.template"
    target_file = Path(__file__).parent / ".env"
    
    if not source_file.exists():
        print("❌ Error: .env.template file not found.")
        return False
    
    if target_file.exists():
        print("ℹ️ .env file already exists, skipping creation.")
        return True
    
    try:
        shutil.copy(source_file, target_file)
        print(f"✅ Created .env file from template. Please edit it to add your API keys.")
        return True
    except Exception as e:
        print(f"❌ Error creating .env file: {str(e)}")
        return False

def install_dependencies():
    """Install the required dependencies."""
    req_file = Path(__file__).parent / "requirements.txt"
    
    if not req_file.exists():
        print("❌ Error: requirements.txt file not found.")
        return False
    
    try:
        print("Installing dependencies...")
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", str(req_file)], check=True)
        print("✅ Dependencies installed successfully.")
        
        # Check if playwright is required and install browsers if needed
        with open(req_file, 'r') as f:
            if 'playwright' in f.read():
                print("Installing Playwright browsers...")
                try:
                    subprocess.run([sys.executable, "-m", "playwright", "install"], check=True)
                    print("✅ Playwright browsers installed successfully.")
                except Exception as e:
                    print(f"❌ Error installing Playwright browsers: {str(e)}")
        
        return True
    except Exception as e:
        print(f"❌ Error installing dependencies: {str(e)}")
        return False

def main():
    """Run the setup process."""
    print_header("Portable Devin Setup")
    
    # Set up .windsurfrules
    target_dir = None
    if len(sys.argv) > 1:
        target_dir = sys.argv[1]
    
    windsurfrules_ok = setup_windsurfrules(target_dir)
    env_ok = setup_env_file()
    deps_ok = install_dependencies()
    
    print_header("Setup Complete")
    
    if windsurfrules_ok and env_ok and deps_ok:
        print("✅ Portable Devin is ready to use!")
        print("📝 Remember to edit the .env file to add your API keys")
        if target_dir:
            print(f"🔍 The .windsurfrules file has been placed in: {target_dir}")
        else:
            print(f"🔍 The .windsurfrules file has been placed in the current directory")
    else:
        print("⚠️ Setup completed with some issues. Please check the errors above.")

if __name__ == "__main__":
    main()
