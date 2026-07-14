(() => {
  const load = src => new Promise((resolve,reject) => {
    const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=reject;document.head.appendChild(s);
  });
  load('./icons.js?v=16')
    .then(()=>load('./app-old.js?v=8'))
    .then(()=>load('./parts.js?v=13'))
    .then(()=>load('./session.js?v=13'))
    .then(()=>load('./theme14.js?v=14'))
    .then(()=>load('./workout-only.js?v=16'))
    .then(()=>{window.YGO_PARTS?.init();window.YGO_SESSION?.init();window.YGO_THEME14?.init();window.YGO_ICONS?.init();window.YGO_WORKOUT_ONLY?.init();})
    .catch(error=>{console.error(error);document.body.insertAdjacentHTML('beforeend','<div style="position:fixed;left:12px;right:12px;bottom:12px;padding:14px;background:#3b2427;color:#d6ddd8;border-radius:12px;z-index:999">앱을 불러오지 못했습니다. 새로고침해 주세요.</div>')});
})();