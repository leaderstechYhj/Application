===============================================================
       딥스위치 계산기 앱 (DIP Switch Calculator) - 구현 계획서
===============================================================
작성일: 2026-03-28
최종수정: 2026-03-28 (키패드 버튼 개편 + leading zero 제거 + PWA 레이아웃 수정)
플랫폼: React (Vite) PWA
대상기기: 아이폰 (맥북 VSCode에서 개발)

//git push 한 다음 npm run deploy 해야 배포됨

---------------------------------------------------------------
1. 프로젝트 개요
---------------------------------------------------------------
아이폰에서 사용할 딥스위치 계산기 앱.
딥스위치 0/1 조작 시 8/10/16진수 값이 실시간으로 변환되고,
반대로 숫자를 입력하면 딥스위치 UI에 자동 반영된다.
홈/설정 두 개의 탭으로 구성된 반응형 PWA 앱.


---------------------------------------------------------------
2. 최종 스펙
---------------------------------------------------------------

[홈 탭]
- 딥스위치 UI (개수는 설정에서 사용자가 지정)
- 진수 표시 영역 (설정에서 선택한 진수만 표시)
  예) 8진수+16진수 선택 시 → 두 영역만 표시
- 화면 내 커스텀 키패드
  · 항상 6행 고정 (D~F, A~C, 7~9, 4~6, 1~3, RESET/0/DEL)
  · A~F: 사용자가 16진수 영역을 터치했을 때만 활성화 / 그 외(8·10진수 터치 또는 미선택)엔 회색 표시 (터치 불가)
  · RESET: 딥스위치 및 진수 표시 전체를 0으로 초기화
  · DEL: 커서 앞 글자 하나 삭제 (백스페이스)
- 숫자 입력 방식: 커서 위치에 삽입, leading zero 자동 제거
  예) "0" 상태에서 "1" 입력 시 → "01" 아닌 "1" 표시

[설정 탭]
- LSB ↔ MSB 토글 버튼
  · 기본 상태: "LSB ↔ MSB" 표시
  · 토글 후:  "MSB ↔ LSB" 표시
  · 딥스위치 비트 순서 및 UI 방향 실시간 변경
- 다크모드 토글 버튼
  · 기본 상태: "다크모드" 표시 (ON)
  · 토글 후:  "라이트모드" 표시 (OFF)
- 진수 선택 버튼 (1개 이상 다중 선택 가능)
  · [8진수] [10진수] [16진수] 세 버튼이 한 줄에 나란히
- 딥스위치 ON/OFF 방향 선택
  · [▲ 위 = ON] / [▼ 아래 = ON] 중 사용자가 선택
- 딥스위치 개수 지정
  · − / 숫자 / + 버튼으로 조작


---------------------------------------------------------------
3. 파일 구조
---------------------------------------------------------------

src/
├── App.jsx                  ← 탭 전환 (홈/설정) 관리 + 9분할 레이아웃
├── main.jsx                 ← 진입점 (건드릴 일 거의 없음)
│
├── pages/
│   ├── HomePage.jsx         ← 딥스위치 UI + 진수 표시 영역
│   └── SettingsPage.jsx     ← 설정 화면
│
├── components/
│   ├── DipSwitch.jsx        ← 딥스위치 개별 토글 UI
│   ├── NumberDisplay.jsx    ← 8/10/16진수 표시 영역
│   └── Keypad.jsx           ← 커스텀 숫자 키패드
│
├── context/
│   └── AppContext.jsx       ← 전체 앱 상태 관리 (설정값, 스위치값 등)
│
└── index.css                ← 다크모드 포함 전체 스타일


---------------------------------------------------------------
4. 상태(State) 목록 - AppContext에서 중앙 관리
---------------------------------------------------------------

switchCount       딥스위치 개수 (설정에서 사용자가 지정한 값)
switchValues[]    각 스위치의 0/1 상태 배열
                  예) [0, 0, 0, 0, 0, 0, 0, 0]  ← 기본값 전부 0
isMSB             MSB/LSB 토글 상태 (true = MSB 기준)
isDarkMode        다크/라이트 모드 (true = 다크모드)
onDirection       ON 방향 설정 ("top" = 위가 ON, "bottom" = 아래가 ON)
selectedBases[]   선택된 진수 목록 (예: [10, 16] 또는 [8, 10, 16])
activeBase        현재 키패드 입력 중인 진수 영역 (8 or 10 or 16)
inputValue        현재 키패드 입력 중인 문자열
cursorPos         커서 위치 (inputValue 내 인덱스)


---------------------------------------------------------------
5. 데이터 흐름
---------------------------------------------------------------

[딥스위치 토글 시]
  사용자가 스위치 클릭
    └→ switchValues 배열 업데이트
        └→ NumberDisplay 자동 갱신 (선택된 진수 모두)

[진수 영역 클릭 + 키패드 입력 시]
  사용자가 진수 영역 클릭 (예: 16진수 영역)
    └→ activeBase = 16 으로 설정
        └→ 숫자 입력 (커서 위치에 삽입, leading zero 자동 제거)
            └→ 해당 진수값 → 이진수 변환
                └→ switchValues 배열 업데이트
                    └→ 딥스위치 UI + 나머지 진수 영역 모두 자동 갱신

  [DEL 키] 커서 앞 글자 하나 삭제 → switchValues 갱신
  [RESET 키] switchValues 전체 0 초기화, inputValue → "0"

[MSB/LSB 토글 시]
  설정에서 토글 버튼 클릭
    └→ isMSB 상태 반전
        └→ switchValues 배열 순서 반전
            └→ 딥스위치 아래 번호 순서 반전 (LSB: 1~n, MSB: n~1)
                └→ 딥스위치 UI + 진수 영역 모두 갱신

[다크모드 토글 시]
  설정에서 토글 버튼 클릭
    └→ isDarkMode 상태 반전
        └→ index.css의 CSS 변수 전환
            └→ 전체 화면 색상 즉시 변경

[딥스위치 개수 변경 시]
  설정에서 +/- 버튼 클릭
    └→ switchCount 업데이트
        └→ switchValues 배열 재생성 (모두 0으로 초기화)
            └→ 딥스위치 UI 재렌더링


---------------------------------------------------------------
6. UI 레이아웃 설계 (확정)
---------------------------------------------------------------

기준 화면: 아이폰 15 Pro (393px)
컬러 시스템은 아래 [디자인 토큰] 섹션 참고

화면 9분할 구조 (App.jsx 기준):
  상단 1/9 (flex: 1)  ← 빈 스페이서 (Dynamic Island / 상태바 영역)
  중단 7/9 (flex: 7)  ← 실제 콘텐츠 (홈 또는 설정 화면)
  하단 1/9 (flex: 1)  ← 탭 바 (홈/설정) — fixed height 대신 flex 비율 사용

[홈 화면 레이아웃]

전체 콘텐츠 = flex 컨테이너 (column)
padding: 6px 10px, gap: 5px

  상단 3/7 (flex: 3)
  ├── 딥스위치 영역 (flex: 2)
  │     border-radius: 10px
  │     display: grid
  │       grid-template-columns: 1fr 8fr 1fr  ← 가로 10분의 8 (좌우 각 1/10 여백)
  │       grid-template-rows:    1fr 6fr 1fr  ← 세로 8분의 6 (상하 각 1/8 여백)
  │
  │     [switch-columns] → grid-column: 2, grid-row: 2 (가운데 셀에 배치)
  │       · 스위치 개수만큼 switch-col을 가로 나열
  │       · gap: 5px (스위치 간 여백)
  │       · overflow-x: auto (스위치 많을 때 가로 스크롤)
  │
  │     [switch-col] 각 스위치 + 번호를 하나의 컬럼으로 묶음
  │       · flex: 1              ← 가용 너비를 균등 분배 (반응형)
  │       · max-width: 60px     ← 스위치 수 적을 때 너무 넓어지는 것 방지
  │       · 높이: 부모(switch-columns) 높이를 100% 채움 (align-items: stretch)
  │       · 위에 DipSwitch (flex: 1), 아래에 번호 (flex-shrink: 0)
  │
  │     [DipSwitch] width: 100%, flex: 1
  │       · border-radius: 5px
  │       · 위 칸 = 1 (회색)      ← 기본 상태
  │       · 아래 칸 = 0 (파란색)  ← 기본 상태
  │       · 0/1 폰트: 14px bold
  │
  │     [번호] flex-shrink: 0
  │       · LSB 모드: 1, 2, ... n  (왼쪽 → 오른쪽)
  │       · MSB 모드: n, n-1, ... 1 (왼쪽 → 오른쪽)
  │       · font-size: 12px, opacity: 0.55, text-align: center
  │
  ├── 진수 표시 영역 (flex: 1)   ← 딥스위치:진수 = 2:1 비율
  │     display: flex, gap: 6px
  │
  │     [진수 카드] flex: 1 (선택된 진수 수만큼)
  │       border-radius: 8px, padding: 6px 10px
  │       justify-content: space-evenly  ← 라벨/값 간격 확보
  │       align-items: center            ← 가운데 정렬
  │       라벨: font-size 10px, opacity 0.45, text-align: center
  │       값:   font-size 22px, color #0a84ff, text-align: center
  │       활성 카드: border 1.5px solid #0a84ff

  하단 4/7 (flex: 4) - 키패드
    display: grid, grid-template-columns: repeat(3, 1fr), gap: 4px

    행 배치 (위 → 아래, 항상 6행 고정):
      [D] [E] [F]
      [A] [B] [C]
      [7] [8] [9]
      [4] [5] [6]
      [1] [2] [3]
      [RESET] [0] [DEL]

    버튼 동작:
      · RESET: 스위치 전체 + 진수 표시 → 0 초기화 (회색 배경)
      · DEL:   커서 앞 글자 하나 삭제, 빈 문자열이 되면 "0" 표시 (파란색 배경)

    숫자 입력 규칙:
      · leading zero 자동 제거: "0" 상태에서 숫자 입력 시 앞의 0 제거
        예) "0" + "1" → "1" (not "01"), "0" + "5" + "5" → "55"

    A~F 키 상태 규칙:
      · 사용자가 16진수 영역 터치 (activeBase === 16) → 정상 색상, 터치 가능
      · 그 외 (8진수·10진수 터치, 또는 미선택 상태)  → 회색으로 표시, pointer-events: none
        다크:  background #2c2c2e, color #636366
        라이트: background #f2f2f7, color #8e8e93
        opacity: 0.5, cursor: default

    가로 크기 반응형:
      · grid-template-columns: repeat(3, 1fr)
      · width: 100% (부모 너비를 항상 꽉 채움)
      · 키 하나의 너비는 자동으로 1/3씩 균등 분배

    · 모든 키 font-size: 16px 동일
    · border-radius: 7px
    · DEL 버튼: background #0a84ff, color #fff


[설정 화면 레이아웃]

전체 콘텐츠 = flex 컨테이너 (column)
padding: 4px 10px 6px

  상단 5/7 (flex: 5)
  → 4개 섹션 균등 분할 (flex: 1씩)

  각 섹션 공통 구조:
    section-title
      font-size: 13px, 대문자, opacity: 0.45, margin-bottom: 3px
    group-inner
      max-height: 87.5%          ← 섹션 높이의 7/8만 채움
      justify-content: center
      └ 실제 컨트롤 카드
          border-radius: 10px, border: 0.5px solid

  [섹션 1] 설정
    toggle-group (flex column, height: 100%)
      · LSB ↔ MSB   [토글]   (각 행 flex: 1)
      · 다크모드     [토글]

  [섹션 2] 진수 표시
    btn-group (justify-content: center)
      · [8진수] [10진수] [16진수]
      버튼: height 30px, border-radius 7px, padding 8px 10px
      선택됨: background #0a84ff, color #fff

  [섹션 3] ON 방향
    btn-group (justify-content: center)
      · [▲ 위 = ON] [▼ 아래 = ON]
      버튼: height 30px, border-radius 7px, padding 8px 10px
      선택됨: background #0a84ff, color #fff

  [섹션 4] 딥스위치 개수
    count-group (justify-content: center)
      · 개수 텍스트  [−] [n] [+]
      padding: 8px 12px
      +/- 버튼: 원형 26px, background #0a84ff

  하단 2/7 (flex: 2) - 빈 여백


[디자인 토큰]
  배경 (다크):   #1c1c1e
  카드  (다크):   #2c2c2e
  구분선(다크):   #3a3a3c
  비활성(다크):   #3a3a3c (버튼 배경), #636366 (텍스트)
  배경 (라이트):  #f2f2f7
  카드  (라이트):  #ffffff
  구분선(라이트):  #c6c6c8
  비활성(라이트):  #f2f2f7 (버튼 배경), #636366 (텍스트)
  텍스트(다크):   #f2f2f7
  텍스트(라이트):  #1c1c1e
  액티브 블루:    #0a84ff
  토글 ON:       #30d158 (초록)
  토글 OFF:      #636366 (회색)
  border-radius: 10px (카드/그룹), 7px (버튼/키), 5px (딥스위치)
  탭바 액티브:    #0a84ff
  탭바 비활성:    #636366 (다크) / #8e8e93 (라이트)


---------------------------------------------------------------
7. 개발 환경
---------------------------------------------------------------

- 운영체제: macOS (Apple Silicon, MacBook Pro)
- 편집기: VSCode 1.92.2
- Node.js: v25.8.2
- npm: 11.11.1
- 번들러: Vite v8.0.3
- 프레임워크: React (JSX)
- 개발 서버: http://localhost:5173

[개발 서버 실행 방법]
  cd dip-switch-app
  npm run dev

[아이폰에서 확인하는 방법]
  npm run dev -- --host
  → 맥북과 같은 와이파이에 연결된 아이폰에서 접속 가능


---------------------------------------------------------------
8. 구현 순서 (완료)
---------------------------------------------------------------

✅ Step 1.  AppContext.jsx       전체 상태 정의
✅ Step 2.  App.jsx              탭 바 (홈/설정) UI + 9분할 레이아웃
✅ Step 3.  SettingsPage.jsx     설정 화면 UI + 로직
✅ Step 4.  DipSwitch.jsx        딥스위치 토글 UI
✅ Step 5.  NumberDisplay.jsx    진수 표시 영역 UI
✅ Step 6.  Keypad.jsx           커스텀 숫자 키패드 UI (RESET/DEL 개편)
✅ Step 7.  HomePage.jsx         홈 화면 조합
✅ Step 8.  index.css            다크모드 + 반응형 스타일
✅ Step 9.  PWA 설정             아이폰 홈 화면 추가 지원
✅ Step 10. GitHub Pages 배포    무료 호스팅


---------------------------------------------------------------
9. PWA 설정 (GitHub Pages 배포용)
---------------------------------------------------------------

앱스토어 없이 아이폰 홈 화면에 추가하는 방식.
vite-plugin-pwa는 Vite 8과 호환 안 됨 → 수동 설정으로 대체.

[추가/수정 파일 목록]

① index.html (수정 완료)
   <head> 안에 아래 태그 추가:
     <link rel="manifest" href="/manifest.json" />
     <meta name="apple-mobile-web-app-capable" content="yes" />
     <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
     <meta name="apple-mobile-web-app-title" content="딥스위치 계산기" />
     <link rel="apple-touch-icon" href="/icon-192.png" />
   주의: 중복 태그 없도록 정리할 것

② public/manifest.json (추가 필요)
   {
     "name": "DIP Switch Calculator",
     "short_name": "DipSwitch",
     "start_url": "./",
     "display": "standalone",
     "background_color": "#1c1c1e",
     "theme_color": "#1c1c1e",
     "icons": [
       { "src": "./icon-192.png", "sizes": "192x192", "type": "image/png" },
       { "src": "./icon-512.png", "sizes": "512x512", "type": "image/png" }
     ]
   }

③ public/icon-192.png (추가 필요)   192x192px 아이콘
④ public/icon-512.png (추가 필요)   512x512px 아이콘

⑤ vite.config.js (수정 필요)
   base 경로를 GitHub 저장소 이름으로 설정:
   export default defineConfig({
     plugins: [react()],
     base: '/dip-switch-app/'   ← 저장소 이름과 반드시 일치
   })


---------------------------------------------------------------
10. GitHub Pages 배포 방법
---------------------------------------------------------------

배포 플랫폼: GitHub Pages (무료, 계정 있음, git 설치됨)

[배포 순서]

① GitHub에 저장소 생성
   - 저장소 이름: dip-switch-app  (vite.config.js base와 일치)
   - Public으로 생성

② 로컬 프로젝트와 연결
   cd dip-switch-app
   git init
   git remote add origin https://github.com/[유저명]/dip-switch-app.git

③ gh-pages 패키지 설치
   npm install gh-pages -D

④ package.json에 배포 스크립트 추가
   "scripts" 안에 추가:
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"

⑤ 배포 실행
   npm run deploy

⑥ GitHub 저장소 설정
   Settings → Pages → Source: gh-pages 브랜치 선택

⑦ 배포 URL 확인
   https://[유저명].github.io/dip-switch-app/

[코드 수정 후 재배포 방법]
   git push (소스 코드 백업)
   npm run deploy
   → 자동으로 빌드 후 gh-pages 브랜치에 올라감
   → 1~2분 후 URL에 반영됨

[아이폰 홈 화면 추가 방법]
   1. 아이폰 사파리에서 배포 URL 접속
   2. 하단 공유 버튼 터치
   3. "홈 화면에 추가" 선택
   4. 이후 홈 화면에서 앱처럼 실행 가능


---------------------------------------------------------------
11. 현재 진행 상황 (2026-03-28 기준)
---------------------------------------------------------------

[완료]
  ✅ 개발 환경 세팅 (Node.js v25.8.2, Vite v8.0.3, React)
  ✅ AppContext.jsx — 전체 상태 + 키패드 로직 (RESET/DEL/leading zero 제거)
  ✅ App.jsx — 탭 전환 + 9분할 레이아웃 (top-spacer / page-content / tab-bar)
  ✅ HomePage.jsx — 딥스위치 + 진수 표시 + 키패드 조합
  ✅ SettingsPage.jsx — 4개 섹션 (5/7 영역, 각 섹션 max-height 87.5%)
  ✅ DipSwitch.jsx — 딥스위치 토글 UI (CSS Grid 비율 배치)
  ✅ NumberDisplay.jsx — 진수 표시 + 커서 UI
  ✅ Keypad.jsx — 6행 고정, RESET/DEL 버튼, A~F 비활성 처리
  ✅ index.css — 다크/라이트 모드, 9분할 flex, 반응형 스타일
  ✅ index.html — PWA 메타태그 추가
  ✅ GitHub Pages 배포 완료

[이슈 해결 이력]
  · iOS Safari에서 딥스위치 작게 표시 → aspect-ratio 제거, flex:1 + max-width 방식으로 전환
  · PWA 탭바 깨짐 → height 고정 제거, 9분할 flex 레이아웃으로 해결
  · MSB 토글 시 스위치 번호 미반영 → isMSB ? switchCount-i : i+1 로 동적 계산
  · 키패드 A~F 활성 조건 → activeBase === 16 (16진수 영역 터치 시에만 활성화)
  · 숫자 입력 leading zero → raw.replace(/^0+([0-9A-Fa-f])/, '$1') 로 제거

===============================================================
