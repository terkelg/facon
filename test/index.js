import f  from '../src';
import test from 'tape';
import { JSDOM } from 'jsdom';

const { window } = new JSDOM(`...`);
global.document = window.document;
global.HTMLElement = window.HTMLElement;

let parent = document.createElement('div');

const s = el => {
  parent.innerHTML = '';
  parent.appendChild(el);
  return parent.innerHTML;
}

test('facon: standard', async t => {
  t.plan(1);
  t.is(typeof f, 'function', 'constructor is a typeof function');
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

test('facon: collect - array', async t => {
  t.plan(5);
  let el = f`<ul ref='list'><li ref='item'>0</li><li ref='item'>1</li><li ref='item'>2</li></ul>`;
  let obj = el.collect();
  t.is('list' in obj, true);
  t.is('item' in obj, true);
  t.is(s(el), '<ul><li>0</li><li>1</li><li>2</li></ul>');
  t.is(Array.isArray(obj.item), true);
  t.is(obj.item.every((x, i) => s(x) === `<li>${i}</li>`), true);
});

test('facon: collect - keep attribute', async t => {
  t.plan(7);
  let el = f`<span ref='test'>hello</span>`;
  let obj = el.collect({keepAttribute:true});
  t.is('test' in obj, true);
  t.is(s(el), `<span ref="test">hello</span>`);

  el = f`<ul ref='list'><li ref='item'>0</li><li ref='item'>1</li><li ref='item'>2</li></ul>`;
  obj = el.collect({keepAttribute:true});
  t.is('list' in obj, true);
  t.is('item' in obj, true);
  t.is(s(el), `<ul ref="list"><li ref="item">0</li><li ref="item">1</li><li ref="item">2</li></ul>`);
  t.is(Array.isArray(obj.item), true);
  t.is(obj.item.every((x, i) => s(x) === `<li ref="item">${i}</li>`), true);
});

test('facon: collect - custom attribute', async t => {
  t.plan(14);
  let el = f`<span lol='test'>hello</span>`;
  let obj = el.collect({attr:'lol'});
  t.is('test' in obj, true);
  t.is(s(el), `<span>hello</span>`);

  el = f`<span lol='test'>hello</span>`
  obj = el.collect({attr:'lol', keepAttribute:true});
  t.is('test' in obj, true);
  t.is(s(el), `<span lol="test">hello</span>`);

  el = f`<ul lol='list'><li lol='item'>0</li><li lol='item'>1</li><li lol='item'>2</li></ul>`;
  obj = el.collect({attr:'lol'});
  t.is('list' in obj, true);
  t.is('item' in obj, true);
  t.is(s(el), `<ul><li>0</li><li>1</li><li>2</li></ul>`);
  t.is(Array.isArray(obj.item), true);
  t.is(obj.item.every((x, i) => s(x) === `<li>${i}</li>`), true);

  el = f`<ul lol='list'><li lol='item'>0</li><li lol='item'>1</li><li lol='item'>2</li></ul>`;
  obj = el.collect({attr:'lol', keepAttribute:true});
  t.is('list' in obj, true);
  t.is('item' in obj, true);
  t.is(s(el), `<ul lol="list"><li lol="item">0</li><li lol="item">1</li><li lol="item">2</li></ul>`);
  t.is(Array.isArray(obj.item), true);
  t.is(obj.item.every((x, i) => s(x) === `<li lol="item">${i}</li>`), true);
});

test('facon: collect - to', async t => {
  t.plan(7);
  let el = f`<span ref='test'>hello</span>`;
  let to = {};
  let obj = el.collect({to});
  t.is('test' in to, true);
  t.is(s(el), `<span>hello</span>`);

  el = f`<ul ref='list'><li ref='item'>0</li><li ref='item'>1</li><li ref='item'>2</li></ul>`;
  obj = el.collect({to});
  t.is('list' in to, true);
  t.is('item' in to, true);
  t.is(s(el), `<ul><li>0</li><li>1</li><li>2</li></ul>`);
  t.is(Array.isArray(to.item), true);
  t.is(to.item.every((x, i) => s(x) === `<li>${i}</li>`), true);
});

test('facon: append', async t => {
  let myNode = window.document.createElement('div');
  let el = f`<div>${myNode}</div>`;
  t.is(s(el), `<div><div></div></div>`);
  t.end();
});
