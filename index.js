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

function readfile(name) {
  if (['.html', '.md'].includes(path.extname(name))) {
    const file = path.join(process.cwd(), name)
    if (fs.existsSync(file)) {
      return fs.readFileSync(file, 'utf8')
    }
  }
  return ''
}

module.exports = function (options = {}) {
  options = { ...DEFAULT_OPTIONS, ...options }
  marked.setOptions(options)

  return function (html, params) {
    if (options.file) {
      html = readfile(html)
    }

    // Extract front matter data
    let data = {}
    if (options.data) {
      ;({ html, data } = brainmatter(html))
    }
    let md = html
    if (options.emoji) html = emoji.emojify(html)
    if (options.video) html = video(html)
    if (options.markdown) html = marked(html)
    if (params) html = mustache.render(html, params)

    return { html, data, md }
  }
}
