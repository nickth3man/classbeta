#!/usr/bin/env python3
"""
Devin Utilities

A simple utility script that provides easy access to common Devin functionality.
Follows clean code principles with clear function names, proper documentation,
and separation of concerns.
"""

import os
import sys
import argparse
import importlib.util
from dotenv import load_dotenv
from pathlib import Path


def validate_environment():
    """
    Validate the environment configuration.
    
    Ensures the necessary API keys are available and required modules
    can be imported. Returns a dictionary with status information.
    """
    results = {
        "environment_loaded": False,
        "api_keys": {},
        "modules": {},
        "overall_status": "error"
    }
    
    # Check environment variables
    load_dotenv()
    api_keys = {
        "GOOGLE_API_KEY": os.getenv("GOOGLE_API_KEY"),
        "OPENAI_API_KEY": os.getenv("OPENAI_API_KEY"),
        "ANTHROPIC_API_KEY": os.getenv("ANTHROPIC_API_KEY"),
        "DEEPSEEK_API_KEY": os.getenv("DEEPSEEK_API_KEY"),
    }
    
    results["environment_loaded"] = True
    results["api_keys"] = {k: (v is not None) for k, v in api_keys.items()}
    
    # Check required modules
    required_modules = [
        "tools.llm_api",
        "tools.web_scraper",
        "tools.search_engine",
        "tools.screenshot_utils",
        "playwright",
        "html5lib",
        "openai",
        "anthropic"
    ]
    
    for module in required_modules:
        try:
            importlib.import_module(module)
            results["modules"][module] = True
        except ImportError:
            results["modules"][module] = False
    
    # Set overall status
    if all(results["modules"].values()) and any(results["api_keys"].values()):
        results["overall_status"] = "ready"
    elif all(results["modules"].values()):
        results["overall_status"] = "partial"
    
    return results


def format_validation_results(results):
    """Format validation results for display in terminal."""
    output = []
    output.append("\n" + "=" * 60)
    output.append("DEVIN ENVIRONMENT STATUS".center(60))
    output.append("=" * 60 + "\n")
    
    # API Keys
    output.append("API Keys:")
    for key, status in results["api_keys"].items():
        status_symbol = "✅" if status else "❌"
        output.append(f"  {status_symbol} {key}")
    
    # Modules
    output.append("\nRequired Modules:")
    for module, status in results["modules"].items():
        status_symbol = "✅" if status else "❌"
        output.append(f"  {status_symbol} {module}")
    
    # Overall status
    output.append("\n" + "=" * 60)
    if results["overall_status"] == "ready":
        output.append("✅ Devin is ready to use!")
    elif results["overall_status"] == "partial":
        output.append("⚠️ Devin is available with limited functionality.")
        output.append("   Configure your API keys in the .env file for full functionality.")
    else:
        output.append("❌ Devin is not properly configured.")
        output.append("   Please check the errors above and run setup.py.")
    
    return "\n".join(output)


def run_web_search(query, max_results=5):
    """
    Run a web search using the search engine module.
    
    Args:
        query: Search query string
        max_results: Maximum number of results to return
        
    Returns:
        List of search results
    """
    try:
        from tools.search_engine import search
        results = search(query, max_results=max_results)
        return results
    except Exception as e:
        print(f"Error performing search: {str(e)}")
        return []


def query_ai_assistant(question, provider="openai"):
    """
    Query the AI assistant using the configured LLM.
    
    Args:
        question: The query or question to ask
        provider: Which LLM provider to use (openai, anthropic, etc.)
        
    Returns:
        Response from the AI assistant
    """
    try:
        from tools.llm_api import query_llm
        response = query_llm(question, provider)
        return response
    except Exception as e:
        print(f"Error querying AI assistant: {str(e)}")
        return None


def take_web_screenshot(url, output_path=None):
    """
    Take a screenshot of a webpage.
    
    Args:
        url: The URL to capture
        output_path: Where to save the screenshot (optional)
        
    Returns:
        Path to the saved screenshot
    """
    try:
        from tools.screenshot_utils import take_screenshot
        screenshot_path = take_screenshot(url, output_path)
        return screenshot_path
    except Exception as e:
        print(f"Error taking screenshot: {str(e)}")
        return None


def scrape_webpage(url):
    """
    Scrape content from a webpage.
    
    Args:
        url: The URL to scrape
        
    Returns:
        Extracted text content
    """
    try:
        from tools.web_scraper import scrape_website_content
        content = scrape_website_content(url)
        return content
    except Exception as e:
        print(f"Error scraping webpage: {str(e)}")
        return None


def main():
    """Main function to handle command-line usage."""
    parser = argparse.ArgumentParser(description="Devin AI Assistant Utilities")
    subparsers = parser.add_subparsers(dest="command", help="Command to run")
    
    # Verify command
    verify_parser = subparsers.add_parser("verify", help="Verify installation and configuration")
    
    # Search command
    search_parser = subparsers.add_parser("search", help="Search the web")
    search_parser.add_argument("query", type=str, help="Search query")
    search_parser.add_argument("--results", type=int, default=5, help="Number of results")
    
    # Ask command
    ask_parser = subparsers.add_parser("ask", help="Ask the AI assistant")
    ask_parser.add_argument("question", type=str, help="Question to ask")
    ask_parser.add_argument("--provider", type=str, default="openai", help="LLM provider")
    
    # Screenshot command
    screenshot_parser = subparsers.add_parser("screenshot", help="Take a webpage screenshot")
    screenshot_parser.add_argument("url", type=str, help="URL to capture")
    screenshot_parser.add_argument("--output", type=str, help="Output file path")
    
    # Scrape command
    scrape_parser = subparsers.add_parser("scrape", help="Scrape a webpage")
    scrape_parser.add_argument("url", type=str, help="URL to scrape")
    
    args = parser.parse_args()
    
    # Handle commands
    if args.command == "verify" or not args.command:
        results = validate_environment()
        print(format_validation_results(results))
    
    elif args.command == "search":
        results = run_web_search(args.query, args.results)
        if results:
            print(f"\nFound {len(results)} results for '{args.query}':")
            for i, result in enumerate(results, 1):
                print(f"\n[{i}] {result.get('title', 'No title')}")
                print(f"    URL: {result.get('href', 'No URL')}")
                print(f"    {result.get('body', 'No description')[:150]}...")
        else:
            print("No results found or search failed.")
    
    elif args.command == "ask":
        response = query_ai_assistant(args.question, args.provider)
        if response:
            print(f"\nResponse from AI assistant:\n")
            print(response)
        else:
            print("Failed to get a response from the AI assistant.")
    
    elif args.command == "screenshot":
        path = take_web_screenshot(args.url, args.output)
        if path:
            print(f"Screenshot saved to: {path}")
        else:
            print("Failed to take screenshot.")
    
    elif args.command == "scrape":
        content = scrape_webpage(args.url)
        if content:
            print("\nExtracted content:")
            print("=" * 60)
            print(content[:1000] + "..." if len(content) > 1000 else content)
            print("=" * 60)
        else:
            print("Failed to scrape content.")


if __name__ == "__main__":
    main()
