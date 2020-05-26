import { h, render, proxy } from '/unpkg/horseless/horseless.js'

const model = proxy({ seconds: 0 })
setInterval(() => { ++model.seconds }, 1000)

function component (attributes, children) {
  return h`
    <div>
      attribute a is: ${attributes.a}
      <br>
      model.seconds is: ${() => model.seconds}
      <br>
      here's a div with copied attributes: <div ${attributes}></div>
      here's the copied children:
      <br>
      ${children}
    </div>
  `
}

render(document.body, h`
  <${component} a="b" style="width: 100px; height: 100px; background: red;" model=${model}>
    c
    <br>
    d
  </>
`)
