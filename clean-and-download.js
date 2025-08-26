(() => {
  const $all = (s, r=document) => [...r.querySelectorAll(s)];
  const rmAll = (s) => $all(s).forEach(n => n.remove());
  const inHead = (el) => el.closest('head') !== null;

  // 1) Remove JS/CSS/embeds/forms BUT KEEP JSON-LD
  $all('script').forEach(s => {
    const t = (s.getAttribute('type') || '').toLowerCase().trim();
    if (t !== 'application/ld+json') s.remove();
  });
  rmAll('link[rel="stylesheet"],style,iframe,video,audio,embed,object,canvas,form,input,button,textarea,select,noscript');
  rmAll('link[rel="preload"],link[rel="preconnect"],link[rel="modulepreload"]');

  // 2) Strip attributes but KEEP SEO/structured data
  const keepGlobal   = new Set(['href','src','alt','title','lang']);
  const keepMicro    = new Set(['itemscope','itemtype','itemprop','itemid']);
  const keepHeadMeta = new Set(['name','property','content','charset','http-equiv']);
  const keepLinkHead = new Set(['rel','href','hreflang','type','sizes']);
  const keepHtml     = new Set(['lang','dir','prefix']);

  document.querySelectorAll('*').forEach(el => {
    for (const { name } of [...el.attributes]) {
      const n = name.toLowerCase();

      if (el.tagName === 'SCRIPT') { // JSON-LD script
        if (n === 'type') continue;
        el.removeAttribute(name);
        continue;
      }
      if (el === document.documentElement && keepHtml.has(n)) continue;
      if (keepMicro.has(n)) continue;
      if (keepGlobal.has(n)) continue;

      if (inHead(el)) {
        if (el.tagName === 'META' && keepHeadMeta.has(n)) continue;
        if (el.tagName === 'LINK' && keepLinkHead.has(n)) continue;
        continue;
      }

      // Drop everything else
      if (n === 'id' || n === 'class' || n === 'style' || n.startsWith('on') ||
          n.startsWith('data-') || n === 'role' || n === 'tabindex' || n.startsWith('aria-')) {
        el.removeAttribute(name);
      } else if (!inHead(el)) {
        if (!keepGlobal.has(n) && !keepMicro.has(n)) el.removeAttribute(name);
      }
    }
  });

  // 3) Remove HTML comments
  {
    const walker = document.createTreeWalker(document, NodeFilter.SHOW_COMMENT);
    const comments = [];
    while (walker.nextNode()) comments.push(walker.currentNode);
    comments.forEach(n => n.remove());
  }

  // 4) Images: normalise
  $all('img').forEach(img => {
    const ds = img.getAttribute('data-src') || img.getAttribute('data-original') || img.getAttribute('data-lazy-src');
    if (!img.getAttribute('src') && ds) img.setAttribute('src', ds);
    img.removeAttribute('srcset');
    img.removeAttribute('sizes');
  });

  // 5) Flatten <picture>
  $all('picture').forEach(p => {
    const c = p.querySelector('img,source');
    const img = document.createElement('img');
    const src = (c?.getAttribute('src') || c?.getAttribute('srcset') || '').split(' ')[0] || c?.getAttribute('data-src') || '';
    if (src) img.src = src;
    const alt = p.querySelector('img')?.getAttribute('alt');
    if (alt) img.setAttribute('alt', alt);
    p.replaceWith(img);
  });

  // 6) Collapse whitespace in BODY text nodes
  {
    const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const texts = [];
    while (tw.nextNode()) texts.push(tw.currentNode);
    texts.forEach(t => {
      const s = t.nodeValue.replace(/\s+/g, ' ').trim();
      if (s) t.nodeValue = s;
      else t.remove();
    });
  }

  // 7) Remove empty containers (no text and no meaningful children)
  $all('div,span,section,article,aside,header,footer,nav').forEach(el => {
    const meaningful = el.textContent.trim().length > 0 ||
      el.querySelector('img,picture,svg,video,meta,script[type="application/ld+json"]');
    if (!meaningful) el.remove();
  });

  // 8) Mark + serialize minified + download
  document.documentElement.setAttribute('data-clean-view', '1');

  let html = '<!doctype html>' + document.documentElement.outerHTML;
  html = html.replace(/>\s+</g, '><').replace(/\s{2,}/g, ' ');

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const a = document.createElement('a');
  const slug = (location.pathname.replace(/\/$/,'').split('/').pop() || 'index').replace(/[^\w.-]+/g, '-');
  a.href = URL.createObjectURL(blob);
  a.download = `clean-${slug}.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
})();
