const fs = require('fs')
const path = require('path')
const mustache = require('mustache')
const emoji = require('node-emoji')
const marked = require('marked')
const prism = require('prismjs')
require('prismjs/components/')()

const markdownOptions = {
  renderer: new marked.Renderer(),
  highlight: function(code, lang = 'md') {
    return prism.highlight(code, prism.languages[lang], lang)
  },
  pedantic: false,
  gfm: true,
  breaks: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false
}

module.exports = function(options = {}) {
  marked.setOptions({ ...markdownOptions, ...options })

  return function(content, data) {
    const ext = path.extname(content)
    if (['.html', '.md'].includes(ext)) {
      const file = path.join(process.cwd(), content)
      if (fs.existsSync(file)) {
        content = fs.readFileSync(file, 'utf8')
      }
    }
    content = emoji.emojify(content)
    if (ext !== '.html') {
      content = marked(content)
    }
    if (data) {
      content = mustache.render(content, data)
    }
    return content
  }
}
