from __future__ import annotations

import base64
import io
import json
import re
import shutil
import sys
from pathlib import Path
from typing import Dict, Tuple

from PIL import Image, ImageEnhance

SITE = Path(sys.argv[1] if len(sys.argv) > 1 else "site").resolve()
ASSET_DIR = SITE / "assets-v31"
ASSET_DIR.mkdir(parents=True, exist_ok=True)


def read_source() -> str:
    for name in ("assets-v27.js", "assets.js"):
        path = SITE / name
        if path.exists():
            return path.read_text(encoding="utf-8")
    raise FileNotFoundError("No image source file found on gh-pages")


def extract_data_uri(source: str, variable: str) -> str:
    pattern = rf"window\.{re.escape(variable)}\s*=\s*(['\"])(data:image/[^'\"]+)\1"
    match = re.search(pattern, source)
    if not match:
        raise RuntimeError(f"Could not find {variable}")
    return match.group(2)


def decode_data_uri(uri: str) -> Image.Image:
    try:
        payload = uri.split(",", 1)[1]
        raw = base64.b64decode(payload, validate=True)
        image = Image.open(io.BytesIO(raw))
        image.load()
        return image.convert("RGB")
    except Exception as exc:
        raise RuntimeError(f"Unable to decode embedded image: {exc}") from exc


def cover(image: Image.Image, size: Tuple[int, int], focus: Tuple[float, float] = (0.5, 0.5), zoom: float = 1.0) -> Image.Image:
    target_w, target_h = size
    scale = max(target_w / image.width, target_h / image.height) * zoom
    width = max(target_w, round(image.width * scale))
    height = max(target_h, round(image.height * scale))
    resized = image.resize((width, height), Image.Resampling.LANCZOS)
    crop_x = max(0, min(width - target_w, round((width - target_w) * focus[0])))
    crop_y = max(0, min(height - target_h, round((height - target_h) * focus[1])))
    return resized.crop((crop_x, crop_y, crop_x + target_w, crop_y + target_h))


def contain(image: Image.Image, size: Tuple[int, int], background: Tuple[int, int, int] = (4, 4, 4), focus_y: float = 0.45) -> Image.Image:
    target_w, target_h = size
    scale = min(target_w / image.width, target_h / image.height)
    width = max(1, round(image.width * scale))
    height = max(1, round(image.height * scale))
    resized = image.resize((width, height), Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", size, background)
    x = (target_w - width) // 2
    y = round((target_h - height) * focus_y)
    y = max(0, min(target_h - height, y))
    canvas.paste(resized, (x, y))
    return canvas


def enhance(image: Image.Image) -> Image.Image:
    image = ImageEnhance.Contrast(image).enhance(1.06)
    image = ImageEnhance.Color(image).enhance(0.95)
    return image


def save_jpeg(image: Image.Image, filename: str, quality: int = 84) -> str:
    path = ASSET_DIR / filename
    enhance(image).save(path, "JPEG", quality=quality, optimize=True, progressive=True, subsampling=2)
    if path.stat().st_size < 500:
        raise RuntimeError(f"Generated image is unexpectedly small: {filename}")
    return f"./assets-v31/{filename}"


def crop_sprite(sprite: Image.Image) -> Dict[int, Image.Image]:
    cols, rows = 4, 6
    cell_w = sprite.width // cols
    cell_h = sprite.height // rows
    if cell_w < 80 or cell_h < 60:
        raise RuntimeError(f"Sprite is too small: {sprite.size}")
    result: Dict[int, Image.Image] = {}
    for index in range(cols * rows):
        col = index % cols
        row = index // cols
        left = col * cell_w
        top = row * cell_h
        right = sprite.width if col == cols - 1 else (col + 1) * cell_w
        bottom = sprite.height if row == rows - 1 else (row + 1) * cell_h
        result[index] = sprite.crop((left, top, right, bottom)).convert("RGB")
    return result


def build_images(hero_source: Image.Image, sprite_source: Image.Image) -> Dict[str, str]:
    cells = crop_sprite(sprite_source)
    files: Dict[str, str] = {}
    files["hero"] = save_jpeg(contain(hero_source, (920, 1280), focus_y=0.36), "hero.jpg", 88)

    part_cells = {
        "하체": 0,
        "어깨": 1,
        "가슴": 2,
        "등": 3,
        "이두": 4,
        "삼두": 5,
        "복근": 6,
        "유산소": 7,
    }
    part_names = {
        "하체": "part-legs.jpg",
        "어깨": "part-shoulders.jpg",
        "가슴": "part-chest.jpg",
        "등": "part-back.jpg",
        "이두": "part-biceps.jpg",
        "삼두": "part-triceps.jpg",
        "복근": "part-abs.jpg",
        "유산소": "part-cardio.jpg",
    }
    part_focus = {
        "하체": (0.50, 0.52),
        "어깨": (0.50, 0.40),
        "가슴": (0.50, 0.42),
        "등": (0.50, 0.42),
        "이두": (0.48, 0.44),
        "삼두": (0.52, 0.44),
        "복근": (0.50, 0.46),
        "유산소": (0.55, 0.48),
    }
    for part, cell in part_cells.items():
        files[f"part:{part}"] = save_jpeg(cover(cells[cell], (520, 520), part_focus[part]), part_names[part], 86)

    exercise_cells = {
        "스쿼트": 8,
        "레그프레스": 9,
        "레그 익스텐션": 10,
        "레그 컬": 11,
        "숄더 프레스": 12,
        "사이드 레터럴 레이즈": 13,
        "리버스 펙덱": 14,
        "벤치프레스": 15,
        "인클라인 프레스": 16,
        "케이블 플라이": 17,
        "랫풀다운": 18,
        "시티드 케이블 로우": 19,
        "원암 덤벨 로우": 20,
        "바벨컬": 21,
        "해머컬": 22,
        "케이블 푸시다운": 23,
        "오버헤드 익스텐션": 23,
        "케이블 크런치": 6,
        "행잉 니레이즈": 6,
        "플랭크": 6,
        "트레드밀 걷기": 7,
        "인터벌 러닝": 7,
    }
    slugs = {
        "스쿼트": "squat",
        "레그프레스": "leg-press",
        "레그 익스텐션": "leg-extension",
        "레그 컬": "leg-curl",
        "숄더 프레스": "shoulder-press",
        "사이드 레터럴 레이즈": "lateral-raise",
        "리버스 펙덱": "reverse-pec-deck",
        "벤치프레스": "bench-press",
        "인클라인 프레스": "incline-press",
        "케이블 플라이": "cable-fly",
        "랫풀다운": "lat-pulldown",
        "시티드 케이블 로우": "seated-row",
        "원암 덤벨 로우": "one-arm-row",
        "바벨컬": "barbell-curl",
        "해머컬": "hammer-curl",
        "케이블 푸시다운": "pushdown",
        "오버헤드 익스텐션": "overhead-extension",
        "케이블 크런치": "cable-crunch",
        "행잉 니레이즈": "hanging-knee-raise",
        "플랭크": "plank",
        "트레드밀 걷기": "treadmill-walk",
        "인터벌 러닝": "interval-running",
    }
    variants = {
        "오버헤드 익스텐션": ((0.62, 0.48), 1.12),
        "케이블 크런치": ((0.48, 0.40), 1.00),
        "행잉 니레이즈": ((0.52, 0.56), 1.12),
        "플랭크": ((0.58, 0.50), 1.22),
        "트레드밀 걷기": ((0.45, 0.48), 1.00),
        "인터벌 러닝": ((0.60, 0.48), 1.16),
    }
    for exercise, cell in exercise_cells.items():
        focus, zoom = variants.get(exercise, ((0.5, 0.5), 1.0))
        image = cover(cells[cell], (720, 460), focus, zoom)
        files[f"exercise:{exercise}"] = save_jpeg(image, f"exercise-{slugs[exercise]}.jpg", 86)

    return files


HTML_TEMPLATE = r'''<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#050505">
<meta name="description" content="용호의 날짜별 운동 기록 앱">
<title>용호의 운동 · 실사 이미지 v31</title>
<style>
:root{--bg:#050505;--card:#111211;--line:#2b2d2b;--text:#eceeeb;--muted:#969a95;--green:#75e34d;--shadow:0 28px 90px rgba(0,0,0,.48)}*{box-sizing:border-box}html,body{margin:0;background:var(--bg);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,"Pretendard","Noto Sans KR",sans-serif;-webkit-font-smoothing:antialiased}button,input{font:inherit}button{-webkit-tap-highlight-color:transparent}img{display:block}.app{width:min(460px,100%);min-height:100vh;margin:auto;background:#050505;padding-bottom:calc(38px + env(safe-area-inset-bottom))}.top,.workTop{display:flex;justify-content:space-between;align-items:flex-start;padding:calc(28px + env(safe-area-inset-top)) 24px 22px}.eyebrow{margin:0 0 12px;color:#b4b7b2;font-size:13px;font-weight:700}.top h1{font-size:46px;line-height:1.02;letter-spacing:-2.4px;margin:0}.day{font-size:30px;letter-spacing:-1.2px;margin:12px 0 0;color:#d5d7d4}.badge{display:inline-flex;margin-top:12px;padding:6px 10px;border:1px solid rgba(117,227,77,.42);border-radius:999px;background:rgba(117,227,77,.09);color:#8ef16a;font-size:10px;font-weight:800}.badge.bad{border-color:#8f3730;background:#24110f;color:#ff9389}.datePick{position:relative;width:44px;height:44px;border-radius:50%;border:1px solid var(--line);background:#151615;display:grid;place-items:center;overflow:hidden}.datePick:before{content:"";width:18px;height:17px;border:1.8px solid #c9cbc8;border-radius:4px;box-shadow:inset 0 5px 0 -3px #c9cbc8}.datePick input{position:absolute;inset:0;opacity:0}.hero{position:relative;aspect-ratio:23/32;min-height:640px;overflow:hidden;background:#070807}.hero img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center center}.hero:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(5,5,5,.02),rgba(5,5,5,.08) 34%,rgba(5,5,5,.70) 70%,#050505 100%)}.heroText{position:absolute;z-index:2;left:24px;right:24px;bottom:30px}.heroText h2{font-size:38px;line-height:1.14;letter-spacing:-1.8px;margin:0 0 30px}.stats{display:grid;grid-template-columns:1fr 1fr;margin-bottom:27px}.stats div{padding-right:22px}.stats div+div{padding-left:27px;border-left:1px solid rgba(255,255,255,.14)}.stats span{display:block;color:#a4a7a2;font-size:12px;margin-bottom:8px}.stats strong{font-size:31px;color:var(--green)}.mainBtn,.finishBtn{width:100%;height:64px;border:0;border-radius:22px;background:var(--green);color:#0b1209;font-size:20px;font-weight:850;display:flex;justify-content:center;align-items:center;gap:10px;box-shadow:0 14px 34px rgba(117,227,77,.18);cursor:pointer}.mainBtn:disabled{opacity:.38;box-shadow:none}.section{padding:42px 19px 12px}.sectionHead{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}.sectionHead h2{margin:0;font-size:25px;letter-spacing:-.8px}.sectionHead button{border:0;background:none;color:#8e918d;padding:8px}.parts{display:grid;grid-template-columns:1fr 1fr;gap:12px}.part{position:relative;aspect-ratio:1/1.08;border:1px solid var(--line);border-radius:22px;overflow:hidden;padding:0;background:var(--card);color:var(--text);text-align:left;cursor:pointer}.part img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center center;filter:brightness(.84) saturate(.94)}.part:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,.18) 48%,rgba(0,0,0,.94) 100%)}.partInfo{position:absolute;z-index:2;left:15px;right:15px;bottom:14px}.partInfo b{display:block;font-size:20px;margin-bottom:4px}.partInfo small{color:#a5a8a3}.check{position:absolute;z-index:3;right:12px;top:12px;width:25px;height:25px;border:1px solid #737773;border-radius:50%;background:rgba(0,0,0,.24)}.part.selected{border-color:var(--green);box-shadow:inset 0 0 0 1px var(--green)}.part.selected img{filter:brightness(.98) saturate(1)}.part.selected .check{background:var(--green);border-color:var(--green)}.part.selected .check:after{content:"✓";color:#071006;display:grid;place-items:center;height:100%;font-weight:900}.workTop{align-items:center;position:sticky;top:0;background:rgba(5,5,5,.94);backdrop-filter:blur(18px);z-index:10}.back{width:42px;height:42px;border-radius:50%;border:1px solid var(--line);background:#111;color:#d5d7d4;font-size:31px;line-height:1}.workTitle{text-align:center}.workTitle p{margin:0 0 4px;color:#aeb1ad;font-size:12px}.workTitle h2{margin:0;font-size:18px}.clock{min-width:78px;text-align:right;color:#c0c3be;font-size:13px;font-variant-numeric:tabular-nums}.progress{height:3px;background:#1a1c19}.progress i{display:block;height:100%;width:0;background:var(--green);transition:width .2s}.exerciseList{padding:25px 18px 122px}.group{font-size:14px;color:#c7cac5;margin:26px 4px 12px;padding-left:10px;border-left:3px solid var(--green)}.exercise{display:grid;grid-template-columns:126px minmax(0,1fr);gap:16px;align-items:center;padding:13px 0;border-bottom:1px solid #202220}.exercise img{width:126px;aspect-ratio:36/23;object-fit:cover;object-position:center center;border-radius:15px;filter:brightness(.94) saturate(.96);background:#101110}.exercise h3{margin:1px 0 5px;font-size:18px}.exercise p{margin:0 0 10px;color:#90938f;font-size:13px}.sets{display:flex;gap:7px;flex-wrap:wrap}.set{width:39px;height:39px;border-radius:50%;border:1px solid #3b3e3a;background:#0d0e0d;color:#c7cac5}.set.done{border-color:var(--green);color:var(--green);box-shadow:0 0 0 1px var(--green) inset}.video{display:inline-flex;margin-top:10px;color:#c1c4bf;text-decoration:none;font-size:12px;border-bottom:1px solid #525650;padding-bottom:2px}.finishBtn{position:fixed;left:50%;bottom:calc(18px + env(safe-area-inset-bottom));transform:translateX(-50%);width:min(414px,calc(100% - 36px));z-index:20}.rest{position:fixed;right:max(18px,calc((100vw - 460px)/2 + 18px));bottom:calc(94px + env(safe-area-inset-bottom));display:flex;align-items:center;gap:20px;padding:13px 15px;border:1px solid #30332f;border-radius:19px;background:#111311;box-shadow:var(--shadow);z-index:30}.rest span{display:block;font-size:11px;color:#8d918b}.rest strong{display:block;color:var(--green);font-size:24px;font-variant-numeric:tabular-nums}.rest button{border:0;background:none;color:#c1c4bf}.toast{position:fixed;left:50%;top:24px;transform:translate(-50%,-18px);opacity:0;background:#151715;border:1px solid #343733;border-radius:999px;padding:11px 16px;transition:.2s;z-index:50}.toast.show{opacity:1;transform:translate(-50%,0)}[hidden]{display:none!important}@media(max-width:390px){.top h1{font-size:42px}.day{font-size:28px}.exercise{grid-template-columns:112px minmax(0,1fr);gap:13px}.exercise img{width:112px}}@media(min-width:700px){body{padding:22px}.app{border:1px solid #202220;border-radius:34px;overflow:hidden}}
</style>
<script>if('serviceWorker'in navigator){navigator.serviceWorker.getRegistrations().then(a=>a.forEach(r=>r.unregister())).catch(()=>{})}if('caches'in window){caches.keys().then(a=>Promise.all(a.map(k=>caches.delete(k)))).catch(()=>{})}</script>
</head>
<body>
<main class="app"><section id="home"><header class="top"><div><p class="eyebrow">용호의 운동</p><h1 id="dateTitle">오늘</h1><p class="day" id="dayTitle"></p><span class="badge" id="imageBadge">실사 이미지 v31 확인 중</span></div><label class="datePick"><input id="dateInput" type="date" aria-label="날짜 선택"></label></header><section class="hero"><img id="heroImage" src="__HERO__" alt="스쿼트 운동 이미지"><div class="heroText"><p class="eyebrow">오늘 운동</p><h2 id="summary">운동 부위를 골라주세요</h2><div class="stats"><div><span>예상 운동시간</span><strong id="minutes">0분</strong></div><div><span>예상 세트</span><strong id="setTotal">0세트</strong></div></div><button class="mainBtn" id="start" disabled>운동 시작 <b>›</b></button></div></section><section class="section"><div class="sectionHead"><h2>운동 부위 선택</h2><button id="clear">전체 해제</button></div><div class="parts" id="parts"></div></section></section><section id="work" hidden><header class="workTop"><button class="back" id="back" aria-label="뒤로가기">‹</button><div class="workTitle"><p>오늘 운동</p><h2 id="focusTitle">운동</h2></div><div class="clock" id="clock">00:00:00</div></header><div class="progress"><i id="bar"></i></div><div class="exerciseList" id="exerciseList"></div><button class="finishBtn" id="finish">운동 완료</button></section></main><div class="rest" id="rest" hidden><div><span>휴식 시간</span><strong id="restTime">01:30</strong></div><button id="restSkip">건너뛰기</button></div><div class="toast" id="toast"></div>
<script>
const FILES=__FILES__;
const PARTS=[{id:'하체',count:4},{id:'어깨',count:3},{id:'가슴',count:3},{id:'등',count:3},{id:'이두',count:2},{id:'삼두',count:2},{id:'복근',count:3},{id:'유산소',count:2}];
const DATA={'하체':[['스쿼트',4,'6–10회',150],['레그프레스',4,'10–15회',120],['레그 익스텐션',3,'12–15회',75],['레그 컬',3,'10–15회',90]],'어깨':[['숄더 프레스',4,'8–12회',120],['사이드 레터럴 레이즈',3,'12–20회',60],['리버스 펙덱',3,'12–20회',60]],'가슴':[['벤치프레스',4,'6–10회',150],['인클라인 프레스',3,'8–12회',120],['케이블 플라이',3,'12–15회',75]],'등':[['랫풀다운',4,'8–12회',120],['시티드 케이블 로우',4,'8–12회',120],['원암 덤벨 로우',3,'10–12회',90]],'이두':[['바벨컬',3,'8–12회',90],['해머컬',3,'10–15회',75]],'삼두':[['케이블 푸시다운',4,'10–15회',75],['오버헤드 익스텐션',3,'10–15회',75]],'복근':[['케이블 크런치',3,'12–15회',60],['행잉 니레이즈',3,'10–15회',60],['플랭크',3,'30–60초',60]],'유산소':[['트레드밀 걷기',1,'20–30분',0],['인터벌 러닝',1,'12–20분',0]]};
const $=s=>document.querySelector(s),storeKey='용호운동-v31';let workoutTimer=null,restTimer=null,startAt=0;const today=()=>{const d=new Date();return`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
function initialState(){try{const current=JSON.parse(localStorage.getItem(storeKey)||'null');if(current)return current}catch{}try{const old=JSON.parse(localStorage.getItem('용호운동-v25')||'null');if(old){const date=old.날짜||today(),record=old.기록?.[date]||{};return{date,parts:Array.isArray(record.부위)?record.부위:[],sets:record.세트||{}}}}catch{}return{date:today(),parts:[],sets:{}}}
let state=initialState();state.date||=today();state.parts||=[];state.sets||={};const save=()=>localStorage.setItem(storeKey,JSON.stringify(state));const fmtClock=s=>{s=Math.max(0,Math.floor(s));return[Math.floor(s/3600),Math.floor(s%3600/60),s%60].map(v=>String(v).padStart(2,'0')).join(':')};
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),1400)}
function verifyImages(){const imgs=[...document.images];let left=imgs.length,failed=0;const done=()=>{left--;if(!left){const badge=$('#imageBadge');if(failed){badge.textContent=`이미지 ${failed}장 로딩 실패`;badge.classList.add('bad')}else badge.textContent=`실사 이미지 ${imgs.length}장 정상`}};imgs.forEach(img=>{if(img.complete){if(!img.naturalWidth)failed++;done()}else{img.addEventListener('load',done,{once:true});img.addEventListener('error',()=>{failed++;done()},{once:true})}})}
function render(){const d=new Date(state.date+'T12:00:00');$('#dateTitle').textContent=new Intl.DateTimeFormat('ko-KR',{month:'long',day:'numeric'}).format(d);$('#dayTitle').textContent=new Intl.DateTimeFormat('ko-KR',{weekday:'long'}).format(d)+(state.date===today()?' · 오늘':'');$('#dateInput').value=state.date;$('#parts').innerHTML=PARTS.map(p=>`<button class="part ${state.parts.includes(p.id)?'selected':''}" data-part="${p.id}"><span class="check"></span><img src="${FILES['part:'+p.id]}" alt="${p.id} 운동 부위 이미지"><span class="partInfo"><b>${p.id}</b><small>${p.count}개 운동</small></span></button>`).join('');const selected=state.parts.flatMap(id=>DATA[id]||[]),sets=selected.reduce((n,x)=>n+x[1],0);$('#summary').textContent=state.parts.length?state.parts.join(' · '):'운동 부위를 골라주세요';$('#setTotal').textContent=sets+'세트';$('#minutes').textContent=(sets?Math.max(25,Math.round(sets*3.5)):0)+'분';$('#start').disabled=!state.parts.length;drawWorkout();requestAnimationFrame(verifyImages)}
function drawWorkout(){$('#focusTitle').textContent=state.parts.join(' · ')||'운동';let total=0,done=0,html='';state.parts.forEach(part=>{html+=`<h3 class="group">${part}</h3>`;(DATA[part]||[]).forEach((x,i)=>{total+=x[1];for(let s=0;s<x[1];s++)if(state.sets[`${part}-${i}-${s}`])done++;html+=`<article class="exercise"><img src="${FILES['exercise:'+x[0]]}" alt="${x[0]} 운동 이미지"><div><h3>${x[0]}</h3><p>${x[1]}세트 · ${x[2]}</p><div class="sets">${Array.from({length:x[1]},(_,s)=>`<button class="set ${state.sets[`${part}-${i}-${s}`]?'done':''}" data-set="${part}-${i}-${s}" data-rest="${x[3]}">${s+1}</button>`).join('')}</div><a class="video" target="_blank" rel="noopener" href="https://www.youtube.com/results?search_query=${encodeURIComponent(x[0]+' 자세 한국 헬스')}">영상 보기</a></div></article>`})});$('#exerciseList').innerHTML=html;$('#bar').style.width=(total?done/total*100:0)+'%'}
function openWork(){startAt=Date.now();$('#home').hidden=true;$('#work').hidden=false;drawWorkout();clearInterval(workoutTimer);const tick=()=>$('#clock').textContent=fmtClock((Date.now()-startAt)/1000);tick();workoutTimer=setInterval(tick,1000);scrollTo(0,0)}
function startRest(sec){if(!sec)return;clearInterval(restTimer);let left=sec;$('#rest').hidden=false;const tick=()=>{$('#restTime').textContent=fmtClock(left).slice(3);if(left<=0){clearInterval(restTimer);$('#rest').hidden=true;toast('다음 세트를 시작하세요')}left--};tick();restTimer=setInterval(tick,1000)}
document.addEventListener('click',e=>{const p=e.target.closest('[data-part]');if(p){const id=p.dataset.part;state.parts=state.parts.includes(id)?state.parts.filter(x=>x!==id):[...state.parts,id];save();render();return}const s=e.target.closest('[data-set]');if(s){const was=!!state.sets[s.dataset.set];state.sets[s.dataset.set]=!was;save();drawWorkout();if(!was)startRest(Number(s.dataset.rest))}});$('#dateInput').onchange=e=>{state.date=e.target.value||today();save();render()};$('#clear').onclick=()=>{state.parts=[];state.sets={};save();render()};$('#start').onclick=openWork;$('#back').onclick=()=>{$('#work').hidden=true;$('#home').hidden=false;clearInterval(workoutTimer);render()};$('#finish').onclick=()=>{clearInterval(workoutTimer);clearInterval(restTimer);$('#rest').hidden=true;toast('오늘 운동을 저장했어요');setTimeout(()=>{$('#work').hidden=true;$('#home').hidden=false;render();scrollTo(0,0)},500)};$('#restSkip').onclick=()=>{clearInterval(restTimer);$('#rest').hidden=true};render();
</script></body></html>'''


def build_html(files: Dict[str, str]) -> str:
    return HTML_TEMPLATE.replace("__HERO__", files["hero"]).replace("__FILES__", json.dumps(files, ensure_ascii=False, separators=(",", ":")))


def validate_output(files: Dict[str, str], html: str) -> None:
    expected = 1 + 8 + 22
    actual = len(list(ASSET_DIR.glob("*.jpg")))
    if actual != expected:
        raise RuntimeError(f"Expected {expected} image files, found {actual}")
    missing = [path for path in files.values() if not (SITE / path.removeprefix("./")).exists()]
    if missing:
        raise RuntimeError(f"Missing generated files: {missing}")
    if "실사 이미지 v31" not in html or "assets-v31" not in html:
        raise RuntimeError("Generated HTML is missing the v31 marker")


def main() -> None:
    source = read_source()
    hero = decode_data_uri(extract_data_uri(source, "YGO_HERO"))
    sprite = decode_data_uri(extract_data_uri(source, "YGO_SPRITE"))
    for old in ASSET_DIR.glob("*"):
        if old.is_file():
            old.unlink()
        elif old.is_dir():
            shutil.rmtree(old)
    files = build_images(hero, sprite)
    html = build_html(files)
    validate_output(files, html)
    (SITE / "index.html").write_text(html, encoding="utf-8")
    (SITE / "final-v31.html").write_text(html, encoding="utf-8")
    marker = {
        "version": "v31",
        "hero_source_size": list(hero.size),
        "sprite_source_size": list(sprite.size),
        "images": len(files),
        "status": "ok",
    }
    (ASSET_DIR / "build.json").write_text(json.dumps(marker, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(marker, ensure_ascii=False))


if __name__ == "__main__":
    main()
