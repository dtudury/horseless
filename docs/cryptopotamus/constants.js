import { defineApp } from './components/App.js'
import { defineContainer } from './components/Container.js'
import { defineLine } from './components/Line.js'

export const APP = defineApp('app-element')
export const CONTAINER = defineContainer('container-element')
export const LINE = defineLine('line-element')

export const ENTER_KEY = 13
export const ESCAPE_KEY = 27

export const CREATE_NEW_REPO = 'create-new-repo'
export const DECRYPT = 'decrypt'
export const ERROR = 'error'
export const MAIN = 'main'
export const REPO_SELECT = 'repo-select'
export const SAVE_AS = 'save-as'
export const WORKING = 'working'
