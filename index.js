const fs = require('fs')
const path = require('path')
const mustache = require('mustache')
const emoji = require('node-emoji')
const { marked } = require('marked')
const brainmatter = require('brainmatter')
const prism = require('prismjs')
require('prismjs/components/')()

const DEFAULT_OPTIONS = {
  // Markdown options
  renderer: new marked.Renderer(),
  highlight: function (code, lang) {
    if (!prism.languages.hasOwnProperty(lang)) {
      lang = 'shell'
    }
    return prism.highlight(code, prism.languages[lang])
  },
  pedantic: false,
  gfm: true,
  breaks: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false,

  // Other options
  markdown: true,
  video: true,
  emoji: true,
  data: true,
  file: true
}

const ytx =
  /!\[.*\]\((https?:\/\/)?(www.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/watch\?feature=player_embedded&v=)([A-Za-z0-9_-]*)(\&\S+)?(\?\S+)?\)/

const vtx =
  /!\[.*\]\(https?:\/\/(www.)?vimeo\.com\/([A-Za-z0-9._%-]*)((\?|#)\S+)?\)/

function markup(src) {
  return `<div class="video-embed"><iframe class="video" src="${src}" allowfullscreen></iframe></div>`
}

function video(content) {
  let match
  while ((match = ytx.exec(content))) {
    const src = `https://www.youtube.com/embed/${match[4]}`
    content = content.replace(match[0], markup(src))
  }
  while ((match = vtx.exec(content))) {
    const src = `//player.vimeo.com/video/${match[2]}`
    content = content.replace(match[0], markup(src))
  }
  return content
}

module.exports = function (options = {}) {
  options = { ...DEFAULT_OPTIONS, ...options }
  marked.setOptions(options)

  return function (html, params) {
    let ext = '',
      md = ''
    if (options.file) {
      ext = path.extname(html)
      if (['.html', '.md'].includes(ext)) {
        const file = path.join(process.cwd(), html)
        if (fs.existsSync(file)) {
          html = fs.readFileSync(file, 'utf8')
        } else {
          ext = ''
        }
      }
    }

    // Extract front matter data
    let data
    if (options.data) {
      ;({ html, data } = brainmatter(html))
    }

    if (options.emoji) html = emoji.emojify(html)
    if (options.video) html = video(html)
    if (options.markdown) html = marked(html)
    if (params) html = mustache.render(html, params)

    return { html, data, md }
  }
}
