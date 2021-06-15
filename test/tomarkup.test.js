const tomarkup = require('../index.js')

function flatten(str) {
  return str.split('\n').join('')
}

test('make HTML from markdown with default highlight', () => {
  const result = tomarkup()('test/data/file1.md')
  expect(flatten(result.html)).toBe(`<h1 id=\"hello\">Hello</h1><pre><code class=\"language-js\"><span class=\"token console class-name\">console</span><span class=\"token punctuation\">.</span><span class=\"token method function property-access\">log</span><span class=\"token punctuation\">(</span><span class=\"token punctuation\">)</span></code></pre>`)
})

test('make HTML from markdown without highlight', () => {
  const result = tomarkup({ highlight: false })('test/data/file1.md')
  expect(flatten(result.html)).toBe(`<h1 id="hello">Hello</h1><pre><code class="language-js">console.log()</code></pre>`)
})

test('make HTML from markdown with mustache data', () => {
  const result = tomarkup({ highlight: false })('test/data/file2.md', { hello: 'bye' })
  expect(flatten(result.html)).toBe(`<p>bye</p>`)
})

test('make HTML from html with mustache data', () => {
  const result = tomarkup({ highlight: false })('test/data/file3.html', { hello: 'bye' })
  expect(flatten(result.html)).toBe(`<h1>bye</h1>`)
})

test('make HTML with smileys', () => {
  const result = tomarkup()('test/data/file4.md')
  expect(flatten(result.html)).toBe('<p>😃</p>')
})

test('should work with youtube videos', () => {
  const result = tomarkup()('test/data/file5.md')
  expect(flatten(result.html)).toBe(`<p>Hello, check this video out:</p><div class=\"video-embed\"><iframe class=\"video\" src=\"https://www.youtube.com/embed/j800SVeiS5I\" allowfullscreen></iframe></div>`)
})

test('should work with vimeo videos', () => {
  const result = tomarkup()('test/data/file6.md')
  expect(flatten(result.html)).toBe(`<p>Hello, check this video out:</p><div class=\"video-embed\"><iframe class=\"video\" src=\"//player.vimeo.com/video/306487511\" allowfullscreen></iframe></div>`)
})

test('should extract data and content', () => {
  const { html, data } = tomarkup()('test/data/file7.md')
  expect(data.title).toBe('shadow')
  expect(data.description).toBe('nice')
  expect(data.published).toEqual(true)
  expect(data.hits).toEqual(66)
  expect(typeof data.published_at.getDate).toBe('function')
  expect(flatten(html)).toBe('<p>Hello</p>')
})

test('should work with highlight', () => {
  const result = tomarkup()('```\nconsole.log()\n```')
  expect(result).toBeDefined()
})
