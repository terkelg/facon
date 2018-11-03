const test = require('tape');
const f = require('../dist/facon.js');
const {JSDOM} = require('jsdom');

const { window } = new JSDOM(`...`);
global.document = window.document;

let parent = document.createElement('div');

const s = el => {
  parent.innerHTML = '';
  parent.appendChild(el);
  return parent.innerHTML;
}

test('facon: standard', async t => {
  t.plan(1);
  t.is(typeof f, 'function', 'consturctor is a typeof function');
});

test('facon: build element', async t => {
  t.plan(4);
  t.is(s(f`hello`), 'hello');
  t.is(s(f`<span>hello</span>`), '<span>hello</span>');
  t.is(s(f`<span><b>hello</b></span>`), '<span><b>hello</b></span>');
  t.is(s(f`<div><h1>Hello</h1><p>How Are you?</p></div>`), '<div><h1>Hello</h1><p>How Are you?</p></div>');
});

test('facon: collect', async t => {
  t.plan(2);
  let el = f`<span ref='test'>hello</span>`;
  let obj = el.collect();
  t.is('test' in obj, true);
  t.is(s(el), '<span>hello</span>');
});

test('facon: collect - keep attribute', async t => {
  t.plan(2);
  let el = f`<span ref='test'>hello</span>`;
  let obj = el.collect({keepAttribute:true});
  t.is('test' in obj, true);
  t.is(s(el), `<span ref="test">hello</span>`);
});

test('facon: collect - custom attribute', async t => {
  t.plan(4);
  let el = f`<span lol='test'>hello</span>`;
  let obj = el.collect({attr:'lol'});
  t.is('test' in obj, true);
  t.is(s(el), `<span>hello</span>`);

  el = f`<span lol='test'>hello</span>`
  obj = el.collect({attr:'lol', keepAttribute:true});
  t.is('test' in obj, true);
  t.is(s(el), `<span lol="test">hello</span>`);
});

test('facon: collect - assign', async t => {
  t.plan(2);
  let el = f`<span ref='test'>hello</span>`;
  let assign = {};
  let obj = el.collect({assign});
  t.is('test' in assign, true);
  t.is(s(el), `<span>hello</span>`);
});