import { h, render, remodel, mapList, mapObject } from '../../lib/index.js'

const model = remodel(
)
window.model = model

render(document.body, h`
<header>
  <svg class="hamburger" focusable="false" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
  </svg>
  <h1>
    JSVGX
  </h1>
</header>

<main id="ide">
  <div class="workspace">
    <svg class="" width="10" height="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="24"/>
    </svg>
  </div>
  <div class="stage">
  </div>
</main>

<footer>
  Copyright © 2019 David Tudury
</footer>
`)
