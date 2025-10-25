import { chromium } from 'playwright'
import * as fs from 'fs'
import * as path from 'path'

interface ColorAnalysis {
  name: string
  color: string
  usage: string
}

interface DesignInsights {
  colors: ColorAnalysis[]
  typography: {
    fontFamilies: string[]
    headingSizes: string[]
  }
  layout: string[]
  components: string[]
  spacing: string[]
  animations: string[]
}

async function analyzeNomads() {
  const browser = await chromium.launch()
  const page = await browser.newPage()

  console.log('🔍 Analyzing nomads.com...\n')

  // Visit homepage
  await page.goto('https://nomads.com', { waitUntil: 'networkidle' })

  // Wait for content to load
  await page.waitForTimeout(2000)

  // Take screenshots
  const screenshotDir = path.join(process.cwd(), 'design-analysis')
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true })
  }

  await page.screenshot({ path: path.join(screenshotDir, 'nomads-homepage.png') })
  console.log('✓ Screenshot saved: nomads-homepage.png')

  // Extract colors using CSS
  const colors = await page.evaluate(() => {
    const elements = document.querySelectorAll('*')
    const colorSet = new Set<string>()

    elements.forEach(el => {
      const computed = window.getComputedStyle(el)
      const bgColor = computed.backgroundColor
      const color = computed.color
      const borderColor = computed.borderColor

      if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)') colorSet.add(`bg: ${bgColor}`)
      if (color && color !== 'rgba(0, 0, 0, 0)') colorSet.add(`text: ${color}`)
      if (borderColor && borderColor !== 'rgba(0, 0, 0, 0)') colorSet.add(`border: ${borderColor}`)
    })

    return Array.from(colorSet).slice(0, 30)
  })

  console.log('\n🎨 Colors detected:')
  colors.forEach(c => console.log('  ' + c))

  // Extract typography
  const typography = await page.evaluate(() => {
    const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, span')
    const fonts = new Set<string>()
    const sizes = new Set<string>()

    elements.forEach(el => {
      const computed = window.getComputedStyle(el)
      const fontFamily = computed.fontFamily
      const fontSize = computed.fontSize

      if (fontFamily) fonts.add(fontFamily)
      if (fontSize) sizes.add(`${el.tagName}: ${fontSize}`)
    })

    return {
      fonts: Array.from(fonts),
      sizes: Array.from(sizes).slice(0, 15)
    }
  })

  console.log('\n📝 Typography:')
  console.log('  Fonts:', typography.fonts.slice(0, 3).join(', '))
  console.log('  Sizes:')
  typography.sizes.forEach(s => console.log('    ' + s))

  // Analyze layout structure
  const layoutAnalysis = await page.evaluate(() => {
    const header = document.querySelector('header')
    const nav = document.querySelector('nav')
    const main = document.querySelector('main')
    const footer = document.querySelector('footer')

    return {
      hasHeader: !!header,
      hasNav: !!nav,
      hasMain: !!main,
      hasFooter: !!footer,
      headerHeight: header?.getBoundingClientRect().height || 0,
      footerHeight: footer?.getBoundingClientRect().height || 0
    }
  })

  console.log('\n📐 Layout Structure:')
  console.log(`  Has Header: ${layoutAnalysis.hasHeader} (height: ${layoutAnalysis.headerHeight}px)`)
  console.log(`  Has Navigation: ${layoutAnalysis.hasNav}`)
  console.log(`  Has Main Content: ${layoutAnalysis.hasMain}`)
  console.log(`  Has Footer: ${layoutAnalysis.hasFooter} (height: ${layoutAnalysis.footerHeight}px)`)

  // Analyze cards/components
  const components = await page.evaluate(() => {
    const cards = document.querySelectorAll('[class*="card"], [class*="Card"], article, section > div')
    const cardCount = cards.length

    // Get first card to analyze
    const firstCard = cards[0] as HTMLElement
    if (!firstCard) return { count: 0, structure: 'No cards found' }

    const computed = window.getComputedStyle(firstCard)
    return {
      count: cardCount,
      borderRadius: computed.borderRadius,
      boxShadow: computed.boxShadow,
      hasGradient: computed.background.includes('gradient')
    }
  })

  console.log('\n🎴 Components:')
  console.log(`  Card Count: ${components.count}`)
  console.log(`  Border Radius: ${components.borderRadius}`)
  console.log(`  Box Shadow: ${components.boxShadow}`)
  console.log(`  Uses Gradients: ${components.hasGradient}`)

  // Scroll and capture more sections
  await page.evaluate(() => window.scrollBy(0, 300))
  await page.waitForTimeout(500)
  await page.screenshot({ path: path.join(screenshotDir, 'nomads-middle.png') })
  console.log('\n✓ Screenshot saved: nomads-middle.png')

  await page.evaluate(() => window.scrollBy(0, 300))
  await page.waitForTimeout(500)
  await page.screenshot({ path: path.join(screenshotDir, 'nomads-footer.png') })
  console.log('✓ Screenshot saved: nomads-footer.png')

  // Generate design recommendations
  const recommendations = {
    colors: [
      '• Use a modern color palette with primary, secondary, and accent colors',
      '• Implement consistent color usage across all components',
      '• Consider dark/light mode support for accessibility'
    ],
    typography: [
      '• Use modern sans-serif fonts for better readability',
      '• Maintain clear hierarchy with distinct heading sizes',
      '• Ensure sufficient contrast ratios for accessibility'
    ],
    layout: [
      '• Implement responsive grid-based layout',
      '• Use consistent spacing and padding',
      '• Create clear visual hierarchy with whitespace'
    ],
    components: [
      '• Design reusable card components',
      '• Implement hover/interactive states',
      '• Use smooth transitions and animations'
    ]
  }

  console.log('\n💡 Design Recommendations:')
  Object.entries(recommendations).forEach(([category, items]) => {
    console.log(`\n  ${category.toUpperCase()}:`)
    items.forEach(item => console.log('    ' + item))
  })

  // Save detailed report
  const report = {
    timestamp: new Date().toISOString(),
    url: 'https://nomads.com',
    colors: colors.slice(0, 15),
    typography,
    layout: layoutAnalysis,
    components,
    recommendations
  }

  fs.writeFileSync(
    path.join(screenshotDir, 'design-report.json'),
    JSON.stringify(report, null, 2)
  )
  console.log('\n✓ Design report saved: design-report.json')

  await browser.close()
  console.log('\n✅ Analysis complete!')
}

analyzeNomads().catch(console.error)
