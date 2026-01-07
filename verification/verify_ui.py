from playwright.sync_api import sync_playwright

def verify_ui_components():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Use a mobile-like viewport but wide enough to maybe show things nicely
        page = browser.new_page(viewport={"width": 375, "height": 812})

        page.goto("http://localhost:5173")
        page.wait_for_selector(".glass-card")

        page.screenshot(path="verification/1_dashboard.png")
        print("Captured dashboard")

        # Navigate to Bazi directly from Dashboard cards
        # Bazi is the 3rd card
        cards = page.locator(".glass-card")
        # Ensure we have cards
        print(f"Found {cards.count()} cards")
        if cards.count() >= 3:
            cards.nth(2).click()
        else:
            print("Not enough cards found!")
            return

        page.wait_for_timeout(1000)

        # Check Bazi UI (Inputs should be visible)
        page.screenshot(path="verification/2_bazi_input.png")

        # Fill inputs
        page.fill("input[type='date']", "1990-01-01")
        page.fill("input[type='time']", "12:00")

        # Click Calculate (Button with text or icon)
        # We used our new Button component.
        # It should be the last button in the form section.
        page.locator("main button").last.click()

        page.wait_for_timeout(2000) # Wait for simulation

        page.screenshot(path="verification/3_bazi_result.png")
        print("Captured Bazi result")

        # Go Back using the breadcrumb button
        # "控制台"
        page.locator("button").filter(has_text="控制台").click()
        page.wait_for_timeout(500)

        # Go to MBTI (1st card)
        cards.nth(0).click()
        page.wait_for_timeout(500)

        page.screenshot(path="verification/4_mbti.png")
        print("Captured MBTI")

        browser.close()

if __name__ == "__main__":
    verify_ui_components()
