export default function h(strings, ...args) {
  let result = ``;
  const appends = {};
  const listenerCallbacks = [];

  for (let i = 0; i < args.length; i++) {
    if (args[i] instanceof HTMLElement) {
      const id = `id${i}`;
      appends[id] = args[i];
      result += `${strings[i]}<div append="${id}"></div>`;
    } else if (typeof args[i] === 'function') {
      listenerCallbacks.push(args[i]);
      result += strings[i];
    } else {
      result += strings[i] + args[i];
    }
  }
  result += strings[strings.length - 1];

  const template = document.createElement(`template`);
  template.innerHTML = result;

  const content = template.content;

  [...content.querySelectorAll('*')]
    .flatMap(el => [...el.attributes])
    .filter(attr => attr.name.startsWith('@'))
    .forEach(attr => {
      const type = attr.name.substring(1);
      const callback = listenerCallbacks.shift();
      attr.ownerElement.addEventListener(type, callback);
      attr.ownerElement.removeAttribute(attr.name);
    });

  [...content.querySelectorAll(`[append]`)].forEach(refNode => {
    const newNode = appends[refNode.getAttribute('append')];
    refNode.parentNode.insertBefore(newNode, refNode);
    refNode.parentNode.removeChild(refNode);
  });

  content.collect = ({ attr = 'ref', keepAttribute, to = {} } = {}) => {
    const refElements = content.querySelectorAll(`[${attr}]`);
    return [...refElements].reduce((acc, element) => {
      const propName = element.getAttribute(attr).trim();
      !keepAttribute && element.removeAttribute(attr);
      acc[propName] = acc[propName]
        ? Array.isArray(acc[propName])
          ? [...acc[propName], element]
          : [acc[propName], element]
        : element;
      return acc;
    }, to);
  };

  return content;
}
