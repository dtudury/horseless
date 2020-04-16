import { h, render, proxy } from '/unpkg/horseless/horseless.js'

const model = proxy({
  timeLeft: 0
})
const birthday = new Date('August 31 ' + new Date().getFullYear())

setInterval(() => {
  let dt = Math.floor(new Date(birthday - new Date()) / 1000)
  model.seconds = dt % 60
  dt = Math.floor(dt / 60)
  model.minutes = dt % 60
  dt = Math.floor(dt / 60)
  model.hours = dt % 24
  model.days = Math.floor(dt / 24)
})

const astronaut = 'Dave'
const obj = { feeling: 'not sorry' }
const descriptions = h`I'm <custom-element actually=${obj}>sorry</custom-element> ${astronaut}, I'm afraid I can't do that`
console.log(JSON.stringify(descriptions, null, '  '))

render(document.body, h`${() => model.days} days, ${() => model.hours} hours, ${() => model.minutes} minutes, ${() => model.seconds} seconds until Izzy's birthday`)
