(() => {
  'use strict';
  const paths={
    calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
    dumbbell:'<path d="M6 7v10M18 7v10M3 9v6M21 9v6M6 12h12"/>',
    food:'<path d="M7 3v8M4 3v5a3 3 0 0 0 6 0V3M7 11v10M15 3v18M15 3c4 2 5 7 2 10h-2"/>',
    history:'<path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5M12 7v5l3 2"/>',
    body:'<circle cx="12" cy="5" r="2.5"/><path d="M8 22l1-7-3-3 2-5h8l2 5-3 3 1 7M9 15h6"/>',
    play:'<circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4z"/>',
    check:'<circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/>',
    timer:'<circle cx="12" cy="13" r="8"/><path d="M9 2h6M12 13l3-2M12 5v2"/>',
    settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21H9.6v-.1A1.7 1.7 0 0 0 8.5 19a1.7 1.7 0 0 0-1.9.3l-.1.1-2.8-2.8.1-.1A1.7 1.7 0 0 0 4.1 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H2V9.6h.4A1.7 1.7 0 0 0 4.1 8a1.7 1.7 0 0 0-.3-1.9l-.1-.1 2.8-2.8.1.1A1.7 1.7 0 0 0 8.5 4a1.7 1.7 0 0 0 1-.6A1.7 1.7 0 0 0 9.9 2H14v.1A1.7 1.7 0 0 0 15 4a1.7 1.7 0 0 0 1.9-.3l.1-.1 2.8 2.8-.1.1A1.7 1.7 0 0 0 19.4 8c.2.4.4.7.6 1 .3.3.7.4 1.1.4h.1v4.1h-.1A1.7 1.7 0 0 0 19.4 15Z"/>',
    chest:'<path d="M6 20V9c0-3 2-5 6-5s6 2 6 5v11M6 11c2-2 4-2 6 0 2-2 4-2 6 0M12 4v16"/>',
    back:'<path d="M8 4c-2 2-3 5-3 8s1 6 3 8M16 4c2 2 3 5 3 8s-1 6-3 8M8 8c2 2 6 2 8 0M8 16c2-2 6-2 8 0M12 4v16"/>',
    shoulders:'<path d="M4 13c0-4 3-7 8-7s8 3 8 7M7 13v7M17 13v7M8 8l4 4 4-4"/>',
    legs:'<path d="M9 3h6l1 7-2 11h-3l1-9-1 9H8L6 10z"/>',
    arms:'<path d="M5 15c2-5 4-7 7-7 2 0 3 1 4 3l3 1-2 5-4-1c-2 3-5 4-8 2z"/>',
    core:'<rect x="7" y="3" width="10" height="18" rx="4"/><path d="M12 3v18M7 9h10M7 15h10"/>',
    cardio:'<path d="M3 12h4l2-5 4 10 2-5h6"/>',
    rest:'<path d="M20 15a8 8 0 1 1-11-11 7 7 0 0 0 11 11Z"/>',
    video:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m10 9 5 3-5 3z"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',
    trash:'<path d="M4 7h16M9 7V4h6v3M8 11v6M12 11v6M16 11v6M6 7l1 14h10l1-14"/>'
  };
  function icon(name,cls='line-icon'){return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||paths.dumbbell}</svg>`}
  function replace(){
    const map={date:['calendar','날짜'],workout:['dumbbell','운동'],diet:['food','식단'],history:['history','기록'],record:['body','신체']};
    document.querySelectorAll('.bottom-tab[data-tab]').forEach(btn=>{const m=map[btn.dataset.tab];if(m)btn.innerHTML=`${icon(m[0])}<span>${m[1]}</span>`});
    document.querySelectorAll('[data-action="open-settings"]').forEach(btn=>btn.innerHTML=icon('settings'));
    document.querySelectorAll('.video-link').forEach(a=>{if(!a.querySelector('svg'))a.innerHTML=`${icon('video')}<span>영상 보기</span>`});
    document.querySelectorAll('.session-start').forEach(b=>{if(!b.querySelector('svg'))b.innerHTML=`${icon('play')}<span>${b.textContent.trim()}</span>`});
    document.querySelectorAll('.session-finish').forEach(b=>{if(!b.querySelector('svg'))b.innerHTML=`${icon('check')}<span>운동 완료</span>`});
  }
  function init(){const s=document.createElement('style');s.textContent='.line-icon{width:20px;height:20px;display:inline-block;flex:0 0 auto}.bottom-tab{gap:4px}.bottom-tab .line-icon{width:21px;height:21px}.video-link,.session-button,.mini-button,.button{display:inline-flex;align-items:center;justify-content:center;gap:7px}.part-icon .line-icon{width:30px;height:30px}.icon-button .line-icon{width:20px;height:20px}';document.head.appendChild(s);replace();new MutationObserver(()=>{clearTimeout(init.t);init.t=setTimeout(replace,50)}).observe(document.body,{childList:true,subtree:true})}
  window.YGO_ICONS={icon,init};
})();