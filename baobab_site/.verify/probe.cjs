const { chromium } = require('playwright-core')
const EXEC = '/home/denver/.cache/ms-playwright/chromium-1255/chrome-linux64/chrome'

;(async () => {
  const browser = await chromium.launch({ executablePath: EXEC, args: ['--no-sandbox'] })
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  page.on('pageerror', (e) => console.log('PAGEERROR', e.message))
  await page.goto('http://127.0.0.1:5178/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(1500)
  await page.evaluate(() => {
    const el = document.querySelector('.footer-signature')
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 300, behavior: 'instant' })
  })
  await page.waitForTimeout(2000)
  const info = await page.evaluate(() => {
    const name = document.querySelector('.footer-signature-name')
    const chars = Array.from(name.querySelectorAll('.split-char, div')).slice(0, 5)
    return {
      html: name.outerHTML.slice(0, 700),
      nameRect: name.getBoundingClientRect(),
      nameColor: getComputedStyle(name).color,
      footerColor: getComputedStyle(document.querySelector('.footer')).color,
      nameOpacity: getComputedStyle(name).opacity,
      nameVisibility: getComputedStyle(name).visibility,
      chars: chars.map((c) => ({
        text: c.textContent,
        style: c.getAttribute('style'),
        rect: c.getBoundingClientRect(),
        color: getComputedStyle(c).color,
        opacity: getComputedStyle(c).opacity,
      })),
      splitParents: Array.from(name.querySelectorAll('.split-line, .split-word')).length,
    }
  })
  console.log(JSON.stringify(info, null, 2))
  await page.screenshot({ path: 'shots/16-footer-close.png' })
  await browser.close()
})()
