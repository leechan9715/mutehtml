# MUTE HTML 프로젝트 README

팀원이 처음 들어와도 바로 작업할 수 있도록, 현재 프로젝트 구조와 수정 포인트를 쉽게 정리한 문서입니다.

## 1. 프로젝트 한눈에 보기

- 형태: 정적 웹 프로젝트 (HTML + CSS + JavaScript)
- 시작 파일: `index.html`
- 목적: 로그인/회원가입 플로우와 주요 화면 UI 구현

## 2. 실행 방법

1. 프로젝트 루트를 VS Code로 엽니다.
2. `index.html`을 Live Server로 실행합니다.
3. 페이지 이동/스타일이 정상인지 확인합니다.

## 3. 현재 폴더 구조 (실제 파일 기준)

```text
Mute Html 2026-02-18/
├─ index.html
├─ test.html
├─ README.md
├─ assets/
│  ├─ fonts/
│  │  ├─ fonts.css
│  │  └─ pretendard-kr/(woff, woff2)
│  └─ images/
│     ├─ artistselect/
│     ├─ bg/
│     ├─ common/
│     ├─ icon/
│     ├─ mypage/
│     ├─ signup-info/
│     └─ splash_bg/
├─ components/
│  ├─ button.html
│  ├─ datePickerWheel.html
│  ├─ footer.html
│  ├─ header.html
│  ├─ header-2.html
│  ├─ input.html
│  ├─ logo.html
│  └─ profileheader.html
├─ css/
│  ├─ base/
│  │  ├─ reset.css
│  │  └─ variables.css
│  ├─ components/
│  │  ├─ button.css
│  │  ├─ datePickerWheel.css
│  │  ├─ input.css
│  │  ├─ logo.css
│  │  └─ nav.css
│  ├─ layout/
│  │  ├─ footer.css
│  │  ├─ grid.css
│  │  ├─ header.css
│  │  ├─ header-2.css
│  │  └─ logo.css
│  └─ pages/
│     ├─ artistselect.css
│     ├─ index.css
│     ├─ loading.css
│     ├─ mypage.css
│     ├─ signup.css
│     ├─ signup-info.css
│     ├─ ticktselect.css
│     └─ welcome.css
├─ html/
│  └─ page/
│     ├─ artistselect.html
│     ├─ loading.html
│     ├─ mypage.html
│     ├─ signup.html
│     ├─ signup-info.html
│     ├─ ticketselect.html
│     ├─ welcome.html
│     ├─ header-sample-page.html
│     ├─ header-sample-page.css
│     ├─ header-2-sample-page.html
│     └─ header-2-sample-page.css
└─ js/
   ├─ datePickerWheel.js
   └─ logo.js
```

## 4. 페이지 역할

- `index.html`: 로그인/스플래시 시작 페이지
- `html/page/signup.html`: 회원가입 입력
- `html/page/welcome.html`: 환영 화면
- `html/page/signup-info.html`: 성별/생년월일 입력
- `html/page/artistselect.html`: 아티스트 선택
- `html/page/loading.html`: 로딩 화면
- `html/page/mypage.html`: 마이페이지
- `html/page/ticketselect.html`: 이용권 선택 화면
- `html/page/header-sample-page.html`: 헤더 샘플 1 (시간 , footer 있는 샘플)
- `html/page/header-2-sample-page.html`: 헤더 샘플 2 (시간,프로필,footer 있는 샘플 )

## 5. 현재 연결된 이동 흐름

- `index.html` -> `signup.html` (회원가입 버튼)
- `index.html` -> `welcome.html` (로그인 함수)
- `signup.html` -> `welcome.html`
- `welcome.html` -> `signup-info.html`
- `signup-info.html` -> `artistselect.html`
- `artistselect.html` -> `loading.html`

참고: `ticketselect.html`, `mypage.html`, 샘플 페이지들은 현재 메인 플로우에 직접 연결되어 있지 않을 수 있습니다.

## 6. 수정할 때 빠른 가이드

- 화면 구조(태그) 수정: `html/page/*.html`
- 화면 디자인 수정: `css/pages/*.css`
- 공통 레이아웃 수정: `css/layout/*.css`
- 공통 컴포넌트 스타일: `css/components/*.css`
- 컬러/폰트/공통 변수: `css/base/variables.css`, `assets/fonts/fonts.css`
- 동작(애니메이션/휠 피커): `js/logo.js`, `js/datePickerWheel.js`
- 이미지 교체: `assets/images/**`

## 7. 팀 협업 규칙 (권장)

1. 새 페이지를 만들면 `html/page/`와 `css/pages/`를 같이 추가합니다.
2. 페이지 이동 로직(`location.href`)을 함께 업데이트합니다.
3. 공통 색상/간격은 `variables.css`에 먼저 정의하고 재사용합니다.
4. 구조가 바뀌면 README의 "페이지 역할"과 "이동 흐름"을 같이 수정합니다.

## 8. 메모

- 파일명 `ticktselect.css`는 현재 `ticketselect.html`에서 실제로 참조 중인 이름입니다. 이름 변경 시 HTML 링크도 함께 수정해야 합니다.
