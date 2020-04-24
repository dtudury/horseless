
import { defineSiteTitle } from './parts/siteTitle.js'
import { defineMainApp } from './parts/mainApp.js'
import { defineTopBar } from './parts/topBar.js'
import { defineBottomBar } from './parts/bottomBar.js'
import { defineHeader } from './parts/header.js'
import { defineLink } from './parts/link.js'
import { defineContainer } from './parts/container.js'
import { defineScreenTitle } from './parts/screenTitle.js'
import { defineOcticon } from './parts/octicon.js'

import { defineLoadingScreen } from './screens/loadingScreen.js'
import { defineSelectScreen } from './screens/selectScreen.js'
import { defineNewRepoScreen } from './screens/newRepoScreen.js'

export const SITE_TITLE = defineSiteTitle('header-title')
export const MAIN_APP = defineMainApp('main-app')
export const TOP_BAR = defineTopBar('top-bar')
export const BOTTOM_BAR = defineBottomBar('bottom-bar')
export const HEADER = defineHeader('header-element')
export const LINK = defineLink('link-element')
export const CONTAINER = defineContainer('container-element')
export const TITLE = defineScreenTitle('screen-title')
export const OCTICON = defineOcticon('octicon-element')

export const LOADING_SCREEN = defineLoadingScreen('loading-screen')
export const SELECT_SCREEN = defineSelectScreen('select-screen')
export const NEW_REPO_SCREEN = defineNewRepoScreen('new-repo-screen')
