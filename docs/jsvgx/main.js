import { h, render } from '../../lib/index.js'
import model from './model.js'

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

