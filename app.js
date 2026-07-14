(() => {
  'use strict';

  const STORAGE_KEY = 'yongho-gym-os-v8';
  const LEGACY_KEYS = ['yongho-gym-os-v5','yongho-gym-os-v7'];
  const MEALS = ['전체','아침','점심','운동 전','운동 후','저녁','간식'];
  const REST_ITEMS = [
    {id:'sleep',title:'수면 7시간 이상',desc:'회복을 위해 충분한 수면을 확보했어요.'},
    {id:'walk',title:'가벼운 걷기 20–30분',desc:'대화 가능한 강도로 혈류만 가볍게 올려요.'},
    {id:'mobility',title:'전신 가동성 10분',desc:'고관절·흉추·어깨를 통증 없는 범위에서 움직여요.'},
    {id:'water',title:'수분 충분히 섭취',desc:'운동하지 않는 날에도 물 섭취를 유지해요.'},
    {id:'protein',title:'단백질 목표 유지',desc:'회복일에도 단백질 섭취량은 줄이지 않아요.'},
    {id:'fullrest',title:'완전 휴식 선택',desc:'피로가 높다면 걷기 대신 완전히 쉬어도 괜찮아요.'}
  ];

  const PLANS = [
    {
      title:'하체 · 어깨',short:'하체/어깨',icon:'◇',note:'하체 대근육을 먼저 끝낸 뒤 어깨 운동으로 이동합니다.',
      exercises:[
        ex('바벨 스쿼트',4,'6–10회',150,'legs','내려갈 때 2–3초 동안 대퇴사두와 둔근을 이완','발바닥 전체로 바닥을 밀며 둔근 수축','무릎과 발끝 방향을 맞추고 허리 말림을 피하세요.'),
        ex('레그프레스',4,'10–15회',120,'legs','무릎을 접으며 대퇴사두와 둔근을 충분히 이완','발판을 밀며 허벅지 앞쪽을 강하게 수축','엉덩이가 패드에서 뜨기 전까지만 내려가세요.'),
        ex('레그컬',3,'10–15회',90,'ham','무릎이 펴지는 구간에서 햄스트링 이완','뒤꿈치를 엉덩이 방향으로 당기며 수축','골반이 들리지 않게 패드에 고정하세요.'),
        ex('레그익스텐션',3,'12–15회',75,'quads','무릎을 충분히 접어 대퇴사두 이완','위에서 무릎을 펴며 1초 수축','반동 없이 천천히 수행하세요.'),
        ex('머신 숄더프레스',4,'8–12회',120,'shoulders','손잡이를 통제하며 내려 어깨 이완','머리 위로 밀며 전면·측면 삼각근 수축','허리를 과하게 젖히지 마세요.'),
        ex('사이드 레터럴 레이즈',4,'12–20회',60,'shoulders','팔을 내리며 측면 삼각근 이완','팔꿈치를 옆으로 멀리 보내며 수축','승모근으로 으쓱하지 마세요.'),
        ex('리버스 펙덱',3,'12–20회',60,'rear','팔이 앞쪽으로 갈 때 후면 삼각근 이완','팔꿈치를 벌리며 후면 어깨 수축','견갑을 과하게 모으지 마세요.')
      ]
    },
    {
      title:'가슴 · 삼두',short:'가슴/삼두',icon:'◈',note:'가슴 프레스류를 먼저 진행한 뒤 삼두를 마무리합니다.',
      exercises:[
        ex('벤치프레스',4,'6–10회',150,'chest','바를 가슴 쪽으로 통제하며 내려 가슴 이완','가슴을 유지한 채 위로 밀며 수축','어깨가 앞으로 말리지 않게 견갑을 고정하세요.'),
        ex('인클라인 프레스',3,'8–12회',120,'upperchest','윗가슴이 늘어나는 범위까지 천천히 내리기','팔을 모으며 윗가슴 수축','벤치 각도를 너무 높이지 마세요.'),
        ex('체스트프레스 머신',3,'10–15회',90,'chest','손잡이를 뒤로 보내 가슴 이완','팔꿈치를 모으며 가슴 수축','어깨가 들썩이지 않게 고정하세요.'),
        ex('케이블 플라이',3,'12–15회',75,'chest','가슴이 늘어날 때까지 팔 벌리기','큰 원을 그리며 양손 모으기','팔꿈치 각도를 일정하게 유지하세요.'),
        ex('케이블 푸시다운',4,'10–15회',75,'triceps','팔꿈치를 굽혀 삼두 이완','아래에서 팔을 펴며 1초 수축','팔꿈치 위치가 움직이지 않게 하세요.'),
        ex('오버헤드 익스텐션',3,'10–15회',75,'triceps','팔꿈치를 접어 삼두 장두 이완','머리 위로 펴며 삼두 수축','갈비뼈가 들리지 않게 복부를 고정하세요.')
      ]
    },
    {
      title:'등 · 이두',short:'등/이두',icon:'◆',note:'수직 당기기 후 수평 당기기, 마지막에 이두를 진행합니다.',
      exercises:[
        ex('랫풀다운',4,'8–12회',120,'back','팔을 위로 보내 광배를 길게 이완','팔꿈치를 골반 쪽으로 당기며 광배 수축','몸을 과하게 뒤로 젖히지 마세요.'),
        ex('시티드 케이블 로우',4,'8–12회',120,'back','어깨를 앞으로 보내 등 중앙 이완','팔꿈치를 뒤로 보내 등 수축','허리 반동을 사용하지 마세요.'),
        ex('원암 덤벨 로우',3,'10–12회',90,'back','덤벨을 아래로 보내 광배 이완','팔꿈치를 엉덩이 방향으로 당기기','몸통 회전을 최소화하세요.'),
        ex('스트레이트암 풀다운',3,'12–15회',75,'back','팔을 위로 보내 광배 이완','겨드랑이를 닫으며 허벅지 쪽으로 당기기','팔꿈치 굽힘을 최소화하세요.'),
        ex('바벨컬',3,'8–12회',90,'biceps','팔꿈치를 펴 이두를 충분히 이완','손바닥을 위로 유지하며 이두 수축','상체 반동을 사용하지 마세요.'),
        ex('해머컬',3,'10–15회',75,'biceps','덤벨을 아래로 통제하며 이완','엄지 방향으로 들어 올리며 상완근 수축','손목이 꺾이지 않게 유지하세요.')
      ]
    }
  ];

  const FOODS = [
    food('egg2','계란후라이 2개','아침',140,12,1,10),
    food('tofu90','연두부 90g','아침',50,4.5,2,2.5),
    food('broccoli','브로콜리 한 줌','아침',30,2.5,5,0.3),
    food('cabbage','찐 양배추','아침',35,1.5,8,0.2),
    food('yogurt70','매일 바이오 무가당 그릭요거트 70g','아침',61,6,3.3,2.5),
    food('blueberry20','냉동 블루베리 20알','아침',20,0.2,5,0.1),
    food('almond20','아몬드 20알','아침',140,5,5,12),
    food('rice100','쌀밥 100g','점심',150,3,33,0.3),
    food('rice150','쌀밥 150g','저녁',225,4.5,50,0.5),
    food('kimchirice','김치볶음밥 1인분','점심',520,14,78,17),
    food('galbijjim','갈비찜 1인분','점심',650,38,28,42),
    food('ramen','라면 1개','점심',500,10,79,16),
    food('pizza2','피자 2조각','점심',600,24,64,28),
    food('friedchicken','후라이드 치킨 5조각','점심',700,45,30,45),
    food('premeal','닭가슴살 김치볶음밥','운동 전',420,25,55,10),
    food('banana','바나나 1개','운동 전',105,1.3,27,0.3),
    food('combat','컴뱃 웨이 프로틴 1스쿱','운동 후',120,24,4,2),
    food('steak','닭가슴살 스테이크 1장','저녁',160,20,2,8),
    food('tender5','닭안심 5개','저녁',85,14,3,2),
    food('pork','삼겹살 150g','저녁',520,25,0,46),
    food('seaweed','미역국 1그릇','저녁',70,5,8,2),
    food('bean','콩나물국 1그릇','저녁',45,4,6,1)
  ];

  const defaultState = {
    activeTab:'date',
    selectedDate:todayKey(),
    scheduleByDate:{},
    workoutByDate:{},
    restByDate:{},
    intakeByDate:{},
    bodyLogs:[],
    liftLogs:[],
    filterMeal:'전체',
    foodSearch:'',
    targets:{calories:2500,protein:150,carbs:300,fat:75,startWeight:78,goalWeight:84}
  };

  const $ = selector => document.querySelector(selector);
  const $$ = selector => Array.from(document.querySelectorAll(selector));
  const clamp = (value,min,max) => Math.max(min,Math.min(max,value));
  const round1 = value => Math.round(value*10)/10;
  const uid = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  let state = loadState();
  let timerId = null;
  let timerRemaining = 0;
  let timerName = '';

  function ex(name,sets,reps,rest,muscle,eccentric,concentric,cue){return {name,sets,reps,rest,muscle,eccentric,concentric,cue,query:`${name} 자세 한국 헬스`}}
  function food(id,name,meal,kcal,p,c,f){return {id,name,meal,kcal,p,c,f}}
  function todayKey(){const d=new Date();return dateKey(d)}
  function dateKey(date){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`}
  function parseDate(key){const [y,m,d]=key.split('-').map(Number);return new Date(y,m-1,d,12)}
  function addDays(key,days){const d=parseDate(key);d.setDate(d.getDate()+days);return dateKey(d)}
  function dayDiff(a,b){return Math.round((parseDate(a)-parseDate(b))/86400000)}
  function formatDate(key,options){return new Intl.DateTimeFormat('ko-KR',options).format(parseDate(key))}
  function formatLong(key){return formatDate(key,{month:'long',day:'numeric',weekday:'long'})}
  function clone(value){return window.structuredClone ? structuredClone(value) : JSON.parse(JSON.stringify(value))}

  function loadState(){
    try{
      const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');
      if(saved) return normalize(saved);
      for(const key of LEGACY_KEYS){
        const legacy=JSON.parse(localStorage.getItem(key)||'null');
        if(legacy){
          const migrated={...defaultState,...legacy,selectedDate:todayKey(),activeTab:'date',scheduleByDate:legacy.scheduleByDate||{}};
          return normalize(migrated);
        }
      }
    }catch(error){console.warn('저장 데이터 복구 실패',error)}
    return clone(defaultState);
  }
  function normalize(value){return {...clone(defaultState),...value,targets:{...defaultState.targets,...(value.targets||{})},scheduleByDate:value.scheduleByDate||{},workoutByDate:value.workoutByDate||{},restByDate:value.restByDate||{},intakeByDate:value.intakeByDate||{},bodyLogs:value.bodyLogs||[],liftLogs:value.liftLogs||[]}}
  function saveState(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}
  function selectedActivity(date=state.selectedDate){return state.scheduleByDate[date]||null}
  function workoutState(date=state.selectedDate){if(!state.workoutByDate[date]) state.workoutByDate[date]={};return state.workoutByDate[date]}
  function restState(date=state.selectedDate){if(!state.restByDate[date]) state.restByDate[date]={};return state.restByDate[date]}
  function intake(date=state.selectedDate){if(!state.intakeByDate[date]) state.intakeByDate[date]=[];return state.intakeByDate[date]}
  function nutritionTotals(date=state.selectedDate){return intake(date).reduce((sum,item)=>{const q=item.qty||1;sum.kcal+=item.kcal*q;sum.p+=item.p*q;sum.c+=item.c*q;sum.f+=item.f*q;sum.items+=q;return sum},{kcal:0,p:0,c:0,f:0,items:0})}
  function safePercent(value,target){return target>0?Math.round(value/target*100):0}
  function activityProgress(date=state.selectedDate){
    const activity=selectedActivity(date);
    if(!activity) return {done:0,total:0,pct:0};
    if(activity.type==='rest'){
      const rest=restState(date);const done=REST_ITEMS.filter(item=>rest[item.id]).length;
      return {done,total:REST_ITEMS.length,pct:Math.round(done/REST_ITEMS.length*100)};
    }
    const plan=PLANS[activity.plan];const doneState=workoutState(date);let total=0,done=0;
    plan.exercises.forEach((exercise,eIndex)=>{total+=exercise.sets;for(let s=0;s<exercise.sets;s++) if(doneState[`${activity.plan}-${eIndex}-${s}`]) done++});
    return {done,total,pct:total?Math.round(done/total*100):0};
  }

  function renderAll(){
    renderTabs();
    renderDateHero();
    renderActivity();
    renderDaySummary();
    renderWorkout();
    renderDiet();
    renderHistory();
    renderRecords();
    renderSettings();
  }

  function renderTabs(){
    $$('.view').forEach(view=>view.classList.toggle('active',view.id===state.activeTab));
    $$('[data-action="go-tab"]').forEach(button=>button.classList.toggle('active',button.dataset.tab===state.activeTab));
  }

  function renderDateHero(){
    const key=state.selectedDate;
    const diff=dayDiff(key,todayKey());
    $('#selectedDateTitle').textContent=formatDate(key,{month:'long',day:'numeric'});
    $('#selectedDateSubtitle').textContent=formatDate(key,{year:'numeric',weekday:'long'});
    $('#selectedDateStatus').textContent=diff===0?'오늘':diff===-1?'어제':diff===1?'내일':diff<0?`${Math.abs(diff)}일 전`:`${diff}일 후`;
    $('#datePicker').value=key;
    $('#weekStrip').innerHTML=Array.from({length:7},(_,index)=>{
      const day=addDays(key,index-3);const selected=day===key;const today=day===todayKey();
      return `<button class="week-day ${selected?'selected':''} ${today?'today':''}" type="button" data-action="select-date" data-date="${day}"><small>${formatDate(day,{weekday:'short'})}</small><strong>${parseDate(day).getDate()}</strong>${today?'<small>오늘</small>':'<small>&nbsp;</small>'}</button>`;
    }).join('');
    $('#workoutDateLabel').textContent=formatLong(key);
    $('#dietDateLabel').textContent=formatLong(key);
    $('#bodyDate').value=$('#bodyDate').value||key;
  }

  function renderActivity(){
    const current=selectedActivity();
    const activities=PLANS.map((plan,index)=>({type:'workout',plan:index,title:plan.title,desc:`${plan.exercises.length}개 운동`,icon:plan.icon}));
    activities.push({type:'rest',title:'휴식 · 회복',desc:'완전 휴식 또는 가벼운 회복',icon:'○'});
    $('#activityGrid').innerHTML=activities.map(item=>{
      const selected=current&&(item.type==='rest'?current.type==='rest':current.type==='workout'&&current.plan===item.plan);
      return `<button class="activity-card ${item.type==='rest'?'rest-card':''} ${selected?'selected':''}" type="button" data-action="select-activity" data-type="${item.type}" ${item.plan!==undefined?`data-plan="${item.plan}"`:''}><span class="selected-mark">✓</span><span class="activity-icon">${item.icon}</span><h3>${item.title}</h3><p>${item.desc}</p></button>`;
    }).join('');
  }

  function renderDaySummary(){
    const activity=selectedActivity();const progress=activityProgress();const total=nutritionTotals();
    if(!activity){
      $('#selectedActivityTitle').textContent='아직 활동을 선택하지 않았어요';
      $('#selectedActivityDescription').textContent='위에서 운동 또는 휴식을 선택하세요.';
      $('#selectedActivityCta').textContent='활동 선택';
    }else if(activity.type==='rest'){
      $('#selectedActivityTitle').textContent='휴식 · 회복일';
      $('#selectedActivityDescription').textContent='회복 체크리스트로 수면과 컨디션을 관리하세요.';
      $('#selectedActivityCta').textContent='회복 기록 열기';
    }else{
      $('#selectedActivityTitle').textContent=PLANS[activity.plan].title;
      $('#selectedActivityDescription').textContent=PLANS[activity.plan].note;
      $('#selectedActivityCta').textContent='운동 기록 열기';
    }
    $('#summaryWorkout').textContent=`${progress.pct}%`;
    $('#summaryWorkoutBar').style.width=`${clamp(progress.pct,0,100)}%`;
    $('#summaryCalories').textContent=`${Math.round(total.kcal).toLocaleString()} kcal`;
    $('#summaryCaloriesBar').style.width=`${clamp(safePercent(total.kcal,state.targets.calories),0,100)}%`;
    $('#summaryProtein').textContent=`${round1(total.p)} g`;
    $('#summaryProteinBar').style.width=`${clamp(safePercent(total.p,state.targets.protein),0,100)}%`;
    $('#summaryFoodCount').textContent=`${total.items}개`;
    $('#summaryFoodMeta').textContent=total.items?`${intake().length}종류 기록`:'아직 기록 없음';

    const preview=intake().slice(-5).reverse();
    $('#dateFoodPreview').innerHTML=preview.length?preview.map(item=>`<div class="compact-row"><div><strong>${escapeHtml(item.name)}</strong><span>${item.meal} · ${Math.round(item.kcal*(item.qty||1))} kcal</span></div><strong>${item.qty||1}회</strong></div>`).join(''):'<div class="empty-state">선택한 날짜에 기록된 음식이 없습니다.</div>';
    const coach=coachAnalysis(total,progress,activity);
    $('#dateCoachTitle').textContent=coach.title;
    $('#dateCoachBody').textContent=coach.body;
  }

  function coachAnalysis(total,progress,activity){
    if(!activity&&total.items===0) return {title:'날짜 기록을 시작해보세요',body:'운동 또는 휴식을 선택하고 먹은 음식을 추가하면 그날의 상태를 자동 분석합니다.'};
    if(activity&&progress.pct===100&&total.p>=state.targets.protein*.9) return {title:'운동과 영양 흐름이 좋습니다',body:'선택한 날짜의 운동과 단백질 섭취가 안정적입니다. 수면과 수분을 챙기세요.'};
    if(total.items&&total.p<state.targets.protein*.7&&total.kcal>state.targets.calories*.55) return {title:'단백질 보완이 필요합니다',body:`현재 단백질 ${round1(total.p)}g입니다. 목표까지 약 ${Math.max(0,Math.round(state.targets.protein-total.p))}g 남았습니다.`};
    if(total.items&&total.kcal>state.targets.calories*1.12) return {title:'칼로리가 높은 날입니다',body:'남은 식사는 지방과 소스를 줄이고 담백한 단백질과 채소 위주로 조절하세요.'};
    if(total.items&&total.kcal<state.targets.calories*.65) return {title:'린매스업 섭취량이 낮습니다',body:`목표까지 약 ${Math.max(0,Math.round(state.targets.calories-total.kcal))}kcal 남았습니다. 밥이나 바나나처럼 측정 가능한 탄수화물을 활용하세요.`};
    if(activity&&progress.pct<50) return {title:'활동 기록이 진행 중입니다',body:'완료한 세트나 회복 항목을 누르면 진행률이 자동 반영됩니다.'};
    return {title:'선택한 날짜의 흐름은 적정합니다',body:'운동 진행률과 영양 게이지를 보면서 남은 항목을 차분히 채우세요.'};
  }

  function renderWorkout(){
    const activity=selectedActivity();
    $('#workoutEmpty').hidden=!!activity;
    $('#workoutContent').hidden=!activity||activity.type!=='workout';
    $('#restContent').hidden=!activity||activity.type!=='rest';
    if(!activity) return;
    if(activity.type==='rest'){
      const rest=restState();
      $('#restChecklist').innerHTML=REST_ITEMS.map(item=>`<label class="rest-item card"><input type="checkbox" data-action="toggle-rest" data-id="${item.id}" ${rest[item.id]?'checked':''}><div><h3>${item.title}</h3><p>${item.desc}</p></div></label>`).join('');
      return;
    }
    const plan=PLANS[activity.plan];const progress=activityProgress();const done=workoutState();
    $('#workoutTitle').textContent=plan.title;
    $('#workoutNote').textContent=plan.note;
    $('#workoutProgressText').textContent=`${progress.pct}%`;
    $('#workoutProgressBar').style.width=`${progress.pct}%`;
    $('#workoutProgressMeta').textContent=`${progress.done} / ${progress.total} 세트 완료`;
    $('#exerciseList').innerHTML=plan.exercises.map((exercise,eIndex)=>{
      const sets=Array.from({length:exercise.sets},(_,sIndex)=>{const key=`${activity.plan}-${eIndex}-${sIndex}`;return `<button class="set-button ${done[key]?'done':''}" type="button" data-action="toggle-set" data-key="${key}" data-rest="${exercise.rest}" data-exercise="${escapeHtml(exercise.name)}">${sIndex+1}</button>`}).join('');
      const latest=state.liftLogs.find(log=>log.name===exercise.name);
      return `<article class="exercise-card card"><div class="exercise-top"><div class="exercise-visual"><span class="exercise-tag">${exercise.muscle.toUpperCase()}</span>${muscleSvg(exercise.muscle)}</div><div class="exercise-content"><p class="label">EXERCISE ${eIndex+1}</p><h3>${exercise.name}</h3><div class="chips"><span class="chip">${exercise.sets}세트 · ${exercise.reps}</span><span class="chip">휴식 ${formatRest(exercise.rest)}</span><span class="chip">RIR 1–2</span></div><div class="info-grid"><div class="info-box"><b>이완</b>${exercise.eccentric}</div><div class="info-box"><b>수축</b>${exercise.concentric}</div><div class="info-box"><b>핵심 체크</b>${exercise.cue}</div><div class="info-box"><b>호흡</b>이완 전에 들이마시고 힘쓰는 구간에서 내쉬기</div></div><div class="set-row">${sets}</div><div class="exercise-actions"><a class="video-link" href="https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.query)}" target="_blank" rel="noopener">한국 영상 보기</a><button class="mini-button" type="button" data-action="log-exercise" data-name="${escapeHtml(exercise.name)}">중량 기록</button><span class="latest-record">${latest?`최근 ${latest.weight}kg × ${latest.reps}회 × ${latest.sets}세트`:'최근 기록 없음'}</span></div></div></div></article>`;
    }).join('');
  }

  function muscleSvg(type){
    const map={legs:[[57,105,16,54],[87,105,16,54]],ham:[[57,105,16,54],[87,105,16,54]],quads:[[57,102,16,48],[87,102,16,48]],shoulders:[[36,51,19,14],[105,51,19,14]],rear:[[38,52,17,13],[105,52,17,13]],chest:[[57,62,23,22],[80,62,23,22]],upperchest:[[57,58,23,15],[80,58,23,15]],triceps:[[31,66,11,34],[118,66,11,34]],back:[[54,58,52,54]],biceps:[[30,66,12,30],[118,66,12,30]]};
    const highlights=(map[type]||map.back).map(([x,y,w,h])=>`<rect class="muscle-shape" x="${x}" y="${y}" width="${w}" height="${h}" rx="7"/>`).join('');
    return `<svg viewBox="0 0 160 190" aria-label="사용 근육 도해"><circle class="body-shape" cx="80" cy="24" r="18"/><rect class="body-shape" x="53" y="43" width="54" height="65" rx="22"/><rect class="body-shape" x="28" y="49" width="18" height="62" rx="9"/><rect class="body-shape" x="114" y="49" width="18" height="62" rx="9"/><rect class="body-shape" x="55" y="104" width="20" height="72" rx="10"/><rect class="body-shape" x="85" y="104" width="20" height="72" rx="10"/>${highlights}</svg>`;
  }
  function formatRest(seconds){const m=Math.floor(seconds/60),s=seconds%60;return s?`${m}분 ${s}초`:`${m}분`}

  function renderDiet(){
    const total=nutritionTotals();const caloriePct=safePercent(total.kcal,state.targets.calories);const pPct=safePercent(total.p,state.targets.protein);const cPct=safePercent(total.c,state.targets.carbs);const fPct=safePercent(total.f,state.targets.fat);
    $('#calorieRing').style.setProperty('--progress',clamp(caloriePct,0,100));
    $('#calorieRingText').textContent=Math.round(total.kcal).toLocaleString();
    $('#macroProtein').textContent=`${round1(total.p)}g / ${state.targets.protein}g`;
    $('#macroCarbs').textContent=`${round1(total.c)}g / ${state.targets.carbs}g`;
    $('#macroFat').textContent=`${round1(total.f)}g / ${state.targets.fat}g`;
    $('#macroProteinBar').style.width=`${clamp(pPct,0,100)}%`;
    $('#macroCarbsBar').style.width=`${clamp(cPct,0,100)}%`;
    $('#macroFatBar').style.width=`${clamp(fPct,0,100)}%`;
    const analysis=dietAnalysis(total);
    $('#nutritionHeadline').textContent=analysis.title;$('#nutritionAnalysis').textContent=analysis.body;
    $('#mealFilters').innerHTML=MEALS.map(meal=>`<button class="filter-chip ${state.filterMeal===meal?'active':''}" type="button" data-action="filter-meal" data-meal="${meal}">${meal}</button>`).join('');
    $('#foodSearch').value=state.foodSearch;
    const keyword=state.foodSearch.trim().toLowerCase();
    const visible=FOODS.filter(item=>(state.filterMeal==='전체'||item.meal===state.filterMeal)&&(!keyword||item.name.toLowerCase().includes(keyword)));
    $('#foodGrid').innerHTML=visible.length?visible.map(item=>`<article class="food-card"><div><span class="meal-badge">${item.meal}</span><h4>${item.name}</h4><p>${item.kcal} kcal · P ${item.p}g · C ${item.c}g · F ${item.f}g</p></div><button class="food-add" type="button" data-action="add-food" data-id="${item.id}" aria-label="${item.name} 추가">＋</button></article>`).join(''):'<div class="empty-state">검색 결과가 없습니다.</div>';
    const list=intake();
    $('#intakeList').innerHTML=list.length?list.map(item=>`<div class="intake-row"><div class="intake-info"><strong>${escapeHtml(item.name)}</strong><span>${item.meal} · ${Math.round(item.kcal*(item.qty||1))} kcal · P ${round1(item.p*(item.qty||1))}g</span></div><div class="quantity-control"><button type="button" data-action="decrease-food" data-entry="${item.entryId}">−</button><strong>${item.qty||1}</strong><button type="button" data-action="increase-food" data-entry="${item.entryId}">＋</button></div><button class="remove-entry" type="button" data-action="remove-food" data-entry="${item.entryId}">×</button></div>`).join(''):'<div class="empty-state">먹은 음식을 추가하면<br>이 날짜의 목록에 표시됩니다.</div>';
    $('#intakeTotalCalories').textContent=`${Math.round(total.kcal).toLocaleString()} kcal`;
    $('#intakeTotalProtein').textContent=`${round1(total.p)} g`;
  }

  function dietAnalysis(total){
    if(!total.items) return {title:'아직 기록된 음식이 없습니다',body:'아래 음식에서 먹은 항목을 눌러 추가하세요.'};
    const cal=total.kcal/state.targets.calories,pro=total.p/state.targets.protein;
    if(cal<.55) return {title:'아직 섭취량이 적습니다',body:`목표까지 약 ${Math.max(0,Math.round(state.targets.calories-total.kcal))}kcal, 단백질 ${Math.max(0,Math.round(state.targets.protein-total.p))}g 남았습니다.`};
    if(pro<.75) return {title:'단백질 보완이 필요합니다',body:'프로틴, 닭가슴살, 생선, 두부 등으로 단백질을 우선 채우세요.'};
    if(cal>1.15) return {title:'칼로리가 높은 편입니다',body:'남은 식사는 지방과 소스를 줄이고 채소와 담백한 단백질 위주로 구성하세요.'};
    if(cal>=.85&&cal<=1.08&&pro>=.9) return {title:'린매스업 목표 범위가 좋습니다',body:'칼로리와 단백질이 안정적인 범위입니다.'};
    return {title:'목표에 가까워지고 있습니다',body:`현재 ${Math.round(total.kcal)}kcal, 단백질 ${round1(total.p)}g입니다.`};
  }

  function addFood(item){
    const list=intake();const existing=!item.custom&&list.find(entry=>entry.id===item.id);
    if(existing) existing.qty=(existing.qty||1)+1; else list.push({...item,entryId:uid(),qty:1});
    saveState();renderAll();toast(`${item.name} 추가`);
  }
  function modifyFood(entryId,delta){
    const list=intake();const entry=list.find(item=>item.entryId===entryId);if(!entry)return;
    entry.qty=(entry.qty||1)+delta;
    if(entry.qty<=0) state.intakeByDate[state.selectedDate]=list.filter(item=>item.entryId!==entryId);
    saveState();renderAll();
  }

  function renderHistory(){
    const keys=new Set([todayKey(),state.selectedDate,...Object.keys(state.scheduleByDate),...Object.keys(state.intakeByDate),...Object.keys(state.workoutByDate),...Object.keys(state.restByDate)]);
    const dates=Array.from(keys).sort((a,b)=>b.localeCompare(a)).slice(0,45);
    $('#historyList').innerHTML=dates.map(key=>{
      const activity=selectedActivity(key);const progress=activityProgress(key);const total=nutritionTotals(key);
      let title='활동 미선택';
      if(activity?.type==='rest') title='휴식 · 회복';
      if(activity?.type==='workout') title=PLANS[activity.plan]?.title||'운동';
      return `<article class="history-card card"><div class="history-date"><strong>${formatDate(key,{month:'long',day:'numeric'})}</strong><span>${formatDate(key,{weekday:'long'})}${key===todayKey()?' · 오늘':''}</span></div><div class="history-main"><h3>${title}</h3><p>${progress.total?`${progress.done}/${progress.total} 완료`:'완료 기록 없음'}</p><div class="history-stats"><span class="history-stat">${Math.round(total.kcal)} kcal</span><span class="history-stat">단백질 ${round1(total.p)}g</span><span class="history-stat">음식 ${total.items}개</span></div></div><button class="history-open" type="button" data-action="open-history-date" data-date="${key}" aria-label="날짜 열기">›</button></article>`;
    }).join('');
  }

  function renderRecords(){
    $('#bodyDate').value=$('#bodyDate').value||state.selectedDate;
    $('#bodyLogs').innerHTML=state.bodyLogs.length?state.bodyLogs.map(log=>`<div class="log-row"><div><strong>${log.weight}kg${log.waist?` · 허리 ${log.waist}cm`:''}${log.muscle?` · 골격근 ${log.muscle}kg`:''}</strong><span>${log.date}</span></div><button class="log-delete" type="button" data-action="delete-body-log" data-id="${log.id}">삭제</button></div>`).join(''):'<div class="empty-state">아직 신체 기록이 없습니다.</div>';
    $('#liftLogs').innerHTML=state.liftLogs.length?state.liftLogs.map(log=>`<div class="log-row"><div><strong>${escapeHtml(log.name)} · ${log.weight}kg × ${log.reps}회 × ${log.sets}세트</strong><span>${log.date}</span></div><button class="log-delete" type="button" data-action="delete-lift-log" data-id="${log.id}">삭제</button></div>`).join(''):'<div class="empty-state">아직 중량 기록이 없습니다.</div>';
  }
  function renderSettings(){
    $('#targetCalories').value=state.targets.calories;$('#targetProtein').value=state.targets.protein;$('#targetCarbs').value=state.targets.carbs;$('#targetFat').value=state.targets.fat;$('#startWeight').value=state.targets.startWeight;$('#goalWeight').value=state.targets.goalWeight;
  }

  function startTimer(seconds,name){
    stopTimer(false);timerRemaining=seconds;timerName=name;$('#floatingTimer').hidden=false;updateTimer();
    timerId=setInterval(()=>{timerRemaining--;updateTimer();if(timerRemaining<=0){stopTimer(true);toast('휴식 시간이 끝났어요');if('vibrate'in navigator)navigator.vibrate([150,80,150])}},1000);
  }
  function stopTimer(hide=true){if(timerId)clearInterval(timerId);timerId=null;if(hide)$('#floatingTimer').hidden=true}
  function updateTimer(){$('#floatingTimerName').textContent=`${timerName} 휴식`;$('#floatingTimerText').textContent=`${String(Math.floor(timerRemaining/60)).padStart(2,'0')}:${String(timerRemaining%60).padStart(2,'0')}`}
  function openModal(id){$(id).classList.add('open');$(id).setAttribute('aria-hidden','false')}
  function closeModals(){$$('.modal').forEach(modal=>{modal.classList.remove('open');modal.setAttribute('aria-hidden','true')})}
  function toast(message){const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('show'),1800)}
  function escapeHtml(value){return String(value).replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[char]))}

  document.addEventListener('click',event=>{
    const target=event.target.closest('[data-action]');if(!target)return;
    const action=target.dataset.action;
    if(action==='go-tab'){state.activeTab=target.dataset.tab;saveState();renderTabs();window.scrollTo({top:0,behavior:'smooth'})}
    if(action==='go-today'){state.selectedDate=todayKey();saveState();renderAll()}
    if(action==='shift-date'){state.selectedDate=addDays(state.selectedDate,Number(target.dataset.days));saveState();renderAll()}
    if(action==='select-date'){state.selectedDate=target.dataset.date;saveState();renderAll()}
    if(action==='select-activity'){
      state.scheduleByDate[state.selectedDate]=target.dataset.type==='rest'?{type:'rest'}:{type:'workout',plan:Number(target.dataset.plan)};
      saveState();renderAll();toast(target.dataset.type==='rest'?'회복일로 기록했어요':`${PLANS[Number(target.dataset.plan)].title} 선택`);
    }
    if(action==='clear-activity'){delete state.scheduleByDate[state.selectedDate];saveState();renderAll();toast('활동 선택을 지웠어요')}
    if(action==='open-selected-activity'){
      if(!selectedActivity()){toast('먼저 운동 또는 휴식을 선택하세요');return}
      state.activeTab='workout';saveState();renderTabs();window.scrollTo({top:0,behavior:'smooth'});
    }
    if(action==='toggle-set'){
      const done=workoutState();done[target.dataset.key]=!done[target.dataset.key];saveState();renderAll();
      if(done[target.dataset.key]&&Number(target.dataset.rest)>0)startTimer(Number(target.dataset.rest),target.dataset.exercise);
    }
    if(action==='toggle-rest'){const rest=restState();rest[target.dataset.id]=target.checked;saveState();renderAll()}
    if(action==='filter-meal'){state.filterMeal=target.dataset.meal;saveState();renderDiet()}
    if(action==='add-food'){const item=FOODS.find(food=>food.id===target.dataset.id);if(item)addFood(item)}
    if(action==='increase-food')modifyFood(target.dataset.entry,1)
    if(action==='decrease-food')modifyFood(target.dataset.entry,-1)
    if(action==='remove-food'){state.intakeByDate[state.selectedDate]=intake().filter(item=>item.entryId!==target.dataset.entry);saveState();renderAll()}
    if(action==='clear-intake'){state.intakeByDate[state.selectedDate]=[];saveState();renderAll();toast('선택한 날짜의 식단을 비웠어요')}
    if(action==='open-history-date'){state.selectedDate=target.dataset.date;state.activeTab='date';saveState();renderAll();window.scrollTo({top:0,behavior:'smooth'})}
    if(action==='open-custom-food')openModal('#customFoodModal')
    if(action==='open-settings')openModal('#settingsModal')
    if(action==='close-modal')closeModals()
    if(action==='stop-timer')stopTimer(true)
    if(action==='log-exercise'){state.activeTab='record';saveState();renderTabs();$('#liftName').value=target.dataset.name;setTimeout(()=>$('#liftWeight').focus(),150);window.scrollTo({top:0,behavior:'smooth'})}
    if(action==='delete-body-log'){state.bodyLogs=state.bodyLogs.filter(log=>log.id!==target.dataset.id);saveState();renderAll()}
    if(action==='delete-lift-log'){state.liftLogs=state.liftLogs.filter(log=>log.id!==target.dataset.id);saveState();renderAll()}
  });

  $('#datePicker').addEventListener('change',event=>{if(event.target.value){state.selectedDate=event.target.value;saveState();renderAll()}});
  $('#foodSearch').addEventListener('input',event=>{state.foodSearch=event.target.value;saveState();renderDiet();const input=$('#foodSearch');input.focus();input.setSelectionRange(input.value.length,input.value.length)});
  $('#customFoodForm').addEventListener('submit',event=>{
    event.preventDefault();addFood({id:uid(),custom:true,name:$('#customFoodName').value.trim(),meal:$('#customFoodMeal').value,kcal:Number($('#customFoodCalories').value),p:Number($('#customFoodProtein').value),c:Number($('#customFoodCarbs').value),f:Number($('#customFoodFat').value)});event.target.reset();closeModals();
  });
  $('#settingsForm').addEventListener('submit',event=>{
    event.preventDefault();state.targets={calories:Number($('#targetCalories').value),protein:Number($('#targetProtein').value),carbs:Number($('#targetCarbs').value),fat:Number($('#targetFat').value),startWeight:Number($('#startWeight').value),goalWeight:Number($('#goalWeight').value)};saveState();closeModals();renderAll();toast('목표를 저장했어요');
  });
  $('#bodyForm').addEventListener('submit',event=>{
    event.preventDefault();state.bodyLogs.unshift({id:uid(),date:$('#bodyDate').value,weight:Number($('#bodyWeight').value),waist:$('#bodyWaist').value?Number($('#bodyWaist').value):null,muscle:$('#bodyMuscle').value?Number($('#bodyMuscle').value):null});state.bodyLogs=state.bodyLogs.slice(0,80);saveState();event.target.reset();$('#bodyDate').value=state.selectedDate;renderAll();toast('신체 기록을 저장했어요');
  });
  $('#liftForm').addEventListener('submit',event=>{
    event.preventDefault();state.liftLogs.unshift({id:uid(),date:state.selectedDate,name:$('#liftName').value.trim(),weight:Number($('#liftWeight').value),reps:Number($('#liftReps').value),sets:Number($('#liftSets').value)});state.liftLogs=state.liftLogs.slice(0,150);saveState();event.target.reset();$('#liftSets').value=1;renderAll();toast('중량 기록을 저장했어요');
  });

  renderAll();
  if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js?v=8').catch(()=>{}));
})();