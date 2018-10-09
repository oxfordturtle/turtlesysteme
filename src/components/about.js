/*
the about component
*/
import { tabs } from '../tools.js'
import about from '../help/about.js'
import versions from '../help/versions.js'

// the about tabs
export default tabs('tsx-system-tabs', [
  { label: 'About', active: true, content: [about] },
  { label: 'Versions', active: false, content: [versions] }
])
