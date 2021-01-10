# Tomarkup

This library makes it easy to convert markdown to html.

Features:

* Github flavored Markdown to HTML, raw text and files
* Mustache support for template data
* Automatic highlight code syntax
* Emoji support

Based on [marked.js](https://github.com/markedjs/marked), [mustache](https://github.com/janl/mustache.js), [node-emoji](https://github.com/omnidan/node-emoji) and [highlight.js.](https://github.com/highlightjs/highlight.js)

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
const html = formatter('file.md')

// Convert file with data
const html = formatter('file.md', { hello: 'waveorb' })

// Convert markdown content with data
const html = formatter('# Hello', { hello: 'waveorb' })

// Convert html with data
const html = formatter('file.html', { hello: 'waveorb' })
```

MIT Licensed. Enjoy!
