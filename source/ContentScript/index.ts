import {browser} from 'webextension-polyfill-ts';

console.log('helloworld from content script');

export {};
const icon = document.createElement('img');
Object.assign(icon, {
  src: 'https://cdn-icons-png.flaticon.com/512/3208/3208709.png',
  id: 'side-icon',
});
Object.assign(icon.style, {
  position: 'fixed',
  bottom: '10px',
  right: '0',
  zIndex: '1000',
  width: '32px',
});

const closeEye = 'https://cdn-icons-png.flaticon.com/512/8276/8276554.png';
const openEye = 'https://cdn-icons-png.flaticon.com/512/4855/4855031.png';
const icon2 = document.createElement('img');
Object.assign(icon2.style, {
  position: 'fixed',
  bottom: '10px',
  right: '32px',
  zIndex: '1000',
  width: '20px',
});
icon2.src = closeEye;
icon2.addEventListener('click', () => {
  document.body.dataset.hidden =
    document.body.dataset.hidden === 'true' ? 'false' : 'true';
  if (document.body.dataset.hidden === 'true') {
    icon2.src = openEye;
  }
});
const div = document.createElement('div');
Object.assign(div.style, {
  position: 'fixed',
  top: '32px',
  right: '32px',
  height: '100vh',
  background: 'white',
  'overflow-y': 'auto',
  width: '220px',
});
const ol = document.createElement('ol');
Object.assign(ol.style, {
  width: '220px',
  'box-shadow': 'inset 2px 3px 20px 0px grey',
  'z-index': 1000,
  position: 'relative',
});

ol.hidden = true;
div.appendChild(ol);
div.appendChild(icon);
div.appendChild(icon2);
document.body.appendChild(div);

// eslint-disable-next-line @typescript-eslint/no-use-before-define
findAllRelativeLinks();
const count = document.createElement('span');
Object.assign(count.style, {
  position: 'fixed',
  bottom: '42px',
  right: '-8px',
  'z-index': 1000,
  width: '32px',
  'font-size': '14px',
});
count.textContent = ol.children.length.toString();
div.appendChild(count);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function addEntry(ele: any): void {
  const li = document.createElement('li');
  li.textContent = ele.content;
  li.dataset.location = ele.top.toString();
  li.dataset.href = ele.href;
  li.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.dataset.href) {
      if (target.dataset.href.startsWith('#')) {
        window.location.href =
          window.location.origin +
          window.location.pathname +
          target.dataset.href;
      } else {
        window.location.href = target.dataset.href;
      }
      return;
    }
    e.stopPropagation();
    window.scrollTo({
      top: +(li.dataset.location || 0),
      left: 0,
      behavior: 'smooth',
    });
  });
  ol.appendChild(li);
}

function findAllRelativeLinks(): void {
  const links = document.querySelectorAll('a');
  // eslint-disable-next-line consistent-return
  links.forEach((link) => {
    if (
      (link.href.startsWith(
        window.location.origin + window.location.pathname
      ) &&
        link.href.includes('#')) ||
      link.href.startsWith('#')
    ) {
      addEntry({
        content: link.textContent,
        top: link.getBoundingClientRect().top,
        href: link.href,
      });
    }
  });
}

icon.addEventListener('click', () => {
  browser.runtime.sendMessage({action: 'toggleIcon'});
  ol.hidden = !ol.hidden;
});

browser.runtime.onMessage.addListener((message, sender) => {
  console.log(message, sender);
  if (message.action === 'toggleIcon') {
    // isIconVisible = !isIconVisible;
    // icon.style.display = isIconVisible ? 'block' : 'none';
  }
});
document.addEventListener('click', function A(e) {
  if (e.target === icon) return;
  const target = e.target as HTMLElement;
  if (target.dataset && target.dataset.location) {
    return;
  }
  if (document.body.dataset.hidden === 'true') return;
  // eslint-disable-next-line no-alert
  const name = window.prompt(
    'name of bookmark',
    (target.textContent || target.innerText).slice(0, 20)
  );
  if (name === null) return;
  target.style.backgroundColor = 'lightyellow';
  addEntry({content: name, top: document.documentElement.scrollTop, href: ''});

  // button.onclick = () => {
  //   console.log('going to ' + location)
  //   window.scrollTo({
  //     top: location,
  //     left: 0,
  //     behavior: "smooth",
  //   });
  // }
});
