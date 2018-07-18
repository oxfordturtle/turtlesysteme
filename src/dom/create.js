/**
 * create a pre-filled html element, with options for content and attributes
 */

// direct export of the function
module.exports = (type, options = {}) => {
  // create the element
  const element = document.createElement(type);
  // iterate over the options adding content/attributes
  Object.keys(options).forEach((key) => {
    switch (key) {
      case 'classes':
        options.classes.forEach(x => element.classList.add(x));
        break;
      case 'content':
        if (typeof options.content === 'string') {
          element.innerHTML = options.content;
        } else {
          options.content.forEach(child => element.appendChild(child));
        }
        break;
      case 'value':
        element.value = options.value;
        break;
      case 'on':
        options.on.forEach(e => element.addEventListener(e.type, e.callback));
        break;
      default:
        element.setAttribute(key, options[key]);
        break;
    }
  });
  return element;
};
