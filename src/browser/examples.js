import * as examples from 'common/constants/examples'

export default (tse) => {
  const language = tse.dataset.language
  const pre = document.createElement('pre')
  let count = 1
  pre.innerHTML = `SOURCE CODE OF BUILT-IN ${language.toUpperCase()} EXAMPLE PROGRAMS\n\n\n`
  examples.menu.forEach((set) => {
    pre.innerHTML += `{EXAMPLES ${set.index}} - ${set.title.toUpperCase()}\n\n`
    set.examples.forEach((id) => {
      pre.innerHTML += `{${count}}  '${examples.names[id]}'\n\n`
      pre.innerHTML += examples.code[language][id]
      pre.innerHTML += '\n\n'
      count += 1
    })
    pre.innerHTML += '\n'
  })
  tse.appendChild(pre)
}
