'use strict';
const MEALS = ['전체', '아침', '점심', '운동 전', '운동 후', '저녁', '간식'];
const workoutPlans = [
    {
      title: '하체 · 어깨',
      short: '하체/어깨',
      note: '하체 대근육을 먼저 끝낸 뒤 어깨를 진행합니다.',
      exercises: [
        { name:'바벨 스쿼트', sets:4, reps:'6–10회', rest:150, muscle:'legs', eccentric:'내려갈 때 2–3초 동안 대퇴사두와 둔근을 길게 이완', concentric:'발바닥 전체로 바닥을 밀며 올라오고 상단에서 둔근 수축', cue:'무릎과 발끝 방향을 맞추고 허리 말림 금지', query:'바벨 스쿼트 자세 한국 헬스' },
        { name:'레그프레스', sets:4, reps:'10–15회', rest:120, muscle:'legs', eccentric:'무릎을 접으며 대퇴사두와 둔근을 충분히 이완', concentric:'발판을 밀며 허벅지 앞쪽 수축', cue:'엉덩이가 패드에서 뜨지 않는 깊이까지만', query:'레그프레스 자세 한국 헬스' },
        { name:'레그컬', sets:3, reps:'10–15회', rest:90, muscle:'ham', eccentric:'무릎이 펴질 때 햄스트링을 길게 이완', concentric:'뒤꿈치를 엉덩이 방향으로 당기며 수축', cue:'골반이 패드에서 들리지 않게 고정', query:'레그컬 자세 한국 헬스' },
        { name:'레그익스텐션', sets:3, reps:'12–15회', rest:75, muscle:'quads', eccentric:'무릎을 충분히 접어 대퇴사두 이완', concentric:'위에서 무릎을 펴며 1초 수축', cue:'반동 없이 천천히 움직이기', query:'레그익스텐션 자세 한국 헬스' },
        { name:'머신 숄더프레스', sets:4, reps:'8–12회', rest:120, muscle:'shoulders', eccentric:'손잡이를 내리며 전면·측면 삼각근 이완', concentric:'머리 위로 밀며 어깨 수축', cue:'허리 과신전과 어깨 으쓱 금지', query:'머신 숄더프레스 자세 한국 헬스' },
        { name:'사이드 레터럴 레이즈', sets:4, reps:'12–20회', rest:60, muscle:'shoulders', eccentric:'팔을 내리며 측면 삼각근 이완', concentric:'팔꿈치를 옆으로 멀리 보내며 수축', cue:'승모근으로 으쓱하지 않기', query:'사이드 레터럴 레이즈 자세 한국 헬스' },
        { name:'리버스 펙덱', sets:3, reps:'12–20회', rest:60, muscle:'rear', eccentric:'팔이 앞쪽으로 갈 때 후면 삼각근 이완', concentric:'팔꿈치를 벌리며 후면 삼각근 수축', cue:'견갑을 과하게 모으지 않기', query:'리버스 펙덱 자세 한국 헬스' }
      ]
    },
    {
      title: '가슴 · 삼두', short:'가슴/삼두', note:'가슴 프레스류를 먼저 진행한 뒤 삼두를 마무리합니다.',
      exercises: [
        { name:'벤치프레스', sets:4, reps:'6–10회', rest:150, muscle:'chest', eccentric:'바를 가슴 쪽으로 통제하며 내려 가슴 이완', concentric:'가슴을 유지한 채 위로 밀며 수축', cue:'어깨가 앞으로 말리지 않게 견갑 고정', query:'벤치프레스 자세 한국 헬스' },
        { name:'인클라인 프레스', sets:3, reps:'8–12회', rest:120, muscle:'upperchest', eccentric:'윗가슴이 늘어나는 범위까지 내리기', concentric:'팔을 모으며 윗가슴 수축', cue:'벤치 각도를 과도하게 높이지 않기', query:'인클라인 프레스 자세 한국 헬스' },
        { name:'체스트프레스 머신', sets:3, reps:'10–15회', rest:90, muscle:'chest', eccentric:'손잡이를 뒤로 보내 가슴 이완', concentric:'팔꿈치를 모으며 가슴 수축', cue:'어깨가 들썩이지 않게 고정', query:'체스트프레스 머신 자세 한국 헬스' },
        { name:'케이블 플라이', sets:3, reps:'12–15회', rest:75, muscle:'chest', eccentric:'가슴이 늘어날 때까지 양팔 벌리기', concentric:'큰 원을 그리며 양손 모으기', cue:'팔꿈치 각도를 유지하고 어깨 앞으로 빼지 않기', query:'케이블 플라이 자세 한국 헬스' },
        { name:'케이블 푸시다운', sets:4, reps:'10–15회', rest:75, muscle:'triceps', eccentric:'팔꿈치를 굽혀 삼두 이완', concentric:'아래에서 팔을 펴며 1초 수축', cue:'팔꿈치 위치를 고정', query:'케이블 푸시다운 자세 한국 헬스' },
        { name:'오버헤드 익스텐션', sets:3, reps:'10–15회', rest:75, muscle:'triceps', eccentric:'팔꿈치를 접어 삼두 장두 이완', concentric:'머리 위로 펴며 삼두 수축', cue:'갈비뼈가 들리지 않게 복부 고정', query:'오버헤드 익스텐션 자세 한국 헬스' }
      ]
    },
    {
      title: '등 · 이두', short:'등/이두', note:'수직 당기기 → 수평 당기기 → 이두 순서입니다.',
      exercises: [
        { name:'랫풀다운', sets:4, reps:'8–12회', rest:120, muscle:'back', eccentric:'팔을 위로 보내 광배를 길게 이완', concentric:'팔꿈치를 골반 쪽으로 당기며 광배 수축', cue:'몸을 과하게 뒤로 젖히지 않기', query:'랫풀다운 자세 한국 헬스' },
        { name:'시티드 케이블 로우', sets:4, reps:'8–12회', rest:120, muscle:'back', eccentric:'어깨를 앞으로 보내 등 이완', concentric:'팔꿈치를 뒤로 보내 등 중앙 수축', cue:'허리 반동 금지', query:'시티드 케이블 로우 자세 한국 헬스' },
        { name:'원암 덤벨 로우', sets:3, reps:'10–12회', rest:90, muscle:'back', eccentric:'덤벨을 아래로 보내 광배 이완', concentric:'팔꿈치를 엉덩이 방향으로 당기기', cue:'몸통 회전 최소화', query:'원암 덤벨 로우 자세 한국 헬스' },
        { name:'스트레이트암 풀다운', sets:3, reps:'12–15회', rest:75, muscle:'back', eccentric:'팔을 위로 보내 광배 이완', concentric:'겨드랑이를 닫으며 허벅지 쪽으로 당기기', cue:'팔꿈치 굽힘 최소화', query:'스트레이트암 풀다운 자세 한국 헬스' },
        { name:'바벨컬', sets:3, reps:'8–12회', rest:90, muscle:'biceps', eccentric:'팔꿈치를 펴 이두 이완', concentric:'손바닥을 위로 유지하며 이두 수축', cue:'상체 반동 금지', query:'바벨컬 자세 한국 헬스' },
        { name:'해머컬', sets:3, reps:'10–15회', rest:75, muscle:'biceps', eccentric:'덤벨을 아래로 통제하며 이완', concentric:'엄지 방향으로 들어 올리며 상완근 수축', cue:'손목 꺾지 않기', query:'해머컬 자세 한국 헬스' }
      ]
    },
    {
      title:'회복', short:'회복', note:'피로가 누적되면 계획대로 쉬는 날입니다.',
      exercises:[
        { name:'가벼운 걷기', sets:1, reps:'20–30분', rest:0, muscle:'full', eccentric:'대화 가능한 속도로 몸을 풀기', concentric:'호흡과 혈류 회복', cue:'피로가 심하면 완전 휴식', query:'회복 걷기 운동 한국' },
        { name:'전신 가동성', sets:1, reps:'10분', rest:0, muscle:'full', eccentric:'고관절·흉추·어깨를 부드럽게 움직이기', concentric:'통증 없는 범위에서 반복', cue:'끝 범위를 억지로 밀지 않기', query:'전신 가동성 스트레칭 한국' },
        { name:'수면', sets:1, reps:'7–9시간', rest:0, muscle:'full', eccentric:'취침 시간을 일정하게', concentric:'늦은 카페인 피하기', cue:'회복일에도 단백질 유지', query:'운동 회복 수면 한국' }
      ]
    }
  ];

const foods = [
    { id:'egg2', name:'계란후라이 2개', meal:'아침', kcal:180, p:13, c:1, f:14 },
    { id:'broccoli', name:'브로콜리 한 줌', meal:'아침', kcal:30, p:3, c:5, f:0.3 },
    { id:'cabbage', name:'찐 양배추', meal:'아침', kcal:35, p:2, c:8, f:0.2 },
    { id:'tofu90', name:'연두부 90g', meal:'아침', kcal:50, p:4.5, c:2, f:2.5 },
    { id:'greek70', name:'매일 바이오 무가당 그릭요거트 70g', meal:'아침', kcal:61, p:6, c:3.3, f:2.5 },
    { id:'blueberry20', name:'냉동 블루베리 20알', meal:'아침', kcal:17, p:0.2, c:4.4, f:0.1 },
    { id:'almond20', name:'아몬드 20알', meal:'아침', kcal:140, p:5, c:5, f:12 },
    { id:'koreanmeal', name:'일반 한식 한 끼', meal:'점심', kcal:750, p:30, c:90, f:25 },
    { id:'kimchifriedrice', name:'김치볶음밥', meal:'점심', kcal:550, p:15, c:85, f:17 },
    { id:'galbijjim', name:'갈비찜 1인분', meal:'점심', kcal:450, p:28, c:20, f:28 },
    { id:'ramen', name:'라면 1개', meal:'점심', kcal:500, p:10, c:80, f:16 },
    { id:'pizza', name:'피자 2조각', meal:'점심', kcal:600, p:26, c:70, f:26 },
    { id:'chicken', name:'후라이드 치킨 3조각', meal:'점심', kcal:500, p:35, c:20, f:30 },
    { id:'preworkout', name:'닭가슴살 김치볶음밥', meal:'운동 전', kcal:420, p:25, c:60, f:10 },
    { id:'banana', name:'바나나 1개', meal:'운동 전', kcal:105, p:1.3, c:27, f:0.3 },
    { id:'protein', name:'컴뱃 웨이 프로틴 1스쿱', meal:'운동 후', kcal:120, p:24, c:3, f:2 },
    { id:'steak', name:'닭가슴살 스테이크 1장', meal:'저녁', kcal:160, p:20, c:2, f:8 },
    { id:'tender5', name:'닭안심 5개', meal:'저녁', kcal:100, p:15, c:6, f:2 },
    { id:'rice100', name:'쌀밥 100g', meal:'저녁', kcal:150, p:3, c:33, f:0.3 },
    { id:'rice150', name:'쌀밥 150g', meal:'저녁', kcal:225, p:4.5, c:49.5, f:0.5 },
    { id:'vegetable', name:'브로콜리 또는 양배추', meal:'저녁', kcal:30, p:2, c:6, f:0.2 },
    { id:'yogurtsnack', name:'그릭요거트 + 블루베리', meal:'간식', kcal:78, p:6.2, c:7.7, f:2.6 }
  ];
window.YGO_DATA={MEALS,workoutPlans,foods};
