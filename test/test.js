'use strict'

const test = require('ava')
const plugin = require('..')
const posthtml = require('posthtml')

const html = `<!doctype html>
<html>
    <body>
      <script defer="" src="/script1.js">script1</script>
      <link rel="stylesheet" type="text/css" href="component.css">
      <div>Component 1 <a href="1.src">link</a></div>
      <img src="img.png">
      <script defer="" src="/script1.js">script1</script>
      <link rel="stylesheet" type="text/css" href="component.css">
      <div>Component 1 <a href="1.src">link</a></div>
      <img src="img.png">
    </body>
</html>`

const nojsnocss = `<!doctype html>
<html>
    <body>
      <script defer="" src="/script1.js">script1</script>
      <link rel="stylesheet" type="text/css" href="component.css">
      <div>Component 1 <a href="1.src">link</a></div>
      <img src="img.png">
      
      
      <div>Component 1 <a href="1.src">link</a></div>
      <img src="img.png">
    </body>
</html>`

const nocss = `<!doctype html>
<html>
    <body>
      <script defer="" src="/script1.js">script1</script>
      <link rel="stylesheet" type="text/css" href="component.css">
      <div>Component 1 <a href="1.src">link</a></div>
      <img src="img.png">
      <script defer="" src="/script1.js">script1</script>
      
      <div>Component 1 <a href="1.src">link</a></div>
      <img src="img.png">
    </body>
</html>`

const nosrc = `<!doctype html>
<html>
    <body>
      <script defer="" src="/script1.js">script1</script>
      <link rel="stylesheet" type="text/css" href="component.css">
      <div>Component 1 <a href="1.src">link</a></div>
      <img src="img.png">
      
      <link rel="stylesheet" type="text/css" href="component.css">
      <div>Component 1 <a href="1.src">link</a></div>
      
    </body>
</html>`

test('css and js', (t) => {
  return posthtml([plugin({ css: true, script: true })])
    .process(html)
    .then((res) => t.truthy(res.html === nojsnocss))
})

test('css', (t) => {
  return posthtml([plugin({ css: true })])
    .process(html)
    .then((res) => t.truthy(res.html === nocss))
})

test('custom', (t) => {
  return posthtml([plugin({ custom: { attr: 'src' } })])
    .process(html)
    .then((res) => t.truthy(res.html === nosrc))
})
