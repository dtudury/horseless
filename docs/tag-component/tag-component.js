import { h, render } from '/unpkg/horseless/horseless.js'

function component (attributes, children) {
  return h`
    <div>
      attribute a is: ${attributes.a}
      <br>
      here's a div with copied attributes: <div ${attributes}></div>
      here's the copied children:
      <br>
      ${children}
    </div>
  `
}

render(document.body, h`
  <${component} a="b" style="width: 100px; height: 100px; background: red;">
    c
    <br>
    d
  </>
`)
