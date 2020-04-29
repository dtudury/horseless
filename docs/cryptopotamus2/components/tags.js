
import { defineSiteTitle } from './parts/siteTitle.js'
import { defineMainApp } from './parts/mainApp.js'
import { defineTopBar } from './parts/topBar.js'
import { defineBottomBar } from './parts/bottomBar.js'
import { defineHeader } from './parts/header.js'
import { defineLink } from './parts/link.js'
import { defineButton } from './parts/inputs/button.js'
import { definePassphrase } from './parts/inputs/passphrase.js'
import { defineSalt } from './parts/inputs/salt.js'
import { defineIterations } from './parts/inputs/iterations.js'
import { defineContainer } from './parts/container.js'
import { defineScreenTitle } from './parts/screenTitle.js'
import { defineInfo } from './parts/info.js'
import { defineOcticon } from './parts/octicon.js'

import { defineBusyScreen } from './screens/busyScreen.js'
import { defineSelectRepoScreen } from './screens/selectRepoScreen.js'
import { defineNewRepoScreen } from './screens/newRepoScreen.js'
import { defineEditRepoScreen } from './screens/editRepoScreen.js'

export const SITE_TITLE = defineSiteTitle('header-title')
export const MAIN_APP = defineMainApp('main-app')
export const TOP_BAR = defineTopBar('top-bar')
export const BOTTOM_BAR = defineBottomBar('bottom-bar')
export const HEADER = defineHeader('header-element')
export const LINK = defineLink('link-element')
export const BUTTON = defineButton('button-element')
export const PASSPHRASE = definePassphrase('passphrase-element')
export const SALT = defineSalt('salt-element')
export const ITERATIONS = defineIterations('iterations-element')
export const CONTAINER = defineContainer('container-element')
export const TITLE = defineScreenTitle('screen-title')
export const INFO = defineInfo('info-title')
export const OCTICON = defineOcticon('octicon-element')

export const BUSY_SCREEN = defineBusyScreen('loading-screen')
export const SELECT_SCREEN = defineSelectRepoScreen('select-repo-screen')
export const NEW_REPO_SCREEN = defineNewRepoScreen('new-repo-screen')
export const EDIT_REPO_SCREEN = defineEditRepoScreen('edit-repo-screen')
