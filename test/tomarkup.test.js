const tomarkup = require('../index.js')

function flatten(str) {
  return str.split('\n').join('')
}

test('make HTML from markdown with default highlight', () => {
  const result = tomarkup()('test/data/file1.md')
  expect(flatten(result)).toEqual(`<h1 id="hello">Hello</h1><pre><code class="language-js"><span class="hljs-built_in">console</span>.log()</code></pre>`)
})

test('make HTML from markdown without highlight', () => {
  const result = tomarkup({ highlight: false })('test/data/file1.md')
  expect(flatten(result)).toEqual(`<h1 id="hello">Hello</h1><pre><code class="language-js">console.log()</code></pre>`)
})

test('make HTML from markdown with mustache data', () => {
  const result = tomarkup({ highlight: false })('test/data/file2.md', { hello: 'bye' })
  expect(flatten(result)).toEqual(`<p>bye</p>`)
})

test('make HTML from html with mustache data', () => {
  const result = tomarkup({ highlight: false })('test/data/file3.html', { hello: 'bye' })
  expect(flatten(result)).toEqual(`<h1>bye</h1>`)
})
