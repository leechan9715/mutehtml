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

| 날짜       | 유형     | 주요 내용                                                                   |
| ---------- | -------- | --------------------------------------------------------------------------- |
| 2026-03-08 | fix      | 배포 후 PHP 연결 문제 수정, API 요청 경로 수정, `.env` 환경변수 전환        |
| 2026-03-08 | fix      | 플레이어 배포 환경 재생 오류 수정, 페이지 이동/다음 곡 자동 재생 보완       |
| 2026-03-07 | feat     | 검색결과 -> 플레이어 이동 후 재생 기능 추가                                 |
| 2026-03-07 | feat/fix | 메인 쇼츠 기능 구현 및 인기 차트 관련 수정                                  |
| 2026-03-06 | refactor | 라우터/레이아웃 경로 수정, 소셜 로그인 관련 파일 정리                       |
| 2026-03-05 | feat     | 플레이어/라이브러리/플레이리스트/이용권 선택/아티스트 소개 페이지 추가      |
| 2026-03-04 | feat/fix | 소셜 로그인 추가 및 로그인/회원가입/마이페이지 기능 보완                    |
| 2026-03-03 | feat     | 공용/재사용 컴포넌트 확장 (`AppTopBar`, `MainListItem`, `ChartListItem` 등) |
| 2026-03-02 | init     | Vue 프로젝트 기본 골격 구성                                                 |

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
