/**
 * This is an advanced example for creating icon bundles for Iconify SVG Framework.
 *
 * It creates a bundle from:
 * - All SVG files in a directory.
 * - Custom JSON files.
 * - Iconify icon sets.
 * - SVG framework.
 *
 * This example uses Iconify Tools to import and clean up icons.
 * For Iconify Tools documentation visit https://docs.iconify.design/tools/tools2/
 */
import { promises as fs } from 'node:fs'
import { dirname, join } from 'node:path'

// Installation: npm install --save-dev @iconify/tools @iconify/utils @iconify/json @iconify/iconify
import { cleanupSVG, importDirectory, isEmptyColor, parseColors, runSVGO } from '@iconify/tools'
import type { IconifyJSON } from '@iconify/types'
import { getIcons, getIconsCSS, stringToIcon } from '@iconify/utils'

/**
 * Script configuration
 */
interface BundleScriptCustomSVGConfig {
  // eslint-disable-next-line lines-around-comment
  // Path to SVG files
  dir: string

  // True if icons should be treated as monotone: colors replaced with currentColor
  monotone: boolean

  // Icon set prefix
  prefix: string
}

interface BundleScriptCustomJSONConfig {
  // eslint-disable-next-line lines-around-comment
  // Path to JSON file
  filename: string

  // List of icons to import. If missing, all icons will be imported
  icons?: string[]
}

interface BundleScriptConfig {
  // eslint-disable-next-line lines-around-comment
  // Custom SVG to import and bundle
  svg?: BundleScriptCustomSVGConfig[]

  // Icons to bundled from @iconify/json packages
  icons?: string[]

  // List of JSON files to bundled
  // Entry can be a string, pointing to filename or a BundleScriptCustomJSONConfig object (see type above)
  // If entry is a string or object without 'icons' property, an entire JSON file will be bundled
  json?: (string | BundleScriptCustomJSONConfig)[]
}

const sources: BundleScriptConfig = {
  json: [
    // Only include the icons actually used in the codebase (found via scripts/find-used-icons.ts)
    // This reduces the CSS bundle from ~1.4 MB to ~50-80 KB, eliminating render-blocking
    {
      filename: require.resolve('@iconify/json/json/ri.json'),
      icons: [
        'account-circle-line',
        'add-box-line',
        'add-line',
        'ai-generate',
        'alert-line',
        'align-center',
        'align-justify',
        'align-left',
        'align-right',
        'angularjs-line',
        'apps-line',
        'arrow-down-line',
        'arrow-down-s-line',
        'arrow-go-back-line',
        'arrow-go-forward-line',
        'arrow-left-s-line',
        'arrow-right-s-line',
        'arrow-up-line',
        'arrow-up-s-line',
        'article-line',
        'bank-card-line',
        'bar-chart-2-line',
        'bar-chart-box-line',
        'bar-chart-grouped-line',
        'bar-chart-line',
        'bill-line',
        'bold',
        'book-line',
        'book-open-line',
        'briefcase-line',
        'building-4-line',
        'calendar-check-line',
        'calendar-line',
        'calendar-schedule-fill',
        'car-line',
        'check-fill',
        'check-line',
        'checkbox-circle-fill',
        'checkbox-circle-line',
        'checkbox-line',
        'checkbox-multiple-line',
        'circle-fill',
        'circle-line',
        'close-circle-fill',
        'close-circle-line',
        'close-fill',
        'close-line',
        'code-box-line',
        'code-s-line',
        'computer-line',
        'corner-down-left-line',
        'delete-bin-2-fill',
        'delete-bin-6-line',
        'delete-bin-7-line',
        'delete-bin-line',
        'device-line',
        'double-quotes-l',
        'download-2-line',
        'drag-drop-line',
        'edit-2-fill',
        'edit-line',
        'equalizer-2-line',
        'equalizer-line',
        'error-warning-line',
        'external-link-line',
        'eye-line',
        'eye-off-line',
        'facebook-fill',
        'file-2-line',
        'file-add-line',
        'file-chart-line',
        'file-copy-line',
        'file-edit-line',
        'file-excel-2-line',
        'file-forbid-line',
        'file-image-line',
        'file-info-line',
        'file-line',
        'file-list-2-line',
        'file-list-3-line',
        'file-list-line',
        'file-pdf-line',
        'file-text-line',
        'file-upload-line',
        'file-user-line',
        'flag-line',
        'folder-2-line',
        'folder-6-line',
        'folder-line',
        'fullscreen-exit-line',
        'function-line',
        'gift-line',
        'git-commit-line',
        'github-fill',
        'google-fill',
        'graduation-cap-line',
        'grid-line',
        'group-line',
        'handbag-line',
        'home-smile-line',
        'image-line',
        'inbox-archive-line',
        'inbox-line',
        'info-i',
        'information-line',
        'input-field',
        'italic',
        'key-line',
        'layout-4-line',
        'layout-grid-line',
        'layout-left-line',
        'lifebuoy-line',
        'line-chart-line',
        'link',
        'linkedin-fill',
        'list-check',
        'list-ordered',
        'list-radio',
        'list-unordered',
        'lock-2-line',
        'lock-line',
        'lock-password-line',
        'lock-unlock-line',
        'login-box-line',
        'logout-box-r-line',
        'loop-right-line',
        'macbook-line',
        'mail-check-line',
        'mail-line',
        'mail-open-line',
        'menu-2-line',
        'menu-add-line',
        'menu-line',
        'menu-search-line',
        'message-3-line',
        'message-line',
        'money-dollar-circle-line',
        'moon-clear-line',
        'more-2-line',
        'more-line',
        'notification-2-line',
        'notification-badge-line',
        'pages-line',
        'palette-line',
        'pantone-line',
        'pencil-line',
        'phone-line',
        'pie-chart-2-line',
        'play-circle-line',
        'play-list-line',
        'printer-line',
        'progress-3-line',
        'question-line',
        'radio-button-line',
        'reactjs-line',
        'rectangle-line',
        'refresh-line',
        'remixicon-line',
        'route-line',
        'search-line',
        'settings-2-line',
        'settings-4-line',
        'settings-5-line',
        'shadow-line',
        'shield-check-line',
        'shield-keyhole-line',
        'shield-user-line',
        'shopping-bag-3-line',
        'shopping-cart-2-line',
        'shopping-cart-line',
        'skip-right-line',
        'slideshow-4-line',
        'smartphone-line',
        'square-line',
        'stack-line',
        'star-fill',
        'star-line',
        'star-smile-line',
        'strikethrough',
        'sun-line',
        'survey-line',
        'table-2',
        'table-alt-line',
        'tablet-line',
        'text',
        'text-snippet',
        'time-line',
        'timeline-view',
        'toggle-line',
        'translate-2',
        'truck-line',
        'tv-2-line',
        'twitter-fill',
        'underline',
        'upload-2-line',
        'upload-cloud-2-fill',
        'user-3-line',
        'user-add-fill',
        'user-add-line',
        'user-forbid-line',
        'user-line',
        'user-settings-line',
        'user-star-line',
        'vip-crown-line',
        'wechat-line',
        'men-fill',
        'men-line',
        'women-fill',
        'women-line'
      ]
    },
    {
      filename: require.resolve('@iconify/json/json/bi.json'),
      icons: ['download', 'file-earmark-image-fill']
    }
  ],

  /* icons: [
    'bx-basket',
    'bi-airplane-engines',
    'tabler-anchor',
    'uit-adobe-alt',

    // 'fa6-regular-comment',
    'twemoji-auto-rickshaw'
  ], */

  svg: [
    {
      dir: 'src/assets/iconify-icons/svg',
      monotone: false,
      prefix: 'custom'
    }

    /* {
      dir: 'src/assets/iconify-icons/emojis',
      monotone: false,
      prefix: 'emoji'
    } */
  ]
}

// File to save bundle to
const target = join(__dirname, 'generated-icons.css')

/**
 * Do stuff!
 */

;(async function () {
  // Create directory for output if missing
  const dir = dirname(target)

  try {
    await fs.mkdir(dir, {
      recursive: true
    })
  } catch (err) {
    //
  }

  const allIcons: IconifyJSON[] = []

  /**
   * Convert sources.icons to sources.json
   */
  if (sources.icons) {
    const sourcesJSON = sources.json ? sources.json : (sources.json = [])

    // Sort icons by prefix
    const organizedList = organizeIconsList(sources.icons)

    for (const prefix in organizedList) {
      const filename = require.resolve(`@iconify/json/json/${prefix}.json`)

      sourcesJSON.push({
        filename,
        icons: organizedList[prefix]
      })
    }
  }

  /**
   * Bundle JSON files and collect icons
   */
  if (sources.json) {
    for (let i = 0; i < sources.json.length; i++) {
      const item = sources.json[i]

      // Load icon set
      const filename = typeof item === 'string' ? item : item.filename
      const content = JSON.parse(await fs.readFile(filename, 'utf8')) as IconifyJSON

      // Filter icons
      if (typeof item !== 'string' && item.icons?.length) {
        const filteredContent = getIcons(content, item.icons)

        if (!filteredContent) throw new Error(`Cannot find required icons in ${filename}`)

        // Collect filtered icons
        allIcons.push(filteredContent)
      } else {
        // Collect all icons from the JSON file
        allIcons.push(content)
      }
    }
  }

  /**
   * Bundle custom SVG icons and collect icons
   */
  if (sources.svg) {
    for (let i = 0; i < sources.svg.length; i++) {
      const source = sources.svg[i]

      // Import icons
      const iconSet = await importDirectory(source.dir, {
        prefix: source.prefix
      })

      // Validate, clean up, fix palette, etc.
      await iconSet.forEach(async (name, type) => {
        if (type !== 'icon') return

        // Get SVG instance for parsing
        const svg = iconSet.toSVG(name)

        if (!svg) {
          // Invalid icon
          iconSet.remove(name)

          return
        }

        // Clean up and optimise icons
        try {
          // Clean up icon code
          await cleanupSVG(svg)

          if (source.monotone) {
            // Replace color with currentColor, add if missing
            // If icon is not monotone, remove this code
            await parseColors(svg, {
              defaultColor: 'currentColor',
              callback: (attr, colorStr, color) => {
                return !color || isEmptyColor(color) ? colorStr : 'currentColor'
              }
            })
          }

          // Optimise
          await runSVGO(svg)
        } catch (err) {
          // Invalid icon
          console.error(`Error parsing ${name} from ${source.dir}:`, err)
          iconSet.remove(name)

          return
        }

        // Update icon from SVG instance
        iconSet.fromSVG(name, svg)
      })

      // Collect the SVG icon
      allIcons.push(iconSet.export())
    }
  }

  // Generate CSS from collected icons
  const cssContent = allIcons
    .map(iconSet => getIconsCSS(iconSet, Object.keys(iconSet.icons), { iconSelector: '.{prefix}-{name}' }))
    .join('\n')

  // Save the CSS to a file
  await fs.writeFile(target, cssContent, 'utf8')
})().catch(err => {
  console.error(err)
})

/**
 * Sort icon names by prefix
 */
function organizeIconsList(icons: string[]): Record<string, string[]> {
  const sorted: Record<string, string[]> = Object.create(null)

  icons.forEach(icon => {
    const item = stringToIcon(icon)

    if (!item) return

    const prefix = item.prefix
    const prefixList = sorted[prefix] ? sorted[prefix] : (sorted[prefix] = [])

    const name = item.name

    if (!prefixList.includes(name)) prefixList.push(name)
  })

  return sorted
}
