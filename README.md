# horseless

## html-like markup in template literals!
write html. get elements. No compiling .jsx

### pretty simple example
```
import { h, modelify, watchSetChildren } from 'horseless'

const model = modelify({seconds: 0})
setInterval(() => model.seconds++, 1000)

watchSetChildren(document.body, h`
  <span>hello world! seconds running: ${() => model.seconds.toString()}</span>
`)
```
When your embedded expression is a function horseless runs it and watches for anything you looked at. Then when anything you looked at in the model changes, horseless runs it for you again and uses the new result. btw, ***DON'T SET ANY MODEL VALUES IN THE EMBEDDED FUNCTION***

### more complete example
There's a todomvc example in the docs folder. You can see it running at https://dtudury.github.io/horseless/

### things to know
attributes starting with 'on' won't get called before being set
```
h`<span class=${functionThatReturnsClasses}> click me </span>` //this works as you'd expect it to
h`<span onclick=${e => console.log('click', e)}> click me </span>` //this also works as you'd expect it to
```

don't put quotes around embedded expression attributes
```
h`<span class="${functionThatReturnsClasses}"> click me </span>` //this won't work
```

embedded expressions that are to become text nodes need to return strings
```
h`<span>hello world! seconds running: ${() => model.seconds}</span>` // like the simple example except this one's broken
```

If there's a compelling reason to change any of these, please file an issue
If you come across more things that may be confusing, please file an issue

## but it's not really html, is it?
Well, no... it only handles elements and doesn't check that your tags are valid or anything
```
let elements = h`
<!DOCTYPE html> // can't do this
<input autofocus> // or this
<!-- comment --> // or this
`
```
nope nope nope

## Ugh! not another bloated framework!
The first iteration of this project was just the template literal xhtml parsing. The model stuff was just for the demo... but it was so cool (imho) it got moved into the project proper. That said, the goal of this project is to enable transformations from models to views. Having the view update as the model updates seemed to be in line with that goal. 

There's around 400 code-golf-free lines with no external dependencies. you can read through all the code and understand every subtle nuance in a few minutes

The gzipped minified version is 2k

## todo
* better handle xml != html?
  * handle boolean attributes (without values `<input autofocus/>`)
  * handle void elements (without closing tags `<br>`)
* less adding and removing when splicing child nodes lists
* that templating thing that lit does might be cool (or some other way to not create new elements when updating big blocks of html)...
