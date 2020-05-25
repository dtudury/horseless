import { h, render, proxy } from '/unpkg/horseless/horseless.js'

const model = proxy({})

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

render(document.body, h`${() => model.days} days, ${() => model.hours} hours, ${() => model.minutes} minutes, ${() => model.seconds} seconds until Izzy's birthday`)
