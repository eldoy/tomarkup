const fs = require('fs')
const path = require('path')
const marked = require('marked')
const hljs = require('highlight.js')
const mustache = require('mustache')
const emoji = require('node-emoji')

function strip(str) {
  return str.split('\n').map(line => line.trim()).join('\n')
}

module.exports = function(options = {}) {
  if (options.highlight !== false) {
    options.highlight = function(code, language) {
      language = hljs.getLanguage(language) ? language : 'plaintext'
      return hljs.highlight(language, code).value
    }
  }
  marked.setOptions(options)

  return function(content, data) {
    const ext = path.extname(content)
    if (['.html', '.md'].includes(ext)) {
      const file = path.join(process.cwd(), content)
      if (fs.existsSync(file)) {
        content = fs.readFileSync(file, 'utf8')
      }
    }
    content = strip(content)
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
