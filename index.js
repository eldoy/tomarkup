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

const ytx = /!\[.*\]\((https?:\/\/)?(www.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/watch\?feature=player_embedded&v=)([A-Za-z0-9_-]*)(\&\S+)?(\?\S+)?\)/

const vtx = /!\[.*\]\(https?:\/\/(www.)?vimeo\.com\/([A-Za-z0-9._%-]*)((\?|#)\S+)?\)/

function markup(src) {
  return `<div class="video-embed"><iframe class="video" src="${src}" allowfullscreen></iframe></div>`
}

function video(content) {
  let match
  while(match = ytx.exec(content)) {
    const src = `https://www.youtube.com/embed/${match[4]}`
    content = content.replace(match[0], markup(src))
  }
  while(match = vtx.exec(content)) {
    const src= `//player.vimeo.com/video/${match[2]}`
    content = content.replace(match[0], markup(src))
  }
  return content
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
    content = video(content)

    if (ext !== '.html') content = marked(content)
    if (data) content = mustache.render(content, data)

    return { content }
  }
}
