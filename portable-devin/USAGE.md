# Using Portable Devin

This guide explains how to use the portable Devin AI assistant capabilities in any codebase.

## Quick Installation

### Method 1: Drag & Drop
1. Copy the entire `portable-devin` folder to your target project
2. Run the setup script: `python setup.py`
   - This places `.windsurfrules` in your project root
   - Installs required dependencies

### Method 2: Manual Setup
1. Copy the entire `portable-devin` folder to your target project
2. Copy `.windsurfrules` to the root of your target project
3. Install dependencies: `pip install -r requirements.txt`
4. Run `playwright install` if you need browser automation features

## Using the AI Assistant

Once installed, you can use the AI assistant capabilities through Windsurf. The AI assistant can:

1. **Search the Web**: Use the search engine integration to find information online
   ```python
   from tools.search_engine import search
   results = search("your search query")
   ```

2. **LLM Integration**: Use AI models to assist with code and questions
   ```python
   from tools.llm_api import query_llm
   response = query_llm("How do I implement a binary search?", provider="openai")
   ```

3. **Web Scraping**: Extract information from websites
   ```python
   from tools.web_scraper import fetch_page, extract_text
   content = fetch_page("https://example.com")
   text = extract_text(content)
   ```

4. **Screenshots**: Capture and analyze browser screenshots
   ```python
   from tools.screenshot_utils import take_screenshot
   screenshot_path = take_screenshot("https://example.com")
   ```

## Troubleshooting

- **API Key Issues**: Ensure all required API keys are properly set in the `.env` file
- **Import Errors**: Make sure the `tools` directory is in your Python path
- **Browser Automation**: If you encounter Playwright errors, run `playwright install`

## Security Notes

- Your `.env` file contains API keys - do not commit it to public repositories
- Consider adding `.env` to your `.gitignore` file
