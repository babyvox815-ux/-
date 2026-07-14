(() => {
  const load = src => new Promise((resolve,reject) => {
    const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=reject;document.head.appendChild(s);
  });
  load('./defaults.js?v=11')
    .then(()=>load('./app-old.js?v=8'))
    .then(()=>load('./parts.js?v=11'))
    .then(()=>{window.YGO_DEFAULTS?.init();window.YGO_PARTS?.init();})
    .catch(error=>{console.error(error);document.body.insertAdjacentHTML('beforeend','<div style="position:fixed;left:12px;right:12px;bottom:12px;padding:14px;background:#7b2230;color:#fff;border-radius:14px;z-index:999">앱을 불러오지 못했습니다. 페이지를 새로고침해 주세요.</div>')});
})();