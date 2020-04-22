
import { defineHeaderTitle } from './parts/headerTitle.js'
import { defineMainApp } from './parts/mainApp.js'

import { defineLoadingScreen } from './screens/loadingScreen.js'
import { defineSelectScreen } from './screens/selectScreen.js'
import { defineLine } from './parts/Line.js'
import { defineContainer } from './parts/Container.js'

export const HEADER_TITLE = defineHeaderTitle('header-title')
export const MAIN_APP = defineMainApp('main-app')
export const LINE = defineLine('line-element')
export const CONTAINER = defineContainer('container-element')

export const LOADING_SCREEN = defineLoadingScreen('loading-screen')
export const SELECT_SCREEN = defineSelectScreen('select-screen')
