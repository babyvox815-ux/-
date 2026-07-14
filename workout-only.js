(() => {
  'use strict';
  const css=`
  :root{
    --bg:#050706!important;--surface:#0b0f0d!important;--surface-2:#111713!important;--surface-3:#172019!important;
    --line:rgba(154,255,98,.12)!important;--text:#d9e1dc!important;--muted:#87918b!important;
    --cyan:#9aff62!important;--blue:#9aff62!important;--green:#9aff62!important;--red:#c9787f!important;
  }
  html,body{background:#050706!important;color:var(--text)!important}body{background:linear-gradient(180deg,#050706 0%,#080b09 100%)!important}.ambient{display:none!important}
  *{border-color:var(--line)}
  .app-shell{width:min(980px,calc(100% - 24px))!important;margin:auto!important}.app-header{padding:18px 0 10px!important}.app-header .eyebrow{color:#737e77!important}.app-header h1{font-size:clamp(24px,5vw,34px)!important;color:#cfd7d2!important}.app-header h1 span{color:var(--cyan)!important;text-shadow:0 0 14px rgba(154,255,98,.18)!important}.app-header .icon-button{display:none!important}
  .card{background:#0b0f0d!important;border:1px solid var(--line)!important;border-radius:18px!important;box-shadow:0 12px 28px rgba(0,0,0,.34)!important}
  .label,.eyebrow{color:#96a198!important}.subtext,.muted,p{color:var(--muted)}
  .date-hero{padding:18px!important}.date-control{gap:8px!important}.date-arrow,.date-picker-button,.today-button,.mini-button,.button,.session-button{min-height:42px!important;border-radius:12px!important}
  .date-arrow,.date-picker-button,.mini-button,.button.secondary,.session-finish{background:#111713!important;color:#b8c2bc!important;border:1px solid var(--line)!important}.date-arrow:hover,.date-picker-button:hover,.mini-button:hover{border-color:rgba(154,255,98,.38)!important;color:var(--cyan)!important}
  .today-button,.button.primary,.session-start{background:var(--cyan)!important;color:#071006!important;border:0!important;box-shadow:0 0 16px rgba(154,255,98,.18)!important}
  .week-strip{display:grid!important;grid-template-columns:repeat(7,1fr)!important;gap:7px!important}.week-day{min-width:0!important;padding:10px 5px!important;border-radius:12px!important;background:#0f1411!important;border-color:var(--line)!important;color:#9aa49e!important}.week-day.selected{background:#17231a!important;border-color:rgba(154,255,98,.5)!important;color:var(--cyan)!important;box-shadow:inset 0 0 0 1px rgba(154,255,98,.08)!important}.week-day.today{color:#b7c0ba!important}
  .activity-section{margin-top:16px!important}.section-heading,.compact-heading{margin:0 0 10px!important}.section-heading h2,.compact-heading h2{font-size:22px!important;color:#d4ddd7!important}.subtext{font-size:13px!important}
  .part-grid{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:9px!important}.part-card{min-height:108px!important;padding:14px!important;border-radius:15px!important;background:#0f1411!important;box-shadow:none!important;color:#cbd4ce!important}.part-card:hover{transform:none!important;border-color:rgba(154,255,98,.28)!important}.part-card.selected{background:#162019!important;border-color:rgba(154,255,98,.58)!important;box-shadow:inset 0 0 0 1px rgba(154,255,98,.1)!important}.part-icon{width:38px!important;height:38px!important;border-radius:11px!important;background:#151b17!important;color:#9ba69f!important;border-color:var(--line)!important}.part-card.selected .part-icon{color:var(--cyan)!important;border-color:rgba(154,255,98,.28)!important;background:#18221a!important}.part-card h3{font-size:16px!important;margin:9px 0 3px!important;color:#cfd8d2!important}.part-card p{font-size:11px!important}.part-toolbar{margin-top:9px!important;padding:12px 14px!important}
  .selected-day-card{margin-top:14px!important;padding:16px!important}.selected-day-head{align-items:center!important}.summary-grid{grid-template-columns:1fr!important}.summary-item{padding:12px!important;background:#0f1411!important}.summary-item:not(:first-child){display:none!important}.date-overview-grid{display:none!important}
  #workout .context-bar{margin-top:0!important;padding:13px 15px!important}.session-card{margin:10px 0!important;padding:14px!important}.session-time{color:var(--cyan)!important}.session-status,.date-status{background:#141a16!important;color:#aab4ae!important;border:1px solid var(--line)!important}.session-status.done,.day-complete-banner{background:#17231a!important;color:var(--cyan)!important;border-color:rgba(154,255,98,.32)!important}.session-finish:not([disabled]){border-color:rgba(154,255,98,.35)!important;color:var(--cyan)!important;box-shadow:none!important}
  .custom-workout-head{margin:14px 0 10px!important}.workout-summary{padding:14px!important}.progress{height:7px!important;background:#151b17!important}.progress i{background:var(--cyan)!important;box-shadow:0 0 10px rgba(154,255,98,.2)!important}.exercise-list{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:10px!important}.custom-exercise{padding:15px!important;min-width:0!important;background:#0d120f!important}.custom-exercise h3{font-size:18px!important;color:#d2dbd5!important}.custom-meta{gap:6px!important}.chip{background:#121813!important;border:1px solid var(--line)!important;color:#aeb8b1!important}.video-link{margin-left:0!important;background:#131a15!important;border:1px solid rgba(154,255,98,.28)!important;color:var(--cyan)!important;box-shadow:none!important}.video-link:hover{background:#18221a!important}.custom-set{border-radius:10px!important;background:#151b17!important;color:#aeb8b1!important;border-color:var(--line)!important}.custom-set.done{background:var(--cyan)!important;color:#061006!important;box-shadow:0 0 12px rgba(154,255,98,.2)!important}
  .bottom-nav{width:min(420px,calc(100% - 24px))!important;left:50%!important;transform:translateX(-50%)!important;grid-template-columns:1fr 1fr!important;background:rgba(5,7,6,.97)!important;border:1px solid var(--line)!important;border-radius:16px!important;bottom:10px!important;padding:6px!important}.bottom-tab{border-radius:11px!important;color:#828c86!important}.bottom-tab.active{background:#151d17!important;color:var(--cyan)!important;text-shadow:none!important}
  .line-icon{color:currentColor!important}.toast{background:#101611!important;color:#cbd4ce!important;border:1px solid var(--line)!important}
  main{padding-bottom:94px!important}
  @media(max-width:760px){.part-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}.exercise-list{grid-template-columns:1fr!important}.date-hero-top{align-items:flex-start!important}.selected-day-head{align-items:flex-start!important;flex-direction:column!important}.selected-day-head .button{width:100%!important}.week-strip{gap:5px!important}.week-day{padding:8px 2px!important}.session-card{grid-template-columns:1fr!important}.session-actions{width:100%!important}.session-button{flex:1!important}}
  `;
  function simplify(){
    ['diet','history','record'].forEach(id=>document.getElementById(id)?.remove());
    document.querySelectorAll('.bottom-tab').forEach(btn=>{if(!['date','workout'].includes(btn.dataset.tab))btn.remove()});
    document.querySelector('.date-overview-grid')?.remove();
    const summary=document.querySelector('.summary-grid');if(summary){[...summary.children].slice(1).forEach(x=>x.remove())}
    document.querySelector('[data-action="open-settings"]')?.remove();
    document.getElementById('settingsModal')?.remove();
    document.getElementById('customFoodModal')?.remove();
    document.querySelectorAll('[data-tab="diet"],[data-tab="history"],[data-tab="record"]').forEach(x=>x.remove());
    const h=document.querySelector('.app-header h1');if(h)h.innerHTML='YONGHO <span>WORKOUT</span>';
    const eyebrow=document.querySelector('.app-header .eyebrow');if(eyebrow)eyebrow.textContent='DAILY TRAINING LOG';
    const daily=document.querySelector('.activity-section .section-heading h2');if(daily)daily.textContent='오늘 운동 부위';
    const dailySub=document.querySelector('.activity-section .subtext');if(dailySub)dailySub.textContent='부위를 선택해 조합하고 세트를 체크하세요.';
    const summaryLabel=document.querySelector('#selectedDayCard .label');if(summaryLabel)summaryLabel.textContent='WORKOUT SUMMARY';
    const cta=document.getElementById('selectedActivityCta');if(cta)cta.textContent='운동 열기';
    document.querySelectorAll('[data-action="go-tab"][data-tab="date"]').forEach(b=>{if(b.closest('.bottom-nav'))return;b.textContent='날짜·부위 변경'});
    document.querySelectorAll('[data-action="go-tab"][data-tab="workout"]').forEach(b=>{if(!b.closest('.bottom-nav'))b.textContent='운동 열기'});
  }
  function init(){const s=document.createElement('style');s.id='workout-only-style';s.textContent=css;document.head.appendChild(s);simplify();new MutationObserver(()=>{clearTimeout(init.t);init.t=setTimeout(simplify,80)}).observe(document.body,{childList:true,subtree:true})}
  window.YGO_WORKOUT_ONLY={init};
})();