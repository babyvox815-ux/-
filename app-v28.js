(()=>{'use strict';
const 저장키='용호운동-v25';
const 부위데이터=[
{id:'하체',운동:[['스쿼트',4,'6–10회',150],['레그프레스',4,'10–15회',120],['레그 익스텐션',3,'12–15회',75],['레그 컬',3,'10–15회',90]]},
{id:'어깨',운동:[['숄더 프레스',4,'8–12회',120],['사이드 레터럴 레이즈',3,'12–20회',60],['리버스 펙덱',3,'12–20회',60]]},
{id:'가슴',운동:[['벤치프레스',4,'6–10회',150],['인클라인 프레스',3,'8–12회',120],['케이블 플라이',3,'12–15회',75]]},
{id:'등',운동:[['랫풀다운',4,'8–12회',120],['시티드 케이블 로우',4,'8–12회',120],['원암 덤벨 로우',3,'10–12회',90]]},
{id:'이두',운동:[['바벨컬',3,'8–12회',90],['해머컬',3,'10–15회',75]]},
{id:'삼두',운동:[['케이블 푸시다운',4,'10–15회',75],['오버헤드 익스텐션',3,'10–15회',75]]},
{id:'복근',운동:[['케이블 크런치',3,'12–15회',60],['행잉 니레이즈',3,'10–15회',60],['플랭크',3,'30–60초',60]]},
{id:'유산소',운동:[['트레드밀 걷기',1,'20–30분',0],['인터벌 러닝',1,'12–20분',0]]}
];
const $=s=>document.querySelector(s);
const 오늘=()=>{const d=new Date();return`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
const 상태=(()=>{try{return JSON.parse(localStorage.getItem(저장키)||'{}')}catch{return{}}})();
let 날짜=상태.날짜||오늘(),운동타이머=null,휴식타이머=null;
function 이미지자산연결(){const root=document.documentElement,sprite=window.YGO_SPRITE||'',hero=window.YGO_HERO||'';root.style.setProperty('--운동스프라이트',sprite?`url("${sprite}")`:'none');root.style.setProperty('--대표이미지',hero?`url("${hero}")`:'none');document.body.dataset.images=sprite&&hero?'ready':'missing';const badge=$('#이미지버전');if(badge)badge.textContent=sprite&&hero?'실사 이미지 v28 연결됨':'이미지 연결 확인 중';}
function 날짜기록(){상태.기록||={};상태.기록[날짜]||={부위:[],세트:{},시작:null,종료:null,시간:0};return 상태.기록[날짜]}
function 저장(){상태.날짜=날짜;localStorage.setItem(저장키,JSON.stringify(상태))}
const 날짜객체=s=>new Date(`${s}T12:00:00`);
const 시간표시=s=>{s=Math.max(0,Math.floor(s||0));return`${String(Math.floor(s/3600)).padStart(2,'0')}:${String(Math.floor(s%3600/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`};
function 알림(t){const e=$('#알림');e.textContent=t;e.classList.add('보임');setTimeout(()=>e.classList.remove('보임'),1500)}
const 스프라이트번호={
'part_하체':0,'part_어깨':1,'part_가슴':2,'part_등':3,'part_이두':4,'part_삼두':5,'part_복근':6,'part_유산소':7,
'ex_스쿼트':8,'ex_레그프레스':9,'ex_레그 익스텐션':10,'ex_레그 컬':11,'ex_숄더 프레스':12,'ex_사이드 레터럴 레이즈':13,'ex_리버스 펙덱':14,
'ex_벤치프레스':15,'ex_인클라인 프레스':16,'ex_케이블 플라이':17,'ex_랫풀다운':18,'ex_시티드 케이블 로우':19,'ex_원암 덤벨 로우':20,
'ex_바벨컬':21,'ex_해머컬':22,'ex_케이블 푸시다운':23,'ex_오버헤드 익스텐션':23,'ex_케이블 크런치':6,'ex_행잉 니레이즈':6,'ex_플랭크':6,'ex_트레드밀 걷기':7,'ex_인터벌 러닝':7};
function 스프라이트스타일(key){const i=스프라이트번호[key]??0,x=(i%4)*(100/3),y=Math.floor(i/4)*20;return`background-position:${x}% ${y}%`}
function 이미지키(운동명,부위){const key=`ex_${운동명}`;return key in 스프라이트번호?key:`part_${부위}`}
function 선택운동(){const d=날짜기록();return d.부위.flatMap(id=>{const p=부위데이터.find(x=>x.id===id);return p?p.운동.map((x,i)=>({부위:id,이름:x[0],세트:x[1],반복:x[2],휴식:x[3],키:`${id}-${i}`})):[]})}
function 홈그리기(){const obj=날짜객체(날짜),d=날짜기록();$('#날짜제목').textContent=new Intl.DateTimeFormat('ko-KR',{month:'long',day:'numeric'}).format(obj);$('#요일제목').textContent=new Intl.DateTimeFormat('ko-KR',{weekday:'long'}).format(obj)+(날짜===오늘()?' · 오늘':'');$('#날짜입력').value=날짜;
$('#부위목록').innerHTML=부위데이터.map(p=>{const selected=d.부위.includes(p.id);return`<button class="부위버튼 ${selected?'선택됨':''}" data-part="${p.id}"><span class="부위체크"></span><span class="부위사진" style="${스프라이트스타일(`part_${p.id}`)}"></span><span class="부위그늘"></span><span class="부위내용"><h3>${p.id}</h3><p>${p.운동.length}개 운동</p></span></button>`}).join('');
const ex=선택운동(),세트=ex.reduce((n,x)=>n+x.세트,0);$('#선택요약').textContent=d.부위.length?d.부위.join(' · '):'운동 부위를 골라주세요';$('#예상세트').textContent=`${세트}세트`;$('#예상시간').textContent=`${세트?Math.max(25,Math.round(세트*3.5)):0}분`;$('#운동시작').disabled=!d.부위.length;$('#운동시작').innerHTML=d.종료?'완료한 운동 보기 <span>›</span>':d.시작?'운동 계속하기 <span>›</span>':'운동 시작 <span>›</span>';운동화면그리기()}
function 운동화면그리기(){const d=날짜기록(),ex=선택운동();$('#집중제목').textContent=d.부위.join(' · ')||'운동';const 완료=Object.values(d.세트).filter(Boolean).length,전체=ex.reduce((n,x)=>n+x.세트,0);$('#진행바').style.width=`${전체?(완료/전체*100):0}%`;let html='';d.부위.forEach(part=>{const list=ex.filter(x=>x.부위===part);html+=`<h3 class="운동묶음제목">${part}</h3>`;html+=list.map(e=>`<article class="운동카드"><div class="운동사진" style="${스프라이트스타일(이미지키(e.이름,e.부위))}" aria-label="${e.이름} 운동 이미지"></div><div class="운동본문"><h3>${e.이름}</h3><p>${e.세트}세트 · ${e.반복}</p><div class="세트줄">${Array.from({length:e.세트},(_,i)=>`<button class="세트버튼 ${d.세트[`${e.키}-${i}`]?'완료':''}" data-set="${e.키}-${i}" data-rest="${e.휴식}">${i+1}</button>`).join('')}</div><a class="영상링크" target="_blank" rel="noopener" href="https://www.youtube.com/results?search_query=${encodeURIComponent(e.이름+' 자세 한국 헬스')}">영상 보기</a></div></article>`).join('')});$('#운동목록').innerHTML=html}
function 시작(){const d=날짜기록();if(!d.부위.length)return;if(!d.시작){d.시작=Date.now();d.종료=null;저장()}$('#홈화면').hidden=true;$('#운동화면').hidden=false;운동화면그리기();타이머시작();window.scrollTo({top:0,behavior:'instant'})}
function 타이머시작(){clearInterval(운동타이머);const tick=()=>{const d=날짜기록(),sec=d.종료?d.시간:Math.floor((Date.now()-d.시작)/1000);$('#운동시간').textContent=시간표시(sec)};tick();운동타이머=setInterval(tick,1000)}
function 휴식시작(sec){if(!sec)return;clearInterval(휴식타이머);let left=sec;$('#휴식창').hidden=false;const tick=()=>{$('#휴식시간').textContent=시간표시(left).slice(3);if(left<=0){clearInterval(휴식타이머);$('#휴식창').hidden=true;알림('다음 세트를 시작하세요')}left--};tick();휴식타이머=setInterval(tick,1000)}
function 완료(){const d=날짜기록();if(!d.시작)return;d.종료=Date.now();d.시간=Math.floor((d.종료-d.시작)/1000);저장();clearInterval(운동타이머);알림('오늘 운동을 저장했어요');setTimeout(()=>{$('#운동화면').hidden=true;$('#홈화면').hidden=false;홈그리기();window.scrollTo({top:0,behavior:'smooth'})},600)}
document.addEventListener('click',e=>{const part=e.target.closest('[data-part]');if(part){const d=날짜기록(),id=part.dataset.part;d.부위=d.부위.includes(id)?d.부위.filter(x=>x!==id):[...d.부위,id];d.종료=null;저장();홈그리기();return}const set=e.target.closest('[data-set]');if(set){const d=날짜기록();d.세트[set.dataset.set]=!d.세트[set.dataset.set];저장();운동화면그리기();if(d.세트[set.dataset.set])휴식시작(Number(set.dataset.rest))}});
$('#날짜입력').addEventListener('change',e=>{날짜=e.target.value||오늘();저장();홈그리기()});
$('#전체해제').onclick=()=>{const d=날짜기록();d.부위=[];d.세트={};d.시작=null;d.종료=null;저장();홈그리기()};
$('#운동시작').onclick=시작;$('#뒤로가기').onclick=()=>{$('#운동화면').hidden=true;$('#홈화면').hidden=false;clearInterval(운동타이머);홈그리기()};$('#운동완료').onclick=완료;$('#휴식중지').onclick=()=>{clearInterval(휴식타이머);$('#휴식창').hidden=true};
이미지자산연결();홈그리기();setTimeout(이미지자산연결,300);
})();