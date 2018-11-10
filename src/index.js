export default function h(strings, ...args) {
  let result = ``; 
  for(let i = 0; i < args.length; i++) result += strings[i] + args[i]
  result += strings[strings.length - 1]

  const template = document.createElement(`template`);
  template.innerHTML = result;

  const content = template.content;

  content.collect = ({attr = 'ref', keepAttribute, assign = {}} = {}) => {
    const refElements = content.querySelectorAll(`[${attr}]`);
    return [...refElements].reduce((acc, element) => {
      const propName = element.getAttribute(attr).trim();
      !keepAttribute && (element.removeAttribute(attr));
      acc[propName] = acc[propName]
      ? Array.isArray(acc[propName])
        ? [...acc[propName], element]
        : [acc[propName], element]
      : element;
    return acc;
    }, assign);
  }

  return content;
}