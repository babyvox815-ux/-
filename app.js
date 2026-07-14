(() => {
  'use strict';

  const 저장키='용호운동-v20';
  const 운동부위=[
    {id:'가슴',아이콘:'가슴',운동:[
      {이름:'벤치프레스',세트:4,반복:'6–10회',휴식:150,팁:'가슴을 들어 올린 상태를 유지하고 어깨가 앞으로 말리지 않게 하세요.'},
      {이름:'인클라인 프레스',세트:3,반복:'8–12회',휴식:120,팁:'벤치 각도를 너무 높이지 말고 윗가슴이 늘어나는 범위까지만 내리세요.'},
      {이름:'케이블 플라이',세트:3,반복:'12–15회',휴식:75,팁:'팔꿈치 각도를 유지하고 가슴으로 큰 원을 그리듯 모으세요.'}
    ]},
    {id:'등',아이콘:'등',운동:[
      {이름:'랫풀다운',세트:4,반복:'8–12회',휴식:120,팁:'손보다 팔꿈치를 골반 쪽으로 내린다는 느낌으로 당기세요.'},
      {이름:'시티드 케이블 로우',세트:4,반복:'8–12회',휴식:120,팁:'허리 반동 없이 팔꿈치를 뒤로 보내 등 중앙을 수축하세요.'},
      {이름:'원암 덤벨 로우',세트:3,반복:'10–12회',휴식:90,팁:'몸통을 비틀지 말고 팔꿈치를 엉덩이 방향으로 당기세요.'}
    ]},
    {id:'어깨',아이콘:'어깨',운동:[
      {이름:'머신 숄더프레스',세트:4,반복:'8–12회',휴식:120,팁:'허리를 과하게 꺾지 말고 팔꿈치를 손목 아래에 두세요.'},
      {이름:'사이드 레터럴 레이즈',세트:4,반복:'12–20회',휴식:60,팁:'손이 아니라 팔꿈치를 옆으로 멀리 보낸다는 느낌으로 들어 올리세요.'},
      {이름:'리버스 펙덱',세트:3,반복:'12–20회',휴식:60,팁:'승모근 힘을 빼고 후면 어깨로 팔을 벌리세요.'}
    ]},
    {id:'하체',아이콘:'하체',운동:[
      {이름:'바벨 스쿼트',세트:4,반복:'6–10회',휴식:150,팁:'발바닥 전체로 바닥을 밀고 무릎과 발끝 방향을 맞추세요.'},
      {이름:'레그프레스',세트:4,반복:'10–15회',휴식:120,팁:'엉덩이가 패드에서 뜨지 않는 깊이까지만 내리세요.'},
      {이름:'레그컬',세트:3,반복:'10–15회',휴식:90,팁:'골반을 패드에 고정하고 뒤꿈치를 엉덩이 쪽으로 당기세요.'},
      {이름:'레그익스텐션',세트:3,반복:'12–15회',휴식:75,팁:'반동 없이 위에서 1초 멈춰 허벅지 앞쪽을 수축하세요.'}
    ]},
    {id:'이두',아이콘:'팔',운동:[
      {이름:'바벨컬',세트:3,반복:'8–12회',휴식:90,팁:'팔꿈치를 몸 옆에 고정하고 상체 반동을 쓰지 마세요.'},
      {이름:'해머컬',세트:3,반복:'10–15회',휴식:75,팁:'손목을 세운 상태로 엄지가 위를 보게 들어 올리세요.'}
    ]},
    {id:'삼두',아이콘:'팔',운동:[
      {이름:'케이블 푸시다운',세트:4,반복:'10–15회',휴식:75,팁:'팔꿈치를 옆구리에 고정하고 아래에서 완전히 펴세요.'},
      {이름:'오버헤드 익스텐션',세트:3,반복:'10–15회',휴식:75,팁:'갈비뼈가 들리지 않게 복부에 힘을 유지하세요.'}
    ]},
    {id:'복근',아이콘:'복근',운동:[
      {이름:'케이블 크런치',세트:3,반복:'12–15회',휴식:60,팁:'팔로 당기지 말고 갈비뼈를 골반 쪽으로 말아 내리세요.'},
      {이름:'행잉 니레이즈',세트:3,반복:'10–15회',휴식:60,팁:'반동 없이 골반을 말아 올리는 데 집중하세요.'},
      {이름:'플랭크',세트:3,반복:'30–60초',휴식:60,팁:'허리가 꺾이지 않게 머리부터 발뒤꿈치까지 일직선을 유지하세요.'}
    ]},
    {id:'유산소',아이콘:'심박',운동:[
      {이름:'트레드밀 걷기',세트:1,반복:'20–30분',휴식:0,팁:'대화가 가능한 강도로 가볍게 진행하세요.'},
      {이름:'인터벌 러닝',세트:1,반복:'12–20분',휴식:0,팁:'빠른 구간과 회복 구간을 번갈아 진행하세요.'}
    ]}
  ];

  const $=s=>document.querySelector(s);
  const 상태=불러오기();
  let 선택날짜=상태.선택날짜||오늘문자();
  let 운동타이머=null,휴식타이머=null;

  const 아이콘={
    달력:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/>',
    왼쪽:'<path d="m15 18-6-6 6-6"/>',오른쪽:'<path d="m9 18 6-6-6-6"/>',
    재생:'<circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4z"/>',
    확인:'<circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/>',
    가슴:'<path d="M6 20V9c0-3 2-5 6-5s6 2 6 5v11M6 11c2-2 4-2 6 0 2-2 4-2 6 0M12 4v16"/>',
    등:'<path d="M8 4c-2 2-3 5-3 8s1 6 3 8M16 4c2 2 3 5 3 8s-1 6-3 8M8 8c2 2 6 2 8 0M8 16c2-2 6-2 8 0M12 4v16"/>',
    어깨:'<path d="M4 13c0-4 3-7 8-7s8 3 8 7M7 13v7M17 13v7M8 8l4 4 4-4"/>',
    하체:'<path d="M9 3h6l1 7-2 11h-3l1-9-1 9H8L6 10z"/>',
    팔:'<path d="M5 15c2-5 4-7 7-7 2 0 3 1 4 3l3 1-2 5-4-1c-2 3-5 4-8 2z"/>',
    복근:'<rect x="7" y="3" width="10" height="18" rx="4"/><path d="M12 3v18M7 9h10M7 15h10"/>',
    심박:'<path d="M3 12h4l2-5 4 10 2-5h6"/>'
  };

  function 그림(name){return `<svg class="선아이콘" viewBox="0 0 24 24" aria-hidden="true">${아이콘[name]||아이콘.확인}</svg>`}
  function 오늘문자(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
  function 날짜객체(s){return new Date(s+'T12:00:00')}
  function 날짜표시(s){return new Intl.DateTimeFormat('ko-KR',{month:'long',day:'numeric'}).format(날짜객체(s))}
  function 요일표시(s){return new Intl.DateTimeFormat('ko-KR',{weekday:'long'}).format(날짜객체(s))}
  function 불러오기(){try{return JSON.parse(localStorage.getItem(저장키)||'{}')}catch{return {}}}
  function 저장(){상태.선택날짜=선택날짜;localStorage.setItem(저장키,JSON.stringify(상태))}
  function 날짜상태(){상태.날짜별 ||= {};상태.날짜별[선택날짜] ||= {부위:[],세트:{},시작:null,종료:null,시간:0};return 상태.날짜별[선택날짜]}
  function 알림(msg){const el=$('#알림');el.textContent=msg;el.classList.add('보임');setTimeout(()=>el.classList.remove('보임'),1600)}
  function 시간형식(sec){sec=Math.max(0,Math.floor(sec||0));return `${String(Math.floor(sec/3600)).padStart(2,'0')}:${String(Math.floor(sec%3600/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`}

  function 날짜그리기(){
    $('#날짜제목').textContent=날짜표시(선택날짜);
    $('#요일제목').textContent=요일표시(선택날짜)+(선택날짜===오늘문자()?' · 오늘':'');
    $('#날짜입력').value=선택날짜;
    부위그리기();요약그리기();운동그리기();
  }

  function 부위그리기(){
    const d=날짜상태();
    $('#부위목록').innerHTML=운동부위.map(p=>`<button class="부위버튼 ${d.부위.includes(p.id)?'선택됨':''}" data-part="${p.id}"><span class="부위아이콘">${그림(p.아이콘)}</span><h3>${p.id}</h3><p>${p.운동.length}개 운동</p></button>`).join('');
  }

  function 선택운동(){const d=날짜상태();return d.부위.flatMap(id=>{const p=운동부위.find(x=>x.id===id);return p?p.운동.map((x,i)=>({...x,부위:id,키:`${id}-${i}`})):[]})}
  function 요약그리기(){
    const d=날짜상태(),ex=선택운동(),sets=ex.reduce((n,x)=>n+x.세트,0);
    $('#선택요약').textContent=d.부위.length?d.부위.join(' · '):'운동 부위를 골라주세요';
    $('#예상요약').textContent=d.부위.length?`예상 ${sets}세트 · 약 ${Math.max(25,Math.round(sets*3.5))}분`:'선택한 부위에 맞춰 운동이 자동으로 구성됩니다.';
    $('#운동시작').disabled=!d.부위.length;
    $('#운동시작').textContent=d.종료?'완료한 운동 보기':d.시작?'운동 계속하기':'운동 시작';
  }

  function 운동그리기(){
    const d=날짜상태(),ex=선택운동();
    const 보여줌=!!d.시작&&ex.length;
    $('#집중화면').hidden=!보여줌;
    $('#부위구역').hidden=보여줌;
    if(!보여줌)return;
    $('#집중제목').textContent=d.부위.join(' · ');
    $('#운동목록').innerHTML=ex.map(e=>`<article class="운동카드 카드"><div class="운동카드상단"><div><p class="작은글">${e.부위}</p><h3>${e.이름}</h3><div class="운동정보"><span class="태그">${e.세트}세트</span><span class="태그">${e.반복}</span><span class="태그">휴식 ${e.휴식?Math.round(e.휴식/60)+'분':'없음'}</span></div></div><a class="영상링크" target="_blank" rel="noopener" href="https://www.youtube.com/results?search_query=${encodeURIComponent(e.이름+' 자세 한국 헬스')}">${그림('재생')}<span>영상 보기</span></a></div><div class="세트목록">${Array.from({length:e.세트},(_,i)=>`<button class="세트버튼 ${d.세트[`${e.키}-${i}`]?'완료':''}" data-set="${e.키}-${i}" data-rest="${e.휴식}">${d.세트[`${e.키}-${i}`]?그림('확인'):i+1}</button>`).join('')}</div><div class="팁">${e.팁}</div></article>`).join('');
    진행갱신();
  }

  function 진행갱신(){
    const d=날짜상태(),ex=선택운동();let total=0,done=0;
    ex.forEach(e=>{total+=e.세트;for(let i=0;i<e.세트;i++)if(d.세트[`${e.키}-${i}`])done++});
    const pct=total?Math.round(done/total*100):0;
    $('#진행문구').textContent=`${done} / ${total}세트`;
    $('#진행바').style.width=pct+'%';
    $('#운동시간').textContent=시간형식(경과(d));
  }

  function 경과(d){if(!d.시작)return 0;if(d.종료)return d.시간||0;return Math.floor((Date.now()-d.시작)/1000)}
  function 운동시작(){const d=날짜상태();if(!d.부위.length)return;if(!d.시작){d.시작=Date.now();d.종료=null;d.시간=0;저장()}운동그리기();타이머시작();window.scrollTo({top:0,behavior:'smooth'})}
  function 타이머시작(){clearInterval(운동타이머);운동타이머=setInterval(진행갱신,1000)}
  function 운동완료(){const d=날짜상태();if(!d.시작)return;d.종료=Date.now();d.시간=Math.floor((d.종료-d.시작)/1000);저장();clearInterval(운동타이머);진행갱신();알림('오늘 운동을 저장했어요')}

  function 휴식시작(sec){if(!sec)return;clearInterval(휴식타이머);let left=sec;$('#휴식창').hidden=false;$('#휴식시간').textContent=시간형식(left).slice(3);휴식타이머=setInterval(()=>{left--;$('#휴식시간').textContent=시간형식(left).slice(3);if(left<=0){휴식끝();알림('다음 세트를 시작하세요')}},1000)}
  function 휴식끝(){clearInterval(휴식타이머);$('#휴식창').hidden=true}

  document.addEventListener('click',e=>{
    const part=e.target.closest('[data-part]');if(part){const d=날짜상태(),id=part.dataset.part;d.부위=d.부위.includes(id)?d.부위.filter(x=>x!==id):[...d.부위,id];d.시작=null;d.종료=null;d.시간=0;d.세트={};저장();날짜그리기();return}
    const set=e.target.closest('[data-set]');if(set){const d=날짜상태(),key=set.dataset.set;d.세트[key]=!d.세트[key];저장();운동그리기();if(d.세트[key])휴식시작(+set.dataset.rest);return}
  });

  $('#이전날').innerHTML=그림('왼쪽');$('#다음날').innerHTML=그림('오른쪽');$('#오늘버튼').innerHTML=그림('달력');
  $('#이전날').onclick=()=>{const d=날짜객체(선택날짜);d.setDate(d.getDate()-1);선택날짜=d.toISOString().slice(0,10);저장();날짜그리기()};
  $('#다음날').onclick=()=>{const d=날짜객체(선택날짜);d.setDate(d.getDate()+1);선택날짜=d.toISOString().slice(0,10);저장();날짜그리기()};
  $('#오늘버튼').onclick=()=>{선택날짜=오늘문자();저장();날짜그리기()};
  $('#날짜입력').onchange=e=>{선택날짜=e.target.value;저장();날짜그리기()};
  $('#전체해제').onclick=()=>{const d=날짜상태();d.부위=[];d.세트={};d.시작=null;d.종료=null;저장();날짜그리기()};
  $('#운동시작').onclick=운동시작;$('#부위변경').onclick=()=>{const d=날짜상태();d.시작=null;d.종료=null;저장();clearInterval(운동타이머);날짜그리기()};
  $('#운동완료').onclick=운동완료;$('#휴식중지').onclick=휴식끝;

  if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
  날짜그리기();if(날짜상태().시작&&!날짜상태().종료)타이머시작();
})();