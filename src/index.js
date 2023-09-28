export default function h(strings, ...args) {
  const template = document.createElement(`template`);

  template.innerHTML = args.reduce((prev, value, i) => {
    return prev +
      (value instanceof HTMLElement ? `<b append=${i}></b>` : value) +
      strings[i + 1]
  }, strings[0]);

  const content = template.content;

  [...content.querySelectorAll(`[append]`)].forEach(refNode => {
    refNode.parentNode.insertBefore(args[refNode.getAttribute('append')], refNode);
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
