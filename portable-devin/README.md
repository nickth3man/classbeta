# Portable Devin

A self-contained version of the devin.cursorrules functionality that can be easily copied to any codebase.

## Quick Start

1. Copy the entire `portable-devin` folder to your target project directory
2. Edit the `.env` file to add your API keys
3. Place `.windsurfrules` at the root of your target project (this activates the AI assistant)
4. Make sure Python is installed with the required dependencies:
   ```
   pip install -r requirements.txt
   ```

## What's Included

- `.windsurfrules` - Configuration for the Windsurf AI assistant
- `.env` - Environment variables and API keys
- `scratchpad.md` - Additional configuration for the AI assistant
- `tools/` - Core functionality modules (LLM, web scraping, search, screenshots)
- `requirements.txt` - Required Python packages

## Usage

Once installed in your target project, you can interact with the AI assistant through Windsurf. The assistant will have access to:

- Web search capabilities
- LLM-powered code analysis
- Screenshot capturing and verification
- Web scraping for research

## Troubleshooting

- If the assistant isn't working, make sure `.windsurfrules` is at the root of your project
- Check that all API keys are properly configured in the `.env` file
- Verify all required packages are installed with `pip install -r requirements.txt`
- For browser automation features, run `playwright install` to set up the necessary browsers
