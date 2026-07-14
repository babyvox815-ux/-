(() => {
  'use strict';
  const APP_KEY = 'yongho-gym-os-v8';
  const META_KEY = 'ygo-habit-foods-v1';

  const BASE = [
    {id:'egg2', name:'계란후라이 2개', meal:'아침', kcal:140, p:12, c:1, f:10},
    {id:'broccoli', name:'브로콜리 한 줌', meal:'아침', kcal:30, p:2.5, c:5, f:.3},
    {id:'tofu90', name:'연두부 90g', meal:'아침', kcal:50, p:4.5, c:2, f:2.5},
    {id:'yogurt70', name:'매일 바이오 무가당 그릭요거트 70g', meal:'아침', kcal:61, p:6, c:3.3, f:2.5},
    {id:'blueberry20', name:'냉동 블루베리 20알', meal:'아침', kcal:20, p:.2, c:5, f:.1},
    {id:'almond20', name:'아몬드 20알', meal:'아침', kcal:140, p:5, c:5, f:12},
    {id:'habit-lunchbase', name:'점심 자유식 · 기본 추정', meal:'점심', kcal:700, p:30, c:85, f:24, custom:true}
  ];
  const WORKOUT = [
    {id:'premeal', name:'닭가슴살 김치볶음밥', meal:'운동 전', kcal:420, p:25, c:55, f:10},
    {id:'habit-egg1', name:'계란 1개', meal:'운동 전', kcal:70, p:6, c:.5, f:5, custom:true},
    {id:'combat', name:'컴뱃 웨이 프로틴 1스쿱', meal:'운동 후', kcal:120, p:24, c:4, f:2}
  ];
  const DEFAULT_NAMES = new Set([...BASE, ...WORKOUT].map(x => x.name));
  let queue = Promise.resolve();

  const today = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  };
  const uid = () => `habit-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const read = key => { try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; } };
  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const hasItem = (list, item) => list.some(x => x.id === item.id || x.name === item.name);
  const entry = item => ({...item, entryId:uid(), qty:1, isHabitDefault:true});

  function preseed(){
    const state = read(APP_KEY) || {activeTab:'date', selectedDate:today(), intakeByDate:{}, scheduleByDate:{}};
    state.selectedDate ||= today();
    state.intakeByDate ||= {};
    state.scheduleByDate ||= {};
    const meta = read(META_KEY) || {};
    const date = state.selectedDate;
    meta[date] ||= {base:false, workout:false};
    const list = state.intakeByDate[date] ||= [];
    if(!meta[date].base){ BASE.forEach(item => { if(!hasItem(list,item)) list.push(entry(item)); }); meta[date].base = true; }
    if(state.scheduleByDate[date]?.type === 'workout' && !meta[date].workout){ WORKOUT.forEach(item => { if(!hasItem(list,item)) list.push(entry(item)); }); meta[date].workout = true; }
    write(APP_KEY,state); write(META_KEY,meta);
  }

  function current(){
    const state = read(APP_KEY) || {};
    const date = state.selectedDate || today();
    const list = state.intakeByDate?.[date] || [];
    return {state,date,list};
  }

  const wait = ms => new Promise(resolve => setTimeout(resolve,ms));

  async function addThroughApp(item){
    const {list} = current();
    if(hasItem(list,item)) return;
    const button = !item.custom && document.querySelector(`[data-action="add-food"][data-id="${item.id}"]`);
    if(button){ button.click(); await wait(45); return; }
    const form = document.querySelector('#customFoodForm');
    if(!form) return;
    document.querySelector('#customFoodName').value = item.name;
    document.querySelector('#customFoodMeal').value = item.meal;
    document.querySelector('#customFoodCalories').value = item.kcal;
    document.querySelector('#customFoodProtein').value = item.p;
    document.querySelector('#customFoodCarbs').value = item.c;
    document.querySelector('#customFoodFat').value = item.f;
    form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));
    await wait(55);
  }

  async function ensureSelected(force=false){
    const {state,date} = current();
    const meta = read(META_KEY) || {};
    meta[date] ||= {base:false,workout:false};
    if(force || !meta[date].base){ for(const item of BASE) await addThroughApp(item); meta[date].base = true; }
    if(state.scheduleByDate?.[date]?.type === 'workout' && (force || !meta[date].workout)){ for(const item of WORKOUT) await addThroughApp(item); meta[date].workout = true; }
    write(META_KEY,meta);
    updateBanner(); decorateDefaults();
  }

  function scheduleEnsure(force=false){ queue = queue.then(()=>ensureSelected(force)).catch(console.error); }

  function injectStyles(){
    if(document.querySelector('#habit-default-style')) return;
    const style = document.createElement('style');
    style.id = 'habit-default-style';
    style.textContent = `
      .habit-default-card{display:flex;justify-content:space-between;gap:18px;align-items:center;padding:19px;margin-bottom:13px;border-color:rgba(73,225,218,.3)!important}
      .habit-default-card h3{margin:4px 0 6px}.habit-default-card p{margin:0;color:var(--muted);line-height:1.55}
      .habit-default-actions{text-align:right;min-width:240px}.habit-default-summary{display:block;color:var(--muted);font-size:12px;margin-bottom:9px}
      .habit-default-badge{display:inline-flex;margin-left:7px;padding:3px 6px;border-radius:999px;background:rgba(92,224,160,.14);color:var(--green);font-size:9px;font-weight:850;vertical-align:middle}
      @media(max-width:700px){.habit-default-card{align-items:stretch;flex-direction:column}.habit-default-actions{text-align:left;min-width:0}}
    `;
    document.head.appendChild(style);
  }

  function injectBanner(){
    if(document.querySelector('#habitDefaultCard')) return;
    const anchor = document.querySelector('#diet .nutrition-summary');
    if(!anchor) return;
    const card = document.createElement('section');
    card.id = 'habitDefaultCard';
    card.className = 'habit-default-card card';
    card.innerHTML = `<div><p class="label">AUTO DAILY ROUTINE</p><h3>용호 기본 식단</h3><p>아침 고정식과 점심 자유식 추정치가 날짜마다 먼저 들어갑니다. 운동일에는 운동 전 식사와 프로틴도 자동 추가됩니다. 안 먹은 음식은 목록의 ×로 빼세요.</p></div><div class="habit-default-actions"><span class="habit-default-summary" id="habitDefaultSummary"></span><button class="button primary" type="button" id="restoreHabitDefaults">기본 식단 다시 채우기</button></div>`;
    anchor.before(card);
    document.querySelector('#restoreHabitDefaults').addEventListener('click',()=>scheduleEnsure(true));
  }

  function totals(items){ return items.reduce((s,x)=>({kcal:s.kcal+x.kcal,p:s.p+x.p}),{kcal:0,p:0}); }
  function updateBanner(){
    const el = document.querySelector('#habitDefaultSummary'); if(!el) return;
    const {state,date} = current();
    const base = totals(BASE), work = totals(WORKOUT);
    const workout = state.scheduleByDate?.[date]?.type === 'workout';
    el.textContent = workout ? `기본+운동식 약 ${base.kcal+work.kcal} kcal · 단백질 ${(base.p+work.p).toFixed(1)}g` : `기본 약 ${base.kcal} kcal · 단백질 ${base.p.toFixed(1)}g`;
  }

  function decorateDefaults(){
    document.querySelectorAll('#intakeList .intake-row').forEach(row => {
      const strong = row.querySelector('.intake-info strong'); if(!strong || strong.querySelector('.habit-default-badge')) return;
      const name = [...strong.childNodes].filter(n=>n.nodeType===Node.TEXT_NODE).map(n=>n.textContent).join('').trim();
      if(DEFAULT_NAMES.has(name)){ const badge=document.createElement('span'); badge.className='habit-default-badge'; badge.textContent='기본'; strong.appendChild(badge); }
    });
  }

  function observe(){
    const list = document.querySelector('#intakeList');
    if(list) new MutationObserver(()=>decorateDefaults()).observe(list,{childList:true,subtree:true});
  }

  function init(){
    injectStyles(); injectBanner(); updateBanner(); decorateDefaults(); observe();
    document.addEventListener('click',event=>{
      const target = event.target.closest('[data-action]'); if(!target) return;
      const action = target.dataset.action;
      if(['go-today','shift-date','select-date','open-history-date','select-activity'].includes(action)) setTimeout(()=>scheduleEnsure(false),0);
      if(['remove-food','increase-food','decrease-food','add-food','clear-intake'].includes(action)) setTimeout(()=>{updateBanner();decorateDefaults();},80);
    });
    const picker = document.querySelector('#datePicker');
    if(picker) picker.addEventListener('change',()=>setTimeout(()=>scheduleEnsure(false),0));
    scheduleEnsure(false);
  }

  preseed();
  window.YGO_DEFAULTS = {init};
})();