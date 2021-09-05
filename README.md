# Tomarkup

This library makes it easy to convert markdown to html.

Features:

* Github flavored Markdown to HTML, raw text and files
* Converts youtube and vimeo video links to iframes
* Mustache support for template data
* Automatic highlight code syntax
* Emoji support
* "Front matter" support

Based on [marked.js](https://github.com/markedjs/marked), [mustache](https://github.com/janl/mustache.js), [node-emoji](https://github.com/omnidan/node-emoji) and [prismjs.](https://github.com/PrismJS/prism)

### Install
```bash
npm i tomarkup
```

### Usage
```js
const tomarkup = require('tomarkup')

// marked.js options
const formatter = tomarkup({ highlight: false })

// Convert file
const formatter = tomarkup({ file: true })
const { html } = formatter('file.md')

// Convert file with params
const formatter = tomarkup({ file: true })
const { html } = formatter('file.md', { hello: 'waveorb' })

// Convert markdown content with params
const { html } = formatter('# Hello', { hello: 'waveorb' })

// Convert html with params
const { html } = formatter('file.html', { hello: 'waveorb' })

// Extract HTML, data and markdown
const { html, data, md } = formatter('file.md')
```

MIT Licensed. Enjoy!
