# horseless

horseless is a microscopic, expressive, and fun javascript framework. [Repo here.](https://github.com/dtudury/horseless)

## Quick Reference

### proxy ###
```
const model = proxy({ count: 0, events: [] })
```

### h ###
```
const attributes = { top: 0, left: 0 }
const handleClick = el => e => console.log('click', el, e)
function getColor () {
  return model.count > 100 ? 'red' : 'green'
}
const view = h`
  <div ${attributes} style="color: ${getColor};" onclick=${onclick}>
    <span>initial count: ${model.count} live count: ${() => model.count}</span>
    ${mappedEvents}
  </div>
`
```

### render ###
```
render(document.getElementById('app'), view)
```

### mapEntries ###
```
```

### showIfElse ###
```
```

### after ###
```
```

### watchFunction ###
```
```

### unwatchFunction ###
```
```

## Working Examples ##

### Examples From README ###
* [h](h/)
* [render](render/)
* [proxy](proxy/)

### Experiments ###
* [todomvc](todomvc/)
* [base10](base10/)

## Boring Stuff ##
* [test](test/)
* [coverage](coverage/)
