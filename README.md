# MUTE-vue

Vue 3 기반 음악 서비스 프론트엔드 프로젝트입니다.  
온보딩(회원가입/로그인), 소셜 로그인, 메인 화면, 마이페이지 UI를 포함합니다.

## 1) 프로젝트 개요

- 프로젝트명: `MUTE`
- 프레임워크: `Vue 3` + `Vue CLI 5`
- 상태관리: `Pinia` (일부 코드에서 `Vuex` 의존성도 포함)
- 라우팅: `vue-router`
- HTTP 통신: `axios`
- 주요 화면:
- 온보딩 플로우 (`/splash`, `/signup`, `/signup-info`, `/welcome`, `/artist-select`)
- 메인 (`/main`)
- 마이페이지 (`/mypage`)

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

현재 프로젝트에서 사용하는 주요 변수:

```env
VUE_APP_OAUTH_CLIENT=
VUE_APP_NAVER_CLIENT_ID=
VUE_APP_LOCAL_NAVER_CALLBACK_URL=
VUE_APP_DOTHOME_NAVER_CALLBACK_URL=
VUE_APP_KAKAO_JS_KEY=
```

참고:

- `.env`에 DB 계정/비밀번호 및 OAuth 민감 정보가 포함되어 있으므로 Git에 커밋하지 않는 것을 권장합니다.
- 배포 환경에서는 `.env.production` 등 환경별 파일로 분리해 관리하세요.

## 5) 라우팅 구조

- `/`
- `/splash` (로그인 화면)
- `/signup` (회원가입)
- `/signup-info` (성별/생년월일)
- `/welcome`
- `/artist-select`
- `/main` (메인 레이아웃)
- `/mypage`

라우터 정의 파일: `src/router/index.js`

## 6) 인증/로그인 구조

- 일반 로그인/회원가입
- `src/store/auth.js`의 `login`, `register`, `checkAuth`, `logout` 액션 사용
- 백엔드 API 호출:
- `POST /auth/login.php`
- `POST /auth/register.php`
- `GET /auth/check_login.php`
- `POST /auth/logout.php`

- 소셜 로그인
- Google: `vue3-google-login` 사용
- Naver: 네이버 SDK (`naveridlogin_js_sdk_2.0.0.js`) 사용
- Kakao: 카카오 SDK (`kakao.js`) 사용

API 클라이언트: `src/api/index.js`

- Base URL: `https://muteapp.dothome.co.kr/api`
- `withCredentials: true`

## 7) 개발 서버 프록시

`vue.config.js`에서 아래 프록시를 사용합니다.

- `/api` -> `https://muteapp.dothome.co.kr`
- `/oauth2.0` -> `https://nid.naver.com`

## 8) DB 스키마(샘플)

`sql.sql` 기준 사용자 테이블 예시:

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nickname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 9) 디렉터리 개요

```text
src/
  api/                # API 모듈
  assets/             # 이미지, 폰트, 전역/페이지 스타일
  components/         # 공통 UI 및 레이아웃 컴포넌트
  router/             # 라우터 설정
  store/              # Pinia 스토어
  views/
    OnboardingFlow/   # 스플래시/회원가입/온보딩
    main/             # 메인 섹션 화면
    mypage/           # 마이페이지
```
