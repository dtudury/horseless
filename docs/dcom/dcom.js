import { h, render, proxy, mapSwitch, mapEntries, watchFunction, showIfElse } from './horseless.0.5.1.min.esm.js' // '/unpkg/horseless/horseless.js' 

const UNSET_API = Symbol('unset API base-url')
const LOADING = Symbol('loading')
const MAIN = Symbol('main')

const model = proxy({
  apibaseurl: window.localStorage.getItem('apibaseurl') || '',
  lexeme: 'light',
  ipa: false
})

watchFunction(() => {
  window.localStorage.setItem('apibaseurl', model.apibaseurl)
})

watchFunction(() => {
  if (model.apibaseurl && model.lexeme) {
    fetch(new URL(model.lexeme, model.apibaseurl))
      .then(response => response.json())
      .then(responseObject => model.responseObject = responseObject)
  }
})

const setApiUrl = el => e => {
  e.preventDefault()
  const apibaseurl = (new FormData(e.target)).get('apibaseurl')
  model.apibaseurl = apibaseurl.endsWith('/') ? apibaseurl : `${apibaseurl}/`
  return false
}

function getState() {
  if (!model.apibaseurl) return UNSET_API
  if (!model.responseObject) return LOADING
  return MAIN
}


render(document.body, mapSwitch(getState, state => {
  switch (state) {
    case UNSET_API: return h`
      <form onsubmit=${setApiUrl}>
        <div>
          <label for="apibaseurl">Enter api url:</label>
          <input type="url" id="apibaseurl" placeholder="https://api.example.com/" size="48" name="apibaseurl" required>
        </div>
        <div>
          <button>Set</button>
        </div>
      </form>
    `
    case LOADING: return h`
      <${Header} model = ${model}/>
      loading...
    `
    case MAIN: return h`
      <${Header} model = ${model}/>
      <${Definition} data=${() => model.responseObject.data}/>
    `
    default: return h`unhandled case`
  }
}))

function Header (attributes) {
  const search = el => e => {
    e.preventDefault()
    attributes.model.lexeme = (new FormData(e.target)).get('lexeme')
    attributes.model.responseObject = null
    return false
  }
  return h`
    <header>
      <form onsubmit=${search}>
        <input type="search" autocapitalize="off" autocorrect="off" autocomplete="off" name="lexeme" id="lexeme" value="${() => attributes.model.lexeme}">
        <button>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
            <path fill-rule="evenodd" d="M15.7 13.3l-3.81-3.83A5.93 5.93 0 0013 6c0-3.31-2.69-6-6-6S1 2.69 1 6s2.69 6 6 6c1.3 0 2.48-.41 3.47-1.11l3.83 3.81c.19.2.45.3.7.3.25 0 .52-.09.7-.3a.996.996 0 000-1.41v.01zM7 10.7c-2.59 0-4.7-2.11-4.7-4.7 0-2.59 2.11-4.7 4.7-4.7 2.59 0 4.7 2.11 4.7 4.7 0 2.59-2.11 4.7-4.7 4.7z"></path>
          </svg>
        </button>
      </form>
    </header>
  `
}

function Definition (attributes) {
  const data = attributes.data
  if (!data.content) {
    return h`404`
  }
  return h`
    <main>
      ${mapEntries(data.content, source => {
        switch (source.source) {
          case 'luna': return luna(source.entries)
          default: return h`<div>unhandled source: ${source.source}</div>`
        }
      })}
    </main>
  `
}


function luna(entries) {
  const toggleIpa = el => e => {
    model.ipa = !model.ipa
  }
  return h`
    <section id="luna">
      ${mapEntries(entries, entry => {
        return h`
          <article>
            <header>
              <h1 style="display: inline;">${entry.entry}</h1>
              ${showIfElse(() => entry.homograph, h`<sup>${entry.homograph}</sup>`)}
              <figure style="display: inline; margin: 0;">
              ${showIfElse(() => model.ipa, h`/${entry.pronunciation.ipa}/`, h`[${entry.pronunciation.spell}]`)}
              </figure>
              <button onclick=${toggleIpa}>${showIfElse(() => model.ipa, h`PHONETIC RESPELLING`, h`SHOW IPA`)}</button>
            </header>
            ${mapEntries(entry.posBlocks, posBlock => {
              const pos = h([posBlock.pos])[0].children[0].value
              const posSupplementaryInfo = h([posBlock.posSupplementaryInfo]).map(node => {
                if (node.value) return h`${node.value}`
                if (node.children) return h`<b>${node.children[0].value}</b>`
              })
              return h`
                <section>
                  <h2 style="display: inline; font: italic 1em normal;">${pos}</h2>
                  ${posSupplementaryInfo}
                  <ol>
                    ${mapEntries(posBlock.definitions, definition => {
                      console.log(JSON.parse(JSON.stringify(definition)))
                      if (definition.type === 'simple') {
                        const formatted = h([definition.definition || '']).map(node => {
                          if (node.value) return h`${node.value}`
                          if (node.children) return h`<i>${node.children[0].value}</i>`
                        })
                        return h`
                          <li value="${definition.order}">${formatted}</li>
                        `
                      } else if (definition.type === 'group') {
                        const formatted = h([definition.predefinitionContent || '']).map(node => {
                          if (node.value) return h`${node.value}`
                          if (node.children) return h`<i>${node.children[0].value}</i>`
                        })
                        return h`
                          <li value="${definition.order}">${formatted}
                            <ol type="a">
                              ${mapEntries(definition.subdefinitions, subdefinition => {
                                const formatted = h([subdefinition.definition || '']).map(node => {
                                  if (node.value) return h`${node.value}`
                                  if (node.children) return h`<i>${node.children[0].value}</i>`
                                })
                                return h`
                                  <li>${formatted}</li>
                                `
                              })}
                            </ol>
                          </li>
                        `
                      }
                    })}
                  </ol>
                </section>
              `
            })}
          </article>
        `
      })}
    </section>
  `
}
