## 1) 프로젝트 개요

- 정적 HTML/CSS/JS 기반 프론트엔드 프로젝트입니다.
- 주요 흐름: 로그인/회원가입 -> 정보 입력(생년월일/성별) -> 아티스트 선택 -> 로딩/환영/마이페이지
- 공통 리소스(폰트, 이미지), 페이지별 스타일, 재사용 컴포넌트가 분리되어 있습니다.

## 2) 실행 방법

- 별도 빌드 없이 `index.html`을 브라우저에서 열어 실행합니다.
- 권장: VS Code Live Server 등으로 루트 폴더를 띄워 상대경로 이슈 없이 확인합니다.

## 3) 폴더 구조

```text
MUTE/
├─ index.html                      # 메인(로그인/스플래시)
├─ test.html                       # 테스트/실험용 페이지
├─ assets/
│  ├─ fonts/
│  │  ├─ fonts.css                 # 폰트 선언
│  │  └─ pretendard-kr/
│  │     ├─ woff/
│  │     └─ woff2/
│  └─ images/
│     ├─ artistselect/             # 아티스트 선택 이미지
│     ├─ bg/
│     ├─ common/                   # 공통 로고/배경
│     ├─ icon/                     # 입력/소셜 아이콘
│     ├─ mypage/
│     ├─ signup-info/
│     └─ splash_bg/
├─ components/                     # 재사용 HTML 조각(샘플/스니펫)
│  ├─ button.html
│  ├─ datePickerWheel.html
│  ├─ footer.html
│  ├─ header.html
│  ├─ input.html
│  └─ logo.html
├─ css/
│  ├─ base/
│  │  ├─ reset.css                 # 초기화 스타일
│  │  └─ variables.css             # CSS 변수
│  ├─ components/                  # 컴포넌트 스타일
│  │  ├─ button.css
│  │  ├─ datePickerWheel.css
│  │  ├─ input.css
│  │  ├─ logo.css
│  │  └─ nav.css
│  ├─ layout/                      # 레이아웃 공통
│  │  ├─ footer.css
│  │  ├─ grid.css
│  │  ├─ header.css
│  │  └─ logo.css
│  ├─ pages/                       # 페이지별 스타일
│  │  ├─ artistselect.css
│  │  ├─ index.css
│  │  ├─ loading.css
│  │  ├─ mypage.css
│  │  ├─ signup.css
│  │  ├─ signup-info.css
│  │  └─ welcome.css
│  └─ common.css
├─ html/
│  └─ page/
│     ├─ artistselect.html
│     ├─ loading.html
│     ├─ mypage.html
│     ├─ signup-info.html
│     ├─ signup.html
│     └─ welcome.html
└─ js/
   ├─ datePickerWheel.js           # 생년월일 휠 피커 로직
   └─ logo.js                      # 로고/눈/입 애니메이션
```

## 3 - 1) 폴더 구조 한눈에 보기

```text
MUTE/
├─ index.html                  # 시작 페이지(로그인/스플래시)
├─ test.html                   # 테스트용 페이지
├─ html/page/                  # 실제 페이지 HTML
├─ css/pages/                  # 페이지별 CSS
├─ css/components/             # 재사용 UI CSS
├─ css/layout/                 # 레이아웃 CSS
├─ css/base/                   # reset, 변수(토큰)
├─ js/                         # 동작 스크립트
├─ assets/images/              # 이미지, 아이콘
├─ assets/fonts/               # 폰트
└─ components/                 # 공통 UI 조각 참고용
```

## 4) 페이지 흐름(현재 코드 기준)

- `index.html` -> 회원가입 버튼 -> `html/page/signup.html`
- `index.html` -> (함수 존재) 로그인 -> `html/page/welcome.html`
- `html/page/signup.html` -> 시작하기 버튼 -> `html/page/welcome.html`
- `html/page/welcome.html` -> 시작하기 버튼 -> `html/page/signup-info.html`
- `html/page/signup-info.html` -> 제출 -> `html/page/artistselect.html`
- `html/page/artistselect.html` -> 다음 버튼 -> `html/page/loading.html`

## 5) 작업할 때 어디를 수정하면 되는지

- 페이지 마크업 수정: `html/page/*.html`
- 페이지 디자인 수정: `css/pages/*.css`
- 공통 스타일(컬러, 간격, 토큰): `css/base/variables.css`, `css/common.css`
- 재사용 UI 스타일: `css/components/*.css`, `css/layout/*.css`
- 인터랙션/동작 수정: `js/logo.js`, `js/datePickerWheel.js`
- 이미지/아이콘 교체: `assets/images/**`
- 폰트 교체/추가: `assets/fonts/**`, `assets/fonts/fonts.css`

## 6) 협업 권장 규칙

- 새 페이지 추가 시:
  1. `html/page/`에 HTML 추가
  2. `css/pages/`에 동일 이름 CSS 추가
  3. 관련 이동 경로(`location.href`) 확인
- 공통 스타일은 우선 `variables.css`에 토큰화하고 각 페이지에서 재사용합니다.
- 큰 구조 변경 전에 이 README의 "페이지 흐름" 섹션을 같이 업데이트해 주세요.

## 7) 참고

- `components/` 폴더는 공통 UI 조각 참고용 파일입니다.
- 실제 라우팅/화면 진입점은 현재 `index.html` + `html/page/*.html` 조합입니다.
