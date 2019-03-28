<p align="center">
  <img src="facon.png" alt="facon" width="300" />
</p>

<p align="center">
  <a href="https://npmjs.org/package/facon">
    <img src="https://badgen.now.sh/npm/v/facon" alt="version" />
  </a>
  <a href="https://travis-ci.org/terkelg/facon">
    <img src="https://badgen.now.sh/travis/terkelg/facon" alt="travis" />
  </a>
  <a href="https://npmjs.org/package/facon">
    <img src="https://badgen.now.sh/npm/dm/facon" alt="downloads" />
  </a>
  <a href="https://packagephobia.now.sh/result?p=facon">
    <img src="https://packagephobia.now.sh/badge?p=facon" alt="install size" />
  </a>
</p>

<p align="center"><b>Tiny utility (295B) to create DOM elements with manner.</b></p>

Manually creating DOM nested elements can be very troublesome and verbose.
Facon is a tiny utility that makes it easy to create nested DOM elements using template literals and extract references.


There's no magic nor restrictive template logic. All you get are dom references so that you can do whatever you like and take full advantage of the powerful native DOM API.


> **TLDR**: Facon fix the tiring process of creating and assembling nested DOM elements or `.innerHTML` where you later have to query for references manually.

**~~lack of~~ Features**
- Tiny (295B)
- Vanilla JS
- Zero Dependencies
- Fast


## Install

```
$ npm install facon
```

This module exposes three module definitions:

* **ES Module**: `dist/facon.mjs`
* **CommonJS**: `dist/facon.js`
* **UMD**: `dist/facon.min.js`

Include facon:
```js
// ES6
import f from 'facon'

// CJS
const f = require('facon');
```

The script can also be directly included from [unpkg.com](https://unpkg.com):
```html
<script src="https://unpkg.com/facon"></script>
```


## Usage

```js
import f from 'facon';

// Create a <b> DOM element
let node = f`<b>Hello World</b>`;
document.body.appendChild(node);

// Create nested elements, and extract references
let node = f`
<div>
  <h1 ref="title">Façon</h1>
  <p ref="body">Create nested DOM elements with manner<p>
</div>
`;
document.body.appendChild(node);

let {title, body} = node.collect();
title.textContent = 'Hello World';
```


## API

### facon(string)
Returns: `Element`

Construct and returns a DOM `element`.

The returned `element` has a special `collect` method used to collect references to all elements with a `ref` attribute. Multiple elements containing identical `ref` attribute values result in an array of DOM references.

### node.collect(options)
Returns: `Object`

Method for extracting DOM references. E.g:

```js
const node = f`
  <div>
    <h1 ref="title">Hello world!</h1>
    <ul ref="list">
      <li ref="items">One</li>
      <li ref="items">Two</li>
      <li ref="items">Three</li>
    </ul>
  <div>
`;
let {title, list, items} = node.collect();
// ~> title is a dom reference to the inner h1 element.
// ~> list is a dom reference to the inner ul element.
// ~> items is an array of dom references to each li element.
// ~> node is by default the outer most element.
```

#### options.ref
Type: `String`<br>
Default: `ref`

Attribute name used for collecting references.

#### options.keepAttribute
Type: `Boolean`<br>
Default: `false`

Keep `ref` attributes on elements after collecting the references. Defaults to `false`.

#### options.to
Type: `Object`<br>
Default: `{}`

Optional object reference to assign to.

This can be handy if you have a component and want to be able to access references trough `this`. E.g:
```js
class MyElement extends Component {
    
    view() {
      const view = f`
        <div>
          <h1 ref="title">Façon</h1>
          <p ref="body>Create nested DOM elements with manner<p>
        </div>       
      `;
      view.collect({to:this});
    }

    // later ...

    update() {
      this.title = 'Hello World';
      this.body = 'test';
    }
}
```

## License

MIT © [Terkel Gjervig](https://terkel.com)
