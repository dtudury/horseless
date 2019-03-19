# horsy

## html-like markup in template literals!
write html. get elements. No compiling .jsx
```
import h, { setChildren } from '../lib'
let name = 'World'
let style = 'color: red;'
let elements = h`<span class='greeting'>Hello</span> <span class='name' style=${style}>${name}</span>!`
setChildren(document.body, elements)
```

## but it's not really html, is it?
well, no... it only handles elements and doesn't check that your tags are valid or anything
```
import h, { setChildren } from '../lib'
let elements = h`
<!DOCTYPE html>
<!-- comment -->
`
setChildren(document.body, elements)
```
nope nope nope

## Ugh! not another bloated framework!
I feel you! This won't solve all your problems for you. This ***just*** turns markup into dom elements.

There's around 200 code-golf-free lines (plus comments (someday)) with no external dependencies. you can read through all the code and understand every subtle nuance in a few minutes

The gzipped minified version is 2k
