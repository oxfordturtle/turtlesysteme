/*
Setup the settings page (Electron).
*/
import * as settings from 'common/components/machine/settings'

// setup the settings page
export default (tsx) => {
  tsx.classList.add('tsx-settings')
  tsx.appendChild(settings.buttons)
  tsx.appendChild(settings.drawCountMax)
  tsx.appendChild(settings.codeCountMax)
  tsx.appendChild(settings.smallSize)
  tsx.appendChild(settings.stackSize)
}
