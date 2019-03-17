import lml from '../lib/lml'

console.log(lml`   asdf  ${[1, 2, 3]}asdf`)
console.log(lml`   ${{ a: 1 }}asdf`)
console.log(lml` <qwer>${'asdf'}</qwer>`)
console.log(lml` <qwer a="o">asdf</qwer>`)
console.log(lml`<asdf a=${[1, 2]}/>`)
console.log(lml` asdf<>asdf</>`)
