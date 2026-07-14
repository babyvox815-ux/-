(() => {
'use strict';
const 저장키='용호운동-v24';
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
const 오늘=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
const 상태=(()=>{try{return JSON.parse(localStorage.getItem(저장키)||'{}')}catch{return {}}})();
let 날짜=상태.날짜||오늘(),운동타이머=null,휴식타이머=null;
const 날짜기록=()=>{상태.기록 ||= {};상태.기록[날짜] ||= {부위:[],세트:{},시작:null,종료:null,시간:0};return 상태.기록[날짜]};
const 저장=()=>{상태.날짜=날짜;localStorage.setItem(저장키,JSON.stringify(상태))};
const 날짜객체=s=>new Date(s+'T12:00:00');
const 시간표시=s=>`${String(Math.floor(s/3600)).padStart(2,'0')}:${String(Math.floor(s%3600/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
function svgUrl(kind,label){
 const green='#42ee32', line='#d7d7d9', dark='#070807';
 const poses={
  하체:'<circle cx="160" cy="53" r="18"/><path d="M138 84h44l15 52-26 16-11-33-11 33-26-16z"/><path d="M142 148l-28 65M178 148l28 65"/><path d="M103 95h114M112 84v22M208 84v22"/>',
  어깨:'<circle cx="160" cy="50" r="18"/><path d="M139 82h42l11 78h-64z"/><path d="M139 92L92 62M181 92l47-30"/><path d="M78 53h28M214 53h28M84 44v18M236 44v18"/>',
  가슴:'<circle cx="160" cy="89" r="18"/><path d="M126 112h68l18 38H108z"/><path d="M95 140h130M75 163h170"/><path d="M120 106L75 86M200 106l45-20"/>',
  등:'<circle cx="160" cy="50" r="18"/><path d="M134 82h52l15 78h-82z"/><path d="M135 90L80 55M185 90l55-35"/><path d="M72 45h176"/>',
  이두:'<circle cx="160" cy="50" r="18"/><path d="M139 82h42l11 80h-64z"/><path d="M139 92L95 130M181 92l44 38"/><circle cx="88" cy="138" r="17"/><circle cx="232" cy="138" r="17"/>',
  삼두:'<circle cx="160" cy="50" r="18"/><path d="M139 82h42l11 80h-64z"/><path d="M139 92L112 54M181 92l27-38"/><path d="M105 44h14M201 44h14"/>',
  복근:'<circle cx="160" cy="48" r="18"/><path d="M137 78h46l10 92h-66z"/><path d="M160 80v86M137 110h46M134 140h52"/><path d="M137 95L98 145M183 95l39 50"/>',
  유산소:'<circle cx="174" cy="46" r="16"/><path d="M158 72l34 20-19 33-42-7"/><path d="M172 122l45 49M151 119l-41 61"/><path d="M108 182h130M126 173h92"/>'
 };
 const p=poses[kind]||poses.하체;
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220"><defs><linearGradient id="b" x2="0" y2="1"><stop stop-color="#171a17"/><stop offset="1" stop-color="#050605"/></linearGradient><radialGradient id="g"><stop stop-color="${green}" stop-opacity=".28"/><stop offset="1" stop-color="${green}" stop-opacity="0"/></radialGradient></defs><rect width="320" height="220" rx="22" fill="url(#b)"/><circle cx="160" cy="115" r="100" fill="url(#g)"/><g fill="none" stroke="${line}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round">${p}</g><g fill="none" stroke="${green}" stroke-width="10" stroke-linecap="round" opacity=".9">${kind==='하체'?'<path d="M141 148l-23 57M179 148l23 57"/>':kind==='어깨'?'<path d="M139 91L105 70M181 91l34-21"/>':kind==='가슴'?'<path d="M137 117h46"/>':kind==='등'?'<path d="M137 100h46M130 125h60"/>':kind==='이두'?'<path d="M137 96l-27 24M183 96l27 24"/>':kind==='삼두'?'<path d="M140 91l-19-27M180 91l19-27"/>':kind==='복근'?'<path d="M147 105h26M145 132h30"/>':'<path d="M173 122l35 39"/>'}</g><text x="18" y="198" fill="#e4e4e6" font-family="Arial,sans-serif" font-size="19" font-weight="700">${label}</text></svg>`;
 return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
function heroUrl(){
 const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 760"><defs><radialGradient id="r"><stop stop-color="#42ee32" stop-opacity=".16"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient><linearGradient id="m" x2="0" y2="1"><stop stop-color="#303330"/><stop offset=".55" stop-color="#121412"/><stop offset="1" stop-color="#050605"/></linearGradient></defs><rect width="900" height="760" fill="#050605"/><circle cx="580" cy="430" r="360" fill="url(#r)"/><g transform="translate(80 300) rotate(-12 350 120)"><rect x="150" y="105" width="500" height="34" rx="17" fill="#777b77"/><g fill="url(#m)" stroke="#404440" stroke-width="8"><circle cx="160" cy="122" r="135"/><circle cx="160" cy="122" r="90"/><circle cx="640" cy="122" r="135"/><circle cx="640" cy="122" r="90"/></g><circle cx="160" cy="122" r="28" fill="#939793"/><circle cx="640" cy="122" r="28" fill="#939793"/></g></svg>';
 return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
function 알림(t){const e=$('#알림');e.textContent=t;e.classList.add('보임');setTimeout(()=>e.classList.remove('보임'),1500)}
function 선택운동(){const d=날짜기록();return d.부위.flatMap(id=>{const p=부위데이터.find(x=>x.id===id);return p?p.운동.map((x,i)=>({부위:id,이름:x[0],세트:x[1],반복:x[2],휴식:x[3],키:`${id}-${i}`})):[]})}
function 그리기(){
 const obj=날짜객체(날짜),d=날짜기록();
 $('#날짜제목').textContent=new Intl.DateTimeFormat('ko-KR',{month:'long',day:'numeric'}).format(obj);
 $('#요일제목').textContent=new Intl.DateTimeFormat('ko-KR',{weekday:'long'}).format(obj)+(날짜===오늘()?' · 오늘':'');
 $('#날짜입력').value=날짜;
 $('#대표사진').style.backgroundImage=`url("${heroUrl()}")`;
 $('#부위목록').innerHTML=부위데이터.map(p=>`<button class="부위버튼 ${d.부위.includes(p.id)?'선택됨':''}" data-part="${p.id}"><span class="부위체크"></span><span class="부위사진" style="background-image:url('${svgUrl(p.id,p.id)}')"></span><span class="부위그늘"></span><span class="부위내용"><h3>${p.id}</h3><p>${p.운동.length}개 운동</p></span></button>`).join('');
 const ex=선택운동(),세트=ex.reduce((n,x)=>n+x.세트,0);
 $('#선택요약').textContent=d.부위.length?d.부위.join(' · '):'운동 부위를 골라주세요';
 $('#예상세트').textContent=`${세트}세트`;$('#예상시간').textContent=`${세트?Math.max(25,Math.round(세트*3.5)):0}분`;
 $('#운동시작').disabled=!d.부위.length;$('#운동시작').innerHTML=d.시작?'운동 계속하기 <span>›</span>':'운동 시작 <span>›</span>';운동화면그리기();
}
function 운동화면그리기(){
 const d=날짜기록(),ex=선택운동();$('#집중제목').textContent=d.부위.join(' · ')||'운동';
 const 완료=Object.values(d.세트).filter(Boolean).length,전체=ex.reduce((n,x)=>n+x.세트,0);$('#진행바').style.width=(전체?완료/전체*100:0)+'%';
 let html='';d.부위.forEach(part=>{const list=ex.filter(x=>x.부위===part);html+=`<h3 class="운동묶음제목">${part}</h3>`;html+=list.map(e=>`<article class="운동카드"><div class="운동사진" style="background-image:url('${svgUrl(e.부위,e.이름)}')"></div><div class="운동본문"><h3>${e.이름}</h3><p>${e.세트}세트 · ${e.반복}</p><div class="세트줄">${Array.from({length:e.세트},(_,i)=>`<button class="세트버튼 ${d.세트[`${e.키}-${i}`]?'완료':''}" data-set="${e.키}-${i}" data-rest="${e.휴식}">${i+1}</button>`).join('')}</div><a class="영상링크" target="_blank" rel="noopener" href="https://www.youtube.com/results?search_query=${encodeURIComponent(e.이름+' 자세 한국 헬스')}">영상 보기</a></div></article>`).join('')});$('#운동목록').innerHTML=html;
}
function 시작(){const d=날짜기록();if(!d.시작){d.시작=Date.now();d.종료=null;저장()}$('#홈화면').hidden=true;$('#운동화면').hidden=false;운동화면그리기();타이머시작()}
function 타이머시작(){clearInterval(운동타이머);운동타이머=setInterval(()=>{const d=날짜기록(),sec=d.종료?d.시간:Math.floor((Date.now()-d.시작)/1000);$('#운동시간').textContent=시간표시(sec)},1000)}
function 휴식시작(sec){if(!sec)return;clearInterval(휴식타이머);let left=sec;$('#휴식창').hidden=false;$('#휴식시간').textContent=시간표시(left).slice(3);휴식타이머=setInterval(()=>{left--;$('#휴식시간').textContent=시간표시(left).slice(3);if(left<=0){clearInterval(휴식타이머);$('#휴식창').hidden=true;알림('다음 세트를 시작하세요')}},1000)}
function 완료(){const d=날짜기록();if(!d.시작)return;d.종료=Date.now();d.시간=Math.floor((d.종료-d.시작)/1000);저장();clearInterval(운동타이머);알림('오늘 운동을 저장했어요');setTimeout(()=>{$('#운동화면').hidden=true;$('#홈화면').hidden=false;그리기()},700)}
document.addEventListener('click',e=>{const p=e.target.closest('[data-part]');if(p){const d=날짜기록(),id=p.dataset.part;d.부위=d.부위.includes(id)?d.부위.filter(x=>x!==id):[...d.부위,id];저장();그리기();return}const s=e.target.closest('[data-set]');if(s){const d=날짜기록();d.세트[s.dataset.set]=!d.세트[s.dataset.set];저장();운동화면그리기();if(d.세트[s.dataset.set])휴식시작(+s.dataset.rest)}});
$('#날짜입력').addEventListener('change',e=>{날짜=e.target.value||오늘();저장();그리기()});$('#전체해제').onclick=()=>{const d=날짜기록();d.부위=[];d.세트={};저장();그리기()};$('#운동시작').onclick=시작;$('#뒤로가기').onclick=()=>{$('#운동화면').hidden=true;$('#홈화면').hidden=false;clearInterval(운동타이머);그리기()};$('#운동완료').onclick=완료;$('#휴식중지').onclick=()=>{clearInterval(휴식타이머);$('#휴식창').hidden=true};그리기();
})();