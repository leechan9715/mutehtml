# MUTE-vue

Vue 3 기반 음악 서비스 프론트엔드 프로젝트입니다.  
온보딩, 소셜 로그인, 메인/검색/차트, 플레이어, 마이페이지까지 포함합니다.

## 1) 프로젝트 개요

- 프로젝트명: `MUTE`
- 프레임워크: `Vue 3` + `Vue CLI 5`
- 상태관리: `Pinia`
- 라우팅: `vue-router`
- HTTP 통신: `axios`
- 핵심 기능:
- 온보딩 플로우 (`/splash`, `/signup`, `/signup-info`, `/welcome`, `/artist-select`, `/loading`)
- 메인/검색/차트 (`/main`, `/main/search`, `/main/chart`, `/main/search-result`)
- 플레이어 (`/main/player/:id`)
- 쇼츠 상세 (`/videos/:id`)
- 마이페이지/라이브러리/플레이리스트/이용권

## 2) 기술 스택

- `vue` 3.x
- `@vue/cli-service` 5.x
- `pinia`
- `vue-router`
- `axios`
- `swiper`
- `vue3-google-login`

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

## 4) 환경 변수(.env)

프로젝트에서 사용하는 주요 변수:

```env
VUE_APP_OAUTH_CLIENT=
VUE_APP_NAVER_CLIENT_ID=
VUE_APP_LOCAL_NAVER_CALLBACK_URL=
VUE_APP_DOTHOME_NAVER_CALLBACK_URL=
VUE_APP_KAKAO_JS_KEY=
VUE_APP_LASTFM_API_KEY=
VUE_APP_BASE_DOTHOME_URL=
```

참고:

- OAuth/API 키 등 민감 정보는 Git에 커밋하지 않는 것을 권장합니다.
- 배포 시 `.env.production` 등 환경별 파일 분리를 권장합니다.

## 5) 라우팅 구조

- 온보딩
- `/splash`
- `/signup`
- `/signup-info`
- `/welcome`
- `/artist-select`
- `/loading`
- 메인 영역
- `/main`
- `/main/search`
- `/main/chart`
- `/main/mypage`
- `/main/ticket-select`
- `/main/library`
- `/main/playlist`
- `/main/player/:id`
- `/main/artist-info`
- `/main/search-result`
- 쇼츠 상세
- `/videos/:id`

라우터 파일: `src/router/index.js`

## 6) 인증/로그인 구조

- 스토어: `src/store/auth.js`
- 액션: `checkAuth`, `login`, `register`, `logout`
- API 엔드포인트:
- `POST /auth/login.php`
- `POST /auth/register.php`
- `GET /auth/check_login.php`
- `POST /auth/logout.php`
- `POST /auth/check_nickname.php`

소셜 로그인:

- Google: `vue3-google-login`
- Naver: 네이버 SDK
- Kakao: 카카오 SDK

API 클라이언트: `src/api/index.js`

- 개발: `http://localhost/backend/api`
- 배포: `https://muteapp.dothome.co.kr/api`
- `withCredentials: true`

## 7) 개발 서버 프록시

`vue.config.js` 기준:

- `/api` -> `https://muteapp.dothome.co.kr`
- `/oauth2.0` -> `https://nid.naver.com`

## 8) 최근 작업 요약 (2026-03-02 ~ 2026-03-08)

### feat (기능 구현)

- 플레이어 페이지 구현 및 검색 결과 페이지에서 플레이어 진입 후 재생 기능 추가
- 메인페이지 쇼츠 기능 구현
- 쇼츠 상세 페이지(`VideoDetail`) 영상 출력, 댓글/댓글 입력 기능 추가
- 라이브러리/플레이리스트/이용권 선택 페이지 추가
- 아티스트 소개 페이지 및 아티스트 선택 페이지 추가

### fix (오류 수정)

- 소셜 로그인(구글/네이버/카카오) 동작 오류 수정
- 배포 환경에서 플레이어 음원 재생이 안 되는 문제 수정
- 배포 후 PHP 연결 문제 수정
- API 요청 경로 정리 및 환경별 분기 수정
- `.env` 기반 환경변수 적용으로 설정 방식 개선
- 페이지 이동 시 다음 곡 자동 재생 로직 보완
- 검색 결과의 영문 표기 및 다른 음악이 재생되는 오류 수정
- 메인 인기차트/쇼츠 동작 관련 버그 수정

## 8-1) 최근 작업 요약 (2026-03-12)

### feat (기능 구현)

- 미니플레이어 클릭 시 라우트 이동 없이 전체 플레이어를 오버레이(슬라이드 업)로 표시
- 오버레이 플레이어 반투명 백드롭 추가 및 백드롭 클릭 닫기 동작 추가
- 미니플레이어에 이전곡 버튼 추가
- 플레이어 열림 상태에서 헤더/푸터 숨김 처리
- 화면 폭 축소 시 미니플레이어를 반응형으로 전체 폭 표시

### fix (오류 수정)

- 미니플레이어 디자인 수정
- 플레이어 -> 미니플레이어 전환 시 현재 곡 메타(커버/제목/가수) 동기화 오류 수정
- 플레이어 드래그 다운/강제 페이지 전환 시 재생 중단되는 문제 완화 및 handoff 로직 보강
- 플레이어/미니플레이어 전환 시 중복 재생(두 오디오 겹침) 문제 수정
- 마지막 곡에서 다음곡 이동 시 첫 곡으로 순환 재생되도록 수정
- 트랙 변경 시 타임라인이 이전 곡 시간을 유지하던 버그 수정(0초부터 시작)
- 브라우저 autoplay 정책(`NotAllowedError`)로 인한 반복 재생 시도/콘솔 스팸 로그 완화
- 작은 브라우저 높이에서 플레이어 하단이 푸터에 가려지던 UI 문제 수정

## 8-2) 최근 작업 요약 (2026-03-13)

### feat (기능 구현)

- 메인페이지에서 선택한 가수의 앨범을 선택하면 그가수해당하는 노래 리스트 를 로컬스토리지에 저장시킨후 플레이
- 아티스트 선택 페이지에서 원하는 가수 선택하면 메인에 선택한 가수의 앨범이 출력
- 차트 페이지(`ChartView`)에서 차트 항목 클릭/전체듣기 시 현재 차트 목록을 `localStorage(mute-player-state.tracks)`에 저장하고 플레이어와 동기화
- 차트 재생 시작 시 선택한 곡 인덱스를 `currentIndex`로 반영해 플레이어/미니플레이어에서 동일 재생 흐름 유지
- Last.fm 차트 목록 기반 iTunes 메타(제목/가수/커버/미리듣기) 매핑 강화

### perf (성능 최적화)

- 차트 iTunes 호출 최적화: 세션 캐시(`mute-chart-itunes-cache-v1`) 추가, 로드당 요청 상한 적용, 실패 시 폴백 유지
- 플레이어/미니플레이어 드래그 이벤트 최적화: 전역 `move/end` 리스너를 드래그 중에만 동적 바인딩
- `touchcancel` 처리 추가로 모바일 제스처 중단 시 상태 꼬임/리스너 잔존 방지
- 검색결과 페이지 초기/변경 조회 로직 정리(즉시 watch 기반)로 중복 호출 감소
- 리스트 이미지(`MainListItem`, `ChartListItem`) lazy/async 디코딩 적용으로 초기 렌더 비용 감소
- 온보딩 날짜 휠 드래그 이벤트 처리 개선으로 모바일 스크롤 충돌 완화
- `Logo`/`AppFooter` 애니메이션 타이머 정리(`beforeUnmount` clear)로 페이지 이동 시 타이머 누수 방지

## 8-2) 최근 작업 요약 (2026-03-14)

### feat (기능 구현)

- 소셜로그인 , 로컬 로그인 시 마이페이지에 이메일,이름(닉네임),프로필 이미지 출력
- 소셜 로그인 , 로컬 로그인 시 공용 헤더 프로필 보이게 하기
-

### fix (오류수정)

- 구글 로그인 시 개발자계정외 다른계정 로그인시 실패 해결
- 네이버 구글 카카오 env 수정

## 9) 프로젝트 구조 (업데이트)

```text
.
├─ public/
├─ src/
│  ├─ api/                    # axios 인스턴스, 인증 API
│  ├─ assets/
│  │  ├─ fonts/               # Pretendard 폰트
│  │  ├─ images/              # 화면별 이미지 에셋
│  │  └─ styles/
│  │     ├─ global/           # 전역 스타일(reset, font, variables 등)
│  │     └─ pages/            # 페이지 단위 스타일
│  ├─ components/
│  │  ├─ layout/              # Header/Footer/ListItem/Modal 등
│  │  └─ ui/                  # 공용 UI 컴포넌트
│  ├─ mixins/                 # 공통 믹스인
│  ├─ router/                 # 라우터 설정
│  ├─ store/                  # Pinia 스토어
│  ├─ views/
│  │  ├─ OnboardingFlow/      # 스플래시/회원가입/온보딩
│  │  ├─ main/                # 메인 섹션 화면
│  │  ├─ Chart/               # 차트
│  │  ├─ search/              # 검색/검색결과
│  │  ├─ player/              # 플레이어
│  │  ├─ VideoDetail/         # 쇼츠 상세
│  │  ├─ mypage/              # 마이페이지
│  │  ├─ library/             # 라이브러리
│  │  ├─ playlist/            # 플레이리스트
│  │  ├─ ticket/              # 이용권 선택
│  │  └─ artistinfo/          # 아티스트 소개
│  ├─ App.vue
│  └─ main.js
├─ .env
├─ package.json
├─ vue.config.js
└─ README.md
```

## 10) 변경 이력 (Changelog)

| 날짜       | 유형     | 주요 내용                                                                                  |
| ---------- | -------- | ------------------------------------------------------------------------------------------ |
| 2026-03-12 | feat/fix | 미니플레이어-플레이어 오버레이 전환, 백드롭/닫기, 이전곡 버튼, 재생 handoff 안정화         |
| 2026-03-12 | fix      | 트랙 순환 재생, 타임라인 초기화, 작은 높이에서 플레이어 하단 가림/헤더·푸터 노출 이슈 수정 |
| 2026-03-13 | feat     | 차트 목록 클릭/전체듣기 시 트랙 목록 로컬스토리지 저장 후 플레이어 동기 재생               |
| 2026-03-13 | perf     | Chart iTunes 캐시/요청 상한, 드래그 리스너 동적 바인딩, 모바일 터치/스크롤 성능 최적화     |
| 2026-03-10 | fix      | 로그인 상태 세션으로 저장                                                                  |
| 2026-03-10 | fix      | 로그인/회원가입/로그인확인 프론트코드 리팩토링                                             |
| 2026-03-08 | fix      | 배포 후 PHP 연결 문제 수정, API 요청 경로 수정, `.env` 환경변수 전환                       |
| 2026-03-08 | fix      | 플레이어 배포 환경 재생 오류 수정, 페이지 이동/다음 곡 자동 재생 보완                      |
| 2026-03-07 | feat     | 검색결과 -> 플레이어 이동 후 재생 기능 추가                                                |
| 2026-03-07 | feat/fix | 메인 쇼츠 기능 구현 및 인기 차트 관련 수정                                                 |
| 2026-03-06 | refactor | 라우터/레이아웃 경로 수정, 소셜 로그인 관련 파일 정리                                      |
| 2026-03-05 | feat     | 플레이어/라이브러리/플레이리스트/이용권 선택/아티스트 소개 페이지 추가                     |
| 2026-03-04 | feat/fix | 소셜 로그인 추가 및 로그인/회원가입/마이페이지 기능 보완                                   |
| 2026-03-03 | feat     | 공용/재사용 컴포넌트 확장 (`AppTopBar`, `MainListItem`, `ChartListItem` 등)                |
| 2026-03-02 | init     | Vue 프로젝트 기본 골격 구성                                                                |

## 11) 협업 및 브랜치 전략

- 기본 브랜치: `vue/main`
- 기능 개발 브랜치 예시: `vue/main-xxx`
- 작업 흐름:
- 기능 브랜치에서 개발
- `vue/main` 최신 내용 주기적 병합
- 충돌 해결 후 기능 검증
- 최종 `vue/main`으로 병합

## 12) 핵심 재사용 컴포넌트

- `src/components/layout/AppHeader.vue`: 상단 헤더
- `src/components/layout/AppFooter.vue`: 하단 푸터 네비게이션
- `src/components/layout/AppTopBar.vue`: 공통 탑바
- `src/components/layout/MainListItem.vue`: 메인 리스트 아이템
- `src/components/layout/ChartListItem.vue`: 차트 리스트 아이템
- `src/components/layout/PlayListItem.vue`: 플레이리스트 아이템
- `src/components/layout/Modal.vue`: 공통 모달
- `src/components/ui/SearchInput.vue`: 검색 입력 UI
- `src/components/ui/BaseButton.vue`, `src/components/ui/BaseInput.vue`: 기본 폼 UI

## 13) 배포 체크리스트

- `.env`와 `.env.production` 값이 환경별로 정확히 분리되어 있는지 확인
- `VUE_APP_BASE_DOTHOME_URL` 및 API `baseURL`이 배포 주소와 일치하는지 확인
- PHP API 엔드포인트(`/auth/*.php`) 접근 가능 여부 확인
- 세션 기반 인증을 위해 `withCredentials: true`와 서버 CORS 설정 확인
- 소셜 로그인 콜백 URL(로컬/배포) 등록값 확인
- 플레이어 페이지 진입/이동 시 재생, 다음 곡 자동 재생 동작 확인

## 14) Known Issues / 제한사항

- 백엔드(PHP + 세션) 상태에 따라 로그인/재생 일부 기능이 영향을 받을 수 있습니다.
- 로컬 개발 환경은 `http://localhost/backend/api`, 배포 환경은 `https://muteapp.dothome.co.kr/api`를 사용하므로 환경 변수 불일치 시 인증 오류가 발생할 수 있습니다.
- 소셜 로그인은 각 플랫폼 콘솔에 등록된 콜백 URL과 프론트 설정이 정확히 일치해야 정상 동작합니다.
- 브라우저 정책상 사용자 제스처 없이 자동 재생이 차단될 수 있으며(`NotAllowedError`), 이 경우 다음 사용자 입력 이후 재생이 재개됩니다.
