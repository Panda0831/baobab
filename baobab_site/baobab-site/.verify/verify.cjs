const { chromium } = require('playwright-core')
const fs = require('fs')
const path = require('path')

const EXEC = '/home/denver/.cache/ms-playwright/chromium-1255/chrome-linux64/chrome'
const URL = 'http://127.0.0.1:5178/'
const OUT = path.join(__dirname, 'shots')
fs.mkdirSync(OUT, { recursive: true })

async function scrollTo(page, selector, offset = 0) {
  await page.evaluate(
    ([sel, off]) => {
      const el = document.querySelector(sel)
      if (!el) return
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + off, behavior: 'instant' })
    },
    [selector, offset],
  )
  await page.waitForTimeout(1400)
}

async function state(page) {
  return page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.feature-card'))
    const track = document.querySelector('.features-grid')
    const wrap = document.querySelector('.features-track-wrap')
    const firstPortrait = document.querySelector('.member-portrait')
    return {
      y: Math.round(window.scrollY),
      docHeight: document.documentElement.scrollHeight,
      overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
      featuresClass: document.querySelector('.features')?.className,
      featuresPinned: Boolean(document.querySelector('.pin-spacer')),
      trackTransform: track ? getComputedStyle(track).transform : null,
      trackLeft: track ? Math.round(track.getBoundingClientRect().left) : null,
      trackWidth: track ? Math.round(track.getBoundingClientRect().width) : null,
      wrapWidth: wrap ? Math.round(wrap.getBoundingClientRect().width) : null,
      cardOpacity: cards.map((c) => Number(getComputedStyle(c).opacity).toFixed(2)),
      cardRects: cards.map((c) => Math.round(c.getBoundingClientRect().left)),
      portraitClip: firstPortrait ? getComputedStyle(firstPortrait).clipPath : null,
      platformPinned: Boolean(document.querySelector('.platform.is-pinned')),
      platformHeight: document.querySelector('.platform')?.getBoundingClientRect().height,
    }
  })
}

;(async () => {
  const browser = await chromium.launch({ executablePath: EXEC, args: ['--no-sandbox'] })
  const errors = []
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message))
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push('console: ' + m.text())
  })

  await page.goto(URL, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1800)

  console.log('LOAD', JSON.stringify(await state(page)))
  await page.screenshot({ path: path.join(OUT, '01-hero.png') })

  await page.evaluate(() => window.scrollTo({ top: 420, behavior: 'instant' }))
  await page.waitForTimeout(1000)
  await page.screenshot({ path: path.join(OUT, '02-hero-scroll.png') })

  await scrollTo(page, '#services', -80)
  await page.screenshot({ path: path.join(OUT, '03-services-top.png') })
  console.log('SERVICES TOP', JSON.stringify(await state(page)))

  const serviceTop = await page.evaluate(() => window.scrollY)
  await page.evaluate((y) => window.scrollTo({ top: y + 420, behavior: 'instant' }), serviceTop)
  await page.waitForTimeout(1500)
  await page.screenshot({ path: path.join(OUT, '04-services-mid.png') })
  console.log('SERVICES MID', JSON.stringify(await state(page)))

  await page.evaluate((y) => window.scrollTo({ top: y + 900, behavior: 'instant' }), serviceTop)
  await page.waitForTimeout(1500)
  await page.screenshot({ path: path.join(OUT, '05-services-end.png') })
  console.log('SERVICES END', JSON.stringify(await state(page)))

  await scrollTo(page, '#plateforme', 0)
  await page.waitForTimeout(400)
  await page.screenshot({ path: path.join(OUT, '06-platform-start.png') })
  const platformTop = await page.evaluate(() => window.scrollY)
  await page.evaluate((y) => window.scrollTo({ top: y + 900, behavior: 'instant' }), platformTop)
  await page.waitForTimeout(1600)
  await page.screenshot({ path: path.join(OUT, '07-platform-mid.png') })
  console.log('PLATFORM MID', JSON.stringify(await state(page)))
  await page.evaluate((y) => window.scrollTo({ top: y + 1900, behavior: 'instant' }), platformTop)
  await page.waitForTimeout(1600)
  await page.screenshot({ path: path.join(OUT, '08-platform-end.png') })

  await scrollTo(page, '#about', -60)
  await page.waitForTimeout(600)
  await page.screenshot({ path: path.join(OUT, '09-about.png') })
  await page.evaluate(() => window.scrollBy({ top: 520, behavior: 'instant' }))
  await page.waitForTimeout(1400)
  await page.screenshot({ path: path.join(OUT, '10-about-artwork.png') })

  await scrollTo(page, '#methode', -60)
  await page.screenshot({ path: path.join(OUT, '11-process.png') })

  await scrollTo(page, '#equipe', -60)
  await page.screenshot({ path: path.join(OUT, '12-team.png') })
  console.log('TEAM', JSON.stringify(await state(page)))

  await scrollTo(page, '#faq', -60)
  await page.screenshot({ path: path.join(OUT, '13-faq.png') })

  await scrollTo(page, '#contact', -60)
  await page.screenshot({ path: path.join(OUT, '14-contact.png') })
  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }))
  await page.waitForTimeout(1200)
  await page.screenshot({ path: path.join(OUT, '15-footer.png') })

  // Mobile
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
  mobile.on('pageerror', (e) => errors.push('mobile pageerror: ' + e.message))
  await mobile.goto(URL, { waitUntil: 'networkidle' })
  await mobile.waitForTimeout(1500)
  await scrollTo(mobile, '#services', -40)
  await mobile.screenshot({ path: path.join(OUT, '20-mobile-services.png') })
  console.log('MOBILE SERVICES', JSON.stringify(await state(mobile)))
  await scrollTo(mobile, '#equipe', -40)
  await mobile.screenshot({ path: path.join(OUT, '21-mobile-team.png') })
  console.log('MOBILE TEAM', JSON.stringify(await state(mobile)))

  // Reduced motion
  const calm = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
  calm.on('pageerror', (e) => errors.push('calm pageerror: ' + e.message))
  await calm.goto(URL, { waitUntil: 'networkidle' })
  await calm.waitForTimeout(1200)
  const calmState = await calm.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.feature-card'))
    const hidden = Array.from(document.querySelectorAll('h2, .hero-lead, .feature-card, .faq-item')).filter(
      (el) => Number(getComputedStyle(el).opacity) < 0.99 || getComputedStyle(el).visibility === 'hidden',
    )
    return {
      featuresClass: document.querySelector('.features')?.className,
      cards: cards.map((c) => ({ opacity: getComputedStyle(c).opacity, rect: Math.round(c.getBoundingClientRect().left) })),
      hiddenCount: hidden.length,
      hidden: hidden.slice(0, 5).map((el) => el.className + '|' + el.tagName + '|' + getComputedStyle(el).opacity),
      overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
    }
  })
  console.log('REDUCED MOTION', JSON.stringify(calmState))
  await calm.screenshot({ path: path.join(OUT, '30-reduced-services.png'), fullPage: false })

  console.log('ERRORS', JSON.stringify(errors, null, 2))
  await browser.close()
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
