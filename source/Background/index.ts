import {createElement} from 'react';
import {browser} from 'webextension-polyfill-ts';

browser.runtime.onInstalled.addListener((): void => {
  console.log('🦄', 'extension installed');
});
const img = createElement('img', {
  src: 'https://cdn-icons-png.flaticon.com/512/3208/3208709.png',
  style: 'position: fixed; bottom: 10px; right: 10px; z-index: 1000;',
});
const imgNode = img as unknown as Node; // Convert React element to Node
document.body.appendChild(imgNode);

browser.action.onClicked.addListener((tab) => {
  browser.tabs.sendMessage(tab.id ?? 0, {action: 'toggleIcon'});
});
