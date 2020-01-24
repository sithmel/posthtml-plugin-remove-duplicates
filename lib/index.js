const matchHelper = require('posthtml-match-helper')

const CSS = {
  tag: 'link',
  attr: 'href'
}

const INLINECSS = {
  tag: 'style',
  attr: 'id'
}

const SCRIPT = {
  tag: 'script',
  attr: 'src'
}

function getSelector (obj) {
  return `${obj.tag || ''}[${obj.attr}]`
}

module.exports = function (opts = {}) {
  let selectors = []
  if (opts.css) {
    selectors.push(CSS)
    selectors.push(INLINECSS)
  }
  if (opts.script) {
    selectors.push(SCRIPT)
  }
  if (opts.custom) {
    const custom = Array.isArray(opts.custom) ? opts.custom : [opts.custom]
    selectors = selectors.concat(custom)
  }

  if (selectors.length === 0) {
    throw new Error('Not enough options: use css, script or custom')
  }

  const selStr = selectors.map(getSelector).join(',')

  return function removeDuplicates (tree) {
    const alreadyUsed = {}

    tree.match(matchHelper(selStr), (node) => {
      for (const s of selectors) {
        if ((!!s.tag === false || s.tag === node.tag) && (s.attr in node.attrs)) {
          const key = getSelector(s) + node.attrs[s.attr]
          if (key in alreadyUsed) {
            return null
          }
          alreadyUsed[key] = true
          return node
        }
      }
    })
    return tree
  }
}
