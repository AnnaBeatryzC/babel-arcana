const fs = require('fs')
const path = require('path')
const rdl = require('readline')

const awesomeVersion = '6.4.0'

const styles = [
  'solid',
  'regular',
  'light',
  'thin',
  'duotone',
  'brands',
  'sharp-solid',
  'sharp-regular',
  'sharp-light',
]

const families = [
  'classic',
  'duotone',
  'sharp',
]

const licenses = [
  'free',
  'pro',
]

let indexEsJsCache = {}
let indexJsCache = {}
let pbCursor = 0
let pbSize = 30

function startProgressBar() {
  pbCursor = 0
  pbSize = 30
  process.stdout.write('[')
  for (let i = 0; i < pbSize; i += 1) {
    process.stdout.write('-')
  }
  process.stdout.write(']')
  rdl.cursorTo(process.stdout, pbCursor + 1)
}

function updateProgressBar(percent) {
  const pos = (percent * pbSize) / 100
  while (pbCursor < pos) {
    process.stdout.write('=')
    pbCursor += 1
  }
}

function deleteAllFiles(directory) {
  const files = fs.readdirSync(directory)
  files.forEach(file => {
    if (fs.statSync(path.join(directory, file)).isDirectory()) {
      deleteAllFiles(path.join(directory, file))
    } else {
      fs.unlinkSync(path.join(directory, file))
    }
  })
}

function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1)
}

function camelCase(str) {
  return str
    .split('-')
    .map((s, index) => (
      (index === 0 ? s[0].toLowerCase() : s[0].toUpperCase())
        + s.slice(1).toLowerCase()
    ))
    .join('')
}

function getFullStyleName(family, style) {
  switch (family) {
    case 'classic':
      return style
    case 'duotone':
      return 'duotone'
    case 'sharp':
      return `sharp-${style}`
    default:
      return style
  }
}

function getIconPrefix(style) {
  switch (style) {
    case 'solid':
      return 'fas'
    case 'regular':
      return 'far'
    case 'light':
      return 'fal'
    case 'thin':
      return 'fat'
    case 'duotone':
      return 'fad'
    case 'brands':
      return 'fab'
    case 'sharp-solid':
      return 'fass'
    case 'sharp-regular':
      return 'fasr'
    case 'sharp-light':
      return 'fasl'
    default:
      return ''
  }
}

function isFreeIcon(icon, family, style) {
  let isFree = false
  icon.familyStylesByLicense.free.forEach(it => {
    if ((it.family === family) && (it.style === style)) {
      isFree = true
    }
  })

  return isFree
}

function getModuleName(license, style) {
  return (style.search('sharp-') === 0) ? `${style}-svg-icons` : `${license}-${style}-svg-icons`
}

function getStylesFromIcon(icon) {
  const iconStyles = []
  const alreadyIncluded = []

  icon.familyStylesByLicense.free.forEach(it => {
    const stl = getFullStyleName(it.family, it.style)
    alreadyIncluded.push(stl)
    iconStyles.push({
      style: stl,
      license: 'free',
    })
  })

  icon.familyStylesByLicense.pro.forEach(it => {
    const stl = getFullStyleName(it.family, it.style)
    if (!alreadyIncluded.includes(stl)) {
      iconStyles.push({
        style: stl,
        license: 'pro',
      })
    }
  })

  return iconStyles
}

function createPackageJSON(module) {
  const content = (`${fs.readFileSync(`${__dirname}/metadata/template-package.json`)}`).replace('$$$MODULE_NAME$$$', module).replace('$$$MODULE_VERSION$$$', awesomeVersion)
  fs.appendFileSync(`${__dirname}/${module}/package.json`, content)
}

function startIndexJS(module, style) {
  indexJsCache[module] = []
  const content = `(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global['${module}'] = {})));
}(this, (function (exports) { 'use strict';\n\n  var prefix = "${getIconPrefix(style)}";\n`
  fs.appendFileSync(`${__dirname}/${module}/index.js`, content)
}

function appendIndexJS(module, family, style, icon, iconKey, iconName) {
  indexJsCache[module].push(iconName)
  const content = `  var ${iconName} = {
  prefix: '${getIconPrefix(getFullStyleName(family, style))}',
  iconName: '${iconKey}',
  icon: [${icon.svgs[family][style].width}, ${icon.svgs[family][style].height}, [], "${icon.unicode}", ${Array.isArray(icon.svgs[family][style].path) ? `['${icon.svgs[family][style].path[0]}', '${icon.svgs[family][style].path[1]}']` : `'${icon.svgs[family][style].path}'`}]
  };\n`
  fs.appendFileSync(`${__dirname}/${module}/index.js`, content)
}

function finishIndexJS(module, style) {
  fs.appendFileSync(`${__dirname}/${module}/index.js`, '  var _iconsCache = {\n')
  indexJsCache[module].forEach(iconName => {
    fs.appendFileSync(`${__dirname}/${module}/index.js`, `    ${iconName}: ${iconName},\n`)
  })
  fs.appendFileSync(`${__dirname}/${module}/index.js`, `  };\n\nexports.${getIconPrefix(style)} = _iconsCache;\n  exports.prefix = prefix;\n`)
  indexJsCache[module].forEach(iconName => {
    fs.appendFileSync(`${__dirname}/${module}/index.js`, `  exports.${iconName} = ${iconName};\n`)
  })
  fs.appendFileSync(`${__dirname}/${module}/index.js`, '\n  Object.defineProperty(exports, \'__esModule\', { value: true });\n\n})));\n')
}

function startIndexEsJS(module, style) {
  indexEsJsCache[module] = []
  const content = `var prefix = "${getIconPrefix(style)}";\n`
  fs.appendFileSync(`${__dirname}/${module}/index.es.js`, content)
}

function appendIndexEsJS(module, family, style, icon, iconKey, iconName) {
  indexEsJsCache[module].push(iconName)
  const content = `var ${iconName} = {
  prefix: '${getIconPrefix(getFullStyleName(family, style))}',
  iconName: '${iconKey}',
  icon: [${icon.svgs[family][style].width}, ${icon.svgs[family][style].height}, [], "${icon.unicode}", ${Array.isArray(icon.svgs[family][style].path) ? `['${icon.svgs[family][style].path[0]}', '${icon.svgs[family][style].path[1]}']` : `'${icon.svgs[family][style].path}'`}]
};\n`
  fs.appendFileSync(`${__dirname}/${module}/index.es.js`, content)
}

function finishIndexEsJS(module, style) {
  fs.appendFileSync(`${__dirname}/${module}/index.es.js`, 'var _iconsCache = {\n')
  indexEsJsCache[module].forEach(iconName => {
    fs.appendFileSync(`${__dirname}/${module}/index.es.js`, `  ${iconName}: ${iconName},\n`)
  })
  fs.appendFileSync(`${__dirname}/${module}/index.es.js`, `};\n\nexport { _iconsCache as ${getIconPrefix(style)}, prefix`)
  indexEsJsCache[module].forEach(iconName => {
    fs.appendFileSync(`${__dirname}/${module}/index.es.js`, `, ${iconName}`)
  })
  fs.appendFileSync(`${__dirname}/${module}/index.es.js`, ' };')
}

function appendIndexDTS(module, iconName) {
  const lineContent = `export const ${iconName}: IconDefinition;\n`
  fs.appendFileSync(`${__dirname}/${module}/index.d.ts`, lineContent)
}

function finishIndexDTS(module, style) {
  const content = `import { IconDefinition, IconLookup, IconName, IconPrefix, IconPack } from '@fortawesome/fontawesome-common-types';
export { IconDefinition, IconLookup, IconName, IconPrefix, IconPack } from '@fortawesome/fontawesome-common-types';
export const prefix: IconPrefix;
export const ${getIconPrefix(style)}: IconPack;`
  fs.appendFileSync(`${__dirname}/${module}/index.d.ts`, content)
}

function createIconDTS(module, iconName) {
  const fileContent = `import { IconDefinition, IconPrefix, IconName } from "@fortawesome/fontawesome-common-types";
export const definition: IconDefinition;
export const ${iconName}: IconDefinition;
export const prefix: IconPrefix;
export const iconName: IconName;
export const width: number;
export const height: number;
export const ligatures: string[];
export const unicode: string;
export const svgPathData: string;`

  fs.appendFileSync(`${__dirname}/${module}/${iconName}.d.ts`, fileContent)
}

function createIconJS(module, family, style, icon, iconKey, iconName) {
  const fileContent = `'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var prefix = '${getIconPrefix(getFullStyleName(family, style))}';
var iconName = '${iconKey}';
var width = ${icon.svgs[family][style].width};
var height = ${icon.svgs[family][style].height};
var ligatures = [];
var unicode = '${icon.unicode}';
var svgPathData = ${Array.isArray(icon.svgs[family][style].path) ? `['${icon.svgs[family][style].path[0]}', '${icon.svgs[family][style].path[1]}']` : `'${icon.svgs[family][style].path}'`};

exports.definition = {
  prefix: prefix,
  iconName: iconName,
  icon: [
    width,
    height,
    ligatures,
    unicode,
    svgPathData
  ]};

exports.${iconName} = exports.definition;
exports.prefix = prefix;
exports.iconName = iconName;
exports.width = width;
exports.height = height;
exports.ligatures = ligatures;
exports.unicode = unicode;
exports.svgPathData = svgPathData;`

  fs.appendFileSync(`${__dirname}/${module}/${iconName}.js`, fileContent)
}

function createIcon(license, icon, iconKey, style, family, allFiles) {
  const module = getModuleName(license, getFullStyleName(family, style))
  const iconName = `fa${capitalize(camelCase(iconKey))}`

  if (allFiles) {
    createIconJS(module, family, style, icon, iconKey, iconName)
    createIconDTS(module, iconName)
  }
  appendIndexDTS(module, iconName)
  appendIndexEsJS(module, family, style, icon, iconKey, iconName)
  appendIndexJS(module, family, style, icon, iconKey, iconName)
}

function createIconsModules(icons, allFiles) {
  indexEsJsCache = {}
  indexJsCache = {}

  startProgressBar()
  styles.forEach((s, idx) => {
    licenses.forEach(l => {
      if (!((l === 'free') && ((s === 'light') || (s === 'duotone') || (s === 'thin') || (s === 'sharp-solid') || (s === 'sharp-regular') || (s === 'sharp-light')))) {
        const module = getModuleName(l, s)
        deleteAllFiles(`${__dirname}/${module}`)
        createPackageJSON(module)
        startIndexEsJS(module, s)
        startIndexJS(module, s)
      }
    })
    updateProgressBar((30 * idx) / Object.keys(styles).length)
  })

  Object.keys(icons).forEach((icon, idx) => {
    families.forEach(family => {
      if (Object.keys(icons[icon].svgs).includes(family)) {
        Object.keys(icons[icon].svgs[family]).forEach(style => {
          const license = isFreeIcon(icons[icon], family, style) ? 'free' : 'pro'
          createIcon(license, icons[icon], icon, style, family, allFiles)
        })
      }
    })
    updateProgressBar(30 + (40 * idx) / Object.keys(icons).length)
  })

  styles.forEach((s, idx) => {
    licenses.forEach(l => {
      if (!((l === 'free') && ((s === 'light') || (s === 'duotone') || (s === 'thin') || (s === 'sharp-solid') || (s === 'sharp-regular') || (s === 'sharp-light')))) {
        const module = getModuleName(l, s)
        finishIndexDTS(module, s)
        finishIndexEsJS(module, s)
        finishIndexJS(module, s)
      }
    })
    updateProgressBar(70 + (30 * idx) / Object.keys(styles).length)
  })

  updateProgressBar(100)
  console.log('\nIcons Modules Finished!')
}

function addInArrayOfKey(obj, key, element) {
  if (!Array.isArray(obj[key])) {
    // eslint-disable-next-line no-param-reassign
    obj[key] = []
  }
  obj[key].push(element)
}

function createIndexModuleJS(index) {
  const fileHeader = `(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global['index-svg-icons'] = {})));
  }(this, (function (exports) {
    'use strict';\n\n`

  fs.appendFileSync(`${__dirname}/index-svg-icons/index.js`, `${fileHeader}const category = `)
  fs.appendFileSync(`${__dirname}/index-svg-icons/index.js`, JSON.stringify(index.category, null, 2))

  fs.appendFileSync(`${__dirname}/index-svg-icons/index.js`, ';\n\nconst style = ')
  fs.appendFileSync(`${__dirname}/index-svg-icons/index.js`, JSON.stringify(index.style, null, 2))

  fs.appendFileSync(`${__dirname}/index-svg-icons/index.js`, ';\n\nconst term = ')
  fs.appendFileSync(`${__dirname}/index-svg-icons/index.js`, JSON.stringify(index.term, null, 2))

  fs.appendFileSync(`${__dirname}/index-svg-icons/index.js`, ';\n\nconst license = ')
  fs.appendFileSync(`${__dirname}/index-svg-icons/index.js`, JSON.stringify(index.license, null, 2))

  fs.appendFileSync(`${__dirname}/index-svg-icons/index.js`, ';\n\nconst key = ')
  fs.appendFileSync(`${__dirname}/index-svg-icons/index.js`, JSON.stringify(index.key, null, 2))

  fs.appendFileSync(`${__dirname}/index-svg-icons/index.js`, `;\n\nconst info = {\n  "version": "${awesomeVersion}"\n};`)

  fs.appendFileSync(`${__dirname}/index-svg-icons/index.js`, '\n\nexports.category = category;\nexports.style = style;\nexports.term = term;\nexports.license = license;\nexports.key = key;\nexports.info = info;\n\nObject.defineProperty(exports, \'__esModule\', { value: true });\n\n})));')
}

function createIndexModuleEsJS(index) {
  fs.appendFileSync(`${__dirname}/index-svg-icons/index.es.js`, 'const category = ')
  fs.appendFileSync(`${__dirname}/index-svg-icons/index.es.js`, JSON.stringify(index.category, null, 2))

  fs.appendFileSync(`${__dirname}/index-svg-icons/index.es.js`, ';\n\nconst style = ')
  fs.appendFileSync(`${__dirname}/index-svg-icons/index.es.js`, JSON.stringify(index.style, null, 2))

  fs.appendFileSync(`${__dirname}/index-svg-icons/index.es.js`, ';\n\nconst term = ')
  fs.appendFileSync(`${__dirname}/index-svg-icons/index.es.js`, JSON.stringify(index.term, null, 2))

  fs.appendFileSync(`${__dirname}/index-svg-icons/index.es.js`, ';\n\nconst license = ')
  fs.appendFileSync(`${__dirname}/index-svg-icons/index.es.js`, JSON.stringify(index.license, null, 2))

  fs.appendFileSync(`${__dirname}/index-svg-icons/index.es.js`, ';\n\nconst key = ')
  fs.appendFileSync(`${__dirname}/index-svg-icons/index.es.js`, JSON.stringify(index.key, null, 2))

  fs.appendFileSync(`${__dirname}/index-svg-icons/index.es.js`, `;\n\nconst info = {\n  "version": "${awesomeVersion}"\n};`)

  fs.appendFileSync(`${__dirname}/index-svg-icons/index.es.js`, '\n\nexport{category, style, term, license, key, info};')
}

function createIndexModuleDTS() {

}

function createIndexModule(cats, icons) {
  deleteAllFiles(`${__dirname}/index-svg-icons`)

  const index = {}

  index.category = cats
  index.style = {}
  index.term = {}
  index.license = { free: {}, pro: {} }
  index.key = {}

  startProgressBar()
  Object.keys(icons).forEach((key, idx) => {
    const iconStyles = getStylesFromIcon(icons[key])
    iconStyles.forEach(iss => {
      addInArrayOfKey(index.style, iss.style, key)
      addInArrayOfKey(index.license[iss.license], key, iss.style)
    })

    icons[key].search.terms.forEach(term => {
      addInArrayOfKey(index.term, term, key)
    })

    icons[key].label.trim().toLowerCase().split(' ').forEach(label => {
      label.split('-').forEach(item => {
        addInArrayOfKey(index.term, item, key)
      })
    })

    const icostl = getStylesFromIcon(icons[key])
    const allStyles = []
    const freeStyles = []

    icostl.forEach(it => {
      allStyles.push(it.style)
      if (it.license === 'free') {
        freeStyles.push(it.style)
      }
    })

    index.key[key] = {
      label: icons[key].label,
      styles: allStyles,
      unicode: icons[key].unicode,
      free: freeStyles,
    }

    updateProgressBar((100 * idx) / Object.keys(icons).length)
  })

  const content = (`${fs.readFileSync(`${__dirname}/metadata/template-index-package.json`)}`).replace('$$$MODULE_VERSION$$$', awesomeVersion)
  fs.appendFileSync(`${__dirname}/index-svg-icons/package.json`, content)

  createIndexModuleJS(index)
  createIndexModuleEsJS(index)
  createIndexModuleDTS()

  updateProgressBar(100)
  console.log('\nIndex Module Finished!')
}

function generate(allFiles) {
  const cats = JSON.parse(fs.readFileSync(`${__dirname}/metadata/categories-v${awesomeVersion}.json`))
  const icons = JSON.parse(fs.readFileSync(`${__dirname}/metadata/icons-v${awesomeVersion}.json`))

  console.log(allFiles ? 'Generating allfiles Icons Modules...' : 'Generating Icons Modules...')
  createIconsModules(icons, allFiles)

  console.log('\n\nCreating Index Module...')
  createIndexModule(cats, icons)
}

function clear() {
  console.log('Clearing generated icons files...')

  startProgressBar()
  styles.forEach((s, idx) => {
    licenses.forEach(l => {
      if (!((l === 'free') && ((s === 'light') || (s === 'duotone') || (s === 'thin') || (s === 'sharp-solid') || (s === 'sharp-regular') || (s === 'sharp-light')))) {
        const module = getModuleName(l, s)
        deleteAllFiles(`${__dirname}/${module}`)
      }
    })
    updateProgressBar((98 * idx) / Object.keys(styles).length)
  })
  deleteAllFiles(`${__dirname}/index-svg-icons`)
  updateProgressBar(100)
  console.log('\nClearing finished!')
}

module.exports = { generate, clear }
