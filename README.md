# MUTE-vue

Vue 3 기반 음악 서비스 프론트엔드 프로젝트입니다.
온보딩, 로컬/소셜 로그인, 메인/검색/차트, 플레이어, 라이브러리, 마이페이지, AI 페이지를 포함합니다.

## 1) 프로젝트 개요

- 프로젝트명: `MUTE`
- 프레임워크: `Vue 3` + `Vue CLI 5`
- 상태관리: `Pinia`
- 라우팅: `vue-router`
- 통신: `axios` (`withCredentials: true`)

## 2) 기술 스택

- `vue` 3.x
- `@vue/cli-service` 5.x
- `pinia`
- `vue-router`
- `axios`
- `swiper`
- `vue3-google-login`
- `@lottiefiles/dotlottie-vue`

## 3) 실행 방법

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

## 4) 환경 변수 (.env)

```env
VUE_APP_OAUTH_CLIENT=
VUE_APP_NAVER_CLIENT_ID=
VUE_APP_LOCAL_NAVER_CALLBACK_URL=
VUE_APP_DOTHOME_NAVER_CALLBACK_URL=
VUE_APP_KAKAO_JS_KEY=
VUE_APP_NODE_ENV=development
VUE_APP_LASTFM_API_KEY=
```

참고:

- OAuth/API 키 등 민감 정보는 Git에 커밋하지 않는 것을 권장합니다.
- 환경별 설정은 `.env.development`, `.env.production` 분리를 권장합니다.

## 5) 라우팅 구조

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

## 6) 인증/로그인 구조

- 스토어: `src/store/auth.js`
- 주요 메서드: `fetchAuthData`, `setLocalStroge`, `clearAuthState`
- 인증 API: `src/api/_auth_api.js`
    - `POST /auth/login.php`
    - `POST /auth/social_login.php`
    - `POST /auth/register.php`
    - `GET /auth/checkAuth.php`
    - `POST /auth/logout.php`
    - `POST /auth/check_nickname.php`

인증 동작 요약:

- 로컬 로그인은 `POST /auth/login.php` 호출 시 `email`, `provider(local)`, `nickname`을 전달합니다.
- 로컬 로그인은 `profileImg`를 저장하지 않으며, 마이페이지에서는 기본 프로필 이미지를 사용합니다.
- 소셜 로그인은 로그인 시점에 `email`, `nickname(이름)`, `profileImg`, `provider`를 전달합니다.
- 로컬/소셜 로그인 성공 후 PHP 서버 세션에 사용자 정보를 저장해 세션 기반 인증을 유지합니다.
- `axios`는 `withCredentials: true`로 세션 쿠키를 포함해 요청합니다.
- `localStorage(login-check)`는 UI 보조 상태이며, 실제 로그인 판별은 `checkAuth.php` 응답을 기준으로 합니다.
- 프론트엔드에서 로그인 요청(POST) 전송 → PHP 백엔드에서 사용자 데이터 검증 및 세션 저장 → 로그인 성공 응답 반환

## 7) API/프록시 설정

### API 클라이언트

- 파일: `src/api/api.js`
- 개발 API: `http://localhost/backend/api`
- 배포 API: `/api` (devServer 프록시 사용)
- 옵션: `withCredentials: true`

### devServer 프록시 (`vue.config.js`)

- `/api` -> `https://muteapp.dothome.co.kr/`
- `/oauth2.0` -> `https://nid.naver.com`
- `cookieDomainRewrite: 'localhost'`

## 8) 최근 작업 요약

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

## 9) 기능 구현 상세

### 9-1-1) 로컬 로그인

- 로그인 폼 제출 시 `src/views/OnboardingFlow/SplashView.vue`의 `handleLogin`이 실행됩니다.
- 이메일/비밀번호 공백 검증 후 `loginApi`를 호출합니다.
- 호출 API는 `src/api/_auth_api.js`의 `POST /auth/login.php`입니다.
- 요청 본문에는 `email`, `password`, `provider(local)`가 포함되며, 서버에서 로그인된 사용자의 `nickname`/`email`/`provider`를 세션에 저장합니다.
- 로컬 로그인은 `profileImg`를 저장하지 않아 마이페이지에서 기본 프로필 이미지 fallback으로 노출됩니다.
- 로그인 성공 시 `auth.provider = 'local'`로 설정하고 `setLocalStroge()`로 `localStorage(login-check)`를 저장합니다.
- 화면은 `/welcome`으로 이동하고, 이후 메인페이지에서 헤더/마이페이지 등에서 `fetchAuthData()`로 서버 인증 상태를 다시 조회합니다.

### 9-1-2) 소셜 로그인 (Google/Naver/Kakao)

- 구현 파일은 `src/views/OnboardingFlow/SignUpView.vue`입니다.
- Google:
- `google.accounts.oauth2.initTokenClient`로 액세스 토큰을 받고 Google userinfo API로 사용자 정보를 조회합니다.
- 조회한 `email/nickname/profileImg/accessToken`을 `socialLoginApi`로 전달합니다.
- Naver:
- 네이버 SDK(`LoginWithNaverId`) 초기화 후 로그인 상태 콜백에서 토큰을 추출합니다.
- 토큰/프로필 정보를 `socialLoginApi`로 전달합니다.
- Kakao:
- `window.Kakao.Auth.login`으로 토큰 획득 후 `Kakao.API.request('/v2/user/me')`로 프로필 정보를 조회합니다.
- 토큰/프로필 정보를 `socialLoginApi`로 전달합니다.
- 공통 서버 엔드포인트는 `POST /auth/social_login.php`입니다.
- 소셜 로그인은 `email`, `nickname(이름)`, `profileImg`, `provider`를 사용자 정보로 받아 세션에 저장합니다.
- 성공 시 `setLocalStroge()` 호출 후 `/welcome`으로 이동합니다.

## fix

- 세션에 저장된 값을 요청해 Pinia 상태로 관리하고, 만료 시간을 설정해 로그인 여부를 확인하며 불필요한 데이터 요청을 최소화

### 9-2) 아티스트 선택 페이지

- 사용자가 원하는 아티스트를 선택후 `LocalStorage` 에 저장 (최소 3개 이상 선택가능)
- 선택한 아티스트정보(`LocalStorage`) 기준으로 메인 페이지에서 iTunes API에 아티스트명을 요청하고, 해당 아티스트의 곡 목록을 출력하도록 구현

### 9-3) 인증 상태 관리 방식 (세션 + 클라이언트 보조 상태)

- Axios 인스턴스(`src/api/api.js`)는 `withCredentials: true`를 사용합니다.
- 즉, 인증의 기준은 PHP 세션 쿠키이며 서버 상태는 `GET /auth/checkAuth.php`로 확인합니다.
- `src/store/auth.js`의 `fetchAuthData`는 캐시(`maxAgeMs`)를 두어 불필요한 인증 조회를 줄입니다.
- `localStorage(login-check)`는 UI 렌더 보조용이며, 최종 사용자 정보는 `authData`(서버 응답)를 기준으로 사용합니다.

### 9-4) 플레이어/미니플레이어 상태 동기화

- 공통 키: `localStorage('mute-player-state')`
- 저장 데이터: `tracks`, `currentIndex`, `currentTime`, `isPlaying`, `songName`, `singerName`, `albumCover`, `playerPath`
- 플레이어(`src/views/player/player.vue`)와 미니플레이어(`src/components/layout/MiniPlayer.vue`)가 같은 키를 읽고 씁니다.
- 상태 변경 시 `window.dispatchEvent(new CustomEvent('mute-player-state-updated'))`로 같은 탭 내 즉시 동기화합니다.
- 전체 플레이어 닫을 때 handoff 시간(`currentTime`)을 넘겨 재생 위치를 이어받도록 구현되어 있습니다.
- `previewUrl`이 없는 트랙은 다음/이전 탐색 시 재생 가능한 트랙을 찾아 건너뜁니다.
- autoplay 차단(`NotAllowedError`)이 발생하면 사용자 다음 제스처까지 재생 재시도를 보류합니다.

### 9-5) 차트 데이터 구성 (Last.fm + iTunes 보강)

- 메인 데이터는 Last.fm Top Tracks를 사용합니다 (`src/views/Chart/ChartView.vue`).
- 트랙 메타(커버/미리듣기 URL)는 iTunes 검색 API를 추가 호출해 보강합니다.
- iTunes 결과는 `sessionStorage('mute-chart-itunes-cache-v1')`에 캐시합니다.
- 연속 실패가 누적되면 iTunes 보강을 일시 차단하고 Last.fm 데이터만으로 폴백합니다.
- 차트에서 곡 클릭/전체듣기 시 플레이어 포맷으로 변환해 `mute-player-state`를 저장하고 `/main/player/:id`로 이동합니다.

### 9-6) 라이브러리/플레이리스트 동작

- 라이브러리 목록은 `src/views/library/Library.vue`에서 생성/보강됩니다.
- 상세 화면은 `src/views/library/LibraryDetail.vue`, 내 플레이리스트는 `src/views/playlist/playlist.vue`에서 처리합니다.
- 내 플레이리스트 키: `localStorage('my-playlist')`
- 초기 진입 시 저장된 라이브러리 항목이 하나도 없으면(`storedItems.length === 0`), `buildApiLibrary()`로 기본 라이브러리 목록을 자동 생성해 저장/표시합니다.
- 모달(`ListModal`, `PlayListModal`, `LibraryDetailModal`)에서 트랙 추가/삭제 시 중복 체크 후 저장합니다.
- 저장 후 `my-playlist-updated`, `library-items-updated` 커스텀 이벤트를 발생시켜 목록과 상세를 동기화합니다.
- 재생 시작 시 플레이리스트 트랙을 플레이어 공통 포맷으로 변환해 `mute-player-state`를 생성하고 플레이어로 이동합니다.

### 9-7) AI 추천 기능

- 입력 감정/키워드를 `src/views/ai/Ai.vue`에서 받아 `searchMusicByEmotion`으로 전송합니다.
- 서버 엔드포인트는 `POST /ai/music_search.php`입니다 (`src/api/_ai.js`).
- 응답 곡 목록은 iTunes 검색으로 커버/프리뷰 URL을 보강해 리스트로 렌더링합니다.
- 결과를 한 번에 `my-playlist`에 추가하거나 라이브러리 항목으로 저장할 수 있습니다.
- 저장 시 각 섹션이 즉시 반영되도록 커스텀 이벤트를 함께 발행합니다.

### 9-8) 비디오 상세 + 댓글

- 파일: `src/views/VideoDetail/VideoDetail.vue` (`script setup` 기반)
- 초기 마운트 시 아래 순서로 상태를 복원/조회합니다.
    - 로컬 상태 복원: 게시물 좋아요/공유/다운로드, 댓글 좋아요, 작성자 프로필 맵
    - 사용자 정보 조회: `authStore.fetchAuthData()` -> 닉네임/프로필 반영
    - 콘텐츠 조회: `getVideoApi(id)`, `getCommentsApi(id)`
- 비디오 영역은 `result.post.video_url`로 렌더링하며, 아티스트명은 `artist/singer/artist_name/writer` 순서로 fallback 처리합니다.
- 게시물 액션(좋아요/공유/다운로드)은 post id 기준 localStorage 키로 저장되어 새로고침 후에도 상태가 유지됩니다.
    - `post_like_{id}`, `post_share_{id}`, `post_download_{id}`
- 댓글 좋아요 상태도 localStorage(`liked_comments_{id}`)로 관리하며, UI 카운트는 서버 기본값 + 로컬 좋아요 여부로 계산합니다.
- 댓글 작성자 프로필 매핑(`comment_profile_map_{id}`)을 저장해, 댓글에 프로필 이미지가 없을 때도 작성자별 이미지 fallback이 동작합니다.
- 댓글 등록(`commentAddApi`) 시:
    - 공백 입력 방지
    - `isSubmitting`으로 중복 제출 방지
    - 등록 성공 후 입력값 초기화 + `getComments()` 재호출로 목록 즉시 갱신

## 10) 프로젝트 구조

```text
.
├─ public/
├─ src/
│  ├─ api/                    # axios 인스턴스, 인증/음악 API
│  ├─ assets/                 # 이미지, 스타일, lottie
│  ├─ components/             # layout/ui 공용 컴포넌트
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

## 11) 변경 이력 (Changelog)

| 날짜       | 유형     | 주요 내용                                                        |
| ---------- | -------- | ---------------------------------------------------------------- |
| 2026-03-22 | docs     | `git-log.txt` 기준으로 README 전면 재작성                        |
| 2026-03-21 | fix/ui   | 전체 디자인 디테일 수정, 라이브러리/마이페이지/티켓 화면 보완    |
| 2026-03-20 | refactor | API/상태관리/파일 구조 리팩토링 및 최적화                        |
| 2026-03-20 | feat/fix | 플레이리스트 모달, 차트/검색/라이브러리/비디오 디테일 수정       |
| 2026-03-19 | feat/fix | AI 기능/모달, 플레이리스트 담기, 메인/디자인 보완                |
| 2026-03-18 | feat/fix | AI 페이지 추가, 미니플레이어 타임라인 추가, 레이아웃/디테일 보완 |
| 2026-03-17 | fix/ui   | 플레이어/라이브러리/앨범커버/스크롤 수정                         |
| 2026-03-16 | feat/fix | 마이페이지/모달 기능 추가, 뮤직비디오 페이지 보완                |
| 2026-03-14 | feat/fix | 마이페이지 프로필 정보 출력, 소셜 로그인 처리 개선               |
| 2026-03-12 | feat/fix | 미니플레이어-플레이어 오버레이 전환 및 재생 안정화               |
| 2026-03-10 | fix      | 로그인 상태 세션 저장 및 인증 흐름 리팩토링                      |
| 2026-03-08 | fix      | 배포 API 경로/PHP 연결/재생 이슈 수정                            |
| 2026-03-02 | init     | Vue 프로젝트 기본 구조 구성                                      |

## 12) 배포 체크리스트

- `.env` 값이 환경별로 정확히 분리되어 있는지 확인
- `/auth/*.php` API 접근 가능 여부 확인
- `withCredentials: true`와 서버 CORS/세션 설정 확인
- 소셜 로그인 콜백 URL(로컬/배포) 등록값 일치 확인
- 플레이어 진입/이동/다음 곡 재생 흐름 확인

