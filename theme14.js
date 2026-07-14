(() => {
  'use strict';
  function init(){
    if(document.querySelector('#ygo-theme14')) return;
    const s=document.createElement('style');
    s.id='ygo-theme14';
    s.textContent=`
    :root{
      --bg:#050607!important;--surface:#0b0d10!important;--surface-2:#111419!important;--surface-3:#181c22!important;
      --line:rgba(255,255,255,.07)!important;--text:#f5f7f9!important;--muted:#858b94!important;
      --accent-cyan:#64ffe0!important;--accent-blue:#53a7ff!important;--accent-violet:#a98cff!important;--accent-pink:#ff5ebc!important;--accent-orange:#ffb347!important;--accent-lime:#b7ff5f!important;
      --blue:var(--accent-blue)!important;--blue-2:var(--accent-violet)!important;--cyan:var(--accent-cyan)!important;--green:var(--accent-lime)!important;--red:#ff6f7d!important;
    }
    html{background:#040506!important}body{background:radial-gradient(circle at 12% -8%,rgba(83,167,255,.065),transparent 28%),radial-gradient(circle at 93% 8%,rgba(169,140,255,.055),transparent 24%),linear-gradient(180deg,#040506,#080a0d)!important}.ambient{display:none!important}
    .card{background:linear-gradient(145deg,rgba(17,20,24,.98),rgba(8,10,13,.99))!important;border-color:rgba(255,255,255,.07)!important;box-shadow:0 16px 38px rgba(0,0,0,.42)!important}
    .app-header h1 span{color:var(--accent-cyan)!important;text-shadow:0 0 18px rgba(100,255,224,.28)}
    .bottom-nav{background:rgba(4,5,6,.97)!important;border-color:rgba(255,255,255,.06)!important;box-shadow:0 -16px 34px rgba(0,0,0,.4)!important}.bottom-tab{color:#737983!important}.bottom-tab.active{color:var(--accent-cyan)!important;text-shadow:0 0 12px rgba(100,255,224,.35)}
    .button.primary,.today-button,.session-start{background:linear-gradient(135deg,var(--accent-cyan),#3fd6ff)!important;color:#03110d!important;border:0!important;box-shadow:0 0 20px rgba(100,255,224,.24)!important}.button.secondary,.mini-button,.text-button{background:#12161b!important;color:#d8dce1!important;border:1px solid rgba(255,255,255,.08)!important}.button.secondary:hover,.mini-button:hover{border-color:rgba(83,167,255,.45)!important;color:var(--accent-blue)!important}
    .video-link{background:rgba(255,94,188,.1)!important;border:1px solid rgba(255,94,188,.4)!important;color:var(--accent-pink)!important;box-shadow:0 0 16px rgba(255,94,188,.12)!important}.video-link:hover{background:rgba(255,94,188,.18)!important}
    .progress i{background:linear-gradient(90deg,var(--accent-blue),var(--accent-violet),var(--accent-cyan))!important;box-shadow:0 0 14px rgba(83,167,255,.25)!important}
    .part-card{background:linear-gradient(145deg,#12151a,#090b0e)!important;border-color:rgba(255,255,255,.07)!important}.part-card[data-part="chest"] .part-icon{color:var(--accent-pink)!important;border-color:rgba(255,94,188,.3)!important;background:rgba(255,94,188,.06)!important}.part-card[data-part="back"] .part-icon{color:var(--accent-blue)!important;border-color:rgba(83,167,255,.3)!important;background:rgba(83,167,255,.06)!important}.part-card[data-part="shoulders"] .part-icon{color:var(--accent-violet)!important;border-color:rgba(169,140,255,.3)!important;background:rgba(169,140,255,.06)!important}.part-card[data-part="legs"] .part-icon{color:var(--accent-orange)!important;border-color:rgba(255,179,71,.3)!important;background:rgba(255,179,71,.06)!important}.part-card[data-part="biceps"] .part-icon{color:var(--accent-cyan)!important;border-color:rgba(100,255,224,.3)!important;background:rgba(100,255,224,.06)!important}.part-card[data-part="triceps"] .part-icon{color:var(--accent-lime)!important;border-color:rgba(183,255,95,.3)!important;background:rgba(183,255,95,.06)!important}.part-card[data-part="core"] .part-icon{color:#ffd65f!important;border-color:rgba(255,214,95,.3)!important;background:rgba(255,214,95,.06)!important}.part-card[data-part="cardio"] .part-icon{color:#ff6f7d!important;border-color:rgba(255,111,125,.3)!important;background:rgba(255,111,125,.06)!important}.part-card.rest .part-icon{color:#9ca4ae!important}
    .part-card.selected{border-color:currentColor!important;box-shadow:0 0 0 1px currentColor,0 0 22px rgba(100,255,224,.12)!important}.custom-set.done{background:var(--accent-cyan)!important;color:#06110e!important;box-shadow:0 0 18px rgba(100,255,224,.35)!important}.chip{background:#0f1216!important;border-color:rgba(255,255,255,.065)!important}
    .date-status,.session-status.done,.day-complete-banner{color:var(--accent-lime)!important;border-color:rgba(183,255,95,.3)!important;background:rgba(183,255,95,.09)!important}.session-time{color:var(--accent-cyan)!important}.session-finish:not([disabled]){color:var(--accent-lime)!important;border-color:rgba(183,255,95,.25)!important;box-shadow:0 0 15px rgba(183,255,95,.1)!important}
    input,select{background:#07090c!important;border-color:rgba(255,255,255,.075)!important;color:var(--text)!important}.food-add{background:rgba(100,255,224,.09)!important;color:var(--accent-cyan)!important;border-color:rgba(100,255,224,.25)!important}.filter-chip.active{background:rgba(83,167,255,.13)!important;color:var(--accent-blue)!important;border-color:rgba(83,167,255,.38)!important}
    .summary-item:nth-child(1){border-top:1px solid rgba(100,255,224,.22)!important}.summary-item:nth-child(2){border-top:1px solid rgba(255,179,71,.22)!important}.summary-item:nth-child(3){border-top:1px solid rgba(183,255,95,.22)!important}.summary-item:nth-child(4){border-top:1px solid rgba(169,140,255,.22)!important}
    `;
    document.head.appendChild(s);
  }
  window.YGO_THEME14={init};
})();