from playwright.sync_api import sync_playwright

def verify_astrology(page):
    page.goto("http://localhost:5173")
    page.wait_for_selector("text=知己工具箱")

    # 1. Verify Bazi Tool
    page.locator(".glass-card").filter(has_text="八字排盘").click()
    page.wait_for_selector("text=开始排盘")

    # Input date
    page.fill('input[type="date"]', '1990-01-01')
    page.fill('input[type="time"]', '12:00')
    page.click("text=开始排盘")

    # Check result
    page.wait_for_selector("text=排盘简析")
    page.screenshot(path="verification/bazi_result.png")
    print("Bazi Tool Verified")

    # Go back
    page.click("text=控制台")

    # 2. Verify ZiWei Tool
    page.locator(".glass-card").filter(has_text="紫微斗数").click()
    page.wait_for_selector("text=开始排盘")

    # Input date/gender
    page.fill('input[type="date"]', '1990-01-01')
    page.fill('input[type="time"]', '12:00')
    page.click("text=开始排盘")

    # Check result grid
    # Check if '命宫' exists (it should be in one of the cells)
    page.wait_for_selector("text=命宫")
    page.screenshot(path="verification/ziwei_result.png")
    print("ZiWei Tool Verified")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_astrology(page)
        finally:
            browser.close()
