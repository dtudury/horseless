# horseless

## html-like markup in template literals!
write html. get elements. No compiling .jsx
```
import { h, setChildren } from 'horseless'
let name = 'World'
let style = 'color: red;'
let elements = h`<span class='greeting'>Hello</span> <span class='name' style=${style}>${name}</span>!`
setChildren(document.body, elements)
```

There's a todomvc example in the docs folder. You can see it running at https://dtudury.github.io/horseless/

## but it's not really html, is it?
well, no... it only handles elements and doesn't check that your tags are valid or anything
```
let elements = h`
<!DOCTYPE html> // can't do this
<input autofocus> // or this
<!-- comment --> // or this
`
```
nope nope nope

## Ugh! not another bloated framework!
I feel you! ~~This won't solve all your problems for you. This ***just*** turns markup into dom elements.~~ EDIT: I added some methods that update the dom when the model changes and now it sort of does solve all your problems for you...

There's around 400 code-golf-free lines with no external dependencies. you can read through all the code and understand every subtle nuance in a few minutes

The gzipped minified version is 2k

## todo
* handle xml != html?
  * handle attributes without values `<input autofocus/>`
  * handle elements without closing tags `<br>`
* less adding and removing when splicing child nodes lists
* that templating thing that lit does might be cool (or some other way to not create new elements when updating big blocks of html)...
