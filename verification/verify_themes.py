from playwright.sync_api import sync_playwright

def verify_themes(page):
    page.goto("http://localhost:5173")

    # Wait for the app to load
    page.wait_for_selector("text=知己工具箱")

    # 1. Capture Dark Mode (Default)
    page.screenshot(path="verification/theme_dark.png")

    # 2. Switch to Light Mode
    page.get_by_title("Light Mode").click()
    page.wait_for_timeout(1000) # Wait for transition
    page.screenshot(path="verification/theme_light.png")

    # 3. Switch to Tech Mode
    page.get_by_title("Tech Mode").click()
    page.wait_for_timeout(1000) # Wait for transition
    page.screenshot(path="verification/theme_tech.png")

    # 4. Open a Tool (MBTI) in Tech Mode - Use more specific selector (Heading in the main grid)
    # The previous attempt failed because the text exists in both the Sidebar and the Main Grid.
    # We want to click the card in the main grid to open it.
    page.locator(".glass-card").filter(has_text="MBTI 性格测试").click()
    page.wait_for_timeout(1000)
    page.screenshot(path="verification/tech_mbti.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_themes(page)
        finally:
            browser.close()
