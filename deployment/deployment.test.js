import { test, expect } from '@playwright/test'
import { dismissBetaBanner, getLtiIFrame, waitForNoSpinners, TEST_URL } from '@oxctl/deployment-test-utils'

test.describe('Test deployment', () => {
    test('The tool should load and the title "Redirecting to Subaccount..." should be shown (before redirecting to the subaccount).', async ({context, page}) => {
    await page.goto(TEST_URL)
    await dismissBetaBanner(page)
    const ltiIFrame = getLtiIFrame(page)
    await waitForNoSpinners(ltiIFrame)

    // Check there's the correct title on the page
    const title = ltiIFrame.getByText("Redirecting to Subaccount...") 

    await Promise.any([
        expect(title).toBeVisible()
        expect(title).toBeVisible({ timeout: 1000 }),
        expect(page).toHaveURL(/accounts\/11581/, { timeout: 10000 }),
    ])
  })
})
