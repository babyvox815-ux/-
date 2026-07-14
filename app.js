(() => {
  const load = src => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
  load('./data.js?v=6')
    .then(() => load('./core1.js?v=6'))
    .then(() => load('./core2.js?v=6'))
    .catch(error => { console.error(error); document.body.insertAdjacentHTML('beforeend','<div style="position:fixed;inset:auto 12px 12px;padding:14px;background:#7a1f2a;color:white;border-radius:12px;z-index:999">앱 로딩 중 오류가 발생했습니다. 새로고침해 주세요.</div>'); });
})();
