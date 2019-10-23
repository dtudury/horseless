import { h, render, remodel } from '../../lib/index.js'
const model = remodel(h`
  <svg style="background:lightgray;" width="300" height="300" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
    <circle cx="150" cy="150" r="100"/>
  </svg>
`)

window.model = model

const defaultMap = new Map()

render(document.body, h`
<header class="app">
  <svg class="hamburger" onclick="" focusable="false" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
  </svg>
  <h1>
    JSVGX
  </h1>
</header>

<nav class="app">
</nav>

<main class="app">
  ${model}
</main>

<footer class="app">
  Copyright © 2019 David Tudury
</footer>
`)

