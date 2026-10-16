# Ryu Portfolio

순수 HTML, CSS, JavaScript만 사용하여 제작한 반응형 포트폴리오 웹사이트입니다.

React, Vue, Bootstrap, Tailwind CSS 등의 프레임워크나 라이브러리를 사용하지 않고, 웹의 기본 동작인 DOM 조작, 이벤트 처리, 비동기 통신, 상태 변경 흐름을 직접 구현하는 것을 목표로 제작했습니다.

- 배포 주소: https://rhw0213.github.io/codyssey-1_1/
- 저장소: https://github.com/Rhw0213/codyssey-1_1

---

## 1. 프로젝트 소개

이 프로젝트는 개인 포트폴리오 웹사이트입니다.

다음과 같은 영역으로 구성되어 있습니다.

- Header (네비게이션, 다크 모드 버튼)
- Hero
- About
- Skills
- Projects
- Contact
- Footer

주요 기능은 다음과 같습니다.

- 모바일 퍼스트 반응형 레이아웃
- 햄버거 메뉴
- 다크 모드 (선택한 테마 저장, 시스템 테마 반영)
- GitHub API로 저장소 목록 표시 및 언어별 필터
- 부드러운 스크롤, 스크롤 시 헤더 스타일 변경, 맨 위로 이동 버튼
- `IntersectionObserver`를 이용한 스크롤 애니메이션
- 문의 폼 유효성 검사
- 접근성 처리 (ARIA 속성, 움직임 최소화 설정 대응)

---

## 2. 사용 기술

### Frontend

- HTML5
- CSS3
- JavaScript ES6+

### API

- GitHub REST API

### 배포

- GitHub Pages

---

## 3. 프로젝트 폴더 구조

```text
codyssey-1_1
│
├─ index.html
│
├─ css
│   └─ style.css
│
├─ js
│   └─ script.js
│
├─ images
│   └─ profile.jpg
│
└─ README.md
```

---

## 4. 반응형 웹과 햄버거 메뉴

### 4.1 반응형 웹사이트

모바일 퍼스트 방식으로 작성했습니다. 기본 스타일을 모바일 기준으로 작성하고, `min-width` 미디어 쿼리로 큰 화면의 스타일을 추가합니다.

| 구분 | 기준 | 주요 변경 |
| --- | --- | --- |
| 모바일 | 기본 스타일 | 햄버거 버튼 표시, 메뉴 숨김, About 세로 배치 |
| 태블릿 | 768px 이상 | 전체 메뉴 표시, About·Footer 가로 배치 |
| 데스크톱 | 1024px 이상 | 제목·본문 글자 크기, 프로필 이미지 확대 |

---

### 4.2 햄버거 메뉴

모바일 화면에서 햄버거 버튼(☰)을 클릭하면 메뉴가 열리고, 버튼이 닫기 버튼(✕)으로 바뀝니다.

메뉴가 열렸는지는 `state.menuOpen` 상태로 관리하고, `renderMenu()` 함수가 상태에 맞게 화면을 갱신합니다.

```javascript
const renderMenu = () => {
  navMenu.classList.toggle("active", state.menuOpen);

  menuToggle.textContent = state.menuOpen ? "✕" : "☰";

  menuToggle.setAttribute(
    "aria-expanded",
    String(state.menuOpen)
  );

  // aria-label도 "메뉴 열기" / "메뉴 닫기"로 변경
};

menuToggle.addEventListener("click", () => {
  state.menuOpen = !state.menuOpen;
  renderMenu();
});
```

다음 경우에는 메뉴가 자동으로 닫힙니다.

- 메뉴 안의 링크를 클릭했을 때
- 메뉴가 열린 상태에서 화면 너비가 768px 이상이 되었을 때

---

## 5. 다크 모드

다크 모드 버튼을 클릭하면 페이지의 테마가 변경됩니다.

`<html>` 요소의 `data-theme` 속성을 변경하고, CSS 변수 값을 바꾸는 방식으로 구현했습니다.

```css
:root {
  --bg-color: #f8fafc;
  --text-color: #1e293b;
  --primary-color: #2563eb;
}

[data-theme="dark"] {
  --bg-color: #0f172a;
  --text-color: #f1f5f9;
  --primary-color: #60a5fa;
}
```

선택한 테마는 `localStorage`에 저장되므로 페이지를 새로고침해도 유지됩니다.

```javascript
localStorage.setItem("portfolio-theme", state.theme);
```

처음 방문해서 저장된 테마가 없으면 운영체제의 테마 설정(`prefers-color-scheme`)을 따릅니다.

```javascript
theme: savedTheme === "dark" || savedTheme === "light"
  ? savedTheme
  : systemDark ? "dark" : "light",
```

버튼 아이콘은 라이트 모드에서 🌙, 다크 모드에서 ☀️로 표시됩니다.

---

## 6. GitHub API 연동

GitHub API를 이용하여 GitHub 저장소 목록을 불러옵니다.

사용한 API 주소:

```text
https://api.github.com/users/Rhw0213/repos?sort=updated&per_page=100&type=owner
```

- `sort=updated`: 최근에 업데이트한 순서
- `per_page=100`: 최대 100개
- `type=owner`: 본인이 소유한 저장소

GitHub 아이디는 `js/script.js`의 `GITHUB_USERNAME` 상수에서 변경할 수 있습니다.

```javascript
const GITHUB_USERNAME = "Rhw0213";
```

`fetch()`와 `async/await`로 비동기 요청을 처리하고, fork한 저장소는 제외합니다.

```javascript
const response = await fetch(url, {
  headers: {
    Accept: "application/vnd.github+json"
  }
});

const data = await response.json();

// fork가 아닌 본인 프로젝트만 표시
state.projects = data.filter((repo) => !repo.fork);
```

받아온 배열은 `map()`으로 프로젝트 카드 HTML로 변환합니다. 카드에는 저장소 이름, 설명, 언어, 스타 수, 포크 수, GitHub 링크가 표시됩니다.

```javascript
projectList.innerHTML = filteredProjects
  .map((repo) => createProjectCard(repo))
  .join("");
```

외부 API에서 받은 문자열은 `innerHTML`에 넣기 전에 `escapeHTML()` 함수로 `&`, `<`, `>`, `"`, `'` 문자를 변환하여 HTML로 해석되지 않도록 했습니다.

---

### 6.1 언어별 필터

불러온 저장소의 언어 목록으로 필터 버튼을 만듭니다. `Set`으로 중복을 제거하고, 언어 정보가 없는 저장소는 `기타`로 분류합니다.

```javascript
const languages = [
  "All",
  ...new Set(
    state.projects.map((repo) => repo.language || "기타")
  )
];
```

필터 버튼을 클릭하면 `state.selectedLanguage`가 바뀌고, 선택한 언어의 프로젝트만 다시 그립니다. `All` 버튼은 화면에 `전체`로 표시됩니다.

---

## 7. API 상태 처리

GitHub API를 호출할 때 `state.projectStatus`로 상태를 구분하여 UI에 표시합니다.

| 상태 | 화면 표시 |
| --- | --- |
| `loading` | ⏳ 프로젝트 로딩 중... |
| `success` | 언어 필터와 프로젝트 카드 목록 |
| `empty` | 표시할 프로젝트가 없습니다. |
| `error` | 오류 메시지와 `다시 시도` 버튼 |

오류 상황에 따라 다른 메시지를 보여줍니다.

| 상황 | 메시지 |
| --- | --- |
| 403, 429 | GitHub API 요청 제한이 발생했습니다. 잠시 후 다시 시도해 주세요. |
| 404 | GitHub 사용자를 찾을 수 없습니다. 아이디를 확인해 주세요. |
| 그 외 HTTP 오류 | 프로젝트를 불러올 수 없습니다. (HTTP 상태 코드) |
| 응답이 배열이 아님 | GitHub 응답 형식이 올바르지 않습니다. |
| 네트워크 오류 등 | 브라우저의 오류 메시지 (없으면 `프로젝트를 불러올 수 없습니다.`) |

`try/catch/finally`를 사용하여 오류를 처리하고, `finally`에서 항상 `renderProjects()`를 호출해 화면을 갱신합니다.

`다시 시도` 버튼을 누르면 API를 다시 호출합니다.

---

## 8. Contact Form

Contact 영역에서는 다음 정보를 입력할 수 있습니다.

- 이름
- 이메일
- 메시지

`<form>`에 `novalidate`를 지정해 브라우저 기본 검사 대신 JavaScript로 직접 입력값을 검사합니다. 폼 제출 시 `event.preventDefault()`로 기본 제출 동작을 막습니다.

```javascript
contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  // ...
});
```

다음과 같은 유효성 검사를 적용했습니다.

| 검사 | 에러 메시지 |
| --- | --- |
| 빈 값 (이름, 이메일, 메시지) | 필수 입력 항목입니다. |
| 이메일 형식 | 올바른 이메일 형식을 입력해 주세요. |

```javascript
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
```

- 입력할 때마다(`input` 이벤트) 해당 입력창을 바로 검사합니다.
- 잘못된 입력이 있으면 각 입력창 아래에 에러 메시지를 표시하고, `aria-invalid="true"`를 설정합니다.
- 제출 시 오류가 있으면 첫 번째 잘못된 입력창으로 포커스를 이동합니다.
- 모든 입력이 올바르면 확인 메시지를 표시하고 폼을 초기화합니다.

실제 메일 전송 기능은 없으며, 입력값 검사까지만 구현했습니다.

---

## 9. 시맨틱 HTML

페이지의 의미와 역할에 맞게 시맨틱 태그를 사용했습니다.

사용한 주요 태그:

```html
<header>
<nav>
<main>
<section>
<article>
<footer>
```

각 태그의 역할은 다음과 같습니다.

- `header`: 페이지 상단 영역
- `nav`: 네비게이션 메뉴
- `main`: 페이지의 주요 콘텐츠
- `section`: Hero, About, Skills, Projects, Contact 등의 개별 영역
- `article`: 독립적인 기술 카드와 프로젝트 카드
- `footer`: 페이지 하단 정보

시맨틱 태그를 사용하면 코드의 구조를 쉽게 파악할 수 있고 접근성과 유지보수성이 좋아집니다.

---

## 10. Flexbox와 Grid

### Flexbox

네비게이션처럼 한 방향으로 요소를 정렬하는 영역에 사용했습니다. (`nav`, Hero 버튼, About, 프로젝트 필터, Footer)

```css
nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
```

### Grid

Skills와 Projects처럼 여러 개의 카드가 행과 열 형태로 배치되는 영역에 사용했습니다.

```css
.project-grid {
  display: grid;
  grid-template-columns:
    repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  gap: 24px;
}
```

`min(100%, 280px)`을 사용하여 화면이 카드 최소 너비보다 좁아도 카드가 화면 밖으로 넘치지 않도록 했습니다.

Flexbox는 주로 1차원 배치에 사용하고, Grid는 2차원 배치에 적합합니다.

---

## 11. JavaScript DOM 조작

`querySelector()`를 이용하여 HTML 요소를 선택합니다.

```javascript
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");
```

선택한 요소에 `addEventListener()`를 사용하여 이벤트를 연결합니다.

```javascript
themeToggle.addEventListener("click", () => {
  state.theme = state.theme === "dark" ? "light" : "dark";
  localStorage.setItem("portfolio-theme", state.theme);
  renderTheme();
});
```

DOM 조작에는 다음 기능을 사용했습니다.

- `querySelector`
- `querySelectorAll`
- `addEventListener`
- `textContent`
- `innerHTML`
- `classList.add`
- `classList.remove`
- `classList.toggle`
- `setAttribute`
- `dataset`

---

## 12. ES6+ 문법

프로젝트에서는 ES6 이상의 JavaScript 문법을 사용했습니다.

### 화살표 함수와 const

```javascript
const renderTheme = () => {
  document.documentElement.dataset.theme = state.theme;
};
```

### 템플릿 리터럴

프로젝트 카드 HTML을 만들 때 사용합니다.

```javascript
return `
  <article class="project-card">
    <h3>${escapeHTML(name)}</h3>
  </article>
`;
```

### 구조분해 할당

```javascript
const {
  name,
  description,
  html_url,
  language,
  stargazers_count,
  forks_count
} = repo;
```

### 전개 연산자와 Set

```javascript
const languages = [
  "All",
  ...new Set(state.projects.map((repo) => repo.language || "기타"))
];
```

### map

GitHub 데이터를 HTML 카드 형태로 변환할 때 사용합니다.

```javascript
filteredProjects.map((repo) => createProjectCard(repo));
```

### filter

fork한 저장소를 제외하거나, 선택한 언어의 프로젝트만 고를 때 사용합니다.

```javascript
const filteredProjects = projects.filter((repo) => {
  return state.selectedLanguage === "All" ||
    (repo.language || "기타") === state.selectedLanguage;
});
```

### async/await

GitHub API를 호출하는 `fetchProjects()` 함수에서 사용합니다.

---

## 13. 이벤트 → 상태 → DOM 업데이트

이 프로젝트에서 가장 중요하게 학습한 부분입니다.

화면에 필요한 값을 하나의 `state` 객체에 모아두고, 이벤트가 발생하면 상태를 바꾼 뒤 `render` 함수로 화면을 갱신합니다.

```javascript
const state = {
  theme: "light",          // 실제 코드에서는 저장값 또는 시스템 설정으로 결정
  menuOpen: false,
  projects: [],
  projectStatus: "idle",
  projectError: "",
  selectedLanguage: "All",
  formErrors: { name: "", email: "", message: "" }
};
```

예를 들어 햄버거 메뉴는 다음 흐름으로 동작합니다.

```text
사용자가 햄버거 버튼 클릭
↓
click 이벤트 발생
↓
state.menuOpen 변경
↓
renderMenu() 실행
↓
active 클래스, 아이콘, aria-expanded 변경
↓
메뉴 표시/숨김
```

다크 모드 또한 같은 방식입니다.

```text
다크 모드 버튼 클릭
↓
state.theme 변경 및 localStorage 저장
↓
renderTheme() 실행
↓
data-theme 변경
↓
CSS 변수 변경
↓
화면 색상 변경
```

GitHub API도 다음 흐름으로 처리합니다.

```text
fetchProjects() 호출
↓
state.projectStatus = "loading"
↓
데이터 응답
↓
"success" / "empty" / "error" 상태
↓
renderProjects()로 Projects DOM 업데이트
```

이러한 구조는 이후 React에서 사용하는 상태 기반 렌더링의 기초가 됩니다.

---

## 14. 스크롤 효과

스크롤 이벤트를 활용하여 다음 기능을 구현했습니다.

- 60px 이상 스크롤하면 헤더에 `scrolled` 클래스를 추가하여 배경과 그림자 변경
- 300px 이상 스크롤하면 맨 위로 이동 버튼(↑) 표시
- 맨 위로 이동 버튼을 클릭하면 페이지 맨 위로 부드럽게 이동

```text
헤더 스타일 변경: 60px 이상
맨 위로 버튼 표시: 300px 이상
```

스크롤 이벤트는 `{ passive: true }` 옵션으로 등록했습니다.

### 부드러운 스크롤

메뉴나 Hero 버튼처럼 `#`으로 시작하는 링크를 클릭하면 해당 영역으로 부드럽게 이동합니다.

```javascript
target.scrollIntoView({
  behavior: reduceMotion.matches ? "auto" : "smooth",
  block: "start"
});

history.replaceState(null, "", targetId);
```

CSS에도 `scroll-behavior: smooth`를 지정했고, 상단에 고정된 헤더에 섹션 제목이 가려지지 않도록 `scroll-padding-top`과 `scroll-margin-top`으로 여백을 두었습니다.

---

## 15. 스크롤 애니메이션

`IntersectionObserver`를 사용하여 요소가 화면에 나타날 때 애니메이션이 실행되도록 구현했습니다.

대상 요소: 섹션 제목, 섹션 부제목, About 내용, Skill 카드, Contact 폼

```javascript
const observer = new IntersectionObserver(callback, {
  threshold: 0.2
});
```

- JavaScript가 대상 요소에 `reveal` 클래스를 추가합니다. (투명하고 30px 아래에 있는 상태)
- 요소가 약 20% 이상 화면에 나타나면 `visible` 클래스를 추가하여 제자리로 나타나게 합니다.
- 한 번 나타난 요소는 `unobserve()`로 관찰을 중단합니다.
- `IntersectionObserver`를 지원하지 않는 브라우저이거나 움직임 최소화 설정이 켜져 있으면 처음부터 모든 요소를 표시합니다.

---

## 16. 접근성

- 메뉴 버튼에 `aria-label`, `aria-controls`, `aria-expanded`를 사용했습니다.
- 다크 모드 버튼과 필터 버튼에 `aria-pressed`로 선택 상태를 표시합니다.
- 프로젝트 상태 메시지와 폼 결과 메시지에 `role="status"`, `aria-live="polite"`를 지정하여 스크린 리더가 변경 내용을 읽을 수 있게 했습니다.
- 폼 입력창은 `label`과 연결하고, `aria-describedby`로 에러 메시지와 연결했습니다.
- 프로필 이미지에 대체 텍스트(`alt`)를 작성했습니다.
- 새 탭으로 열리는 외부 링크에는 `rel="noopener noreferrer"`를 지정했습니다.

### 움직임 최소화 설정 (`prefers-reduced-motion`)

운영체제에서 움직임 최소화 설정이 켜져 있으면 다음과 같이 동작합니다.

- 부드러운 스크롤 대신 바로 이동
- 애니메이션과 전환 효과 시간을 최소화
- 스크롤 애니메이션 없이 모든 요소를 바로 표시

```css
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
```

> 참고: Windows에서 **설정 → 접근성 → 시각 효과 → 애니메이션 효과**가 꺼져 있으면 브라우저가 움직임 최소화 설정으로 인식하므로, 메뉴를 클릭해도 부드럽게 이동하지 않습니다. 의도된 동작이며, 부드러운 스크롤을 확인하려면 이 설정을 켜고 페이지를 새로고침하면 됩니다.

---

## 17. 실행 방법

1. 저장소를 클론합니다.

```bash
git clone https://github.com/Rhw0213/codyssey-1_1.git
```

2. VS Code에서 프로젝트 폴더를 엽니다.

3. VS Code의 Live Server를 사용하여 실행합니다.

```text
index.html
→ 우클릭
→ Open with Live Server
```

다른 GitHub 계정의 저장소를 표시하려면 `js/script.js`의 `GITHUB_USERNAME` 값을 변경합니다.

> GitHub API는 로그인하지 않은 요청을 IP당 시간당 60회로 제한합니다. 제한을 초과하면 Projects 영역에 요청 제한 메시지가 표시됩니다.

---

## 18. 배포 및 저장소

- 배포 주소 (GitHub Pages): https://rhw0213.github.io/codyssey-1_1/
- GitHub Repository: https://github.com/Rhw0213/codyssey-1_1
