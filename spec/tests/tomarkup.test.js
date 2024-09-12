var tomarkup = require('../../index.js')

function flatten(str) {
  return str.split('\n').join('')
}

it('make HTML from markdown with default highlight', ({ t }) => {
  var result = tomarkup()('spec/data/file1.md')
  t.equal(
    flatten(result.html),
    `<h1 id=\"hello\">Hello</h1><pre><code class=\"language-js\"><span class=\"token console class-name\">console</span><span class=\"token punctuation\">.</span><span class=\"token method function property-access\">log</span><span class=\"token punctuation\">(</span><span class=\"token punctuation\">)</span></code></pre>`
  )
})

it('make HTML from markdown without highlight', ({ t }) => {
  var result = tomarkup({ highlight: false })('spec/data/file1.md')
  t.equal(
    flatten(result.html),
    `<h1 id="hello">Hello</h1><pre><code class="language-js">console.log()</code></pre>`
  )
})

it('make HTML from markdown with mustache data', ({ t }) => {
  var result = tomarkup({ highlight: false })('spec/data/file2.md', {
    hello: 'bye'
  })
  t.equal(flatten(result.html), `<p>bye</p>`)
})

it('make HTML from html with mustache data', ({ t }) => {
  var result = tomarkup({ highlight: false })('spec/data/file3.html', {
    hello: 'bye'
  })
  t.equal(flatten(result.html), `<h1>bye</h1>`)
})

it('make HTML with smileys', ({ t }) => {
  var result = tomarkup()('spec/data/file4.md')
  t.equal(flatten(result.html), '<p>😃</p>')
})

it('should work with youtube videos', ({ t }) => {
  var result = tomarkup()('spec/data/file5.md')
  t.equal(
    flatten(result.html),
    `<p>Hello, check this video out:</p><div class=\"video-embed\"><iframe class=\"video\" src=\"https://www.youtube.com/embed/j800SVeiS5I\" allowfullscreen></iframe></div>`
  )
})

it('should work with vimeo videos', ({ t }) => {
  var result = tomarkup()('spec/data/file6.md')
  t.equal(
    flatten(result.html),
    `<p>Hello, check this video out:</p><div class=\"video-embed\"><iframe class=\"video\" src=\"//player.vimeo.com/video/306487511\" allowfullscreen></iframe></div>`
  )
})

it('should extract data and content', ({ t }) => {
  var { html, data } = tomarkup()('spec/data/file7.md')
  t.equal(data.title, 'shadow')
  t.equal(data.description, 'nice')
  t.equal(data.published, true)
  t.equal(data.hits, 66)
  t.equal(typeof data.published_at.getDate, 'function')
  t.equal(flatten(html), '<p>Hello</p>')
})

it('should work with highlight', ({ t }) => {
  var result = tomarkup()('```\nconsole.log()\n```')
  t.ok(!!result)

  var result2 = tomarkup()('```asdf\nconsole.log()\n```')
  t.ok(!!result2)

  var result3 = tomarkup()('```js\nconsole.log()\n```')
  t.ok(!!result3)
})
