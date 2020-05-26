import { h, render, proxy } from '/unpkg/horseless/horseless.js'

const model = proxy({ seconds: 0 })
setInterval(() => { ++model.seconds }, 1000)

const map = new Map()

function component (attributes, children, description) {
  if (!map.has(description)) {
    map.set(description, h`
      attribute a is: ${attributes.a}
      <br r=${Math.random() /* just to prove it's reusing the same element */}>
      model.seconds is: ${() => attributes.model.seconds}
      <br>
      here's a div with copied attributes: <div ${attributes}></div>
      here's the copied children:
      <br>
      ${children}
    `)
  }
  return map.get(description)
}

render(document.body, h`
  <${component} a="b" style="width: 100px; height: 100px; background: red;" model=${model}>
    c
    <br>
    d
  </>
`)
