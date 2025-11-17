import { test, expect } from '@playwright/test'
import { dismissBetaBanner, getLtiIFrame, waitForNoSpinners, TEST_URL } from '@oxctl/deployment-test-utils'

// TEST_URL is provided by @oxctl/deployment-test-utils and composes host+path

test.describe('Test deployment', () => {
    test('The tool should load and the title "Redirecting to Subaccount..." should be shown (before redirecting the the subaccount).', async ({context, page}) => {
    await page.goto(TEST_URL)
    await dismissBetaBanner(page)
    const ltiIFrame = getLtiIFrame(page)
    await waitForNoSpinners(ltiIFrame)

    // Check there's a title Account Reports
    const title = ltiIFrame.getByText("Redirecting to Subaccount...")
    await expect(title).toBeVisible();
  })
})