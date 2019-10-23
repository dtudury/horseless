import { remodel } from '../../lib/index.js'
const model = window.model = remodel({
  todos: [
    { label: 'Taste Javascript', completed: false },
    { label: 'Buy a unicorn', completed: false }
  ]
})
export default model 
