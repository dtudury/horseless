import { h, proxy } from '/unpkg/horseless/horseless.js'
import { INFO, OCTICON, CONTAINER, HEADER, INPUT } from '../components/tags.js'
import { icons } from '../components/parts/octicon.js'

const img = new window.Image()
img.src = `data:image/svg+xml;utf8,${icons['file-directory']}`

export function input (input, icon = 'repo') {
  const model = proxy({ closeSavedRepos: (!input.files || input.files.length === 0) })

  const fileDescriptions = () => {
    const ondragstart = el => e => {
      const icon = el.querySelector('[file-directory]')
      const rect = icon.getBoundingClientRect()
      e.dataTransfer.setDragImage(img, e.pageX - rect.x, e.pageY - rect.y)
    }

    return h`
      <${INFO}>
        <${OCTICON} style="width:10px; padding-left: 16px;" plus/>
        <${INPUT} type="text" value="new file"/>
      </${INFO}>
      <${INFO}>
        <${OCTICON} style="width:10px; padding-left: 16px;" file-code/>
        Some file
      </${INFO}>
      <${INFO} draggable="true" ondragstart=${ondragstart}>
        <${OCTICON} style="width: 10px;" chevron-right/>
        <${OCTICON} style="width: 10px;" file-directory/>
        Some input
      </${INFO}>
    `
  }

  const toggleSavedRepos = el => e => {
    model.closeSavedRepos = !model.closeSavedRepos
  }

  const setName = el => e => {
    input.name = el.value
  }

  return h`
    <${CONTAINER} ${() => model.closeSavedRepos ? 'closed' : null}>
      <${HEADER} slot="header" onclick=${toggleSavedRepos}>
        <${OCTICON} style="width: 10px;" ${() => model.closeSavedRepos ? 'chevron-right' : 'chevron-down'}/>
        <${OCTICON} ${() => icon}/>
        <${INPUT} type="text" oninput=${setName} value=${() => input.name}/>
      </${HEADER}>
      ${fileDescriptions}
    </${CONTAINER}>
  `
}
