# MUTE-vue

## 📌 프로젝트 소개

Vue 3 기반 음악 서비스 프론트엔드 프로젝트입니다.  
온보딩, 로컬/소셜 로그인, 메인/검색/차트, 플레이어, 라이브러리, 마이페이지, AI 페이지를 포함합니다.

---

## 🛠️ 기술 스택

### ✅ Front-end

- Vue 3
- Vue CLI 5
- JavaScript
- CSS
- Swiper
- @lottiefiles/dotlottie-vue

### ✅ State / Routing

- Pinia
- vue-router

### ✅ API / Auth

- axios (`withCredentials: true`)
- vue3-google-login
- PHP Session 기반 인증 (`/auth/*.php`)

### ✅ External API

- Last.fm API
- iTunes Search API
- Google / Naver / Kakao OAuth

---

## 🧩 기능 설명

### 📝 회원가입

- 일반 회원가입: `POST /auth/register.php` API를 통해 JSON데이터로 사용자 데이터를 전달하고, 비밀번호는 해시 처리 후 MySQL에 저장
- 닉네임 중복 확인: `POST /auth/check_nickname.php` API를 통해 사용자가 입력한 닉네임을 백엔드로 전달한 뒤, MySQL에서 중복 여부를 검증하여 사용 가능 여부를 확인

### 🔐 로그인 (로컬)

- `POST /auth/login.php` 요청으로 로그인 정보를 백엔드에 전달하고, MySQL 검증 후 로그인 결과를 반환
- 요청/인증 후 세션에 사용자 정보(`email`, `provider`, `nickname`)를 저장합니다.
- 로컬 로그인은 `profileImg`를 저장하지 않으며, 마이페이지에서 기본 프로필 이미지로 표시합니다.

### 🌐 소셜 로그인 (Google / Naver / Kakao)

- 소셜 로그인 시 사용자 정보(`email`, `nickname`, `profileImg`, `provider`)를 전달합니다.
- `POST /auth/social_login.php`로 처리 후 세션에 사용자 정보를 저장합니다.
- 로그인 성공 시 `/welcome`으로 이동하고 `localStorage(login-check)`를 갱신합니다.

### 👤 인증 상태 관리

- `GET /auth/checkAuth.php` 응답을 기준으로 실제 로그인 여부를 판별합니다.
- `src/store/auth.js`의 `fetchAuthData` 캐시(`maxAgeMs`)로 불필요한 인증 요청을 줄입니다.
- `localStorage(login-check)`는 UI 보조 상태로 사용합니다.

### 🎨 아티스트 선택

- 사용자가 `artist-select` 페이지에서 아티스트를 최소 3개 이상 선택하면 해당 데이터를 `localStorage`에 저장합니다.

### 🎈 메인페이지 (내 취향에서 찾은 음악)

- 메인 페이지(내 취향에서 찾은음악)에서 저장된 아티스트 정보를 기준으로 iTunes Search API를 호출해 곡 목록을 출력합니다.

### 🎈 메인페이지 (인기차트)

- Last.fm API의 Top Track 데이터를 가져온 뒤, iTunes Search API와 연동하여 인기 음원 목록을 출력

### 🎈 메인페이지 (아티스트 모먼트)

- 영상을 `Cloudinary`에 업로드하고 발급된 호스팅 링크를 MySQL에 저장한 뒤, 해당 URL을 불러와 화면에 출력

### 😀 마이페이지

- 사용자가 로그인한 소셜로그인 / 로컬 데이터를 `fetchAuthData()` 함수를 사용하여 사용자의 데이터를 가져와 출력합니다.
- 로그아웃 클릭시 `clearAuthState()` 를 사용하여 사용자의 상태를 초기화시키며 `logoutApi` 를 호출하여 로그아웃 합니다.

### 📈 차트

- Last.fm(OPEN API) Top Tracks를 기본 데이터로 사용합니다.
- iTunes 검색으로 커버/프리뷰 URL을 보강합니다.
- `sessionStorage('mute-chart-itunes-cache-v1')` 캐시를 사용합니다.

### 🎵 음악 검색

- `iTunes Search API`를 사용해 사용자가 입력한 (아티스트명, 곡 제목)을 기반으로 관련 음원 정보를 검색 및 출력
- 검색 결과 목록에서`⁝`버튼을 통해 곡을 즉시 플레이리스트에 담을 수 있도록 구현

### 💿 음악 재생

- 검색 결과 페이지에서 선택한 음원을 플레이어 페이지로 전달하여 재생
- 재생한 음원을 기준으로 아티스트 관련 곡 목록을 `localStorage('mute-player-state')`에 저장하고, 다음 곡 재생 시 해당 목록을 기반으로 연속 재생 구현

### 🎶 플레이어 / 미니플레이어

- 공통 키: `localStorage('mute-player-state')`
- 검색/차트 및 음악이 재생될떄마다 `localStorage('my-playlist')`에 자동 등록이 됩니다.
- 플레이어를 아래로 드래그하면 미니플레이어로 전환
- 플레이어에서 커버 이미지를 좌우로 드래그하면 다음 곡 또는 이전 곡으로 전환되도록 구현
- 미니플레이어를 왼쪽으로 드래그하면 플레이어를 종료하고, `localStorage('mute-player-state')`를 삭제하여 재생 상태를 초기화

### 🎶 플레이리스트

- 내 플레이리스트 키: `localStorage('my-playlist')`
- 모달에서 트랙 추가/삭제 후 커스텀 이벤트로 목록을 동기화합니다.
- 전체듣기 버튼 클릭시 해당 곡이 `localStorage('mute-player-state')` 에 추가가되며 미니플레이어와 플레이어가 동기화되며 음악이 재생이됩니다.

### 📚 라이브러리

- 내 라이브러리 키 `localStorage('mute-library-items-v1')`
- 라이브러리 초기 진입 시 데이터가 없으면 기본 목록을 자동 생성합니다.
- 모달에서 트랙 및 라이브러리 삭제 후 커스텀 이벤트로 목록을 동기화합니다.
- 라이브러리 의 이름,이미지를 커스텀 할수있으며 , 트랙 및 라이브러리를 추가 / 삭제 / 재생이 가능합니다.
- 전체 재생/셔플 재생 선택 시 재생 목록과 상태값을 `localStorage('mute-player-state')`에 저장하고, 이를 기반으로 플레이어에서 곡을 재생

### 🤖 AI 추천

- `POST /ai/music_search.php`로 감정/장르 키워드 기반 음악을 추천받습니다.
- iTunes 보강 데이터를 포함해 결과를 렌더링합니다.
- 결과를 플레이리스트/라이브러리에 저장할 수 있습니다.

### 🎬 비디오 상세 + 댓글

- 게시물/댓글 상태를 로컬 저장소와 서버 데이터로 함께 관리합니다.
- 댓글 등록 시 공백 및 중복 제출을 방지하고, 등록 후 목록을 즉시 갱신합니다.

### 🥽 비동기 요청 로딩 상태 처리

- API 요청 중 공용 로딩 컴포넌트를 표시하여 사용자에게 현재 처리 상태를 명확히 전달

---

## 🚀 실행 방법

### 의존성 설치

```bash
yarn install
```

### 개발 서버 실행

```bash
yarn serve
```

### 프로덕션 빌드

```bash
yarn build
```

### 린트

```bash
yarn lint
```

---

## ⚙️ 환경 변수 (.env)

```env
VUE_APP_OAUTH_CLIENT=
VUE_APP_NAVER_CLIENT_ID=
VUE_APP_LOCAL_NAVER_CALLBACK_URL=
VUE_APP_DOTHOME_NAVER_CALLBACK_URL=
VUE_APP_KAKAO_JS_KEY=
VUE_APP_NODE_ENV=development
VUE_APP_LASTFM_API_KEY=
```

- OAuth/API 키 등 민감 정보는 Git에 커밋하지 않는 것을 권장합니다.
- 환경별 설정은 `.env.development`, `.env.production` 분리를 권장합니다.

---

## 🗺️ 라우팅 구조

### 온보딩

- `/splash`
- `/signup`
- `/signup-info`
- `/welcome`
- `/artist-select`
- `/loading`

### 메인 영역

- `/main`
- `/main/search`
- `/main/chart`
- `/main/mypage`
- `/main/ticket-select`
- `/main/library`
- `/main/library/:id`
- `/main/playlist`
- `/main/player/:id`
- `/main/artist-info`
- `/main/search-result`
- `/main/video-detail/:id`
- `/main/ai`
- `/main/ticket`

라우터 파일: `src/router/index.js`

---

## 📁 프로젝트 구조

```text
.
├─ public/
├─ src/
│  ├─ api/
│  ├─ assets/
│  ├─ components/
│  ├─ mixins/
│  ├─ router/
│  ├─ store/
│  ├─ views/
│  │  ├─ OnboardingFlow/
│  │  ├─ main/
│  │  ├─ Chart/
│  │  ├─ search/
│  │  ├─ player/
│  │  ├─ VideoDetail/
│  │  ├─ mypage/
│  │  ├─ library/
│  │  ├─ playlist/
│  │  ├─ ticket/
│  │  ├─ artistinfo/
│  │  └─ ai/
│  ├─ App.vue
│  └─ main.js
├─ .env
├─ git-log.txt
├─ package.json
├─ vue.config.js
└─ README.md
```

---

## 🗓️ 최근 작업 요약

### 2026-03-16 ~ 2026-03-21

- 플레이리스트 모달 추가/수정 및 모달 담기 기능 확장
- AI 페이지 기능 추가 및 모달 UI 보강
- 인증/음악 API 및 사용자 데이터 상태관리 리팩토링 (`4df6683`)
- 비디오 디테일/뮤직비디오 디테일 페이지 수정
- 차트/검색/라이브러리/플레이어/마이페이지/티켓 화면 UI 및 동작 개선
- 라이브러리 디테일 롤백 및 회귀 대응

### 2026-03-02 ~ 2026-03-14

- 온보딩/로그인/회원가입/소셜로그인(구글/네이버/카카오) 구축
- 메인/검색/차트/플레이어/비디오 디테일 페이지 기능 추가
- 미니플레이어/플레이어 전환 안정화 및 재생 로직 개선
- 세션 기반 로그인 확인 흐름 정리 및 인증 관련 리팩토링
