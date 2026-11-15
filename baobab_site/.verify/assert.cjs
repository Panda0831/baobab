const { chromium } = require('playwright-core')
const EXEC = '/home/denver/.cache/ms-playwright/chromium-1255/chrome-linux64/chrome'
const URL = 'http://127.0.0.1:5178/'

async function audit(page, label) {
  const result = await page.evaluate(() => {
    const q = (s) => Array.from(document.querySelectorAll(s))
    const visible = (el) => {
      const style = getComputedStyle(el)
      return Number(style.opacity) > 0.99 && style.visibility !== 'hidden' && el.getBoundingClientRect().width > 0
    }
    const sections = ['#accueil', '#services', '#plateforme', '#about', '#methode', '#equipe', '#faq', '#contact']
    return {
      pinSpacers: q('.pin-spacer').length,
      pinnedSections: q('.is-pinned').map((el) => el.className),
      horizontalSections: q('.is-horizontal').length,
      triggers: window.__triggerCount ?? null,
      sections: sections.map((sel) => {
        const el = document.querySelector(sel)
        return { sel, height: el ? Math.round(el.getBoundingClientRect().height) : null }
      }),
      hiddenHeadings: q('h2').filter((el) => !visible(el)).map((el) => el.textContent.slice(0, 30)),
      hiddenCards: q('.feature-card, .team-member, .faq-item').filter((el) => !visible(el)).length,
      footerName: (() => {
        const el = document.querySelector('.footer-signature-name')
        return { color: getComputedStyle(el).color, opacity: getComputedStyle(el).opacity }
      })(),
      overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
    }
  })
  console.log(label, JSON.stringify(result))
}

;(async () => {
  const browser = await chromium.launch({ executablePath: EXEC, args: ['--no-sandbox'] })

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto(URL, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1800)
  await audit(page, 'AUDIT LOAD')
  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }))
  await page.waitForTimeout(1400)
  await audit(page, 'AUDIT BOTTOM')
  await page.screenshot({ path: 'shots/17-footer-fixed.png' })

  // Resize across the breakpoint: the horizontal rail must revert to a grid.
  await page.setViewportSize({ width: 760, height: 900 })
  await page.waitForTimeout(1200)
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await page.waitForTimeout(600)
  const afterResize = await page.evaluate(() => {
    const section = document.querySelector('.features')
    const track = document.querySelector('.features-grid')
    const cards = Array.from(document.querySelectorAll('.feature-card'))
    return {
      className: section.className,
      display: getComputedStyle(track).display,
      width: Math.round(track.getBoundingClientRect().width),
      pinSpacers: document.querySelectorAll('.pin-spacer').length,
      cards: cards.map((c) => ({ opacity: getComputedStyle(c).opacity, left: Math.round(c.getBoundingClientRect().left) })),
      overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
    }
  })
  console.log('AFTER RESIZE 760', JSON.stringify(afterResize))

  // Tablet width grid
  const tablet = await browser.newPage({ viewport: { width: 900, height: 1000 } })
  await tablet.goto(URL, { waitUntil: 'networkidle' })
  await tablet.waitForTimeout(1400)
  const tabletState = await tablet.evaluate(() => {
    const track = document.querySelector('.features-grid')
    return {
      display: getComputedStyle(track).display,
      columns: getComputedStyle(track).gridTemplateColumns,
      className: document.querySelector('.features').className,
      pinSpacers: document.querySelectorAll('.pin-spacer').length,
      overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
    }
  })
  console.log('TABLET 900', JSON.stringify(tabletState))

  console.log('ERRORS', JSON.stringify(errors))
  await browser.close()
})()
